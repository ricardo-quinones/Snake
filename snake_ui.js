;(function (root) {
  var SnakeGame = root.SnakeGame = (root.SnakeGame || {} );

  var View = SnakeGame.View = function ($el, board) {
    this.$el = $el

    this.board = board;
    this.currentView = null;
    this.intervalId = null;
    this.points = 0;
    this.pause = false;
    this.timeoutId = null;
    this.lost = false;
  };

  View.STEP = 80;

  View.KEYS = {
    37: "W",
    38: "N",
    39: "E",
    40: "S"
  };

  View.HIGHSCORES = [];

  View.prototype.gamePause = function () {
    var game = this;
    if (!game.pause && !game.lost) {
      game.pause = true;

      window.clearInterval(game.intervalId);

      $(".pause").fadeIn("slow");
    }
    else if (!game.lost) {
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

    $('.cell').remove();
    $('.snake').remove();

    _(cellMatrix).each(function ($cell) {
      view.$el.append($cell);
    });

    $(".score").text("Score: " + this.points)
  };

  View.prototype.step = function () {
    var game = this;

    if (!game.timeoutId) window.clearTimeout(game.timeoutId);

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

      if (View.HIGHSCORES.length < 5 || game.points > _.last(View.HIGHSCORES)[1]) {
        $(".high-scores-block").toggle();
        $(".submit-initials").toggle();
        $("#input-initials").focus()

        game.submitInitials();
      }
      else {
        $(".play-again").toggle();
      }
    };
  };

  View.prototype.submitInitials = function () {
    var game = this;

    $('#input-initials').keypress(function (e) {
      if (e.which === 13) {
        var initials = $(this).val()

        game.updateHighScores(initials);
        $(this).val('');
        $(this).parent().append($(this).clone());
        $(this).remove();
      };
    });
  };

  View.prototype.updateHighScores = function (initials) {
    View.HIGHSCORES.push([initials, this.points])
    View.HIGHSCORES = _(View.HIGHSCORES).sortBy(function (array) {
      return array[1];
    });

    View.HIGHSCORES.reverse()
    View.HIGHSCORES = View.HIGHSCORES.slice(0, 5)

    $highScores = $('.high-scores-list')
    $highScores.find('ul').remove();

    $ul = $('<ul>')
    _(View.HIGHSCORES).each(function (score, i) {
      $ul.append($('<li>').text((i + 1) + " " + score[0] + " " + score[1]));
    });

    $highScores.append($ul)

    $(".submit-initials").toggle();
    $('.high-scores-list').toggle();
    $(".play-again").toggle();
  };

  View.prototype.handleKeyEvent = function (event) {
    var newDir = View.KEYS[event.keyCode];
    if (event.keyCode in View.KEYS) {
      this.board.snake.turn(newDir);
    } else if (event.keyCode === 32) {
      this.gamePause();
    };
  };

  View.prototype.start = function () {
    var game = this;
    game.lost = false;

    window.clearTimeout(game.timeoutId);

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
    game.timeoutId = window.setTimeout(function () {
      game.start();
    }, 500);
  })

  $(".yes").on("click", function () {
    if (!$('.high-scores-block').is(':hidden')) {
      $('.high-scores-block').toggle();
      $('.high-scores-list').toggle();
    };
    $(".play-again").toggle();

    game.points = 0;

    game = new SnakeGame.View($('#grid'), new SnakeGame.Board(20));
    game.render();

    game.timeoutId = window.setTimeout(function () {
      game.start();
    }, 500);
  });

  $(".no").on("click", function () {
    if ($('.high-scores-block').is(':hidden')) {
      $('.high-scores-block').toggle();
      $('.high-scores-list').toggle();
    }

    $(".play-again").toggle();
    $(".thanks").toggle();
  });
});