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

Import fling.allfling
Import fling.haxetypes.haxetypes

Class Polygon extends Shape 

	Field verts : Vector
	Field tVerts : Vector
	Field vcount : Int
	Field axes : Axis
	Field tAxes : Axis
	
	Method New( vl : HaxeArray<Vector>, offset : Vector,  material : Material = Null  )  
		Super.New(Shape.POLYGON, material)
		polygon = Self
		Self.offset = offset
		initVertexes(vl)
	End 
	
	Method initVertexes( vl : HaxeArray<Vector> ) 
		Local l_verts : Vector = null
        Local l_tVerts : Vector = null
        Local l_axes : Axis = null
        Local l_tAxes : Axis = null
		Local count  := vl.length
		vcount = count
		area = 0
		Local off  := (Not( offset = null ))
		For Local i := 0 Until count  

			Local v0  := vl.Get(i)
			Local v1  := vl.Get((i + 1) Mod count)
			Local v2  := vl.Get((i + 2) Mod count)
			area += v1.x * (v0.y - v2.y)
			Local v  :=  v0
			If( off  ) 
			    v =  v0.plus(offset) 
			End 

			Local n  := Vector.normal(v1.x - v0.x,v1.y - v0.y)
			Local a  := New Axis(n, n.dot(v))
			Local vt  := v.clone()
			Local at  := a.clone()
			'// enqueue
			If( i = 0 ) 

				verts	= v
				tVerts 	= vt
				axes 	= a
				tAxes	= at
			Else  

				l_verts.nextItem = v
				l_tVerts.nextItem = vt
				l_axes.nextItem = a
				l_tAxes.nextItem = at
			End 

			l_verts 	= v
			l_tVerts 	= vt
			l_axes		= a
			l_tAxes		= at
		End 

		area *= 0.5
	End 

	Method update() 

		Local v  := verts
		Local tv  := tVerts
		Local body  := Self.body
		Local aabb  := Self.aabb
		'// reset bounding box
		aabb.l = Constants.FMAX
		aabb.t = Constants.FMAX
		aabb.r = Constants.FMIN
		aabb.b = Constants.FMIN
		'// transform points
		While( Not( v = null ) ) 

			tv.x = body.x + Constants.XROT(v,body)
			tv.y = body.y + Constants.YROT(v,body)
			If( tv.x < aabb.l ) 
			   aabb.l = tv.x
			End

			If( tv.x > aabb.r ) 
			   aabb.r = tv.x
			End

			If( tv.y < aabb.t ) 
			   aabb.t = tv.y
			End

			If( tv.y > aabb.b ) 
			   aabb.b = tv.y
			End

			v = v.nextItem
			tv = tv.nextItem
		End 
		'// transform axes
		Local a  := axes
		Local ta  := tAxes
		While( Not( a = null ) ) 

			Local n  := a.n
			ta.n.x = Constants.XROT(n,body)
			ta.n.y = Constants.YROT(n,body)
			ta.d   = body.x * ta.n.x + body.y * ta.n.y + a.d
			a = a.nextItem
			ta = ta.nextItem
		End 
	End 
	
	Method calculateInertia : Float() 

		'// not very optimized (using a tmp array)
		'// but simplifying the maths is not easy here
		Local tVertsTemp  := New HaxeArray<Vector>()
		Local v  := verts
		While( Not( v = null ) ) 

			tVertsTemp.Push( New Vector( v.x + offset.x , v.y + offset.y) )
			v = v.nextItem
		End 

		Local sum1  : Float = 0.0
		Local sum2  : Float = 0.0
		For Local i := 0 Until vcount  

			Local v0  := tVertsTemp.Get(i)
			Local v1  := tVertsTemp.Get((i + 1) Mod vcount)
			Local a  : Float = v1.cross(v0)
			Local b  : Float = v0.dot(v0) + v0.dot(v1) + v1.dot(v1)
			sum1 += a * b
			sum2 += a
		End 

		Return sum1 / (6 * sum2)
	End 
End 

