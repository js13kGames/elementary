var APP = (function() {

	var container = document.getElementById('container'),
		menu = document.getElementById('menu'),
		scores = document.getElementById('scores'),
		values = scores.getElementsByTagName('td'),
		canvas = document.getElementById('sprite'),
		board = document.getElementById('board'),
		score = document.getElementById('score'),
		sound = document.getElementById('sound'),
		timer = document.getElementById('timer'),
		pool = document.getElementsByTagName('img'),
		width = 10,
		height = 10,
		game = null,
		ctx = canvas.getContext('2d'),
		colors = [],
		highscore = JSON.parse(localStorage.getItem('scores')) || {
			'score2': 0,
			'score3': 0,
			'score4': 0,
		};
	
	function render() {
		for (var x=0; x<game.width; x++) {
			for (var y=0; y<game.height; y++) {
				var ball = game.ball(x, y),
					em = pool.item(ball.i);
				if (!ball.h) {
					em.src = colors[ball.c];
					em.className = 'em';
					em.style.transform =
					em.style.webkitTransform = 'translate(' + (x * em.width) + 'px,' + ((game.height - y - 1) * em.height) + 'px)';
					em.setAttribute('data-game', JSON.stringify({x:x, y:y}));
				} else {
					em.className = 'em hide';
				}
			}
		}
		if (!game.check()) {
			setScores();
			score.innerHTML = game.total();
			timer.className = '';
			scores.className = 'show';
		} else {
			score.innerHTML = game.score;
			timer.className = 'run';
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
	
	function play() {
		if (sound.readyState) {
			sound.currentTime = 0;
			sound.play();
		}		
	}
	
	function setScores() {
		if (game) {
			var name = 'score' + game.colors,
				total = game.total();
			values.item(0).innerHTML = game.score;
			values.item(1).innerHTML = game.time;
			values.item(2).innerHTML = game.bonus;
			values.item(3).innerHTML = total;
			if (total > highscore[name]) {
				highscore[name] = total;
			}
			localStorage.setItem('scores', JSON.stringify(highscore));
		}
		values.item(4).innerHTML = highscore.score2;
		values.item(5).innerHTML = highscore.score3;
		values.item(6).innerHTML = highscore.score4;
	}
	
	colors.push(color(255,0,0,.9));
	colors.push(color(0,0,255,.9));
	colors.push(color(0,192,0,.9));
	colors.push(color(0,255,255,.9));
	board.style.backgroundImage = 'url(' + back() + ')';
	if (sound.readyState) {
		sound.currentTime = .1;
	}
	
	for (var i=0; i<width * height; i++) {
		var em = new Image();
		board.appendChild(em);
		em.className = 'em hide';
		em.style.transform = 
		em.style.webkitTransform = 'translate(0px,0px)';
		em.ondragstart = function() { return false; };
	}
	
	board.addEventListener('click', function(e) {
		var data = JSON.parse(e.target.getAttribute('data-game'));
		if (data && game.select(data.x, data.y)) {
			render();
			play();
		}
	}, false);
	
	scores.addEventListener('click', function(e) {
		if (this.className == 'show') {
			this.className = '';
			menu.className = 'show';
			play();
		}
	}, false);

	menu.addEventListener('click', function(e) {
		var num = e.target.getAttribute('data-num');
		if (this.className == 'show' && num) {
			this.className = '';
			if (num == '1') {
				scores.className = 'show';
			} else {
				game = new Game(width, height, parseInt(num));
				render();
			}
			play();
		}
	}, false);
	
	setScores();
	
})();