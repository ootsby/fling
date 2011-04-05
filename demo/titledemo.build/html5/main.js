
//Change this to true for a stretchy canvas!
//
var RESIZEABLE_CANVAS=false;

//Start us up!
//
window.onload=function( e ){

	if( RESIZEABLE_CANVAS ){
		window.onresize=function( e ){
			var canvas=document.getElementById( "GameCanvas" );

			//This vs window.innerWidth, which apparently doesn't account for scrollbar?
			var width=document.body.clientWidth;
			
			//This vs document.body.clientHeight, which does weird things - document seems to 'grow'...perhaps canvas resize pushing page down?
			var height=window.innerHeight;			

			canvas.width=width;
			canvas.height=height;
		}
		window.onresize( null );
	}
	
	game_canvas=document.getElementById( "GameCanvas" );
	game_console=document.getElementById( "GameConsole" );
	
	
	try{
		bb_Init();
		bb_Main();
	}catch( ex ){
		if( ex ) alert( ex );
		return;
	}
	
	if( game_runner!=null ){
		game_runner();
	}
}

//Globals
var game_canvas;
var game_console;
var game_runner;

//${METADATA_BEGIN}
var META_DATA="[mojo_font.png];type=image/png;width=864;height=13;\n";

//${METADATA_END}
function getMetaData( path,key ){	
	var i=META_DATA.indexOf( "["+path+"]" );
	if( i==-1 ) return "";
	i+=path.length+2;

	var e=META_DATA.indexOf( "\n",i );
	if( e==-1 ) e=META_DATA.length;

	i=META_DATA.indexOf( ";"+key+"=",i )
	if( i==-1 || i>=e ) return "";
	i+=key.length+2;

	e=META_DATA.indexOf( ";",i );
	if( e==-1 ) return "";

	return META_DATA.slice( i,e );
}

function loadString( path ){
	if( path=="" ) return "";
//${TEXTFILES_BEGIN}
		return "";

//${TEXTFILES_END}
}

function loadImage( path,onloadfun ){
	var ty=getMetaData( path,"type" );
	if( ty.indexOf( "image/" )!=0 ) return null;

	var image=new Image();
	
	image.meta_width=parseInt( getMetaData( path,"width" ) );
	image.meta_height=parseInt( getMetaData( path,"height" ) );
	image.onload=onloadfun;
	image.src="data/"+path;
	
	return image;
}

function loadAudio( path ){
	var audio=new Audio( "data/"+path );
	return audio;
}

//${TRANSCODE_BEGIN}

// Javascript Monkey runtime.
//
// Placed into the public domain 24/02/2011.
// No warranty implied; use at your own risk.

//***** JavaScript Runtime *****

var err_info="";
var err_stack=[];

var D2R=0.017453292519943295;
var R2D=57.29577951308232;

function push_err(){
	err_stack.push( err_info );
}

function pop_err(){
	err_info=err_stack.pop();
}

function stackTrace(){
	var str="";
	push_err();
	err_stack.reverse();
	for( var i=0;i<err_stack.length;++i ){
		str+=err_stack[i]+"\n";
	}
	err_stack.reverse();
	pop_err();
	return str;
}

function print( str ){
	if( game_console ){
		game_console.value+=str+"\n";
	}
	if( window.console!=undefined ){
		window.console.log( str );
	}
}

function error( err ){
	throw err;
}

function dbg_object( obj ){
	if( obj ) return obj;
	error( "Null object access" );
}

function dbg_array( arr,index ){
	if( index>=0 && index<arr.length ) return arr;
	error( "Array index out of range" );
}

function new_bool_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=false;
	return arr;
}

function new_number_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=0;
	return arr;
}

function new_string_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]='';
	return arr;
}

function new_array_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=[];
	return arr;
}

function new_object_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=null;
	return arr;
}

function resize_bool_array( arr,len ){
   var res=Array( len );
   var n=Math.min( arr.length,len );
   for( var i=0;i<n;++i ) res[i]=arr[i];
   for( var j=n;j<len;++j ) res[j]=false;
   return res;
}

function resize_number_array( arr,len ){
   var res=Array( len );
   var n=Math.min( arr.length,len );
   for( var i=0;i<n;++i ) res[i]=arr[i];
   for( var j=n;j<len;++j ) res[j]=0;
   return res;
}

function resize_string_array( arr,len ){
   var res=Array( len );
   var n=Math.min( arr.length,len );
   for( var i=0;i<n;++i ) res[i]=arr[i];
   for( var j=n;j<len;++j ) res[j]='';
   return res;
}

function resize_array_array( arr,len ){
   var res=Array( len );
   var n=Math.min( arr.length,len );
   for( var i=0;i<n;++i ) res[i]=arr[i];
   for( var j=n;j<len;++j ) res[j]=[];
   return res;
}

function resize_object_array( arr,len ){
   var res=Array( len );
   var n=Math.min( arr.length,len );
   for( var i=0;i<n;++i ) res[i]=arr[i];
   for( var j=n;j<len;++j ) res[j]=null;
   return res;
}

function string_replace( str,find,rep ){	//no unregex replace all?!?
	var i=0;
	for(;;){
		i=str.indexOf( find,i );
		if( i==-1 ) return str;
		str=str.substring( 0,i )+rep+str.substring( i+find.length );
		i+=rep.length;
	}
}

function string_trim( str ){
	var i=0,i2=str.length;
	while( i<i2 && str.charCodeAt(i)<=32 ) i+=1;
	while( i2>i && str.charCodeAt(i2-1)<=32 ) i2-=1;
	return str.slice( i,i2 );
}

function string_starts_with( str,substr ){
	return substr.length<=str.length && str.slice(0,substr.length)==substr;
}

function string_ends_with( str,substr ){
	return substr.length<=str.length && str.slice(str.length-substr.length,str.length)==substr;
}

function object_downcast( obj,clas ){
	if( obj instanceof clas ) return obj;
	return null;
}

function extend_class( clas ){
	var tmp=function(){};
	tmp.prototype=clas.prototype;
	return new tmp;
}



// HTML5 mojo runtime.
//
// Copyright 2011 Mark Sibly, all rights reserved.
// No warranty implied; use at your own risk.

var dead=false;

var KEY_LMB=1;
var KEY_RMB=2;
var KEY_MMB=3;
var KEY_TOUCH0=0x180;

function eatEvent( e ){
	if( e.stopPropagation ){
		e.stopPropagation();
		e.preventDefault();
	}else{
		e.cancelBubble=true;
		e.returnValue=false;
	}
}

function keyToChar( key ){
	switch( key ){
	case 8:
	case 9:
	case 13:
	case 27:
	case 32:
		return key;
	case 33:
	case 34:
	case 35:
	case 36:
	case 37:
	case 38:
	case 39:
	case 40:
	case 45:
		return key | 0x10000;
	case 46:
		return 127;
	}
	return 0;
}

//***** gxtkApp class *****

function gxtkApp(){

	this.graphics=new gxtkGraphics( this,game_canvas );
	this.input=new gxtkInput( this );
	this.audio=new gxtkAudio( this );

	this.loading=0;
	this.maxloading=0;

	this.updateRate=0;
	
	this.startMillis=(new Date).getTime();
	
	this.suspended=false;
	
	var app=this;
	var canvas=game_canvas;
	
	function gxtkMain(){
		canvas.onkeydown=function( e ){
			app.input.OnKeyDown( e.keyCode );
			var chr=keyToChar( e.keyCode );
			if( chr ) app.input.PutChar( chr );
			if( e.keyCode<48 || (e.keyCode>111 && e.keyCode<124) ) eatEvent( e );
		}

		canvas.onkeyup=function( e ){
			app.input.OnKeyUp( e.keyCode );
		}

		canvas.onkeypress=function( e ){
			if( e.charCode ){
				app.input.PutChar( e.charCode );
			}else if( e.which ){
				app.input.PutChar( e.which );
			}
		}

		canvas.onmousedown=function( e ){
			app.input.OnKeyDown( KEY_LMB );
			eatEvent( e );
		}
		
		canvas.onmouseup=function( e ){
			app.input.OnKeyUp( KEY_LMB );
			eatEvent( e );
		}
		
		canvas.onmouseout=function( e ){
			app.input.OnKeyUp( KEY_LMB );
			eatEvent( e );
		}

		canvas.onmousemove=function( e ){
			var x=e.clientX+document.body.scrollLeft;
			var y=e.clientY+document.body.scrollTop;
			var c=canvas;
			while( c ){
				x-=c.offsetLeft;
				y-=c.offsetTop;
				c=c.offsetParent;
			}
			app.input.OnMouseMove( x,y );
			eatEvent( e );
		}

		canvas.onfocus=function( e ){
			//app.InvokeOnResume();
		}
		
		canvas.onblur=function( e ){
			//app.InvokeOnSuspend();
		}

		canvas.focus();

		app.InvokeOnCreate();
		app.InvokeOnRender();
	}
	
	game_runner=gxtkMain;
}

var timerSeq=0;

gxtkApp.prototype.SetFrameRate=function( fps ){

	var seq=++timerSeq;
	
	if( !fps ) return;
	
	var app=this;
	var updatePeriod=1000.0/fps;
	var nextUpdate=(new Date).getTime()+updatePeriod;
	
	function timeElapsed(){
		if( seq!=timerSeq ) return;

		var time;		
		var updates=0;

		for(;;){
			nextUpdate+=updatePeriod;

			app.InvokeOnUpdate();
			if( seq!=timerSeq ) return;
			
			if( nextUpdate>(new Date).getTime() ) break;
			
			if( ++updates==7 ){
				nextUpdate=(new Date).getTime();
				break;
			}
		}
		app.InvokeOnRender();
		if( seq!=timerSeq ) return;
			
		var delay=nextUpdate-(new Date).getTime();
		setTimeout( timeElapsed,delay>0 ? delay : 0 );
	}
	
	setTimeout( timeElapsed,updatePeriod );
}

gxtkApp.prototype.IncLoading=function(){
	++this.loading;
	if( this.loading>this.maxloading ) this.maxloading=this.loading;
	if( this.loading==1 ) this.SetFrameRate( 0 );
}

gxtkApp.prototype.DecLoading=function(){
	--this.loading;
	if( this.loading!=0 ) return;
	this.maxloading=0;
	this.SetFrameRate( this.updateRate );
}

gxtkApp.prototype.GetMetaData=function( path,key ){
	return getMetaData( path,key );
}

gxtkApp.prototype.Die=function( ex ){
	dead=true;
	this.audio.OnSuspend();
	if( ex ) alert( ex+"\n"+stackTrace() );
	throw ex;
}

gxtkApp.prototype.InvokeOnCreate=function(){
	if( dead ) return;
	
	try{
		this.OnCreate();
	}catch( ex ){
		this.Die( ex );
	}
}

gxtkApp.prototype.InvokeOnUpdate=function(){
	if( dead || this.suspended || !this.updateRate || this.loading ) return;
	
	try{
		this.input.BeginUpdate();
		this.OnUpdate();		
		this.input.EndUpdate();
	}catch( ex ){
		this.Die( ex );
	}
}

gxtkApp.prototype.InvokeOnSuspend=function(){
	if( dead || this.suspended ) return;
	
	try{
		this.suspended=true;
		this.OnSuspend();
		this.audio.OnSuspend();
	}catch( ex ){
		this.Die( ex );
	}
}

gxtkApp.prototype.InvokeOnResume=function(){
	if( dead || !this.suspended ) return;
	
	try{
		this.audio.OnResume();
		this.OnResume();
		this.suspended=false;
	}catch( ex ){
		this.Die( ex );
	}
}

gxtkApp.prototype.InvokeOnRender=function(){
	if( dead || this.suspended ) return;
	
	try{
		this.graphics.BeginRender();
		if( this.loading ){
			this.OnLoading();
		}else{
			this.OnRender();
		}
		this.graphics.EndRender();
	}catch( ex ){
		this.Die( ex );
	}
}

//***** GXTK API *****

gxtkApp.prototype.GraphicsDevice=function(){
	return this.graphics;
}

gxtkApp.prototype.InputDevice=function(){
	return this.input;
}

gxtkApp.prototype.AudioDevice=function(){
	return this.audio;
}

gxtkApp.prototype.AppTitle=function(){
	return document.URL;
}

gxtkApp.prototype.LoadState=function(){
	//use cookies for file:// URLS in FF and IE...
	if( document.URL.toLowerCase().substr(0,7)=="file://" &&
			(navigator.userAgent.indexOf( "Firefox" )!=-1 || navigator.userAgent.indexOf( "MSIE" )!=-1) ){
		var bits=document.cookie.split( ";" )
		if( bits.length!=1 ) return "";
		bits=bits[0].split( "=" );
		if( bits.length!=2 || bits[0]!=".mojostate" ) return "";
		return unescape( bits[1] );
	}else{
		var state=localStorage.getItem( ".mojostate@"+document.URL );
		if( state ) return state;
	}
	return "";
}

gxtkApp.prototype.SaveState=function( state ){
	//use cookies for file:// URLS in FF and IE...
	if( document.URL.toLowerCase().substr(0,7)=="file://" &&
			(navigator.userAgent.indexOf( "Firefox" )!=-1 || navigator.userAgent.indexOf( "MSIE" )!=-1) ){
		var exdate=new Date();
		exdate.setDate( exdate.getDate()+3650 );
		document.cookie=".mojostate="+escape( state )+"; expires="+exdate.toUTCString()
	}else{
		localStorage.setItem( ".mojostate@"+document.URL,state );
	}
}

gxtkApp.prototype.LoadString=function( path ){
	return loadString( path );
}

gxtkApp.prototype.SetUpdateRate=function( fps ){
	this.updateRate=fps;
	
	if( !this.loading ) this.SetFrameRate( fps );
}

gxtkApp.prototype.MilliSecs=function(){
	return ((new Date).getTime()-this.startMillis)|0;
}

gxtkApp.prototype.Loading=function(){
	return this.loading;
}

gxtkApp.prototype.OnCreate=function(){
}

gxtkApp.prototype.OnUpdate=function(){
}

gxtkApp.prototype.OnSuspend=function(){
}

gxtkApp.prototype.OnResume=function(){
}

gxtkApp.prototype.OnRender=function(){
}

gxtkApp.prototype.OnLoading=function(){
}

//***** gxtkGraphics class *****

function gxtkGraphics( app,canvas ){
	this.app=app;
	this.canvas=canvas;
	this.gc=canvas.getContext( '2d' );
	this.color="rgb(255,255,255)"
	this.alpha=1.0;
	this.blend="source-over";
	this.ix=1;this.iy=0;
	this.jx=0;this.jy=1;
	this.tx=0;this.ty=0;
	this.tformed=false;
	this.scissorX=0;
	this.scissorY=0;
	this.scissorWidth=0;
	this.scissorHeight=0;
	this.clipped=false;
}

gxtkGraphics.prototype.BeginRender=function(){
	this.gc.save();
}

gxtkGraphics.prototype.EndRender=function(){
	this.gc.restore();
}

gxtkGraphics.prototype.Width=function(){
	return this.canvas.width;
}

gxtkGraphics.prototype.Height=function(){
	return this.canvas.height;
}

gxtkGraphics.prototype.LoadSurface=function( path ){
	
	var app=this.app;
	
	function onloadfun(){
		app.DecLoading();
	};

	app.IncLoading();

	var image=loadImage( path,onloadfun );
	if( image ) return new gxtkSurface( image,this );

	app.DecLoading();
	return null;
}

gxtkGraphics.prototype.DestroySurface=function( surface ){
}

gxtkGraphics.prototype.SetAlpha=function( alpha ){
	this.alpha=alpha;
	this.gc.globalAlpha=alpha;
}

gxtkGraphics.prototype.SetColor=function( r,g,b ){
	this.color="rgb("+(r|0)+","+(g|0)+","+(b|0)+")";
	this.gc.fillStyle=this.color;
	this.gc.strokeStyle=this.color;
}

gxtkGraphics.prototype.SetBlend=function( blend ){
	switch( blend ){
	case 1:
		this.blend="lighter";
		break;
	default:
		this.blend="source-over";
	}
	this.gc.globalCompositeOperation=this.blend;
}

gxtkGraphics.prototype.SetScissor=function( x,y,w,h ){
	this.scissorX=x;
	this.scissorY=y;
	this.scissorWidth=w;
	this.scissorHeight=h;
	this.clipped=(x!=0 || y!=0 || w!=this.canvas.width || h!=this.canvas.height);
	this.gc.restore();
	this.gc.save();
	if( this.clipped ){
		this.gc.beginPath();
		this.gc.rect( x,y,w,h );
		this.gc.clip();
		this.gc.closePath();
	}
	this.gc.fillStyle=this.color;
	this.gc.strokeStyle=this.color;
	if( this.tformed ) this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
}

gxtkGraphics.prototype.SetMatrix=function( ix,iy,jx,jy,tx,ty ){
	this.ix=ix;this.iy=iy;
	this.jx=jx;this.jy=jy;
	this.tx=tx;this.ty=ty;
	this.gc.setTransform( ix,iy,jx,jy,tx,ty );
	this.tformed=(ix!=1 || iy!=0 || jx!=0 || jy!=1 || tx!=0 || ty!=0);
}

gxtkGraphics.prototype.Cls=function( r,g,b ){
	if( this.tformed ) this.gc.setTransform( 1,0,0,1,0,0 );
	this.gc.fillStyle="rgb("+(r|0)+","+(g|0)+","+(b|0)+")";
	this.gc.globalAlpha=1;
	this.gc.globalCompositeOperation="source-over";
	this.gc.fillRect( 0,0,this.canvas.width,this.canvas.height );
	this.gc.fillStyle=this.color;
	this.gc.globalAlpha=this.alpha;
	this.gc.globalCompositeOperation=this.blend;
	if( this.tformed ) this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
}

gxtkGraphics.prototype.DrawRect=function( x,y,w,h ){
	if( w<0 ){ x+=w;w=-w; }
	if( h<0 ){ y+=h;h=-h; }
	if( w<=0 || h<=0 ) return;			//Safari Kludge!
	//
	this.gc.fillRect( x,y,w,h );
}

gxtkGraphics.prototype.DrawLine=function( x1,y1,x2,y2 ){
	if( this.tformed ){
		var x1_t=x1 * this.ix + y1 * this.jx + this.tx;
		var y1_t=x1 * this.iy + y1 * this.jy + this.ty;
		var x2_t=x2 * this.ix + y2 * this.jx + this.tx;
		var y2_t=x2 * this.iy + y2 * this.jy + this.ty;
		this.gc.setTransform( 1,0,0,1,0,0 );
	  	this.gc.beginPath();
	  	this.gc.moveTo( x1_t,y1_t );
	  	this.gc.lineTo( x2_t,y2_t );
	  	this.gc.stroke();
	  	this.gc.closePath();
		this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
	}else{
	  	this.gc.beginPath();
	  	this.gc.moveTo( x1,y1 );
	  	this.gc.lineTo( x2,y2 );
	  	this.gc.stroke();
	  	this.gc.closePath();
	}
}

gxtkGraphics.prototype.DrawOval=function( x,y,w,h ){
	if( w<0 ){ x+=w;w=-w; }
	if( h<0 ){ y+=h;h=-h; }
	if( w<=0 || h<=0 ) return;			//Safari Kludge!
	//
  	var w2=w/2,h2=h/2;
	this.gc.save();
	this.gc.translate( x+w2,y+h2 );
	this.gc.scale( w2,h2 );
  	this.gc.beginPath();
	this.gc.arc( 0,0,1,0,Math.PI*2,false );
	this.gc.fill();
  	this.gc.closePath();
	this.gc.restore();
}

gxtkGraphics.prototype.DrawSurface=function( surface,x,y ){
	if( surface.image.complete ) this.gc.drawImage( surface.image,x,y );
}

gxtkGraphics.prototype.DrawSurface2=function( surface,x,y,srcx,srcy,srcw,srch ){
	if( srcw<0 ){ srcx+=srcw;srcw=-srcw; }
	if( srch<0 ){ srcy+=srch;srch=-srch; }
	if( srcw<=0 || srch<=0 ) return;	//Safari Kludge!
	//
	if( surface.image.complete ) this.gc.drawImage( surface.image,srcx,srcy,srcw,srch,x,y,srcw,srch );
}

//***** gxtkSurface class *****

function gxtkSurface( image,graphics ){
	this.image=image;
	this.graphics=graphics;
	this.swidth=image.meta_width;
	this.sheight=image.meta_height;
}

//***** GXTK API *****

gxtkSurface.prototype.Width=function(){
	return this.swidth;
}

gxtkSurface.prototype.Height=function(){
	return this.sheight;
}

gxtkSurface.prototype.Loaded=function(){
	return this.image.complete;
}

//***** Class gxtkInput *****

function gxtkInput( app ){
	this.app=app;
	this.keyStates=new Array( 512 );
	this.charQueue=new Array( 32 );
	this.charPut=0;
	this.charGet=0;
	this.mouseX=0;
	this.mouseY=0;
	this.joyX=0;
	this.joyY=0;
	this.joyZ=0;
	this.accelX=0;
	this.accelY=0;
	this.accelZ=0;
	for( var i=0;i<512;++i ){
		this.keyStates[i]=0;
	}
}

gxtkInput.prototype.BeginUpdate=function(){
}

gxtkInput.prototype.EndUpdate=function(){
	for( var i=0;i<512;++i ){
		this.keyStates[i]&=0x100;
	}
	this.charGet=0;
	this.charPut=0;
}

gxtkInput.prototype.OnKeyDown=function( key ){
	if( (this.keyStates[key]&0x100)==0 ){
		this.keyStates[key]|=0x100;
		++this.keyStates[key];	
	}
}

gxtkInput.prototype.OnKeyUp=function( key ){
	this.keyStates[key]&=0xff;
}

gxtkInput.prototype.PutChar=function( char ){
	if( this.charPut-this.charGet<32 ){
		this.charQueue[this.charPut & 31]=char;
		this.charPut+=1;
	}
}

gxtkInput.prototype.OnMouseMove=function( x,y ){
	this.mouseX=x;
	this.mouseY=y;
}

//***** GXTK API *****

gxtkInput.prototype.KeyDown=function( key ){
	if( key>0 && key<512 ){
		if( key==KEY_TOUCH0 ) key=KEY_LMB;
		return this.keyStates[key] >> 8;
	}
	return 0;
}

gxtkInput.prototype.KeyHit=function( key ){
	if( key>0 && key<512 ){
		if( key==KEY_TOUCH0 ) key=KEY_LMB;
		return this.keyStates[key] & 0xff;
	}
	return 0;
}

gxtkInput.prototype.GetChar=function(){
	if( this.charPut!=this.charGet ){
		var char=this.charQueue[this.charGet & 31];
		this.charGet+=1;
		return char;
	}
	return 0;
}

gxtkInput.prototype.MouseX=function(){
	return this.mouseX;
}

gxtkInput.prototype.MouseY=function(){
	return this.mouseY;
}

gxtkInput.prototype.JoyX=function( index ){
	return this.joyX;
}

gxtkInput.prototype.JoyY=function( index ){
	return this.joyY;
}

gxtkInput.prototype.JoyZ=function( index ){
	return this.joyZ;
}

gxtkInput.prototype.TouchX=function( index ){
	return this.mouseX;
}

gxtkInput.prototype.TouchY=function( index ){
	return this.mouseY;
}

gxtkInput.prototype.AccelX=function(){
	return 0;
}

gxtkInput.prototype.AccelY=function(){
	return 0;
}

gxtkInput.prototype.AccelZ=function(){
	return 0;
}


//***** gxtkChannel class *****
function gxtkChannel(){
	this.audio=null;
	this.sample=null;
	this.volume=1;
	this.pan=0;
	this.rate=1;
}

//***** gxtkAudio class *****
function gxtkAudio( app ){
	this.app=app;
	this.okay=typeof(Audio)!="undefined";
	this.nextchan=0;
	this.music=null;
	this.channels=new Array(33);
	for( var i=0;i<33;++i ){
		this.channels[i]=new gxtkChannel();
	}
}

gxtkAudio.prototype.OnSuspend=function(){
	var i;
	for( i=0;i<33;++i ){
		var chan=this.channels[i];
		if( chan.audio ) chan.audio.pause();
	}
}

gxtkAudio.prototype.OnResume=function(){
	var i;
	for( i=0;i<33;++i ){
		var chan=this.channels[i];
		if( chan.audio ) chan.audio.play();
	}
}

gxtkAudio.prototype.LoadSample=function( path ){
	var audio=loadAudio( path );
	if( audio ) return new gxtkSample( audio );
	return null;
}

gxtkAudio.prototype.DestroySample=function( sample ){
}

gxtkAudio.prototype.PlaySample=function( sample,channel,flags ){
	if( !this.okay ) return;
	
	var chan=this.channels[channel];
	
	if( chan.sample==sample && chan.audio ){	//&& !chan.audio.paused ){
		chan.audio.loop=(flags&1)!=0;
		chan.audio.volume=chan.volume;
		try{
			chan.audio.currentTime=0;
		}catch(ex){
		}
		chan.audio.play();
		return;
	}

	if( chan.audio ) chan.audio.pause();
	
	var audio=sample.AllocAudio();
	
	if( audio ){
		for( var i=0;i<33;++i ){
			if( this.channels[i].audio==audio ){
				this.channels[i].audio=null;
				break;
			}
		}
		audio.loop=(flags&1)!=0;
		audio.volume=chan.volume;
		audio.play();
	}
	
	chan.audio=audio;
	chan.sample=sample;
}

gxtkAudio.prototype.StopChannel=function( channel ){
	var chan=this.channels[channel];
	if( chan.audio ) chan.audio.pause();
}

gxtkAudio.prototype.ChannelState=function( channel ){
	var chan=this.channels[channel];
	if( chan.audio && !chan.audio.paused && !chan.audio.ended ) return 1;
	return 0;
}

gxtkAudio.prototype.SetVolume=function( channel,volume ){
	var chan=this.channels[channel];
	if( chan.audio ) chan.audio.volume=volume;
	chan.volume=volume;
}

gxtkAudio.prototype.SetPan=function( channel,pan ){
	var chan=this.channels[channel];
	chan.pan=pan;
}

gxtkAudio.prototype.SetRate=function( channel,rate ){
	var chan=this.channels[channel];
	chan.rate=rate;
}

gxtkAudio.prototype.PlayMusic=function( path,flags ){
	this.StopMusic();
	
	this.music=this.LoadSample( path );
	if( !this.music ) return;
	
	this.PlaySample( this.music,32,flags );
}

gxtkAudio.prototype.StopMusic=function(){
	this.StopChannel( 32 );

	if( this.music ){
		this.DestroySample( this.music );
		this.music=null;
	}
}

gxtkAudio.prototype.MusicState=function(){

	return this.ChannelState( 32 );
}

gxtkAudio.prototype.SetMusicVolume=function( volume ){

	this.SetVolume( 32,volume );
}

//***** gxtkSample class *****

function gxtkSample( audio ){
	this.audio=audio;
	this.insts=new Array( 8 );
}

