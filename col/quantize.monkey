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

Import fling.col.allcol
Import fling.haxetypes.haxetypes

#rem
'/**
	This broadphase is optimized for large worlds with a majority of static
	shapes and few moving shapes. It divides the space in squares of 2^nbits
	pixels. Shapes are stored into one several squares that they cover.
	Collisions are only tested between  shapes and all other shapes into
	each square. World bounds should be positive. Shapes outside of the world
	might be in the wrong square (but that's ok) or in a special square.
'**/
#end

Class Quantize Extends BroadPhase 
	Field nbits : Int
	Field size : Int
	Field width : Int
	Field height : Int
	Field spanbits : Int
	Field all :  HaxeFastList<  HaxeFastList< AABB>  >  
	Field world : HaxeArray< HaxeFastList< AABB> > 
	Field out :  HaxeFastList< AABB > 
	Field cb : BroadCallback
	Field staticBody : Body
	Method New( nbits : Int ) 

		Self.nbits = nbits
		Self.size = 1 Shl nbits
	End 
	Method ADDR(x,y) 

		Return(x Shl spanbits) | y
	End 
	Method init : Void ( bounds : AABB, cb : BroadCallback, staticBody : Body ) 

		Self.cb = cb
		Self.staticBody = staticBody
		all = New  HaxeFastList<  HaxeFastList< AABB>  >  ()
		world = New HaxeArray< HaxeFastList< AABB> > ()
		out = New  HaxeFastList< AABB > ()
		all.Add(out)
		width = Int(bounds.r + size - 0.1) Shr nbits
		height = Int(bounds.b + size - 0.1) Shr nbits
		Local tmp  := width - 1
		Local spanbits  := 0
		While( tmp > 0 ) 

			spanbits += 1
			tmp Shr= 1
		End 
	End 
	Method add( l :  HaxeFastList< AABB > , box : AABB ) 

		If( Not( box.shape.body = staticBody ) ) 

			l.Add(box)
		Return
		End 

		Local b  := l.head
		Local prev : HaxeFastCell<AABB> = null
		While( Not( b = null ) ) 

			If( b.elt.shape.body = staticBody ) 
			   Exit
			End 
			prev = b
			b = b.nextItem
		End 

		If( prev = null )
			l.head = New HaxeFastCell<AABB>(box,b)
		Else  
			prev.nextItem = New HaxeFastCell<AABB>(box,b)
		End 
	End 
	Method addShape: Void( s : Shape ) 

		Local box  := s.aabb
		Local nbits  := Self.nbits
		Local x1  := Int(box.l) Shr nbits
		Local y1  := Int(box.t) Shr nbits
		Local x2  := (Int(box.r) Shr nbits) + 1
		Local y2  := (Int(box.b) Shr nbits) + 1
		box.shape = s
		box.bounds = New IAABB(x1,y1,x2,y2)
		Local isout  := false
		For Local x := x1 Until x2  

			For Local y := y1 Until y2  

				Local l  := world.Get(ADDR(x,y))
				If( l = null ) 

					If( x >= 0 And x < width And y >= 0 And y < height ) 

						l = New  HaxeFastList< AABB > ()
						all.Add(l)
						world.Set(ADDR(x,y), l)
					Else  

						If( isout ) 
						   Continue
						End 
						isout = true
						l = out
					End 
				End 

				add(l,box)
			End 
		End 
	End 
	Method removeShape: Void( s : Shape ) 

		Local box  := s.aabb
		Local ib  := box.bounds
		For Local x := ib.l Until ib.r  

			For Local y := ib.t Until ib.b  

				Local l  := world.Get(ADDR(x,y))
				If( l = null ) 
				   l = out
				End 
				l.Remove(box)
			End 
		End 
	End 
	Method syncShape: Void( s : Shape ) 

		Local box  := s.aabb
		Local nbits  := Self.nbits
		Local x1  := Int(box.l) Shr nbits
		Local y1  := Int(box.t) Shr nbits
		Local x2  := (Int(box.r) Shr nbits) + 1
		Local y2  := (Int(box.b) Shr nbits) + 1
		Local ib  := box.bounds
		If( x1 = ib.l And y1 = ib.t And x2 = ib.r And y2 = ib.b ) 
		  Return
		End 
		removeShape(s)
		ib.l = x1
		ib.t = y1
		ib.r = x2
		ib.b = y2
		Local isout  := false
		For Local x := x1 Until x2  

			For Local y := y1 Until y2  

				Local l  := world.Get(ADDR(x,y))
				If( l = null ) 

					If( x >= 0 And x < width And y >= 0 And y < height ) 

						l = New  HaxeFastList< AABB > ()
						all.Add(l)
						world.Set(ADDR(x,y), l)
					Else  

						If( isout ) 
						   Continue
						End 
						isout = true
						l = out
					End 
				End 

				add(l,box)
			End 
		End 
	End 
	Method commit: Void() 

		'// NOTHING
	End 
	Method collide: Void() 

		For Local list := Eachin all 

			Local box1  := list.head
			While( Not( box1 = null ) ) 

				Local b  := box1.elt
				If( b.shape.body = staticBody ) 
				   Exit
				End 
				Local box2  := list.head
				While( Not( box2 = null ) ) 

					If( b.intersects2(box2.elt) And Not( box1 = box2 ) ) 
					   cb.onCollide(b.shape,box2.elt.shape)
					End 
					box2 = box2.nextItem
				End 

				box1 = box1.nextItem
			End 
		End 
	End 
	Method pick : HaxeFastList<  Shape >( box : AABB ) 

		Local nbits  := Self.nbits
		Local x1  := Int(box.l) Shr nbits
		Local y1  := Int(box.t) Shr nbits
		Local x2  := (Int(box.r) Shr nbits) + 1
		Local y2  := (Int(box.b) Shr nbits) + 1
		Local isout  := false
		Local shapes  := New  HaxeFastList<  Shape > ()
		For Local x := x1 Until x2  

			For Local y := y1 Until y2  

				Local l  := world.Get(ADDR(x,y))
				If( l = null ) 

					If( x >= 0 And x < width And y >= 0 And y < height ) 
					   Continue
					End 
					If( isout ) 
					   Continue
					End 
					isout = true
					l = out
				End 

				For Local b := Eachin l 

					If( b.intersects(box) ) 
					   shapes.Add(b.shape)
					End 
                End 
            End 
        End 

		Return shapes
	End 
	Method validate:Bool() 

		'// check internal data structures
		Return true
	End 
End 
