(this.webpackJsonprandomgame=this.webpackJsonprandomgame||[]).push([[0],{405:function(e,t,i){e.exports=i(444)},409:function(e,t,i){},441:function(e,t){},444:function(e,t,i){"use strict";i.r(t);var n=i(37),s=i.n(n),a=i(402),r=i.n(a),o=(i(409),i(97)),h=i(98),u=i(139),c=i(166),l=(i(344),i(38)),d=i(368),y=i(158),f=i(229),m=i.n(f),g=i(342),v=i(230),p=i(231),b=i(110),k={player:{filename:"Character.png",width:57,animations:{default:{start:0,end:0,type:"frame"},walking:{start:0,end:7,type:"loop"},inventory_opening:{start:8,end:11,type:"once"},inventory_open:{start:11,end:11,type:"frame"},inventory_closing:{start:11,end:8,type:"once"},equip:{start:12,end:19,type:"once"},unequip:{start:19,end:12,type:"once"},mine:{start:20,end:22,type:"boomerang"},eat:{start:23,end:51,type:"once"},interact:{start:52,end:56,type:"once"}}},rock_big:{filename:"rock_big.png",width:1,animations:{}},rock_small:{filename:"rock_small.png",width:1,animations:{}},bush:{filename:"bush.png",width:1,animations:{}},tree_big:{filename:"tree_big.png",width:1,animations:{}},tree_small:{filename:"tree_small.png",width:1,animations:{}},grass_water_L:{filename:"grass_water_L.png",width:1,animations:{}},grass_water_R:{filename:"grass_water_R.png",width:1,animations:{}},grass_water_T:{filename:"grass_water_T.png",width:1,animations:{}},grass_water_B:{filename:"grass_water_B.png",width:1,animations:{}},grass_water_TL:{filename:"grass_water_TL.png",width:1,animations:{}},grass_water_RB:{filename:"grass_water_RB.png",width:1,animations:{}},grass_water_TR:{filename:"grass_water_TR.png",width:1,animations:{}},grass_water_BL:{filename:"grass_water_BL.png",width:1,animations:{}},grass_water_TBL:{filename:"grass_water_TBL.png",width:1,animations:{}},grass_water_TRL:{filename:"grass_water_TRL.png",width:1,animations:{}},grass_water_RBL:{filename:"grass_water_RBL.png",width:1,animations:{}},grass_water_TRB:{filename:"grass_water_TRB.png",width:1,animations:{}},grass_water_TRBL:{filename:"grass_water_TRBL.png",width:1,animations:{}},grass_water_corner_BL:{filename:"grass_water_corner_BL.png",width:1,animations:{}},grass_water_corner_BR:{filename:"grass_water_corner_BR.png",width:1,animations:{}},grass_water_corner_TL:{filename:"grass_water_corner_TL.png",width:1,animations:{}},grass_water_corner_TR:{filename:"grass_water_corner_TR.png",width:1,animations:{}}},w=Object.values(k).map((function(e){return e.filename}));w=w.filter((function(e,t){return w.indexOf(e)===t}));var x={},_=0,S="/randomgame/resources/textures/";function T(e,t){var i=new l.q("mat",t);return i.emissiveTexture=e,i.opacityTexture=e,i}function B(e){return k[e]?x[k[e].filename]:(console.warn("Image "+e+" not found!"),null)}var O=function(){function e(t){Object(o.a)(this,e),this.gameScene=t,this.babylonScene=null,this.mesh=null,this.position=l.t.Zero()}return Object(h.a)(e,[{key:"attachBabylon",value:function(e){return this.babylonScene=e,this}},{key:"detachBabylon",value:function(){return this.babylonScene&&this.mesh&&(this.babylonScene.removeMesh(this.mesh,!0),this.babylonScene=null),this}},{key:"tick",value:function(e){}},{key:"setVisibility",value:function(e){this.mesh&&this.mesh.setEnabled(e)}}]),e}(),j=function(){function e(t,i){var n=this,s=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"default";Object(o.a)(this,e),this.scene=i,this.textureAtlas=void 0,this.texture=void 0,this.animationQueue=[],this.frame=0,this.direction=1,this.interval=void 0,this.textureScale=1,this.textureAtlas=t,this.textureScale=1/k[t].width;var a=new l.r(S+k[t].filename,i,!1,!0,l.r.NEAREST_NEAREST);a.uOffset=this.textureScale*k[t].animations[s].start,a.vOffset=0,a.uScale=this.textureScale,a.vScale=1,a.hasAlpha=!0,this.texture=a,this.queue(s),this.interval=setInterval((function(){return n.tick()}),80)}return Object(h.a)(e,[{key:"getTexture",value:function(){return this.texture}},{key:"isLast",value:function(e){return this.animationQueue[this.animationQueue.length-1].texture===e}},{key:"queueOnce",value:function(e,t){this.isLast(e)||this.queue(e,t)}},{key:"queue",value:function(e,t){if(!Object.keys(k[this.textureAtlas].animations).includes(e))return console.warn("Animation does not exist"),void this.animationQueue.push({texture:"default",skippable:!0});this.animationQueue.length>1&&this.animationQueue[this.animationQueue.length-1].skippable?this.animationQueue[this.animationQueue.length-1]={texture:e,skippable:!t}:this.animationQueue.push({texture:e,skippable:!t})}},{key:"tick",value:function(){if(this.texture){this.frame+=this.direction;var e=k[this.textureAtlas].animations[this.animationQueue[0].texture],t=Math.abs(e.start-e.end),i=this.animationQueue.length>1;if(this.frame>t)switch(e.type){case"loop":this.direction=1,this.frame=0,i&&this.animationQueue.shift();break;case"once":this.direction=1,i?(this.frame=0,this.animationQueue.shift()):this.frame=t;break;case"boomerang":this.direction=-1,this.frame-=2;break;case"frame":this.direction=1,this.frame=0,i&&this.animationQueue.shift()}this.frame<0&&(this.direction=1,i?(this.frame=0,this.animationQueue.shift()):this.frame=0);var n=k[this.textureAtlas].animations[this.animationQueue[0].texture],s=n.start>n.end?-1:1;this.texture.uOffset=(this.frame*s+n.start)*this.textureScale}else console.error("Texture is null")}},{key:"detach",value:function(){this.scene.removeTexture(this.texture)}}]),e}(),M=function(e){Object(u.a)(i,e);var t=Object(c.a)(i);function i(e,n){var s;return Object(o.a)(this,i),(s=t.call(this,e)).id=n,s.velocityX=0,s.velocityY=0,s.targetX=0,s.targetY=0,s.finalVelocityX=0,s.finalVelocityY=0,s.targetTime=-1,s.keyBindings={up:0,down:0,left:0,right:0},s.keysPressed=[],s.texture=void 0,s.titleTexture=void 0,s}return Object(h.a)(i,[{key:"serialize",value:function(){return{x:this.position.x,y:this.position.y,velocityX:this.velocityX,velocityY:this.velocityY}}},{key:"deserialize",value:function(e,t){t?(this.targetX=e.x,this.targetY=e.y,this.finalVelocityX=e.velocityX,this.finalVelocityY=e.velocityY,this.targetTime=50,this.velocityX=(e.x-this.position.x)/50,this.velocityY=(e.y-this.position.y)/50):(this.position.x=e.x,this.position.y=e.y,this.velocityX=e.velocityX,this.velocityY=e.velocityY)}},{key:"tick",value:function(e){if(this.targetTime>0)return this.position.x+=this.velocityX*e,this.position.y+=this.velocityY*e,this.targetTime-=e,this.targetTime<=0&&(this.position.x=this.targetX,this.position.y=this.targetY,this.velocityX=this.finalVelocityX,this.velocityY=this.finalVelocityY),void this.updateMesh();if(!this.keyBindings.up&&!this.keyBindings.down&&!this.keyBindings.left&&!this.keyBindings.right)return this.position.x+=this.velocityX,this.position.y+=this.velocityY,void this.updateMesh();var t=.1*e,i=!1,n=!1,s=Math.sqrt(2);(this.keysPressed.includes(this.keyBindings.left)||this.keysPressed.includes(this.keyBindings.right))&&(i=!0),(this.keysPressed.includes(this.keyBindings.up)||this.keysPressed.includes(this.keyBindings.down))&&(n=!0),this.keysPressed.includes(this.keyBindings.left)&&(this.velocityX-=.2*t/(n?s:1)),this.keysPressed.includes(this.keyBindings.right)&&(this.velocityX+=.2*t/(n?s:1)),this.keysPressed.includes(this.keyBindings.up)&&(this.velocityY-=.2*t/(i?s:1)),this.keysPressed.includes(this.keyBindings.down)&&(this.velocityY+=.2*t/(i?s:1)),this.position.x+=this.velocityX*t,this.position.y+=this.velocityY*t,this.velocityX*=Math.pow(.95,t),this.velocityY*=Math.pow(.95,t),Math.abs(this.velocityX)<.1&&(this.velocityX=0),Math.abs(this.velocityY)<.1&&(this.velocityY=0),this.updateMesh()}},{key:"keyDown",value:function(e){this.keysPressed.includes(e)||this.keysPressed.push(e)}},{key:"keyUp",value:function(e){this.keysPressed.includes(e)&&(this.keysPressed=this.keysPressed.filter((function(t){return t!==e})))}},{key:"bindKeys",value:function(e){this.keyBindings=Object(v.a)(Object(v.a)({},this.keyBindings),e)}},{key:"attachBabylon",value:function(e){if(Object(p.a)(Object(b.a)(i.prototype),"attachBabylon",this).call(this,e),!this.babylonScene)return this;this.mesh=l.j.CreatePlane("player",{width:100,height:200,sideOrientation:l.i.FRONTSIDE},this.babylonScene),this.texture=new j("player",this.babylonScene,"default"),this.mesh.material=T(this.texture.getTexture(),this.babylonScene);var t=l.j.CreatePlane("title",{width:200,height:40,sideOrientation:l.i.FRONTSIDE},this.babylonScene);t.position=new l.u(0,110,-3);var n=new l.f("titleTexture",{width:200,height:40},this.babylonScene,!0,l.r.LINEAR_LINEAR);this.titleTexture=n;var s=n.getContext();return s.fillStyle="#343434AA",s.fillRect(0,0,n.getSize().width,n.getSize().height),s.font="32px pixel",s.textBaseline="middle",s.textAlign="center",s.fillStyle="#FFFFFF",s.fillText(this.id,n.getSize().width/2,n.getSize().height/2),n.update(),t.parent=this.mesh,t.material=T(n,this.babylonScene),this.updateMesh(),this}},{key:"updateMesh",value:function(){var e=Object(g.a)(m.a.mark((function e(){return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(this.mesh){e.next=2;break}return e.abrupt("return");case 2:this.mesh.position=new l.u(this.position.x,-this.position.y,-1),1,Math.abs(this.velocityX)>1||Math.abs(this.velocityY)>1?this.texture.queueOnce("walking"):this.texture.queueOnce("default");case 5:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"detachBabylon",value:function(){if(this.texture.detach(),this.babylonScene&&this.mesh){var e=this.mesh.getChildMeshes()[0];this.mesh.material&&this.babylonScene.removeMaterial(this.mesh.material),this.titleTexture&&e&&e.material&&(this.babylonScene.removeTexture(this.titleTexture),this.babylonScene.removeMaterial(e.material))}return Object(p.a)(Object(b.a)(i.prototype),"detachBabylon",this).call(this)}}]),i}(O),E=function(e){Object(u.a)(i,e);var t=Object(c.a)(i);function i(e,n,s){var a;return Object(o.a)(this,i),(a=t.call(this,e)).ground=[[]],a.texture=void 0,a.position=new l.t(n,s),a}return Object(h.a)(i,[{key:"serialize",value:function(){return{x:this.position.x,y:this.position.y,ground:this.ground}}},{key:"deserialize",value:function(e){this.position.x=e.x,this.position.y=e.y,this.ground=e.ground,this.updateMesh()}},{key:"attachBabylon",value:function(e){if(Object(p.a)(Object(b.a)(i.prototype),"attachBabylon",this).call(this,e),this.babylonScene){this.mesh=l.j.CreatePlane("chunk",{width:1600,height:1600,sideOrientation:l.i.FRONTSIDE},this.babylonScene);var t=new l.f("chunkTexture",{width:256,height:256},this.babylonScene,!0,l.r.NEAREST_NEAREST);this.texture=t;var n=new l.q("mat",this.babylonScene);n.emissiveTexture=t,this.mesh.material=n,this.updateMesh()}return this}},{key:"updateMesh",value:function(){var e=Object(g.a)(m.a.mark((function e(){var t,n,s;return m.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(this.mesh&&this.babylonScene){e.next=2;break}return e.abrupt("return");case 2:for(this.mesh.position=new l.u(16*this.position.x*100,16*-this.position.y*100,0),t=this.texture.getContext(),n=0;n<16;n++)for(s=0;s<16;s++)this.ground[n]&&this.ground[n][s]&&(t.fillStyle=i.getTerrainColor(this.ground[n][s]),t.fillRect(16*n,16*s,16,16),2===this.ground[n][s]&&this.drawTransition(t,n,s,1,"grass_water"));this.texture.update();case 6:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"drawTransition",value:function(e,t,i,n,s){var a=this,r=16*this.position.x+t-8,o=16*this.position.y+i-8,h="";if(this.gameScene.getTile(r,o-1)===n&&(h+="T"),this.gameScene.getTile(r+1,o)===n&&(h+="R"),this.gameScene.getTile(r,o+1)===n&&(h+="B"),this.gameScene.getTile(r-1,o)===n&&(h+="L"),"TB"===h){var u=B(s+"_T");u&&e.drawImage(u,16*t,16*i);var c=B(s+"_B");c&&e.drawImage(c,16*t,16*i)}else if("RL"===h){var l=B(s+"_R");l&&e.drawImage(l,16*t,16*i);var d=B(s+"_L");d&&e.drawImage(d,16*t,16*i)}else if(h.length>0){var y=B(s+"_"+h);y&&e.drawImage(y,16*t,16*i)}var f=function(u,c,l,d){if(a.gameScene.getTile(r+u,o+c)===n&&!l.reduce((function(e,t){return e||h.includes(t)}),!1)){var y=B(s+"_corner_"+d);y&&e.drawImage(y,16*t,16*i)}};f(-1,-1,["L","T"],"BR"),f(1,-1,["R","T"],"BL"),f(-1,1,["L","B"],"TR"),f(1,1,["R","B"],"TL")}},{key:"detachBabylon",value:function(){return this.babylonScene&&this.mesh&&this.texture&&(this.babylonScene.removeTexture(this.texture),this.mesh.material&&this.babylonScene.removeMaterial(this.mesh.material)),Object(p.a)(Object(b.a)(i.prototype),"detachBabylon",this).call(this)}},{key:"id",get:function(){return i.getId(this.position.x,this.position.y)}}],[{key:"getId",value:function(e,t){return e.toString()+"x"+t.toString()}},{key:"getTerrainColor",value:function(e){switch(e){case 1:return"#67943F";case 2:return"#2EB0E5";case 3:return"#6AA981";case 4:return"#FDDC86"}return"#DDDDDD"}}]),i}(O),R=function(){function e(){Object(o.a)(this,e),this.players=new L,this.chunks=new L}return Object(h.a)(e,[{key:"tickAll",value:function(e){this.players.forEach((function(t){return t.tick(e)})),this.chunks.forEach((function(t){return t.tick(e)}))}},{key:"getTile",value:function(e,t){var i=Math.floor(e)+8,n=Math.floor(t)+8,s=Math.floor(i/16),a=Math.floor(n/16),r=this.chunks.get(E.getId(s,a));return r&&r.ground[i-16*s]&&r.ground[i-16*s][n-16*a]?r.ground[i-16*s][n-16*a]:-1}}]),e}(),L=function(){function e(){Object(o.a)(this,e),this.values={}}return Object(h.a)(e,[{key:"addMore",value:function(e){this.values=Object(v.a)(Object(v.a)({},this.values),e)}},{key:"add",value:function(e,t){this.values[e]=t}},{key:"remove",value:function(e){this.includes(e)&&(this.values[e].detachBabylon(),delete this.values[e])}},{key:"update",value:function(e,t,i){this.values[e].deserialize(t,i)}},{key:"updateOrCreate",value:function(e,t,i,n){this.includes(e)||(this.values[e]=i()),this.values[e].deserialize(t,n)}},{key:"get",value:function(e){return this.includes(e)?this.values[e]:null}},{key:"includes",value:function(e){return Object.keys(this.values).includes(e)}},{key:"forEach",value:function(e){var t=this;Object.keys(this.values).forEach((function(i,n){e(t.values[i],i,n)}))}},{key:"filter",value:function(t){var i=this,n=Object.keys(this.values),s=new e;return n.forEach((function(e,n){t(i.values[e],e,n)&&s.add(e,i.values[e])})),s}}]),e}(),C={left:65,right:68,up:87,down:83},I=i(404),z=i.n(I),Y=function(){function e(t,i,n){Object(o.a)(this,e),this.apiUrl=t,this.scene=i,this.getBabylonScene=n,this.socket=void 0,this.userId=void 0,this.opened=void 0,this.callbacks={authenticated:function(){},updated:function(){}}}return Object(h.a)(e,[{key:"on",value:function(e,t){this.callbacks[e]=t}},{key:"close",value:function(){this.socket.disconnect()}},{key:"open",value:function(){var e=this;this.opened=!0,this.socket=z()(this.apiUrl),this.setListeners(),this.socket.on("id",(function(t){e.userId=t,e.callbacks.authenticated({id:t}),console.log("Joined game with player ID: ",t)}))}},{key:"sendPlayerUpdate",value:function(e){this.socket.emit("update",{id:e.id,content:e.serialize()})}},{key:"requestChunk",value:function(e,t){this.socket.emit("mapRequest",{x:e,y:t})}},{key:"setListeners",value:function(){var e=this;this.socket.on("players",(function(t){e.scene.players.forEach((function(i,n){Object.keys(t).includes(n)?e.scene.players.get(n).setVisibility(!0):e.scene.players.get(n).setVisibility(!1)})),Object.keys(t).forEach((function(i){i!==e.userId&&e.scene.players.updateOrCreate(i,t[i],(function(){return new M(e.scene,i).attachBabylon(e.getBabylonScene())}))}))})),this.socket.on("mapChunk",(function(t){var i=E.getId(t.x,t.y);e.scene.chunks.updateOrCreate(i,t,(function(){return new E(e.scene,t.x,t.y).attachBabylon(e.getBabylonScene())})),e.scene.chunks.filter((function(e){return Math.abs(e.position.x-t.x)<=1&&Math.abs(e.position.y-t.y)<=1})).forEach((function(e){return e.updateMesh()}))}))}}]),e}();var A=function(e){Object(u.a)(i,e);var t=Object(c.a)(i);function i(e){var n;return Object(o.a)(this,i),(n=t.call(this,e)).gameScene=void 0,n.me=null,n.babylonScene=void 0,n.guiTexture=void 0,n.networkClient=void 0,n.state={},n.timer=void 0,n.zoom=1,n.gameScene=new R,n.networkClient=new Y(n.props.apiUrl,n.gameScene,(function(){return n.babylonScene})),n.networkClient.on("authenticated",(function(e){return n.initGame(e.id)})),document.addEventListener("keydown",(function(e){n.me&&n.me.keyDown(e.keyCode)})),document.addEventListener("keyup",(function(e){n.me&&n.me.keyUp(e.keyCode)})),document.addEventListener("wheel",(function(e){e.preventDefault(),n.zoom+=.03*e.deltaY,n.zoom<.5&&(n.zoom=.5),n.zoom>3&&(n.zoom=3)})),window.addEventListener("resize",(function(e){n.resize()})),n}return Object(h.a)(i,[{key:"componentDidMount",value:function(){this.resize(),this.networkClient.open()}},{key:"componentWillUnmount",value:function(){clearInterval(this.timer),this.networkClient.close()}},{key:"initGame",value:function(e){var t=this;this.me=new M(this.gameScene,e),this.me.attachBabylon(this.babylonScene),this.me.bindKeys(C),this.gameScene.players.add(e,this.me),window.player=this.me,window.scene=this.gameScene,this.timer=setInterval((function(){t.me&&t.networkClient.sendPlayerUpdate(t.me)}),100)}},{key:"tick",value:function(e){var t=this;if(this.gameScene.players.forEach((function(t){return t.tick(e)})),this.gameScene.chunks.forEach((function(e){t.me&&(Math.abs(Math.round(t.me.position.x/1600)-e.position.x)>3||Math.abs(Math.round(t.me.position.y/1600)-e.position.y)>3)?(e.setVisibility(!1),t.me&&(Math.abs(Math.round(t.me.position.x/1600)-e.position.x)>5||Math.abs(Math.round(t.me.position.y/1600)-e.position.y)>5)&&t.gameScene.chunks.remove(e.id)):e.setVisibility(!0)})),this.me&&this.guiTexture){for(var i=-3;i<=3;i++)for(var n=-3;n<=3;n++){var s=Math.round(this.me.position.x/1600)+i,a=Math.round(this.me.position.y/1600)+n,r=E.getId(s,a);this.gameScene.chunks.includes(r)||(this.networkClient.requestChunk(s,a),this.gameScene.chunks.add(r,new E(this.gameScene,s,a).attachBabylon(this.babylonScene)))}var o=this.guiTexture.getContext(),h=this.guiTexture.getSize().width,u=this.guiTexture.getSize().height;o.clearRect(0,0,h,u),function(e,t,i){var n=e.getContext(),s=e.getSize().width-30-64;n.fillStyle="#000000",n.fillRect(s-64-3,17,136,136);for(var a=-32;a<=32;a++)for(var r=-32;r<=32;r++)n.fillStyle=E.getTerrainColor(t.getTile(i.position.x/100+a,i.position.y/100+r)),n.fillRect(s+2*a,84+2*r,2,2);n.fillStyle="#000000",n.font="15px Arial",n.textBaseline="top",n.textAlign="center",n.fillText(i?Math.round(i.position.x/100)+" \xd7 "+Math.round(i.position.y/100):"Not connected...",s,161),n.fillStyle="#00000020",n.fillRect(s-6,84,14,2),n.fillRect(s,78,2,14),e.update()}(this.guiTexture,this.gameScene,this.me),this.guiTexture.update()}}},{key:"resize",value:function(){var e=document.getElementById("game");e&&(e.width=window.innerWidth,e.height=window.innerHeight)}},{key:"onSceneMount",value:function(e){var t=this,i=e.scene;this.babylonScene=i;var n=new l.s("Camera",new l.u(0,0,1500),i);n.rotation=new l.u(0,0,0),this.guiTexture=y.a.CreateFullscreenUI("GUI",!0,i),i.getEngine().runRenderLoop((function(){t.tick(i.getEngine().getDeltaTime()),t.me&&(n.position=new l.u(t.me.position.x,-t.me.position.y,-1500*t.zoom)),i&&i.render()}))}},{key:"render",value:function(){var e=this;return s.a.createElement(s.a.Fragment,null,s.a.createElement(d.a,{antialias:!0,canvasId:"game"},s.a.createElement(d.b,{onSceneMount:function(t){return e.onSceneMount(t)}},s.a.createElement(s.a.Fragment,null))))}}]),i}(s.a.Component),X=function(e){Object(u.a)(i,e);var t=Object(c.a)(i);function i(){var e;Object(o.a)(this,i);for(var n=arguments.length,s=new Array(n),a=0;a<n;a++)s[a]=arguments[a];return(e=t.call.apply(t,[this].concat(s))).apiUrl="https://randombot-server.herokuapp.com/",e.state={status:"loading",textures:{loaded:0,of:0}},e}return Object(h.a)(i,[{key:"componentDidMount",value:function(){var e,t,i=this;this.setState({textures:{loaded:0,of:(e=function(){i.setState({status:"ingame"})},t=function(e,t){i.setState({textures:{loaded:e,of:t}})},0===w.length&&(t&&t(0,w.length),e()),w.forEach((function(i){x[i]=new Image,x[i].onload=function(){_++,t&&t(_,w.length),_===w.length&&e()},x[i].onerror=function(){console.error("Error loading resource file: ",i)},x[i].src=S+i})),w.length)}})}},{key:"render",value:function(){return s.a.createElement(s.a.Fragment,null,"loading"===this.state.status&&s.a.createElement("div",{style:{textAlign:"center"}},"Textures are loading (",this.state.textures.loaded,"/",this.state.textures.of,")"),"ingame"===this.state.status&&s.a.createElement(A,{apiUrl:this.apiUrl}))}}]),i}(s.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(s.a.createElement(s.a.StrictMode,null,s.a.createElement(X,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[405,1,2]]]);
//# sourceMappingURL=main.000027fc.chunk.js.map