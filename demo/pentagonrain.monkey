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
Import fling.allfling
Import fling.haxetypes.haxetypes

Class PentagonRain extends Demo
 
	Field pentagons : HaxeFastList<Body>
	Field numPentagons : Int
	Field refreshDelay : Float
	Field lastRefresh : Float
	 
	Method New() 
		Super.New()
		pentagons = New HaxeFastList<Body>()
		numPentagons = 500
		refreshDelay = 1
		lastRefresh = 0
	End 

	Method Init() 
		world.gravity.Set(0,0.0625)
		Updates = 1
		Local triangle  := New HaxeArray<Vector>()
		triangle.Push(New Vector(-15,15))
		triangle.Push(New Vector(15,15))
		triangle.Push(New Vector(0,-10))
		
		Local mat  := New Material(1, 0.1, 1)

		For Local i := 0 Until 8  
			For Local j := 0 Until 7  
				Local stagger  := (j Mod 2)*40
				Local offset  := New Vector(i * 80 + stagger, 80 + j * 70 )
				world.AddStaticShape( New Polygon(triangle, offset, mat) )
			End 
		End 

		mat  = New Material(0.2, 0, 1)

		For Local i := 0 Until numPentagons  
			Local p  := AddBody( 300 + Rand(-300,300), Rand(-50,-150), CreateConvexPoly(5, 10, 0, mat) )
			pentagons.Add(p)
		End 
	End 

	Method Update( dt : Float ) 
		lastRefresh += dt
		If( lastRefresh < refreshDelay ) 
		  Return
		End

		For Local p := Eachin pentagons 

			If( (p.y > size.y + 20) Or (p.x < -20) Or (p.y > size.x + 20) ) 

				p.SetPos( 300 + Rand(-280,280), Rand(-50,-100) )
				p.SetSpeed( Rand(-10,10)/40, Rand(10,100)/40 )
			End 
		End 
	End 
End 

