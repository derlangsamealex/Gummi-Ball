var sf,t,mousedown;
window.onload = function() {
  sf=new Surface();
  sf.setBall(40,50,4,70,0.5);
  sf.setPlayer(50,92,6,0.5);
  sf.setPlayer(50,8,6,0.05);
  p1touch.ontouchmove = function(evt) {
    sf.p[0].touchpos=(evt.touches[0].clientX-p1touch.getBoundingClientRect().x);
  };
  p1touch.ontouchstart = function(evt) {
    sf.p[0].touchpos=(evt.touches[0].clientX-p1touch.getBoundingClientRect().x);
  };
  p1touch.ontouchend = function(evt) {
    sf.p[0].touchpos=sf.p[0].x;
  };
  p1touch.onmousedown = function(evt) {
    mousedown = true;
  };
  p1touch.onmouseup = function(evt) {
    mousedown = false;
  };
  p1touch.onmousemove =	function(evt) {
    mousedown ? sf.p[0].touchpos=evt.clientX-p1touch.getBoundingClientRect().x : null;
  }
};
function startinterval() {
    t=setInterval(game,5);
}
function game() {
    sf.ball.move();
    sf.p[0].move();
    sf.p[1].move();
    sf.p[1].touchpos=sf.ball.x.px;
}