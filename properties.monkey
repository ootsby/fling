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

class Properties 
	Global PID  := 0
#rem
'/**
		The amount the linear speed of the object is reduced by time
	'**/
#end
	 Field linearFriction : Float
#rem
'/**
		The amount the angular speed of the object is reduced by time
	'**/
#end
	 Field angularFriction : Float
#rem
'/**
		The percentage the object position will be modified if it is inside another object
	'**/
#end
	 Field biasCoef : Float
#rem
'/**
		The maximum movement of the object
	'**/
#end
	 Field maxMotion : Float
#rem
'/**
		The maximum distance at which we can interpenerate another object without applying position bias
	'**/
#end
	 Field maxDist : Float
	'// internal
	 Field id : Int
	 Field count : Int
	 Field lfdt : Float
	 Field afdt : Float
	
	 Method New( linearFriction : Float, angularFriction : Float, biasCoef : Float, maxMotion : Float, maxDist : Float ) 
		PID += 1
		id = PID
		count = 0
		Self.linearFriction = linearFriction
		Self.angularFriction = angularFriction
		Self.biasCoef = biasCoef
		Self.maxMotion = maxMotion
		Self.maxDist = maxDist
	End 
End 