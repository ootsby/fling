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

Class Test extends Demo 
	Field body : Body
	Field body2 : Body
	Field dir : Int
	Field et : Float
	  
	Method Init() 
		Main.inst.recalStep = true
		Main.inst.debug = true
		world.gravity = New Vector(0,0.9)
		Updates = 1
		body = AddBody( 300, 500, Shape.MakeBox(128,16) )
		body.isStatic = true
		world.RemoveBody(body)
		world.AddBody(body)
		body2 = AddBody( 250, 500 - 64, New Circle(10,New Vector(0,0)) )
		body2.v.x = 0.5
		'//body2 = AddBody( 250, 500 - 64, Shape.MakeBox(64,64) )
		body2.PreventRotation()
		dir = 1
		et = 0
	End 
	
	Method Update( dt : Float ) 
		et += dt
		If( et > 100 ) 

			et -= 100
			dir *= -1
		End 

		body.v.x = 1 * dir
		body.v.y = -0.5 * dir
		body.x += body.v.x * dt
		body.y += body.v.y * dt
		world.Sync(body)
	End 
End 
