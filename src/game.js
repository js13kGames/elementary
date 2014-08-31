function Game(width, height, colors) {
	this.width = width;
	this.height = height;
	this.colors = colors;
	this.board = [];
	this.balls = [];
	var index = 0;
	for (var x=0; x<width; x++) {
		this.board[x] = [];
		for (var y=0; y<height; y++) {
			this.balls[index] = {
				index: index++,
				color: Math.round(Math.random() * (colors-1)),
				hide: false
			};
		}
	}
}

Game.prototype.ball = function(x, y) {
	return this.board[x] && this.board[x][y]
		? this.board[x][y]
		: null;
};

Game.prototype.shuffle = function() {
	var index = 0;
	for (var x=0; x<this.width; x++) {
		for (var y=0; y<this.height; y++) {
			var ball = this.balls[index++];
			ball.color = Math.round(Math.random() * (this.colors-1)) + 1;
			ball.hide = false;
			this.board[x][y] = ball;
		}
	}
};

Game.prototype.remove = function(x, y) {
	var ball = this.ball(x, y),
		res = this.select(x, y, ball.color);
	if (res.length < 2) {
		ball.hide = false;
		return [];
	}
	return res;
};

Game.prototype.select = function(x, y, color) {
	var res = [],
		ball = this.ball(x, y);
	if (ball && !ball.hide && ball.color == color) {
		ball.hide = true;
		res = [ball];
		res = res.concat(this.select(x-1, y, ball.color));
		res = res.concat(this.select(x+1, y, ball.color));
		res = res.concat(this.select(x, y-1, ball.color));
		res = res.concat(this.select(x, y+1, ball.color));
	}
	return res;
};
