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

class DominoPyramid extends Demo 

	Method init() 
		world.gravity.set(0,0.3125)
		createFloor()
		Local d_width  := 5
		Local d_heigth  := 20
		Local stackHeigth  := 9
		Local xstart  := 60.0
		Local yp  := floor
		Local d90  := Constants.PI / 2
		Local domino  := Shape.makeBox(d_width*2, d_heigth*2, Constants.NaN, Constants.NaN, New Material(0.0, 0.6, 0.5))
		For Local i := 0 Until stackHeigth  

			Local dw  := 0
			If( (i = 0) ) 

			    dw = 2 * d_width
			End 

			For Local j := 0 Until stackHeigth - i  

				Local xp  := xstart + (3*d_heigth*j)
				If( i = 0 ) 

					createPoly( xp , yp - d_heigth, 0, domino )
					createPoly( xp , yp - (2 * d_heigth) - d_width, d90, domino )
				Else  

					createPoly( xp , yp - d_width, d90, domino )
					createPoly( xp , yp - (2 * d_width) - d_heigth, 0, domino )
					createPoly( xp , yp - (3 * d_width) - (2 * d_heigth), d90, domino )
				End 

				If( j = 0 ) 
				   createPoly( xp - d_heigth + d_width , yp - (3 * d_heigth) - (4 * d_width) + dw, 0, domino )
				End 
				If( j = stackHeigth - i - 1 ) 
				   createPoly( xp + d_heigth - d_width , yp - (3 * d_heigth) - (4 * d_width) + dw, 0, domino )
				End 
			End 

			yp -= (2*d_heigth)+(4*d_width) - dw
			xstart += 1.5 * d_heigth
		End 
	End 

End 

