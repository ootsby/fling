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
import haxetypes.haxetypes
import fling.joint.joint

class Island 
	Global ID  := 0
	Field id : Int
	Field bodies :  HaxeFastList< Body > 
	Field joints :  HaxeFastList< Joint > 
	Field sleeping : Bool
	Field energy : Float
	Field world : World
	Field allocNext : Island
	
	Private
	Field arbiters :  HaxeFastList< Arbiter > 
	 
	Public
	
	Method AddArbiter( a : Arbiter )
		arbiters.Add(a)
	End 
	Method RemoveArbiter( a : Arbiter )
		arbiters.Remove(a)
	End 
	Method ReplaceArbiters( arbiters : HaxeFastList< Arbiter >)
		Self.arbiters = arbiters
	End
	Method ReleaseArbiters()
		For Local a := Eachin arbiters 

			a.sleeping = false
			a.island = null
		End 
	End
	Method ClearArbiters()
		arbiters.Clear()
	End
	
	Method New(w:World) 
		ID += 1
		id = ID
		world = w
		sleeping = false
		bodies = New  HaxeFastList< Body > ()
		joints = New  HaxeFastList< Joint > ()
		arbiters = New  HaxeFastList< Arbiter > ()
	End 

	Method solve( dt : Float, invDt : Float, iterations : Int ) 
		'// update bodies
		Local g  := world.gravity
		For Local b := Eachin bodies 

			Local v  := b.v
			Local p  := b.properties
			v.x = v.x * p.lfdt + (g.x + b.f.x * b.invMass) * dt
			v.y = v.y * p.lfdt + (g.y + b.f.y * b.invMass) * dt
			b.w = b.w * p.afdt + b.t * b.invInertia * dt
		End 
		'// preUpdate arbiters and joints
		For Local a := Eachin arbiters
		   a.preStep(dt)
		End
		For Local joint := Eachin joints
		   joint.preStep(invDt)
		End
		'// solve velocity constraints
		For Local i := 0 Until iterations  

			For Local a := Eachin arbiters
			   a.applyImpulse()
			End
			For Local j := Eachin joints
			   j.applyImpulse()
			End
		End 
		'// update bodies position
		Local bf : BroadPhase = world.broadphase
		Local e : Float = 0.0
		Local n : Int = 0
		For Local b := Eachin bodies 

			Local motion : Float = b.v.x * b.v.x + b.v.y * b.v.y + b.w * b.w * Constants.ANGULAR_TO_LINEAR
			If( motion > b.properties.maxMotion ) 

				Local k : Float = Sqrt(b.properties.maxMotion / motion)
				b.v.x *= k
				b.v.y *= k
				b.w *= k
				motion *= k * k
			End 

			b.x += b.v.x * dt + b.v_bias.x
			b.y += b.v.y * dt + b.v_bias.y
			b.a += b.w * dt + b.w_bias
			b.rcos = haxetypes.Math.Cos(b.a)
			b.rsin = haxetypes.Math.Sin(b.a)
			b.motion = b.motion * Constants.SLEEP_BIAS + (1 - Constants.SLEEP_BIAS) * motion
			b.f.x = 0
            b.f.y = 0
            b.t = 0
			b.v_bias.x = 0
            b.v_bias.y = 0
            b.w_bias = 0
			e += b.motion
			n += 1
			For Local s := Eachin b.shapes 

				s.update()
				bf.syncShape(s)
			End 
		End 

		energy = e / Sqrt(n)
		If( energy < world.sleepEpsilon ) 

			For Local b := Eachin bodies 

				b.v.x = 0
				b.v.y = 0
				b.w = 0
			End 

			For Local a := Eachin arbiters
			   a.sleeping = true
			End
			sleeping = true
		End 
	End 
End 
