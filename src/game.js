exports = (function() {
	
	var width = 10,
		height = 10,
		colors = 4,
		board = [];

	function init() {
		var i = 0;
		for (var x=0; x<width; x++) {
			board[x] = [];
			for (var y=0; y<height; y++) {
				board[x][y] = {
					c: Math.round(Math.random() * (colors-1)),
					h: false, 
					i: i++
				};
			}
		}
		return shuffle();
	}
	
	function shuffle() {
		for (var x=0; x<width; x++) {
			for (var y=0; y<height; y++) {
				board[x][y].c = Math.round(Math.random() * (colors-1)) + 1;
				board[x][y].h = false;
			}
		}
		return board;
	}
	
	function select(x, y, c) {
		var res = [],
			ball = board[x] && board[x][y] ? board[x][y] : false;
		if (ball && !ball.h && (!c || ball.c == c)) {
			ball.h = true;
			res = [ball.i];
			res = res.concat(select(x-1, y, ball.c));
			res = res.concat(select(x+1, y, ball.c));
			res = res.concat(select(x, y-1, ball.c));
			res = res.concat(select(x, y+1, ball.c));
			if (!c && res.length < 2) {
				ball.h = false;
				res = [];
			}
		}
		return res;
	}
	
	return {
		init: init,
		select: select,
		shuffle: shuffle
	};
	
})();