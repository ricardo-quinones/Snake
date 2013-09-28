;(function (root) {
  var SnakeGame = root.SnakeGame = (root.SnakeGame || {} );

  var Snake = SnakeGame.Snake = function(dir, segments, board) {
    this.dir = dir;
    this.segments = segments;
    this.board = board;
  }

  Snake.COORDS = {
    "N": [0, -1],
    "S": [0, 1],
    "W": [-1, 0],
    "E": [1, 0]
  };

  Snake.prototype.nextPos = function() {
    var firstSeg = this.segments[0];
    nextPos = [firstSeg[0] + Snake.COORDS[this.dir][0],
      firstSeg[1] + Snake.COORDS[this.dir][1]];

    return nextPos;
  };

  Snake.prototype.move = function(pos) {
    this.segments.unshift(pos);
    if (!this.board.snakeEatsApple()) {
      this.segments.pop()
    };
  };

  Snake.prototype.isNotOppDir = function(newDir) {
    thisVecDir = Snake.COORDS[this.dir];
    newVecDir = Snake.COORDS[newDir];
    return !(thisVecDir[0] === newVecDir[0] * -1 && thisVecDir[1] === newVecDir[1] * -1);
  };

  Snake.prototype.turn = function (newDir) {
    this.dir = newDir;
  };

  Snake.newSnake = function(dim, board) {
    var segments = [];
    for (var i = 0; i < 3; i++) {
      segments.push([(dim / 2 - 1) + i, dim / 2])
    };
    return new Snake("W", segments, board);
  }

  var Board = SnakeGame.Board = function(size) {
    this.dim = size;
    this.snake = Snake.newSnake(this.dim, this);
    this.apple = this.makeApple();
    this.points = 0;
  }

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
    }
  };

  Board.prototype.updateApple = function() {
    this.apple = this.makeApple()
  };

  Board.prototype.snakeEatsApple = function() {
    var head = this.snake.segments[0];
    var apple = this.apple.slice()

    return (_.isEqual(head, apple));
  };

  Board.prototype.validMove = function(move) {
    var segs = _.initial(this.snake.segments);
    var notHit = _.every(segs, function (el) { return !(_.isEqual(el, move)); });

    var head = _.first(segs);
    var dim = this.dim;
    var onBoard = (head[0] < dim && head[0] >= 0 && head[1] < dim && head[1] >= 0 )

    return notHit && onBoard
  };

  Board.prototype.render = function () {
    var string = "";
    var that = this;
    var segments = that.snake.segments;
    for (var y = 0; y < that.dim; y++) {
      for (var x = 0; x < that.dim; x++) {
        var snakeSeg = false
        var arr = [x, y]
        segments.forEach(function (segment) {
          if (_.isEqual(segment, arr)) {
            string += "S";
            snakeSeg = true;
          }
        });
        if (snakeSeg === false) {
          string += ".";
        }
      }
      string += "\n";
    }
    return string;
  };
})(this);