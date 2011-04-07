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

class Collision 


	Method New() 
	End 

	Method testShapes :Bool( s1 : Shape, s2 : Shape, a : Arbiter ) 
		
		If( s1.type = Shape.POLYGON And s2.type = Shape.POLYGON ) 
		Return poly2poly(s1.polygon,s2.polygon,a)
		Else  If( s1.type = Shape.CIRCLE ) 
			If( s2.type = Shape.POLYGON )
			Return circle2poly(s1.circle,s2.polygon,a)
			Else If( s2.type = Shape.CIRCLE )
			Return circle2circle(s1.circle,s2.circle,a)
			Else  ' type = SEGMENT 
			Return circle2segment(s1.circle,s2.segment,a)
			End 
		Else If( s1.type = Shape.SEGMENT And s2.type = Shape.POLYGON ) 
		Return segment2poly(s1.segment,s2.polygon,a)
		Else  
		Return false	'// segment-segment
        End 

	End 
	
	Method polyAxisProject : Float( s : Polygon, n : Vector, d : Float ) 

		Local v  := s.tVerts
		Local min : Float = Constants.FMAX
		While( Not( v = null ) ) 

			Local k  := n.dot(v)
			If( k < min ) 
			   min = k
			End 
			v = v.nextItem
		End 

	Return min - d
	End 

	Method poly2poly :Bool( shape1 : Polygon, shape2 : Polygon, arb : Arbiter ) 

		'// first, project shape 2 vertices onto shape 1 axes & find MSA
		Local max1  : Float = Constants.FMIN
		Local axis1  : Axis = null
		Local a  := shape1.tAxes
		While( Not( a = null ) ) 

			Local min  := polyAxisProject(shape2,a.n,a.d)
			If( min > 0 ) 
			  Return false
			End 
			If( min > max1 ) 

				max1 = min
				axis1 = a
			End 

			a = a.nextItem
		End 
		'// Second, project shape 1 vertices onto shape 2 axes & find MSA
		Local max2  := Constants.FMIN
		Local axis2  : Axis = null
		a = shape2.tAxes
		While( Not( a = null ) ) 

			Local min  := polyAxisProject(shape1,a.n,a.d)
			If( min > 0 ) 
			  Return false
			End 
			If( min > max2 ) 

				max2 = min
				axis2 = a
			End 

			a = a.nextItem
		End 

		If( max1 > max2 )
			findVerts(arb, shape1, shape2, axis1,  1, max1)
		Else  
			findVerts(arb, shape1, shape2, axis2, -1, max2)
		End 
	Return true
	End 

	Method findVerts( arb : Arbiter, poly1 : Polygon, poly2 : Polygon, n : Axis, nCoef : Float, dist : Float ) 

		'// we need to uniquely identify the contact
		'// and the poly can be swaped so the id calculus
		'// needs to be commutative
		Local id  :=  65000
		If( (poly1.id > poly2.id)  ) 

		    id =  0 
		End 

		Local c  := 0
		Local v  := poly1.tVerts
		While( Not( v = null ) ) 

			If( polyContainsPoint(poly2,v) ) 

				arb.injectContact(v,n.n,nCoef,dist,id)
				c += 1
				If( c > 1 ) 
				  Return
				End 

 '// max = 2 contacts
			End 

			id += 1
			v = v.nextItem
		End 

		If( (poly1.id > poly2.id)  )
		    id = 65000 
		Else  

		    id = 0
		End 

		v = poly2.tVerts
		While( Not( v = null ) ) 

			If( polyContainsPoint(poly1,v) ) 

				arb.injectContact(v,n.n,nCoef,dist,id)
				c += 1
				If( c > 1 ) 
				  Return
				End 

 '// max = 2 contacts
			End 

			id += 1
			v = v.nextItem
		End 
	End 

	Method circle2circle:Bool( circle1: Circle, circle2:Circle, arb : Arbiter ) 
		Local b := circle2circleQuery( arb, circle1.tC, circle2.tC, circle1.r, circle2.r )
	Return b 
	End 

	Method circle2circleQuery : Bool( arb : Arbiter, p1 : Vector, p2 : Vector, r1 : Float, r2 : Float ) 

		Local minDist  := r1 + r2
		Local x  := p2.x - p1.x
		Local y  := p2.y - p1.y
		Local distSqr  := x * x + y * y
		If( distSqr >= minDist * minDist ) 
		  Return false
		End 
		Local dist  := Sqrt(distSqr)
		Local invDist  :=  1 / dist
		If( (dist < Constants.EPSILON)  ) 

		    invDist =  0 
		End 

		Local df  := 0.5 + (r1 - 0.5 * minDist) * invDist
		arb.injectContact( New Vector(p1.x + x * df,p1.y + y * df), New Vector(x * invDist, y * invDist), 1.0, dist - minDist, 0)
	Return true
	End 
	
	Method circle2segment:Bool( circle : Circle, seg : Segment, arb : Arbiter ) 

		Local dn  := seg.tN.dot(circle.tC) - seg.tA.dot(seg.tN)
		Local dist  :=  dn
		If( dn < 0  ) 

		    dist =  -dn 
		End 

        dist -= (circle.r + seg.r)
		If( dist > 0 ) 
		  Return false
		End 
		Local dt  := -seg.tN.cross(circle.tC)
		Local dtMin  := -seg.tN.cross(seg.tA)
		Local dtMax  := -seg.tN.cross(seg.tB)
		If( dt < dtMin ) 

			If( dt < dtMin - circle.r ) 
			  Return false
			End 
		Return circle2circleQuery(arb, circle.tC, seg.tA, circle.r, seg.r)
		Else  

			If( dt < dtMax ) 

				Local n  :=  seg.tN.mult(-1)
				If( (dn < 0)  ) 

				    n =  seg.tN 
				End 

				Local hdist  := circle.r + dist * 0.5
				arb.injectContact(New Vector(circle.tC.x + n.x * hdist, circle.tC.y + n.y * hdist),n,1.0,dist,0)
			Return true
			End 

			If( dt < dtMax + circle.r ) 
			  Return circle2circleQuery(arb,circle.tC, seg.tB, circle.r, seg.r)
			End 
		End 

	Return false
	End 
	
	Method findPolyPointsBehindSegment( seg : Segment, poly : Polygon, pDist : Float, coef : Float, arb : Arbiter ) 

		Local dta  := seg.tN.cross(seg.tA)
		Local dtb  := seg.tN.cross(seg.tB)
		Local n  := New Vector(seg.tN.x * coef, seg.tN.y * coef)
		Local k  := seg.tN.dot(seg.tA) * coef
		Local v  := poly.tVerts
		Local i  := 2
		 '// 0 and 1 are reserved for segment
		While( Not( v = null ) ) 

			If( v.dot(n) < k + seg.r ) 

				Local dt  := seg.tN.cross(v)
				If( dta >= dt And dt >= dtb ) 
				   arb.injectContact(v, n, 1.0, pDist, i )
				End 
			End 

			i += 1
			v = v.nextItem
		End 
	End 
	
	Method segAxisProject:Float( seg : Segment, n : Vector, d : Float ) 

		Local vA  := n.dot(seg.tA) - seg.r
		Local vB  := n.dot(seg.tB) - seg.r
		If(  vA < vB  ) 

		   Return vA - d 
		Else  

		   Return vB - d
		End 
	End 
	
	Method segment2poly:Bool( seg : Segment, poly : Polygon, arb : Arbiter ) 

		Local segD  := seg.tN.dot(seg.tA)
		Local minNorm  := polyAxisProject(poly,seg.tN,segD) - seg.r
		Local minNeg  := polyAxisProject(poly,seg.tNneg,-segD) - seg.r
		If( minNeg > 0 Or minNorm > 0 ) 
		  Return false
		End 
		Local a  := poly.tAxes
		Local polyMin  := Constants.FMIN
		Local axis  : Axis = null
		While( Not( a = null ) ) 

			Local dist  := segAxisProject(seg,a.n,a.d)
			If( dist > 0 ) 
			  Return false
			End 
			If( dist > polyMin ) 

				polyMin = dist
				axis = a
			End 

			a = a.nextItem
		End 
		Local n  := axis.n
		Local va  := New Vector( seg.tA.x - n.x * seg.r, seg.tA.y - n.y * seg.r )
		Local vb  := New Vector( seg.tB.x - n.x * seg.r, seg.tB.y - n.y * seg.r )
		If( polyContainsPoint(poly,va) ) 
		   arb.injectContact(va, n, -1.0, polyMin, 0 )
		End 
		If( polyContainsPoint(poly,vb) ) 
		   arb.injectContact(vb, n, -1.0, polyMin, 1 )
		End 
		If( minNorm >= polyMin Or minNeg >= polyMin ) 

			If( minNorm > minNeg )
				findPolyPointsBehindSegment(seg, poly, minNorm, 1.0, arb)
			Else  
				findPolyPointsBehindSegment(seg, poly, minNeg, -1.0, arb)
			End 
		End 

	Return true
	End 
	
	Method circle2poly:Bool( circle : Circle, poly : Polygon, arb : Arbiter ) 

		Local a0  : Axis = null
		Local v0 : Vector = null
		Local a  := poly.tAxes
		Local v  := poly.tVerts
		Local min  := Constants.FMIN
		While( Not( a = null ) ) 

			Local dist  := a.n.dot(circle.tC) - a.d - circle.r
			If( dist > 0 ) 
			  Return false
			End 
			If( dist > min ) 

				min = dist
				a0 = a
				v0 = v
			End 

			a = a.nextItem
			v = v.nextItem
		End 
		Local n  := a0.n
		Local v1  := v0.nextItem
		If( (v0.nextItem = null) ) 

		    v1 = poly.tVerts
		End 

		Local dt  := n.cross(circle.tC)
		If( dt < n.cross(v1) ) 
		  Return circle2circleQuery(arb, circle.tC, v1, circle.r, 0)
		End 
		If( dt >= n.cross(v0) ) 
		  Return circle2circleQuery(arb, circle.tC, v0, circle.r, 0)
		End 
		Local nx  := n.x * (circle.r + min * 0.5)
		Local ny  := n.y * (circle.r + min * 0.5)
		arb.injectContact(New Vector(circle.tC.x - nx, circle.tC.y - ny),n,-1.0,min,0) 
	Return true
	End 
	
	Method polyContainsPoint:Bool( s : Polygon, p : Vector ) 

		Local a  := s.tAxes
		While( Not( a = null ) ) 

			If( a.n.dot(p) > a.d ) 
			  Return false
			End 
			a = a.nextItem
		End 

	Return true
	End 
	
	Method testPoint:Bool( s : Shape, p : Vector ) 

		Select( s.type ) 
			Case Shape.POLYGON
			Return polyContainsPoint(s.polygon,p)
			Case Shape.CIRCLE
				Local c  := s.circle
				Local dx  := c.tC.x - p.x
				Local dy  := c.tC.y - p.y
			Return(dx * dx + dy * dy) <= (c.r * c.r)
			Default 
			Return false
		End 

	End 
End 

