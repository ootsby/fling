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
import fling.shape

class SortedList Extends BroadPhase 
	Field boxes : AABB
	Field callb : BroadCallback
	 Method New() 

	End 
	 Method init : Void ( bounds : AABB, cb : BroadCallback, staticBody : Body ) 

		Self.callb = cb
		boxes = null
	End 
	Method addSort : Void( b : AABB ) 

		Local cur  := boxes
		Local prev : AABB = null
		While( Not( cur = null ) And cur.t < b.t ) 

			prev = cur
			cur = cur.nextItem
		End 

		b.prev = prev
		b.nextItem = cur
		If( prev = null )
			boxes = b
		Else  
			prev.nextItem = b
		End 
		If( Not( cur = null ) ) 
		   cur.prev = b
		End 
	End 
	 Method addShape: Void( s : Shape ) 

		Local b  := s.aabb
		b.shape = s
		addSort(b)
	End 
	 Method removeShape: Void( s : Shape ) 

		Local b  := s.aabb
		Local nextItem  := b.nextItem
		Local prev  := b.prev
		If( prev = null )
			boxes = nextItem
		Else  
			prev.nextItem = nextItem
		End 
		If( Not( nextItem = null ) ) 
		   nextItem.prev = prev
		End 
	End 
	 Method collide: Void() 

		Local b1  := boxes
		While( Not( b1 = null ) ) 

			Local b2  := b1.nextItem
			Local bottom  := b1.b
			While( Not( b2 = null ) ) 

				If( b2.t > bottom ) 
				   Exit
				End 
				If( b1.intersects2(b2) ) 
				   callb.onCollide(b1.shape,b2.shape)
				End 
				b2 = b2.nextItem
			End 

			b1 = b1.nextItem
		End 
	End 
	 Method pick : HaxeFastList<Shape>( box : AABB ) 

		Local shapes  := New  HaxeFastList<  Shape > ()
		Local b  := boxes
		'// skip top boxes
		While( Not( b = null ) ) 

			If( b.t <= box.b ) 
			   Exit
			End 
			b = b.nextItem
		End 

		While( Not( b = null ) ) 

			If( b.intersects(box) ) 
			   shapes.Add(b.shape)
			End 
			b = b.nextItem
		End 

	Return shapes
	End 
	 Method syncShape: Void( s : Shape ) 

		Local b  := s.aabb
		Local prev  := b.prev
		Local nextItem  := b.nextItem
		If( Not( prev = null ) And prev.t > b.t ) 

			prev.nextItem = nextItem
			If( Not( nextItem = null ) ) 
			   nextItem.prev = prev
			End 
			addSort(b)
		Else  If( Not( nextItem = null ) And nextItem.t < b.t ) 

			If( prev = null )
				boxes = nextItem
			Else  
				prev.nextItem = nextItem
			End 
			nextItem.prev = prev
			addSort(b)
		End 
	End 
	 Method commit: Void() 

		'// nothing, syncShape already sorted the list
	End 
	 Method validate:Bool() 

		Local cur  := boxes
		While( Not( cur = null ) ) 

			Local nextItem  := cur.nextItem
			If( Not( nextItem = null ) And nextItem.t < cur.t ) 
			  Return false
			End 
			cur = nextItem
		End 

	Return true
	End 
End 
