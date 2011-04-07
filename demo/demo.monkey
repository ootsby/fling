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

Class Demo 

	Field world : World
	Field floor : Float
	Field size : Vector
	Field Updates : Int
	
	Method New() 
		size = New Vector(600,600)
		floor = 580
		Updates = 3
	End 
	
	Method start( world : World ) 
		Self.world = world
		init()
	End 
	
	Method init() 
	End 

	Method Update( dt :Float) 
	End 

	Method addRectangle:Body( x : Float, y : Float, w : Float, h :Float,  mat : Material = Null  ) 
		Return addBody(x,y, Shape.makeBox(w,h,Constants.NaN,Constants.NaN,mat))
	End 
	
	Method addBody:Body( x : Float, y : Float, shape : Shape,  props : Properties = Null  ) 
		Local b  := New Body(x,y)
		b.addShape(shape)
		If( Not( props = null ) ) 
			b.properties = props
		End 
		world.addBody(b)
		Return b
	End 
	
	Method createWord : Void  ( str : String, xp : Float, yp : Float, size : Float, spacing : Float,  mat : Material = Null  )

		For Local i := 0 Until str.Length( ) 
			Local letter  := str[i]
			If( letter = 32 ) 
				xp += size
				Continue
			End 

			Local datas : Int[]
			
			If( letter = 33 )
				datas = FontArray.exclamation
			Else
				datas = FontArray.lowerCase[letter - 97]
			End
			
			If( Not(datas) ) 
			   Continue
			End 
			
			Local xmax  := 0
			
			For Local y := 0 Until FontArray.HEIGHT  
				For Local x := 0 Until FontArray.WIDTH  
					If( datas[ x + y * FontArray.WIDTH] = 1 ) 
						If( x > xmax ) 
						   xmax = x
						End 
						addRectangle( xp + x * (size + spacing), yp + y * (size + spacing), size, size, mat )
					End 
				End 
			End 

			xp += (xmax + 1) * (size + spacing) + size
		End 
	End 

	Method createConvexPoly : Polygon( nverts : Int, radius : Float, rotation : Float,  mat : Material = Null ) 

		Local vl  := New HaxeArray<Vector>()
	
		For Local i := 0 Until nverts  
			Local angle : Float = ( -2 * Constants.PI * i ) / nverts
			angle += rotation
			vl.Push( New Vector(radius * haxetypes.Math.Cos(angle), radius * haxetypes.Math.Sin(angle)) )
		End 

		Return New Polygon(vl,New Vector(0,0),mat)
	End 

	Method createPoly : Void( x : Float, y : Float, a : Float, shape : Polygon,  props : Properties = Null  ) 
		Local b  := New Body(x,y)
		Local vl := New HaxeArray<Vector>()
		Local v  := shape.verts

		While( Not( v = null ) ) 
			vl.Push(v)
			v = v.nextItem
		End 

		b.addShape( New Polygon(vl,New Vector(0,0),shape.material) )
		b.setAngle(a)
		
		If( Not( props = null ) ) 
		   b.properties = props
		End 
		
		world.addBody(b)
	End 
	
	Method createFloor(  mat : Material = Null  ) 
		Local s  := Shape.makeBox(600,40,0,floor,mat)
		world.addStaticShape(s)
	End 

	Method rand : Float( min : Float, max : Float ) 
		Return haxetypes.Math.Round(Rnd() * (max - min + 1)) + min
	End 
End 

