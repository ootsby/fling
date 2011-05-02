#rem
'/*
 '* Copyright (c) 2011, Damian Sinclair
 '* Ported from the physaxe library - Copyright (c) 2008, Nicolas Cannasse
 '*
 '* All rights reserved.
 '* Redistribution and use in source and binary forms, with or without
 '* modification, are permitted provided that the following conditions are met:
 '*
 '*   - Redistributions of source code must retain the above copyright
 '*     notice, this list of conditions and the following disclaimer.
 '*   - Redistributions in binary form must reproduce the above copyright
 '*     notice, this list of conditions and the following disclaimer in the
 '*     documentation and/or other materials provided with the distribution.
 '*
 '* THIS SOFTWARE IS PROVIDED BY THE FLING PROJECT CONTRIBUTORS "AS IS" AND ANY
 '* EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 '* WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 '* DISCLAIMED. IN NO EVENT SHALL THE FLING PROJECT CONTRIBUTORS BE LIABLE FOR
 '* ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 '* DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 '* SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 '* CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 '* LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 '* OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH
 '* DAMAGE.
 '*/
#end

Import fling.allfling
Import fling.haxetypes.haxetypes
Import fling.joint.joint
Import fling.col.allcol

Class World Extends BroadCallback 

	Field stamp : Int
	Field bodies :  HaxeFastList< Body > 
	Field joints :  HaxeFastList< Joint > 
	Field arbiters :  HaxeFastList< Arbiter > 
	Field staticBody : Body
	Field allocator : Allocator
	Field broadphase : BroadPhase
	Field collision : Collision
	Field timer : Timer
	Field box : AABB
	'// config
	Field gravity : Vector
	Field boundsCheck : Int
	Field useIslands : Bool
	Field debug : Bool
	Field testedCollisions : Int
	Field activeCollisions : Int
	Field sleepEpsilon : Float
	Field islands :  HaxeFastList< Island > 
	Field properties : IntMap<Properties>
	Field waitingBodies :  HaxeFastList< Body > 

	Method New( worldBoundary:AABB, broadphase:BroadPhase ) 
		bodies = New  HaxeFastList< Body > ()
		joints = New  HaxeFastList< Joint > ()
		arbiters = New  HaxeFastList< Arbiter > ()
		properties = New IntMap<Properties>()
		gravity = New Vector(0,0)
		stamp = 0
		debug = False
		useIslands = True
		sleepEpsilon = Constants.DEFAULT_SLEEP_EPSILON
		boundsCheck = Constants.WORLD_BOUNDS_FREQ
		allocator = New Allocator()
		collision = New Collision()
		staticBody = New Body(0,0)
		staticBody.island = New Island(Self)
		staticBody.UpdatePhysics()
		box = worldBoundary
		Self.broadphase = broadphase
		broadphase.Init(box,BroadCallback(Self),staticBody)
		timer = New Timer()
		islands = New  HaxeFastList< Island > ()
		waitingBodies = New  HaxeFastList< Body > ()
	End 
	 
	Method SetBroadPhase( bf : BroadPhase ) 
		bf.Init(box,BroadCallback(Self),staticBody)

		For Local b := Eachin bodies 
			For Local s := Eachin b.shapes 
				broadphase.RemoveShape(s)
				bf.AddShape(s)
			End 
		End 

		For Local s := Eachin staticBody.shapes 
			broadphase.RemoveShape(s)
			bf.AddShape(s)
		End 

		broadphase = bf
	End 

	Method BuildIslands() 
		Local stack  := New HaxeFastList< Body > ()

		For Local b := Eachin waitingBodies 
			If( Not( b.island = null ) Or b.isStatic ) 
			   Continue
			End 

			Local i  := allocator.AllocIsland(Self)
			islands.Add(i)
			stack.Add(b)
			b.island = i

			While( true ) 
				Local b  := stack.Pop()

				If( b = null ) 
				   Exit
				End 

				i.bodies.Add(b)

				For Local a := Eachin b.GetArbiters() 
					If( Not( a.island = null ) ) 
					   Continue
					End 

					i.AddArbiter(a)
					a.island = i
					Local b1  := a.s1.body

					If( b1.island = null And Not(b1.isStatic) ) 
						b1.island = i
						stack.Add(b1)
					End 

					Local b2  := a.s2.body

					If( b2.island = null And Not(b2.isStatic) ) 
						b2.island = i
						stack.Add(b2)
					End 
				End 
			End 
		End 

		waitingBodies = New  HaxeFastList< Body > ()
	End 

	Method Update( dt : Float, iterations : Int ) 
		If( dt < Constants.EPSILON ) 
		   dt = 0
		End 
	
		timer.Start("all")
		'// update properties
		Local invDt  :=  1 / dt

		If(  dt = 0  ) 
		    invDt = 0 
		End 

		For Local p := Eachin properties.Values() 
			p.lfdt = Pow(p.linearFriction,dt)
			p.afdt = Pow(p.angularFriction,dt)
		End 

		'// build islands
		timer.Start("island")

		If( useIslands )
			BuildIslands()
		Else 
			Local i  := allocator.AllocIsland(Self)
			i.bodies = bodies
			i.ReplaceArbiters(arbiters)
			i.joints = joints
			sleepEpsilon = 0
			 '// disable sleeping
			islands = New  HaxeFastList< Island > ()
			islands.Add(i)
		End 

		If( debug ) 
		   CheckDatas()
		End 

		timer.Stop()
		'// solve physics
		timer.Start("solve")

		For Local i := Eachin islands 
			If( Not(i.sleeping) ) 
			   i.Solve(dt,invDt,iterations)
			End 
        End 

		timer.Stop()

		'// cleanup old living arbiters
		For Local a := Eachin arbiters 
			If( stamp - a.stamp > 3 ) 
				allocator.FreeAllContacts(a.contacts)
				Local b1  := a.s1.body
				Local b2  := a.s2.body
				b1.RemoveArbiter(a)
				b2.RemoveArbiter(a)
				arbiters.Remove(a)
				allocator.FreeArbiter(a)
				DestroyIsland(b1.island)
				DestroyIsland(b2.island)
			End 
        End

		'// collide
		timer.Start("col")
		broadphase.Commit()
		testedCollisions = 0
		activeCollisions = 0

		If( debug And Not(broadphase.Validate()) ) 
		   Print "INVALID BF DATAS"
		End 

		broadphase.Collide()
		timer.Stop()
		'// cleanup
		stamp += 1

		If( boundsCheck > 0 And stamp Mod boundsCheck = 0 ) 
			Local tmp  := New  HaxeFastList<  Body > ()
			For Local b := Eachin bodies 
				tmp.Add(b)
            End 

			For Local s := Eachin broadphase.Pick(box) 
				tmp.Remove(s.body)
            End 

			For Local b := Eachin tmp 
				If( RemoveBody(b) ) 
				   b.OnDestroy()
				End 
            End 
		End 

		timer.Stop()
	End 

	Method DestroyIsland( i : Island ) 
		If( i = null Or Not(useIslands) ) 
		  Return
		End 

		If( Not(islands.Remove(i)) ) 
		  Return
		End 

		For Local b := Eachin i.bodies 
			b.island = null
			waitingBodies.Add(b)
		End 

		i.ReleaseArbiters()

		For Local j := Eachin i.joints 
			j.island = null
        End 

		allocator.FreeIsland(i)
	End 

	Method OnCollide :Bool( s1 : Shape, s2 : Shape ) 
		Local b1  := s1.body
		Local b2  := s2.body
		testedCollisions += 1

		If( b1 = b2 Or (s1.groups & s2.groups) = 0 ) 
		  Return false
		End 

		'// prepare for testShapes
		If( s1.type > s2.type ) 
			Local tmp  := s1
			s1 = s2
			s2 = tmp
		End 

		Local pairFound  := true
		Local a  : Arbiter = null

		For Local arb := Eachin b1.GetArbiters() 
			If( (arb.s1 = s1 And arb.s2 = s2) Or (arb.s1 = s2 And arb.s2 = s1) ) 
				a = arb
				Exit
			End 
        End 

		If( a = null ) 
			a = allocator.AllocArbiter()
			a.Assign(s1,s2)
			pairFound = false
		Else If( a.sleeping ) 
			a.stamp = stamp
		Return true
		Else If( a.stamp = stamp ) 
		    '// this contact has already been processed
		Return true
		End 

		a.sleeping = false
		activeCollisions += 1
		Local col : Bool = collision.TestShapes(s1,s2,a)

		If( col ) 
			a.stamp = stamp
			If( pairFound ) 
				'// in case it's been flipped
				a.s1 = s1
				a.s2 = s2
			Else  
				arbiters.Add(a)
				Local i1  := b1.island

				If( Not( i1 = b2.island ) ) 
					DestroyIsland(i1)
					DestroyIsland(b2.island)
				Else  If( i1 ) 'Not( i1 = null ) ) 
					i1.AddArbiter(a)
					a.island = i1
				End 

				s2.body.AddArbiter(a)
				s1.body.AddArbiter(a)
			End

		Else If( Not(pairFound) ) 
		    allocator.FreeArbiter(a)
		End 
		
		Return(col)
	End 
	
	Method AddStaticShape :  Shape(s:Shape) 
		staticBody.AddShape(s)
		s.Update()
		broadphase.AddShape(s)
		Return s
	End 
	
	Method RemoveStaticShape(s :Shape) 
		staticBody.RemoveShape(s)
		broadphase.RemoveShape(s)
	End 
	
	Method AddBody(b:Body) 
		bodies.Add(b)
		waitingBodies.Add(b)
		b.properties.count += 1
		b.motion = sleepEpsilon * Constants.WAKEUP_FACTOR
		properties.Set(b.properties.id,b.properties)

		If( b.isStatic ) 
			b.mass = Constants.POSITIVE_INFINITY
			b.invMass = 0
			b.inertia = Constants.POSITIVE_INFINITY
			b.invInertia = 0

			For Local s := Eachin b.shapes
			   s.Update()
			End

		Else  
			b.UpdatePhysics()
		End 

		For Local s := Eachin b.shapes 
			broadphase.AddShape(s)
        End 
	End 

	Method RemoveBody : Bool(b:Body) 
		If( Not(bodies.Remove(b)) ) 
		  Return false
		End 

		b.properties.count -= 1

		If( b.properties.count = 0 ) 
		   properties.Remove(b.properties.id)
		End 

		For Local s := Eachin b.shapes 
			broadphase.RemoveShape(s)
        End 

		DestroyIsland(b.island)
		waitingBodies.Remove(b)

		'// remove arbiters for the other bodies
		For Local a := Eachin b.GetArbiters() 
			Local b1  := a.s1.body

			If( b1 = b ) 
                a.s2.body.RemoveArbiter(a)
            Else  
                b1.RemoveArbiter(a)
            End 
		End 

		Return true
	End 

	Method Activate( b : Body ) 
		Local i  := b.island
		b.motion = sleepEpsilon * Constants.WAKEUP_FACTOR
	
		If( Not( i = null ) And i.sleeping ) 
			i.sleeping = false

			For Local a := Eachin i.arbiters
			   a.sleeping = false
			End
		End 
	End 

	Method AddJoint(j:Joint) 
		joints.Add(j)
	End 

	Method RemoveJoint(j:Joint) 
		joints.Remove(j)
		DestroyIsland(j.b1.island)
		DestroyIsland(j.b2.island)
	End 

	Method Sync( b : Body ) 
		For Local s := Eachin b.shapes 
			s.Update()
			broadphase.SyncShape(s)
		End 
	End 

	Method CheckBody( b : Body, i : Island ) 
		If( Not( b.island = i ) ) 
		   Print "ASSERT"
		End 

		For Local a := Eachin b.GetArbiters() 
			If( Not( a.island = i ) ) 
			   Print "ASSERT"
			End 

			If( Not( a.s1.body.island = i ) And Not(a.s1.body.isStatic) ) 
			   Print "ASSERT"
			End 

			If( Not( a.s2.body.island = i ) And Not(a.s2.body.isStatic) ) 
			   Print "ASSERT"
			End 
		End 
	End 

	Method CheckDatas() 
		For Local b := Eachin waitingBodies 
			CheckBody(b,null)
        End 

		For Local i := Eachin islands 
			For Local b := Eachin i.bodies 
				CheckBody(b,i)
            End 
        End 
	End 
End 

