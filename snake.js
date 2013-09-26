;(function (root){
  var SnakeGame = root.SnakeGame = (root.SnakeGame || {} );

  var Snake = SnakeGame.Snake = function(dir, segments) {
    this.dir = dir;
    this.segments = segments;
  }

  Snake.COORDS = {
    "N": [0, -1],
    "S": [0, 1],
    "W": [-1, 0],
    "E": [1, 0]
  };

  Snake.prototype.move = function() {
    var lastSeg = this.segments.pop();
    var firstSeg = this.segments[0];

    lastSeg = [firstSeg[0] + Snake.COORDS[this.dir][0],
      firstSeg[1] + Snake.COORDS[this.dir][1]];
      this.segments.unshift(lastSeg);
  };

  Snake.prototype.turn = function (newDir) {
    this.dir = newDir;
  };

  Snake.newSnake = function(dimX, dimY) {
    var segments = [];
    for (var i = 0; i < 6; i++) {
      segments.push([(dimX / 2 - 3) + i, dimY / 2])
    };
    return new Snake("W", segments);
  }

  var Board = SnakeGame.Board = function(size) {
    this.DIM_X = size;
    this.DIM_Y = size;
    this.snake = Snake.newSnake(this.DIM_X, this.DIM_Y);
    this.apples = [];
    this.string = "";
  }

  Board.prototype.render = function () {
    var that = this;
    var segments = that.snake.segments;
    for (var y = 0; y < that.DIM_Y; y++) {
      for (var x = 0; x < that.DIM_X; x++) {
        var snakeSeg = false
        segments.forEach(function (segment) {
          if (segment[0] === x && segment[1] === y) {
            that.string += "S";
            snakeSeg = true;
          }
        });
        if (snakeSeg === false) {
          that.string += ".";
        }
      }
      that.string += "\n";
    }
    return that.string;
  };




})(this);