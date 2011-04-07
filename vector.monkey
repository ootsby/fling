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

class Vector 

	Field x:Float
	Field y:Float
	Field nextItem:Vector

	Method New( px : Float, py : Float ) 
		x = px
		y = py
	End 

	Method clone:Vector() 
	Return New Vector(x,y)
	End 
	
	Method set( px : Float, py : Float) 
		x = px
		y = py
	End 

	Method dot:Float( v : Vector ) 
	Return x * v.x + y * v.y
	End 

	Method cross:Float( v : Vector ) 
	Return x * v.y - y * v.x
	End 

	Method plus:Vector( v : Vector ) 
	Return New Vector(x + v.x, y + v.y)
	End 

	Method minus : Vector  ( v : Vector )
	Return New Vector(x - v.x, y - v.y)
	End 

	Method mult:Vector( s : Float ) 
	Return New Vector(x * s, y * s)
	End 
	
	Method length:Float() 
	Return Sqrt(x * x + y * y)
	End 

	Method toString() 
	Return"("+(Round(x*100)/100)+","+(Round(y*100)/100)+")"
	End 

	Function normal:Vector( x : Float, y : Float ) 
		Local d  := Sqrt(x * x + y * y)
		Local k  :=  1 / d
	
		If(  d < Constants.EPSILON  ) 
		    k = 0 
		End 

	Return New Vector( -y * k , x * k )
	End 
End 

