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

import fling.col.iaabb
import fling.shape

class AABB 
	 Field l:Float
	 Field b:Float
	 Field r:Float
	 Field t:Float
	 Field shape : Shape
	 Field prev : AABB
	 Field nextItem : AABB
	 Field bounds : IAABB
	 Method New(left,top,right,bottom) 

		Self.l = left
		Self.t = top
		Self.r = right
		Self.b = bottom
	End 
	  Method intersects( aabb : AABB ) 

		return Not(aabb.l > r Or aabb.r < l Or aabb.t > b Or aabb.b < t)
	End 
	  Method intersects2( aabb:AABB ) 

		return (l<=aabb.r And aabb.l<=r And t<=aabb.b And aabb.t<=b)
	End 
	  Method containsPoint( v : Vector ) 

		return Not(v.y < t Or v.y > b Or v.x < l Or v.x > r)
	End 
	 Method toString() 

		return "[l=" + l + " b=" + b + " r=" + r + " t=" + t + "]"
	End 
End 

