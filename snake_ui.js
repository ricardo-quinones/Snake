;(function (root) {
  var SnakeGame = root.SnakeGame = (root.SnakeGame || {} );

  var View = SnakeGame.View = function ($el, board) {
    this.$el = $el

    this.board = board;
    this.intervalId = null;
    this.points = 0;
    this.pause = false;
    this.timeoutId = null;
    this.lost = false;
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
    if (game.pause === false && game.lost === false) {
      game.pause = true;
      window.clearTimeout(game.timeoutId)
      window.clearInterval(game.intervalId);
      $(".pause").fadeIn("linear").text("\u275A \u275A");
    } else if (game.lost === false) {
      game.pause = false;
      $(".pause").fadeOut("slow");
      game.timeoutId = window.setTimeout(function () {
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
    });

    var apple = this.board.apple;

    cellMatrix[apple[1]][apple[0]].addClass("apple");

    this.$el.empty();

    _(cellMatrix).each(function ($cell) {
      view.$el.append($cell);
    });

    $(".score").text("Score: " + this.points)
  };

  View.prototype.step = function () {
    var game = this;
    console.log(game.intervalId);
    console.log(game.pause);
    var pos = game.board.snake.nextPos();
    if (game.board.validMove(pos)) {
      game.board.snake.move(pos)

      if (game.board.snakeEatsApple()) {
        game.board.updateApple()

        game.points += 10;
      }
      game.render();
    }
    else {
      game.lost = true;
      window.clearInterval(game.intervalId);
      $(".play-again").toggle();
    };
  };

  View.prototype.handleKeyEvent = function (event) {
    var newDir = View.KEYS[event.keyCode];
    if (event.keyCode in View.KEYS  && this.board.snake.isNotOppDir(newDir)) {
      this.board.snake.turn(newDir);
    } else if (event.keyCode === 32){
      this.gamePause();
    };
  };

  View.prototype.resetBoard = function() {
    this.board = new SnakeGame.Board(20);
  };

  View.prototype.start = function () {
    var game = this;
    game.points = 0;
    $(".pause").text("").fadeOut("fast");
    $(window).on('keydown', game.handleKeyEvent.bind(game));

    game.intervalId = window.setInterval(function () {
      game.step()
    }, View.STEP);
  };
})(this);

$(document).ready(function () {
  var game = new SnakeGame.View($('#grid'), new SnakeGame.Board(20));
  game.render();
  
  $(".start").on("click", function () {
    $(".score").toggle();
    $(".start").toggle();
    game.start();
  })

  $(".yes").on("click", function () {
    $(".play-again").toggle();
    window.clearTimeout(game.timeoutId)
    game = new SnakeGame.View($('#grid'), new SnakeGame.Board(20));
    game.start();
  });

  $(".no").on("click", function () {
    $(".play-again").toggle();
    $(".thanks").toggle();
  });
});