;(function (root) {
  var SnakeGame = root.SnakeGame = (root.SnakeGame || {} );

  var View = SnakeGame.View = function ($el) {
    this.$el = $el

    this.board = null;
    this.intervalId = null;
    this.points = 0;
    this.pause = false
  }

  View.STEP = 80

  View.KEYS = {
    37: "W",
    38: "N",
    39: "E",
    40: "S"
  }

  View.prototype.gamePause = function () {
    var game = this;
    if (game.pause === false) {
      game.pause = true;
      window.clearInterval(game.intervalId);
      $(".pause").fadeIn("linear").text("\u275A \u275A");
    } else {
      game.pause = false;
      $(".pause").fadeOut("slow");
      window.setTimeout(function () {
        game.intervalId = window.setInterval(function () {
          game.step()
        }, View.STEP)
      }, 500);
    };
  };

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

    cellMatrix[apple[1]][apple[0]].addClass("apple");

    this.$el.empty();

    _(cellMatrix).each(function ($cell) {
      view.$el.append($cell);
    });

    $(".score").text("Score: " + this.points)
  };

  View.prototype.step = function () {
    var pos = this.board.snake.nextPos();
    if (this.board.validMove(pos)) {
      this.board.snake.move(pos)

      if (this.board.snakeEatsApple()) {
        this.board.updateApple()

        this.points += 10
      }
      this.render();
    }
    else {
      alert("Game Over.")
      window.clearInterval(this.intervalId)
    }
  };

  View.prototype.handleKeyEvent = function (event) {
    var newDir = View.KEYS[event.keyCode];
    if (event.keyCode in View.KEYS  && this.board.snake.isNotOppDir(newDir)) {
      this.board.snake.turn(newDir);
    } else if (event.keyCode === 32){
      this.gamePause();
    };
  };

  View.prototype.start = function () {
    var game = this;
    game.board = new SnakeGame.Board(20);
    $(".pause").text("").fadeOut("fast");
    $(window).on('keydown', game.handleKeyEvent.bind(game));

    game.intervalId = window.setInterval(function () {
      game.step()
    }, View.STEP);
  };
})(this);