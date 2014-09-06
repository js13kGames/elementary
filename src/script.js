var APP = (function() {

	var container = document.getElementById('container'),
		canvas = document.getElementById('sprite'),
		board = document.getElementById('board'),
		score = document.getElementById('score'),
		sound = document.getElementById('sound'),
		pool = document.getElementsByTagName('img'),
		game = new Game(10, 10, 3),
		ctx = canvas.getContext('2d'),
		colors = [];
	
	function render() {
		for (var x=0; x<game.width; x++) {
			for (var y=0; y<game.height; y++) {
				var ball = game.ball(x, y),
					em = pool.item(ball.i);
				if (!ball.h) {
					em.src = colors[ball.c];
					em.className = 'em';
					em.style.transform = 'translate(' + (x * em.width) + 'px,' + ((game.height - y - 1) * em.height) + 'px)';
					em.setAttribute('data-game', JSON.stringify({x:x, y:y}));
				} else {
					em.className = 'em hide';
				}
			}
		}
		score.innerHTML = game.score;
		if (!game.check(0,0)) {
			alert('FINISHED!');
			game = new Game(10, 10, 3);
			render();
		}
	}
	
	function color(r, g, b, a) {
		var grd=ctx.createRadialGradient(50,50,10,45,45,100);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		grd.addColorStop(0,'rgba(' + r + ',' + g + ',' + b + ',' + a + ')');
		r = Math.round(r/2);
		g = Math.round(g/2);
		b = Math.round(b/2);
		grd.addColorStop(1,'rgba(' + r + ',' + g + ',' + b + ',' + a + ')');
		ctx.save();
        ctx.beginPath();
		ctx.arc(64,64,60,0,2*Math.PI);
		ctx.fillStyle = grd;
		ctx.fill();
		ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(64,64,56,0,2*Math.PI);
		ctx.strokeStyle = 'rgba(0,0,0,.5)';
		ctx.stroke();
		ctx.restore();
		return canvas.toDataURL();
	}
	
	colors.push(color(255,0,0,1));
	colors.push(color(0,0,255,1));
	colors.push(color(0,255,0,1));
	colors.push(color(0,255,255,1));
	
	for (var y=0; y<game.height; y++) {
		for (var x=0; x<game.width; x++) {
			var em = new Image();
			em.className = 'em hide';
			em.style.transform = 'translate(' + (x * em.width) + 'px,' + ((game.height - y - 1) * em.height) + 'px)';
			board.appendChild(em);
		}
	}
	
	board.addEventListener('click', function(e) {
		var data = JSON.parse(e.target.getAttribute('data-game'));
		if (data && game.select(data.x, data.y)) {
			sound.play();
			render();
		}
	}, false);

	window.onload = render;
	window.onresize = render;

})();