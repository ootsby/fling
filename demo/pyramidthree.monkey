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

Class PyramidThree extends Demo 

	Method Init() 
		world.gravity.Set(0,0.125)
		CreateFloor()
		Local width  := 70
		Local height  := 11
		Local slab  := Shape.MakeBox(width,height, Constants.NaN, Constants.NaN,New Material(0.0, 1, 1))
		Local p0  := Constants.DEFAULT_PROPERTIES
		Local props  := New Properties(p0.linearFriction,p0.angularFriction,0.001, Constants.FMAX,p0.maxDist)
		Local startY  := floor - (height / 2)
		Local startX  := size.y / 2
		Local segcount  := 5

		For Local i := 0 Until 5  
			CreatePoly( startX - width, startY, 0, slab, props )
			CreatePoly( startX + width, startY, 0, slab, props )

			For Local y := 0 Until segcount  
				For Local x := 0 Until y+1 
				   CreatePoly( startX - (x * width) + y * (width / 2), startY, 0, slab, props )
				End

				startY -= height
			End 

			Local y  := segcount

			While( y > 0 ) 
				For Local x := 0 Until y+1 
				   CreatePoly( startX - (x * width) + y * (width / 2), startY, 0, slab, props )
				End

				startY -= height
				y -= 1
			End 
		End 
	End 
End 
