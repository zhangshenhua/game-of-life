void function(window, document, undefined) {

  // ES5 strict mode
  "use strict";

  var UNIT = 3;     // cell width and height
  var WIDTH = 300;  // number of cells horizontally
  var HEIGHT = 200; // number of cells vertically

  var state = [];
  var flag = false;
  var cells;
  var random = document.getElementById('random');
  var start = document.getElementById('start');
  var stop = document.getElementById('stop');
  var step = document.getElementById('step');

  // Cross-browser compatible event handler.
  var addEvent = function(element, type, handler) {
    if(element.addEventListener) {
      addEvent = function(element, type, handler) {
        element.addEventListener(type, handler, false);
      };
    } else if(element.attachEvent) {
      addEvent = function(element, type, handler) {
        element.attachEvent('on' + type, handler);
      };
    } else {
      addEvent = function(element, type, handler) {
        element['on' + type] = handler;
      };
    }
    addEvent(element, type, handler);
  };

  // Calculate the next generation of cells and draw them.
  var spawn = function() {
    var next = [];
    var neighbors = 0;
    for(var i = 0; i < HEIGHT + 2; i++) {
      next[i] = [];
      for(var j = 0; j < WIDTH + 2; j++) {
        if(i === 0 || j === 0 || i === HEIGHT+1 || j === WIDTH+1) {
          // shim elements
          next[i][j] = 0;
        } else {
          neighbors = state[i-1][j-1] + state[i-1][j] + state[i-1][j+1] + state[i][j-1] + state[i][j+1] + state[i+1][j-1] + state[i+1][j] + state[i+1][j+1];
          if(state[i][j] === 0 && neighbors === 3) {
            // this cell is dead, but will be alive in next round
            next[i][j] = 1;
          } else if(state[i][j] === 1 && neighbors > 1 && neighbors < 4) {
            // this cell is alive, and will keep alive in next round
            next[i][j] = 1;
          } else {
            // dead cell in next round
            next[i][j] = 0;
          }
        }
      }
    }
    state = next;
    draw();
  };

  // Draw the cells in the canvas.
  // TODO: Use CANVAS instead of DIVs.
  var draw = function() {
    var index;
    for(var i = 1; i < HEIGHT + 1; i++) {
      for(var j = 1; j < WIDTH + 1; j++) {
        index = WIDTH * (i-1) + (j-1);
        cells[index].className = (state[i][j] === 1) ? 'alive' : '';
      }
    }
    if(flag) {
      setTimeout(spawn, 50);
    }
  };

  // Generate random initial cells and draw them.
  var randomize = function() {
    flag = false;
    for(var i = 1; i < HEIGHT + 1; i++) {
      for(var j = 1; j < WIDTH + 1; j++) {
        state[i][j] = (Math.random() < 0.8) ? 0 : 1;
      }
    }
    draw();
  };

  // Start to evolution.
  var startGame = function() {
    flag = true;
    spawn();
  };

  // Stop evolution.
  var stopGame = function() {
    flag = false;
  };

  // Next generation.
  var stepGame = function() {
    flag = false;
    spawn();
  };

  // Initialize the canvas.
  // TODO: Use CANVAS instead of DIVs.
  var init = function() {
    var gol = document.getElementById('gol');
    gol.style.width = UNIT * WIDTH + 'px';
    gol.style.height = UNIT * HEIGHT + 'px';
    gol.innerHTML = (new Array(WIDTH * HEIGHT + 1)).join('<span></span>');
    cells = gol.children;
    for(var i = 0; i < HEIGHT + 2; i++) {
      state[i] = [];
      for(var j = 0; j < WIDTH + 2; j++) {
        state[i][j] = 0;
      }
    }
  };

  addEvent(random, 'click', randomize);
  addEvent(start, 'click', startGame);
  addEvent(stop, 'click', stopGame);
  addEvent(step, 'click', stepGame);
  addEvent(window, 'load', init);

}(window, document);