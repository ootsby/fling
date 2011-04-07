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
Import mojo

Class Color  
	Field r : Float
	Field g : Float
	Field b : Float
	Field a : Float
	
	Method New( r:Float,g:Float,b:Float,a:Float = 1.0)
		Self.r = r
		Self.g = g
		Self.b = b
		Self.a = a
	End
End 

Class MojoDraw 

	Field shape : Color
	Field staticShape : Color
	Field sleepingShape : Color
	Field boundingBox : Color
	Field contact : Color
	Field sleepingContact : Color
	Field contactSize : Color
	Field drawSegmentsBorders : Bool
	Field drawSegmentsNormals : Bool
	Field drawCircleRotation : Bool
	Field xmin : Int
	Field ymin : Int
	Field xmax : Int
	Field ymax : Int

	Method New( ) 
		Self.xmin = -1000000000
		Self.ymin = -1000000000
		Self.xmax = 1000000000
		Self.ymax = 1000000000
		drawSegmentsBorders = true
		drawSegmentsNormals = false
		shape = New Color(223,237,237)
		staticShape = New Color(230,220,100)
		sleepingShape = New Color(127,237,237)
		boundingBox = null
		contact = null
		sleepingContact = null
		contactSize = null
	End 

	Method BeginShape( c : Color ) 
		If( c = null ) 
		  Return false
		End

		SetColor(c.r,c.g,c.b)
		SetAlpha(c.a)
		Return true
	End 

	Method EndShape( c : Color ) 
	End 

	Method SelectColor:Color( s : Shape ) 
		If( s.body.isStatic )
			Return staticShape
		Else
			If (Not(s.body.island = null) And s.body.island.sleeping)
				Return sleepingShape
			Else
				Return shape
			End
		End
	End 

	Method SelectArbiterColor:Color( a : Arbiter ) 
		If a.sleeping
			Return sleepingContact 
		Else
			Return contact
		End
	End 

	Method DrawWorld( w : World ) 
		PushMatrix()
		Scale(0.7,0.7)
		DrawBody(w.staticBody)

		For Local b := Eachin w.bodies
		   DrawBody(b)
		End

		For Local j := Eachin w.joints
		   DrawJoint(j)
		End

		For Local a := Eachin w.arbiters 
			Local col  := SelectArbiterColor(a)

			If( BeginShape(col) ) 
				Local c  := a.contacts

				If( c = null ) 
					Local b1  := a.s1.body
					Local b2  := a.s2.body
					Local p1  :=  New Vector( b1.x + Constants.XROT(a.s1.offset,b1), b1.y + Constants.YROT(a.s1.offset,b1) )

					If( (a.s1.offset = null)  ) 
					    p1 =  New Vector(b1.x,b1.y) 
					End 

					Local p2  :=  New Vector( b2.x + Constants.XROT(a.s2.offset,b2), b2.y + Constants.YROT(a.s2.offset,b2) )

					If( (a.s2.offset = null)  ) 
					    p2 =  New Vector(b1.x,b1.y) 
					End 

					DrawLine(p1.x,p1.y,p2.x,p2.y)
					mojo.graphics.DrawCircle(p1.x,p1.y,5)
					mojo.graphics.DrawCircle(p2.x,p2.y,5)
				End 

				While( Not( c = null ) ) 
					If( c.updated ) 
					   DrawRect(c.px - 1,c.py - 1,2,2)
					End
					c = c.nextItem
				End 

				EndShape(col)
			End 

			If( BeginShape(contactSize) ) 
				Local c  := a.contacts

				While( Not( c = null ) ) 
					If( c.updated ) 
					   mojo.graphics.DrawCircle(c.px, c.py, c.dist)
					End
					c = c.nextItem
				End 

				EndShape(contactSize)
			End 
		End

		PopMatrix()
	End 

	Method DrawBody( b : Body ) 
		For Local s := Eachin b.shapes 
			Local b  := s.aabb

			If( b.r < xmin Or b.b < ymin Or b.l > xmax Or b.t > ymax ) 
			   Continue
			End

			DrawShape(s)
		End 
	End 

	Method DrawShape( s : Shape ) 
		Local c  := SelectColor(s)

		If( BeginShape(c) ) 
			Select( s.type ) 
				Case Shape.CIRCLE DrawCircle(s.circle)
				Case Shape.POLYGON DrawPoly(s.polygon)
				Case Shape.SEGMENT DrawSegment(s.segment)
			End 

			EndShape(c)
		End 

		If( BeginShape(boundingBox) ) 
			DrawRect(s.aabb.l, s.aabb.t, s.aabb.r - s.aabb.l, s.aabb.b - s.aabb.t)
			EndShape(boundingBox)
		End 
	End 

	Method DrawSegment( s : Segment ) 
		Local delta  := s.tB.Minus(s.tA)
		Local angle  := haxetypes.Math.ATan2( delta.x, delta.y )
		Local dx  := haxetypes.Math.Cos(angle) * s.r
		Local dy  := haxetypes.Math.Sin(angle) * s.r
		If( drawSegmentsBorders ) 

			mojo.graphics.DrawCircle(s.tA.x, s.tA.y, s.r)
			mojo.graphics.DrawCircle(s.tB.x, s.tB.y, s.r)
		End 

		If( drawSegmentsNormals ) 

			Local hx  := (s.tA.x + s.tB.x) / 2
			Local hy  := (s.tA.y + s.tB.y) / 2
			DrawLine(hx, hy, hx + s.tN.x * (s.r * 2),hy + s.tN.y * (s.r * 2))
		End 

		DrawLine(s.tA.x + dx,s.tA.y - dy,s.tB.x + dx,s.tB.y - dy)
		DrawLine(s.tB.x + dx,s.tB.y - dy, s.tB.x - dx,s.tB.y + dy)
		DrawLine(s.tB.x - dx,s.tB.y + dy,s.tA.x - dx,s.tA.y + dy)
	End 
	
	Method DrawCircle( c : Circle ) 
		mojo.graphics.DrawCircle(c.tC.x, c.tC.y, c.r )

		If( drawCircleRotation ) 
			DrawLine(c.tC.x, c.tC.y,c.tC.x + c.body.rcos * c.r, c.tC.y + c.body.rsin * c.r)
		End 
	End 
	
	Method DrawPoly( p : Polygon ) 
		Local v  := p.tVerts

		While( Not( v.nextItem = null ) ) 
			DrawLine(v.x, v.y, v.nextItem.x,v.nextItem.y)
			v = v.nextItem
		End 

		DrawLine( v.x,v.y,p.tVerts.x, p.tVerts.y )
	End 
	
	Method DrawJoint( j : Joint ) 
	End 
End 
