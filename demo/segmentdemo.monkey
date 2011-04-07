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

Import fling.demo.alldemo
Import fling.haxetypes.haxetypes
Import fling.allfling

Class SegmentDemo extends Demo 
	
	Field bodies : HaxeFastList<Body>
	Field numBodies : Int
	Field refreshDelay : Int
	Field lastRefresh : Int
	
	Method New() 
		Super.New()
		bodies = New HaxeFastList<Body>()
		numBodies = 200
		refreshDelay = 9
		lastRefresh = 50
	End 

	Method init() 
		world.gravity.set(0, 0.3125)
		world.addStaticShape( New Segment( New Vector(0, 0), New Vector(220, 200), 4))
		world.addStaticShape( New Segment( New Vector(600, 0), New Vector(380, 200), 4))
		world.addStaticShape( New Segment( New Vector(200, 350), New Vector(300, 300), 4))
		world.addStaticShape( New Segment( New Vector(400, 350), New Vector(300, 300), 4))
		world.addStaticShape( New Segment( New Vector(100, 400), New Vector(200, 500), 2))
		world.addStaticShape( New Segment( New Vector(500, 400), New Vector(400, 500), 2))

		Local material := New Material(0.0, 0.2, 1)

		For Local i := 0 Until numBodies  
			Local s : Shape
			
			If( rand(0,2) > 0 )
				s = createConvexPoly(Int(rand(3, 4)),rand(12, 20),0, material)
			Else  
				s = New Circle(rand(8,20),New Vector(0,0))
			End

			Local b := addBody( 300 + rand(-200, 200), rand(-50,-150), s )
			'Local b := addBody( 300, 0, s )
			bodies.Add(b)
		End 
	End 

	Method Update( dt : Float ) 

		lastRefresh += 1
		If( lastRefresh < refreshDelay ) 
		  Return
		End

		For Local b := Eachin bodies 

			If( (b.y > size.y + 20) Or (b.x < -20) Or (b.y > size.x + 20) ) 

				b.setPos( 300 + rand(-200, 200), rand(-50,-100) )
				b.setSpeed( rand(-10,10)/40, rand(10,100)/40 )
			End 
		End 
	End 
End 

