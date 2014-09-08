var APP = (function() {

	var container = document.getElementById('container'),
		scores = document.getElementById('scores'),
		values = scores.getElementsByTagName('td'),
		canvas = document.getElementById('sprite'),
		board = document.getElementById('board'),
		score = document.getElementById('score'),
		sound = document.getElementById('sound'),
		timer = document.getElementById('timer'),
		pool = document.getElementsByTagName('img'),
		game = new Game(10, 10, 2),
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
		if (!game.check()) {
			timer.className = '';
			values.item(0).innerHTML = game.score;
			values.item(1).innerHTML = game.time;
			values.item(2).innerHTML = game.bonus;
			values.item(3).innerHTML = game.total();
			scores.className = 'show';
			score.innerHTML = game.total();
		} else {
			timer.className = 'run';
			score.innerHTML = game.score;
		}
	}
	
	function color(r, g, b, a) {
		var grd=ctx.createRadialGradient(50,50,10,45,45,100);
		grd.addColorStop(0,'rgba(' + r + ',' + g + ',' + b + ',' + a + ')');
		r = Math.round(r/2);
		g = Math.round(g/2);
		b = Math.round(b/2);
		grd.addColorStop(1,'rgba(' + r + ',' + g + ',' + b + ',' + a + ')');
		ctx.save();
		ctx.clearRect(0, 0, canvas.width, canvas.height);
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
	
	function back() {
		var grd=ctx.createRadialGradient(50,50,10,45,45,100);
		grd.addColorStop(0,'#eee');
		grd.addColorStop(1,'#ccc');
		ctx.save();
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = grd;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.restore();
		return canvas.toDataURL();
	}
	
	colors.push(color(255,0,0,.9));
	colors.push(color(0,0,255,.9));
	colors.push(color(0,192,0,.9));
	colors.push(color(0,255,255,.9));
	board.style.backgroundImage = 'url(' + back() + ')';
	
	for (var i=0; i<game.width * game.height; i++) {
		var em = new Image();
		board.appendChild(em);
		em.className = 'em hide';
		em.style.transform = 'translate(0px,0px)';
		em.ondragstart = function() { return false; };
	}
	
	board.addEventListener('click', function(e) {
		var data = JSON.parse(e.target.getAttribute('data-game'));
		if (data && game.select(data.x, data.y)) {
			sound.play();
			render();
		}
	}, false);
	
	scores.addEventListener('click', function(e) {
		scores.className = '';
		game = new Game(10, 10, 3);
		render();
	}, false);

	window.onload = render;
	window.onresize = render;

})();