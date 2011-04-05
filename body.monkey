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

class Body 
	Global ID  := 0
	 Field id : Int
	 Field mass : Float
	 Field invMass : Float
	 Field inertia : Float
	 Field invInertia : Float
	 Field x:Float
	 			'// position
	 Field y:Float
	 Field v:Vector
	 		'// velocity
	 Field f:Vector
	 		'// force
	 Field v_bias:Vector
	 	'// used internally for penetration/joint correction
	 Field a:Float
	 			'// angle
	 Field w:Float
	 			'// angular velocity
	 Field t:Float
	 			'// torque
	 Field w_bias:Float
	 	'// used internally for penetration/joint correction
	 Field rcos:Float
	 		'// current rotation
	 Field rsin:Float
	 Field motion:Float
	 Field isStatic:Bool
	 Field island : Island
	 Field shapes :  HaxeFastList< Shape > 
	 Field properties : Properties
	
	Private
	Field arbiters :  HaxeFastList< Arbiter > 
	Public 
	
	Method GetArbiters: HaxeFastList<Arbiter>( )
		Return arbiters
	End 
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

	
	 Method New( x : Float, y : Float,  props : Properties = Null  ) 

		ID += 1
		id = ID
		if(  props = null  ) 

		    properties =Constants.DEFAULT_PROPERTIES 
		Else  

		    properties = props
		End 

		Self.x = x
		Self.y = y
		v = New Vector(0,0)
		f = New Vector(0,0)
		v_bias = New Vector(0,0)
		a = 0.0
        w = 0.0
        t = 0.0
        w_bias = 0.0
		rcos = 1
		 rsin = 0
		shapes = New  HaxeFastList< Shape > ()
		arbiters = New  HaxeFastList< Arbiter > ()
	End 
	
	Method addShape( s : Shape ) 
		'test
		Local d := s.material.density
		shapes.Add(s)
		s.body = Self
	End 
	
	Method removeShape( s : Shape ) 

		shapes.Remove(s)
		s.body = null
	End 
	
	Method updatePhysics() 

		Local m  : Float = 0.0
		Local i  : Float = 0.0
		For Local s := Eachin shapes 

			Local sm : Float = s.area
			sm *= s.material.density
			m += sm
			i += s.calculateInertia() * sm
		End 

		if( m > 0 ) 

			mass = m
			invMass = 1 / m
		Else  

			mass = Constants.POSITIVE_INFINITY
			invMass = 0
			isStatic = true
		End 

		if( i > 0 ) 

			inertia = i
			invInertia = 1 / i
		Else  

			inertia = Constants.POSITIVE_INFINITY
			invInertia = 0
		End 
	End 
	
	Method preventRotation() 

		inertia = Constants.POSITIVE_INFINITY
		invInertia = 0
	End 
	
	Method setAngle( a : Float ) 

		Self.a = a
		rcos = haxetypes.Math.Cos(a)
		rsin = haxetypes.Math.Sin(a)
	End 
	
	Method set(  pos : Vector = Null ,  a : Float = Constants.NaN ,  v : Vector = Null ,  w : Float = Constants.NaN  ) 

		if( Not( pos = null ) ) 

			x = pos.x
			y = pos.y
		End 

		if( Not( a = Constants.NaN) ) 
		   setAngle(a)
		End 
		if( Not( v = null ) ) 

			Self.v.x = v.x
			Self.v.y = v.y
		End 

		if( Not( w = Constants.NaN) ) 
		   Self.w = w
		End 
	End 
	
	Method setPos( x : Float, y : Float,  a : Float = Constants.NaN  ) 

		Self.x = x
		Self.y = y
		if( Not( a = Constants.NaN  ) ) 
		   setAngle(a)
		End 
	End 
	
	Method setSpeed( vx : Float, vy : Float,  w :Float = Constants.NaN  ) 
		v.x = vx
		v.y = vy
		if( Not( w = Constants.NaN ) ) 
		   Self.w = w
		End 
	End 
	
	Method toString() 
		return "Body#"+id
	End 
	
	Method onDestroy() 
	End 
End 