gxtkSample.prototype.AllocAudio=function(){
	for( var i=0;i<8;++i ){
		var audio=this.insts[i];
		if( audio ){
			//Ok, this is ugly but seems to work best...no idea how/why!
			if( audio.paused ){
				if( audio.currentTime==0 ) return audio;
				audio.currentTime=0;
			}else if( audio.ended ){
				audio.pause();
			}
		}else{
			audio=new Audio( this.audio.src );
			this.insts[i]=audio;
			return audio;
		}
	}
	return null;
}
function bb_app_App(){
	Object.call(this);
}
function bb_app_new(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/app.monkey<101>";
	bb_app_device=bb_app_new2.call(new bb_app_AppDevice,this);
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/app.monkey<100>";
	var bb=this;
	pop_err();
	return bb;
}
bb_app_App.prototype.bbOnCreate=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/app.monkey<104>";
	pop_err();
	return 0;
}
bb_app_App.prototype.bbOnUpdate=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/app.monkey<107>";
	pop_err();
	return 0;
}
bb_app_App.prototype.bbOnSuspend=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/app.monkey<110>";
	pop_err();
	return 0;
}
bb_app_App.prototype.bbOnResume=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/app.monkey<113>";
	pop_err();
	return 0;
}
bb_app_App.prototype.bbOnRender=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/app.monkey<116>";
	pop_err();
	return 0;
}
bb_app_App.prototype.bbOnLoading=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/app.monkey<119>";
	pop_err();
	return 0;
}
function bb_maindemo_MainDemo(){
	bb_app_App.call(this);
	this.bbframe=0;
	this.bbcurbf=0;
	this.bbdraw=false;
	this.bbdebug=false;
	this.bbstopped=false;
	this.bbdemo=null;
	this.bbrecalStep=false;
	this.bbbroadphases=[(bb_sortedlist_new.call(new bb_sortedlist_SortedList)),(bb_quantize_new.call(new bb_quantize_Quantize,6)),(bb_bruteforce_new.call(new bb_bruteforce_BruteForce))];
	this.bbworld=null;
	this.bbfd=bb_mojodraw_new.call(new bb_mojodraw_MojoDraw);
}
bb_maindemo_MainDemo.prototype=extend_class(bb_app_App);
function bb_maindemo_new(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<35>";
	bb_app_new.call(this);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<35>";
	var bb=this;
	pop_err();
	return bb;
}
bb_maindemo_MainDemo.prototype.bbsetDemo=function(bbdemo){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<144>";
	dbg_object(this).bbdemo=bbdemo;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<145>";
	this.bbstopped=false;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<146>";
	this.bbrecalStep=false;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<147>";
	this.bbworld=bb_world_new.call(new bb_world_World,bb_aabb_new.call(new bb_aabb_AABB,-2000,-2000,2000,2000),dbg_array(this.bbbroadphases,this.bbcurbf)[this.bbcurbf]);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<148>";
	bbdemo.bbstart(this.bbworld);
}
bb_maindemo_MainDemo.prototype.bbOnCreate=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<48>";
	this.bbframe=0;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<49>";
	this.bbcurbf=0;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<50>";
	this.bbdraw=true;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<51>";
	this.bbdebug=false;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<52>";
	this.bbstopped=false;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<53>";
	this.bbsetDemo(bb_titledemo_new.call(new bb_titledemo_TitleDemo));
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<54>";
	bb_app_SetUpdateRate(20);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<55>";
	print("Press 1-6 to change demo scene. Mouse click fires block.");
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<47>";
	pop_err();
	return 0;
}
bb_maindemo_MainDemo.prototype.bbfireBlock=function(bbmouseX,bbmouseY){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<188>";
	var bbpos=bb_vector_new.call(new bb_vector_Vector,(bb_graphics_DeviceWidth()),(bb_graphics_DeviceHeight()));
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<189>";
	dbg_object(bbpos).bbx+=100.000000;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<190>";
	dbg_object(bbpos).bby/=3.000000;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<191>";
	var bbv=bb_vector_new.call(new bb_vector_Vector,bbmouseX-dbg_object(bbpos).bbx,bbmouseY-dbg_object(bbpos).bby);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<192>";
	var bbk=15.000000/bbv.bblength();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<193>";
	dbg_object(bbv).bbx*=bbk;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<194>";
	dbg_object(bbv).bby*=bbk;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<195>";
	var bbb=bb_body_new.call(new bb_body_Body,0.000000,0.000000,null);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<196>";
	bbb.bbset(bbpos,0.000000,bbv,2.000000);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<197>";
	bbb.bbaddShape(bb_shape_makeBox(20.000000,20.000000,bb_constants_NaN,bb_constants_NaN,bb_material_new.call(new bb_material_Material,0.0,1.000000,5.000000)));
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<198>";
	this.bbworld.bbaddBody(bbb);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<186>";
	pop_err();
	return 0;
}
bb_maindemo_MainDemo.prototype.bbCheckKeys=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<98>";
	if((bb_input_KeyHit(32))!=0){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<99>";
		this.bbdebug=!this.bbdebug;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<101>";
	if((bb_input_KeyHit(66))!=0){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<102>";
		this.bbcurbf=(this.bbcurbf+1) % this.bbbroadphases.length;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<103>";
		this.bbworld.bbsetBroadPhase(dbg_array(this.bbbroadphases,this.bbcurbf)[this.bbcurbf]);
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<105>";
	if((bb_input_KeyHit(68))!=0){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<106>";
		this.bbdraw=!this.bbdraw;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<108>";
	if((bb_input_KeyHit(49))!=0){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<109>";
		this.bbsetDemo(bb_titledemo_new.call(new bb_titledemo_TitleDemo));
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<111>";
	if((bb_input_KeyHit(50))!=0){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<112>";
		this.bbsetDemo(bb_dominopyramid_new.call(new bb_dominopyramid_DominoPyramid));
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<114>";
	if((bb_input_KeyHit(51))!=0){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<115>";
		this.bbsetDemo(bb_pyramidthree_new.call(new bb_pyramidthree_PyramidThree));
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<117>";
	if((bb_input_KeyHit(52))!=0){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<118>";
		this.bbsetDemo(bb_boxpyramiddemo_new.call(new bb_boxpyramiddemo_BoxPyramidDemo));
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<120>";
	if((bb_input_KeyHit(53))!=0){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<121>";
		this.bbsetDemo(bb_basicstack_new.call(new bb_basicstack_BasicStack));
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<123>";
	if((bb_input_KeyHit(54))!=0){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<124>";
		this.bbsetDemo(bb_jumble_new.call(new bb_jumble_Jumble));
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<126>";
	if((bb_input_KeyHit(55))!=0){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<127>";
		this.bbsetDemo(bb_pentagonrain_new.call(new bb_pentagonrain_PentagonRain));
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<136>";
	if((bb_input_KeyHit(27))!=0){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<137>";
		this.bbsetDemo(this.bbdemo);
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<96>";
	pop_err();
	return 0;
}
bb_maindemo_MainDemo.prototype.bbOnUpdate=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<61>";
	var bbUpdates=dbg_object(this.bbdemo).bbUpdates;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<62>";
	if(this.bbstopped){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<63>";
		bbUpdates=0;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<65>";
	var bbdt=1.0;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<66>";
	var bbniter=5;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<67>";
	for(var bbi=0;bbi<bbUpdates;bbi=bbi+1){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<68>";
		this.bbdemo.bbUpdate(bbdt/(bbUpdates));
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<69>";
		this.bbworld.bbUpdate(bbdt/(bbUpdates),bbniter);
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<71>";
	if(this.bbrecalStep){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<72>";
		this.bbworld.bbUpdate(0.000000,1);
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<74>";
	if((bb_input_MouseHit(0))!=0){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<75>";
		this.bbfireBlock(bb_input_MouseX(),bb_input_MouseY());
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<77>";
	this.bbCheckKeys();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<58>";
	pop_err();
	return 0;
}
bb_maindemo_MainDemo.prototype.bbOnRender=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<83>";
	bb_graphics_Cls(0.000000,0.000000,0.000000);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<85>";
	if(this.bbdebug){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<90>";
		dbg_object(this.bbfd).bbdrawCircleRotation=true;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<92>";
	if(this.bbdraw){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<93>";
		this.bbfd.bbdrawWorld(this.bbworld);
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<81>";
	pop_err();
	return 0;
}
function bb_app_AppDevice(){
	gxtkApp.call(this);
	this.bbapp=null;
}
bb_app_AppDevice.prototype=extend_class(gxtkApp);
function bb_app_new2(bbapp){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/app.monkey<51>";
	dbg_object(this).bbapp=bbapp;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/app.monkey<52>";
	bb_graphics_SetGraphicsContext(bb_graphics_new.call(new bb_graphics_GraphicsContext,this.GraphicsDevice()));
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/app.monkey<53>";
	bb_input_SetInputDevice(this.InputDevice());
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/app.monkey<54>";
	bb_audio_SetAudioDevice(this.AudioDevice());
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/app.monkey<50>";
	var bb=this;
	pop_err();
	return bb;
}
function bb_app_new3(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/app.monkey<48>";
	var bb=this;
	pop_err();
	return bb;
}
bb_app_AppDevice.prototype.OnCreate=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/app.monkey<58>";
	bb_graphics_SetFont(null,32);
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/app.monkey<59>";
	var bb=this.bbapp.bbOnCreate();
	pop_err();
	return bb;
}
bb_app_AppDevice.prototype.OnUpdate=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/app.monkey<63>";
	var bb=this.bbapp.bbOnUpdate();
	pop_err();
	return bb;
}
bb_app_AppDevice.prototype.OnSuspend=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/app.monkey<67>";
	var bb=this.bbapp.bbOnSuspend();
	pop_err();
	return bb;
}
bb_app_AppDevice.prototype.OnResume=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/app.monkey<71>";
	var bb=this.bbapp.bbOnResume();
	pop_err();
	return bb;
}
bb_app_AppDevice.prototype.OnRender=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/app.monkey<75>";
	bb_graphics_BeginRender();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/app.monkey<76>";
	var bbr=this.bbapp.bbOnRender();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/app.monkey<77>";
	bb_graphics_EndRender();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/app.monkey<78>";
	pop_err();
	return bbr;
}
bb_app_AppDevice.prototype.OnLoading=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/app.monkey<82>";
	bb_graphics_BeginRender();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/app.monkey<83>";
	var bbr=this.bbapp.bbOnLoading();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/app.monkey<84>";
	bb_graphics_EndRender();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/app.monkey<85>";
	pop_err();
	return bbr;
}
function bb_graphics_GraphicsContext(){
	Object.call(this);
	this.bbdevice=null;
	this.bbdefaultFont=null;
	this.bbfont=null;
	this.bbfirstChar=0;
	this.bbmatrixSp=0;
	this.bbix=1.000000;
	this.bbiy=0;
	this.bbjx=0;
	this.bbjy=1.000000;
	this.bbtx=0;
	this.bbty=0;
	this.bbtformed=0;
	this.bbmatDirty=0;
	this.bbcolor_r=0;
	this.bbcolor_g=0;
	this.bbcolor_b=0;
	this.bbalpha=0;
	this.bbblend=0;
	this.bbscissor_x=0;
	this.bbscissor_y=0;
	this.bbscissor_width=0;
	this.bbscissor_height=0;
	this.bbmatrixStack=new_number_array(192);
}
function bb_graphics_new(bbdevice){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<215>";
	dbg_object(this).bbdevice=bbdevice;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<214>";
	var bb=this;
	pop_err();
	return bb;
}
function bb_graphics_new2(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<212>";
	var bb=this;
	pop_err();
	return bb;
}
var bb_graphics_context;
function bb_graphics_SetGraphicsContext(bbgc){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<254>";
	bb_graphics_context=bbgc;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<253>";
	pop_err();
	return 0;
}
var bb_input_device;
function bb_input_SetInputDevice(bbdev){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/input.monkey<38>";
	bb_input_device=bbdev;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/input.monkey<37>";
	pop_err();
	return 0;
}
var bb_audio_device;
function bb_audio_SetAudioDevice(bbdev){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/audio.monkey<50>";
	bb_audio_device=bbdev;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/audio.monkey<49>";
	pop_err();
	return 0;
}
var bb_app_device;
function bb_Main(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<203>";
	bb_maindemo_new.call(new bb_maindemo_MainDemo);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/maindemo.monkey<202>";
	pop_err();
	return 0;
}
function bb_resource_Resource(){
	Object.call(this);
	this.bbnode=null;
	this.bbrefs=1;
}
function bb_resource_new(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/resource.monkey<16>";
	var bb=this;
	pop_err();
	return bb;
}
bb_resource_Resource.prototype.bbRegister=function(bbtype){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/resource.monkey<37>";
	var bblist=object_downcast((bb_resource_resources.bbValueForKey(bb_boxes_new3.call(new bb_boxes_StringObject,bbtype))),bb_list_List);
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/resource.monkey<38>";
	if(!((bblist)!=null)){
		err_info="C:/Data/Dev/MonkeyPro/modules/monkey/resource.monkey<39>";
		bblist=bb_list_new.call(new bb_list_List);
		err_info="C:/Data/Dev/MonkeyPro/modules/monkey/resource.monkey<40>";
		bb_resource_resources.bbInsert((bb_boxes_new3.call(new bb_boxes_StringObject,bbtype)),bblist);
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/resource.monkey<42>";
	this.bbnode=bblist.bbAddLast(this);
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/resource.monkey<36>";
	pop_err();
	return 0;
}
bb_resource_Resource.prototype.bbRetain=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/resource.monkey<19>";
	this.bbrefs+=1;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/resource.monkey<18>";
	pop_err();
	return 0;
}
function bb_graphics_Image(){
	bb_resource_Resource.call(this);
	this.bbsurface=null;
	this.bbwidth=0;
	this.bbheight=0;
	this.bbframes=[];
	this.bbflags=0;
	this.bbtx=0;
	this.bbty=0;
	this.bbsource=null;
}
bb_graphics_Image.prototype=extend_class(bb_resource_Resource);
var bb_graphics_DefaultFlags;
function bb_graphics_new3(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<60>";
	bb_resource_new.call(this);
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<60>";
	var bb=this;
	pop_err();
	return bb;
}
bb_graphics_Image.prototype.bbSetHandle=function(bbtx,bbty){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<105>";
	dbg_object(this).bbtx=bbtx;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<106>";
	dbg_object(this).bbty=bbty;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<107>";
	dbg_object(this).bbflags=dbg_object(this).bbflags&-2;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<104>";
	pop_err();
	return 0;
}
bb_graphics_Image.prototype.bbApplyFlags=function(bbiflags){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<174>";
	this.bbflags=bbiflags;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<176>";
	if((this.bbflags&2)!=0){
		err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<177>";
		err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<177>";
		var bb=this.bbframes;
		err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<177>";
		var bb2=0;
		err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<177>";
		while(bb2<bb.length){
			err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<177>";
			var bbf=dbg_array(bb,bb2)[bb2];
			err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<177>";
			bb2=bb2+1;
			err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<178>";
			dbg_object(bbf).bbx+=1;
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<180>";
		this.bbwidth-=2;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<183>";
	if((this.bbflags&4)!=0){
		err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<184>";
		err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<184>";
		var bb3=this.bbframes;
		err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<184>";
		var bb4=0;
		err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<184>";
		while(bb4<bb3.length){
			err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<184>";
			var bbf2=dbg_array(bb3,bb4)[bb4];
			err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<184>";
			bb4=bb4+1;
			err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<185>";
			dbg_object(bbf2).bby+=1;
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<187>";
		this.bbheight-=2;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<190>";
	if((this.bbflags&1)!=0){
		err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<191>";
		this.bbSetHandle((this.bbwidth)/2.0,(this.bbheight)/2.0);
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<194>";
	if(this.bbframes.length==1 && dbg_object(dbg_array(this.bbframes,0)[0]).bbx==0 && dbg_object(dbg_array(this.bbframes,0)[0]).bby==0 && this.bbwidth==this.bbsurface.Width() && this.bbheight==this.bbsurface.Height()){
		err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<195>";
		this.bbflags|=65536;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<173>";
	pop_err();
	return 0;
}
bb_graphics_Image.prototype.bbLoad=function(bbpath,bbnframes,bbiflags){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<121>";
	this.bbsurface=dbg_object(bb_graphics_context).bbdevice.LoadSurface(bbpath);
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<122>";
	if(!((this.bbsurface)!=null)){
		err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<122>";
		pop_err();
		return null;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<124>";
	this.bbRegister("mojo.graphics.Image");
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<126>";
	this.bbwidth=((this.bbsurface.Width()/bbnframes)|0);
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<127>";
	this.bbheight=this.bbsurface.Height();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<129>";
	this.bbframes=new_object_array(bbnframes);
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<131>";
	for(var bbi=0;bbi<bbnframes;bbi=bbi+1){
		err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<132>";
		dbg_array(this.bbframes,bbi)[bbi]=bb_graphics_new4.call(new bb_graphics_Frame,bbi*this.bbwidth,0)
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<135>";
	this.bbApplyFlags(bbiflags);
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<137>";
	var bb=this;
	pop_err();
	return bb;
}
bb_graphics_Image.prototype.bbGrab=function(bbx,bby,bbiwidth,bbiheight,bbnframes,bbiflags,bbsource){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<142>";
	bbsource.bbRetain();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<143>";
	dbg_object(this).bbsource=bbsource;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<144>";
	this.bbsurface=dbg_object(bbsource).bbsurface;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<146>";
	this.bbRegister("mojo.graphics.Image");
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<148>";
	this.bbwidth=bbiwidth;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<149>";
	this.bbheight=bbiheight;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<151>";
	this.bbframes=new_object_array(bbnframes);
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<153>";
	var bbix=bbx+dbg_object(dbg_array(dbg_object(bbsource).bbframes,0)[0]).bbx;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<154>";
	var bbiy=bby+dbg_object(dbg_array(dbg_object(bbsource).bbframes,0)[0]).bby;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<156>";
	for(var bbi=0;bbi<bbnframes;bbi=bbi+1){
		err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<157>";
		if(bbix+this.bbwidth>dbg_object(bbsource).bbwidth){
			err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<158>";
			bbix=dbg_object(dbg_array(dbg_object(bbsource).bbframes,0)[0]).bbx;
			err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<159>";
			bbiy+=this.bbheight;
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<161>";
		if(bbix+this.bbwidth>dbg_object(bbsource).bbwidth || bbiy+this.bbheight>dbg_object(bbsource).bbheight){
			err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<162>";
			error("Image frame outside surface");
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<164>";
		dbg_array(this.bbframes,bbi)[bbi]=bb_graphics_new4.call(new bb_graphics_Frame,bbix,bbiy)
		err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<165>";
		bbix+=this.bbwidth;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<168>";
	this.bbApplyFlags(bbiflags);
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<170>";
	var bb=this;
	pop_err();
	return bb;
}
bb_graphics_Image.prototype.bbGrabImage=function(bbx,bby,bbwidth,bbheight,bbframes,bbflags){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<100>";
	if(dbg_object(this).bbframes.length!=1){
		err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<100>";
		pop_err();
		return null;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<101>";
	var bb=(bb_graphics_new3.call(new bb_graphics_Image)).bbGrab(bbx,bby,bbwidth,bbheight,bbframes,bbflags,this);
	pop_err();
	return bb;
}
function bb_list_List(){
	Object.call(this);
	this.bb_head=bb_list_new2.call(new bb_list_Node);
}
function bb_list_new(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/list.monkey<13>";
	var bb=this;
	pop_err();
	return bb;
}
bb_list_List.prototype.bbAddLast=function(bbdata){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/list.monkey<49>";
	var bb=bb_list_new3.call(new bb_list_Node,this.bb_head,dbg_object(this.bb_head).bb_pred,bbdata);
	pop_err();
	return bb;
}
function bb_boxes_StringObject(){
	Object.call(this);
	this.bbvalue="";
}
function bb_boxes_new(bbvalue){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/boxes.monkey<59>";
	dbg_object(this).bbvalue=String(bbvalue);
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/boxes.monkey<58>";
	var bb=this;
	pop_err();
	return bb;
}
function bb_boxes_new2(bbvalue){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/boxes.monkey<63>";
	dbg_object(this).bbvalue=String(bbvalue);
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/boxes.monkey<62>";
	var bb=this;
	pop_err();
	return bb;
}
function bb_boxes_new3(bbvalue){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/boxes.monkey<67>";
	dbg_object(this).bbvalue=bbvalue;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/boxes.monkey<66>";
	var bb=this;
	pop_err();
	return bb;
}
function bb_boxes_new4(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/boxes.monkey<55>";
	var bb=this;
	pop_err();
	return bb;
}
function bb_map_Map(){
	Object.call(this);
	this.bbroot=null;
}
function bb_map_new(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<13>";
	var bb=this;
	pop_err();
	return bb;
}
bb_map_Map.prototype.bbCompare=function(bblhs,bbrhs){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<99>";
	pop_err();
	return 0;
}
bb_map_Map.prototype.bbFindNode=function(bbkey){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<124>";
	var bbnode=this.bbroot;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<126>";
	while((bbnode)!=null){
		err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<127>";
		var bbcmp=this.bbCompare(bbkey,dbg_object(bbnode).bbkey);
		err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<128>";
		if(bbcmp>0){
			err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<129>";
			bbnode=dbg_object(bbnode).bbright;
		}else{
			err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<130>";
			if(bbcmp<0){
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<131>";
				bbnode=dbg_object(bbnode).bbleft;
			}else{
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<133>";
				pop_err();
				return bbnode;
			}
		}
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<136>";
	pop_err();
	return bbnode;
}
bb_map_Map.prototype.bbGet=function(bbkey){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<65>";
	var bbnode=this.bbFindNode(bbkey);
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<66>";
	if((bbnode)!=null){
		err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<66>";
		var bb=dbg_object(bbnode).bbvalue;
		pop_err();
		return bb;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<64>";
	pop_err();
	return null;
}
bb_map_Map.prototype.bbValueForKey=function(bbkey){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<95>";
	var bb=this.bbGet(bbkey);
	pop_err();
	return bb;
}
bb_map_Map.prototype.bbRotateLeft=function(bbnode){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<212>";
	var bbchild=dbg_object(bbnode).bbright;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<213>";
	dbg_object(bbnode).bbright=dbg_object(bbchild).bbleft;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<214>";
	if((dbg_object(bbchild).bbleft)!=null){
		err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<215>";
		dbg_object(dbg_object(bbchild).bbleft).bbparent=bbnode;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<217>";
	dbg_object(bbchild).bbparent=dbg_object(bbnode).bbparent;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<218>";
	if((dbg_object(bbnode).bbparent)!=null){
		err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<219>";
		if(bbnode==dbg_object(dbg_object(bbnode).bbparent).bbleft){
			err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<220>";
			dbg_object(dbg_object(bbnode).bbparent).bbleft=bbchild;
		}else{
			err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<222>";
			dbg_object(dbg_object(bbnode).bbparent).bbright=bbchild;
		}
	}else{
		err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<225>";
		this.bbroot=bbchild;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<227>";
	dbg_object(bbchild).bbleft=bbnode;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<228>";
	dbg_object(bbnode).bbparent=bbchild;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<211>";
	pop_err();
	return 0;
}
bb_map_Map.prototype.bbRotateRight=function(bbnode){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<232>";
	var bbchild=dbg_object(bbnode).bbleft;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<233>";
	dbg_object(bbnode).bbleft=dbg_object(bbchild).bbright;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<234>";
	if((dbg_object(bbchild).bbright)!=null){
		err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<235>";
		dbg_object(dbg_object(bbchild).bbright).bbparent=bbnode;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<237>";
	dbg_object(bbchild).bbparent=dbg_object(bbnode).bbparent;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<238>";
	if((dbg_object(bbnode).bbparent)!=null){
		err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<239>";
		if(bbnode==dbg_object(dbg_object(bbnode).bbparent).bbright){
			err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<240>";
			dbg_object(dbg_object(bbnode).bbparent).bbright=bbchild;
		}else{
			err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<242>";
			dbg_object(dbg_object(bbnode).bbparent).bbleft=bbchild;
		}
	}else{
		err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<245>";
		this.bbroot=bbchild;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<247>";
	dbg_object(bbchild).bbright=bbnode;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<248>";
	dbg_object(bbnode).bbparent=bbchild;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<231>";
	pop_err();
	return 0;
}
bb_map_Map.prototype.bbInsertFixup=function(bbnode){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<173>";
	while(((dbg_object(bbnode).bbparent)!=null) && dbg_object(dbg_object(bbnode).bbparent).bbcolor==-1 && ((dbg_object(dbg_object(bbnode).bbparent).bbparent)!=null)){
		err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<174>";
		if(dbg_object(bbnode).bbparent==dbg_object(dbg_object(dbg_object(bbnode).bbparent).bbparent).bbleft){
			err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<175>";
			var bbuncle=dbg_object(dbg_object(dbg_object(bbnode).bbparent).bbparent).bbright;
			err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<176>";
			if(((bbuncle)!=null) && dbg_object(bbuncle).bbcolor==-1){
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<177>";
				dbg_object(dbg_object(bbnode).bbparent).bbcolor=1;
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<178>";
				dbg_object(bbuncle).bbcolor=1;
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<179>";
				dbg_object(dbg_object(bbuncle).bbparent).bbcolor=-1;
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<180>";
				bbnode=dbg_object(bbuncle).bbparent;
			}else{
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<182>";
				if(bbnode==dbg_object(dbg_object(bbnode).bbparent).bbright){
					err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<183>";
					bbnode=dbg_object(bbnode).bbparent;
					err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<184>";
					this.bbRotateLeft(bbnode);
				}
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<186>";
				dbg_object(dbg_object(bbnode).bbparent).bbcolor=1;
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<187>";
				dbg_object(dbg_object(dbg_object(bbnode).bbparent).bbparent).bbcolor=-1;
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<188>";
				this.bbRotateRight(dbg_object(dbg_object(bbnode).bbparent).bbparent);
			}
		}else{
			err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<191>";
			var bbuncle2=dbg_object(dbg_object(dbg_object(bbnode).bbparent).bbparent).bbleft;
			err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<192>";
			if(((bbuncle2)!=null) && dbg_object(bbuncle2).bbcolor==-1){
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<193>";
				dbg_object(dbg_object(bbnode).bbparent).bbcolor=1;
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<194>";
				dbg_object(bbuncle2).bbcolor=1;
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<195>";
				dbg_object(dbg_object(bbuncle2).bbparent).bbcolor=-1;
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<196>";
				bbnode=dbg_object(bbuncle2).bbparent;
			}else{
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<198>";
				if(bbnode==dbg_object(dbg_object(bbnode).bbparent).bbleft){
					err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<199>";
					bbnode=dbg_object(bbnode).bbparent;
					err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<200>";
					this.bbRotateRight(bbnode);
				}
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<202>";
				dbg_object(dbg_object(bbnode).bbparent).bbcolor=1;
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<203>";
				dbg_object(dbg_object(dbg_object(bbnode).bbparent).bbparent).bbcolor=-1;
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<204>";
				this.bbRotateLeft(dbg_object(dbg_object(bbnode).bbparent).bbparent);
			}
		}
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<208>";
	dbg_object(this.bbroot).bbcolor=1;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<172>";
	pop_err();
	return 0;
}
bb_map_Map.prototype.bbSet=function(bbkey,bbvalue){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<32>";
	var bbnode=this.bbroot;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<33>";
	var bbparent=null;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<33>";
	var bbcmp=0;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<35>";
	while((bbnode)!=null){
		err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<36>";
		bbparent=bbnode;
		err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<37>";
		bbcmp=this.bbCompare(bbkey,dbg_object(bbnode).bbkey);
		err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<38>";
		if(bbcmp>0){
			err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<39>";
			bbnode=dbg_object(bbnode).bbright;
		}else{
			err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<40>";
			if(bbcmp<0){
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<41>";
				bbnode=dbg_object(bbnode).bbleft;
			}else{
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<43>";
				dbg_object(bbnode).bbvalue=bbvalue;
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<44>";
				pop_err();
				return 0;
			}
		}
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<48>";
	bbnode=bb_map_new3.call(new bb_map_Node,bbkey,bbvalue,-1,bbparent);
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<50>";
	if(!((bbparent)!=null)){
		err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<51>";
		this.bbroot=bbnode;
		err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<52>";
		pop_err();
		return 0;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<55>";
	if(bbcmp>0){
		err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<56>";
		dbg_object(bbparent).bbright=bbnode;
	}else{
		err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<58>";
		dbg_object(bbparent).bbleft=bbnode;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<61>";
	this.bbInsertFixup(bbnode);
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<31>";
	pop_err();
	return 0;
}
bb_map_Map.prototype.bbInsert=function(bbkey,bbvalue){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<90>";
	var bb=this.bbSet(bbkey,bbvalue);
	pop_err();
	return bb;
}
bb_map_Map.prototype.bbValues=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<81>";
	var bb=bb_map_new6.call(new bb_map_MapValues,this);
	pop_err();
	return bb;
}
bb_map_Map.prototype.bbFirstNode=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<104>";
	if(!((this.bbroot)!=null)){
		err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<104>";
		pop_err();
		return null;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<106>";
	var bbnode=this.bbroot;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<107>";
	while((dbg_object(bbnode).bbleft)!=null){
		err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<108>";
		bbnode=dbg_object(bbnode).bbleft;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<110>";
	pop_err();
	return bbnode;
}
bb_map_Map.prototype.bbDeleteFixup=function(bbnode,bbparent){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<252>";
	while(((bbnode)!=null) && bbnode!=this.bbroot && dbg_object(bbnode).bbcolor==1){
		err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<253>";
		if(bbnode==dbg_object(bbparent).bbleft){
			err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<254>";
			var bbsib=dbg_object(bbparent).bbright;
			err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<255>";
			if(dbg_object(bbsib).bbcolor==-1){
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<256>";
				dbg_object(bbsib).bbcolor=1;
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<257>";
				dbg_object(bbparent).bbcolor=-1;
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<258>";
				this.bbRotateLeft(bbparent);
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<259>";
				bbsib=dbg_object(bbparent).bbright;
			}
			err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<261>";
			if(dbg_object(dbg_object(bbsib).bbleft).bbcolor==1 && dbg_object(dbg_object(bbsib).bbright).bbcolor==1){
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<262>";
				dbg_object(bbsib).bbcolor=-1;
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<263>";
				bbnode=bbparent;
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<264>";
				bbparent=dbg_object(bbparent).bbparent;
			}else{
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<266>";
				if(dbg_object(dbg_object(bbsib).bbright).bbcolor==1){
					err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<267>";
					dbg_object(dbg_object(bbsib).bbleft).bbcolor=1;
					err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<268>";
					dbg_object(bbsib).bbcolor=-1;
					err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<269>";
					this.bbRotateRight(bbsib);
					err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<270>";
					bbsib=dbg_object(bbparent).bbright;
				}
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<272>";
				dbg_object(bbsib).bbcolor=dbg_object(bbparent).bbcolor;
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<273>";
				dbg_object(bbparent).bbcolor=1;
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<274>";
				dbg_object(dbg_object(bbsib).bbright).bbcolor=1;
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<275>";
				this.bbRotateLeft(bbparent);
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<276>";
				bbnode=this.bbroot;
			}
		}else{
			err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<279>";
			var bbsib2=dbg_object(bbparent).bbleft;
			err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<280>";
			if(dbg_object(bbsib2).bbcolor==-1){
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<281>";
				dbg_object(bbsib2).bbcolor=1;
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<282>";
				dbg_object(bbparent).bbcolor=-1;
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<283>";
				this.bbRotateRight(bbparent);
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<284>";
				bbsib2=dbg_object(bbparent).bbleft;
			}
			err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<286>";
			if(dbg_object(dbg_object(bbsib2).bbright).bbcolor==1 && dbg_object(dbg_object(bbsib2).bbleft).bbcolor==1){
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<287>";
				dbg_object(bbsib2).bbcolor=-1;
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<288>";
				bbnode=bbparent;
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<289>";
				bbparent=dbg_object(bbparent).bbparent;
			}else{
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<291>";
				if(dbg_object(dbg_object(bbsib2).bbleft).bbcolor==1){
					err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<292>";
					dbg_object(dbg_object(bbsib2).bbright).bbcolor=1;
					err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<293>";
					dbg_object(bbsib2).bbcolor=-1;
					err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<294>";
					this.bbRotateLeft(bbsib2);
					err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<295>";
					bbsib2=dbg_object(bbparent).bbleft;
				}
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<297>";
				dbg_object(bbsib2).bbcolor=dbg_object(bbparent).bbcolor;
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<298>";
				dbg_object(bbparent).bbcolor=1;
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<299>";
				dbg_object(dbg_object(bbsib2).bbleft).bbcolor=1;
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<300>";
				this.bbRotateRight(bbparent);
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<301>";
				bbnode=this.bbroot;
			}
		}
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<305>";
	if((bbnode)!=null){
		err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<305>";
		dbg_object(bbnode).bbcolor=1;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<251>";
	pop_err();
	return 0;
}
bb_map_Map.prototype.bbRemoveNode=function(bbnode){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<140>";
	var bbsplice=null;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<140>";
	var bbchild=null;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<141>";
	if(!((dbg_object(bbnode).bbleft)!=null)){
		err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<142>";
		bbsplice=bbnode;
		err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<143>";
		bbchild=dbg_object(bbnode).bbright;
	}else{
		err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<144>";
		if(!((dbg_object(bbnode).bbright)!=null)){
			err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<145>";
			bbsplice=bbnode;
			err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<146>";
			bbchild=dbg_object(bbnode).bbleft;
		}else{
			err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<148>";
			bbsplice=dbg_object(bbnode).bbleft;
			err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<149>";
			while((dbg_object(bbsplice).bbright)!=null){
				err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<150>";
				bbsplice=dbg_object(bbsplice).bbright;
			}
			err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<152>";
			bbchild=dbg_object(bbsplice).bbleft;
			err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<153>";
			dbg_object(bbnode).bbkey=dbg_object(bbsplice).bbkey;
			err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<154>";
			dbg_object(bbnode).bbvalue=dbg_object(bbsplice).bbvalue;
		}
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<156>";
	var bbparent=dbg_object(bbsplice).bbparent;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<157>";
	if((bbchild)!=null){
		err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<158>";
		dbg_object(bbchild).bbparent=bbparent;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<160>";
	if(!((bbparent)!=null)){
		err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<161>";
		this.bbroot=bbchild;
		err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<162>";
		pop_err();
		return 0;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<164>";
	if(bbsplice==dbg_object(bbparent).bbleft){
		err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<165>";
		dbg_object(bbparent).bbleft=bbchild;
	}else{
		err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<167>";
		dbg_object(bbparent).bbright=bbchild;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<169>";
	if(dbg_object(bbsplice).bbcolor==1){
		err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<169>";
		this.bbDeleteFixup(bbchild,bbparent);
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<139>";
	pop_err();
	return 0;
}
bb_map_Map.prototype.bbRemove=function(bbkey){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<70>";
	var bbnode=this.bbFindNode(bbkey);
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<71>";
	if(!((bbnode)!=null)){
		err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<71>";
		pop_err();
		return 0;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<72>";
	this.bbRemoveNode(bbnode);
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<73>";
	pop_err();
	return 1;
}
function bb_map_StringMap(){
	bb_map_Map.call(this);
}
bb_map_StringMap.prototype=extend_class(bb_map_Map);
function bb_map_new2(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<510>";
	bb_map_new.call(this);
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<510>";
	var bb=this;
	pop_err();
	return bb;
}
bb_map_StringMap.prototype.bbCompare=function(bblhs,bbrhs){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<513>";
	var bbl=dbg_object(object_downcast((bblhs),bb_boxes_StringObject)).bbvalue;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<514>";
	var bbr=dbg_object(object_downcast((bbrhs),bb_boxes_StringObject)).bbvalue;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<515>";
	if(bbl<bbr){
		err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<515>";
		pop_err();
		return -1;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<516>";
	var bb=((bbl>bbr)?1:0);
	pop_err();
	return bb;
}
var bb_resource_resources;
function bb_map_Node(){
	Object.call(this);
	this.bbkey=null;
	this.bbright=null;
	this.bbleft=null;
	this.bbvalue=null;
	this.bbcolor=0;
	this.bbparent=null;
}
function bb_map_new3(bbkey,bbvalue,bbcolor,bbparent){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<318>";
	dbg_object(this).bbkey=bbkey;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<319>";
	dbg_object(this).bbvalue=bbvalue;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<320>";
	dbg_object(this).bbcolor=bbcolor;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<321>";
	dbg_object(this).bbparent=bbparent;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<317>";
	var bb=this;
	pop_err();
	return bb;
}
function bb_map_new4(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<315>";
	var bb=this;
	pop_err();
	return bb;
}
bb_map_Node.prototype.bbNextNode=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<339>";
	var bbnode=null;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<340>";
	if((this.bbright)!=null){
		err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<341>";
		bbnode=this.bbright;
		err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<342>";
		while((dbg_object(bbnode).bbleft)!=null){
			err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<343>";
			bbnode=dbg_object(bbnode).bbleft;
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<345>";
		pop_err();
		return bbnode;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<347>";
	bbnode=this;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<348>";
	var bbparent=dbg_object(this).bbparent;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<349>";
	while(((bbparent)!=null) && bbnode==dbg_object(bbparent).bbright){
		err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<350>";
		bbnode=bbparent;
		err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<351>";
		bbparent=dbg_object(bbparent).bbparent;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<353>";
	pop_err();
	return bbparent;
}
function bb_list_Node(){
	Object.call(this);
	this.bb_succ=null;
	this.bb_pred=null;
	this.bb_data=null;
}
function bb_list_new2(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/list.monkey<95>";
	this.bb_succ=this;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/list.monkey<96>";
	this.bb_pred=this;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/list.monkey<94>";
	var bb=this;
	pop_err();
	return bb;
}
function bb_list_new3(bbsucc,bbpred,bbdata){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/list.monkey<101>";
	this.bb_succ=bbsucc;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/list.monkey<102>";
	this.bb_pred=bbpred;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/list.monkey<103>";
	dbg_object(this.bb_succ).bb_pred=this;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/list.monkey<104>";
	dbg_object(this.bb_pred).bb_succ=this;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/list.monkey<105>";
	this.bb_data=bbdata;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/list.monkey<100>";
	var bb=this;
	pop_err();
	return bb;
}
function bb_graphics_Frame(){
	Object.call(this);
	this.bbx=0;
	this.bby=0;
}
function bb_graphics_new4(bbx,bby){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<52>";
	dbg_object(this).bbx=bbx;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<53>";
	dbg_object(this).bby=bby;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<51>";
	var bb=this;
	pop_err();
	return bb;
}
function bb_graphics_new5(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<47>";
	var bb=this;
	pop_err();
	return bb;
}
function bb_graphics_LoadImage(bbpath,bbframeCount,bbflags){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<280>";
	var bb=(bb_graphics_new3.call(new bb_graphics_Image)).bbLoad(bbpath,bbframeCount,bbflags);
	pop_err();
	return bb;
}
function bb_graphics_LoadImage2(bbpath,bbframeWidth,bbframeHeight,bbframeCount,bbflags){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<284>";
	var bbatlas=(bb_graphics_new3.call(new bb_graphics_Image)).bbLoad(bbpath,1,0);
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<285>";
	if((bbatlas)!=null){
		err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<285>";
		var bb=bbatlas.bbGrabImage(0,0,bbframeWidth,bbframeHeight,bbframeCount,bbflags);
		pop_err();
		return bb;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<283>";
	pop_err();
	return null;
}
function bb_graphics_SetFont(bbfont,bbfirstChar){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<536>";
	if(!((bbfont)!=null)){
		err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<537>";
		if(!((dbg_object(bb_graphics_context).bbdefaultFont)!=null)){
			err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<538>";
			dbg_object(bb_graphics_context).bbdefaultFont=bb_graphics_LoadImage("mojo_font.png",96,2);
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<540>";
		bbfont=dbg_object(bb_graphics_context).bbdefaultFont;
		err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<541>";
		bbfirstChar=32;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<543>";
	dbg_object(bb_graphics_context).bbfont=bbfont;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<544>";
	dbg_object(bb_graphics_context).bbfirstChar=bbfirstChar;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<535>";
	pop_err();
	return 0;
}
var bb_graphics_renderDevice;
function bb_graphics_SetMatrix(bbix,bbiy,bbjx,bbjy,bbtx,bbty){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<334>";
	dbg_object(bb_graphics_context).bbix=bbix;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<335>";
	dbg_object(bb_graphics_context).bbiy=bbiy;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<336>";
	dbg_object(bb_graphics_context).bbjx=bbjx;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<337>";
	dbg_object(bb_graphics_context).bbjy=bbjy;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<338>";
	dbg_object(bb_graphics_context).bbtx=bbtx;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<339>";
	dbg_object(bb_graphics_context).bbty=bbty;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<340>";
	dbg_object(bb_graphics_context).bbtformed=((bbix!=1.000000 || bbiy!=0.000000 || bbjx!=0.000000 || bbjy!=1.000000 || bbtx!=0.000000 || bbty!=0.000000)?1:0);
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<341>";
	dbg_object(bb_graphics_context).bbmatDirty=1;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<333>";
	pop_err();
	return 0;
}
function bb_graphics_SetMatrix2(bbm){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<330>";
	bb_graphics_SetMatrix(dbg_array(bbm,0)[0],dbg_array(bbm,1)[1],dbg_array(bbm,2)[2],dbg_array(bbm,3)[3],dbg_array(bbm,4)[4],dbg_array(bbm,5)[5]);
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<329>";
	pop_err();
	return 0;
}
function bb_graphics_SetColor(bbr,bbg,bbb){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<289>";
	dbg_object(bb_graphics_context).bbcolor_r=bbr;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<290>";
	dbg_object(bb_graphics_context).bbcolor_g=bbg;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<291>";
	dbg_object(bb_graphics_context).bbcolor_b=bbb;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<292>";
	dbg_object(bb_graphics_context).bbdevice.SetColor(bbr,bbg,bbb);
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<288>";
	pop_err();
	return 0;
}
function bb_graphics_SetAlpha(bbalpha){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<300>";
	dbg_object(bb_graphics_context).bbalpha=bbalpha;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<301>";
	dbg_object(bb_graphics_context).bbdevice.SetAlpha(bbalpha);
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<299>";
	pop_err();
	return 0;
}
function bb_graphics_SetBlend(bbblend){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<309>";
	dbg_object(bb_graphics_context).bbblend=bbblend;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<310>";
	dbg_object(bb_graphics_context).bbdevice.SetBlend(bbblend);
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<308>";
	pop_err();
	return 0;
}
function bb_graphics_DeviceWidth(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<272>";
	var bb=dbg_object(bb_graphics_context).bbdevice.Width();
	pop_err();
	return bb;
}
function bb_graphics_DeviceHeight(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<276>";
	var bb=dbg_object(bb_graphics_context).bbdevice.Height();
	pop_err();
	return bb;
}
function bb_graphics_SetScissor(bbx,bby,bbwidth,bbheight){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<318>";
	dbg_object(bb_graphics_context).bbscissor_x=bbx;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<319>";
	dbg_object(bb_graphics_context).bbscissor_y=bby;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<320>";
	dbg_object(bb_graphics_context).bbscissor_width=bbwidth;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<321>";
	dbg_object(bb_graphics_context).bbscissor_height=bbheight;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<322>";
	dbg_object(bb_graphics_context).bbdevice.SetScissor(((bbx)|0),((bby)|0),((bbwidth)|0),((bbheight)|0));
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<317>";
	pop_err();
	return 0;
}
function bb_graphics_BeginRender(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<258>";
	bb_graphics_renderDevice=dbg_object(bb_graphics_context).bbdevice;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<259>";
	dbg_object(bb_graphics_context).bbmatrixSp=0;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<260>";
	bb_graphics_SetMatrix(1.000000,0.000000,0.000000,1.000000,0.000000,0.000000);
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<261>";
	bb_graphics_SetColor(255.000000,255.000000,255.000000);
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<262>";
	bb_graphics_SetAlpha(1.000000);
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<263>";
	bb_graphics_SetBlend(0);
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<264>";
	bb_graphics_SetScissor(0.000000,0.000000,(bb_graphics_DeviceWidth()),(bb_graphics_DeviceHeight()));
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<257>";
	pop_err();
	return 0;
}
function bb_graphics_EndRender(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<268>";
	bb_graphics_renderDevice=null;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<267>";
	pop_err();
	return 0;
}
function bb_demo_Demo(){
	Object.call(this);
	this.bbsize=null;
	this.bbfloor=0;
	this.bbUpdates=0;
	this.bbworld=null;
}
function bb_demo_new(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<41>";
	this.bbsize=bb_vector_new.call(new bb_vector_Vector,600.000000,600.000000);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<42>";
	this.bbfloor=580.000000;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<43>";
	this.bbUpdates=3;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<40>";
	var bb=this;
	pop_err();
	return bb;
}
bb_demo_Demo.prototype.bbinit=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<51>";
	pop_err();
	return 0;
}
bb_demo_Demo.prototype.bbstart=function(bbworld){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<47>";
	dbg_object(this).bbworld=bbworld;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<48>";
	this.bbinit();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<46>";
	pop_err();
	return 0;
}
bb_demo_Demo.prototype.bbUpdate=function(bbdt){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<54>";
	pop_err();
	return 0;
}
bb_demo_Demo.prototype.bbaddBody=function(bbx,bby,bbshape,bbprops){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<62>";
	var bbb=bb_body_new.call(new bb_body_Body,bbx,bby,null);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<63>";
	bbb.bbaddShape(bbshape);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<64>";
	if(!(bbprops==null)){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<65>";
		dbg_object(bbb).bbproperties=bbprops;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<67>";
	this.bbworld.bbaddBody(bbb);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<68>";
	pop_err();
	return bbb;
}
bb_demo_Demo.prototype.bbaddRectangle=function(bbx,bby,bbw,bbh,bbmat){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<58>";
	var bb=this.bbaddBody(bbx,bby,bb_shape_makeBox(bbw,bbh,bb_constants_NaN,bb_constants_NaN,bbmat),null);
	pop_err();
	return bb;
}
bb_demo_Demo.prototype.bbcreateWord=function(bbstr,bbxp,bbyp,bbsize,bbspacing,bbmat){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<73>";
	for(var bbi=0;bbi<bbstr.length;bbi=bbi+1){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<74>";
		var bbletter=bbstr.charCodeAt(bbi);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<75>";
		if(bbletter==32){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<76>";
			bbxp+=bbsize;
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<77>";
			continue;
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<80>";
		var bbdatas=[];
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<82>";
		if(bbletter==33){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<83>";
			bbdatas=bb_fontarray_exclamation;
		}else{
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<85>";
			var bb=bbletter-97;
			bbdatas=dbg_array(bb_fontarray_lowerCase,bb)[bb];
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<88>";
		if(!((bbdatas).length!=0)){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<89>";
			continue;
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<92>";
		var bbxmax=0;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<94>";
		for(var bby=0;bby<bb_fontarray_HEIGHT;bby=bby+1){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<95>";
			for(var bbx=0;bbx<bb_fontarray_WIDTH;bbx=bbx+1){
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<96>";
				var bb2=bbx+bby*bb_fontarray_WIDTH;
				if(dbg_array(bbdatas,bb2)[bb2]==1){
					err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<97>";
					if(bbx>bbxmax){
						err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<98>";
						bbxmax=bbx;
					}
					err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<100>";
					this.bbaddRectangle(bbxp+(bbx)*(bbsize+bbspacing),bbyp+(bby)*(bbsize+bbspacing),bbsize,bbsize,bbmat);
				}
			}
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<105>";
		bbxp+=(bbxmax+1)*(bbsize+bbspacing)+bbsize;
	}
}
bb_demo_Demo.prototype.bbcreateConvexPoly=function(bbnverts,bbradius,bbrotation,bbmat){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<111>";
	var bbvl=bb_haxetypes_new7.call(new bb_haxetypes_HaxeArray);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<113>";
	for(var bbi=0;bbi<bbnverts;bbi=bbi+1){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<114>";
		var bbangle=-2.000000*bb_constants_PI*(bbi)/(bbnverts);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<115>";
		bbangle+=bbrotation;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<116>";
		bbvl.bbPush(bb_vector_new.call(new bb_vector_Vector,bbradius*bb_haxetypes_Cos(bbangle),bbradius*bb_haxetypes_Sin(bbangle)));
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<119>";
	var bb=bb_polygon_new.call(new bb_polygon_Polygon,bbvl,bb_vector_new.call(new bb_vector_Vector,0.000000,0.000000),bbmat);
	pop_err();
	return bb;
}
bb_demo_Demo.prototype.bbcreateFloor=function(bbmat){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<143>";
	var bbs=bb_shape_makeBox(600.000000,40.000000,0.000000,this.bbfloor,bbmat);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<144>";
	this.bbworld.bbaddStaticShape(bbs);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<142>";
	pop_err();
	return 0;
}
bb_demo_Demo.prototype.bbcreatePoly=function(bbx,bby,bba,bbshape,bbprops){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<123>";
	var bbb=bb_body_new.call(new bb_body_Body,bbx,bby,null);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<124>";
	var bbvl=bb_haxetypes_new7.call(new bb_haxetypes_HaxeArray);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<125>";
	var bbv=dbg_object(bbshape).bbverts;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<127>";
	while(!(bbv==null)){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<128>";
		bbvl.bbPush(bbv);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<129>";
		bbv=dbg_object(bbv).bbnextItem;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<132>";
	bbb.bbaddShape((bb_polygon_new.call(new bb_polygon_Polygon,bbvl,bb_vector_new.call(new bb_vector_Vector,0.000000,0.000000),dbg_object(bbshape).bbmaterial)));
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<133>";
	bbb.bbsetAngle(bba);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<135>";
	if(!(bbprops==null)){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<136>";
		dbg_object(bbb).bbproperties=bbprops;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<139>";
	this.bbworld.bbaddBody(bbb);
}
bb_demo_Demo.prototype.bbrand=function(bbmin,bbmax){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/demo.monkey<148>";
	var bb=(bb_haxetypes_Round(bb_random_Rnd()*(bbmax-bbmin+1.000000)))+bbmin;
	pop_err();
	return bb;
}
function bb_titledemo_TitleDemo(){
	bb_demo_Demo.call(this);
}
bb_titledemo_TitleDemo.prototype=extend_class(bb_demo_Demo);
function bb_titledemo_new(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/titledemo.monkey<33>";
	bb_demo_new.call(this);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/titledemo.monkey<33>";
	var bb=this;
	pop_err();
	return bb;
}
bb_titledemo_TitleDemo.prototype.bbinit=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/titledemo.monkey<36>";
	this.bbcreateWord("fling!",180.000000,180.000000,20.000000,0.000000,null);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/titledemo.monkey<37>";
	var bbmaterial=bb_material_new.call(new bb_material_Material,0.1,0.7,3.000000);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/titledemo.monkey<38>";
	var bbstick1=this.bbaddRectangle(-100.000000,0.000000,100.000000,20.000000,bbmaterial);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/titledemo.monkey<39>";
	bbstick1.bbsetSpeed(2.000000,1.000000,0.075);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/titledemo.monkey<40>";
	var bbstick2=this.bbaddRectangle(700.000000,600.000000,100.000000,20.000000,bbmaterial);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/titledemo.monkey<41>";
	bbstick2.bbsetSpeed(-2.000000,-1.000000,-0.025000);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/titledemo.monkey<42>";
	var bbstick3=this.bbaddBody(290.000000,750.000000,this.bbcreateConvexPoly(3,30.000000,0.000000,bbmaterial),null);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/titledemo.monkey<43>";
	bbstick3.bbsetSpeed(0.25,-1.250000,0.005);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/titledemo.monkey<35>";
	pop_err();
	return 0;
}
function bb_vector_Vector(){
	Object.call(this);
	this.bbx=0;
	this.bby=0;
	this.bbnextItem=null;
}
function bb_vector_new(bbpx,bbpy){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/vector.monkey<39>";
	this.bbx=bbpx;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/vector.monkey<40>";
	this.bby=bbpy;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/vector.monkey<38>";
	var bb=this;
	pop_err();
	return bb;
}
function bb_vector_new2(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/vector.monkey<32>";
	var bb=this;
	pop_err();
	return bb;
}
bb_vector_Vector.prototype.bblength=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/vector.monkey<73>";
	var bb=Math.sqrt(this.bbx*this.bbx+this.bby*this.bby);
	pop_err();
	return bb;
}
bb_vector_Vector.prototype.bbplus=function(bbv){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/vector.monkey<61>";
	var bb=bb_vector_new.call(new bb_vector_Vector,this.bbx+dbg_object(bbv).bbx,this.bby+dbg_object(bbv).bby);
	pop_err();
	return bb;
}
function bb_vector_normal(bbx,bby){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/vector.monkey<81>";
	var bbd=Math.sqrt(bbx*bbx+bby*bby);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/vector.monkey<82>";
	var bbk=1.000000/bbd;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/vector.monkey<84>";
	if(bbd<bb_constants_EPSILON){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/vector.monkey<85>";
		bbk=0.000000;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/vector.monkey<88>";
	var bb=bb_vector_new.call(new bb_vector_Vector,-bby*bbk,bbx*bbk);
	pop_err();
	return bb;
}
bb_vector_Vector.prototype.bbdot=function(bbv){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/vector.monkey<53>";
	var bb=this.bbx*dbg_object(bbv).bbx+this.bby*dbg_object(bbv).bby;
	pop_err();
	return bb;
}
bb_vector_Vector.prototype.bbclone=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/vector.monkey<44>";
	var bb=bb_vector_new.call(new bb_vector_Vector,this.bbx,this.bby);
	pop_err();
	return bb;
}
bb_vector_Vector.prototype.bbminus=function(bbv){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/vector.monkey<65>";
	var bb=bb_vector_new.call(new bb_vector_Vector,this.bbx-dbg_object(bbv).bbx,this.bby-dbg_object(bbv).bby);
	pop_err();
	return bb;
}
bb_vector_Vector.prototype.bbcross=function(bbv){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/vector.monkey<57>";
	var bb=this.bbx*dbg_object(bbv).bby-this.bby*dbg_object(bbv).bbx;
	pop_err();
	return bb;
}
bb_vector_Vector.prototype.bbset=function(bbpx,bbpy){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/vector.monkey<48>";
	this.bbx=bbpx;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/vector.monkey<49>";
	this.bby=bbpy;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/vector.monkey<47>";
	pop_err();
	return 0;
}
bb_vector_Vector.prototype.bbmult=function(bbs){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/vector.monkey<69>";
	var bb=bb_vector_new.call(new bb_vector_Vector,this.bbx*bbs,this.bby*bbs);
	pop_err();
	return bb;
}
function bb_broadphase_BroadCallback(){
	Object.call(this);
}
function bb_broadphase_new(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/broadphase.monkey<35>";
	var bb=this;
	pop_err();
	return bb;
}
bb_broadphase_BroadCallback.prototype.bbonCollide=function(bbs1,bbs2){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/broadphase.monkey<37>";
	pop_err();
	return false;
}
function bb_world_World(){
	bb_broadphase_BroadCallback.call(this);
	this.bbbodies=null;
	this.bbjoints=null;
	this.bbarbiters=null;
	this.bbproperties=null;
	this.bbgravity=null;
	this.bbstamp=0;
	this.bbdebug=false;
	this.bbuseIslands=false;
	this.bbsleepEpsilon=0;
	this.bbboundsCheck=0;
	this.bballocator=null;
	this.bbcollision=null;
	this.bbstaticBody=null;
	this.bbbox=null;
	this.bbbroadphase=null;
	this.bbtimer=null;
	this.bbislands=null;
	this.bbwaitingBodies=null;
	this.bbtestedCollisions=0;
	this.bbactiveCollisions=0;
}
bb_world_World.prototype=extend_class(bb_broadphase_BroadCallback);
function bb_world_new(bbworldBoundary,bbbroadphase){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<57>";
	bb_broadphase_new.call(this);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<59>";
	this.bbbodies=bb_haxetypes_new.call(new bb_haxetypes_HaxeFastList);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<60>";
	this.bbjoints=bb_haxetypes_new.call(new bb_haxetypes_HaxeFastList);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<61>";
	this.bbarbiters=bb_haxetypes_new.call(new bb_haxetypes_HaxeFastList);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<62>";
	this.bbproperties=bb_map_new5.call(new bb_map_IntMap);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<63>";
	this.bbgravity=bb_vector_new.call(new bb_vector_Vector,0.000000,0.000000);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<64>";
	this.bbstamp=0;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<65>";
	this.bbdebug=false;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<66>";
	this.bbuseIslands=true;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<67>";
	this.bbsleepEpsilon=bb_constants_DEFAULT_SLEEP_EPSILON;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<68>";
	this.bbboundsCheck=bb_constants_WORLD_BOUNDS_FREQ;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<69>";
	this.bballocator=bb_allocator_new.call(new bb_allocator_Allocator);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<70>";
	this.bbcollision=bb_collision_new.call(new bb_collision_Collision);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<71>";
	this.bbstaticBody=bb_body_new.call(new bb_body_Body,0.000000,0.000000,null);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<72>";
	dbg_object(this.bbstaticBody).bbisland=bb_island_new.call(new bb_island_Island,this);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<73>";
	this.bbstaticBody.bbupdatePhysics();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<74>";
	this.bbbox=bbworldBoundary;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<75>";
	dbg_object(this).bbbroadphase=bbbroadphase;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<76>";
	bbbroadphase.bbinit(this.bbbox,(this),this.bbstaticBody);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<77>";
	this.bbtimer=bb_timer_new.call(new bb_timer_Timer);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<78>";
	this.bbislands=bb_haxetypes_new.call(new bb_haxetypes_HaxeFastList);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<79>";
	this.bbwaitingBodies=bb_haxetypes_new.call(new bb_haxetypes_HaxeFastList);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<57>";
	var bb=this;
	pop_err();
	return bb;
}
function bb_world_new2(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<35>";
	bb_broadphase_new.call(this);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<35>";
	var bb=this;
	pop_err();
	return bb;
}
bb_world_World.prototype.bbbuildIslands=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<103>";
	var bbstack=bb_haxetypes_new.call(new bb_haxetypes_HaxeFastList);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<104>";
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<104>";
	var bb=this.bbwaitingBodies.bbObjectEnumerator();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<104>";
	while(bb.bbHasNext()){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<104>";
		var bbb=object_downcast((bb.bbNextObject()),bb_body_Body);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<106>";
		if(!(dbg_object(bbb).bbisland==null) || dbg_object(bbb).bbisStatic){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<107>";
			continue;
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<109>";
		var bbi=this.bballocator.bballocIsland(this);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<110>";
		this.bbislands.bbAdd(bbi);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<111>";
		bbstack.bbAdd(bbb);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<112>";
		dbg_object(bbb).bbisland=bbi;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<113>";
		while(true){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<115>";
			var bbb2=object_downcast((bbstack.bbPop()),bb_body_Body);
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<116>";
			if(bbb2==null){
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<117>";
				break;
			}
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<119>";
			dbg_object(bbi).bbbodies.bbAdd(bbb2);
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<120>";
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<120>";
			var bb2=bbb2.bbGetArbiters().bbObjectEnumerator();
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<120>";
			while(bb2.bbHasNext()){
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<120>";
				var bba=object_downcast((bb2.bbNextObject()),bb_arbiter_Arbiter);
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<122>";
				if(!(dbg_object(bba).bbisland==null)){
					err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<123>";
					continue;
				}
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<125>";
				bbi.bbAddArbiter(bba);
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<126>";
				dbg_object(bba).bbisland=bbi;
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<127>";
				var bbb1=dbg_object(dbg_object(bba).bbs1).bbbody;
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<128>";
				if(dbg_object(bbb1).bbisland==null && !dbg_object(bbb1).bbisStatic){
					err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<130>";
					dbg_object(bbb1).bbisland=bbi;
					err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<131>";
					bbstack.bbAdd(bbb1);
				}
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<134>";
				var bbb22=dbg_object(dbg_object(bba).bbs2).bbbody;
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<135>";
				if(dbg_object(bbb22).bbisland==null && !dbg_object(bbb22).bbisStatic){
					err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<137>";
					dbg_object(bbb22).bbisland=bbi;
					err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<138>";
					bbstack.bbAdd(bbb22);
				}
			}
		}
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<144>";
	this.bbwaitingBodies=bb_haxetypes_new.call(new bb_haxetypes_HaxeFastList);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<101>";
	pop_err();
	return 0;
}
bb_world_World.prototype.bbcheckBody=function(bbb,bbi){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<444>";
	if(!(dbg_object(bbb).bbisland==bbi)){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<445>";
		print("ASSERT");
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<447>";
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<447>";
	var bb=bbb.bbGetArbiters().bbObjectEnumerator();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<447>";
	while(bb.bbHasNext()){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<447>";
		var bba=object_downcast((bb.bbNextObject()),bb_arbiter_Arbiter);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<449>";
		if(!(dbg_object(bba).bbisland==bbi)){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<450>";
			print("ASSERT");
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<452>";
		if(!(dbg_object(dbg_object(dbg_object(bba).bbs1).bbbody).bbisland==bbi) && !dbg_object(dbg_object(dbg_object(bba).bbs1).bbbody).bbisStatic){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<453>";
			print("ASSERT");
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<455>";
		if(!(dbg_object(dbg_object(dbg_object(bba).bbs2).bbbody).bbisland==bbi) && !dbg_object(dbg_object(dbg_object(bba).bbs2).bbbody).bbisStatic){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<456>";
			print("ASSERT");
		}
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<442>";
	pop_err();
	return 0;
}
bb_world_World.prototype.bbcheckDatas=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<462>";
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<462>";
	var bb=this.bbwaitingBodies.bbObjectEnumerator();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<462>";
	while(bb.bbHasNext()){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<462>";
		var bbb=object_downcast((bb.bbNextObject()),bb_body_Body);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<464>";
		this.bbcheckBody(bbb,null);
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<467>";
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<467>";
	var bb2=this.bbislands.bbObjectEnumerator();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<467>";
	while(bb2.bbHasNext()){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<467>";
		var bbi=object_downcast((bb2.bbNextObject()),bb_island_Island);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<469>";
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<469>";
		var bb3=dbg_object(bbi).bbbodies.bbObjectEnumerator();
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<469>";
		while(bb3.bbHasNext()){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<469>";
			var bbb2=object_downcast((bb3.bbNextObject()),bb_body_Body);
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<471>";
			this.bbcheckBody(bbb2,bbi);
		}
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<460>";
	pop_err();
	return 0;
}
bb_world_World.prototype.bbdestroyIsland=function(bbi){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<247>";
	if(bbi==null || !this.bbuseIslands){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<248>";
		pop_err();
		return 0;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<250>";
	if(!this.bbislands.bbRemove(bbi)){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<251>";
		pop_err();
		return 0;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<253>";
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<253>";
	var bb=dbg_object(bbi).bbbodies.bbObjectEnumerator();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<253>";
	while(bb.bbHasNext()){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<253>";
		var bbb=object_downcast((bb.bbNextObject()),bb_body_Body);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<255>";
		dbg_object(bbb).bbisland=null;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<256>";
		this.bbwaitingBodies.bbAdd(bbb);
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<259>";
	bbi.bbReleaseArbiters();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<261>";
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<261>";
	var bb2=dbg_object(bbi).bbjoints.bbObjectEnumerator();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<261>";
	while(bb2.bbHasNext()){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<261>";
		var bbj=object_downcast((bb2.bbNextObject()),bb_joint_Joint);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<263>";
		dbg_object(bbj).bbisland=null;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<266>";
	this.bballocator.bbfreeIsland(bbi);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<245>";
	pop_err();
	return 0;
}
bb_world_World.prototype.bbremoveBody=function(bbb){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<383>";
	if(!this.bbbodies.bbRemove(bbb)){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<384>";
		pop_err();
		return false;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<386>";
	dbg_object(dbg_object(bbb).bbproperties).bbcount-=1;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<387>";
	if(dbg_object(dbg_object(bbb).bbproperties).bbcount==0){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<388>";
		this.bbproperties.bbRemove(bb_boxes_new5.call(new bb_boxes_IntObject,dbg_object(dbg_object(bbb).bbproperties).bbid));
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<390>";
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<390>";
	var bb=dbg_object(bbb).bbshapes.bbObjectEnumerator();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<390>";
	while(bb.bbHasNext()){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<390>";
		var bbs=object_downcast((bb.bbNextObject()),bb_shape_Shape);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<392>";
		this.bbbroadphase.bbremoveShape(bbs);
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<395>";
	this.bbdestroyIsland(dbg_object(bbb).bbisland);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<396>";
	this.bbwaitingBodies.bbRemove(bbb);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<398>";
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<398>";
	var bb2=bbb.bbGetArbiters().bbObjectEnumerator();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<398>";
	while(bb2.bbHasNext()){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<398>";
		var bba=object_downcast((bb2.bbNextObject()),bb_arbiter_Arbiter);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<400>";
		var bbb1=dbg_object(dbg_object(bba).bbs1).bbbody;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<401>";
		if(bbb1==bbb){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<403>";
			dbg_object(dbg_object(bba).bbs2).bbbody.bbRemoveArbiter(bba);
		}else{
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<406>";
			bbb1.bbRemoveArbiter(bba);
		}
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<410>";
	pop_err();
	return true;
}
bb_world_World.prototype.bbUpdate=function(bbdt,bbiterations){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<148>";
	if(bbdt<bb_constants_EPSILON){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<149>";
		bbdt=0.000000;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<151>";
	this.bbtimer.bbstart("all");
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<153>";
	var bbinvDt=1.000000/bbdt;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<154>";
	if(bbdt==0.000000){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<156>";
		bbinvDt=0.000000;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<159>";
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<159>";
	var bb=this.bbproperties.bbValues().bbObjectEnumerator();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<159>";
	while((bb.bbHasNext())!=0){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<159>";
		var bbp=object_downcast((bb.bbNextObject()),bb_properties_Properties);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<161>";
		dbg_object(bbp).bblfdt=Math.pow(dbg_object(bbp).bblinearFriction,bbdt);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<162>";
		dbg_object(bbp).bbafdt=Math.pow(dbg_object(bbp).bbangularFriction,bbdt);
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<165>";
	this.bbtimer.bbstart("island");
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<166>";
	if(this.bbuseIslands){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<167>";
		this.bbbuildIslands();
	}else{
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<170>";
		var bbi=this.bballocator.bballocIsland(this);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<171>";
		dbg_object(bbi).bbbodies=this.bbbodies;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<172>";
		bbi.bbReplaceArbiters(this.bbarbiters);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<173>";
		dbg_object(bbi).bbjoints=this.bbjoints;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<174>";
		this.bbsleepEpsilon=0.000000;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<176>";
		this.bbislands=bb_haxetypes_new.call(new bb_haxetypes_HaxeFastList);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<177>";
		this.bbislands.bbAdd(bbi);
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<180>";
	if(this.bbdebug){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<181>";
		this.bbcheckDatas();
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<183>";
	this.bbtimer.bbstop();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<185>";
	this.bbtimer.bbstart("solve");
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<186>";
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<186>";
	var bb2=this.bbislands.bbObjectEnumerator();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<186>";
	while(bb2.bbHasNext()){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<186>";
		var bbi2=object_downcast((bb2.bbNextObject()),bb_island_Island);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<188>";
		if(!dbg_object(bbi2).bbsleeping){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<189>";
			bbi2.bbsolve(bbdt,bbinvDt,bbiterations);
		}
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<193>";
	this.bbtimer.bbstop();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<195>";
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<195>";
	var bb3=this.bbarbiters.bbObjectEnumerator();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<195>";
	while(bb3.bbHasNext()){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<195>";
		var bba=object_downcast((bb3.bbNextObject()),bb_arbiter_Arbiter);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<197>";
		if(this.bbstamp-dbg_object(bba).bbstamp>3){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<199>";
			this.bballocator.bbfreeAllContacts(dbg_object(bba).bbcontacts);
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<200>";
			var bbb1=dbg_object(dbg_object(bba).bbs1).bbbody;
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<201>";
			var bbb2=dbg_object(dbg_object(bba).bbs2).bbbody;
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<202>";
			bbb1.bbRemoveArbiter(bba);
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<203>";
			bbb2.bbRemoveArbiter(bba);
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<204>";
			this.bbarbiters.bbRemove(bba);
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<205>";
			this.bballocator.bbfreeArbiter(bba);
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<206>";
			this.bbdestroyIsland(dbg_object(bbb1).bbisland);
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<207>";
			this.bbdestroyIsland(dbg_object(bbb2).bbisland);
		}
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<211>";
	this.bbtimer.bbstart("col");
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<212>";
	this.bbbroadphase.bbcommit();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<213>";
	this.bbtestedCollisions=0;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<214>";
	this.bbactiveCollisions=0;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<215>";
	if(this.bbdebug && !this.bbbroadphase.bbvalidate()){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<216>";
		print("INVALID BF DATAS");
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<218>";
	this.bbbroadphase.bbcollide();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<219>";
	this.bbtimer.bbstop();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<221>";
	this.bbstamp+=1;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<222>";
	if(this.bbboundsCheck>0 && this.bbstamp % this.bbboundsCheck==0){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<224>";
		var bbtmp=bb_haxetypes_new.call(new bb_haxetypes_HaxeFastList);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<225>";
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<225>";
		var bb4=this.bbbodies.bbObjectEnumerator();
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<225>";
		while(bb4.bbHasNext()){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<225>";
			var bbb=object_downcast((bb4.bbNextObject()),bb_body_Body);
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<227>";
			bbtmp.bbAdd(bbb);
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<230>";
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<230>";
		var bb5=this.bbbroadphase.bbpick(this.bbbox).bbObjectEnumerator();
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<230>";
		while(bb5.bbHasNext()){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<230>";
			var bbs=object_downcast((bb5.bbNextObject()),bb_shape_Shape);
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<232>";
			bbtmp.bbRemove(dbg_object(bbs).bbbody);
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<235>";
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<235>";
		var bb6=bbtmp.bbObjectEnumerator();
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<235>";
		while(bb6.bbHasNext()){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<235>";
			var bbb3=object_downcast((bb6.bbNextObject()),bb_body_Body);
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<237>";
			if(this.bbremoveBody(bbb3)){
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<238>";
				bbb3.bbonDestroy();
			}
		}
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<243>";
	this.bbtimer.bbstop();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<146>";
	pop_err();
	return 0;
}
bb_world_World.prototype.bbaddBody=function(bbb){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<359>";
	this.bbbodies.bbAdd(bbb);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<360>";
	this.bbwaitingBodies.bbAdd(bbb);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<361>";
	dbg_object(dbg_object(bbb).bbproperties).bbcount+=1;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<362>";
	dbg_object(bbb).bbmotion=this.bbsleepEpsilon*(bb_constants_WAKEUP_FACTOR);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<363>";
	this.bbproperties.bbSet((bb_boxes_new5.call(new bb_boxes_IntObject,dbg_object(dbg_object(bbb).bbproperties).bbid)),dbg_object(bbb).bbproperties);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<364>";
	if(dbg_object(bbb).bbisStatic){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<366>";
		dbg_object(bbb).bbmass=bb_constants_POSITIVE_INFINITY;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<367>";
		dbg_object(bbb).bbinvMass=0.000000;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<368>";
		dbg_object(bbb).bbinertia=bb_constants_POSITIVE_INFINITY;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<369>";
		dbg_object(bbb).bbinvInertia=0.000000;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<370>";
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<370>";
		var bb=dbg_object(bbb).bbshapes.bbObjectEnumerator();
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<370>";
		while(bb.bbHasNext()){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<370>";
			var bbs=object_downcast((bb.bbNextObject()),bb_shape_Shape);
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<371>";
			bbs.bbupdate();
		}
	}else{
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<374>";
		bbb.bbupdatePhysics();
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<376>";
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<376>";
	var bb2=dbg_object(bbb).bbshapes.bbObjectEnumerator();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<376>";
	while(bb2.bbHasNext()){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<376>";
		var bbs2=object_downcast((bb2.bbNextObject()),bb_shape_Shape);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<378>";
		this.bbbroadphase.bbaddShape(bbs2);
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<357>";
	pop_err();
	return 0;
}
bb_world_World.prototype.bbsetBroadPhase=function(bbbf){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<83>";
	bbbf.bbinit(this.bbbox,(this),this.bbstaticBody);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<84>";
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<84>";
	var bb=this.bbbodies.bbObjectEnumerator();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<84>";
	while(bb.bbHasNext()){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<84>";
		var bbb=object_downcast((bb.bbNextObject()),bb_body_Body);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<86>";
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<86>";
		var bb2=dbg_object(bbb).bbshapes.bbObjectEnumerator();
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<86>";
		while(bb2.bbHasNext()){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<86>";
			var bbs=object_downcast((bb2.bbNextObject()),bb_shape_Shape);
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<88>";
			this.bbbroadphase.bbremoveShape(bbs);
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<89>";
			bbbf.bbaddShape(bbs);
		}
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<93>";
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<93>";
	var bb3=dbg_object(this.bbstaticBody).bbshapes.bbObjectEnumerator();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<93>";
	while(bb3.bbHasNext()){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<93>";
		var bbs2=object_downcast((bb3.bbNextObject()),bb_shape_Shape);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<95>";
		this.bbbroadphase.bbremoveShape(bbs2);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<96>";
		bbbf.bbaddShape(bbs2);
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<99>";
	this.bbbroadphase=bbbf;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<81>";
	pop_err();
	return 0;
}
bb_world_World.prototype.bbaddStaticShape=function(bbs){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<347>";
	this.bbstaticBody.bbaddShape(bbs);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<348>";
	bbs.bbupdate();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<349>";
	this.bbbroadphase.bbaddShape(bbs);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<350>";
	pop_err();
	return bbs;
}
bb_world_World.prototype.bbonCollide=function(bbs1,bbs2){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<270>";
	var bbb1=dbg_object(bbs1).bbbody;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<271>";
	var bbb2=dbg_object(bbs2).bbbody;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<272>";
	this.bbtestedCollisions+=1;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<274>";
	if(bbb1==bbb2 || (dbg_object(bbs1).bbgroups&dbg_object(bbs2).bbgroups)==0){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<275>";
		pop_err();
		return false;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<278>";
	if(dbg_object(bbs1).bbtype>dbg_object(bbs2).bbtype){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<280>";
		var bbtmp=bbs1;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<281>";
		bbs1=bbs2;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<282>";
		bbs2=bbtmp;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<284>";
	var bbpairFound=true;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<285>";
	var bba=null;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<286>";
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<286>";
	var bb=bbb1.bbGetArbiters().bbObjectEnumerator();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<286>";
	while(bb.bbHasNext()){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<286>";
		var bbarb=object_downcast((bb.bbNextObject()),bb_arbiter_Arbiter);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<288>";
		if(dbg_object(bbarb).bbs1==bbs1 && dbg_object(bbarb).bbs2==bbs2 || dbg_object(bbarb).bbs1==bbs2 && dbg_object(bbarb).bbs2==bbs1){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<290>";
			bba=bbarb;
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<291>";
			break;
		}
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<295>";
	if(bba==null){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<297>";
		bba=this.bballocator.bballocArbiter();
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<298>";
		bba.bbassign(bbs1,bbs2);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<299>";
		bbpairFound=false;
	}else{
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<300>";
		if(dbg_object(bba).bbsleeping){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<302>";
			dbg_object(bba).bbstamp=this.bbstamp;
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<303>";
			pop_err();
			return true;
		}else{
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<304>";
			if(dbg_object(bba).bbstamp==this.bbstamp){
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<307>";
				pop_err();
				return true;
			}
		}
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<309>";
	dbg_object(bba).bbsleeping=false;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<310>";
	this.bbactiveCollisions+=1;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<312>";
	var bbcol=this.bbcollision.bbtestShapes(bbs1,bbs2,bba);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<313>";
	if(bbcol){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<315>";
		dbg_object(bba).bbstamp=this.bbstamp;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<316>";
		if(bbpairFound){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<319>";
			dbg_object(bba).bbs1=bbs1;
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<320>";
			dbg_object(bba).bbs2=bbs2;
		}else{
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<323>";
			this.bbarbiters.bbAdd(bba);
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<324>";
			var bbi1=dbg_object(bbb1).bbisland;
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<325>";
			if(!(bbi1==dbg_object(bbb2).bbisland)){
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<327>";
				this.bbdestroyIsland(bbi1);
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<328>";
				this.bbdestroyIsland(dbg_object(bbb2).bbisland);
			}else{
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<329>";
				if((bbi1)!=null){
					err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<331>";
					bbi1.bbAddArbiter(bba);
					err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<332>";
					dbg_object(bba).bbisland=bbi1;
				}
			}
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<335>";
			dbg_object(bbs2).bbbody.bbAddArbiter(bba);
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<336>";
			dbg_object(bbs1).bbbody.bbAddArbiter(bba);
		}
	}else{
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<338>";
		if(!bbpairFound){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<339>";
			this.bballocator.bbfreeArbiter(bba);
		}
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/world.monkey<342>";
	pop_err();
	return bbcol;
}
function bb_aabb_AABB(){
	Object.call(this);
	this.bbl=0;
	this.bbt=0;
	this.bbr=0;
	this.bbb=0;
	this.bbshape=null;
	this.bbnextItem=null;
	this.bbprev=null;
	this.bbbounds=null;
}
function bb_aabb_new(bbleft,bbtop,bbright,bbbottom){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/aabb.monkey<44>";
	dbg_object(this).bbl=(bbleft);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/aabb.monkey<45>";
	dbg_object(this).bbt=(bbtop);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/aabb.monkey<46>";
	dbg_object(this).bbr=(bbright);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/aabb.monkey<47>";
	dbg_object(this).bbb=(bbbottom);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/aabb.monkey<42>";
	var bb=this;
	pop_err();
	return bb;
}
function bb_aabb_new2(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/aabb.monkey<33>";
	var bb=this;
	pop_err();
	return bb;
}
bb_aabb_AABB.prototype.bbintersects2=function(bbaabb){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/aabb.monkey<55>";
	var bb=((this.bbl<=dbg_object(bbaabb).bbr && dbg_object(bbaabb).bbl<=this.bbr && this.bbt<=dbg_object(bbaabb).bbb && dbg_object(bbaabb).bbt<=this.bbb)?1:0);
	pop_err();
	return bb;
}
bb_aabb_AABB.prototype.bbintersects=function(bbaabb){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/aabb.monkey<51>";
	var bb=((!(dbg_object(bbaabb).bbl>this.bbr || dbg_object(bbaabb).bbr<this.bbl || dbg_object(bbaabb).bbt>this.bbb || dbg_object(bbaabb).bbb<this.bbt))?1:0);
	pop_err();
	return bb;
}
function bb_broadphase_BroadPhase(){
	Object.call(this);
}
function bb_broadphase_new2(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/broadphase.monkey<40>";
	var bb=this;
	pop_err();
	return bb;
}
bb_broadphase_BroadPhase.prototype.bbinit=function(bbbounds,bbcb,bbstaticBody){
	push_err();
}
bb_broadphase_BroadPhase.prototype.bbsyncShape=function(bbs){
	push_err();
}
bb_broadphase_BroadPhase.prototype.bbcommit=function(){
	push_err();
}
bb_broadphase_BroadPhase.prototype.bbvalidate=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/broadphase.monkey<55>";
	pop_err();
	return false;
}
bb_broadphase_BroadPhase.prototype.bbcollide=function(){
	push_err();
}
bb_broadphase_BroadPhase.prototype.bbpick=function(bbbounds){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/broadphase.monkey<53>";
	pop_err();
	return null;
}
bb_broadphase_BroadPhase.prototype.bbremoveShape=function(bbs){
	push_err();
}
bb_broadphase_BroadPhase.prototype.bbaddShape=function(bbs){
	push_err();
}
function bb_sortedlist_SortedList(){
	bb_broadphase_BroadPhase.call(this);
	this.bbcallb=null;
	this.bbboxes=null;
}
bb_sortedlist_SortedList.prototype=extend_class(bb_broadphase_BroadPhase);
function bb_sortedlist_new(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<36>";
	bb_broadphase_new2.call(this);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<36>";
	var bb=this;
	pop_err();
	return bb;
}
bb_sortedlist_SortedList.prototype.bbinit=function(bbbounds,bbcb,bbstaticBody){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<41>";
	dbg_object(this).bbcallb=bbcb;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<42>";
	this.bbboxes=null;
}
bb_sortedlist_SortedList.prototype.bbaddSort=function(bbb){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<46>";
	var bbcur=this.bbboxes;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<47>";
	var bbprev=null;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<48>";
	while(!(bbcur==null) && dbg_object(bbcur).bbt<dbg_object(bbb).bbt){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<50>";
		bbprev=bbcur;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<51>";
		bbcur=dbg_object(bbcur).bbnextItem;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<54>";
	dbg_object(bbb).bbprev=bbprev;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<55>";
	dbg_object(bbb).bbnextItem=bbcur;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<56>";
	if(bbprev==null){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<57>";
		this.bbboxes=bbb;
	}else{
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<59>";
		dbg_object(bbprev).bbnextItem=bbb;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<61>";
	if(!(bbcur==null)){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<62>";
		dbg_object(bbcur).bbprev=bbb;
	}
}
bb_sortedlist_SortedList.prototype.bbaddShape=function(bbs){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<67>";
	var bbb=dbg_object(bbs).bbaabb;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<68>";
	dbg_object(bbb).bbshape=bbs;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<69>";
	this.bbaddSort(bbb);
}
bb_sortedlist_SortedList.prototype.bbremoveShape=function(bbs){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<73>";
	var bbb=dbg_object(bbs).bbaabb;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<74>";
	var bbnextItem=dbg_object(bbb).bbnextItem;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<75>";
	var bbprev=dbg_object(bbb).bbprev;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<76>";
	if(bbprev==null){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<77>";
		this.bbboxes=bbnextItem;
	}else{
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<79>";
		dbg_object(bbprev).bbnextItem=bbnextItem;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<81>";
	if(!(bbnextItem==null)){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<82>";
		dbg_object(bbnextItem).bbprev=bbprev;
	}
}
bb_sortedlist_SortedList.prototype.bbcollide=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<87>";
	var bbb1=this.bbboxes;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<88>";
	while(!(bbb1==null)){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<90>";
		var bbb2=dbg_object(bbb1).bbnextItem;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<91>";
		var bbbottom=dbg_object(bbb1).bbb;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<92>";
		while(!(bbb2==null)){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<94>";
			if(dbg_object(bbb2).bbt>bbbottom){
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<95>";
				break;
			}
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<97>";
			if((bbb1.bbintersects2(bbb2))!=0){
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<98>";
				this.bbcallb.bbonCollide(dbg_object(bbb1).bbshape,dbg_object(bbb2).bbshape);
			}
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<100>";
			bbb2=dbg_object(bbb2).bbnextItem;
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<103>";
		bbb1=dbg_object(bbb1).bbnextItem;
	}
}
bb_sortedlist_SortedList.prototype.bbpick=function(bbbox){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<108>";
	var bbshapes=bb_haxetypes_new.call(new bb_haxetypes_HaxeFastList);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<109>";
	var bbb=this.bbboxes;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<111>";
	while(!(bbb==null)){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<113>";
		if(dbg_object(bbb).bbt<=dbg_object(bbbox).bbb){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<114>";
			break;
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<116>";
		bbb=dbg_object(bbb).bbnextItem;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<119>";
	while(!(bbb==null)){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<121>";
		if((bbb.bbintersects(bbbox))!=0){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<122>";
			bbshapes.bbAdd(dbg_object(bbb).bbshape);
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<124>";
		bbb=dbg_object(bbb).bbnextItem;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<127>";
	pop_err();
	return bbshapes;
}
bb_sortedlist_SortedList.prototype.bbsyncShape=function(bbs){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<131>";
	var bbb=dbg_object(bbs).bbaabb;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<132>";
	var bbprev=dbg_object(bbb).bbprev;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<133>";
	var bbnextItem=dbg_object(bbb).bbnextItem;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<134>";
	if(!(bbprev==null) && dbg_object(bbprev).bbt>dbg_object(bbb).bbt){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<136>";
		dbg_object(bbprev).bbnextItem=bbnextItem;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<137>";
		if(!(bbnextItem==null)){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<138>";
			dbg_object(bbnextItem).bbprev=bbprev;
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<140>";
		this.bbaddSort(bbb);
	}else{
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<141>";
		if(!(bbnextItem==null) && dbg_object(bbnextItem).bbt<dbg_object(bbb).bbt){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<143>";
			if(bbprev==null){
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<144>";
				this.bbboxes=bbnextItem;
			}else{
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<146>";
				dbg_object(bbprev).bbnextItem=bbnextItem;
			}
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<148>";
			dbg_object(bbnextItem).bbprev=bbprev;
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<149>";
			this.bbaddSort(bbb);
		}
	}
}
bb_sortedlist_SortedList.prototype.bbcommit=function(){
	push_err();
}
bb_sortedlist_SortedList.prototype.bbvalidate=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<158>";
	var bbcur=this.bbboxes;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<159>";
	while(!(bbcur==null)){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<161>";
		var bbnextItem=dbg_object(bbcur).bbnextItem;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<162>";
		if(!(bbnextItem==null) && dbg_object(bbnextItem).bbt<dbg_object(bbcur).bbt){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<163>";
			pop_err();
			return false;
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<165>";
		bbcur=bbnextItem;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/sortedlist.monkey<168>";
	pop_err();
	return true;
}
function bb_quantize_Quantize(){
	bb_broadphase_BroadPhase.call(this);
	this.bbnbits=0;
	this.bbsize=0;
	this.bbcb=null;
	this.bbstaticBody=null;
	this.bball=null;
	this.bbworld=null;
	this.bbout=null;
	this.bbwidth=0;
	this.bbheight=0;
	this.bbspanbits=0;
}
bb_quantize_Quantize.prototype=extend_class(bb_broadphase_BroadPhase);
function bb_quantize_new(bbnbits){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<55>";
	bb_broadphase_new2.call(this);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<57>";
	dbg_object(this).bbnbits=bbnbits;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<58>";
	dbg_object(this).bbsize=1<<bbnbits;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<55>";
	var bb=this;
	pop_err();
	return bb;
}
function bb_quantize_new2(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<44>";
	bb_broadphase_new2.call(this);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<44>";
	var bb=this;
	pop_err();
	return bb;
}
bb_quantize_Quantize.prototype.bbinit=function(bbbounds,bbcb,bbstaticBody){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<66>";
	dbg_object(this).bbcb=bbcb;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<67>";
	dbg_object(this).bbstaticBody=bbstaticBody;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<68>";
	this.bball=bb_haxetypes_new.call(new bb_haxetypes_HaxeFastList);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<69>";
	this.bbworld=bb_haxetypes_new7.call(new bb_haxetypes_HaxeArray);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<70>";
	this.bbout=bb_haxetypes_new.call(new bb_haxetypes_HaxeFastList);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<71>";
	this.bball.bbAdd(this.bbout);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<72>";
	this.bbwidth=((dbg_object(bbbounds).bbr+(this.bbsize)-0.1)|0)>>this.bbnbits;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<73>";
	this.bbheight=((dbg_object(bbbounds).bbb+(this.bbsize)-0.1)|0)>>this.bbnbits;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<74>";
	var bbtmp=this.bbwidth-1;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<75>";
	var bbspanbits=0;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<76>";
	while(bbtmp>0){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<78>";
		bbspanbits+=1;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<79>";
		bbtmp>>=1;
	}
}
bb_quantize_Quantize.prototype.bbADDR=function(bbx,bby){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<62>";
	var bb=bbx<<this.bbspanbits|bby;
	pop_err();
	return bb;
}
bb_quantize_Quantize.prototype.bbadd=function(bbl,bbbox){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<84>";
	if(!(dbg_object(dbg_object(bbbox).bbshape).bbbody==this.bbstaticBody)){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<86>";
		bbl.bbAdd(bbbox);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<87>";
		pop_err();
		return 0;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<90>";
	var bbb=dbg_object(bbl).bbhead;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<91>";
	var bbprev=null;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<92>";
	while(!(bbb==null)){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<94>";
		if(dbg_object(dbg_object(object_downcast((dbg_object(bbb).bbelt),bb_aabb_AABB)).bbshape).bbbody==this.bbstaticBody){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<95>";
			break;
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<97>";
		bbprev=bbb;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<98>";
		bbb=dbg_object(bbb).bbnextItem;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<101>";
	if(bbprev==null){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<102>";
		dbg_object(bbl).bbhead=bb_haxetypes_new5.call(new bb_haxetypes_HaxeFastCell,bbbox,bbb);
	}else{
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<104>";
		dbg_object(bbprev).bbnextItem=bb_haxetypes_new5.call(new bb_haxetypes_HaxeFastCell,bbbox,bbb);
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<82>";
	pop_err();
	return 0;
}
bb_quantize_Quantize.prototype.bbaddShape=function(bbs){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<109>";
	var bbbox=dbg_object(bbs).bbaabb;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<110>";
	var bbnbits=dbg_object(this).bbnbits;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<111>";
	var bbx1=((dbg_object(bbbox).bbl)|0)>>bbnbits;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<112>";
	var bby1=((dbg_object(bbbox).bbt)|0)>>bbnbits;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<113>";
	var bbx2=(((dbg_object(bbbox).bbr)|0)>>bbnbits)+1;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<114>";
	var bby2=(((dbg_object(bbbox).bbb)|0)>>bbnbits)+1;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<115>";
	dbg_object(bbbox).bbshape=bbs;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<116>";
	dbg_object(bbbox).bbbounds=bb_iaabb_new.call(new bb_iaabb_IAABB,bbx1,bby1,bbx2,bby2);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<117>";
	var bbisout=false;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<118>";
	for(var bbx=bbx1;bbx<bbx2;bbx=bbx+1){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<120>";
		for(var bby=bby1;bby<bby2;bby=bby+1){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<122>";
			var bbl=object_downcast((this.bbworld.bbGet(this.bbADDR(bbx,bby))),bb_haxetypes_HaxeFastList);
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<123>";
			if(bbl==null){
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<125>";
				if(bbx>=0 && bbx<this.bbwidth && bby>=0 && bby<this.bbheight){
					err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<127>";
					bbl=bb_haxetypes_new.call(new bb_haxetypes_HaxeFastList);
					err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<128>";
					this.bball.bbAdd(bbl);
					err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<129>";
					this.bbworld.bbSet(this.bbADDR(bbx,bby),bbl);
				}else{
					err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<132>";
					if(bbisout){
						err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<133>";
						continue;
					}
					err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<135>";
					bbisout=true;
					err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<136>";
					bbl=this.bbout;
				}
			}
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<140>";
			this.bbadd(bbl,bbbox);
		}
	}
}
bb_quantize_Quantize.prototype.bbremoveShape=function(bbs){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<146>";
	var bbbox=dbg_object(bbs).bbaabb;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<147>";
	var bbib=dbg_object(bbbox).bbbounds;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<148>";
	for(var bbx=dbg_object(bbib).bbl;bbx<dbg_object(bbib).bbr;bbx=bbx+1){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<150>";
		for(var bby=dbg_object(bbib).bbt;bby<dbg_object(bbib).bbb;bby=bby+1){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<152>";
			var bbl=object_downcast((this.bbworld.bbGet(this.bbADDR(bbx,bby))),bb_haxetypes_HaxeFastList);
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<153>";
			if(bbl==null){
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<154>";
				bbl=this.bbout;
			}
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<156>";
			bbl.bbRemove(bbbox);
		}
	}
}
bb_quantize_Quantize.prototype.bbsyncShape=function(bbs){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<162>";
	var bbbox=dbg_object(bbs).bbaabb;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<163>";
	var bbnbits=dbg_object(this).bbnbits;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<164>";
	var bbx1=((dbg_object(bbbox).bbl)|0)>>bbnbits;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<165>";
	var bby1=((dbg_object(bbbox).bbt)|0)>>bbnbits;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<166>";
	var bbx2=(((dbg_object(bbbox).bbr)|0)>>bbnbits)+1;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<167>";
	var bby2=(((dbg_object(bbbox).bbb)|0)>>bbnbits)+1;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<168>";
	var bbib=dbg_object(bbbox).bbbounds;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<169>";
	if(bbx1==dbg_object(bbib).bbl && bby1==dbg_object(bbib).bbt && bbx2==dbg_object(bbib).bbr && bby2==dbg_object(bbib).bbb){
		pop_err();
		return;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<172>";
	this.bbremoveShape(bbs);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<173>";
	dbg_object(bbib).bbl=bbx1;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<174>";
	dbg_object(bbib).bbt=bby1;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<175>";
	dbg_object(bbib).bbr=bbx2;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<176>";
	dbg_object(bbib).bbb=bby2;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<177>";
	var bbisout=false;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<178>";
	for(var bbx=bbx1;bbx<bbx2;bbx=bbx+1){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<180>";
		for(var bby=bby1;bby<bby2;bby=bby+1){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<182>";
			var bbl=object_downcast((this.bbworld.bbGet(this.bbADDR(bbx,bby))),bb_haxetypes_HaxeFastList);
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<183>";
			if(bbl==null){
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<185>";
				if(bbx>=0 && bbx<this.bbwidth && bby>=0 && bby<this.bbheight){
					err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<187>";
					bbl=bb_haxetypes_new.call(new bb_haxetypes_HaxeFastList);
					err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<188>";
					this.bball.bbAdd(bbl);
					err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<189>";
					this.bbworld.bbSet(this.bbADDR(bbx,bby),bbl);
				}else{
					err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<192>";
					if(bbisout){
						err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<193>";
						continue;
					}
					err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<195>";
					bbisout=true;
					err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<196>";
					bbl=this.bbout;
				}
			}
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<200>";
			this.bbadd(bbl,bbbox);
		}
	}
}
bb_quantize_Quantize.prototype.bbcommit=function(){
	push_err();
}
bb_quantize_Quantize.prototype.bbcollide=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<210>";
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<210>";
	var bb=this.bball.bbObjectEnumerator();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<210>";
	while(bb.bbHasNext()){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<210>";
		var bblist=object_downcast((bb.bbNextObject()),bb_haxetypes_HaxeFastList);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<212>";
		var bbbox1=dbg_object(bblist).bbhead;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<213>";
		while(!(bbbox1==null)){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<215>";
			var bbb=object_downcast((dbg_object(bbbox1).bbelt),bb_aabb_AABB);
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<216>";
			if(dbg_object(dbg_object(bbb).bbshape).bbbody==this.bbstaticBody){
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<217>";
				break;
			}
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<219>";
			var bbbox2=dbg_object(bblist).bbhead;
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<220>";
			while(!(bbbox2==null)){
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<222>";
				if(((bbb.bbintersects2(object_downcast((dbg_object(bbbox2).bbelt),bb_aabb_AABB)))!=0) && !(bbbox1==bbbox2)){
					err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<223>";
					this.bbcb.bbonCollide(dbg_object(bbb).bbshape,dbg_object(object_downcast((dbg_object(bbbox2).bbelt),bb_aabb_AABB)).bbshape);
				}
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<225>";
				bbbox2=dbg_object(bbbox2).bbnextItem;
			}
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<228>";
			bbbox1=dbg_object(bbbox1).bbnextItem;
		}
	}
}
bb_quantize_Quantize.prototype.bbpick=function(bbbox){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<234>";
	var bbnbits=dbg_object(this).bbnbits;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<235>";
	var bbx1=((dbg_object(bbbox).bbl)|0)>>bbnbits;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<236>";
	var bby1=((dbg_object(bbbox).bbt)|0)>>bbnbits;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<237>";
	var bbx2=(((dbg_object(bbbox).bbr)|0)>>bbnbits)+1;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<238>";
	var bby2=(((dbg_object(bbbox).bbb)|0)>>bbnbits)+1;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<239>";
	var bbisout=false;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<240>";
	var bbshapes=bb_haxetypes_new.call(new bb_haxetypes_HaxeFastList);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<241>";
	for(var bbx=bbx1;bbx<bbx2;bbx=bbx+1){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<243>";
		for(var bby=bby1;bby<bby2;bby=bby+1){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<245>";
			var bbl=object_downcast((this.bbworld.bbGet(this.bbADDR(bbx,bby))),bb_haxetypes_HaxeFastList);
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<246>";
			if(bbl==null){
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<248>";
				if(bbx>=0 && bbx<this.bbwidth && bby>=0 && bby<this.bbheight){
					err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<249>";
					continue;
				}
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<251>";
				if(bbisout){
					err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<252>";
					continue;
				}
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<254>";
				bbisout=true;
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<255>";
				bbl=this.bbout;
			}
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<258>";
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<258>";
			var bb=bbl.bbObjectEnumerator();
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<258>";
			while(bb.bbHasNext()){
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<258>";
				var bbb=object_downcast((bb.bbNextObject()),bb_aabb_AABB);
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<260>";
				if((bbb.bbintersects(bbbox))!=0){
					err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<261>";
					bbshapes.bbAdd(dbg_object(bbb).bbshape);
				}
			}
		}
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<267>";
	pop_err();
	return bbshapes;
}
bb_quantize_Quantize.prototype.bbvalidate=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/quantize.monkey<272>";
	pop_err();
	return true;
}
function bb_bruteforce_BruteForce(){
	bb_broadphase_BroadPhase.call(this);
	this.bbcallb=null;
	this.bbshapes=null;
}
bb_bruteforce_BruteForce.prototype=extend_class(bb_broadphase_BroadPhase);
function bb_bruteforce_new(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/bruteforce.monkey<38>";
	bb_broadphase_new2.call(this);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/bruteforce.monkey<38>";
	var bb=this;
	pop_err();
	return bb;
}
bb_bruteforce_BruteForce.prototype.bbinit=function(bbbounds,bbcb,bbstaticBody){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/bruteforce.monkey<43>";
	dbg_object(this).bbcallb=this.bbcallb;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/bruteforce.monkey<44>";
	this.bbshapes=bb_haxetypes_new.call(new bb_haxetypes_HaxeFastList);
}
bb_bruteforce_BruteForce.prototype.bbaddShape=function(bbs){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/bruteforce.monkey<48>";
	this.bbshapes.bbAdd(bbs);
}
bb_bruteforce_BruteForce.prototype.bbremoveShape=function(bbs){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/bruteforce.monkey<52>";
	this.bbshapes.bbRemove(bbs);
}
bb_bruteforce_BruteForce.prototype.bbcollide=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/bruteforce.monkey<56>";
	var bbs1=dbg_object(this.bbshapes).bbhead;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/bruteforce.monkey<57>";
	while(!(bbs1==null)){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/bruteforce.monkey<59>";
		var bbbox1=dbg_object(object_downcast((dbg_object(bbs1).bbelt),bb_shape_Shape)).bbaabb;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/bruteforce.monkey<60>";
		var bbs2=dbg_object(bbs1).bbnextItem;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/bruteforce.monkey<61>";
		while(!(bbs2==null)){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/bruteforce.monkey<63>";
			if((bbbox1.bbintersects2(dbg_object(object_downcast((dbg_object(bbs2).bbelt),bb_shape_Shape)).bbaabb))!=0){
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/bruteforce.monkey<64>";
				this.bbcallb.bbonCollide(object_downcast((dbg_object(bbs1).bbelt),bb_shape_Shape),object_downcast((dbg_object(bbs2).bbelt),bb_shape_Shape));
			}
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/bruteforce.monkey<66>";
			bbs2=dbg_object(bbs2).bbnextItem;
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/bruteforce.monkey<69>";
		bbs1=dbg_object(bbs1).bbnextItem;
	}
}
bb_bruteforce_BruteForce.prototype.bbpick=function(bbbox){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/bruteforce.monkey<74>";
	var bbshapes=bb_haxetypes_new.call(new bb_haxetypes_HaxeFastList);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/bruteforce.monkey<75>";
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/bruteforce.monkey<75>";
	var bb=dbg_object(this).bbshapes.bbObjectEnumerator();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/bruteforce.monkey<75>";
	while(bb.bbHasNext()){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/bruteforce.monkey<75>";
		var bbs=object_downcast((bb.bbNextObject()),bb_shape_Shape);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/bruteforce.monkey<77>";
		if(((dbg_object(bbs).bbaabb.bbintersects(bbbox))!=0)){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/bruteforce.monkey<78>";
			bbshapes.bbAdd(bbs);
		}
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/bruteforce.monkey<82>";
	pop_err();
	return bbshapes;
}
bb_bruteforce_BruteForce.prototype.bbsyncShape=function(bbs){
	push_err();
}
bb_bruteforce_BruteForce.prototype.bbcommit=function(){
	push_err();
}
bb_bruteforce_BruteForce.prototype.bbvalidate=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/bruteforce.monkey<94>";
	pop_err();
	return true;
}
function bb_body_Body(){
	Object.call(this);
	this.bbid=0;
	this.bbproperties=null;
	this.bbx=0;
	this.bby=0;
	this.bbv=null;
	this.bbf=null;
	this.bbv_bias=null;
	this.bba=0;
	this.bbw=0;
	this.bbt=0;
	this.bbw_bias=0;
	this.bbrcos=0;
	this.bbrsin=0;
	this.bbshapes=null;
	this.bbarbiters=null;
	this.bbisland=null;
	this.bbmass=0;
	this.bbinvMass=0;
	this.bbisStatic=false;
	this.bbinertia=0;
	this.bbinvInertia=0;
	this.bbmotion=0;
}
var bb_body_ID;
function bb_body_new(bbx,bby,bbprops){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<96>";
	bb_body_ID+=1;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<97>";
	this.bbid=bb_body_ID;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<98>";
	if(bbprops==null){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<100>";
		this.bbproperties=bb_constants_DEFAULT_PROPERTIES;
	}else{
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<103>";
		this.bbproperties=bbprops;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<106>";
	dbg_object(this).bbx=bbx;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<107>";
	dbg_object(this).bby=bby;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<108>";
	this.bbv=bb_vector_new.call(new bb_vector_Vector,0.000000,0.000000);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<109>";
	this.bbf=bb_vector_new.call(new bb_vector_Vector,0.000000,0.000000);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<110>";
	this.bbv_bias=bb_vector_new.call(new bb_vector_Vector,0.000000,0.000000);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<111>";
	this.bba=0.0;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<112>";
	this.bbw=0.0;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<113>";
	this.bbt=0.0;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<114>";
	this.bbw_bias=0.0;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<115>";
	this.bbrcos=1.000000;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<116>";
	this.bbrsin=0.000000;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<117>";
	this.bbshapes=bb_haxetypes_new.call(new bb_haxetypes_HaxeFastList);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<118>";
	this.bbarbiters=bb_haxetypes_new.call(new bb_haxetypes_HaxeFastList);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<94>";
	var bb=this;
	pop_err();
	return bb;
}
function bb_body_new2(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<33>";
	var bb=this;
	pop_err();
	return bb;
}
bb_body_Body.prototype.bbupdatePhysics=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<136>";
	var bbm=0.0;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<137>";
	var bbi=0.0;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<138>";
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<138>";
	var bb=this.bbshapes.bbObjectEnumerator();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<138>";
	while(bb.bbHasNext()){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<138>";
		var bbs=object_downcast((bb.bbNextObject()),bb_shape_Shape);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<140>";
		var bbsm=dbg_object(bbs).bbarea;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<141>";
		bbsm*=dbg_object(dbg_object(bbs).bbmaterial).bbdensity;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<142>";
		bbm+=bbsm;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<143>";
		bbi+=bbs.bbcalculateInertia()*bbsm;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<146>";
	if(bbm>0.000000){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<148>";
		this.bbmass=bbm;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<149>";
		this.bbinvMass=1.000000/bbm;
	}else{
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<152>";
		this.bbmass=bb_constants_POSITIVE_INFINITY;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<153>";
		this.bbinvMass=0.000000;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<154>";
		this.bbisStatic=true;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<157>";
	if(bbi>0.000000){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<159>";
		this.bbinertia=bbi;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<160>";
		this.bbinvInertia=1.000000/bbi;
	}else{
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<163>";
		this.bbinertia=bb_constants_POSITIVE_INFINITY;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<164>";
		this.bbinvInertia=0.000000;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<134>";
	pop_err();
	return 0;
}
bb_body_Body.prototype.bbGetArbiters=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<71>";
	pop_err();
	return this.bbarbiters;
}
bb_body_Body.prototype.bbRemoveArbiter=function(bba){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<77>";
	this.bbarbiters.bbRemove(bba);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<76>";
	pop_err();
	return 0;
}
bb_body_Body.prototype.bbonDestroy=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<224>";
	pop_err();
	return 0;
}
bb_body_Body.prototype.bbsetAngle=function(bba){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<176>";
	dbg_object(this).bba=bba;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<177>";
	this.bbrcos=bb_haxetypes_Cos(bba);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<178>";
	this.bbrsin=bb_haxetypes_Sin(bba);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<174>";
	pop_err();
	return 0;
}
bb_body_Body.prototype.bbset=function(bbpos,bba,bbv,bbw){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<183>";
	if(!(bbpos==null)){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<185>";
		this.bbx=dbg_object(bbpos).bbx;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<186>";
		this.bby=dbg_object(bbpos).bby;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<189>";
	if(!(bba==bb_constants_NaN)){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<190>";
		this.bbsetAngle(bba);
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<192>";
	if(!(bbv==null)){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<194>";
		dbg_object(dbg_object(this).bbv).bbx=dbg_object(bbv).bbx;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<195>";
		dbg_object(dbg_object(this).bbv).bby=dbg_object(bbv).bby;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<198>";
	if(!(bbw==bb_constants_NaN)){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<199>";
		dbg_object(this).bbw=bbw;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<181>";
	pop_err();
	return 0;
}
bb_body_Body.prototype.bbaddShape=function(bbs){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<123>";
	var bbd=dbg_object(dbg_object(bbs).bbmaterial).bbdensity;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<124>";
	this.bbshapes.bbAdd(bbs);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<125>";
	dbg_object(bbs).bbbody=this;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<121>";
	pop_err();
	return 0;
}
bb_body_Body.prototype.bbsetSpeed=function(bbvx,bbvy,bbw){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<213>";
	dbg_object(this.bbv).bbx=bbvx;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<214>";
	dbg_object(this.bbv).bby=bbvy;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<215>";
	if(!(bbw==bb_constants_NaN)){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<216>";
		dbg_object(this).bbw=bbw;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<212>";
	pop_err();
	return 0;
}
bb_body_Body.prototype.bbsetPos=function(bbx,bby,bba){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<205>";
	dbg_object(this).bbx=bbx;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<206>";
	dbg_object(this).bby=bby;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<207>";
	if(!(bba==bb_constants_NaN)){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<208>";
		this.bbsetAngle(bba);
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<203>";
	pop_err();
	return 0;
}
bb_body_Body.prototype.bbAddArbiter=function(bba){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<74>";
	this.bbarbiters.bbAdd(bba);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/body.monkey<73>";
	pop_err();
	return 0;
}
function bb_haxetypes_HaxeFastList(){
	Object.call(this);
	this.bbhead=bb_haxetypes_new4.call(new bb_haxetypes_HaxeFastCell);
}
function bb_haxetypes_new(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<101>";
	var bb=this;
	pop_err();
	return bb;
}
bb_haxetypes_HaxeFastList.prototype.bbObjectEnumerator=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<192>";
	var bb=bb_haxetypes_new2.call(new bb_haxetypes_Enumerator,this);
	pop_err();
	return bb;
}
bb_haxetypes_HaxeFastList.prototype.bbAddFirst=function(bbdata){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<146>";
	var bb=bb_haxetypes_new6.call(new bb_haxetypes_HaxeFastCell,dbg_object(this.bbhead).bbnextItem,this.bbhead,bbdata);
	pop_err();
	return bb;
}
bb_haxetypes_HaxeFastList.prototype.bbAdd=function(bbitem){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<106>";
	this.bbAddFirst(bbitem);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<105>";
	pop_err();
	return 0;
}
bb_haxetypes_HaxeFastList.prototype.bbEquals=function(bblhs,bbrhs){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<117>";
	var bb=((bblhs==bbrhs)?1:0);
	pop_err();
	return bb;
}
bb_haxetypes_HaxeFastList.prototype.bbRemoveFirst=function(bbvalue){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<159>";
	var bbnode=dbg_object(this.bbhead).bbnextItem;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<160>";
	while(bbnode!=this.bbhead){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<161>";
		bbnode=dbg_object(bbnode).bbnextItem;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<162>";
		if((this.bbEquals(dbg_object(dbg_object(bbnode).bb_pred).bbelt,bbvalue))!=0){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<163>";
			dbg_object(bbnode).bb_pred.bbRemove();
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<164>";
			pop_err();
			return true;
		}
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<167>";
	pop_err();
	return false;
}
bb_haxetypes_HaxeFastList.prototype.bbRemoveFirst2=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<180>";
	var bbdata=dbg_object(dbg_object(this.bbhead).bbnextItem).bbelt;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<181>";
	dbg_object(this.bbhead).bbnextItem.bbRemove();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<182>";
	pop_err();
	return bbdata;
}
bb_haxetypes_HaxeFastList.prototype.bbPop=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<113>";
	var bb=this.bbRemoveFirst2();
	pop_err();
	return bb;
}
bb_haxetypes_HaxeFastList.prototype.bbRemove=function(bbvalue){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<155>";
	var bb=this.bbRemoveFirst(bbvalue);
	pop_err();
	return bb;
}
bb_haxetypes_HaxeFastList.prototype.bbClear=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<121>";
	this.bbhead=bb_haxetypes_new4.call(new bb_haxetypes_HaxeFastCell);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<120>";
	pop_err();
	return 0;
}
function bb_joint_Joint(){
	Object.call(this);
	this.bbisland=null;
}
bb_joint_Joint.prototype.bbpreStep=function(bbinvDt){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/joint/joint.monkey<49>";
	pop_err();
	return 0;
}
bb_joint_Joint.prototype.bbapplyImpulse=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/joint/joint.monkey<52>";
	pop_err();
	return 0;
}
function bb_arbiter_Arbiter(){
	Object.call(this);
	this.bbisland=null;
	this.bbs1=null;
	this.bbs2=null;
	this.bbcontacts=null;
	this.bballocator=null;
	this.bbbias=0;
	this.bbmaxDist=0;
	this.bbrestitution=0;
	this.bbfriction=0;
	this.bbsleeping=false;
	this.bbstamp=0;
}
bb_arbiter_Arbiter.prototype.bbbodyImpulse=function(bbc,bbb1,bbb2,bbcjTx,bbcjTy){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<111>";
	dbg_object(dbg_object(bbb1).bbv).bbx-=bbcjTx*dbg_object(bbb1).bbinvMass;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<112>";
	dbg_object(dbg_object(bbb1).bbv).bby-=bbcjTy*dbg_object(bbb1).bbinvMass;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<113>";
	dbg_object(bbb1).bbw-=dbg_object(bbb1).bbinvInertia*(dbg_object(bbc).bbr1x*bbcjTy-dbg_object(bbc).bbr1y*bbcjTx);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<114>";
	dbg_object(dbg_object(bbb2).bbv).bbx+=bbcjTx*dbg_object(bbb2).bbinvMass;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<115>";
	dbg_object(dbg_object(bbb2).bbv).bby+=bbcjTy*dbg_object(bbb2).bbinvMass;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<116>";
	dbg_object(bbb2).bbw+=dbg_object(bbb2).bbinvInertia*(dbg_object(bbc).bbr2x*bbcjTy-dbg_object(bbc).bbr2y*bbcjTx);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<109>";
	pop_err();
	return 0;
}
bb_arbiter_Arbiter.prototype.bbpreStep=function(bbdt){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<120>";
	var bbb1=dbg_object(this.bbs1).bbbody;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<121>";
	var bbb2=dbg_object(this.bbs2).bbbody;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<122>";
	var bbmass_sum=dbg_object(bbb1).bbinvMass+dbg_object(bbb2).bbinvMass;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<123>";
	var bbc=this.bbcontacts;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<124>";
	var bbprev=null;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<125>";
	while(!(bbc==null)){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<127>";
		if(!dbg_object(bbc).bbupdated){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<129>";
			var bbold=bbc;
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<130>";
			bbc=dbg_object(bbc).bbnextItem;
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<131>";
			this.bballocator.bbfreeContact(bbold);
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<132>";
			if(bbprev==null){
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<133>";
				this.bbcontacts=bbc;
			}else{
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<135>";
				dbg_object(bbprev).bbnextItem=bbc;
			}
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<137>";
			continue;
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<140>";
		dbg_object(bbc).bbupdated=false;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<142>";
		dbg_object(bbc).bbr1x=dbg_object(bbc).bbpx-dbg_object(bbb1).bbx;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<143>";
		dbg_object(bbc).bbr1y=dbg_object(bbc).bbpy-dbg_object(bbb1).bby;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<144>";
		dbg_object(bbc).bbr2x=dbg_object(bbc).bbpx-dbg_object(bbb2).bbx;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<145>";
		dbg_object(bbc).bbr2y=dbg_object(bbc).bbpy-dbg_object(bbb2).bby;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<146>";
		dbg_object(bbc).bbr1nx=-dbg_object(bbc).bbr1y;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<147>";
		dbg_object(bbc).bbr1ny=dbg_object(bbc).bbr1x;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<148>";
		dbg_object(bbc).bbr2nx=-dbg_object(bbc).bbr2y;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<149>";
		dbg_object(bbc).bbr2ny=dbg_object(bbc).bbr2x;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<155>";
		var bbr1cn=dbg_object(bbc).bbr1x*dbg_object(bbc).bbny-dbg_object(bbc).bbr1y*dbg_object(bbc).bbnx;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<156>";
		var bbr2cn=dbg_object(bbc).bbr2x*dbg_object(bbc).bbny-dbg_object(bbc).bbr2y*dbg_object(bbc).bbnx;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<157>";
		var bbkn=bbmass_sum+dbg_object(bbb1).bbinvInertia*bbr1cn*bbr1cn+dbg_object(bbb2).bbinvInertia*bbr2cn*bbr2cn;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<158>";
		dbg_object(bbc).bbnMass=1.0/bbkn;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<160>";
		var bbtx=-dbg_object(bbc).bbny;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<161>";
		var bbty=dbg_object(bbc).bbnx;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<162>";
		var bbr1ct=dbg_object(bbc).bbr1x*bbty-dbg_object(bbc).bbr1y*bbtx;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<163>";
		var bbr2ct=dbg_object(bbc).bbr2x*bbty-dbg_object(bbc).bbr2y*bbtx;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<164>";
		var bbkt=bbmass_sum+dbg_object(bbb1).bbinvInertia*bbr1ct*bbr1ct+dbg_object(bbb2).bbinvInertia*bbr2ct*bbr2ct;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<165>";
		dbg_object(bbc).bbtMass=1.0/bbkt;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<167>";
		dbg_object(bbc).bbbias=-this.bbbias*(dbg_object(bbc).bbdist+this.bbmaxDist);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<168>";
		dbg_object(bbc).bbjBias=0.000000;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<170>";
		var bbvrx=dbg_object(bbc).bbr2nx*dbg_object(bbb2).bbw+dbg_object(dbg_object(bbb2).bbv).bbx-(dbg_object(bbc).bbr1nx*dbg_object(bbb1).bbw+dbg_object(dbg_object(bbb1).bbv).bbx);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<171>";
		var bbvry=dbg_object(bbc).bbr2ny*dbg_object(bbb2).bbw+dbg_object(dbg_object(bbb2).bbv).bby-(dbg_object(bbc).bbr1ny*dbg_object(bbb1).bbw+dbg_object(dbg_object(bbb1).bbv).bby);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<172>";
		dbg_object(bbc).bbbounce=(dbg_object(bbc).bbnx*bbvrx+dbg_object(bbc).bbny*bbvry)*this.bbrestitution*bbdt;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<174>";
		var bbcjTx=dbg_object(bbc).bbnx*dbg_object(bbc).bbjnAcc+bbtx*dbg_object(bbc).bbjtAcc;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<175>";
		var bbcjTy=dbg_object(bbc).bbny*dbg_object(bbc).bbjnAcc+bbty*dbg_object(bbc).bbjtAcc;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<176>";
		this.bbbodyImpulse(bbc,bbb1,bbb2,bbcjTx,bbcjTy);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<177>";
		bbprev=bbc;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<178>";
		bbc=dbg_object(bbc).bbnextItem;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<118>";
	pop_err();
	return 0;
}
bb_arbiter_Arbiter.prototype.bbapplyImpulse=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<183>";
	var bbb1=dbg_object(this.bbs1).bbbody;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<184>";
	var bbb2=dbg_object(this.bbs2).bbbody;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<185>";
	var bbc=this.bbcontacts;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<186>";
	while(!(bbc==null)){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<191>";
		var bbvbn=(dbg_object(bbc).bbr2nx*dbg_object(bbb2).bbw_bias+dbg_object(dbg_object(bbb2).bbv_bias).bbx-(dbg_object(bbc).bbr1nx*dbg_object(bbb1).bbw_bias+dbg_object(dbg_object(bbb1).bbv_bias).bbx))*dbg_object(bbc).bbnx+(dbg_object(bbc).bbr2ny*dbg_object(bbb2).bbw_bias+dbg_object(dbg_object(bbb2).bbv_bias).bby-(dbg_object(bbc).bbr1ny*dbg_object(bbb1).bbw_bias+dbg_object(dbg_object(bbb1).bbv_bias).bby))*dbg_object(bbc).bbny;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<193>";
		var bbjbn=(dbg_object(bbc).bbbias-bbvbn)*dbg_object(bbc).bbnMass;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<194>";
		var bbjbnOld=dbg_object(bbc).bbjBias;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<195>";
		dbg_object(bbc).bbjBias=bbjbnOld+bbjbn;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<196>";
		if(dbg_object(bbc).bbjBias<0.000000){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<197>";
			dbg_object(bbc).bbjBias=0.000000;
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<199>";
		bbjbn=dbg_object(bbc).bbjBias-bbjbnOld;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<201>";
		var bbcjTx=dbg_object(bbc).bbnx*bbjbn;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<202>";
		var bbcjTy=dbg_object(bbc).bbny*bbjbn;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<203>";
		dbg_object(dbg_object(bbb1).bbv_bias).bbx-=bbcjTx*dbg_object(bbb1).bbinvMass;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<204>";
		dbg_object(dbg_object(bbb1).bbv_bias).bby-=bbcjTy*dbg_object(bbb1).bbinvMass;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<205>";
		dbg_object(bbb1).bbw_bias-=dbg_object(bbb1).bbinvInertia*(dbg_object(bbc).bbr1x*bbcjTy-dbg_object(bbc).bbr1y*bbcjTx);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<206>";
		dbg_object(dbg_object(bbb2).bbv_bias).bbx+=bbcjTx*dbg_object(bbb2).bbinvMass;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<207>";
		dbg_object(dbg_object(bbb2).bbv_bias).bby+=bbcjTy*dbg_object(bbb2).bbinvMass;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<208>";
		dbg_object(bbb2).bbw_bias+=dbg_object(bbb2).bbinvInertia*(dbg_object(bbc).bbr2x*bbcjTy-dbg_object(bbc).bbr2y*bbcjTx);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<210>";
		var bbvrx=dbg_object(bbc).bbr2nx*dbg_object(bbb2).bbw+dbg_object(dbg_object(bbb2).bbv).bbx-(dbg_object(bbc).bbr1nx*dbg_object(bbb1).bbw+dbg_object(dbg_object(bbb1).bbv).bbx);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<211>";
		var bbvry=dbg_object(bbc).bbr2ny*dbg_object(bbb2).bbw+dbg_object(dbg_object(bbb2).bbv).bby-(dbg_object(bbc).bbr1ny*dbg_object(bbb1).bbw+dbg_object(dbg_object(bbb1).bbv).bby);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<213>";
		var bbjn=(dbg_object(bbc).bbbounce+(bbvrx*dbg_object(bbc).bbnx+bbvry*dbg_object(bbc).bbny))*dbg_object(bbc).bbnMass;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<214>";
		var bbjnOld=dbg_object(bbc).bbjnAcc;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<215>";
		dbg_object(bbc).bbjnAcc=bbjnOld-bbjn;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<216>";
		if(dbg_object(bbc).bbjnAcc<0.000000){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<217>";
			dbg_object(bbc).bbjnAcc=0.000000;
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<219>";
		bbjn=dbg_object(bbc).bbjnAcc-bbjnOld;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<221>";
		var bbvrt=dbg_object(bbc).bbnx*bbvry-dbg_object(bbc).bbny*bbvrx;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<223>";
		var bbjtMax=this.bbfriction*dbg_object(bbc).bbjnAcc;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<224>";
		var bbjt=bbvrt*dbg_object(bbc).bbtMass;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<225>";
		var bbjtOld=dbg_object(bbc).bbjtAcc;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<226>";
		dbg_object(bbc).bbjtAcc=bbjtOld-bbjt;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<227>";
		if(dbg_object(bbc).bbjtAcc<-bbjtMax){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<228>";
			dbg_object(bbc).bbjtAcc=-bbjtMax;
		}else{
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<229>";
			if(dbg_object(bbc).bbjtAcc>bbjtMax){
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<230>";
				dbg_object(bbc).bbjtAcc=bbjtMax;
			}
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<232>";
		bbjt=dbg_object(bbc).bbjtAcc-bbjtOld;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<234>";
		var bbcjTx2=dbg_object(bbc).bbnx*bbjn-dbg_object(bbc).bbny*bbjt;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<235>";
		var bbcjTy2=dbg_object(bbc).bbny*bbjn+dbg_object(bbc).bbnx*bbjt;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<236>";
		this.bbbodyImpulse(bbc,bbb1,bbb2,bbcjTx2,bbcjTy2);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<237>";
		bbc=dbg_object(bbc).bbnextItem;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<181>";
	pop_err();
	return 0;
}
function bb_arbiter_new(bballoc){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<47>";
	this.bballocator=bballoc;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<46>";
	var bb=this;
	pop_err();
	return bb;
}
function bb_arbiter_new2(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<32>";
	var bb=this;
	pop_err();
	return bb;
}
bb_arbiter_Arbiter.prototype.bbassign=function(bbs1,bbs2){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<51>";
	dbg_object(this).bbs1=bbs1;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<52>";
	dbg_object(this).bbs2=bbs2;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<53>";
	var bbm1=dbg_object(bbs1).bbmaterial;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<54>";
	var bbm2=dbg_object(bbs2).bbmaterial;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<55>";
	var bbp1=dbg_object(dbg_object(bbs1).bbbody).bbproperties;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<56>";
	var bbp2=dbg_object(dbg_object(bbs2).bbbody).bbproperties;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<57>";
	if(dbg_object(bbm1).bbrestitution>dbg_object(bbm2).bbrestitution){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<59>";
		this.bbrestitution=dbg_object(bbm1).bbrestitution;
	}else{
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<62>";
		this.bbrestitution=dbg_object(bbm2).bbrestitution;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<65>";
	this.bbfriction=Math.sqrt(dbg_object(bbm1).bbfriction*dbg_object(bbm2).bbfriction);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<66>";
	if(dbg_object(bbp1).bbbiasCoef>dbg_object(bbp2).bbbiasCoef){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<67>";
		this.bbbias=dbg_object(bbp1).bbbiasCoef;
	}else{
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<70>";
		this.bbbias=dbg_object(bbp2).bbbiasCoef;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<73>";
	if(dbg_object(bbp1).bbmaxDist>dbg_object(bbp2).bbmaxDist){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<74>";
		this.bbmaxDist=dbg_object(bbp2).bbmaxDist;
	}else{
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<77>";
		this.bbmaxDist=dbg_object(bbp1).bbmaxDist;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<50>";
	pop_err();
	return 0;
}
bb_arbiter_Arbiter.prototype.bbinjectContact=function(bbp,bbn,bbnCoef,bbdist,bbhash){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<82>";
	var bbc=this.bbcontacts;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<83>";
	while(!(bbc==null)){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<85>";
		if(bbhash==dbg_object(bbc).bbhash){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<86>";
			break;
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<88>";
		bbc=dbg_object(bbc).bbnextItem;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<91>";
	if(bbc==null){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<93>";
		bbc=this.bballocator.bballocContact();
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<94>";
		dbg_object(bbc).bbhash=bbhash;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<95>";
		dbg_object(bbc).bbjnAcc=0.000000;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<96>";
		dbg_object(bbc).bbjtAcc=0.000000;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<97>";
		dbg_object(bbc).bbnextItem=this.bbcontacts;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<98>";
		this.bbcontacts=bbc;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<102>";
	dbg_object(bbc).bbpx=dbg_object(bbp).bbx;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<103>";
	dbg_object(bbc).bbpy=dbg_object(bbp).bby;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<104>";
	dbg_object(bbc).bbnx=dbg_object(bbn).bbx*bbnCoef;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<105>";
	dbg_object(bbc).bbny=dbg_object(bbn).bby*bbnCoef;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<106>";
	dbg_object(bbc).bbdist=bbdist;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<107>";
	dbg_object(bbc).bbupdated=true;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/arbiter.monkey<81>";
	pop_err();
	return 0;
}
function bb_properties_Properties(){
	Object.call(this);
	this.bbid=0;
	this.bbcount=0;
	this.bblinearFriction=0;
	this.bbangularFriction=0;
	this.bbbiasCoef=0;
	this.bbmaxMotion=0;
	this.bbmaxDist=0;
	this.bblfdt=0;
	this.bbafdt=0;
}
var bb_properties_PID;
function bb_properties_new(bblinearFriction,bbangularFriction,bbbiasCoef,bbmaxMotion,bbmaxDist){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/properties.monkey<69>";
	bb_properties_PID+=1;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/properties.monkey<70>";
	this.bbid=bb_properties_PID;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/properties.monkey<71>";
	this.bbcount=0;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/properties.monkey<72>";
	dbg_object(this).bblinearFriction=bblinearFriction;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/properties.monkey<73>";
	dbg_object(this).bbangularFriction=bbangularFriction;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/properties.monkey<74>";
	dbg_object(this).bbbiasCoef=bbbiasCoef;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/properties.monkey<75>";
	dbg_object(this).bbmaxMotion=bbmaxMotion;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/properties.monkey<76>";
	dbg_object(this).bbmaxDist=bbmaxDist;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/properties.monkey<68>";
	var bb=this;
	pop_err();
	return bb;
}
function bb_properties_new2(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/properties.monkey<30>";
	var bb=this;
	pop_err();
	return bb;
}
function bb_boxes_IntObject(){
	Object.call(this);
	this.bbvalue=0;
}
function bb_boxes_new5(bbvalue){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/boxes.monkey<11>";
	dbg_object(this).bbvalue=bbvalue;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/boxes.monkey<10>";
	var bb=this;
	pop_err();
	return bb;
}
function bb_boxes_new6(bbvalue){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/boxes.monkey<15>";
	dbg_object(this).bbvalue=((bbvalue)|0);
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/boxes.monkey<14>";
	var bb=this;
	pop_err();
	return bb;
}
function bb_boxes_new7(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/boxes.monkey<7>";
	var bb=this;
	pop_err();
	return bb;
}
function bb_map_IntMap(){
	bb_map_Map.call(this);
}
bb_map_IntMap.prototype=extend_class(bb_map_Map);
function bb_map_new5(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<488>";
	bb_map_new.call(this);
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<488>";
	var bb=this;
	pop_err();
	return bb;
}
bb_map_IntMap.prototype.bbCompare=function(bblhs,bbrhs){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<491>";
	var bbl=dbg_object(object_downcast((bblhs),bb_boxes_IntObject)).bbvalue;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<492>";
	var bbr=dbg_object(object_downcast((bbrhs),bb_boxes_IntObject)).bbvalue;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<493>";
	if(bbl<bbr){
		err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<493>";
		pop_err();
		return -1;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<494>";
	var bb=((bbl>bbr)?1:0);
	pop_err();
	return bb;
}
function bb_constants_Constants(){
	Object.call(this);
}
var bb_constants_DEFAULT_SLEEP_EPSILON;
var bb_constants_WORLD_BOUNDS_FREQ;
var bb_constants_FMAX;
var bb_constants_DEFAULT_PROPERTIES;
var bb_constants_POSITIVE_INFINITY;
var bb_constants_EPSILON;
var bb_constants_ANGULAR_TO_LINEAR;
var bb_constants_SLEEP_BIAS;
var bb_constants_NaN;
var bb_constants_DEFAULT_MATERIAL;
var bb_constants_WAKEUP_FACTOR;
function bb_constants_XROT(bbv,bbb){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/constants.monkey<51>";
	var bb=dbg_object(bbv).bbx*dbg_object(bbb).bbrcos-dbg_object(bbv).bby*dbg_object(bbb).bbrsin;
	pop_err();
	return bb;
}
function bb_constants_YROT(bbv,bbb){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/constants.monkey<55>";
	var bb=dbg_object(bbv).bbx*dbg_object(bbb).bbrsin+dbg_object(bbv).bby*dbg_object(bbb).bbrcos;
	pop_err();
	return bb;
}
var bb_constants_PI;
function bb_allocator_Allocator(){
	Object.call(this);
	this.bbislandPool=null;
	this.bbcontactPool=null;
}
function bb_allocator_new(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/allocator.monkey<37>";
	var bb=this;
	pop_err();
	return bb;
}
bb_allocator_Allocator.prototype.bballocIsland=function(bbw){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/allocator.monkey<41>";
	var bbi=this.bbislandPool;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/allocator.monkey<42>";
	if(bbi==null){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/allocator.monkey<43>";
		var bb=bb_island_new.call(new bb_island_Island,bbw);
		pop_err();
		return bb;
	}else{
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/allocator.monkey<46>";
		this.bbislandPool=dbg_object(bbi).bballocNext;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/allocator.monkey<47>";
		pop_err();
		return bbi;
	}
}
bb_allocator_Allocator.prototype.bbfreeContact=function(bbc){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/allocator.monkey<79>";
	dbg_object(bbc).bbnextItem=this.bbcontactPool;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/allocator.monkey<80>";
	this.bbcontactPool=bbc;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/allocator.monkey<78>";
	pop_err();
	return 0;
}
bb_allocator_Allocator.prototype.bbfreeAllContacts=function(bbc){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/allocator.monkey<84>";
	while(!(bbc==null)){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/allocator.monkey<85>";
		var bbnextItem=dbg_object(bbc).bbnextItem;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/allocator.monkey<86>";
		dbg_object(bbc).bbnextItem=this.bbcontactPool;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/allocator.monkey<87>";
		this.bbcontactPool=bbc;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/allocator.monkey<88>";
		bbc=bbnextItem;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/allocator.monkey<83>";
	pop_err();
	return 0;
}
bb_allocator_Allocator.prototype.bbfreeArbiter=function(bba){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/allocator.monkey<64>";
	pop_err();
	return 0;
}
bb_allocator_Allocator.prototype.bbfreeIsland=function(bbi){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/allocator.monkey<52>";
	dbg_object(bbi).bbbodies.bbClear();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/allocator.monkey<53>";
	bbi.bbClearArbiters();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/allocator.monkey<54>";
	dbg_object(bbi).bbjoints.bbClear();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/allocator.monkey<55>";
	dbg_object(bbi).bbsleeping=false;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/allocator.monkey<56>";
	dbg_object(bbi).bballocNext=this.bbislandPool;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/allocator.monkey<57>";
	this.bbislandPool=bbi;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/allocator.monkey<51>";
	pop_err();
	return 0;
}
bb_allocator_Allocator.prototype.bballocArbiter=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/allocator.monkey<61>";
	var bb=bb_arbiter_new.call(new bb_arbiter_Arbiter,this);
	pop_err();
	return bb;
}
bb_allocator_Allocator.prototype.bballocContact=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/allocator.monkey<68>";
	var bbc=this.bbcontactPool;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/allocator.monkey<70>";
	if(bbc==null){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/allocator.monkey<71>";
		var bb=bb_contact_new.call(new bb_contact_Contact);
		pop_err();
		return bb;
	}else{
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/allocator.monkey<73>";
		this.bbcontactPool=dbg_object(bbc).bbnextItem;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/allocator.monkey<74>";
		pop_err();
		return bbc;
	}
}
function bb_collision_Collision(){
	Object.call(this);
}
function bb_collision_new(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<35>";
	var bb=this;
	pop_err();
	return bb;
}
bb_collision_Collision.prototype.bbpolyAxisProject=function(bbs,bbn,bbd){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<60>";
	var bbv=dbg_object(bbs).bbtVerts;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<61>";
	var bbmin=bb_constants_FMAX;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<62>";
	while(!(bbv==null)){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<64>";
		var bbk=bbn.bbdot(bbv);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<65>";
		if(bbk<bbmin){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<66>";
			bbmin=bbk;
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<68>";
		bbv=dbg_object(bbv).bbnextItem;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<71>";
	var bb=bbmin-bbd;
	pop_err();
	return bb;
}
bb_collision_Collision.prototype.bbpolyContainsPoint=function(bbs,bbp){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<376>";
	var bba=dbg_object(bbs).bbtAxes;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<377>";
	while(!(bba==null)){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<379>";
		if(dbg_object(bba).bbn.bbdot(bbp)>dbg_object(bba).bbd){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<380>";
			pop_err();
			return false;
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<382>";
		bba=dbg_object(bba).bbnextItem;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<385>";
	pop_err();
	return true;
}
bb_collision_Collision.prototype.bbfindVerts=function(bbarb,bbpoly1,bbpoly2,bbn,bbnCoef,bbdist){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<126>";
	var bbid=65000;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<127>";
	if(dbg_object(bbpoly1).bbid>dbg_object(bbpoly2).bbid){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<129>";
		bbid=0;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<132>";
	var bbc=0;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<133>";
	var bbv=dbg_object(bbpoly1).bbtVerts;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<134>";
	while(!(bbv==null)){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<136>";
		if(this.bbpolyContainsPoint(bbpoly2,bbv)){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<138>";
			bbarb.bbinjectContact(bbv,dbg_object(bbn).bbn,bbnCoef,bbdist,bbid);
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<139>";
			bbc+=1;
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<140>";
			if(bbc>1){
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<141>";
				pop_err();
				return 0;
			}
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<147>";
		bbid+=1;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<148>";
		bbv=dbg_object(bbv).bbnextItem;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<151>";
	if(dbg_object(bbpoly1).bbid>dbg_object(bbpoly2).bbid){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<152>";
		bbid=65000;
	}else{
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<155>";
		bbid=0;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<158>";
	bbv=dbg_object(bbpoly2).bbtVerts;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<159>";
	while(!(bbv==null)){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<161>";
		if(this.bbpolyContainsPoint(bbpoly1,bbv)){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<163>";
			bbarb.bbinjectContact(bbv,dbg_object(bbn).bbn,bbnCoef,bbdist,bbid);
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<164>";
			bbc+=1;
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<165>";
			if(bbc>1){
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<166>";
				pop_err();
				return 0;
			}
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<172>";
		bbid+=1;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<173>";
		bbv=dbg_object(bbv).bbnextItem;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<121>";
	pop_err();
	return 0;
}
bb_collision_Collision.prototype.bbpoly2poly=function(bbshape1,bbshape2,bbarb){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<77>";
	var bbmax1=-bb_constants_FMAX;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<78>";
	var bbaxis1=null;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<79>";
	var bba=dbg_object(bbshape1).bbtAxes;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<80>";
	while(!(bba==null)){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<82>";
		var bbmin=this.bbpolyAxisProject(bbshape2,dbg_object(bba).bbn,dbg_object(bba).bbd);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<83>";
		if(bbmin>0.000000){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<84>";
			pop_err();
			return false;
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<86>";
		if(bbmin>bbmax1){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<88>";
			bbmax1=bbmin;
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<89>";
			bbaxis1=bba;
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<92>";
		bba=dbg_object(bba).bbnextItem;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<95>";
	var bbmax2=-bb_constants_FMAX;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<96>";
	var bbaxis2=null;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<97>";
	bba=dbg_object(bbshape2).bbtAxes;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<98>";
	while(!(bba==null)){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<100>";
		var bbmin2=this.bbpolyAxisProject(bbshape1,dbg_object(bba).bbn,dbg_object(bba).bbd);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<101>";
		if(bbmin2>0.000000){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<102>";
			pop_err();
			return false;
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<104>";
		if(bbmin2>bbmax2){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<106>";
			bbmax2=bbmin2;
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<107>";
			bbaxis2=bba;
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<110>";
		bba=dbg_object(bba).bbnextItem;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<113>";
	if(bbmax1>bbmax2){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<114>";
		this.bbfindVerts(bbarb,bbshape1,bbshape2,bbaxis1,1.000000,bbmax1);
	}else{
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<116>";
		this.bbfindVerts(bbarb,bbshape1,bbshape2,bbaxis2,-1.000000,bbmax2);
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<118>";
	pop_err();
	return true;
}
bb_collision_Collision.prototype.bbcircle2circleQuery=function(bbarb,bbp1,bbp2,bbr1,bbr2){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<184>";
	var bbminDist=bbr1+bbr2;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<185>";
	var bbx=dbg_object(bbp2).bbx-dbg_object(bbp1).bbx;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<186>";
	var bby=dbg_object(bbp2).bby-dbg_object(bbp1).bby;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<187>";
	var bbdistSqr=bbx*bbx+bby*bby;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<188>";
	if(bbdistSqr>=bbminDist*bbminDist){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<189>";
		pop_err();
		return false;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<191>";
	var bbdist=Math.sqrt(bbdistSqr);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<192>";
	var bbinvDist=1.000000/bbdist;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<193>";
	if(bbdist<bb_constants_EPSILON){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<195>";
		bbinvDist=0.000000;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<198>";
	var bbdf=0.5+(bbr1-0.5*bbminDist)*bbinvDist;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<199>";
	bbarb.bbinjectContact(bb_vector_new.call(new bb_vector_Vector,dbg_object(bbp1).bbx+bbx*bbdf,dbg_object(bbp1).bby+bby*bbdf),bb_vector_new.call(new bb_vector_Vector,bbx*bbinvDist,bby*bbinvDist),1.0,bbdist-bbminDist,0);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<200>";
	pop_err();
	return true;
}
bb_collision_Collision.prototype.bbcircle2poly=function(bbcircle,bbpoly,bbarb){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<333>";
	var bba0=null;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<334>";
	var bbv0=null;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<335>";
	var bba=dbg_object(bbpoly).bbtAxes;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<336>";
	var bbv=dbg_object(bbpoly).bbtVerts;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<337>";
	var bbmin=-bb_constants_FMAX;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<338>";
	while(!(bba==null)){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<340>";
		var bbdist=dbg_object(bba).bbn.bbdot(dbg_object(bbcircle).bbtC)-dbg_object(bba).bbd-dbg_object(bbcircle).bbr;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<341>";
		if(bbdist>0.000000){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<342>";
			pop_err();
			return false;
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<344>";
		if(bbdist>bbmin){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<346>";
			bbmin=bbdist;
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<347>";
			bba0=bba;
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<348>";
			bbv0=bbv;
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<351>";
		bba=dbg_object(bba).bbnextItem;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<352>";
		bbv=dbg_object(bbv).bbnextItem;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<354>";
	var bbn=dbg_object(bba0).bbn;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<355>";
	var bbv1=dbg_object(bbv0).bbnextItem;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<356>";
	if(dbg_object(bbv0).bbnextItem==null){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<358>";
		bbv1=dbg_object(bbpoly).bbtVerts;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<361>";
	var bbdt=bbn.bbcross(dbg_object(bbcircle).bbtC);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<362>";
	if(bbdt<bbn.bbcross(bbv1)){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<363>";
		var bb=this.bbcircle2circleQuery(bbarb,dbg_object(bbcircle).bbtC,bbv1,dbg_object(bbcircle).bbr,0.000000);
		pop_err();
		return bb;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<365>";
	if(bbdt>=bbn.bbcross(bbv0)){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<366>";
		var bb2=this.bbcircle2circleQuery(bbarb,dbg_object(bbcircle).bbtC,bbv0,dbg_object(bbcircle).bbr,0.000000);
		pop_err();
		return bb2;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<368>";
	var bbnx=dbg_object(bbn).bbx*(dbg_object(bbcircle).bbr+bbmin*0.5);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<369>";
	var bbny=dbg_object(bbn).bby*(dbg_object(bbcircle).bbr+bbmin*0.5);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<370>";
	bbarb.bbinjectContact(bb_vector_new.call(new bb_vector_Vector,dbg_object(dbg_object(bbcircle).bbtC).bbx-bbnx,dbg_object(dbg_object(bbcircle).bbtC).bby-bbny),bbn,-1.000000,bbmin,0);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<371>";
	pop_err();
	return true;
}
bb_collision_Collision.prototype.bbcircle2circle=function(bbcircle1,bbcircle2,bbarb){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<178>";
	var bbb=this.bbcircle2circleQuery(bbarb,dbg_object(bbcircle1).bbtC,dbg_object(bbcircle2).bbtC,dbg_object(bbcircle1).bbr,dbg_object(bbcircle2).bbr);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<179>";
	pop_err();
	return bbb;
}
bb_collision_Collision.prototype.bbcircle2segment=function(bbcircle,bbseg,bbarb){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<205>";
	var bbdn=dbg_object(bbseg).bbtN.bbdot(dbg_object(bbcircle).bbtC)-dbg_object(bbseg).bbtA.bbdot(dbg_object(bbseg).bbtN);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<206>";
	var bbdist=bbdn;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<207>";
	if(bbdn<0.000000){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<209>";
		bbdist=-bbdn;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<212>";
	bbdist-=dbg_object(bbcircle).bbr+dbg_object(bbseg).bbr;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<213>";
	if(bbdist>0.000000){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<214>";
		pop_err();
		return false;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<216>";
	var bbdt=-dbg_object(bbseg).bbtN.bbcross(dbg_object(bbcircle).bbtC);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<217>";
	var bbdtMin=-dbg_object(bbseg).bbtN.bbcross(dbg_object(bbseg).bbtA);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<218>";
	var bbdtMax=-dbg_object(bbseg).bbtN.bbcross(dbg_object(bbseg).bbtB);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<219>";
	if(bbdt<bbdtMin){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<221>";
		if(bbdt<bbdtMin-dbg_object(bbcircle).bbr){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<222>";
			pop_err();
			return false;
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<224>";
		var bb=this.bbcircle2circleQuery(bbarb,dbg_object(bbcircle).bbtC,dbg_object(bbseg).bbtA,dbg_object(bbcircle).bbr,dbg_object(bbseg).bbr);
		pop_err();
		return bb;
	}else{
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<227>";
		if(bbdt<bbdtMax){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<229>";
			var bbn=dbg_object(bbseg).bbtN.bbmult(-1.000000);
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<230>";
			if(bbdn<0.000000){
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<232>";
				bbn=dbg_object(bbseg).bbtN;
			}
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<235>";
			var bbhdist=dbg_object(bbcircle).bbr+bbdist*0.5;
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<236>";
			bbarb.bbinjectContact(bb_vector_new.call(new bb_vector_Vector,dbg_object(dbg_object(bbcircle).bbtC).bbx+dbg_object(bbn).bbx*bbhdist,dbg_object(dbg_object(bbcircle).bbtC).bby+dbg_object(bbn).bby*bbhdist),bbn,1.0,bbdist,0);
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<237>";
			pop_err();
			return true;
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<240>";
		if(bbdt<bbdtMax+dbg_object(bbcircle).bbr){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<241>";
			var bb2=this.bbcircle2circleQuery(bbarb,dbg_object(bbcircle).bbtC,dbg_object(bbseg).bbtB,dbg_object(bbcircle).bbr,dbg_object(bbseg).bbr);
			pop_err();
			return bb2;
		}
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<245>";
	pop_err();
	return false;
}
bb_collision_Collision.prototype.bbsegAxisProject=function(bbseg,bbn,bbd){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<274>";
	var bbvA=bbn.bbdot(dbg_object(bbseg).bbtA)-dbg_object(bbseg).bbr;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<275>";
	var bbvB=bbn.bbdot(dbg_object(bbseg).bbtB)-dbg_object(bbseg).bbr;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<276>";
	if(bbvA<bbvB){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<278>";
		var bb=bbvA-bbd;
		pop_err();
		return bb;
	}else{
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<281>";
		var bb2=bbvB-bbd;
		pop_err();
		return bb2;
	}
}
bb_collision_Collision.prototype.bbfindPolyPointsBehindSegment=function(bbseg,bbpoly,bbpDist,bbcoef,bbarb){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<250>";
	var bbdta=dbg_object(bbseg).bbtN.bbcross(dbg_object(bbseg).bbtA);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<251>";
	var bbdtb=dbg_object(bbseg).bbtN.bbcross(dbg_object(bbseg).bbtB);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<252>";
	var bbn=bb_vector_new.call(new bb_vector_Vector,dbg_object(dbg_object(bbseg).bbtN).bbx*bbcoef,dbg_object(dbg_object(bbseg).bbtN).bby*bbcoef);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<253>";
	var bbk=dbg_object(bbseg).bbtN.bbdot(dbg_object(bbseg).bbtA)*bbcoef;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<254>";
	var bbv=dbg_object(bbpoly).bbtVerts;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<255>";
	var bbi=2;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<257>";
	while(!(bbv==null)){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<259>";
		if(bbv.bbdot(bbn)<bbk+dbg_object(bbseg).bbr){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<261>";
			var bbdt=dbg_object(bbseg).bbtN.bbcross(bbv);
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<262>";
			if(bbdta>=bbdt && bbdt>=bbdtb){
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<263>";
				bbarb.bbinjectContact(bbv,bbn,1.0,bbpDist,bbi);
			}
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<267>";
		bbi+=1;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<268>";
		bbv=dbg_object(bbv).bbnextItem;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<248>";
	pop_err();
	return 0;
}
bb_collision_Collision.prototype.bbsegment2poly=function(bbseg,bbpoly,bbarb){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<287>";
	var bbsegD=dbg_object(bbseg).bbtN.bbdot(dbg_object(bbseg).bbtA);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<288>";
	var bbminNorm=this.bbpolyAxisProject(bbpoly,dbg_object(bbseg).bbtN,bbsegD)-dbg_object(bbseg).bbr;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<289>";
	var bbminNeg=this.bbpolyAxisProject(bbpoly,dbg_object(bbseg).bbtNneg,-bbsegD)-dbg_object(bbseg).bbr;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<290>";
	if(bbminNeg>0.000000 || bbminNorm>0.000000){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<291>";
		pop_err();
		return false;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<293>";
	var bba=dbg_object(bbpoly).bbtAxes;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<294>";
	var bbpolyMin=-bb_constants_FMAX;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<295>";
	var bbaxis=null;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<296>";
	while(!(bba==null)){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<298>";
		var bbdist=this.bbsegAxisProject(bbseg,dbg_object(bba).bbn,dbg_object(bba).bbd);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<299>";
		if(bbdist>0.000000){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<300>";
			pop_err();
			return false;
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<302>";
		if(bbdist>bbpolyMin){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<304>";
			bbpolyMin=bbdist;
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<305>";
			bbaxis=bba;
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<308>";
		bba=dbg_object(bba).bbnextItem;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<310>";
	var bbn=dbg_object(bbaxis).bbn;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<311>";
	var bbva=bb_vector_new.call(new bb_vector_Vector,dbg_object(dbg_object(bbseg).bbtA).bbx-dbg_object(bbn).bbx*dbg_object(bbseg).bbr,dbg_object(dbg_object(bbseg).bbtA).bby-dbg_object(bbn).bby*dbg_object(bbseg).bbr);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<312>";
	var bbvb=bb_vector_new.call(new bb_vector_Vector,dbg_object(dbg_object(bbseg).bbtB).bbx-dbg_object(bbn).bbx*dbg_object(bbseg).bbr,dbg_object(dbg_object(bbseg).bbtB).bby-dbg_object(bbn).bby*dbg_object(bbseg).bbr);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<313>";
	if(this.bbpolyContainsPoint(bbpoly,bbva)){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<314>";
		bbarb.bbinjectContact(bbva,bbn,-1.000000,bbpolyMin,0);
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<316>";
	if(this.bbpolyContainsPoint(bbpoly,bbvb)){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<317>";
		bbarb.bbinjectContact(bbvb,bbn,-1.000000,bbpolyMin,1);
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<319>";
	if(bbminNorm>=bbpolyMin || bbminNeg>=bbpolyMin){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<321>";
		if(bbminNorm>bbminNeg){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<322>";
			this.bbfindPolyPointsBehindSegment(bbseg,bbpoly,bbminNorm,1.0,bbarb);
		}else{
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<324>";
			this.bbfindPolyPointsBehindSegment(bbseg,bbpoly,bbminNeg,-1.000000,bbarb);
		}
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<328>";
	pop_err();
	return true;
}
bb_collision_Collision.prototype.bbtestShapes=function(bbs1,bbs2,bba){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<40>";
	if(dbg_object(bbs1).bbtype==bb_shape_POLYGON && dbg_object(bbs2).bbtype==bb_shape_POLYGON){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<41>";
		var bb=this.bbpoly2poly(dbg_object(bbs1).bbpolygon,dbg_object(bbs2).bbpolygon,bba);
		pop_err();
		return bb;
	}else{
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<42>";
		if(dbg_object(bbs1).bbtype==bb_shape_CIRCLE){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<43>";
			if(dbg_object(bbs2).bbtype==bb_shape_POLYGON){
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<44>";
				var bb2=this.bbcircle2poly(dbg_object(bbs1).bbcircle,dbg_object(bbs2).bbpolygon,bba);
				pop_err();
				return bb2;
			}else{
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<45>";
				if(dbg_object(bbs2).bbtype==bb_shape_CIRCLE){
					err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<46>";
					var bb3=this.bbcircle2circle(dbg_object(bbs1).bbcircle,dbg_object(bbs2).bbcircle,bba);
					pop_err();
					return bb3;
				}else{
					err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<48>";
					var bb4=this.bbcircle2segment(dbg_object(bbs1).bbcircle,dbg_object(bbs2).bbsegment,bba);
					pop_err();
					return bb4;
				}
			}
		}else{
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<50>";
			if(dbg_object(bbs1).bbtype==bb_shape_SEGMENT && dbg_object(bbs2).bbtype==bb_shape_POLYGON){
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<51>";
				var bb5=this.bbsegment2poly(dbg_object(bbs1).bbsegment,dbg_object(bbs2).bbpolygon,bba);
				pop_err();
				return bb5;
			}else{
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/collision.monkey<53>";
				pop_err();
				return false;
			}
		}
	}
}
function bb_shape_Shape(){
	Object.call(this);
	this.bbarea=0;
	this.bbmaterial=null;
	this.bbbody=null;
	this.bbid=0;
	this.bbgroups=0;
	this.bbtype=0;
	this.bbaabb=null;
	this.bbpolygon=null;
	this.bboffset=null;
	this.bbcircle=null;
	this.bbsegment=null;
}
bb_shape_Shape.prototype.bbcalculateInertia=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/shape.monkey<70>";
	pop_err();
	return 1.0;
}
bb_shape_Shape.prototype.bbupdate=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/shape.monkey<65>";
	pop_err();
	return 0;
}
var bb_shape_POLYGON;
var bb_shape_ID;
function bb_shape_new(bbtype,bbmaterial){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/shape.monkey<51>";
	bb_shape_ID+=1;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/shape.monkey<52>";
	this.bbid=bb_shape_ID;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/shape.monkey<53>";
	this.bbgroups=1;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/shape.monkey<54>";
	dbg_object(this).bbtype=bbtype;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/shape.monkey<55>";
	if(bbmaterial==null){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/shape.monkey<56>";
		dbg_object(this).bbmaterial=bb_constants_DEFAULT_MATERIAL;
	}else{
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/shape.monkey<59>";
		dbg_object(this).bbmaterial=bbmaterial;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/shape.monkey<62>";
	dbg_object(this).bbarea=0.000000;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/shape.monkey<63>";
	this.bbaabb=bb_aabb_new.call(new bb_aabb_AABB,0,0,0,0);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/shape.monkey<49>";
	var bb=this;
	pop_err();
	return bb;
}
function bb_shape_new2(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/shape.monkey<33>";
	var bb=this;
	pop_err();
	return bb;
}
function bb_shape_makeBox(bbwidth,bbheight,bbpx,bbpy,bbmat){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/shape.monkey<78>";
	if(bbpx==bb_constants_NaN){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/shape.monkey<79>";
		bbpx=-bbwidth/2.000000;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/shape.monkey<81>";
	if(bbpy==bb_constants_NaN){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/shape.monkey<82>";
		bbpy=-bbheight/2.000000;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/shape.monkey<84>";
	var bbv=bb_haxetypes_new7.call(new bb_haxetypes_HaxeArray);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/shape.monkey<85>";
	bbv.bbPush(bb_vector_new.call(new bb_vector_Vector,0.000000,0.000000));
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/shape.monkey<86>";
	bbv.bbPush(bb_vector_new.call(new bb_vector_Vector,0.000000,bbheight));
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/shape.monkey<87>";
	bbv.bbPush(bb_vector_new.call(new bb_vector_Vector,bbwidth,bbheight));
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/shape.monkey<88>";
	bbv.bbPush(bb_vector_new.call(new bb_vector_Vector,bbwidth,0.000000));
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/shape.monkey<92>";
	var bb=bb_polygon_new.call(new bb_polygon_Polygon,bbv,bb_vector_new.call(new bb_vector_Vector,bbpx,bbpy),bbmat);
	pop_err();
	return bb;
}
var bb_shape_CIRCLE;
var bb_shape_SEGMENT;
function bb_island_Island(){
	Object.call(this);
	this.bbid=0;
	this.bbworld=null;
	this.bbsleeping=false;
	this.bbbodies=null;
	this.bbjoints=null;
	this.bbarbiters=null;
	this.bballocNext=null;
	this.bbenergy=0;
}
var bb_island_ID;
function bb_island_new(bbw){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<70>";
	bb_island_ID+=1;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<71>";
	this.bbid=bb_island_ID;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<72>";
	this.bbworld=bbw;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<73>";
	this.bbsleeping=false;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<74>";
	this.bbbodies=bb_haxetypes_new.call(new bb_haxetypes_HaxeFastList);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<75>";
	this.bbjoints=bb_haxetypes_new.call(new bb_haxetypes_HaxeFastList);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<76>";
	this.bbarbiters=bb_haxetypes_new.call(new bb_haxetypes_HaxeFastList);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<69>";
	var bb=this;
	pop_err();
	return bb;
}
function bb_island_new2(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<34>";
	var bb=this;
	pop_err();
	return bb;
}
bb_island_Island.prototype.bbAddArbiter=function(bba){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<50>";
	this.bbarbiters.bbAdd(bba);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<49>";
	pop_err();
	return 0;
}
bb_island_Island.prototype.bbReplaceArbiters=function(bbarbiters){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<56>";
	dbg_object(this).bbarbiters=bbarbiters;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<55>";
	pop_err();
	return 0;
}
bb_island_Island.prototype.bbsolve=function(bbdt,bbinvDt,bbiterations){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<81>";
	var bbg=dbg_object(this.bbworld).bbgravity;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<82>";
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<82>";
	var bb=this.bbbodies.bbObjectEnumerator();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<82>";
	while(bb.bbHasNext()){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<82>";
		var bbb=object_downcast((bb.bbNextObject()),bb_body_Body);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<84>";
		var bbv=dbg_object(bbb).bbv;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<85>";
		var bbp=dbg_object(bbb).bbproperties;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<86>";
		dbg_object(bbv).bbx=dbg_object(bbv).bbx*dbg_object(bbp).bblfdt+(dbg_object(bbg).bbx+dbg_object(dbg_object(bbb).bbf).bbx*dbg_object(bbb).bbinvMass)*bbdt;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<87>";
		dbg_object(bbv).bby=dbg_object(bbv).bby*dbg_object(bbp).bblfdt+(dbg_object(bbg).bby+dbg_object(dbg_object(bbb).bbf).bby*dbg_object(bbb).bbinvMass)*bbdt;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<88>";
		dbg_object(bbb).bbw=dbg_object(bbb).bbw*dbg_object(bbp).bbafdt+dbg_object(bbb).bbt*dbg_object(bbb).bbinvInertia*bbdt;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<91>";
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<91>";
	var bb2=this.bbarbiters.bbObjectEnumerator();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<91>";
	while(bb2.bbHasNext()){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<91>";
		var bba=object_downcast((bb2.bbNextObject()),bb_arbiter_Arbiter);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<92>";
		bba.bbpreStep(bbdt);
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<94>";
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<94>";
	var bb3=this.bbjoints.bbObjectEnumerator();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<94>";
	while(bb3.bbHasNext()){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<94>";
		var bbjoint=object_downcast((bb3.bbNextObject()),bb_joint_Joint);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<95>";
		bbjoint.bbpreStep(bbinvDt);
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<98>";
	for(var bbi=0;bbi<bbiterations;bbi=bbi+1){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<100>";
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<100>";
		var bb4=this.bbarbiters.bbObjectEnumerator();
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<100>";
		while(bb4.bbHasNext()){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<100>";
			var bba2=object_downcast((bb4.bbNextObject()),bb_arbiter_Arbiter);
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<101>";
			bba2.bbapplyImpulse();
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<103>";
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<103>";
		var bb5=this.bbjoints.bbObjectEnumerator();
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<103>";
		while(bb5.bbHasNext()){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<103>";
			var bbj=object_downcast((bb5.bbNextObject()),bb_joint_Joint);
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<104>";
			bbj.bbapplyImpulse();
		}
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<108>";
	var bbbf=dbg_object(this.bbworld).bbbroadphase;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<109>";
	var bbe=0.0;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<110>";
	var bbn=0;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<111>";
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<111>";
	var bb6=this.bbbodies.bbObjectEnumerator();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<111>";
	while(bb6.bbHasNext()){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<111>";
		var bbb2=object_downcast((bb6.bbNextObject()),bb_body_Body);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<113>";
		var bbmotion=dbg_object(dbg_object(bbb2).bbv).bbx*dbg_object(dbg_object(bbb2).bbv).bbx+dbg_object(dbg_object(bbb2).bbv).bby*dbg_object(dbg_object(bbb2).bbv).bby+dbg_object(bbb2).bbw*dbg_object(bbb2).bbw*bb_constants_ANGULAR_TO_LINEAR;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<114>";
		if(bbmotion>dbg_object(dbg_object(bbb2).bbproperties).bbmaxMotion){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<116>";
			var bbk=Math.sqrt(dbg_object(dbg_object(bbb2).bbproperties).bbmaxMotion/bbmotion);
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<117>";
			dbg_object(dbg_object(bbb2).bbv).bbx*=bbk;
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<118>";
			dbg_object(dbg_object(bbb2).bbv).bby*=bbk;
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<119>";
			dbg_object(bbb2).bbw*=bbk;
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<120>";
			bbmotion*=bbk*bbk;
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<123>";
		dbg_object(bbb2).bbx+=dbg_object(dbg_object(bbb2).bbv).bbx*bbdt+dbg_object(dbg_object(bbb2).bbv_bias).bbx;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<124>";
		dbg_object(bbb2).bby+=dbg_object(dbg_object(bbb2).bbv).bby*bbdt+dbg_object(dbg_object(bbb2).bbv_bias).bby;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<125>";
		dbg_object(bbb2).bba+=dbg_object(bbb2).bbw*bbdt+dbg_object(bbb2).bbw_bias;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<126>";
		dbg_object(bbb2).bbrcos=bb_haxetypes_Cos(dbg_object(bbb2).bba);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<127>";
		dbg_object(bbb2).bbrsin=bb_haxetypes_Sin(dbg_object(bbb2).bba);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<128>";
		dbg_object(bbb2).bbmotion=dbg_object(bbb2).bbmotion*bb_constants_SLEEP_BIAS+(1.000000-bb_constants_SLEEP_BIAS)*bbmotion;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<129>";
		dbg_object(dbg_object(bbb2).bbf).bbx=0.000000;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<130>";
		dbg_object(dbg_object(bbb2).bbf).bby=0.000000;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<131>";
		dbg_object(bbb2).bbt=0.000000;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<132>";
		dbg_object(dbg_object(bbb2).bbv_bias).bbx=0.000000;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<133>";
		dbg_object(dbg_object(bbb2).bbv_bias).bby=0.000000;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<134>";
		dbg_object(bbb2).bbw_bias=0.000000;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<135>";
		bbe+=dbg_object(bbb2).bbmotion;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<136>";
		bbn+=1;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<137>";
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<137>";
		var bb7=dbg_object(bbb2).bbshapes.bbObjectEnumerator();
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<137>";
		while(bb7.bbHasNext()){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<137>";
			var bbs=object_downcast((bb7.bbNextObject()),bb_shape_Shape);
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<139>";
			bbs.bbupdate();
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<140>";
			bbbf.bbsyncShape(bbs);
		}
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<144>";
	this.bbenergy=bbe/Math.sqrt(bbn);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<145>";
	if(this.bbenergy<dbg_object(this.bbworld).bbsleepEpsilon){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<147>";
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<147>";
		var bb8=this.bbbodies.bbObjectEnumerator();
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<147>";
		while(bb8.bbHasNext()){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<147>";
			var bbb3=object_downcast((bb8.bbNextObject()),bb_body_Body);
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<149>";
			dbg_object(dbg_object(bbb3).bbv).bbx=0.000000;
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<150>";
			dbg_object(dbg_object(bbb3).bbv).bby=0.000000;
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<151>";
			dbg_object(bbb3).bbw=0.000000;
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<154>";
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<154>";
		var bb9=this.bbarbiters.bbObjectEnumerator();
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<154>";
		while(bb9.bbHasNext()){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<154>";
			var bba3=object_downcast((bb9.bbNextObject()),bb_arbiter_Arbiter);
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<155>";
			dbg_object(bba3).bbsleeping=true;
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<157>";
		this.bbsleeping=true;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<79>";
	pop_err();
	return 0;
}
bb_island_Island.prototype.bbReleaseArbiters=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<59>";
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<59>";
	var bb=this.bbarbiters.bbObjectEnumerator();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<59>";
	while(bb.bbHasNext()){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<59>";
		var bba=object_downcast((bb.bbNextObject()),bb_arbiter_Arbiter);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<61>";
		dbg_object(bba).bbsleeping=false;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<62>";
		dbg_object(bba).bbisland=null;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<58>";
	pop_err();
	return 0;
}
bb_island_Island.prototype.bbClearArbiters=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<66>";
	this.bbarbiters.bbClear();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/island.monkey<65>";
	pop_err();
	return 0;
}
function bb_haxetypes_Enumerator(){
	Object.call(this);
	this.bb_list=null;
	this.bb_curr=null;
}
function bb_haxetypes_new2(bblist){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<244>";
	this.bb_list=bblist;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<245>";
	this.bb_curr=dbg_object(dbg_object(bblist).bbhead).bbnextItem;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<243>";
	var bb=this;
	pop_err();
	return bb;
}
function bb_haxetypes_new3(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<241>";
	var bb=this;
	pop_err();
	return bb;
}
bb_haxetypes_Enumerator.prototype.bbHasNext=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<249>";
	var bb=this.bb_curr!=dbg_object(this.bb_list).bbhead;
	pop_err();
	return bb;
}
bb_haxetypes_Enumerator.prototype.bbNextObject=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<253>";
	var bbdata=dbg_object(this.bb_curr).bbelt;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<254>";
	this.bb_curr=dbg_object(this.bb_curr).bbnextItem;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<255>";
	pop_err();
	return bbdata;
}
function bb_haxetypes_HaxeFastCell(){
	Object.call(this);
	this.bbnextItem=null;
	this.bb_pred=null;
	this.bbelt=null;
}
function bb_haxetypes_new4(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<201>";
	this.bbnextItem=this;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<202>";
	this.bb_pred=this;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<200>";
	var bb=this;
	pop_err();
	return bb;
}
function bb_haxetypes_new5(bbdata,bbsucc){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<206>";
	this.bbnextItem=bbsucc;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<207>";
	this.bb_pred=dbg_object(bbsucc).bb_pred;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<208>";
	dbg_object(this.bbnextItem).bb_pred=this;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<209>";
	dbg_object(this.bb_pred).bbnextItem=this;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<210>";
	this.bbelt=bbdata;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<205>";
	var bb=this;
	pop_err();
	return bb;
}
function bb_haxetypes_new6(bbsucc,bbpred,bbdata){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<214>";
	this.bbnextItem=bbsucc;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<215>";
	this.bb_pred=bbpred;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<216>";
	dbg_object(this.bbnextItem).bb_pred=this;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<217>";
	dbg_object(this.bb_pred).bbnextItem=this;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<218>";
	this.bbelt=bbdata;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<213>";
	var bb=this;
	pop_err();
	return bb;
}
bb_haxetypes_HaxeFastCell.prototype.bbRemove=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<226>";
	dbg_object(this.bbnextItem).bb_pred=this.bb_pred;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<227>";
	dbg_object(this.bb_pred).bbnextItem=this.bbnextItem;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<225>";
	pop_err();
	return 0;
}
function bb_material_Material(){
	Object.call(this);
	this.bbdensity=0;
	this.bbrestitution=0;
	this.bbfriction=0;
}
function bb_material_new(bbrestitution,bbfriction,bbdensity){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/material.monkey<36>";
	dbg_object(this).bbrestitution=bbrestitution;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/material.monkey<37>";
	dbg_object(this).bbfriction=bbfriction;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/material.monkey<38>";
	dbg_object(this).bbdensity=bbdensity;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/material.monkey<34>";
	var bb=this;
	pop_err();
	return bb;
}
function bb_material_new2(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/material.monkey<30>";
	var bb=this;
	pop_err();
	return bb;
}
function bb_timer_Timer(){
	Object.call(this);
	this.bbtotal=0;
	this.bbdatas=null;
	this.bbtimes=null;
	this.bbcurs=null;
}
function bb_timer_new(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/timer.monkey<42>";
	this.bbtotal=0.0;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/timer.monkey<43>";
	this.bbdatas=bb_map_new2.call(new bb_map_StringMap);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/timer.monkey<44>";
	this.bbtimes=bb_haxetypes_new7.call(new bb_haxetypes_HaxeArray);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/timer.monkey<45>";
	this.bbcurs=bb_haxetypes_new7.call(new bb_haxetypes_HaxeArray);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/timer.monkey<41>";
	var bb=this;
	pop_err();
	return bb;
}
bb_timer_Timer.prototype.bbstart=function(bbphase){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/timer.monkey<49>";
	this.bbtimes.bbPush(bb_boxes_new9.call(new bb_boxes_FloatObject,(bb_app_Millisecs())/1000.0));
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/timer.monkey<50>";
	this.bbcurs.bbPush(bb_boxes_new3.call(new bb_boxes_StringObject,bbphase));
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/timer.monkey<48>";
	pop_err();
	return 0;
}
bb_timer_Timer.prototype.bbstop=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/timer.monkey<54>";
	var bbdt=((bb_app_Millisecs())/1000.0-(object_downcast((this.bbtimes.bbPop()),bb_boxes_FloatObject).bbToFloat()))*1000.000000;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/timer.monkey<55>";
	var bbname=object_downcast((this.bbcurs.bbPop()),bb_boxes_StringObject);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/timer.monkey<56>";
	var bbdata=object_downcast((this.bbdatas.bbGet(bbname)),bb_datahash_DataHash);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/timer.monkey<58>";
	if(bbdata==null){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/timer.monkey<59>";
		bbdata=bb_datahash_new.call(new bb_datahash_DataHash,0.0,0.0);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/timer.monkey<60>";
		this.bbdatas.bbSet(bbname,bbdata);
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/timer.monkey<63>";
	dbg_object(bbdata).bbtotal+=bbdt;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/timer.monkey<64>";
	dbg_object(bbdata).bbavg=dbg_object(bbdata).bbavg*0.99+0.01*bbdt;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/timer.monkey<66>";
	if(dbg_object(this.bbcurs).bblength==0){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/timer.monkey<67>";
		this.bbtotal+=bbdt;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/timer.monkey<53>";
	pop_err();
	return 0;
}
function bb_datahash_DataHash(){
	Object.call(this);
	this.bbtotal=0;
	this.bbavg=0;
}
function bb_datahash_new(bbtotal,bbavg){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/datahash.monkey<36>";
	dbg_object(this).bbtotal=bbtotal;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/datahash.monkey<37>";
	dbg_object(this).bbavg=bbavg;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/datahash.monkey<35>";
	var bb=this;
	pop_err();
	return bb;
}
function bb_datahash_new2(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/datahash.monkey<30>";
	var bb=this;
	pop_err();
	return bb;
}
function bb_boxes_FloatObject(){
	Object.call(this);
	this.bbvalue=0;
}
function bb_boxes_new8(bbvalue){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/boxes.monkey<35>";
	dbg_object(this).bbvalue=(bbvalue);
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/boxes.monkey<34>";
	var bb=this;
	pop_err();
	return bb;
}
function bb_boxes_new9(bbvalue){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/boxes.monkey<39>";
	dbg_object(this).bbvalue=bbvalue;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/boxes.monkey<38>";
	var bb=this;
	pop_err();
	return bb;
}
function bb_boxes_new10(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/boxes.monkey<31>";
	var bb=this;
	pop_err();
	return bb;
}
bb_boxes_FloatObject.prototype.bbToFloat=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/boxes.monkey<47>";
	pop_err();
	return this.bbvalue;
}
function bb_haxetypes_HaxeArray(){
	Object.call(this);
	this.bblength=0;
	this.bbarr=[];
}
function bb_haxetypes_new7(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<62>";
	var bb=this;
	pop_err();
	return bb;
}
bb_haxetypes_HaxeArray.prototype.bbPush=function(bbitem){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<79>";
	if(this.bblength==this.bbarr.length){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<80>";
		this.bbarr=resize_object_array(this.bbarr,this.bblength+100);
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<82>";
	dbg_array(this.bbarr,this.bblength)[this.bblength]=bbitem
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<83>";
	this.bblength+=1;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<78>";
	pop_err();
	return 0;
}
bb_haxetypes_HaxeArray.prototype.bbPop=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<87>";
	if(this.bblength>=0){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<88>";
		this.bblength-=1;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<89>";
		var bb=dbg_array(this.bbarr,this.bblength)[this.bblength];
		pop_err();
		return bb;
	}else{
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<91>";
		pop_err();
		return null;
	}
}
bb_haxetypes_HaxeArray.prototype.bbGet=function(bbindex){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<71>";
	var bb=dbg_array(this.bbarr,bbindex)[bbindex];
	pop_err();
	return bb;
}
bb_haxetypes_HaxeArray.prototype.bbSet=function(bbindex,bbitem){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<75>";
	dbg_array(this.bbarr,bbindex)[bbindex]=bbitem
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<74>";
	pop_err();
	return 0;
}
function bb_app_SetUpdateRate(bbhertz){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/app.monkey<141>";
	var bb=bb_app_device.SetUpdateRate(bbhertz);
	pop_err();
	return bb;
}
function bb_app_Millisecs(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/app.monkey<145>";
	var bb=bb_app_device.MilliSecs();
	pop_err();
	return bb;
}
function bb_map_MapValues(){
	Object.call(this);
	this.bbmap=null;
}
function bb_map_new6(bbmap){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<473>";
	dbg_object(this).bbmap=bbmap;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<472>";
	var bb=this;
	pop_err();
	return bb;
}
function bb_map_new7(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<470>";
	var bb=this;
	pop_err();
	return bb;
}
bb_map_MapValues.prototype.bbObjectEnumerator=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<477>";
	var bb=bb_map_new8.call(new bb_map_ValueEnumerator,this.bbmap.bbFirstNode());
	pop_err();
	return bb;
}
function bb_map_ValueEnumerator(){
	Object.call(this);
	this.bbnode=null;
}
function bb_map_new8(bbnode){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<435>";
	dbg_object(this).bbnode=bbnode;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<434>";
	var bb=this;
	pop_err();
	return bb;
}
function bb_map_new9(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<432>";
	var bb=this;
	pop_err();
	return bb;
}
bb_map_ValueEnumerator.prototype.bbHasNext=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<439>";
	var bb=((this.bbnode!=null)?1:0);
	pop_err();
	return bb;
}
bb_map_ValueEnumerator.prototype.bbNextObject=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<443>";
	var bbt=this.bbnode;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<444>";
	this.bbnode=this.bbnode.bbNextNode();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/map.monkey<445>";
	var bb=dbg_object(bbt).bbvalue;
	pop_err();
	return bb;
}
function bb_contact_Contact(){
	Object.call(this);
	this.bbupdated=false;
	this.bbnextItem=null;
	this.bbpx=0;
	this.bbr1x=0;
	this.bbpy=0;
	this.bbr1y=0;
	this.bbr2x=0;
	this.bbr2y=0;
	this.bbr1nx=0;
	this.bbr1ny=0;
	this.bbr2nx=0;
	this.bbr2ny=0;
	this.bbny=0;
	this.bbnx=0;
	this.bbnMass=0;
	this.bbtMass=0;
	this.bbdist=0;
	this.bbbias=0;
	this.bbjBias=0;
	this.bbbounce=0;
	this.bbjnAcc=0;
	this.bbjtAcc=0;
	this.bbhash=0;
}
function bb_contact_new(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/contact.monkey<61>";
	var bb=this;
	pop_err();
	return bb;
}
function bb_haxetypes_Math(){
	Object.call(this);
}
function bb_haxetypes_Cos(bbrads){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<55>";
	var bb=Math.cos((bbrads*57.295776)*D2R);
	pop_err();
	return bb;
}
function bb_haxetypes_Sin(bbrads){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<52>";
	var bb=Math.sin((bbrads*57.295776)*D2R);
	pop_err();
	return bb;
}
function bb_haxetypes_Round(bbf){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<41>";
	if(Math.ceil(bbf)-bbf>bbf-Math.floor(bbf)){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<42>";
		var bb=((Math.floor(bbf))|0);
		pop_err();
		return bb;
	}else{
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/haxetypes/haxetypes.monkey<44>";
		var bb2=((Math.ceil(bbf))|0);
		pop_err();
		return bb2;
	}
}
function bb_input_MouseHit(bbbutton){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/input.monkey<94>";
	var bb=bb_input_device.KeyHit(1+bbbutton);
	pop_err();
	return bb;
}
function bb_input_MouseX(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/input.monkey<82>";
	var bb=bb_input_device.MouseX();
	pop_err();
	return bb;
}
function bb_input_MouseY(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/input.monkey<86>";
	var bb=bb_input_device.MouseY();
	pop_err();
	return bb;
}
function bb_polygon_Polygon(){
	bb_shape_Shape.call(this);
	this.bbvcount=0;
	this.bbverts=null;
	this.bbtVerts=null;
	this.bbaxes=null;
	this.bbtAxes=null;
}
bb_polygon_Polygon.prototype=extend_class(bb_shape_Shape);
bb_polygon_Polygon.prototype.bbinitVertexes=function(bbvl){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<49>";
	var bbl_verts=null;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<50>";
	var bbl_tVerts=null;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<51>";
	var bbl_axes=null;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<52>";
	var bbl_tAxes=null;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<53>";
	var bbcount=dbg_object(bbvl).bblength;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<54>";
	this.bbvcount=bbcount;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<55>";
	this.bbarea=0.000000;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<56>";
	var bboff=!(this.bboffset==null);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<57>";
	for(var bbi=0;bbi<bbcount;bbi=bbi+1){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<59>";
		var bbv0=object_downcast((bbvl.bbGet(bbi)),bb_vector_Vector);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<60>";
		var bbv1=object_downcast((bbvl.bbGet((bbi+1) % bbcount)),bb_vector_Vector);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<61>";
		var bbv2=object_downcast((bbvl.bbGet((bbi+2) % bbcount)),bb_vector_Vector);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<62>";
		this.bbarea+=dbg_object(bbv1).bbx*(dbg_object(bbv0).bby-dbg_object(bbv2).bby);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<63>";
		var bbv=bbv0;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<64>";
		if(bboff){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<65>";
			bbv=bbv0.bbplus(this.bboffset);
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<68>";
		var bbn=bb_vector_normal(dbg_object(bbv1).bbx-dbg_object(bbv0).bbx,dbg_object(bbv1).bby-dbg_object(bbv0).bby);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<69>";
		var bba=bb_axis_new.call(new bb_axis_Axis,bbn,bbn.bbdot(bbv));
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<70>";
		var bbvt=bbv.bbclone();
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<71>";
		var bbat=bba.bbclone();
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<73>";
		if(bbi==0){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<75>";
			this.bbverts=bbv;
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<76>";
			this.bbtVerts=bbvt;
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<77>";
			this.bbaxes=bba;
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<78>";
			this.bbtAxes=bbat;
		}else{
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<81>";
			dbg_object(bbl_verts).bbnextItem=bbv;
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<82>";
			dbg_object(bbl_tVerts).bbnextItem=bbvt;
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<83>";
			dbg_object(bbl_axes).bbnextItem=bba;
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<84>";
			dbg_object(bbl_tAxes).bbnextItem=bbat;
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<87>";
		bbl_verts=bbv;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<88>";
		bbl_tVerts=bbvt;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<89>";
		bbl_axes=bba;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<90>";
		bbl_tAxes=bbat;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<93>";
	this.bbarea*=0.5;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<48>";
	pop_err();
	return 0;
}
function bb_polygon_new(bbvl,bboffset,bbmaterial){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<42>";
	bb_shape_new.call(this,bb_shape_POLYGON,bbmaterial);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<43>";
	this.bbpolygon=this;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<44>";
	dbg_object(this).bboffset=bboffset;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<45>";
	this.bbinitVertexes(bbvl);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<41>";
	var bb=this;
	pop_err();
	return bb;
}
function bb_polygon_new2(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<33>";
	bb_shape_new2.call(this);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<33>";
	var bb=this;
	pop_err();
	return bb;
}
bb_polygon_Polygon.prototype.bbupdate=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<98>";
	var bbv=this.bbverts;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<99>";
	var bbtv=this.bbtVerts;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<100>";
	var bbbody=dbg_object(this).bbbody;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<101>";
	var bbaabb=dbg_object(this).bbaabb;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<103>";
	dbg_object(bbaabb).bbl=bb_constants_FMAX;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<104>";
	dbg_object(bbaabb).bbt=bb_constants_FMAX;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<105>";
	dbg_object(bbaabb).bbr=-bb_constants_FMAX;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<106>";
	dbg_object(bbaabb).bbb=-bb_constants_FMAX;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<108>";
	while(!(bbv==null)){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<110>";
		dbg_object(bbtv).bbx=dbg_object(bbbody).bbx+bb_constants_XROT(bbv,bbbody);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<111>";
		dbg_object(bbtv).bby=dbg_object(bbbody).bby+bb_constants_YROT(bbv,bbbody);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<112>";
		if(dbg_object(bbtv).bbx<dbg_object(bbaabb).bbl){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<113>";
			dbg_object(bbaabb).bbl=dbg_object(bbtv).bbx;
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<115>";
		if(dbg_object(bbtv).bbx>dbg_object(bbaabb).bbr){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<116>";
			dbg_object(bbaabb).bbr=dbg_object(bbtv).bbx;
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<118>";
		if(dbg_object(bbtv).bby<dbg_object(bbaabb).bbt){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<119>";
			dbg_object(bbaabb).bbt=dbg_object(bbtv).bby;
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<121>";
		if(dbg_object(bbtv).bby>dbg_object(bbaabb).bbb){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<122>";
			dbg_object(bbaabb).bbb=dbg_object(bbtv).bby;
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<124>";
		bbv=dbg_object(bbv).bbnextItem;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<125>";
		bbtv=dbg_object(bbtv).bbnextItem;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<128>";
	var bba=this.bbaxes;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<129>";
	var bbta=this.bbtAxes;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<130>";
	while(!(bba==null)){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<132>";
		var bbn=dbg_object(bba).bbn;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<133>";
		dbg_object(dbg_object(bbta).bbn).bbx=bb_constants_XROT(bbn,bbbody);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<134>";
		dbg_object(dbg_object(bbta).bbn).bby=bb_constants_YROT(bbn,bbbody);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<135>";
		dbg_object(bbta).bbd=dbg_object(bbbody).bbx*dbg_object(dbg_object(bbta).bbn).bbx+dbg_object(bbbody).bby*dbg_object(dbg_object(bbta).bbn).bby+dbg_object(bba).bbd;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<136>";
		bba=dbg_object(bba).bbnextItem;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<137>";
		bbta=dbg_object(bbta).bbnextItem;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<96>";
	pop_err();
	return 0;
}
bb_polygon_Polygon.prototype.bbcalculateInertia=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<145>";
	var bbtVertsTemp=bb_haxetypes_new7.call(new bb_haxetypes_HaxeArray);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<146>";
	var bbv=this.bbverts;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<147>";
	while(!(bbv==null)){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<149>";
		bbtVertsTemp.bbPush(bb_vector_new.call(new bb_vector_Vector,dbg_object(bbv).bbx+dbg_object(this.bboffset).bbx,dbg_object(bbv).bby+dbg_object(this.bboffset).bby));
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<150>";
		bbv=dbg_object(bbv).bbnextItem;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<153>";
	var bbsum1=0.0;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<154>";
	var bbsum2=0.0;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<155>";
	for(var bbi=0;bbi<this.bbvcount;bbi=bbi+1){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<157>";
		var bbv0=object_downcast((bbtVertsTemp.bbGet(bbi)),bb_vector_Vector);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<158>";
		var bbv1=object_downcast((bbtVertsTemp.bbGet((bbi+1) % this.bbvcount)),bb_vector_Vector);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<159>";
		var bba=bbv1.bbcross(bbv0);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<160>";
		var bbb=bbv0.bbdot(bbv0)+bbv0.bbdot(bbv1)+bbv1.bbdot(bbv1);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<161>";
		bbsum1+=bba*bbb;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<162>";
		bbsum2+=bba;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/polygon.monkey<165>";
	var bb=bbsum1/(6.000000*bbsum2);
	pop_err();
	return bb;
}
function bb_axis_Axis(){
	Object.call(this);
	this.bbn=null;
	this.bbd=0;
	this.bbnextItem=null;
}
function bb_axis_new(bbn,bbd){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/axis.monkey<41>";
	dbg_object(this).bbn=bbn;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/axis.monkey<42>";
	dbg_object(this).bbd=bbd;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/axis.monkey<40>";
	var bb=this;
	pop_err();
	return bb;
}
function bb_axis_new2(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/axis.monkey<32>";
	var bb=this;
	pop_err();
	return bb;
}
bb_axis_Axis.prototype.bbclone=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/axis.monkey<46>";
	var bb=bb_axis_new.call(new bb_axis_Axis,dbg_object(this).bbn.bbclone(),dbg_object(this).bbd);
	pop_err();
	return bb;
}
function bb_input_KeyHit(bbkey){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/input.monkey<67>";
	var bb=bb_input_device.KeyHit(bbkey);
	pop_err();
	return bb;
}
function bb_dominopyramid_DominoPyramid(){
	bb_demo_Demo.call(this);
}
bb_dominopyramid_DominoPyramid.prototype=extend_class(bb_demo_Demo);
function bb_dominopyramid_new(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/dominopyramid.monkey<32>";
	bb_demo_new.call(this);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/dominopyramid.monkey<32>";
	var bb=this;
	pop_err();
	return bb;
}
bb_dominopyramid_DominoPyramid.prototype.bbinit=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/dominopyramid.monkey<35>";
	dbg_object(this.bbworld).bbgravity.bbset(0.000000,0.3125);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/dominopyramid.monkey<36>";
	this.bbcreateFloor(null);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/dominopyramid.monkey<37>";
	var bbd_width=5;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/dominopyramid.monkey<38>";
	var bbd_heigth=20;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/dominopyramid.monkey<39>";
	var bbstackHeigth=9;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/dominopyramid.monkey<40>";
	var bbxstart=60.0;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/dominopyramid.monkey<41>";
	var bbyp=this.bbfloor;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/dominopyramid.monkey<42>";
	var bbd90=bb_constants_PI/2.000000;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/dominopyramid.monkey<43>";
	var bbdomino=bb_shape_makeBox((bbd_width*2),(bbd_heigth*2),bb_constants_NaN,bb_constants_NaN,bb_material_new.call(new bb_material_Material,0.0,0.6,0.5));
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/dominopyramid.monkey<44>";
	for(var bbi=0;bbi<bbstackHeigth;bbi=bbi+1){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/dominopyramid.monkey<46>";
		var bbdw=0;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/dominopyramid.monkey<47>";
		if(bbi==0){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/dominopyramid.monkey<49>";
			bbdw=2*bbd_width;
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/dominopyramid.monkey<52>";
		for(var bbj=0;bbj<bbstackHeigth-bbi;bbj=bbj+1){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/dominopyramid.monkey<54>";
			var bbxp=bbxstart+(3*bbd_heigth*bbj);
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/dominopyramid.monkey<55>";
			if(bbi==0){
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/dominopyramid.monkey<57>";
				this.bbcreatePoly(bbxp,bbyp-(bbd_heigth),0.000000,bbdomino,null);
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/dominopyramid.monkey<58>";
				this.bbcreatePoly(bbxp,bbyp-(2*bbd_heigth)-(bbd_width),bbd90,bbdomino,null);
			}else{
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/dominopyramid.monkey<61>";
				this.bbcreatePoly(bbxp,bbyp-(bbd_width),bbd90,bbdomino,null);
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/dominopyramid.monkey<62>";
				this.bbcreatePoly(bbxp,bbyp-(2*bbd_width)-(bbd_heigth),0.000000,bbdomino,null);
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/dominopyramid.monkey<63>";
				this.bbcreatePoly(bbxp,bbyp-(3*bbd_width)-(2*bbd_heigth),bbd90,bbdomino,null);
			}
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/dominopyramid.monkey<66>";
			if(bbj==0){
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/dominopyramid.monkey<67>";
				this.bbcreatePoly(bbxp-(bbd_heigth)+(bbd_width),bbyp-(3*bbd_heigth)-(4*bbd_width)+(bbdw),0.000000,bbdomino,null);
			}
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/dominopyramid.monkey<69>";
			if(bbj==bbstackHeigth-bbi-1){
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/dominopyramid.monkey<70>";
				this.bbcreatePoly(bbxp+(bbd_heigth)-(bbd_width),bbyp-(3*bbd_heigth)-(4*bbd_width)+(bbdw),0.000000,bbdomino,null);
			}
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/dominopyramid.monkey<74>";
		bbyp-=(2*bbd_heigth+4*bbd_width-bbdw);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/dominopyramid.monkey<75>";
		bbxstart+=1.5*(bbd_heigth);
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/dominopyramid.monkey<34>";
	pop_err();
	return 0;
}
function bb_pyramidthree_PyramidThree(){
	bb_demo_Demo.call(this);
}
bb_pyramidthree_PyramidThree.prototype=extend_class(bb_demo_Demo);
function bb_pyramidthree_new(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pyramidthree.monkey<32>";
	bb_demo_new.call(this);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pyramidthree.monkey<32>";
	var bb=this;
	pop_err();
	return bb;
}
bb_pyramidthree_PyramidThree.prototype.bbinit=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pyramidthree.monkey<35>";
	dbg_object(this.bbworld).bbgravity.bbset(0.000000,0.125);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pyramidthree.monkey<36>";
	this.bbcreateFloor(null);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pyramidthree.monkey<37>";
	var bbwidth=70;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pyramidthree.monkey<38>";
	var bbheight=11;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pyramidthree.monkey<39>";
	var bbslab=bb_shape_makeBox((bbwidth),(bbheight),bb_constants_NaN,bb_constants_NaN,bb_material_new.call(new bb_material_Material,0.0,1.000000,1.000000));
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pyramidthree.monkey<40>";
	var bbp0=bb_constants_DEFAULT_PROPERTIES;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pyramidthree.monkey<41>";
	var bbprops=bb_properties_new.call(new bb_properties_Properties,dbg_object(bbp0).bblinearFriction,dbg_object(bbp0).bbangularFriction,0.001,bb_constants_FMAX,dbg_object(bbp0).bbmaxDist);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pyramidthree.monkey<42>";
	var bbstartY=this.bbfloor-((bbheight/2)|0);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pyramidthree.monkey<43>";
	var bbstartX=dbg_object(this.bbsize).bby/2.000000;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pyramidthree.monkey<44>";
	var bbsegcount=5;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pyramidthree.monkey<46>";
	for(var bbi=0;bbi<5;bbi=bbi+1){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pyramidthree.monkey<47>";
		this.bbcreatePoly(bbstartX-(bbwidth),bbstartY,0.000000,bbslab,bbprops);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pyramidthree.monkey<48>";
		this.bbcreatePoly(bbstartX+(bbwidth),bbstartY,0.000000,bbslab,bbprops);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pyramidthree.monkey<50>";
		for(var bby=0;bby<bbsegcount;bby=bby+1){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pyramidthree.monkey<51>";
			for(var bbx=0;bbx<bby+1;bbx=bbx+1){
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pyramidthree.monkey<52>";
				this.bbcreatePoly(bbstartX-(bbx*bbwidth)+(bby*((bbwidth/2)|0)),bbstartY,0.000000,bbslab,bbprops);
			}
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pyramidthree.monkey<54>";
			bbstartY-=(bbheight);
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pyramidthree.monkey<57>";
		var bby2=bbsegcount;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pyramidthree.monkey<59>";
		while(bby2>0){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pyramidthree.monkey<60>";
			for(var bbx2=0;bbx2<bby2+1;bbx2=bbx2+1){
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pyramidthree.monkey<61>";
				this.bbcreatePoly(bbstartX-(bbx2*bbwidth)+(bby2*((bbwidth/2)|0)),bbstartY,0.000000,bbslab,bbprops);
			}
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pyramidthree.monkey<63>";
			bbstartY-=(bbheight);
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pyramidthree.monkey<64>";
			bby2-=1;
		}
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pyramidthree.monkey<34>";
	pop_err();
	return 0;
}
function bb_boxpyramiddemo_BoxPyramidDemo(){
	bb_demo_Demo.call(this);
}
bb_boxpyramiddemo_BoxPyramidDemo.prototype=extend_class(bb_demo_Demo);
function bb_boxpyramiddemo_new(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/boxpyramiddemo.monkey<32>";
	bb_demo_new.call(this);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/boxpyramiddemo.monkey<32>";
	var bb=this;
	pop_err();
	return bb;
}
bb_boxpyramiddemo_BoxPyramidDemo.prototype.bbinit=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/boxpyramiddemo.monkey<35>";
	this.bbcreateFloor(null);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/boxpyramiddemo.monkey<36>";
	dbg_object(this.bbworld).bbgravity.bbset(0.000000,0.09375);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/boxpyramiddemo.monkey<37>";
	var bbbox=bb_shape_makeBox(30.000000,30.000000,bb_constants_NaN,bb_constants_NaN,bb_material_new.call(new bb_material_Material,0.01,1.000000,0.8));
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/boxpyramiddemo.monkey<38>";
	var bbcirBody=bb_body_new.call(new bb_body_Body,300.000000,this.bbfloor-30.000000,null);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/boxpyramiddemo.monkey<39>";
	var bbcirc=bb_circle_new.call(new bb_circle_Circle,14.000000,bb_vector_new.call(new bb_vector_Vector,0.000000,0.000000),bb_material_new.call(new bb_material_Material,0.0,0.9,1.000000));
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/boxpyramiddemo.monkey<40>";
	bbcirBody.bbaddShape(bbcirc);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/boxpyramiddemo.monkey<41>";
	this.bbworld.bbaddBody(bbcirBody);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/boxpyramiddemo.monkey<43>";
	for(var bby=0;bby<14;bby=bby+1){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/boxpyramiddemo.monkey<44>";
		for(var bbx=0;bbx<bby;bbx=bbx+1){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/boxpyramiddemo.monkey<45>";
			this.bbcreatePoly((300+bbx*32-bby*16),(70+bby*32),0.000000,bbbox,null);
		}
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/boxpyramiddemo.monkey<34>";
	pop_err();
	return 0;
}
function bb_basicstack_BasicStack(){
	bb_demo_Demo.call(this);
}
bb_basicstack_BasicStack.prototype=extend_class(bb_demo_Demo);
function bb_basicstack_new(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/basicstack.monkey<32>";
	bb_demo_new.call(this);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/basicstack.monkey<32>";
	var bb=this;
	pop_err();
	return bb;
}
bb_basicstack_BasicStack.prototype.bbinit=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/basicstack.monkey<35>";
	dbg_object(this.bbworld).bbgravity.bbset(0.000000,0.1875);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/basicstack.monkey<36>";
	this.bbcreateFloor(null);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/basicstack.monkey<37>";
	var bbbox=bb_shape_makeBox(30.000000,30.000000,bb_constants_NaN,bb_constants_NaN,bb_material_new.call(new bb_material_Material,0.0,0.8,1.000000));
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/basicstack.monkey<38>";
	var bbstartY=this.bbfloor-15.000000;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/basicstack.monkey<40>";
	for(var bby=0;bby<18;bby=bby+1){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/basicstack.monkey<41>";
		var bboffset=0;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/basicstack.monkey<43>";
		if(!(bby % 2==0)){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/basicstack.monkey<44>";
			bboffset=15;
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/basicstack.monkey<47>";
		for(var bbx=0;bbx<10;bbx=bbx+1){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/basicstack.monkey<48>";
			this.bbcreatePoly((bboffset+150+bbx*30),bbstartY-(bby*30),0.000000,bbbox,null);
		}
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/basicstack.monkey<34>";
	pop_err();
	return 0;
}
function bb_jumble_Jumble(){
	bb_demo_Demo.call(this);
	this.bbaddDelay=0;
	this.bblastAdd=0;
	this.bbmaterial=null;
}
bb_jumble_Jumble.prototype=extend_class(bb_demo_Demo);
function bb_jumble_new(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/jumble.monkey<40>";
	bb_demo_new.call(this);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/jumble.monkey<41>";
	this.bbaddDelay=30;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/jumble.monkey<42>";
	this.bblastAdd=50;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/jumble.monkey<43>";
	this.bbmaterial=bb_material_new.call(new bb_material_Material,0.1,0.5,1.000000);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/jumble.monkey<39>";
	var bb=this;
	pop_err();
	return bb;
}
bb_jumble_Jumble.prototype.bbinit=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/jumble.monkey<47>";
	dbg_object(this.bbworld).bbgravity.bbset(0.000000,0.3125);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/jumble.monkey<48>";
	this.bbcreateFloor(null);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/jumble.monkey<46>";
	pop_err();
	return 0;
}
bb_jumble_Jumble.prototype.bbUpdate=function(bbdt){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/jumble.monkey<52>";
	this.bblastAdd+=1;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/jumble.monkey<53>";
	if(this.bblastAdd<this.bbaddDelay){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/jumble.monkey<54>";
		pop_err();
		return 0;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/jumble.monkey<56>";
	this.bblastAdd=0;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/jumble.monkey<57>";
	var bbbody=bb_body_new.call(new bb_body_Body,0.000000,0.000000,null);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/jumble.monkey<58>";
	bbbody.bbaddShape(bb_shape_makeBox(60.000000,10.000000,bb_constants_NaN,bb_constants_NaN,this.bbmaterial));
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/jumble.monkey<59>";
	bbbody.bbaddShape(bb_shape_makeBox(10.000000,60.000000,bb_constants_NaN,bb_constants_NaN,this.bbmaterial));
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/jumble.monkey<60>";
	bbbody.bbaddShape(bb_circle_new.call(new bb_circle_Circle,12.000000,bb_vector_new.call(new bb_vector_Vector,-30.000000,0.000000),this.bbmaterial));
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/jumble.monkey<61>";
	bbbody.bbaddShape(bb_circle_new.call(new bb_circle_Circle,12.000000,bb_vector_new.call(new bb_vector_Vector,30.000000,0.000000),this.bbmaterial));
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/jumble.monkey<62>";
	bbbody.bbaddShape(bb_circle_new.call(new bb_circle_Circle,12.000000,bb_vector_new.call(new bb_vector_Vector,0.000000,-30.000000),this.bbmaterial));
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/jumble.monkey<63>";
	bbbody.bbaddShape(bb_circle_new.call(new bb_circle_Circle,12.000000,bb_vector_new.call(new bb_vector_Vector,0.000000,30.000000),this.bbmaterial));
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/jumble.monkey<64>";
	bbbody.bbsetPos(300.000000+this.bbrand(-250.000000,250.000000),this.bbrand(-200.000000,-20.000000),this.bbrand(0.000000,2.000000*bb_constants_PI));
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/jumble.monkey<65>";
	dbg_object(bbbody).bbw=this.bbrand(-2.000000,2.000000)/40.000000;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/jumble.monkey<66>";
	this.bbworld.bbaddBody(bbbody);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/jumble.monkey<51>";
	pop_err();
	return 0;
}
function bb_pentagonrain_PentagonRain(){
	bb_demo_Demo.call(this);
	this.bbpentagons=null;
	this.bbnumPentagons=0;
	this.bbrefreshDelay=0;
	this.bblastRefresh=0;
}
bb_pentagonrain_PentagonRain.prototype=extend_class(bb_demo_Demo);
function bb_pentagonrain_new(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pentagonrain.monkey<42>";
	bb_demo_new.call(this);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pentagonrain.monkey<43>";
	this.bbpentagons=bb_haxetypes_new.call(new bb_haxetypes_HaxeFastList);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pentagonrain.monkey<44>";
	this.bbnumPentagons=500;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pentagonrain.monkey<45>";
	this.bbrefreshDelay=1.000000;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pentagonrain.monkey<46>";
	this.bblastRefresh=0.000000;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pentagonrain.monkey<41>";
	var bb=this;
	pop_err();
	return bb;
}
bb_pentagonrain_PentagonRain.prototype.bbinit=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pentagonrain.monkey<50>";
	dbg_object(this.bbworld).bbgravity.bbset(0.000000,0.0625);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pentagonrain.monkey<51>";
	this.bbUpdates=1;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pentagonrain.monkey<52>";
	var bbtriangle=bb_haxetypes_new7.call(new bb_haxetypes_HaxeArray);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pentagonrain.monkey<53>";
	bbtriangle.bbPush(bb_vector_new.call(new bb_vector_Vector,-15.000000,15.000000));
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pentagonrain.monkey<54>";
	bbtriangle.bbPush(bb_vector_new.call(new bb_vector_Vector,15.000000,15.000000));
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pentagonrain.monkey<55>";
	bbtriangle.bbPush(bb_vector_new.call(new bb_vector_Vector,0.000000,-10.000000));
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pentagonrain.monkey<57>";
	var bbmat=bb_material_new.call(new bb_material_Material,1.000000,0.1,1.000000);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pentagonrain.monkey<59>";
	for(var bbi=0;bbi<8;bbi=bbi+1){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pentagonrain.monkey<60>";
		for(var bbj=0;bbj<7;bbj=bbj+1){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pentagonrain.monkey<61>";
			var bbstagger=bbj % 2*40;
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pentagonrain.monkey<62>";
			var bboffset=bb_vector_new.call(new bb_vector_Vector,(bbi*80+bbstagger),(80+bbj*70));
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pentagonrain.monkey<63>";
			this.bbworld.bbaddStaticShape(bb_polygon_new.call(new bb_polygon_Polygon,bbtriangle,bboffset,bbmat));
		}
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pentagonrain.monkey<67>";
	bbmat=bb_material_new.call(new bb_material_Material,0.2,0.000000,1.000000);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pentagonrain.monkey<69>";
	for(var bbi2=0;bbi2<this.bbnumPentagons;bbi2=bbi2+1){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pentagonrain.monkey<70>";
		var bbp=this.bbaddBody(300.000000+this.bbrand(-300.000000,300.000000),this.bbrand(-50.000000,-150.000000),this.bbcreateConvexPoly(5,10.000000,0.000000,bbmat),null);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pentagonrain.monkey<71>";
		this.bbpentagons.bbAdd(bbp);
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pentagonrain.monkey<49>";
	pop_err();
	return 0;
}
bb_pentagonrain_PentagonRain.prototype.bbUpdate=function(bbdt){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pentagonrain.monkey<76>";
	this.bblastRefresh+=bbdt;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pentagonrain.monkey<77>";
	if(this.bblastRefresh<this.bbrefreshDelay){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pentagonrain.monkey<78>";
		pop_err();
		return 0;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pentagonrain.monkey<80>";
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pentagonrain.monkey<80>";
	var bb=this.bbpentagons.bbObjectEnumerator();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pentagonrain.monkey<80>";
	while(bb.bbHasNext()){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pentagonrain.monkey<80>";
		var bbp=object_downcast((bb.bbNextObject()),bb_body_Body);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pentagonrain.monkey<82>";
		if(dbg_object(bbp).bby>dbg_object(this.bbsize).bby+20.000000 || dbg_object(bbp).bbx<-20.000000 || dbg_object(bbp).bby>dbg_object(this.bbsize).bbx+20.000000){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pentagonrain.monkey<84>";
			bbp.bbsetPos(300.000000+this.bbrand(-280.000000,280.000000),this.bbrand(-50.000000,-100.000000),bb_constants_NaN);
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pentagonrain.monkey<85>";
			bbp.bbsetSpeed(this.bbrand(-10.000000,10.000000)/40.000000,this.bbrand(10.000000,100.000000)/40.000000,bb_constants_NaN);
		}
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/demo/pentagonrain.monkey<75>";
	pop_err();
	return 0;
}
function bb_graphics_DebugRenderDevice(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<245>";
	if(!((bb_graphics_renderDevice)!=null)){
		err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<245>";
		error("Rendering operations can only be performed inside OnRender");
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<244>";
	pop_err();
	return 0;
}
function bb_graphics_Cls(bbr,bbg,bbb){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<389>";
	bb_graphics_DebugRenderDevice();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<391>";
	bb_graphics_renderDevice.Cls(bbr,bbg,bbb);
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<387>";
	pop_err();
	return 0;
}
function bb_mojodraw_MojoDraw(){
	Object.call(this);
	this.bbxmin=0;
	this.bbymin=0;
	this.bbxmax=0;
	this.bbymax=0;
	this.bbdrawSegmentsBorders=false;
	this.bbdrawSegmentsNormals=false;
	this.bbshape=null;
	this.bbstaticShape=null;
	this.bbsleepingShape=null;
	this.bbboundingBox=null;
	this.bbcontact=null;
	this.bbsleepingContact=null;
	this.bbcontactSize=null;
	this.bbdrawCircleRotation=false;
}
function bb_mojodraw_new(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<65>";
	dbg_object(this).bbxmin=-1000000000;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<66>";
	dbg_object(this).bbymin=-1000000000;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<67>";
	dbg_object(this).bbxmax=1000000000;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<68>";
	dbg_object(this).bbymax=1000000000;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<69>";
	this.bbdrawSegmentsBorders=true;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<70>";
	this.bbdrawSegmentsNormals=false;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<71>";
	this.bbshape=bb_mojodraw_new2.call(new bb_mojodraw_Color,223.000000,237.000000,237.000000,1.0);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<72>";
	this.bbstaticShape=bb_mojodraw_new2.call(new bb_mojodraw_Color,230.000000,220.000000,100.000000,1.0);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<73>";
	this.bbsleepingShape=bb_mojodraw_new2.call(new bb_mojodraw_Color,127.000000,237.000000,237.000000,1.0);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<74>";
	this.bbboundingBox=null;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<75>";
	this.bbcontact=null;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<76>";
	this.bbsleepingContact=null;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<77>";
	this.bbcontactSize=null;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<64>";
	var bb=this;
	pop_err();
	return bb;
}
bb_mojodraw_MojoDraw.prototype.bbselectColor=function(bbs){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<93>";
	if(dbg_object(dbg_object(bbs).bbbody).bbisStatic){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<94>";
		pop_err();
		return this.bbstaticShape;
	}else{
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<96>";
		if(!(dbg_object(dbg_object(bbs).bbbody).bbisland==null) && dbg_object(dbg_object(dbg_object(bbs).bbbody).bbisland).bbsleeping){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<97>";
			pop_err();
			return this.bbsleepingShape;
		}else{
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<99>";
			pop_err();
			return this.bbshape;
		}
	}
}
bb_mojodraw_MojoDraw.prototype.bbbeginShape=function(bbc){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<81>";
	if(bbc==null){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<82>";
		pop_err();
		return 0;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<84>";
	bb_graphics_SetColor(dbg_object(bbc).bbr,dbg_object(bbc).bbg,dbg_object(bbc).bbb);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<85>";
	bb_graphics_SetAlpha(dbg_object(bbc).bba);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<86>";
	pop_err();
	return 1;
}
bb_mojodraw_MojoDraw.prototype.bbdrawCircle=function(bbc){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<234>";
	bb_graphics_DrawCircle(dbg_object(dbg_object(bbc).bbtC).bbx,dbg_object(dbg_object(bbc).bbtC).bby,dbg_object(bbc).bbr);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<235>";
	if(this.bbdrawCircleRotation){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<237>";
		bb_graphics_DrawLine(dbg_object(dbg_object(bbc).bbtC).bbx,dbg_object(dbg_object(bbc).bbtC).bby,dbg_object(dbg_object(bbc).bbtC).bbx+dbg_object(dbg_object(bbc).bbbody).bbrcos*dbg_object(bbc).bbr,dbg_object(dbg_object(bbc).bbtC).bby+dbg_object(dbg_object(bbc).bbbody).bbrsin*dbg_object(bbc).bbr);
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<232>";
	pop_err();
	return 0;
}
bb_mojodraw_MojoDraw.prototype.bbdrawPoly=function(bbp){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<243>";
	var bbv=dbg_object(bbp).bbtVerts;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<244>";
	while(!(dbg_object(bbv).bbnextItem==null)){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<246>";
		bb_graphics_DrawLine(dbg_object(bbv).bbx,dbg_object(bbv).bby,dbg_object(dbg_object(bbv).bbnextItem).bbx,dbg_object(dbg_object(bbv).bbnextItem).bby);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<247>";
		bbv=dbg_object(bbv).bbnextItem;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<250>";
	bb_graphics_DrawLine(dbg_object(bbv).bbx,dbg_object(bbv).bby,dbg_object(dbg_object(bbp).bbtVerts).bbx,dbg_object(dbg_object(bbp).bbtVerts).bby);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<241>";
	pop_err();
	return 0;
}
bb_mojodraw_MojoDraw.prototype.bbdrawSegment=function(bbs){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<210>";
	var bbdelta=dbg_object(bbs).bbtB.bbminus(dbg_object(bbs).bbtA);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<211>";
	var bbangle=(Math.atan2(dbg_object(bbdelta).bbx,dbg_object(bbdelta).bby)*R2D);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<212>";
	var bbdx=bb_haxetypes_Cos(bbangle)*dbg_object(bbs).bbr;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<213>";
	var bbdy=bb_haxetypes_Sin(bbangle)*dbg_object(bbs).bbr;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<214>";
	if(this.bbdrawSegmentsBorders){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<216>";
		bb_graphics_DrawCircle(dbg_object(dbg_object(bbs).bbtA).bbx,dbg_object(dbg_object(bbs).bbtA).bby,dbg_object(bbs).bbr);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<217>";
		bb_graphics_DrawCircle(dbg_object(dbg_object(bbs).bbtB).bbx,dbg_object(dbg_object(bbs).bbtB).bby,dbg_object(bbs).bbr);
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<220>";
	if(this.bbdrawSegmentsNormals){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<222>";
		var bbhx=(dbg_object(dbg_object(bbs).bbtA).bbx+dbg_object(dbg_object(bbs).bbtB).bbx)/2.000000;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<223>";
		var bbhy=(dbg_object(dbg_object(bbs).bbtA).bby+dbg_object(dbg_object(bbs).bbtB).bby)/2.000000;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<224>";
		bb_graphics_DrawLine(bbhx,bbhy,bbhx+dbg_object(dbg_object(bbs).bbtN).bbx*(dbg_object(bbs).bbr*2.000000),bbhy+dbg_object(dbg_object(bbs).bbtN).bby*(dbg_object(bbs).bbr*2.000000));
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<227>";
	bb_graphics_DrawLine(dbg_object(dbg_object(bbs).bbtA).bbx+bbdx,dbg_object(dbg_object(bbs).bbtA).bby-bbdy,dbg_object(dbg_object(bbs).bbtB).bbx+bbdx,dbg_object(dbg_object(bbs).bbtB).bby-bbdy);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<228>";
	bb_graphics_DrawLine(dbg_object(dbg_object(bbs).bbtB).bbx+bbdx,dbg_object(dbg_object(bbs).bbtB).bby-bbdy,dbg_object(dbg_object(bbs).bbtB).bbx-bbdx,dbg_object(dbg_object(bbs).bbtB).bby+bbdy);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<229>";
	bb_graphics_DrawLine(dbg_object(dbg_object(bbs).bbtB).bbx-bbdx,dbg_object(dbg_object(bbs).bbtB).bby+bbdy,dbg_object(dbg_object(bbs).bbtA).bbx-bbdx,dbg_object(dbg_object(bbs).bbtA).bby+bbdy);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<209>";
	pop_err();
	return 0;
}
bb_mojodraw_MojoDraw.prototype.bbendShape=function(bbc){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<89>";
	pop_err();
	return 0;
}
bb_mojodraw_MojoDraw.prototype.bbdrawShape=function(bbs){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<189>";
	var bbc=this.bbselectColor(bbs);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<190>";
	if((this.bbbeginShape(bbc))!=0){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<192>";
		var bb=dbg_object(bbs).bbtype;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<194>";
		if(bb==bb_shape_CIRCLE){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<194>";
			this.bbdrawCircle(dbg_object(bbs).bbcircle);
		}else{
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<195>";
			if(bb==bb_shape_POLYGON){
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<195>";
				this.bbdrawPoly(dbg_object(bbs).bbpolygon);
			}else{
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<196>";
				if(bb==bb_shape_SEGMENT){
					err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<196>";
					this.bbdrawSegment(dbg_object(bbs).bbsegment);
				}
			}
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<199>";
		this.bbendShape(bbc);
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<202>";
	if((this.bbbeginShape(this.bbboundingBox))!=0){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<204>";
		bb_graphics_DrawRect(dbg_object(dbg_object(bbs).bbaabb).bbl,dbg_object(dbg_object(bbs).bbaabb).bbt,dbg_object(dbg_object(bbs).bbaabb).bbr-dbg_object(dbg_object(bbs).bbaabb).bbl,dbg_object(dbg_object(bbs).bbaabb).bbb-dbg_object(dbg_object(bbs).bbaabb).bbt);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<205>";
		this.bbendShape(this.bbboundingBox);
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<188>";
	pop_err();
	return 0;
}
bb_mojodraw_MojoDraw.prototype.bbdrawBody=function(bbb){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<178>";
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<178>";
	var bb=dbg_object(bbb).bbshapes.bbObjectEnumerator();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<178>";
	while(bb.bbHasNext()){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<178>";
		var bbs=object_downcast((bb.bbNextObject()),bb_shape_Shape);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<180>";
		var bbb2=dbg_object(bbs).bbaabb;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<181>";
		if(dbg_object(bbb2).bbr<(this.bbxmin) || dbg_object(bbb2).bbb<(this.bbymin) || dbg_object(bbb2).bbl>(this.bbxmax) || dbg_object(bbb2).bbt>(this.bbymax)){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<182>";
			continue;
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<184>";
		this.bbdrawShape(bbs);
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<177>";
	pop_err();
	return 0;
}
bb_mojodraw_MojoDraw.prototype.bbdrawJoint=function(bbj){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<253>";
	pop_err();
	return 0;
}
bb_mojodraw_MojoDraw.prototype.bbselectArbiterColor=function(bba){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<105>";
	if(dbg_object(bba).bbsleeping){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<106>";
		pop_err();
		return this.bbsleepingContact;
	}else{
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<108>";
		pop_err();
		return this.bbcontact;
	}
}
bb_mojodraw_MojoDraw.prototype.bbdrawWorld=function(bbw){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<113>";
	bb_graphics_PushMatrix();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<114>";
	bb_graphics_Scale(0.7,0.7);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<115>";
	this.bbdrawBody(dbg_object(bbw).bbstaticBody);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<116>";
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<116>";
	var bb=dbg_object(bbw).bbbodies.bbObjectEnumerator();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<116>";
	while(bb.bbHasNext()){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<116>";
		var bbb=object_downcast((bb.bbNextObject()),bb_body_Body);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<117>";
		this.bbdrawBody(bbb);
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<119>";
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<119>";
	var bb2=dbg_object(bbw).bbjoints.bbObjectEnumerator();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<119>";
	while(bb2.bbHasNext()){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<119>";
		var bbj=object_downcast((bb2.bbNextObject()),bb_joint_Joint);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<120>";
		this.bbdrawJoint(bbj);
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<122>";
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<122>";
	var bb3=dbg_object(bbw).bbarbiters.bbObjectEnumerator();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<122>";
	while(bb3.bbHasNext()){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<122>";
		var bba=object_downcast((bb3.bbNextObject()),bb_arbiter_Arbiter);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<124>";
		var bbcol=this.bbselectArbiterColor(bba);
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<125>";
		if((this.bbbeginShape(bbcol))!=0){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<127>";
			var bbc=dbg_object(bba).bbcontacts;
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<128>";
			if(bbc==null){
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<130>";
				var bbb1=dbg_object(dbg_object(bba).bbs1).bbbody;
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<131>";
				var bbb2=dbg_object(dbg_object(bba).bbs2).bbbody;
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<132>";
				var bbp1=bb_vector_new.call(new bb_vector_Vector,dbg_object(bbb1).bbx+bb_constants_XROT(dbg_object(dbg_object(bba).bbs1).bboffset,bbb1),dbg_object(bbb1).bby+bb_constants_YROT(dbg_object(dbg_object(bba).bbs1).bboffset,bbb1));
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<133>";
				if(dbg_object(dbg_object(bba).bbs1).bboffset==null){
					err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<135>";
					bbp1=bb_vector_new.call(new bb_vector_Vector,dbg_object(bbb1).bbx,dbg_object(bbb1).bby);
				}
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<138>";
				var bbp2=bb_vector_new.call(new bb_vector_Vector,dbg_object(bbb2).bbx+bb_constants_XROT(dbg_object(dbg_object(bba).bbs2).bboffset,bbb2),dbg_object(bbb2).bby+bb_constants_YROT(dbg_object(dbg_object(bba).bbs2).bboffset,bbb2));
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<139>";
				if(dbg_object(dbg_object(bba).bbs2).bboffset==null){
					err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<141>";
					bbp2=bb_vector_new.call(new bb_vector_Vector,dbg_object(bbb1).bbx,dbg_object(bbb1).bby);
				}
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<144>";
				bb_graphics_DrawLine(dbg_object(bbp1).bbx,dbg_object(bbp1).bby,dbg_object(bbp2).bbx,dbg_object(bbp2).bby);
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<145>";
				bb_graphics_DrawCircle(dbg_object(bbp1).bbx,dbg_object(bbp1).bby,5.000000);
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<146>";
				bb_graphics_DrawCircle(dbg_object(bbp2).bbx,dbg_object(bbp2).bby,5.000000);
			}
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<149>";
			while(!(bbc==null)){
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<151>";
				if(dbg_object(bbc).bbupdated){
					err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<152>";
					bb_graphics_DrawRect(dbg_object(bbc).bbpx-1.000000,dbg_object(bbc).bbpy-1.000000,2.000000,2.000000);
				}
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<154>";
				bbc=dbg_object(bbc).bbnextItem;
			}
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<157>";
			this.bbendShape(bbcol);
		}
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<160>";
		if((this.bbbeginShape(this.bbcontactSize))!=0){
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<162>";
			var bbc2=dbg_object(bba).bbcontacts;
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<163>";
			while(!(bbc2==null)){
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<165>";
				if(dbg_object(bbc2).bbupdated){
					err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<166>";
					bb_graphics_DrawCircle(dbg_object(bbc2).bbpx,dbg_object(bbc2).bbpy,dbg_object(bbc2).bbdist);
				}
				err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<168>";
				bbc2=dbg_object(bbc2).bbnextItem;
			}
			err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<171>";
			this.bbendShape(this.bbcontactSize);
		}
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<174>";
	bb_graphics_PopMatrix();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<112>";
	pop_err();
	return 0;
}
function bb_mojodraw_Color(){
	Object.call(this);
	this.bbr=0;
	this.bbg=0;
	this.bbb=0;
	this.bba=0;
}
function bb_mojodraw_new2(bbr,bbg,bbb,bba){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<40>";
	dbg_object(this).bbr=bbr;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<41>";
	dbg_object(this).bbg=bbg;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<42>";
	dbg_object(this).bbb=bbb;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<43>";
	dbg_object(this).bba=bba;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<39>";
	var bb=this;
	pop_err();
	return bb;
}
function bb_mojodraw_new3(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/mojodraw.monkey<33>";
	var bb=this;
	pop_err();
	return bb;
}
function bb_graphics_PushMatrix(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<349>";
	var bbsp=dbg_object(bb_graphics_context).bbmatrixSp;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<350>";
	var bb=bbsp+0;
	dbg_array(dbg_object(bb_graphics_context).bbmatrixStack,bb)[bb]=dbg_object(bb_graphics_context).bbix
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<351>";
	var bb2=bbsp+1;
	dbg_array(dbg_object(bb_graphics_context).bbmatrixStack,bb2)[bb2]=dbg_object(bb_graphics_context).bbiy
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<352>";
	var bb3=bbsp+2;
	dbg_array(dbg_object(bb_graphics_context).bbmatrixStack,bb3)[bb3]=dbg_object(bb_graphics_context).bbjx
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<353>";
	var bb4=bbsp+3;
	dbg_array(dbg_object(bb_graphics_context).bbmatrixStack,bb4)[bb4]=dbg_object(bb_graphics_context).bbjy
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<354>";
	var bb5=bbsp+4;
	dbg_array(dbg_object(bb_graphics_context).bbmatrixStack,bb5)[bb5]=dbg_object(bb_graphics_context).bbtx
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<355>";
	var bb6=bbsp+5;
	dbg_array(dbg_object(bb_graphics_context).bbmatrixStack,bb6)[bb6]=dbg_object(bb_graphics_context).bbty
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<356>";
	dbg_object(bb_graphics_context).bbmatrixSp=bbsp+6;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<348>";
	pop_err();
	return 0;
}
function bb_graphics_Transform(bbix,bbiy,bbjx,bbjy,bbtx,bbty){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<366>";
	var bbix2=bbix*dbg_object(bb_graphics_context).bbix+bbiy*dbg_object(bb_graphics_context).bbjx;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<367>";
	var bbiy2=bbix*dbg_object(bb_graphics_context).bbiy+bbiy*dbg_object(bb_graphics_context).bbjy;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<368>";
	var bbjx2=bbjx*dbg_object(bb_graphics_context).bbix+bbjy*dbg_object(bb_graphics_context).bbjx;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<369>";
	var bbjy2=bbjx*dbg_object(bb_graphics_context).bbiy+bbjy*dbg_object(bb_graphics_context).bbjy;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<370>";
	var bbtx2=bbtx*dbg_object(bb_graphics_context).bbix+bbty*dbg_object(bb_graphics_context).bbjx+dbg_object(bb_graphics_context).bbtx;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<371>";
	var bbty2=bbtx*dbg_object(bb_graphics_context).bbiy+bbty*dbg_object(bb_graphics_context).bbjy+dbg_object(bb_graphics_context).bbty;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<372>";
	bb_graphics_SetMatrix(bbix2,bbiy2,bbjx2,bbjy2,bbtx2,bbty2);
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<365>";
	pop_err();
	return 0;
}
function bb_graphics_Transform2(bbcoords){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<581>";
	var bbout=new_number_array(bbcoords.length);
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<582>";
	for(var bbi=0;bbi<bbcoords.length-1;bbi=bbi+2){
		err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<583>";
		var bbx=dbg_array(bbcoords,bbi)[bbi];
		err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<583>";
		var bb=bbi+1;
		var bby=dbg_array(bbcoords,bb)[bb];
		err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<584>";
		dbg_array(bbout,bbi)[bbi]=bbx*dbg_object(bb_graphics_context).bbix+bby*dbg_object(bb_graphics_context).bbjx+dbg_object(bb_graphics_context).bbtx
		err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<585>";
		var bb2=bbi+1;
		dbg_array(bbout,bb2)[bb2]=bbx*dbg_object(bb_graphics_context).bbiy+bby*dbg_object(bb_graphics_context).bbjy+dbg_object(bb_graphics_context).bbty
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<587>";
	pop_err();
	return bbout;
}
function bb_graphics_Scale(bbx,bby){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<380>";
	bb_graphics_Transform(bbx,0.000000,0.000000,bby,0.000000,0.000000);
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<379>";
	pop_err();
	return 0;
}
function bb_circle_Circle(){
	bb_shape_Shape.call(this);
	this.bbtC=null;
	this.bbr=0;
	this.bbc=null;
}
bb_circle_Circle.prototype=extend_class(bb_shape_Shape);
function bb_circle_new(bbradius,bboffset,bbmaterial){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/circle.monkey<39>";
	bb_shape_new.call(this,bb_shape_CIRCLE,bbmaterial);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/circle.monkey<40>";
	this.bbcircle=this;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/circle.monkey<41>";
	dbg_object(this).bboffset=bboffset.bbclone();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/circle.monkey<42>";
	this.bbc=bboffset.bbclone();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/circle.monkey<43>";
	this.bbr=bbradius;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/circle.monkey<44>";
	this.bbarea=bb_constants_PI*(this.bbr*this.bbr);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/circle.monkey<45>";
	this.bbtC=this.bbc.bbclone();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/circle.monkey<38>";
	var bb=this;
	pop_err();
	return bb;
}
function bb_circle_new2(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/circle.monkey<32>";
	bb_shape_new2.call(this);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/circle.monkey<32>";
	var bb=this;
	pop_err();
	return bb;
}
bb_circle_Circle.prototype.bbupdate=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/circle.monkey<49>";
	dbg_object(this.bbtC).bbx=dbg_object(this.bbbody).bbx+bb_constants_XROT(this.bbc,this.bbbody);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/circle.monkey<50>";
	dbg_object(this.bbtC).bby=dbg_object(this.bbbody).bby+bb_constants_YROT(this.bbc,this.bbbody);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/circle.monkey<51>";
	dbg_object(this.bbaabb).bbl=dbg_object(this.bbtC).bbx-this.bbr;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/circle.monkey<52>";
	dbg_object(this.bbaabb).bbr=dbg_object(this.bbtC).bbx+this.bbr;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/circle.monkey<53>";
	dbg_object(this.bbaabb).bbt=dbg_object(this.bbtC).bby-this.bbr;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/circle.monkey<54>";
	dbg_object(this.bbaabb).bbb=dbg_object(this.bbtC).bby+this.bbr;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/circle.monkey<48>";
	pop_err();
	return 0;
}
bb_circle_Circle.prototype.bbcalculateInertia=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/circle.monkey<58>";
	var bb=0.5*(this.bbr*this.bbr)+this.bboffset.bbdot(this.bboffset);
	pop_err();
	return bb;
}
function bb_graphics_ValidateMatrix(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<238>";
	if((dbg_object(bb_graphics_context).bbmatDirty)!=0){
		err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<239>";
		dbg_object(bb_graphics_context).bbdevice.SetMatrix(dbg_object(bb_graphics_context).bbix,dbg_object(bb_graphics_context).bbiy,dbg_object(bb_graphics_context).bbjx,dbg_object(bb_graphics_context).bbjy,dbg_object(bb_graphics_context).bbtx,dbg_object(bb_graphics_context).bbty);
		err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<240>";
		dbg_object(bb_graphics_context).bbmatDirty=0;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<237>";
	pop_err();
	return 0;
}
function bb_graphics_DrawCircle(bbx,bby,bbr){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<420>";
	bb_graphics_DebugRenderDevice();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<422>";
	bb_graphics_ValidateMatrix();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<423>";
	bb_graphics_renderDevice.DrawOval(bbx-bbr,bby-bbr,bbr*2.000000,bbr*2.000000);
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<418>";
	pop_err();
	return 0;
}
function bb_graphics_DrawLine(bbx1,bby1,bbx2,bby2){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<404>";
	bb_graphics_DebugRenderDevice();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<406>";
	bb_graphics_ValidateMatrix();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<407>";
	bb_graphics_renderDevice.DrawLine(bbx1,bby1,bbx2,bby2);
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<402>";
	pop_err();
	return 0;
}
function bb_segment_Segment(){
	bb_shape_Shape.call(this);
	this.bbtA=null;
	this.bbtB=null;
	this.bbr=0;
	this.bbtN=null;
	this.bba=null;
	this.bbb=null;
	this.bbn=null;
	this.bbtNneg=null;
}
bb_segment_Segment.prototype=extend_class(bb_shape_Shape);
bb_segment_Segment.prototype.bbupdate=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/segment.monkey<60>";
	dbg_object(this.bbtA).bbx=dbg_object(this.bbbody).bbx+bb_constants_XROT(this.bba,this.bbbody);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/segment.monkey<61>";
	dbg_object(this.bbtA).bby=dbg_object(this.bbbody).bby+bb_constants_YROT(this.bba,this.bbbody);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/segment.monkey<62>";
	dbg_object(this.bbtB).bbx=dbg_object(this.bbbody).bbx+bb_constants_XROT(this.bbb,this.bbbody);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/segment.monkey<63>";
	dbg_object(this.bbtB).bby=dbg_object(this.bbbody).bby+bb_constants_YROT(this.bbb,this.bbbody);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/segment.monkey<64>";
	dbg_object(this.bbtN).bbx=bb_constants_XROT(this.bbn,this.bbbody);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/segment.monkey<65>";
	dbg_object(this.bbtN).bby=bb_constants_YROT(this.bbn,this.bbbody);
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/segment.monkey<66>";
	dbg_object(this.bbtNneg).bbx=-dbg_object(this.bbtN).bbx;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/segment.monkey<67>";
	dbg_object(this.bbtNneg).bby=-dbg_object(this.bbtN).bby;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/segment.monkey<69>";
	if(dbg_object(this.bbtA).bbx<dbg_object(this.bbtB).bbx){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/segment.monkey<71>";
		dbg_object(this.bbaabb).bbl=dbg_object(this.bbtA).bbx-this.bbr;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/segment.monkey<72>";
		dbg_object(this.bbaabb).bbr=dbg_object(this.bbtB).bbx+this.bbr;
	}else{
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/segment.monkey<75>";
		dbg_object(this.bbaabb).bbl=dbg_object(this.bbtB).bbx-this.bbr;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/segment.monkey<76>";
		dbg_object(this.bbaabb).bbr=dbg_object(this.bbtA).bbx+this.bbr;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/segment.monkey<79>";
	if(dbg_object(this.bbtA).bby<dbg_object(this.bbtB).bby){
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/segment.monkey<81>";
		dbg_object(this.bbaabb).bbt=dbg_object(this.bbtA).bby-this.bbr;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/segment.monkey<82>";
		dbg_object(this.bbaabb).bbb=dbg_object(this.bbtB).bby+this.bbr;
	}else{
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/segment.monkey<85>";
		dbg_object(this.bbaabb).bbt=dbg_object(this.bbtB).bby-this.bbr;
		err_info="C:/Data/Dev/MonkeyPro/modules/fling/segment.monkey<86>";
		dbg_object(this.bbaabb).bbb=dbg_object(this.bbtA).bby+this.bbr;
	}
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/segment.monkey<57>";
	pop_err();
	return 0;
}
bb_segment_Segment.prototype.bbcalculateInertia=function(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/segment.monkey<91>";
	pop_err();
	return 1.0;
}
function bb_graphics_DrawRect(bbx,bby,bbw,bbh){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<396>";
	bb_graphics_DebugRenderDevice();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<398>";
	bb_graphics_ValidateMatrix();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<399>";
	bb_graphics_renderDevice.DrawRect(bbx,bby,bbw,bbh);
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<394>";
	pop_err();
	return 0;
}
function bb_graphics_PopMatrix(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<360>";
	var bbsp=dbg_object(bb_graphics_context).bbmatrixSp-6;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<361>";
	var bb=bbsp+0;
	var bb2=bbsp+1;
	var bb3=bbsp+2;
	var bb4=bbsp+3;
	var bb5=bbsp+4;
	var bb6=bbsp+5;
	bb_graphics_SetMatrix(dbg_array(dbg_object(bb_graphics_context).bbmatrixStack,bb)[bb],dbg_array(dbg_object(bb_graphics_context).bbmatrixStack,bb2)[bb2],dbg_array(dbg_object(bb_graphics_context).bbmatrixStack,bb3)[bb3],dbg_array(dbg_object(bb_graphics_context).bbmatrixStack,bb4)[bb4],dbg_array(dbg_object(bb_graphics_context).bbmatrixStack,bb5)[bb5],dbg_array(dbg_object(bb_graphics_context).bbmatrixStack,bb6)[bb6]);
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<362>";
	dbg_object(bb_graphics_context).bbmatrixSp=bbsp;
	err_info="C:/Data/Dev/MonkeyPro/modules/mojo/graphics.monkey<359>";
	pop_err();
	return 0;
}
function bb_fontarray_FontArray(){
	Object.call(this);
}
var bb_fontarray_exclamation;
var bb_fontarray_a_lower;
var bb_fontarray_b_lower;
var bb_fontarray_c_lower;
var bb_fontarray_d_lower;
var bb_fontarray_e_lower;
var bb_fontarray_f_lower;
var bb_fontarray_g_lower;
var bb_fontarray_h_lower;
var bb_fontarray_i_lower;
var bb_fontarray_j_lower;
var bb_fontarray_k_lower;
var bb_fontarray_l_lower;
var bb_fontarray_m_lower;
var bb_fontarray_n_lower;
var bb_fontarray_o_lower;
var bb_fontarray_p_lower;
var bb_fontarray_q_lower;
var bb_fontarray_r_lower;
var bb_fontarray_s_lower;
var bb_fontarray_t_lower;
var bb_fontarray_u_lower;
var bb_fontarray_v_lower;
var bb_fontarray_w_lower;
var bb_fontarray_x_lower;
var bb_fontarray_y_lower;
var bb_fontarray_z_lower;
var bb_fontarray_lowerCase;
var bb_fontarray_HEIGHT;
var bb_fontarray_WIDTH;
function bb_iaabb_IAABB(){
	Object.call(this);
	this.bbl=0;
	this.bbt=0;
	this.bbr=0;
	this.bbb=0;
}
function bb_iaabb_new(bbleft,bbtop,bbright,bbbottom){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/iaabb.monkey<38>";
	dbg_object(this).bbl=bbleft;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/iaabb.monkey<39>";
	dbg_object(this).bbt=bbtop;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/iaabb.monkey<40>";
	dbg_object(this).bbr=bbright;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/iaabb.monkey<41>";
	dbg_object(this).bbb=bbbottom;
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/iaabb.monkey<36>";
	var bb=this;
	pop_err();
	return bb;
}
function bb_iaabb_new2(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/fling/col/iaabb.monkey<31>";
	var bb=this;
	pop_err();
	return bb;
}
var bb_random_Seed;
function bb_random_Rnd(){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/random.monkey<21>";
	bb_random_Seed=bb_random_Seed*1664525+1013904223|0;
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/random.monkey<22>";
	var bb=(((bb_random_Seed/4)|0)&1073741823)/1073741824.0000;
	pop_err();
	return bb;
}
function bb_random_Rnd2(bblow,bbhigh){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/random.monkey<30>";
	var bb=bb_random_Rnd3(bbhigh-bblow)+bblow;
	pop_err();
	return bb;
}
function bb_random_Rnd3(bbrange){
	push_err();
	err_info="C:/Data/Dev/MonkeyPro/modules/monkey/random.monkey<26>";
	var bb=bb_random_Rnd()*bbrange;
	pop_err();
	return bb;
}
function bb_Init(){
	bb_graphics_context=null;
	bb_input_device=null;
	bb_audio_device=null;
	bb_app_device=null;
	bb_graphics_DefaultFlags=0;
	bb_resource_resources=bb_map_new2.call(new bb_map_StringMap);
	bb_graphics_renderDevice=null;
	bb_constants_DEFAULT_SLEEP_EPSILON=0.002;
	bb_constants_WORLD_BOUNDS_FREQ=120;
	bb_body_ID=0;
	bb_constants_FMAX=Math.pow(10.000000,99.000000);
	bb_properties_PID=0;
	bb_constants_DEFAULT_PROPERTIES=bb_properties_new.call(new bb_properties_Properties,0.999,0.999,0.1,bb_constants_FMAX,0.5);
	bb_island_ID=0;
	bb_constants_POSITIVE_INFINITY=Math.pow(10.000000,1000.000000);
	bb_constants_EPSILON=Math.pow(10.000000,-99.000000);
	bb_constants_ANGULAR_TO_LINEAR=30.0;
	bb_constants_SLEEP_BIAS=0.95;
	bb_constants_NaN=-1.000000*Math.pow(10.000000,1001.000000);
	bb_shape_POLYGON=2;
	bb_shape_ID=0;
	bb_constants_DEFAULT_MATERIAL=bb_material_new.call(new bb_material_Material,0.001,0.81,1.000000);
	bb_constants_WAKEUP_FACTOR=2;
	bb_shape_CIRCLE=0;
	bb_shape_SEGMENT=1;
	bb_fontarray_exclamation=[0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0];
	bb_fontarray_a_lower=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,1,0,1,1,1,1,0,1,0,0,1,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0];
	bb_fontarray_b_lower=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,1,1,1,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0];
	bb_fontarray_c_lower=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0];
	bb_fontarray_d_lower=[0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,1,1,1,1,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0];
	bb_fontarray_e_lower=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,1,0,0,1,0,1,1,1,1,0,1,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0];
	bb_fontarray_f_lower=[1,1,1,1,0,1,0,0,0,0,1,0,0,0,0,1,1,1,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	bb_fontarray_g_lower=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,0,1,1,1,1,0,0,0,0,1,0,1,1,1,1,0];
	bb_fontarray_h_lower=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,1,1,1,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0];
	bb_fontarray_i_lower=[0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	bb_fontarray_j_lower=[0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,1,1,0,0,0,0,0,0,0,0];
	bb_fontarray_k_lower=[0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,1,0,1,0,1,0,0,1,1,0,0,0,1,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0];
	bb_fontarray_l_lower=[0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0];
	bb_fontarray_m_lower=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,1,0,1,1,0,1,0,1,1,0,1,0,1,1,0,1,0,1,0,0,0,0,0,0,0,0,0,0];
	bb_fontarray_n_lower=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0];
	bb_fontarray_o_lower=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0];
	bb_fontarray_p_lower=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,0,1,1,1,1,0,1,0,0,0,0,1,0,0,0,0];
	bb_fontarray_q_lower=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,0,1,1,1,1,0,0,0,0,1,0,0,0,0,1,0];
	bb_fontarray_r_lower=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,1,0,0,1,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	bb_fontarray_s_lower=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,1,0,0,0,0,1,1,1,1,0,0,0,0,1,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0];
	bb_fontarray_t_lower=[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,1,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0];
	bb_fontarray_u_lower=[0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,0,0,0,0,1,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0];
	bb_fontarray_v_lower=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,0,0,0,1,0,1,0,1,0,0,1,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0];
	bb_fontarray_w_lower=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1,0,1,1,0,1,0,1,1,0,1,0,1,1,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0];
	bb_fontarray_x_lower=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,0,1,1,0,0,1,0,0,1,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0];
	bb_fontarray_y_lower=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,0,1,0,0,1,0,1,1,1,1,0,0,0,0,1,0,1,1,1,1,0];
	bb_fontarray_z_lower=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0];
	bb_fontarray_lowerCase=[bb_fontarray_a_lower,bb_fontarray_b_lower,bb_fontarray_c_lower,bb_fontarray_d_lower,bb_fontarray_e_lower,bb_fontarray_f_lower,bb_fontarray_g_lower,bb_fontarray_h_lower,bb_fontarray_i_lower,bb_fontarray_j_lower,bb_fontarray_k_lower,bb_fontarray_l_lower,bb_fontarray_m_lower,bb_fontarray_n_lower,bb_fontarray_o_lower,bb_fontarray_p_lower,bb_fontarray_q_lower,bb_fontarray_r_lower,bb_fontarray_s_lower,bb_fontarray_t_lower,bb_fontarray_u_lower,bb_fontarray_v_lower,bb_fontarray_w_lower,bb_fontarray_x_lower,bb_fontarray_y_lower,bb_fontarray_z_lower];
	bb_fontarray_HEIGHT=10;
	bb_fontarray_WIDTH=5;
	bb_constants_PI=3.14159265;
	bb_random_Seed=1234;
}
//${TRANSCODE_END}

//This overrides print in 'std.lang/lang.js'
//
