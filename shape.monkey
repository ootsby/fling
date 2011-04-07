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
import fling.col.aabb

Class Shape 
	Global ID  := 0
	 Global CIRCLE  := 0
	 Global SEGMENT  := 1
	 Global POLYGON  := 2
	Field id : Int
	Field type : Int
	Field circle : Circle
	Field segment : Segment
	Field polygon : Polygon
	Field body : Body
	Field offset : Vector
	Field aabb : AABB
	Field material : Material
	Field area : Float
	Field groups : Int
	Method New( type : Int, material : Material ) 

ID += 1
		id = ID
		groups = 1
		Self.type = type
		If( (material = null)  )
		    Self.material = Constants.DEFAULT_MATERIAL 
		Else  

		    Self.material = material
		End 

		Self.area = 0
		aabb = New AABB(0,0,0,0)
	End 
	Method update() 

	End 
	Method calculateInertia : Float() 

		Return 1.0
	End 
	Method toString : String() 

		Return"Shape#"+id
	End 
	Function makeBox : Polygon( width : Float, height : Float,  px : Float = -width/2.0 ,  py : Float = -height /2.0 ,  mat: Material = Null  ) 

		If( px = Constants.NaN ) 
		   px = -width / 2
		End 
		If( py = Constants.NaN ) 
		   py = -height / 2
		End 
		Local v : HaxeArray<Vector> = New HaxeArray<Vector>()
		v.Push(New Vector(0,0))
		v.Push(New Vector(0,height))
		v.Push(New Vector(width,height))
		v.Push(New Vector(width,0))
		
		
		
		Return New Polygon( v,New Vector(px,py),mat)
	End 
End 

