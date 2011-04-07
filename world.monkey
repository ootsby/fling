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

import fling.allfling
import fling.haxetypes.haxetypes
import fling.joint.joint
import fling.col.allcol

class World Extends BroadCallback 

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
		staticBody.updatePhysics()
		box = worldBoundary
		Self.broadphase = broadphase
		broadphase.init(box,BroadCallback(Self),staticBody)
		timer = New Timer()
		islands = New  HaxeFastList< Island > ()
		waitingBodies = New  HaxeFastList< Body > ()
	End 
	 
	Method setBroadPhase( bf : BroadPhase ) 
		bf.init(box,BroadCallback(Self),staticBody)

		For Local b := Eachin bodies 
			For Local s := Eachin b.shapes 
				broadphase.removeShape(s)
				bf.addShape(s)
			End 
		End 

		For Local s := Eachin staticBody.shapes 
			broadphase.removeShape(s)
			bf.addShape(s)
		End 

		broadphase = bf
	End 

	Method buildIslands() 
		Local stack  := New  HaxeFastList< Body > ()

		For Local b := Eachin waitingBodies 
			If( Not( b.island = null ) Or b.isStatic ) 
			   continue
			End 

			Local i  := allocator.allocIsland(Self)
			islands.Add(i)
			stack.Add(b)
			b.island = i

			while( true ) 
				Local b  := stack.Pop()

				If( b = null ) 
				   Exit
				End 

				i.bodies.Add(b)

				For Local a := Eachin b.GetArbiters() 
					If( Not( a.island = null ) ) 
					   continue
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
	
		timer.start("all")
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
		timer.start("island")

		If( useIslands )
			buildIslands()
		else 
			Local i  := allocator.allocIsland(Self)
			i.bodies = bodies
			i.ReplaceArbiters(arbiters)
			i.joints = joints
			sleepEpsilon = 0
			 '// disable sleeping
			islands = New  HaxeFastList< Island > ()
			islands.Add(i)
		End 

		If( debug ) 
		   checkDatas()
		End 

		timer.stop()
		'// solve physics
		timer.start("solve")

		For Local i := Eachin islands 
			If( Not(i.sleeping) ) 
			   i.solve(dt,invDt,iterations)
			End 
        End 

		timer.stop()

		'// cleanup old living arbiters
		For Local a := Eachin arbiters 
			If( stamp - a.stamp > 3 ) 
				allocator.freeAllContacts(a.contacts)
				Local b1  := a.s1.body
				Local b2  := a.s2.body
				b1.RemoveArbiter(a)
				b2.RemoveArbiter(a)
				arbiters.Remove(a)
				allocator.freeArbiter(a)
				destroyIsland(b1.island)
				destroyIsland(b2.island)
			End 
        End

		'// collide
		timer.start("col")
		broadphase.commit()
		testedCollisions = 0
		activeCollisions = 0

		If( debug And Not(broadphase.validate()) ) 
		   Print "INVALID BF DATAS"
		End 

		broadphase.collide()
		timer.stop()
		'// cleanup
		stamp += 1

		If( boundsCheck > 0 And stamp Mod boundsCheck = 0 ) 
			Local tmp  := New  HaxeFastList<  Body > ()
			For Local b := Eachin bodies 
				tmp.Add(b)
            End 

			For Local s := Eachin broadphase.pick(box) 
				tmp.Remove(s.body)
            End 

			For Local b := Eachin tmp 
				If( removeBody(b) ) 
				   b.onDestroy()
				End 
            End 
		End 

		timer.stop()
	End 

	Method destroyIsland( i : Island ) 
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

		allocator.freeIsland(i)
	End 

	Method onCollide :Bool( s1 : Shape, s2 : Shape ) 
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
			a = allocator.allocArbiter()
			a.assign(s1,s2)
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
		Local col : Bool = collision.testShapes(s1,s2,a)

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
					destroyIsland(i1)
					destroyIsland(b2.island)
				Else  If( i1 ) 'Not( i1 = null ) ) 
					i1.AddArbiter(a)
					a.island = i1
				End 

				s2.body.AddArbiter(a)
				s1.body.AddArbiter(a)
			End 
		Else If( Not(pairFound) ) 
		    allocator.freeArbiter(a)
		End 
		
		Return(col)
	End 
	
	Method addStaticShape :  Shape(s:Shape) 
		staticBody.addShape(s)
		s.update()
		broadphase.addShape(s)
	Return s
	End 
	
	Method removeStaticShape(s :Shape) 
		staticBody.removeShape(s)
		broadphase.removeShape(s)
	End 
	
	Method addBody(b:Body) 
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
			   s.update()
			End
		Else  
			b.updatePhysics()
		End 

		For Local s := Eachin b.shapes 
			broadphase.addShape(s)
        End 
	End 

	Method removeBody : Bool(b:Body) 
		If( Not(bodies.Remove(b)) ) 
		  Return false
		End 

		b.properties.count -= 1

		If( b.properties.count = 0 ) 
		   properties.Remove(b.properties.id)
		End 

		For Local s := Eachin b.shapes 
			broadphase.removeShape(s)
        End 

		destroyIsland(b.island)
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

	Method activate( b : Body ) 
		Local i  := b.island
		b.motion = sleepEpsilon * Constants.WAKEUP_FACTOR
	
		If( Not( i = null ) And i.sleeping ) 
			i.sleeping = false

			For Local a := Eachin i.arbiters
			   a.sleeping = false
			End
		End 
	End 

	Method addJoint(j:Joint) 
		joints.Add(j)
	End 

	Method removeJoint(j:Joint) 
		joints.Remove(j)
		destroyIsland(j.b1.island)
		destroyIsland(j.b2.island)
	End 

	Method sync( b : Body ) 
		For Local s := Eachin b.shapes 
			s.update()
			broadphase.syncShape(s)
		End 
	End 

	Method checkBody( b : Body, i : Island ) 
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

	Method checkDatas() 
		For Local b := Eachin waitingBodies 
			checkBody(b,null)
        End 

		For Local i := Eachin islands 
			For Local b := Eachin i.bodies 
				checkBody(b,i)
            End 
        End 
	End 
End 

