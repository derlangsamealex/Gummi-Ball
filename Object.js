function SvgElement(str,obj) {
  var output=document.createElementNS("http://www.w3.org/2000/svg",str);
  for(let prop in obj) {
    output.setAttribute(prop, obj[prop]);
  }
  return output;
}
function svgChgProp(target,obj) {
  for(let prop in obj) {
    target.setAttribute(prop, obj[prop]);
  }
}
function Surface() {
  this.p=[];
  this.ball;
  this.surface=document.createElement("div");
  this.surface.style.position="absolute";
  this.surface.style.left="0";
  this.surface.style.top="5%";
  this.surface.style.height="95%";
  this.surface.style.width="100%";
  this.surface.style.backgroundColor="black";
  this.surface.style.overflow="hidden";
  document.body.appendChild(this.surface);
  this.svg=SvgElement("svg",{
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%"
  });
  this.surface.appendChild(this.svg);
  this.setPlayer=function(x,y,r,interia) {
    this.p[this.p.length]=new Player(this.svg,x,y,r,interia);
  }
  this.setBall=function(x,y,r,direction,speed) {
    this.ball=new Ball(this.svg,x,y,r,direction,speed);
  }
}
function Player(svg,x,y,r,interia) {
  this.x=x*svg.clientWidth/100;
  this.y=y*svg.clientHeight/100;
  this.r=r*svg.clientHeight/100;
  this.interia=interia;
  this.debug=true;
  this.element=new SvgElement("circle",{
    cx:this.x+"px",
    cy:this.y+"px",
    r:this.r+"px",
    fill:"white"
  });
  svg.appendChild(this.element);
  this.delta=0;
  this.points=0;
  this.touchpos=this.x;
  this.move=function() {
    let delta=this.touchpos-this.x;
    this.speed=delta*this.interia;
    this.x+=this.speed;
    svgChgProp(this.element,{
      cx:this.x+"px"
    });
  }
}
function Ball(svg,x,y,r,direction,speed) {
  this.counter=500;
  this.count=1;
  this.x={cent:x,px:x*svg.clientWidth/100}
  this.y={cent:y,px:y*svg.clientHeight/100}
  this.r=r*svg.clientHeight/100;
  this.rx=this.r*(1.5-this.counter/1000);
  this.ry=this.r*(0.5+this.counter/1000);
  this.element=[];
  this.element[0]=new SvgElement("ellipse",{
    cx:this.x.px+"px",
    cy:this.y.px+"px",
    rx:this.rx+"px",
    ry:this.ry+"px",
    fill:"white"
  });
  svg.appendChild(this.element[0]);
  this.direction=direction;
  this.speed=speed;
  //prooftouchpoints and calculate direction
  this.ptp=function() {
    for(let i=1;i<=16;i++) {
      for(let obj of sf.p) {
        let dx=this.x.px+this.rx*Math.sin(2*Math.PI/16*i)-obj.x;
        let dy=this.y.px+this.ry*Math.cos(2*Math.PI/16*i)-obj.y;
        let hitdirection=calcdirection(this.x.px-obj.x,this.y.px-obj.y);
        if(Math.sqrt(dx*dx+dy*dy)<=obj.r) {
          this.overtan(hitdirection,this.direction)?this.direction=(360+(hitdirection-90)*2-this.direction)%360:this.direction=phbd(this.direction,hitdirection);
          this.speed=this.speed+Math.abs(obj.speed*0.01);
        }
      }
    }
  }
  this.overtan=function(hitdeg,balldeg) {
    if((hitdeg>=270||hitdeg<=90)&&balldeg<=(360+hitdeg-90)%360&&balldeg>=(hitdeg+90)%360) {
      return true;
    }
    if(hitdeg>=90&&hitdeg<=270&&(balldeg<=hitdeg-90||balldeg>=hitdeg+90)) {
      return true;
    }
    return false;
  }
  this.move=function() {
    this.counter===1000?this.count=-1:void(0);
    this.counter===0?this.count=1:void(0);
    this.counter+=this.count;
    this.ptp();
    if(this.y.cent>=99) {
      sf.p[0].points+=1;
      this.speed=0.5;
      this.direction=250;
      this.x.cent=50;
      this.y.cent=50;
      this.x.px=0.5*svg.clientWidth;
      this.y.px=0.5*svg.clientHeight;
      btn1.innerHTML=sf.p[1].points+":"+sf.p[0].points;
    }
    if(this.y.cent<=1) {
      sf.p[1].points+=1;
      this.speed=0.5;
      this.direction=70;
      this.x.cent=50;
      this.y.cent=50;
      this.x.px=0.5*svg.clientWidth;
      this.y.px=0.5*svg.clientHeight;
      btn1.innerHTML=sf.p[1].points+":"+sf.p[0].points;
    }
    if(this.x.px>=svg.clientWidth-this.rx&&(this.direction>=270||this.direction<=90)||this.x.px<=this.rx&&this.direction>=90&&this.direction<=270) {
      this.direction=(540-this.direction)%360;
    }
    this.x.px=this.x.px+Math.cos(this.direction/180*Math.PI)*this.speed;
    this.y.px=this.y.px+Math.sin(this.direction/180*Math.PI)*this.speed;
    this.x.cent=this.x.px*100/svg.clientWidth;
    this.y.cent=this.y.px*100/svg.clientHeight;
    this.rx=this.r*(1.5-this.counter/1000);
    this.ry=this.r*(0.5+this.counter/1000);
    svgChgProp(this.element[0],{
      cx:this.x.px+"px",
      cy:this.y.px+"px",
      rx:this.rx+"px",
      ry:this.ry+"px"
    });
  }
}
function calcdirection(dx,dy) {
  if(dx>0&&dy>=0) {
    return (Math.atan(Math.abs(dy/dx)))*180/Math.PI;
  }
  if(dx<=0&&dy>0) {
    return (Math.PI/2+Math.atan(Math.abs(dx/dy)))*180/Math.PI;
  }
  if(dx<0&&dy<=0) {
    return (Math.PI+Math.atan(Math.abs(dy/dx)))*180/Math.PI;
  }
  if(dx>=0&&dy<0) {
    return (Math.PI*1.5+Math.atan(Math.abs(dx/dy)))*180/Math.PI;
  }
}
//player hit ball direction
function phbd(deg1,deg2) {
  let delta=deg1-deg2;
  Math.abs(delta)>180?delta=360-Math.abs(delta):void(0);
  let output=deg1-delta/2;
  return output;
}