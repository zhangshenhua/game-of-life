void function(window, document, undefined) {

  // ES5 strict mode
  "use strict";

  var cells = [];     // state of every cell
  var evolve = false; // state of evolution
  var height = 120;   // number of cells vertically
  var width = 200;    // number of cells horizontally
  var size = 4;       // width and height of a cell
  var gap = 1;        // space between each cell
  var density = 0.2;  // density of random live cells

  var $height = document.getElementById('height');
  var $width = document.getElementById('width');
  var $size = document.getElementById('size');
  var $gap = document.getElementById('gap');
  var $density = document.getElementById('density');
  var $figure = document.getElementById('figure');
  var $new = document.getElementById('new');
  var $reset = document.getElementById('reset');
  var $random = document.getElementById('random');
  var $start = document.getElementById('start');
  var $stop = document.getElementById('stop');
  var $step = document.getElementById('step');
  var $clean = document.getElementById('clean');

  var $world = document.getElementById('world');
  var context = $world.getContext('2d');

  // Initialize all cells as dead.
  var initializeCells = function() {
    for(var i = 0; i < height + 2; i++) {
      cells[i] = [];
      for(var j = 0; j < width + 2; j++) {
        cells[i][j] = 0;
      }
    }
  };

  // Evolve the next generation of cells and draw them.
  var evolveCells = function() {
    var next = [];
    var neighbors;

    for(var i = 0; i < height + 2; i++) {
      next[i] = [];
      for(var j = 0; j < width + 2; j++) {
        if(i === 0 || j === 0 || i === height+1 || j === width+1) {
          next[i][j] = 0; // shim cells
        } else {
          // Get the number of live neighbors (8 neighbors in total).
          neighbors = cells[i-1][j-1] + cells[i-1][j] + cells[i-1][j+1] + cells[i][j-1] + cells[i][j+1] + cells[i+1][j-1] + cells[i+1][j] + cells[i+1][j+1];

          if(cells[i][j] === 0 && neighbors === 3) {
            // Any dead cell with exactly 3 live neighbors becomes a live cell, as if by reproduction.
            next[i][j] = 1;
          } else if(cells[i][j] === 1 && neighbors > 1 && neighbors < 4) {
            // Any live cell with 2 or 3 live neighbors lives on to the next generation.
            next[i][j] = 1;
          } else {
            // Live cell dies, caused by under-population (fewer than 2 live neighbors) or overcrowding (more than 3 live neighbors).
            // Dead cell remains dead.
            next[i][j] = 0;
          }
        }
      }
    }

    cells = next;
    placeCells();
  };

  // Place the cells in the world.
  var placeCells = function() {
    context.clearRect(0, 0, (size + gap) * width - gap, (size + gap) * height - gap);

    for(var i = 1; i < height + 1; i++) {
      for(var j = 1; j < width + 1; j++) {
        if(cells[i][j] === 1) {
          context.fillRect((size + gap) * (j-1), (size + gap) * (i-1), size, size);
        }
      }
    }

    // Go on next generation.
    if(evolve) {
      setTimeout(evolveCells, 80);
    }
  };

  // Toggle form elements' state
  var toggleState = function() {
    $height.disabled = evolve;
    $width.disabled = evolve;
    $size.disabled = evolve;
    $gap.disabled = evolve;
    $density.disabled = evolve;
    $new.disabled = evolve;
    $reset.disabled = evolve;
    $random.disabled = evolve;
    $start.disabled = evolve;
    $stop.disabled = !evolve;
    $step.disabled = evolve;
    $clean.disabled = evolve;
  };

  // Generate random initial cells and draw them.
  var randomizeGame = function() {
    evolve = false;

    for(var i = 0; i < height + 2; i++) {
      cells[i] = [];
      for(var j = 0; j < width + 2; j++) {
        if(i === 0 || j === 0 || i === height+1 || j === width+1) {
          cells[i][j] = 0; // shim cells
        } else {
          cells[i][j] = (Math.random() < density) ? 1 : 0;
        }
      }
    }

    placeCells();
  };

  // Start evolution continuously.
  var startGame = function() {
    evolve = true;
    toggleState();
    evolveCells();
  };

  // Stop evolution.
  var stopGame = function() {
    evolve = false;
    toggleState();
  };

  // Spawn one generation.
  var stepGame = function() {
    evolve = false;
    evolveCells();
  };

  // Wipe all cells in the world.
  var cleanGame = function() {
    evolve = false;
    initializeCells();
    $world.width = (size + gap) * width - gap;
    $world.height = (size + gap) * height - gap;
    context.fillStyle = '#f0f0f0';
    context.clearRect(0, 0, (size + gap) * width - gap, (size + gap) * height - gap);
  };

  // Impact cells during the game, and see how can we affect the evolution.
  var impactGame = function(e) {
    // Only do this when the world is paused.
    if(evolve) {
      return;
    }

    var offset = $world.getBoundingClientRect();
    var x = (e.clientX - offset.left) % (size + gap); // offsetX in a cell
    var y = (e.clientY - offset.top) % (size + gap);  // offsetY in a cell

    // Actually clicked on the cell rather than gap.
    if(x <= size && y <= size) {
      var i = Math.floor((e.clientY - offset.top) / (size + gap)) + 1;  // index X in the world
      var j = Math.floor((e.clientX - offset.left) / (size + gap)) + 1; // index Y in the world
      // Make dead lives, make live dies.
      cells[i][j] = 1 - cells[i][j];
      placeCells();
    }
  };

  // Initialize the game.
  var init = function() {
    // Add dirty listeners.
    $density.addEventListener('change', function() {
      density = parseFloat($density.value);
      $figure.innerHTML = density.toFixed(2);
    }, false);

    $new.addEventListener('click', function() {
      height = parseInt($height.value);
      width = parseInt($width.value);
      size = parseInt($size.value);
      gap = parseInt($gap.value);
      cleanGame();
    }, false);

    $reset.addEventListener('click', function() {
      $height.value = height = parseInt($height.initial);
      $width.value = width = parseInt($width.initial);
      $size.value = size = parseInt($size.initial);
      $gap.value = gap = parseInt($gap.initial);
      $density.value = density = parseFloat($density.initial);
      $figure.innerHTML = density.toFixed(2);
      cleanGame();
    }, false);

    $random.addEventListener('click', randomizeGame, false);
    $start.addEventListener('click', startGame, false);
    $stop.addEventListener('click', stopGame, false);
    $step.addEventListener('click', stepGame, false);
    $clean.addEventListener('click', cleanGame, false);
    $world.addEventListener('click', impactGame, false);

    // Store initial values.
    $height.value = $height.initial = height;
    $width.value = $width.initial = width;
    $size.value = $size.initial = size;
    $gap.value = $gap.initial = gap;
    $density.value = $density.initial = density;
    $figure.innerHTML = density.toFixed(2);

    // Prepare the world.
    cleanGame();
  };

  window.addEventListener('load', init, false);

}(window, document);