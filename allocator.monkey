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

Class Allocator 
	
	Field contactPool : Contact
	Field islandPool : Island
	 
	Method New() 
	End 
	
	Method allocIsland : Island  (w:World)
		Local i  := islandPool
		If( i = null )
		Return New Island(w)
		Else 

			islandPool = i.allocNext
		Return i
		End 
	End 

	Method freeIsland( i : Island ) 
		i.bodies.Clear()
		i.ClearArbiters()
		i.joints.Clear()
		i.sleeping = false
		i.allocNext = islandPool
		islandPool = i
	End 

	Method allocArbiter : Arbiter  ()
		Return New Arbiter(Self)
	End 

	Method freeArbiter( a : Arbiter ) 
	End 

	Method allocContact : Contact  ()
		Local c  := contactPool

		If( c = null )
		Return New Contact()
		Else 
			contactPool = c.nextItem
		Return c
		End 
	End 

	Method freeContact( c : Contact ) 
		c.nextItem = contactPool
		contactPool = c
	End 

	Method freeAllContacts( c : Contact ) 
		While( Not( c = null ) ) 
			Local nextItem  := c.nextItem
			c.nextItem = contactPool
			contactPool = c
			c = nextItem
		End 
	End 
End 
