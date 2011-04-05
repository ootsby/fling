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

import fling.demo.alldemo

class FontArray 

	Global WIDTH  := 5
	Global HEIGHT  := 10
 	Global exclamation  := [
		0,1,1,0,0,
		0,1,1,0,0,
		0,1,1,0,0,
		0,1,1,0,0,
		0,1,1,0,0,
		0,0,0,0,0,
		0,1,1,0,0,
		0,1,1,0,0,
		0,0,0,0,0,
		0,0,0,0,0]
	Global num_0  := [
		0,0,0,0,0,
		1,1,1,1,0,
		1,0,0,1,0,
		1,0,0,1,0,
		1,0,0,1,0,
		1,0,0,1,0,
		1,0,0,1,0,
		1,1,1,1,0,
		0,0,0,0,0,
		0,0,0,0,0]
	Global num_1  := [
		0,0,0,0,0,
		1,1,0,0,0,
		0,1,0,0,0,
		0,1,0,0,0,
		0,1,0,0,0,
		0,1,0,0,0,
		0,1,0,0,0,
		0,1,0,0,0,
		0,0,0,0,0,
		0,0,0,0,0]
	Global num_2  := [
0,0,0,0,0,
1,1,1,1,0,
0,0,0,1,0,
0,0,0,1,0,
1,1,1,1,0,
1,0,0,0,0,
1,0,0,0,0,
1,1,1,1,0,
0,0,0,0,0,
0,0,0,0,0]
 Global num_3  := [
0,0,0,0,0,
1,1,1,1,0,
0,0,0,1,0,
0,0,0,1,0,
0,1,1,1,0,
0,0,0,1,0,
0,0,0,1,0,
1,1,1,1,0,
0,0,0,0,0,
0,0,0,0,0]
 Global num_4  := [
0,0,0,0,0,
1,0,0,1,0,
1,0,0,1,0,
1,0,0,1,0,
1,0,0,1,0,
1,1,1,1,0,
0,0,0,1,0,
0,0,0,1,0,
0,0,0,0,0,
0,0,0,0,0]
 Global num_5  := [
0,0,0,0,0,
1,1,1,1,0,
1,0,0,0,0,
1,0,0,0,0,
1,1,1,1,0,
0,0,0,1,0,
0,0,0,1,0,
1,1,1,1,0,
0,0,0,0,0,
0,0,0,0,0]
 Global num_6  := [
0,0,0,0,0,
1,1,1,1,0,
1,0,0,0,0,
1,1,1,1,0,
1,0,0,1,0,
1,0,0,1,0,
1,0,0,1,0,
1,1,1,1,0,
0,0,0,0,0,
0,0,0,0,0]
 Global num_7  := [
0,0,0,0,0,
1,1,1,1,0,
0,0,0,1,0,
0,0,1,0,0,
0,0,1,0,0,
0,1,0,0,0,
0,1,0,0,0,
0,1,0,0,0,
0,0,0,0,0,
0,0,0,0,0]
 Global num_8  := [
0,0,0,0,0,
1,1,1,1,0,
1,0,0,1,0,
1,0,0,1,0,
1,1,1,1,0,
1,0,0,1,0,
1,0,0,1,0,
1,1,1,1,0,
0,0,0,0,0,
0,0,0,0,0]
 Global num_9  := [
0,0,0,0,0,
1,1,1,1,0,
1,0,0,1,0,
1,0,0,1,0,
1,0,0,1,0,
1,1,1,1,0,
0,0,0,1,0,
1,1,1,1,0,
0,0,0,0,0,
0,0,0,0,0]
 Global a_lower  := [
0,0,0,0,0,
0,0,0,0,0,
0,0,0,0,0,
1,1,1,1,0,
0,0,0,1,0,
1,1,1,1,0,
1,0,0,1,0,
1,1,1,1,0,
0,0,0,0,0,
0,0,0,0,0]
 Global b_lower  := [
1,0,0,0,0,
1,0,0,0,0,
1,0,0,0,0,
1,1,1,1,0,
1,0,0,1,0,
1,0,0,1,0,
1,0,0,1,0,
1,1,1,1,0,
0,0,0,0,0,
0,0,0,0,0]
 Global c_lower  := [
0,0,0,0,0,
0,0,0,0,0,
0,0,0,0,0,
1,1,1,1,0,
1,0,0,0,0,
1,0,0,0,0,
1,0,0,0,0,
1,1,1,1,0,
0,0,0,0,0,
0,0,0,0,0]
 Global d_lower  := [
0,0,0,1,0,
0,0,0,1,0,
0,0,0,1,0,
1,1,1,1,0,
1,0,0,1,0,
1,0,0,1,0,
1,0,0,1,0,
1,1,1,1,0,
0,0,0,0,0,
0,0,0,0,0]
 Global e_lower  := [
0,0,0,0,0,
0,0,0,0,0,
0,0,0,0,0,
1,1,1,1,0,
1,0,0,1,0,
1,1,1,1,0,
1,0,0,0,0,
1,1,1,1,0,
0,0,0,0,0,
0,0,0,0,0]
 Global f_lower  := [
1,1,1,1,0,
1,0,0,0,0,
1,0,0,0,0,
1,1,1,0,0,
1,0,0,0,0,
1,0,0,0,0,
1,0,0,0,0,
1,0,0,0,0,
0,0,0,0,0,
0,0,0,0,0]
 Global g_lower  := [
0,0,0,0,0,
0,0,0,0,0,
0,0,0,0,0,
1,1,1,1,0,
1,0,0,1,0,
1,0,0,1,0,
1,0,0,1,0,
1,1,1,1,0,
0,0,0,1,0,
1,1,1,1,0]
 Global h_lower  := [
1,0,0,0,0,
1,0,0,0,0,
1,0,0,0,0,
1,1,1,1,0,
1,0,0,1,0,
1,0,0,1,0,
1,0,0,1,0,
1,0,0,1,0,
0,0,0,0,0,
0,0,0,0,0]
 Global i_lower  := [
0,0,0,0,0,
1,0,0,0,0,
0,0,0,0,0,
1,0,0,0,0,
1,0,0,0,0,
1,0,0,0,0,
1,0,0,0,0,
1,0,0,0,0,
0,0,0,0,0,
0,0,0,0,0]
 Global j_lower  := [
0,0,0,0,0,
1,1,0,0,0,
0,0,0,0,0,
0,1,0,0,0,
0,1,0,0,0,
0,1,0,0,0,
0,1,0,0,0,
0,1,0,0,0,
1,1,0,0,0,
0,0,0,0,0]
 Global k_lower  := [
0,0,0,0,0,
1,0,0,0,0,
1,0,0,0,0,
1,0,0,1,0,
1,0,1,0,0,
1,1,0,0,0,
1,0,1,0,0,
1,0,0,1,0,
0,0,0,0,0,
0,0,0,0,0]
 Global l_lower  := [
0,0,0,0,0,
1,0,0,0,0,
1,0,0,0,0,
1,0,0,0,0,
1,0,0,0,0,
1,0,0,0,0,
1,0,0,0,0,
1,1,0,0,0,
0,0,0,0,0,
0,0,0,0,0]
 Global m_lower  := [
0,0,0,0,0,
0,0,0,0,0,
0,0,0,0,0,
1,1,1,1,1,
1,0,1,0,1,
1,0,1,0,1,
1,0,1,0,1,
1,0,1,0,1,
0,0,0,0,0,
0,0,0,0,0]
 Global n_lower  := [
0,0,0,0,0,
0,0,0,0,0,
0,0,0,0,0,
1,1,1,1,0,
1,0,0,1,0,
1,0,0,1,0,
1,0,0,1,0,
1,0,0,1,0,
0,0,0,0,0,
0,0,0,0,0]
 Global o_lower  := [
0,0,0,0,0,
0,0,0,0,0,
0,0,0,0,0,
1,1,1,1,0,
1,0,0,1,0,
1,0,0,1,0,
1,0,0,1,0,
1,1,1,1,0,
0,0,0,0,0,
0,0,0,0,0]
 Global p_lower  := [
0,0,0,0,0,
0,0,0,0,0,
0,0,0,0,0,
1,1,1,1,0,
1,0,0,1,0,
1,0,0,1,0,
1,0,0,1,0,
1,1,1,1,0,
1,0,0,0,0,
1,0,0,0,0]
 Global q_lower  := [
0,0,0,0,0,
0,0,0,0,0,
0,0,0,0,0,
1,1,1,1,0,
1,0,0,1,0,
1,0,0,1,0,
1,0,0,1,0,
1,1,1,1,0,
0,0,0,1,0,
0,0,0,1,0]
 Global r_lower  := [
0,0,0,0,0,
0,0,0,0,0,
0,0,0,0,0,
1,1,1,1,0,
1,0,0,1,0,
1,0,0,0,0,
1,0,0,0,0,
1,0,0,0,0,
0,0,0,0,0,
0,0,0,0,0]
 Global s_lower  := [
0,0,0,0,0,
0,0,0,0,0,
0,0,0,0,0,
1,1,1,1,0,
1,0,0,0,0,
1,1,1,1,0,
0,0,0,1,0,
1,1,1,1,0,
0,0,0,0,0,
0,0,0,0,0]
 Global t_lower  := [
0,0,0,0,0,
0,0,0,0,0,
1,0,0,0,0,
1,1,0,0,0,
1,0,0,0,0,
1,0,0,0,0,
1,0,0,0,0,
1,1,1,0,0,
0,0,0,0,0,
0,0,0,0,0]
 Global u_lower  := [
0,0,0,0,0,
0,0,0,0,0,
1,0,0,0,0,
1,0,0,1,0,
1,0,0,1,0,
1,0,0,1,0,
0,0,0,1,0,
1,1,1,1,0,
0,0,0,0,0,
0,0,0,0,0]
 Global v_lower  := [
0,0,0,0,0,
0,0,0,0,0,
0,0,0,0,0,
1,0,0,0,1,
1,0,0,0,1,
0,1,0,1,0,
0,1,0,1,0,
0,0,1,0,0,
0,0,0,0,0,
0,0,0,0,0]
 Global w_lower  := [
0,0,0,0,0,
0,0,0,0,0,
0,0,0,0,0,
1,0,1,0,1,
1,0,1,0,1,
1,0,1,0,1,
1,0,0,0,1,
1,1,1,1,1,
0,0,0,0,0,
0,0,0,0,0]
 Global x_lower  := [
0,0,0,0,0,
0,0,0,0,0,
0,0,0,0,0,
1,0,0,1,0,
1,0,0,1,0,
0,1,1,0,0,
1,0,0,1,0,
1,0,0,1,0,
0,0,0,0,0,
0,0,0,0,0]
 Global y_lower  := [
0,0,0,0,0,
0,0,0,0,0,
0,0,0,0,0,
1,0,0,1,0,
1,0,0,1,0,
1,0,0,1,0,
1,0,0,1,0,
1,1,1,1,0,
0,0,0,1,0,
1,1,1,1,0]
 Global z_lower  := [
0,0,0,0,0,
0,0,0,0,0,
0,0,0,0,0,
1,1,1,1,0,
0,0,1,0,0,
0,1,0,0,0,
1,0,0,0,0,
1,1,1,1,0,
0,0,0,0,0,
0,0,0,0,0]
 Global lowerCase  := [a_lower, b_lower, c_lower, d_lower, e_lower,
											  f_lower, g_lower, h_lower, i_lower, j_lower,
											  k_lower, l_lower, m_lower, n_lower, o_lower, p_lower,
											  q_lower, r_lower, s_lower, t_lower, u_lower,
											  v_lower, w_lower, x_lower, y_lower, z_lower]
End 

