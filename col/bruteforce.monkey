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
import fling.haxetypes.haxetypes
Import fling.shape
Import fling.body

Class BruteForce Extends BroadPhase 
	Field shapes :  HaxeFastList< Shape > 
	Field callb : BroadCallback
	Method New() 

	End

	Method Init : Void ( bounds : AABB, cb : BroadCallback, staticBody : Body ) 

		Self.callb = callb
		shapes = New  HaxeFastList< Shape > ()
	End

	Method AddShape: Void( s : Shape ) 

		shapes.Add(s)
	End

	Method RemoveShape: Void( s : Shape ) 

		shapes.Remove(s)
	End

	Method Collide: Void() 

		Local s1  := shapes.head
		While( Not( s1 = null ) ) 

			Local box1  := s1.elt.aabb
			Local s2  := s1.nextItem
			While( Not( s2 = null ) ) 

				If( box1.Intersects2(s2.elt.aabb) ) 
				   callb.OnCollide(s1.elt,s2.elt)
				End

				s2 = s2.nextItem
			End 

			s1 = s1.nextItem
		End 
	End

	Method Pick : HaxeFastList<  Shape >( box : AABB ) 

		Local shapes  := New  HaxeFastList<  Shape > ()
		For Local s := Eachin Self.shapes 

			If( s.aabb.Intersects(box) ) 
			   shapes.Add(s)
			End 
        End 

		Return shapes
	End

	Method SyncShape: Void( s : Shape ) 

		'// nothing
	End

	Method Commit: Void() 

		'// nothing
	End

	Method Validate :Bool() 

		Return true
	End 
End 

