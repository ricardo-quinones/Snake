;(function (root) {
  var SnakeGame = root.SnakeGame = (root.SnakeGame || {} );

  var View = SnakeGame.View = function ($el) {
    this.$el = $el

    this.board = null;
    this.intervalId = null;
  }

  View.STEP = 150

  View.KEYS = {
    37: "W",
    38: "N",
    39: "E",
    40: "S"
  }

  View.prototype.render = function () {
    // this.$el.html(this.board.render());
    var view = this
    var board = view.board

    var cellMatrix = (function () {
      return _.times(board.dim, function () {
        return _.times(board.dim, function () {
          return $("<div class='cell'></div>");
        });
      });
    })()

    _(board.snake.segments).each(function (seg) {
      cellMatrix[seg[1]][seg[0]].addClass("snake")
    })

    var apple = this.board.apple;

    cellMatrix[apple[0]][apple[1]].addClass("apple");

    this.$el.empty();

    _(cellMatrix).each(function ($cell) {
      view.$el.append($cell);
    });

  };

  View.prototype.step = function () {
    var pos = this.board.snake.nextPos();

    if (this.board.validMove(pos)) {
      this.board.snake.move(pos)
      if (this.board.snakeEatsApple()) {
        console.log("apple was updated!!")
        this.board.updateApple()
      }
      this.render();
    }
    else {
      alert("Game Over.")
      window.clearInterval(this.intervalId)
    }
  };

  View.prototype.handleKeyEvent = function (event) {
    if (event.keyCode in View.KEYS) {
      this.board.snake.turn(View.KEYS[event.keyCode]);
    };
  };

  View.prototype.start = function () {
    var game = this;
    game.board = new SnakeGame.Board(20);
    $(window).on('keydown', game.handleKeyEvent.bind(game));

    game.intervalId = window.setInterval(function () {
      game.step()
    }, View.STEP);
  };
})(this);