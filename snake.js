;(function (root) {
  var SnakeGame = root.SnakeGame = (root.SnakeGame || {} );

  var Snake = SnakeGame.Snake = function(dir, segments, board) {
    this.dir = dir;
    this.segments = segments;
    this.board = board;

    var that = this;

    this.oppDir = Snake.OPPDIR[this.dir];
  };

  Snake.COORDS = {
    "N": [0, -1],
    "S": [0, 1],
    "W": [-1, 0],
    "E": [1, 0]
  };

  Snake.OPPDIR = {
    "N": "S",
    "S": "N",
    "W": "E",
    "E": "W"
  };

  Snake.prototype.nextPos = function() {
    var firstSeg = this.segments[0];
    var nextPos = [firstSeg[0] + Snake.COORDS[this.dir][0],
      firstSeg[1] + Snake.COORDS[this.dir][1]];

    return nextPos;
  };

  Snake.prototype.move = function(pos) {
    this.segments.unshift(pos);
    if (!this.board.snakeEatsApple()) {
      this.segments.pop()
    };
    this.oppDir = Snake.OPPDIR[this.dir];
  };

  Snake.prototype.turn = function (newDir) {
    if (newDir !== this.oppDir) this.dir = newDir;
  };

  Snake.newSnake = function(dim, board) {
    var segments = [];
    for (var i = 0; i < 3; i++) {
      segments.push([(dim / 2 - 1) + i, dim / 2])
    };
    return new Snake("W", segments, board);
  };

  var Board = SnakeGame.Board = function(size) {
    this.dim = size;
    this.snake = Snake.newSnake(this.dim, this);
    this.apple = this.makeApple();
    this.points = 0;
  };

  Board.prototype.makeApple = function () {
    var board = this;
    var pos = [Math.floor(Math.random() * this.dim),
               Math.floor(Math.random() * this.dim)];

    var segs = this.snake.segments;
    if (_.every(segs, function (el) { return !(_.isEqual(el, pos)); })) {
      return pos;
    }
    else {
      return board.makeApple();
    };
  };

  Board.prototype.updateApple = function() {
    this.apple = this.makeApple();
  };

  Board.prototype.snakeEatsApple = function() {
    var head = this.snake.segments[0];
    var apple = this.apple.slice();

    return (_.isEqual(head, apple));
  };

  Board.prototype.onBoard = function(newPos) {
    var dim = this.dim;
    return (newPos[0] < dim && newPos[0] >= 0 && newPos[1] < dim && newPos[1] >= 0 )
  };

  Board.prototype.validMove = function(move) {
    var segs = _.initial(this.snake.segments);
    var notHit = _.every(segs, function (el) { return !(_.isEqual(el, move)); });

    return notHit && this.onBoard(move);
  };
})(this);