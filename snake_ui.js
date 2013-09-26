;(function (root) {
  var SnakeGame = root.SnakeGame = (root.SnakeGame || {} );

  var View = SnakeGame.View = function ($el) {
    this.$el = $el;

    this.board = null;
    this.intervalId = null;
  }

  View.STEP = 500

  View.KEYS = {
    37: "W",
    38: "N",
    39: "E",
    40: "S"
  }

  View.prototype.render = function () {
    $('#grid').text(this.board.render());
  };

  View.prototype.step = function () {
    this.board.snake.move();
    this.render();
  };

  View.prototype.handleKeyEvent = function (event) {
    if (event.keyCode in View.KEYS) {
      this.board.snake.turn(View.KEYS[event.keyCode]);
    };
  };

  View.prototype.start = function () {
    var game = this;
    game.board = new SnakeGame.Board(30);
    $(window).on('keydown', game.handleKeyEvent.bind(game));

    game.intervalId = window.setInterval(function () {
      game.step()
    }, View.STEP);
  };
})(this);