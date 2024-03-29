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

#rem
	This file contains a number of classes than serve to imitate the behaviour of
	haXe classes or simply to ease translation of naming conventions. Some code is
	copied wholesale from the standard monkey modules.
	
	Eventually they will be reduced to only those classes that are needed for 
	functional reasons.
#end

Class Math
	
	Function Round:Int( f : Float )
		If( Ceil(f) - f > f - Floor(f))
			Return Floor(f)
		Else
			Return Ceil(f)
		End
	End
	
	Const RadsPerDegree : Float = TWOPI/360.0
	Const DegreesPerRad : Float = 360.0/TWOPI
	 
	Function Sin: Float( rads: Float)
		Return monkey.math.Sin( rads * DegreesPerRad )
	End

	Function Cos: Float( rads: Float)
		Return monkey.math.Cos( rads * DegreesPerRad )
	End

	Function ATan2: Float( x: Float, y: Float)
		Return monkey.math.ATan2( x, y ) * RadsPerDegree
	End
End

Class HaxeArray<T>

Private
	Field arr : T[100]
	Const lengthInc : Int = 100
	
Public
	Field length : Int = 0
	
	Method Get:T( index:Int)
		If( index >=0 And arr.Length() > index )
			Return arr[index]
		Else
			Return null
		End
	End
	
	Method Set( index:Int, item:T )
		If( index >= arr.Length() )
			arr = arr.Resize(index+1)
		End
		arr[index] = item
	End
	
	Method Push( item:T )
		If( length = arr.Length() )
			arr = arr.Resize(length+lengthInc)
		End

		arr[length] = item
		length += 1
	End
	
	Method Pop:T()
		If( length >= 0 )
			length -= 1
			Return arr[length]
		Else
			Return Null
		End
	End
End

Class HaxeFastList<T>
	
	Field _head:HaxeFastCell<T> = null
	Field _tail:HaxeFastCell<T> = null
	
	Method Add( item:T )
		AddFirst(item)
	End

	Method Pop:T()
		Return RemoveFirst()
	End
	
	Method Equals( lhs:Object,rhs:Object )
		Return lhs=rhs
	End
	
	Method Clear()
		_head=null
		_tail=null
	End

	Method Count()
		Local n,node:=_head
		While node<>null
			node=node.nextItem
			n+=1
		Wend
		Return n
	End
	
	Method IsEmpty?()
		Return _head = null
	End
	
	Method FirstNode:HaxeFastCell<T>()
		Return _head
	End
	
	Method First:T()
		If( _head <> null )
			Return _head.elt
		End
		Return null
	End

	Method Last:T()
		If( _tail <> null )
			Return _tail.elt
		End
		Return null
	End
	
	Method AddFirst:HaxeFastCell<T>( data:T )
		Local added := New HaxeFastCell<T>( _head,null,data )
		_head = added
		If( _tail = null )
			_tail = added
		End
		Return added
	End

	Method AddLast:HaxeFastCell<T>( data:T )
		Local added := New HaxeFastCell<T>( null,_tail,data )
		_tail = added
		If( _head = null )
			_head = added
		End
		Return added
	End

	'I think this should GO!
	Method Remove : Bool ( value:T )
		Return RemoveFirst(value)
	End
	
	Method RemoveFirst : Bool( value:T )
		Local node:=_head
		While node<>null
			If Equals( node.elt,value ) 
				Remove(node)
				Return True
			End
			node=node.nextItem
		Wend
		Return False
	End

	Method RemoveEach( value:T )
		Local node:=_head
		While node<>null
			Local nextnode:=node.nextItem
			If Equals( node.elt,value ) 
				Remove(node)
			End
			node = nextNode
		Wend
	End

	Method RemoveFirst:T()
		If( IsEmpty() )
			Return null
		End
		Local data:T=_head.elt
		Remove(_head)
		Return data
	End

	Method RemoveLast:T()
		If( IsEmpty() )
			Return null
		End
		Local data:T=_tail.elt
		Remove(_tail)
		Return data
	End

	
	Method Remove(cell:HaxeFastCell<T>)
		If( cell = _tail )
			_tail = cell._pred
		End
		If( cell = _head )
			_head = cell.nextItem
		End
		If( cell.nextItem <> null )
			cell.nextItem._pred=cell._pred
		End
		If( cell._pred <> null )	
			cell._pred.nextItem=cell.nextItem
		End
	End
	
	Method ObjectEnumerator:Enumerator<T>()
		Return New Enumerator<T>( Self )
	End
	
	
End

Class HaxeFastCell<T>

	'create a _head node
	Method New()
		nextItem=null
		_pred=null
	End

	Method New( data:T, succ:HaxeFastCell<T>)
		nextItem=succ
		_pred=succ._pred
		If( nextItem <> null )
			nextItem._pred=Self
		End
		If( _pred <> null )
			_pred.nextItem=Self
		End
		elt=data
	End

	'create a link node
	Method New( succ:HaxeFastCell<T>,pred:HaxeFastCell<T>,data:T )
		nextItem=succ
		_pred=pred
		If( nextItem <> null )
			nextItem._pred=Self
		End
		If( _pred <> null )
			_pred.nextItem=Self
		End
		elt=data
	End
	
	Method Value:T()
		Return elt
	End

	Field elt:T
	Field nextItem:HaxeFastCell<T>

Private

	Field _pred:HaxeFastCell<T>

End


Class Enumerator<T>

	Method New( list:HaxeFastList<T> )
		_list=list
		_curr=list._head
	End Method

	Method HasNext:Bool()
		Return _curr<>null
	End 

	Method NextObject:T()
		Local data:T=_curr.elt
		_curr=_curr.nextItem
		Return data
	End

Private
	
	Field _list:HaxeFastList<T>
	Field _curr:HaxeFastCell<T>

End


