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

Import mojo
Import fling.datahash
Import fling.haxetypes.haxetypes

Class Timer 
	
	Field times : HaxeArray<FloatObject>
	Field curs : HaxeArray<StringObject>
	Field datas : StringMap<DataHash>
	Field count : Int
	Field total : Float
	
	Method New() 
		count = 0
		total = 0.0
		datas = New StringMap<DataHash>()
		times = New HaxeArray<FloatObject>()
		curs = New HaxeArray<StringObject>()
	End 
	
	Method Start( phase : String ) 
		times.Push(Millisecs())
		curs.Push(phase)
	End 

	Method Stop() 
		count += 1
		Local dt  := (Millisecs() - times.Pop())
		Local name  := curs.Pop()
		Local data  := datas.Get(name)

		If( data = null ) 
			data = New DataHash( 0.0, 0.0 )
			datas.Set(name,data)
		End 

		data.total += dt
		data.avg = data.total/count
		
		If( curs.length = 0 ) 
		   total += dt
		End 
	End 
	
	Method GetTotal:Float( name : String ) 
		Local data  := datas.Get(name)

		If( data = null ) 
		  Return 0.0
		End

		Return data.total
	End 
	
	Method Format:String( name : String ) 
		Local data  := datas.Get(name)

		If( data = null ) 
		  Return name + " ????"
		End
		Local percent := "" + ((data.total/total)*100)
		percent = percent[..4]
		Return name + " : "+Int(data.avg) + " ("+ percent +"%)"
	End 
	
End 

