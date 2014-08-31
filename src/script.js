var APP = (function() {

	var board = document.getElementById('board'),
		pool = document.getElementsByTagName('a'),
		game = new Game(10, 10, 4);

	game.shuffle();
	for (var x=0; x<game.width; x++) {
		for (var y=0; y<game.height; y++) {
			var em = document.createElement('a');
			em.className = 'em c' + game.ball(x, y).color;
			em.style.transform = 'translate(' + (x * 32) + 'px,' + (y * 32) + 'px)';
			em.setAttribute('data-game', JSON.stringify({x:x, y:y}));
			board.appendChild(em);
		}
	}
	
	board.addEventListener('click', function(e) {
		var data = JSON.parse(e.target.getAttribute('data-game'));
		if (data) {
			var res = game.remove(data.x, data.y);
			res.forEach(function(ball) {
				pool.item(ball.index).className += ' hide';
			});
		}
	}, false);

})();