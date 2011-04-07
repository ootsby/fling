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

Class Jumble extends Demo 

	Field addDelay : Int
	Field lastAdd : Int
	Field material : Material

	Method New() 
		Super.New()
		addDelay = 30
		lastAdd = 50
		material = New Material(0.1, 0.5, 1)
	End 
	
	Method Init() 
		world.gravity.Set(0,0.3125)
		CreateFloor()
	End 

	Method Update( dt : Float) 
		lastAdd += 1
		If( lastAdd < addDelay ) 
		  Return
		End

		lastAdd = 0
		Local body  := New Body(0,0)
		body.AddShape( Shape.MakeBox(60,10,Constants.NaN,Constants.NaN,material))
		body.AddShape( Shape.MakeBox(10,60,Constants.NaN,Constants.NaN,material))
		body.AddShape(New Circle(12,New Vector(-30,0),material))
		body.AddShape(New Circle(12,New Vector(30,0),material))
		body.AddShape(New Circle(12,New Vector(0,-30),material))
		body.AddShape(New Circle(12,New Vector(0,30),material))
		body.SetPos( 300 + Rand(-250,250), Rand(-200,-20), Rand(0,2*Constants.PI) )
		body.w = Rand( -2, 2 ) / 40
		world.AddBody(body)
	End 

End 

