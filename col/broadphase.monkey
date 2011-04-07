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
Import fling.body
Import fling.haxetypes.haxetypes

Class BroadCallback Abstract 

	Method OnCollide : Bool ( s1 : Shape, s2 : Shape ) Abstract
End 

Class BroadPhase Abstract 

	'// initialize when added into world
	Method Init : Void ( bounds : AABB, cb : BroadCallback, staticBody : Body ) Abstract
	'// modify the shape list
	Method AddShape : Void ( s : Shape ) Abstract
	Method RemoveShape : Void ( s : Shape ) Abstract
	'// when modified : one sync per shape then one final commit
	Method SyncShape : Void ( s : Shape ) Abstract
	Method Commit : Void () Abstract
	'// perform the collisions
	Method Collide : Void () Abstract
	'// pick the content of the box
	Method Pick : HaxeFastList<  Shape >  ( bounds : AABB ) Abstract
	'// check the validity of inner datas (for debug)
	Method Validate : Bool () Abstract
End 

