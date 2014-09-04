function Game(width, height, colors) {
	this.score = 0;
	this.width = width;
	this.height = height;
	this.colors = colors;
	this.board = [];
	for (var i=0; i<width * height; i++) {
		this.board[i] = {
			i: i,
			c: Math.round(Math.random() * (this.colors-1)),
			h: false
		};
	}
}

Game.prototype.ball = function(x, y, data) {
	if (
		x >= 0 && x < this.width &&
		y >= 0 && y < this.height
	) {
		var i = y * this.width + x;
		if (data) {
			this.board[i] = data;
		} else {
			return this.board[i];
		}
	}
	return null;
};

Game.prototype.remove = function(x, y, c, s) {
	var ball = this.ball(x, y);
	if (ball && !ball.h && ball.c == c) {
		ball.h = true;
		this.score += ++s;
		this.remove(x-1, y, c, s);
		this.remove(x+1, y, c, s);
		this.remove(x, y-1, c, s);
		this.remove(x, y+1, c, s);
		return s;
	}
	return s;
};

Game.prototype.down = function() {
	for (var x=0; x<this.width; x++) {
		var y = 0,
			ball = this.ball(x, y);
		for (var i=1; i<this.height; i++) {
			if (ball.h) {
				var next = this.ball(x, i);
				if (!next.h) {
					this.ball(x, y, next);
					this.ball(x, i, ball);
					ball = this.ball(x, ++y);
				}
			} else {
				ball = this.ball(x, ++y);
			}
		}
	}
};

Game.prototype.left = function() {
	var x=0,
		ball = this.ball(x, 0);
	for (var i=1; i<this.width; i++) {
		var next = this.ball(i, 0);
		if (ball.h) {
			if (!next.h) {
				for (var y=0; y<this.height; y++) {
					next = this.ball(i, y);
					this.ball(i, y, this.ball(x, y));
					this.ball(x, y, next);
				}
				ball = this.ball(++x, 0);
			}
		} else {
			ball = this.ball(++x, 0);
		}
	}
};

Game.prototype.select = function(x, y) {
	var ball = this.ball(x, y),
		s = 0;
	if (ball && !ball.h) {
		ball.h = true;
		s = this.remove(x-1, y, ball.c, s);
		s = this.remove(x+1, y, ball.c, s);
		s = this.remove(x, y-1, ball.c, s);
		s = this.remove(x, y+1, ball.c, s);
		if (s > 0) {
			this.score += ++s;
			this.down();
			this.left();
		} else {
			ball.h = false;
		}
	}
	return s;
};

Game.prototype.check = function(x, y, c) {
	var ball = this.ball(x, y);
	if (ball && !ball.h) {
		return ball.c === c ||
			this.check(x+1, y, ball.c) ||
			this.check(x, y+1, ball.c);
	}
	return false;
};
