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
Import fling.demo.alldemo
Import fling.col.allcol
Import mojo

Class MainDemo Extends App 

	Field debug : Bool
	Field stopped : Bool
	Field recalStep : Bool
	Field world : World
	Field demo : demo.Demo
	Field draw : Bool
	Field curbf : Int
	Field frame : Int
	Field broadphases : BroadPhase[] = [BroadPhase(new SortedList()), BroadPhase(new Quantize(6)),BroadPhase(new BruteForce())]
	
	Method OnCreate() 
		frame = 0
		curbf = 0
		draw = true
		debug = false
		stopped = false
		SetDemo(New TitleDemo())
		SetUpdateRate(20)
		Print("Press 1-8 to change demo scene. Mouse click fires block.")
	End 
	Field updateTime:Int
	
	Method OnUpdate () 
	
		updateTime = Millisecs()
		'// Update
		Local Updates :=  demo.Updates
		If(  stopped  )
		    Updates = 0 
		End

		Local dt : Float = 1.0
		Local niter := 5
		For Local i := 0 Until Updates 
			demo.Update(dt/Updates)
			world.Update(dt/Updates,niter)
		End

		If( recalStep )
		   world.Update(0,1)
		End

		updateTime = Millisecs() - updateTime
		'Print updateTime
		If( MouseHit( MOUSE_LEFT) )
			FireBlock( MouseX(), MouseY())
		End

		CheckKeys()
	End
	
	Field fd : MojoDraw = new MojoDraw()
	Method OnRender ()
		'// draw
		Cls 0,0,0
		
		If( debug ) 
			'fd.boundingBox.line = 0x000000
			'fd.contact.line = 0xFF0000
			'fd.sleepingContact.line = 0xFF00FF
			'fd.drawCircleRotation = true
		End

		If( draw )
		   fd.DrawWorld(world)
		End
		
		If( debug ) 
			DrawDebugInfo(10,10)
		End
	End 
	
	Method CheckKeys() 
	
		If( KeyHit(32) )'SPACE
			debug = Not debug
		End

		If( KeyHit(66) ) 'B
			curbf = (curbf + 1) Mod broadphases.Length()
			world.SetBroadPhase(broadphases[curbf])
		End

		If( KeyHit(68) ) 'D
			draw = Not draw
		End

		If( KeyHit(49) ) '1
			SetDemo(new TitleDemo())
		End

		If( KeyHit(50) ) '2
			SetDemo(new DominoPyramid())
		End

		If( KeyHit(51) )'3
			SetDemo(new PyramidThree())
		End

		If( KeyHit(52) )'4
			SetDemo(new BoxPyramidDemo())
		End

		If( KeyHit(53) )'5
			SetDemo(new BasicStack())
		End

		If( KeyHit(54) )'6
			SetDemo(new Jumble())
		End

		If( KeyHit(55) )'7
			SetDemo(new PentagonRain())
		End

		If( KeyHit(56) )'8
			SetDemo(new SegmentDemo())
		End		
		'If( KeyHit(57) )'9
		'	SetDemo(new demo.Test())
		'End
		
		If( KeyHit(27) )'ESC
			SetDemo(demo)
		End
 
	End 

	Method SetDemo : Void ( demo : Demo ) 
	 
		Self.demo = demo
		stopped = false
		recalStep = false
		world = new World(new AABB(-2000,-2000,2000,2000),broadphases[curbf])
		demo.Start(world)
	End 
	
	Method DrawDebugInfo : String(x:Int, y:Int) 
	 
		Local t := world.timer
		Local tot := t.total
		Local linegap = 12
		
		
		DrawText("Update(ms): " + updateTime,x,y)
		y += linegap
			'"Demo=" + demo + "/n" +
		DrawText("Bodies=" + world.bodies.Count(),x,y)
		y += linegap
			'''"Arbit=" + Lambda.filter(world.arbiters,Method(a)Return Not a.sleeping).length + " / " + Lambda.count(world.arbiters),
			'"BF=" + world.broadphase + "\n" +
			'"COLS=" + world.activeCollisions+ " / "+world.testedCollisions + "\n" +
		DrawText(t.Format("all"),x,y)
		y += linegap
		DrawText(t.Format("col"),x,y)
		y += linegap
		DrawText(t.Format("island"),x,y)
		y += linegap
		DrawText(t.Format("solve"),x,y)
#rem
		Local nislands := Lambda.count(world.islands)
		If( nislands > 5 )
			log.Push("Islands="+nislands)
		Else
			For Local i := Eachin world.islands 
			
				Local str := "Island= #" + Lambda.count(i.bodies)
				If(  i.sleeping  )
				    str +=" SLEEP" 
				Else
				    str += " e=" + Math.ceil(i.energy*1000)/1000
				End
 			End

			Local b := i.bodies.first()
			str += " (" + Math.ceil(b.x) + "," + Math.ceil(b.y) + ")"
			log.Push(str)
		End
#end
	End 
	
	Method FireBlock( mouseX : Float, mouseY : Float ) 
	 
		Local pos := new Vector(DeviceWidth(),DeviceHeight())
		pos.x += 100
		pos.y /= 3
		Local v := new Vector( mouseX - pos.x, mouseY - pos.y )
		Local k := 15 / v.Length()
		v.x *= k
		v.y *= k
		Local b := new Body(0,0)
		b.Set(pos,0,v,2)
		b.AddShape( Shape.MakeBox(20,20, Constants.NaN, Constants.NaN,new Material(0.0, 1, 5)) )
		world.AddBody(b)
	End 
End 

Function Main() 
	new MainDemo
End 

