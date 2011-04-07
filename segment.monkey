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

Class Segment extends Shape 

	Field a : Vector
	Field b : Vector
	Field n : Vector
	Field r : Float
	Field tA : Vector
	Field tB : Vector
	Field tN : Vector
	Field tNneg : Vector
	 
	Method New( a : Vector, b : Vector, r : Float,  material : Material = Null  ) 
		Super.New(Shape.SEGMENT, material)
		segment = Self
		offset = New Vector(0,0)
		Self.a = a.Clone()
		Self.b = b.Clone()
		Self.r = r
		Local delta  := b.Minus(a)
		n = Vector.Normal(delta.x,delta.y)
		area = r * delta.Length()
		tA = New Vector(0,0)
		tB = New Vector(0,0)
		tN = New Vector(0,0)
		tNneg = New Vector(0,0)
	End

	Method Update() 

		'// transform
		tA.x = body.x + Constants.XROT(a,body)
		tA.y = body.y + Constants.YROT(a,body)
		tB.x = body.x + Constants.XROT(b,body)
		tB.y = body.y + Constants.YROT(b,body)
		tN.x = Constants.XROT(n,body)
		tN.y = Constants.YROT(n,body)
		tNneg.x = -tN.x
		tNneg.y = -tN.y
		'// update bounding box
		If( tA.x < tB.x ) 

			aabb.l = tA.x - r
			aabb.r = tB.x + r
		Else  

			aabb.l = tB.x - r
			aabb.r = tA.x + r
		End 

		If( tA.y < tB.y ) 

			aabb.t = tA.y - r
			aabb.b = tB.y + r
		Else  

			aabb.t = tB.y - r
			aabb.b = tA.y + r
		End 
	End

	Method CalculateInertia: Float() 

		Return 1.0
	End 
End 

