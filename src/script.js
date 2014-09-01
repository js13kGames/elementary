var APP = (function() {

	var board = document.getElementById('board'),
		score = document.getElementById('score'),
		pool = document.getElementsByTagName('a'),
		game = new Game(10, 10, 3);

	for (var i=0; i<game.width * game.height; i++) {
		board.appendChild(document.createElement('a'));
	}
	
	function render() {
		for (var x=0; x<game.width; x++) {
			for (var y=0; y<game.height; y++) {
				var ball = game.ball(x, y),
					em = pool.item(ball.i);
				if (!ball.h) {
					em.className = 'em c' + ball.c;
					em.style.transform = 'translate(' + (x * 32) + 'px,' + ((game.height - y - 1) * 32) + 'px)';
					em.setAttribute('data-game', JSON.stringify({x:x, y:y}));
				} else {
					em.className = 'em hide c' + ball.c;
				}
			}
		}
		score.innerHTML = game.score;
		if (!game.check(0, 0, 0)) alert('FINISHED!');
	}
	
	board.addEventListener('click', function(e) {
		var data = JSON.parse(e.target.getAttribute('data-game'));
		if (data && game.select(data.x, data.y)) {
			render();
		}
	}, false);

	render();

	return {
		game: game
	};

})();