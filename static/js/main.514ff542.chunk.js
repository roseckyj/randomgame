(this.webpackJsonprandomgame=this.webpackJsonprandomgame||[]).push([[0],{183:function(e,t,i){e.exports=i(224)},187:function(e,t,i){},219:function(e,t){},224:function(e,t,i){"use strict";i.r(t);var n=i(27),a=i.n(n),s=i(179),r=i.n(s),o=(i(187),i(50)),h=i(51),u=i(66),c=i(70),l=i(33),d=i.n(l),f=i(49),y=i(34),p=i(157),m=i(89),b=i(112),v=i(56),g=i(44),k={player:{filename:"Character.png",width:57,animations:{default:{start:0,end:0,type:"frame"},walking:{start:0,end:7,type:"loop"},inventory_opening:{start:8,end:11,type:"once"},inventory_open:{start:11,end:11,type:"frame"},inventory_closing:{start:11,end:8,type:"once"},equip:{start:12,end:19,type:"once"},unequip:{start:19,end:12,type:"once"},mine:{start:20,end:22,type:"boomerang"},eat:{start:23,end:51,type:"once"},interact:{start:52,end:56,type:"once"}}},rock_big:{filename:"rock_big.png",width:1,animations:{}},rock_small:{filename:"rock_small.png",width:1,animations:{}},bush:{filename:"bush.png",width:1,animations:{}},tree_small:{filename:"tree_small.png",width:1,animations:{}},tree_big:{filename:"tree_big.png",width:1,animations:{}},tree_short:{filename:"tree_short.png",width:1,animations:{}},tree_tall:{filename:"tree_tall.png",width:1,animations:{}},grass_water_L:{filename:"grass_water_L.png",width:1,animations:{}},grass_water_R:{filename:"grass_water_R.png",width:1,animations:{}},grass_water_T:{filename:"grass_water_T.png",width:1,animations:{}},grass_water_B:{filename:"grass_water_B.png",width:1,animations:{}},grass_water_TL:{filename:"grass_water_TL.png",width:1,animations:{}},grass_water_RB:{filename:"grass_water_RB.png",width:1,animations:{}},grass_water_TR:{filename:"grass_water_TR.png",width:1,animations:{}},grass_water_BL:{filename:"grass_water_BL.png",width:1,animations:{}},grass_water_TBL:{filename:"grass_water_TBL.png",width:1,animations:{}},grass_water_TRL:{filename:"grass_water_TRL.png",width:1,animations:{}},grass_water_RBL:{filename:"grass_water_RBL.png",width:1,animations:{}},grass_water_TRB:{filename:"grass_water_TRB.png",width:1,animations:{}},grass_water_TRBL:{filename:"grass_water_TRBL.png",width:1,animations:{}},grass_water_corner_BL:{filename:"grass_water_corner_BL.png",width:1,animations:{}},grass_water_corner_BR:{filename:"grass_water_corner_BR.png",width:1,animations:{}},grass_water_corner_TL:{filename:"grass_water_corner_TL.png",width:1,animations:{}},grass_water_corner_TR:{filename:"grass_water_corner_TR.png",width:1,animations:{}}},x=function(){function e(t,i){Object(o.a)(this,e),this.scene=i,this.textureAtlas=void 0,this.texture=void 0,this.textureAtlas=t;var n=new y.Texture(_+k[t].filename,i,!1,!0,y.Texture.NEAREST_NEAREST);n.hasAlpha=!0,this.texture=n}return Object(h.a)(e,[{key:"getTexture",value:function(){return this.texture}},{key:"detach",value:function(){this.scene.removeTexture(this.texture)}}]),e}(),w=Object.values(k).map((function(e){return e.filename}));w=w.filter((function(e,t){return w.indexOf(e)===t}));var S={},O={},j=0,_="/randomgame/resources/textures/";function T(e,t){if(O[e])return O[e];var i=B(new x(e,t).getTexture(),t);return O[e]=i,i}function B(e,t){var i=new y.StandardMaterial("mat",t);return i.emissiveTexture=e,i.opacityTexture=e,i}function M(e){return k[e]?S[k[e].filename]:(console.warn("Image "+e+" not found!"),null)}var E=function(){function e(t,i){var n=this,a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"default";Object(o.a)(this,e),this.scene=i,this.textureAtlas=void 0,this.texture=void 0,this.animationQueue=[],this.frame=0,this.direction=1,this.interval=void 0,this.textureScale=1,this.textureAtlas=t,this.textureScale=1/k[t].width;var s=new y.Texture(_+k[t].filename,i,!1,!0,y.Texture.NEAREST_NEAREST);s.uOffset=this.textureScale*k[t].animations[a].start,s.vOffset=0,s.uScale=this.textureScale,s.vScale=1,s.hasAlpha=!0,this.texture=s,this.queue(a),this.interval=setInterval((function(){return n.tick()}),80)}return Object(h.a)(e,[{key:"getTexture",value:function(){return this.texture}},{key:"isLast",value:function(e){return this.animationQueue[this.animationQueue.length-1].texture===e}},{key:"queueOnce",value:function(e,t){this.isLast(e)||this.queue(e,t)}},{key:"queue",value:function(e,t){if(!Object.keys(k[this.textureAtlas].animations).includes(e))return console.warn("Animation does not exist"),void this.animationQueue.push({texture:"default",skippable:!0});this.animationQueue.length>1&&this.animationQueue[this.animationQueue.length-1].skippable?this.animationQueue[this.animationQueue.length-1]={texture:e,skippable:!t}:this.animationQueue.push({texture:e,skippable:!t})}},{key:"tick",value:function(){if(this.texture){this.frame+=this.direction;var e=k[this.textureAtlas].animations[this.animationQueue[0].texture],t=Math.abs(e.start-e.end),i=this.animationQueue.length>1;if(this.frame>t)switch(e.type){case"loop":this.direction=1,this.frame=0,i&&this.animationQueue.shift();break;case"once":this.direction=1,i?(this.frame=0,this.animationQueue.shift()):this.frame=t;break;case"boomerang":this.direction=-1,this.frame-=2;break;case"frame":this.direction=1,this.frame=0,i&&this.animationQueue.shift()}this.frame<0&&(this.direction=1,i?(this.frame=0,this.animationQueue.shift()):this.frame=0);var n=k[this.textureAtlas].animations[this.animationQueue[0].texture],a=n.start>n.end?-1:1;this.texture.uOffset=(this.frame*a+n.start)*this.textureScale}else console.error("Texture is null")}},{key:"detach",value:function(){this.scene.removeTexture(this.texture)}}]),e}(),z=Math.PI/4,R=function(){function e(t){Object(o.a)(this,e),this.gameScene=t,this.babylonScene=null,this.mesh=null,this.position=y.Vector2.Zero()}return Object(h.a)(e,[{key:"attachBabylon",value:function(){var e=Object(f.a)(d.a.mark((function e(t){return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:this.babylonScene=t;case 1:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"detachBabylon",value:function(){var e=Object(f.a)(d.a.mark((function e(){return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:this.babylonScene&&this.mesh&&(this.babylonScene.removeMesh(this.mesh,!0),this.babylonScene=null);case 1:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"tick",value:function(e){}},{key:"setVisibility",value:function(e){this.mesh&&this.mesh.setEnabled(e)}},{key:"getVisibility",value:function(){return!!this.mesh&&this.mesh.isEnabled()}}]),e}(),C=function(e){Object(u.a)(i,e);var t=Object(c.a)(i);function i(){var e;Object(o.a)(this,i);for(var n=arguments.length,a=new Array(n),s=0;s<n;s++)a[s]=arguments[s];return(e=t.call.apply(t,[this].concat(a))).disabled=!1,e.hitbox={width:0,height:0},e}return Object(h.a)(i,[{key:"serialize",value:function(){return{id:this.id,x:this.position.x,y:this.position.y,type:i.type,data:{}}}},{key:"deserialize",value:function(e,t){this.updateMesh()}},{key:"updateMesh",value:function(){var e=Object(f.a)(d.a.mark((function e(){return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:this.mesh&&(this.mesh.position.z=-this.getSize().y*Math.cos(z)/2,this.mesh.rotation.x=-z,this.mesh.position.x=100*this.position.x,this.mesh.position.y=100*-this.position.y+this.getSize().y*Math.sin(z)/2,this.mesh.isPickable=!0);case 1:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"setVisibilityAttachBabylon",value:function(){var e=Object(f.a)(d.a.mark((function e(t,n){return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:Object(v.a)(Object(g.a)(i.prototype),"setVisibility",this).call(this,t),t&&!this.babylonScene&&this.attachBabylon(n);case 2:case"end":return e.stop()}}),e,this)})));return function(t,i){return e.apply(this,arguments)}}()},{key:"colidesWith",value:function(e){return this.position.x-this.hitbox.width<e.position.x+e.hitbox.width&&this.position.x+this.hitbox.width>e.position.x-e.hitbox.width&&this.position.y-this.hitbox.height<e.position.y+e.hitbox.height&&this.position.y+this.hitbox.height>e.position.y-e.hitbox.height}},{key:"mouseDown",value:function(){console.log(this,"down")}},{key:"mouseUp",value:function(){console.log(this,"up")}}],[{key:"type",get:function(){return"unknown"}}]),i}(R),L=function(e){Object(u.a)(i,e);var t=Object(c.a)(i);function i(e,n){var a;return Object(o.a)(this,i),(a=t.call(this,e)).id=n,a.hitbox={width:.5,height:.2},a.velocityX=0,a.velocityY=0,a.name="",a.targetX=0,a.targetY=0,a.finalVelocityX=0,a.finalVelocityY=0,a.targetTime=-1,a.keyBindings={up:0,down:0,left:0,right:0},a.keysPressed=[],a.texture=void 0,a.titleTexture=void 0,a}return Object(h.a)(i,[{key:"serialize",value:function(){var e=Object(v.a)(Object(g.a)(i.prototype),"serialize",this).call(this);return e.type=i.type,e.data={velocityX:this.velocityX,velocityY:this.velocityY,name:this.name},e}},{key:"deserialize",value:function(e,t){this.position.x=e.x,this.position.y=e.y,this.name=e.data.name,t?(this.finalVelocityX=e.data.velocityX,this.finalVelocityY=e.data.velocityY,this.targetTime=50,this.velocityX=(e.x-this.position.x)/50,this.velocityY=(e.y-this.position.y)/50):(this.velocityX=e.data.velocityX,this.velocityY=e.data.velocityY),Object(v.a)(Object(g.a)(i.prototype),"deserialize",this).call(this,e,t)}},{key:"tick",value:function(e){var t=this;if(this.targetTime>0)return this.position.x+=this.velocityX*e,this.position.y+=this.velocityY*e,this.targetTime-=e,this.targetTime<=0&&(this.position.x=this.targetX,this.position.y=this.targetY,this.velocityX=this.finalVelocityX,this.velocityY=this.finalVelocityY),void this.updateMesh();if(!this.keyBindings.up&&!this.keyBindings.down&&!this.keyBindings.left&&!this.keyBindings.right)return this.position.x+=this.velocityX,this.position.y+=this.velocityY,void this.updateMesh();var i=.1*e,n=!1,a=!1,s=Math.sqrt(2);(this.keysPressed.includes(this.keyBindings.left)||this.keysPressed.includes(this.keyBindings.right))&&(n=!0),(this.keysPressed.includes(this.keyBindings.up)||this.keysPressed.includes(this.keyBindings.down))&&(a=!0),this.keysPressed.includes(this.keyBindings.left)&&(this.velocityX-=.002*i/(a?s:1)),this.keysPressed.includes(this.keyBindings.right)&&(this.velocityX+=.002*i/(a?s:1)),this.keysPressed.includes(this.keyBindings.up)&&(this.velocityY-=.002*i/(n?s:1)),this.keysPressed.includes(this.keyBindings.down)&&(this.velocityY+=.002*i/(n?s:1));var r=this.position.x,o=this.position.y;this.position.x+=this.velocityX*i,this.position.y+=this.velocityY*i,this.velocityX*=Math.pow(.95,i),this.velocityY*=Math.pow(.95,i),Math.abs(this.velocityX)<.001&&(this.velocityX=0),Math.abs(this.velocityY)<.001&&(this.velocityY=0);var h=this.gameScene.getColisions(this);if(h.length()>0){var u=!1,c=!1;h.forEach((function(e){var i=!(o-t.hitbox.height<e.position.y+e.hitbox.height)&&t.position.y-t.hitbox.height<e.position.y+e.hitbox.height,n=!(r+t.hitbox.width>e.position.x-e.hitbox.width)&&t.position.x+t.hitbox.width>e.position.x-e.hitbox.width,a=!(o+t.hitbox.height>e.position.y-e.hitbox.height)&&t.position.y+t.hitbox.height>e.position.y-e.hitbox.height,s=!(r-t.hitbox.width<e.position.x+e.hitbox.width)&&t.position.x-t.hitbox.width<e.position.x+e.hitbox.width;u=u||n||s,c=c||i||a})),u&&(this.position.x=r,this.velocityX=0),c&&(this.position.y=o,this.velocityY=0)}this.updateMesh()}},{key:"keyDown",value:function(e){this.keysPressed.includes(e)||this.keysPressed.push(e)}},{key:"keyUp",value:function(e){this.keysPressed.includes(e)&&(this.keysPressed=this.keysPressed.filter((function(t){return t!==e})))}},{key:"bindKeys",value:function(e){this.keyBindings=Object(b.a)(Object(b.a)({},this.keyBindings),e)}},{key:"attachBabylon",value:function(){var e=Object(f.a)(d.a.mark((function e(t){var n,a,s;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!this.babylonScene){e.next=2;break}return e.abrupt("return");case 2:return e.next=4,Object(v.a)(Object(g.a)(i.prototype),"attachBabylon",this).call(this,t);case 4:if(this.babylonScene){e.next=6;break}return e.abrupt("return");case 6:n=this.getSize(),this.mesh=y.MeshBuilder.CreatePlane("player "+this.id,{width:n.x,height:n.y,sideOrientation:y.Mesh.FRONTSIDE},this.babylonScene),this.texture=new E("player",this.babylonScene,"default"),this.mesh.material=B(this.texture.getTexture(),this.babylonScene),(a=y.MeshBuilder.CreatePlane("title "+this.id,{width:200,height:40,sideOrientation:y.Mesh.FRONTSIDE},this.babylonScene)).position=new y.Vector3(0,110,-3),s=new y.DynamicTexture("titleTexture "+this.id,{width:200,height:40},this.babylonScene,!0,y.Texture.LINEAR_LINEAR),this.titleTexture=s,a.parent=this.mesh,a.material=B(s,this.babylonScene),this.updateMesh();case 17:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"updateMesh",value:function(){var e=Object(f.a)(d.a.mark((function e(){var t;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(this.mesh){e.next=2;break}return e.abrupt("return");case 2:Object(v.a)(Object(g.a)(i.prototype),"updateMesh",this).call(this),(t=this.titleTexture.getContext()).clearRect(0,0,this.titleTexture.getSize().width,this.titleTexture.getSize().height),t.fillStyle="#343434AA",t.fillRect(0,0,this.titleTexture.getSize().width,this.titleTexture.getSize().height),t.font="32px pixel",t.textBaseline="middle",t.textAlign="center",t.fillStyle="#FFFFFF",t.fillText(this.name,this.titleTexture.getSize().width/2,this.titleTexture.getSize().height/2),this.titleTexture.update(),.01,Math.abs(this.velocityX)>.01||Math.abs(this.velocityY)>.01?this.texture.queueOnce("walking"):this.texture.queueOnce("default");case 15:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"detachBabylon",value:function(){var e=Object(f.a)(d.a.mark((function e(){var t;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:this.babylonScene&&this.mesh&&(t=this.mesh.getChildMeshes()[0],this.titleTexture&&t&&t.material&&(this.babylonScene.removeTexture(this.titleTexture),this.babylonScene.removeMaterial(t.material))),Object(v.a)(Object(g.a)(i.prototype),"detachBabylon",this).call(this);case 2:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"getSize",value:function(){return new y.Vector2(100,200)}}],[{key:"type",get:function(){return"player"}}]),i}(C);function I(e){switch(e){case 1:return"#67943F";case 2:return"#2EB0E5";case 4:return"#FDDC86"}return"#DDDDDD"}var D=function(e){Object(u.a)(i,e);var t=Object(c.a)(i);function i(e,n,a){var s;return Object(o.a)(this,i),(s=t.call(this,e)).ground=[[]],s.texture=void 0,s.position=new y.Vector2(n,a),s}return Object(h.a)(i,[{key:"serialize",value:function(){return{x:this.position.x,y:this.position.y,ground:this.ground}}},{key:"deserialize",value:function(e){this.position.x=e.x,this.position.y=e.y,this.ground=e.ground,this.updateMesh()}},{key:"hasEntity",value:function(e){return e.position.x>16*this.position.x-8&&e.position.x<16*this.position.x+8&&e.position.y>16*this.position.y-8&&e.position.y<16*this.position.y+8}},{key:"attachBabylon",value:function(){var e=Object(f.a)(d.a.mark((function e(t){var n,a;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:Object(v.a)(Object(g.a)(i.prototype),"attachBabylon",this).call(this,t),this.babylonScene&&(this.mesh=y.MeshBuilder.CreatePlane("chunk "+this.id,{width:1600,height:1600,sideOrientation:y.Mesh.FRONTSIDE},this.babylonScene),n=new y.DynamicTexture("chunkTexture "+this.id,{width:256,height:256},this.babylonScene,!0,y.Texture.NEAREST_NEAREST),this.texture=n,(a=new y.StandardMaterial("mat "+this.id,this.babylonScene)).emissiveTexture=n,this.mesh.material=a,this.updateMesh());case 2:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"updateMesh",value:function(){var e=Object(f.a)(d.a.mark((function e(){var t;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(this.mesh&&this.babylonScene){e.next=2;break}return e.abrupt("return");case 2:this.mesh.position.x=16*this.position.x*100,this.mesh.position.y=16*-this.position.y*100,t=this.texture.getContext(),this.drawTexture(t),this.texture.update();case 7:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"drawBasicTiling",value:function(e,t,i,n){for(var a=0;a<16;a++)for(var s=0;s<16;s++)this.ground[a]&&this.ground[a][s]&&(e.fillStyle=I(this.ground[a][s]),e.fillRect(t+a*n,i+s*n,n,n))}},{key:"drawTexture",value:function(e){this.drawBasicTiling(e,0,0,16);for(var t=0;t<16;t++)for(var i=0;i<16;i++)this.ground[t]&&this.ground[t][i]&&2===this.ground[t][i]&&this.drawTransition(e,t,i,[1,3],"grass_water")}},{key:"drawTransition",value:function(e,t,i,n,a){var s=this,r=16*this.position.x+t-8,o=16*this.position.y+i-8,h="";if(n.includes(this.gameScene.getTile(r,o-1))&&(h+="T"),n.includes(this.gameScene.getTile(r+1,o))&&(h+="R"),n.includes(this.gameScene.getTile(r,o+1))&&(h+="B"),n.includes(this.gameScene.getTile(r-1,o))&&(h+="L"),"TB"===h){var u=M(a+"_T");u&&e.drawImage(u,16*t,16*i);var c=M(a+"_B");c&&e.drawImage(c,16*t,16*i)}else if("RL"===h){var l=M(a+"_R");l&&e.drawImage(l,16*t,16*i);var d=M(a+"_L");d&&e.drawImage(d,16*t,16*i)}else if(h.length>0){var f=M(a+"_"+h);f&&e.drawImage(f,16*t,16*i)}var y=function(u,c,l,d){if(n.includes(s.gameScene.getTile(r+u,o+c))&&!l.reduce((function(e,t){return e||h.includes(t)}),!1)){var f=M(a+"_corner_"+d);f&&e.drawImage(f,16*t,16*i)}};y(-1,-1,["L","T"],"BR"),y(1,-1,["R","T"],"BL"),y(-1,1,["L","B"],"TR"),y(1,1,["R","B"],"TL")}},{key:"detachBabylon",value:function(){return this.babylonScene&&this.mesh&&this.texture&&(this.babylonScene.removeTexture(this.texture),this.mesh.material&&this.babylonScene.removeMaterial(this.mesh.material)),Object(v.a)(Object(g.a)(i.prototype),"detachBabylon",this).call(this)}},{key:"id",get:function(){return i.getId(this.position.x,this.position.y)}}],[{key:"getId",value:function(e,t){return e.toString()+"x"+t.toString()}}]),i}(R),A=function(){function e(){Object(o.a)(this,e),this.values={}}return Object(h.a)(e,[{key:"addMore",value:function(e){this.values=Object(b.a)(Object(b.a)({},this.values),e)}},{key:"add",value:function(e,t){this.values[e]=t}},{key:"remove",value:function(e){this.values[e]&&(this.values[e].detachBabylon(),delete this.values[e])}},{key:"update",value:function(e,t,i){this.values[e]&&this.values[e].deserialize(t,i)}},{key:"updateOrCreate",value:function(e,t,i,n){this.values[e]||(this.values[e]=i()),this.values[e].deserialize(t,n)}},{key:"get",value:function(e){return this.values[e]?this.values[e]:null}},{key:"includes",value:function(e){return!!this.values[e]}},{key:"forEach",value:function(e){var t=this;Object.keys(this.values).forEach((function(i,n){e(t.values[i],i,n)}))}},{key:"filter",value:function(t){var i=this,n=Object.keys(this.values),a=new e;return n.forEach((function(e,n){t(i.values[e],e,n)&&a.add(e,i.values[e])})),a}},{key:"map",value:function(e){var t=this;return Object.keys(this.values).map((function(i,n){return e(t.values[i],i,n)}))}},{key:"getValues",value:function(){return Object.values(this.values)}},{key:"getKeys",value:function(){return Object.keys(this.values)}},{key:"length",value:function(){return this.getKeys().length}}]),e}(),P=function(){function e(){Object(o.a)(this,e),this.entities=new A,this.chunks=new A}return Object(h.a)(e,[{key:"tickAll",value:function(e){this.entities.forEach((function(t){return t.tick(e)})),this.chunks.forEach((function(t){return t.tick(e)}))}},{key:"getTile",value:function(e,t){var i=Math.floor(e)+8,n=Math.floor(t)+8,a=Math.floor(i/16),s=Math.floor(n/16),r=this.chunks.get(D.getId(a,s));return r&&r.ground[i-16*a]&&r.ground[i-16*a][n-16*s]?r.ground[i-16*a][n-16*s]:-1}},{key:"getColisions",value:function(e){return this.entities.filter((function(t){return e!==t&&t.colidesWith(e)}))}}]),e}(),F={left:65,right:68,up:87,down:83},V=i(181),Y=i.n(V),X=function(e){Object(u.a)(i,e);var t=Object(c.a)(i);function i(e,n){var a;return Object(o.a)(this,i),(a=t.call(this,e)).id=n,a.hitbox={width:.2,height:.2},a.size=void 0,a}return Object(h.a)(i,[{key:"serialize",value:function(){var e=Object(v.a)(Object(g.a)(i.prototype),"serialize",this).call(this);return e.type=i.type,e.data={size:this.size},e}},{key:"deserialize",value:function(e){e.type===i.type&&(this.position.x=e.x,this.position.y=e.y,this.size=e.data.size,Object(v.a)(Object(g.a)(i.prototype),"deserialize",this).call(this,e))}},{key:"tick",value:function(e){}},{key:"attachBabylon",value:function(){var e=Object(f.a)(d.a.mark((function e(t){var n;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!this.babylonScene){e.next=2;break}return e.abrupt("return");case 2:return e.next=4,Object(v.a)(Object(g.a)(i.prototype),"attachBabylon",this).call(this,t);case 4:if(this.babylonScene){e.next=6;break}return e.abrupt("return");case 6:n=this.getSize(),this.mesh=y.MeshBuilder.CreatePlane("tree "+this.id,{width:n.x,height:n.y,sideOrientation:y.Mesh.FRONTSIDE},this.babylonScene),this.setMaterial(),this.updateMesh();case 10:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"updateMesh",value:function(){var e=Object(f.a)(d.a.mark((function e(){return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(this.mesh&&this.babylonScene){e.next=2;break}return e.abrupt("return");case 2:this.setMaterial(),Object(v.a)(Object(g.a)(i.prototype),"updateMesh",this).call(this);case 4:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"setMaterial",value:function(){if(this.mesh&&this.babylonScene)switch(this.size){case 1:this.mesh.material=T("tree_small",this.babylonScene);break;case 2:this.mesh.material=T("tree_big",this.babylonScene);break;case 3:this.mesh.material=T("tree_short",this.babylonScene);break;case 4:this.mesh.material=T("tree_tall",this.babylonScene)}}},{key:"detachBabylon",value:function(){var e=Object(f.a)(d.a.mark((function e(){return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:Object(v.a)(Object(g.a)(i.prototype),"detachBabylon",this).call(this);case 1:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"getSize",value:function(){return new y.Vector2(200,400)}}],[{key:"type",get:function(){return"tree"}}]),i}(C),U=function(e){Object(u.a)(i,e);var t=Object(c.a)(i);function i(e,n){var a;return Object(o.a)(this,i),(a=t.call(this,e)).id=n,a.hitbox={width:.2,height:.2},a.size=void 0,a}return Object(h.a)(i,[{key:"serialize",value:function(){var e=Object(v.a)(Object(g.a)(i.prototype),"serialize",this).call(this);return e.type=i.type,e.data={size:this.size},e}},{key:"deserialize",value:function(e){e.type===i.type&&(this.position.x=e.x,this.position.y=e.y,this.size=e.data.size,Object(v.a)(Object(g.a)(i.prototype),"deserialize",this).call(this,e))}},{key:"tick",value:function(e){}},{key:"attachBabylon",value:function(){var e=Object(f.a)(d.a.mark((function e(t){var n;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!this.babylonScene){e.next=2;break}return e.abrupt("return");case 2:return e.next=4,Object(v.a)(Object(g.a)(i.prototype),"attachBabylon",this).call(this,t);case 4:if(this.babylonScene){e.next=6;break}return e.abrupt("return");case 6:n=this.getSize(),this.mesh=y.MeshBuilder.CreatePlane("stone "+this.id,{width:n.x,height:n.y,sideOrientation:y.Mesh.FRONTSIDE},this.babylonScene),this.mesh.material=T(1===this.size?"rock_small":"rock_big",this.babylonScene),this.updateMesh();case 10:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"updateMesh",value:function(){var e=Object(f.a)(d.a.mark((function e(){return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(this.mesh&&this.babylonScene){e.next=2;break}return e.abrupt("return");case 2:this.mesh.material=T(1===this.size?"rock_small":"rock_big",this.babylonScene),Object(v.a)(Object(g.a)(i.prototype),"updateMesh",this).call(this);case 4:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"detachBabylon",value:function(){var e=Object(f.a)(d.a.mark((function e(){return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:Object(v.a)(Object(g.a)(i.prototype),"detachBabylon",this).call(this);case 1:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"getSize",value:function(){return new y.Vector2(100,100)}}],[{key:"type",get:function(){return"stone"}}]),i}(C),N=i(182),Q=i.n(N),q=function(){function e(t,i,n){Object(o.a)(this,e),this.apiUrl=t,this.scene=i,this.getBabylonScene=n,this.socket=void 0,this.userId=void 0,this.opened=void 0,this.callbacks={authenticated:function(){},updated:function(){},invalidPassword:function(){},disconnect:function(){}}}return Object(h.a)(e,[{key:"on",value:function(e,t){this.callbacks[e]=t}},{key:"close",value:function(){this.socket.disconnect()}},{key:"open",value:function(){var e=this;this.opened=!0,this.socket=Y()(this.apiUrl),this.setListeners(),this.socket.on("auth",(function(t){e.userId=t.id,e.callbacks.authenticated(t),console.log("Joined game with player ",t.data.name," ("+t.id+")")}))}},{key:"sendPlayerUpdate",value:function(e){var t=e.serialize();this.socket.emit("update",t)}},{key:"requestChunk",value:function(e,t){this.socket.emit("mapRequest",{x:e,y:t})}},{key:"auth",value:function(e,t){var i={name:e,passwordHash:Q()(t)};this.socket.emit("login",i)}},{key:"setListeners",value:function(){var e=this;this.socket.on("entities",function(){var t=Object(f.a)(d.a.mark((function t(i){return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:i.removed.forEach((function(t){return t.id!==e.userId&&e.scene.entities.remove(t.id)})),i.updated.forEach((function(t){return t.id!==e.userId&&e.scene.entities.updateOrCreate(t.id,t,(function(){return e.createEntity(t)}))})),e.callbacks.updated({});case 3:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()),this.socket.on("mapChunk",function(){var t=Object(f.a)(d.a.mark((function t(i){var n;return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:n=D.getId(i.x,i.y),e.scene.chunks.updateOrCreate(n,i,(function(){var t=new D(e.scene,i.x,i.y);return t.attachBabylon(e.getBabylonScene()),t}));case 2:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}()),this.socket.on("err",function(){var t=Object(f.a)(d.a.mark((function t(i){return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:switch(i.error){case"credentials":e.callbacks.invalidPassword(i)}case 1:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}())}},{key:"createEntity",value:function(e){switch(e.type){case"player":var t=new L(this.scene,e.id);return t.deserialize(e,!0),t;case"tree":var i=new X(this.scene,e.id);return i.deserialize(e),i;case"stone":var n=new U(this.scene,e.id);return n.deserialize(e),n}console.error('Entity "'+e.type+" does not exist!")}}]),e}();function W(e,t,i,n){e.strokeStyle="#000000",e.fillStyle="#FFFFFF",e.lineWidth=2,e.strokeText(t,i,n),e.strokeText(t,i+1,n+1),e.fillText(t,i,n)}var J=function(e){Object(u.a)(i,e);var t=Object(c.a)(i);function i(e){var a;return Object(o.a)(this,i),(a=t.call(this,e)).gameScene=void 0,a.me=null,a.babylonScene=void 0,a.guiTexture=void 0,a.networkClient=void 0,a.state={loggedIn:!1},a.timer=void 0,a.zoom=1,a.renderDistance=3,a.debug=!1,a.loginRef=Object(n.createRef)(),a.passwordRef=Object(n.createRef)(),a.mouseEntity=void 0,a.gameScene=new P,a.networkClient=new q(a.props.apiUrl,a.gameScene,(function(){return a.babylonScene})),a.networkClient.on("authenticated",(function(e){return a.initGame(e)})),a.networkClient.on("invalidPassword",(function(){a.loginRef.current&&a.passwordRef.current&&(a.loginRef.current.classList.add("shake"),a.passwordRef.current.classList.add("shake"),setTimeout((function(){a.loginRef.current&&a.passwordRef.current&&(a.loginRef.current.classList.remove("shake"),a.passwordRef.current.classList.remove("shake"))}),600))})),document.addEventListener("keydown",(function(e){a.me&&a.me.keyDown(e.keyCode)})),document.addEventListener("keyup",(function(e){a.me&&a.me.keyUp(e.keyCode)})),document.addEventListener("wheel",(function(e){a.zoom+=e.deltaY/Math.abs(e.deltaY)*.12,a.zoom<.5&&(a.zoom=.5),a.zoom>3&&(a.zoom=3)})),window.addEventListener("resize",(function(e){a.resize()})),a}return Object(h.a)(i,[{key:"componentDidMount",value:function(){this.resize(),this.networkClient.open()}},{key:"componentWillUnmount",value:function(){clearInterval(this.timer),this.networkClient.close()}},{key:"initGame",value:function(e){var t=this;this.setState({loggedIn:!0}),this.me=new L(this.gameScene,e.id),this.me.attachBabylon(this.babylonScene),this.me.bindKeys(F),this.me.deserialize(e,!1),this.gameScene.entities.add(e.id,this.me),window.player=this.me,window.scene=this.gameScene,window.enableDebug=function(){t.babylonScene&&t.babylonScene.debugLayer.show(),t.debug=!0},this.timer=setInterval(Object(f.a)(d.a.mark((function e(){return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:t.me&&t.networkClient.sendPlayerUpdate(t.me);case 1:case"end":return e.stop()}}),e)}))),100)}},{key:"tick",value:function(e){if(this.gameScene.entities.forEach((function(t){return t.tick(e)})),this.unloadUnusedComponents(),this.requestChunks(),this.guiTexture)if(this.me){var t=this.guiTexture.getContext(),i=this.guiTexture.getSize().width,n=this.guiTexture.getSize().height;t.clearRect(0,0,i,n),function(e,t,i){var n=e.getContext(),a=e.getSize().width-30-64,s=Math.floor(2*(Math.floor(i.position.x)-i.position.x)),r=Math.floor(2*(Math.floor(i.position.y)-i.position.y));n.fillStyle="#000000",n.fillRect(a-64-3,17,136,136);for(var o=-32;o<=33;o++)for(var h=-32;h<=33;h++)n.fillStyle=I(t.getTile(i.position.x+o,i.position.y+h)),n.fillRect(a+2*o+s,84+2*h+r,2,2);t.entities.filter((function(e){return Math.abs(e.position.x-i.position.x)<=33.5&&Math.abs(e.position.y-i.position.y)<=33.5})).forEach((function(e){n.fillStyle=function(e){switch(e){case"tree":return"#2A4323";case"player":return"#000dff";case"stone":return"#dddddd"}return"#DDDDDD"}(e.serialize().type),n.fillRect(Math.floor(a+2*(e.position.x-i.position.x)),Math.floor(84+2*(e.position.y-i.position.y)),2,2)})),n.lineWidth=3,n.strokeStyle="#000000",n.strokeRect(a-64-3+2,19,132,132),n.font="16px pixel",n.textBaseline="top",n.textAlign="center",W(n,"x",a,161),n.textAlign="right",W(n,Math.round(i.position.x).toString(),a-10,161),n.textAlign="left",W(n,Math.round(i.position.y).toString(),a+10,161),e.update()}(this.guiTexture,this.gameScene,this.me),this.debug&&function(e,t,i){var n=e.getContext(),a=20,s={FPS:(1e3/i).toFixed(2),"Enabled entities":t.entities.filter((function(e){return e.getVisibility()})).length()+" (of "+t.entities.length()+" loaded)","Enabled chunks":t.chunks.filter((function(e){return e.getVisibility()})).length()+" (of "+t.chunks.length()+" loaded)"};n.font="16px pixel",n.textBaseline="top",n.textAlign="left",Object.keys(s).forEach((function(e){W(n,e+": "+s[e],30,a),a+=20})),e.update()}(this.guiTexture,this.gameScene,e),this.guiTexture.update()}else{var a=this.guiTexture.getContext(),s=this.guiTexture.getSize().width,r=this.guiTexture.getSize().height;a.fillStyle="#33334C",a.fillRect(0,0,s,r),a.fillStyle="#FFFFFF",a.font="20px pixel",a.textBaseline="middle",a.textAlign="center",W(a,"P\u0159ipojov\xe1n\xed k serveru...",s/2,r/2),this.guiTexture.update()}}},{key:"resize",value:function(){var e=document.getElementById("game");e&&(e.width=window.innerWidth,e.height=window.innerHeight)}},{key:"onSceneMount",value:function(e){var t=this,i=e.scene;this.babylonScene=i;var n=new y.UniversalCamera("Camera",new y.Vector3(0,0,1500),this.babylonScene);n.rotation=new y.Vector3(-z,0,0);var a=y.MeshBuilder.CreateCylinder("skyBox",{height:15e4,diameterTop:14400,diameterBottom:4800,tessellation:24},this.babylonScene),s=new y.StandardMaterial("skyBox",this.babylonScene);s.backFaceCulling=!1,s.diffuseColor=new BABYLON.Color3(0,0,0),s.specularColor=new BABYLON.Color3(0,0,0),s.disableLighting=!0,a.material=s,a.rotation=new y.Vector3(Math.PI/2,0,0),this.guiTexture=m.a.CreateFullscreenUI("GUI",!0,i),i.onPointerDown=function(e,i){i.hit&&i.pickedMesh&&!i.pickedMesh.name.startsWith("chunk")?(t.mouseEntity=t.gameScene.entities.get(i.pickedMesh.name.split(" ")[1]),t.mouseEntity&&t.mouseEntity.mouseDown()):t.mouseEntity=null},i.onPointerUp=function(){t.mouseEntity&&t.mouseEntity.mouseUp()},i.getEngine().runRenderLoop((function(){t.tick(i.getEngine().getDeltaTime()),Object(f.a)(d.a.mark((function e(){return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:t.me&&(n.position=new y.Vector3(100*t.me.position.x,100*-t.me.position.y-1500*t.zoom*Math.tan(z),-1500*t.zoom),a.position.x=100*t.me.position.x,a.position.y=100*-t.me.position.y),t.renderDistance=Math.min(Math.ceil(2*t.zoom),3);case 2:case"end":return e.stop()}}),e)})))(),i&&i.render()}))}},{key:"unloadUnusedComponents",value:function(){var e=this;this.me&&(this.gameScene.chunks.forEach((function(t){var i=Math.abs(Math.round(e.me.position.x/16)-t.position.x),n=Math.abs(Math.round(e.me.position.y/16)-t.position.y);i>e.renderDistance||n>e.renderDistance?(t.setVisibility(!1),(i>5||n>5)&&e.gameScene.chunks.remove(t.id)):t.setVisibility(!0)})),this.gameScene.entities.forEach((function(t){var i=Math.abs(Math.round(e.me.position.x)-t.position.x)/16,n=Math.abs(Math.round(e.me.position.y)-t.position.y)/16;i>e.renderDistance||n>e.renderDistance?(t.setVisibility(!1),(i>5||n>5)&&e.gameScene.entities.remove(t.id)):t.setVisibilityAttachBabylon(!0,e.babylonScene)})))}},{key:"requestChunks",value:function(){if(this.me)for(var e=-3;e<=3;e++)for(var t=-3;t<=3;t++){var i=Math.round(this.me.position.x/16)+e,n=Math.round(this.me.position.y/16)+t,a=D.getId(i,n);if(!this.gameScene.chunks.includes(a)){this.networkClient.requestChunk(i,n);var s=new D(this.gameScene,i,n);s.attachBabylon(this.babylonScene),this.gameScene.chunks.add(a,s)}}}},{key:"render",value:function(){var e=this;return a.a.createElement(a.a.Fragment,null,!this.state.loggedIn&&a.a.createElement("div",{className:"center"},a.a.createElement("p",null,"P\u0159ihlaste se, nebo si vytvo\u0159te \xfa\u010det:"),a.a.createElement("p",null,a.a.createElement("input",{type:"text",placeholder:"Jm\xe9no",ref:this.loginRef})),a.a.createElement("p",null,a.a.createElement("input",{type:"password",placeholder:"Heslo",ref:this.passwordRef})),a.a.createElement("p",null,a.a.createElement("button",{onClick:function(){return e.networkClient.auth(e.loginRef.current.value,e.passwordRef.current.value)}},"P\u0159ihl\xe1sit se!"))),a.a.createElement(p.a,{antialias:!0,canvasId:"game"},a.a.createElement(p.b,{onSceneMount:function(t){return e.onSceneMount(t)}},a.a.createElement(a.a.Fragment,null))))}}]),i}(a.a.Component),K=function(e){Object(u.a)(i,e);var t=Object(c.a)(i);function i(e){var n;return Object(o.a)(this,i),(n=t.call(this,e)).apiUrl="https://randombot-server.herokuapp.com/",n.state={status:"loading",textures:{loaded:0,of:0}},window.location.host.includes("localhost")&&(n.apiUrl="http://localhost:80/"),n}return Object(h.a)(i,[{key:"componentDidMount",value:function(){var e,t,i=this;this.setState({textures:{loaded:0,of:(e=function(){i.setState({status:"ingame"})},t=function(e,t){i.setState({textures:{loaded:e,of:t}})},0===w.length&&(t&&t(0,w.length),e()),w.forEach((function(i){S[i]=new Image,S[i].onload=function(){j++,t&&t(j,w.length),j===w.length&&e()},S[i].onerror=function(){console.error("Error loading resource file: ",i)},S[i].src=_+i})),w.length)}})}},{key:"render",value:function(){return a.a.createElement(a.a.Fragment,null,"loading"===this.state.status&&a.a.createElement("div",{className:"center"},"Na\u010d\xedt\xe1n\xed textur... (",this.state.textures.loaded,"/",this.state.textures.of,")"),"ingame"===this.state.status&&a.a.createElement(J,{apiUrl:this.apiUrl}))}}]),i}(a.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(a.a.createElement(a.a.StrictMode,null,a.a.createElement(K,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[183,1,2]]]);
//# sourceMappingURL=main.514ff542.chunk.js.map