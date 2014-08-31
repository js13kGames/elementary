var APP = (function(game) {

	var board = document.getElementById('board'),
		pool = document.getElementsByTagName('a'),
		balls = game.init();

	for (var x=0; x<balls.length; x++) {
		for (var y=0; y<balls[x].length; y++) {
			var em = document.createElement('a');
			em.className = 'em c' + balls[x][y].c;
			em.style.transform = 'translate(' + (x * 32) + 'px,' + (y * 32) + 'px)';
			em.setAttribute('data-game', JSON.stringify({x:x, y:y}));
			board.appendChild(em);
		}
	}
	
	board.addEventListener('click', function(e) {
		var data = JSON.parse(e.target.getAttribute('data-game'));
		if (data) {
			var res = game.select(data.x, data.y);
			for (var i=0; i<res.length; i++) {
				pool.item(res[i]).className += ' hide';
			}
		}
	}, false);

	
})(exports);