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

Class Arbiter 
	
	Field contacts : Contact
	Field friction : Float
	Field restitution : Float
	Field bias : Float
	Field maxDist : Float
	Field s1 : Shape
	Field s2 : Shape
	Field stamp : Int
	Field island : Island
	Field allocator : Allocator
	Field sleeping : Bool
	
	Method New(alloc : Allocator) 
		allocator = alloc
	End 

	Method assign( s1 : Shape, s2 : Shape ) 
		Self.s1 = s1
		Self.s2 = s2
		Local m1  := s1.material
		Local m2  := s2.material
		Local p1  := s1.body.properties
		Local p2  := s2.body.properties
		If(  m1.restitution > m2.restitution  ) 

		    restitution =m1.restitution 
		Else  

		    restitution = m2.restitution
		End 

		friction = Sqrt(m1.friction * m2.friction)
		If( (p1.biasCoef > p2.biasCoef)  )
		    bias = p1.biasCoef 
		Else  

		    bias = p2.biasCoef
		End 

		If( (p1.maxDist > p2.maxDist)  )
		    maxDist = p2.maxDist 
		Else  

		    maxDist = p1.maxDist
		End 
	End 

	Method injectContact( p : Vector, n : Vector, nCoef : Float, dist : Float, hash : Int ) 
		Local c  := contacts
		While( Not( c = null ) ) 

			If( hash = c.hash ) 
			   Exit
			End 
			c = c.nextItem
		End 

		If( c = null ) 

			c = allocator.allocContact()
			c.hash = hash
			c.jnAcc = 0
			c.jtAcc = 0
			c.nextItem = contacts
			contacts = c
		End 

		'// init datas
		c.px = p.x
		c.py = p.y
		c.nx = n.x * nCoef
		c.ny = n.y * nCoef
		c.dist = dist
		c.updated = true
	End 
	Method bodyImpulse( c : Contact, b1 : Body, b2 : Body, cjTx : Float, cjTy : Float ) 

		b1.v.x -= cjTx * b1.invMass
		b1.v.y -= cjTy * b1.invMass
		b1.w -= b1.invInertia * (c.r1x * cjTy - c.r1y * cjTx)
		b2.v.x += cjTx * b2.invMass
		b2.v.y += cjTy * b2.invMass
		b2.w += b2.invInertia * (c.r2x * cjTy - c.r2y * cjTx)
	End 
	Method preStep( dt : Float ) 

		Local b1  := s1.body
		Local b2  := s2.body
		Local mass_sum  : Float = b1.invMass + b2.invMass
		Local c  := contacts
		Local prev :Contact = null
		While( Not( c = null ) ) 

			If( Not(c.updated) ) 

				Local old  := c
				c = c.nextItem
				allocator.freeContact(old)
				If( prev = null )
					contacts = c
				Else  
					prev.nextItem = c
				End 
				Continue
			End 

			c.updated = false
			'// local anchors and their normals
			c.r1x = c.px - b1.x
			c.r1y = c.py - b1.y
			c.r2x = c.px - b2.x
			c.r2y = c.py - b2.y
			c.r1nx = -c.r1y
			c.r1ny =  c.r1x
			c.r2nx = -c.r2y
			c.r2ny =  c.r2x
			'// we will calculate the factor which is the inverse of
			'// 1/M1 + 1/M2 + (R1 x N) ^ 2 / I1 + (R2 x N) ^ 2 / I2
			'// in the past (R1.R1 - (R1.N)^2) was used in Box2D but
			'// this is no longer the case
			'// normal mass
			Local r1cn  : Float = c.r1x * c.ny - c.r1y * c.nx
			Local r2cn  : Float = c.r2x * c.ny - c.r2y * c.nx
			Local kn  : Float = mass_sum + (b1.invInertia * r1cn * r1cn) + (b2.invInertia * r2cn * r2cn)
			c.nMass = 1.0 / kn
			'// tangent mass
			Local tx : Float = -c.ny
			Local ty  : Float = c.nx
			Local r1ct  : Float = c.r1x * ty - c.r1y * tx
			Local r2ct  : Float = c.r2x * ty - c.r2y * tx
			Local kt  := mass_sum + b1.invInertia * r1ct * r1ct + b2.invInertia * r2ct * r2ct
			c.tMass = 1.0 / kt
			'// bias
			c.bias = -bias * (c.dist + maxDist)
			c.jBias = 0
			'// vrel = N . ((V2 + W2 x N2) - (V1 + W1 x N1))
			Local vrx  : Float = (c.r2nx * b2.w + b2.v.x) - (c.r1nx * b1.w + b1.v.x)
			Local vry  : Float = (c.r2ny * b2.w + b2.v.y) - (c.r1ny * b1.w + b1.v.y)
			c.bounce = (c.nx * vrx + c.ny * vry) * restitution * dt
			'// apply impulse
			Local cjTx  : Float = (c.nx * c.jnAcc) + (tx * c.jtAcc)
			Local cjTy  : Float = (c.ny * c.jnAcc) + (ty * c.jtAcc)
			bodyImpulse(c,b1,b2,cjTx,cjTy)
			prev = c
			c = c.nextItem
		End 
	End 
	Method applyImpulse() 

		Local b1  := s1.body
		Local b2  := s2.body
		Local c  := contacts
		While( Not( c = null ) ) 

			'// calculate the relative bias velocities
			Local vbn  : Float =
				((c.r2nx * b2.w_bias + b2.v_bias.x) - (c.r1nx * b1.w_bias + b1.v_bias.x)) * c.nx +
				((c.r2ny * b2.w_bias + b2.v_bias.y) - (c.r1ny * b1.w_bias + b1.v_bias.y)) * c.ny
			'// calculate and clamp the bias impulse
			Local jbn  : Float = (c.bias - vbn) * c.nMass
			Local jbnOld  : Float = c.jBias
			c.jBias = jbnOld + jbn
			If( c.jBias < 0 ) 
			   c.jBias = 0
			End 
			jbn = c.jBias - jbnOld
			'// apply the bias impulse
			Local cjTx  : Float = c.nx * jbn
			Local cjTy  : Float = c.ny * jbn
			b1.v_bias.x -= cjTx * b1.invMass
			b1.v_bias.y -= cjTy * b1.invMass
			b1.w_bias   -= b1.invInertia * (c.r1x * cjTy - c.r1y * cjTx)
			b2.v_bias.x += cjTx * b2.invMass
			b2.v_bias.y += cjTy * b2.invMass
			b2.w_bias   += b2.invInertia * (c.r2x * cjTy - c.r2y * cjTx)
			'// calculate the relative velocity
			Local vrx  : Float = (c.r2nx * b2.w + b2.v.x) - (c.r1nx * b1.w + b1.v.x)
			Local vry  : Float = (c.r2ny * b2.w + b2.v.y) - (c.r1ny * b1.w + b1.v.y)
			'// calculate and clamp the normal impulse
			Local jn  : Float = (c.bounce + (vrx * c.nx + vry * c.ny)) * c.nMass
			Local jnOld  : Float = c.jnAcc
			c.jnAcc = jnOld - jn
			If( c.jnAcc < 0 ) 
			   c.jnAcc = 0
			End 
			jn = c.jnAcc - jnOld
			'// calculate the relative tangent velocity
			Local vrt  : Float = c.nx * vry - c.ny * vrx
			'// calculate and clamp the friction impulse
			Local jtMax : Float = friction * c.jnAcc
			Local jt  : Float = vrt * c.tMass
			Local jtOld  : Float = c.jtAcc
			c.jtAcc = jtOld - jt
			If( c.jtAcc < -jtMax ) 
			   c.jtAcc = -jtMax 
			Else If( c.jtAcc > jtMax ) 
				c.jtAcc = jtMax
			End 
			jt = c.jtAcc - jtOld
			'// apply the impulse
			Local cjTx2  : Float = c.nx * jn - c.ny * jt
			Local cjTy2  : Float = c.ny * jn + c.nx * jt
			bodyImpulse(c,b1,b2,cjTx2,cjTy2)
			c = c.nextItem
		End 
	End 
End 

