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

Class Constants 
	
	Const POSITIVE_INFINITY := 3.401e38
	Const NaN : Float  = 3.402e38'Sqrt(-1)
	Const FMAX  := 3.4e38 'single precision float?
	Const FMIN  := -FMAX
	Const EPSILON  := 1e-30 'I have no reason for this specific value
	Const WORLD_BOUNDS_FREQ  := 120
	Global DEFAULT_MATERIAL  := New Material( 0.001, 0.81, 1 )
	Global DEFAULT_PROPERTIES  := New Properties( 0.999, 0.999, 0.1, FMAX, 0.5 )
	'// sleep
	Const SLEEP_BIAS  := 0.95
	Const DEFAULT_SLEEP_EPSILON  := 0.002
	Const WAKEUP_FACTOR  := 2
	Const ANGULAR_TO_LINEAR  := 30.0
	 '// 1 degree ~= 0.5 pix

	Function XROT : Float( v : Vector, b : Body ) 
		Return v.x * b.rcos - v.y * b.rsin
	End 

	Function YROT : Float( v : Vector, b : Body ) 
		Return v.x * b.rsin + v.y * b.rcos
	End 
End 

