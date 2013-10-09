/**
 * Conway's Game of Life
 * A "cellular automaton" zero-player mathematical game.
 *
 * Author: Leo Deng
 * URL:    https://github.com/myst729/game-of-life
 */

void function(window, document, undefined) {

  // ES5 strict mode
  "use strict";

  var cells = [];             // state of every cell
  var evolve = false;         // state of evolution
  var multithreading = false; // state of multithreading (web worker)
  var height = 120;           // number of cells vertically
  var width = 200;            // number of cells horizontally
  var size = 4;               // width and height of a cell
  var gap = 1;                // space between each cell
  var density = 0.2;          // density of random live cells
  var interval = 80;          // time cost for evolution

  var $height = document.getElementById('height');
  var $width = document.getElementById('width');
  var $size = document.getElementById('size');
  var $gap = document.getElementById('gap');
  var $density = document.getElementById('density');
  var $figure1 = document.getElementById('figure1');
  var $interval = document.getElementById('interval');
  var $figure2 = document.getElementById('figure2');
  var $multithreading = document.getElementById('multithreading');
  var $examples = document.getElementById('examples');
  var $new = document.getElementById('new');
  var $reset = document.getElementById('reset');
  var $random = document.getElementById('random');
  var $start = document.getElementById('start');
  var $stop = document.getElementById('stop');
  var $step = document.getElementById('step');
  var $clean = document.getElementById('clean');

  var $world = document.getElementById('world');
  var context = $world.getContext('2d');
  var worker;

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
    if(multithreading) {
      // Use Worker to do the calculation.
      worker.postMessage(cells);
    } else {
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
    }
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
      setTimeout(evolveCells, interval);
    }
  };

  // Toggle form elements' state
  var toggleState = function() {
    $height.disabled = evolve;
    $width.disabled = evolve;
    $size.disabled = evolve;
    $gap.disabled = evolve;
    $density.disabled = evolve;
    $interval.disabled = evolve;
    $multithreading.disabled = !worker || evolve;
    $examples.disabled = evolve;
    $new.disabled = evolve;
    $reset.disabled = evolve;
    $random.disabled = evolve;
    $start.disabled = evolve;
    $stop.disabled = !evolve;
    $step.disabled = evolve;
    $clean.disabled = evolve;
  };

  // Generate initial cells with the name of this game.
  var initializeGame = function() {
    evolve = false;

    // C
    cells[56][46] = cells[56][47] = cells[56][48] = cells[56][49] = 1;
    cells[57][45] = 1;
    cells[58][45] = 1;
    cells[59][45] = 1;
    cells[60][45] = 1;
    cells[61][45] = 1;
    cells[62][46] = cells[62][47] = cells[62][48] = cells[62][49] = 1;

    // o
    cells[58][52] = cells[58][53] = cells[58][54] = 1;
    cells[59][51] = cells[59][55] = 1;
    cells[60][51] = cells[60][55] = 1;
    cells[61][51] = cells[61][55] = 1;
    cells[62][52] = cells[62][53] = cells[62][54] = 1;

    // n
    cells[58][57] = cells[58][58] = cells[58][59] = cells[58][60] = 1;
    cells[59][57] = cells[59][61] = 1;
    cells[60][57] = cells[60][61] = 1;
    cells[61][57] = cells[61][61] = 1;
    cells[62][57] = cells[62][61] = 1;

    // w
    cells[58][63] = cells[58][66] = cells[58][69] = 1;
    cells[59][63] = cells[59][66] = cells[59][69] = 1;
    cells[60][63] = cells[60][66] = cells[60][69] = 1;
    cells[61][63] = cells[61][66] = cells[61][69] = 1;
    cells[62][64] = cells[62][65] = cells[62][67] = cells[62][68] = 1;

    // a
    cells[58][72] = cells[58][73] = cells[58][74] = 1;
    cells[59][75] = 1;
    cells[60][72] = cells[60][73] = cells[60][74] = cells[60][75] = 1;
    cells[61][71] = cells[61][75] = 1;
    cells[62][71] = cells[62][72] = cells[62][73] = cells[62][74] = cells[62][75] = 1;

    // y
    cells[58][77] = cells[58][81] = 1;
    cells[59][77] = cells[59][81] = 1;
    cells[60][77] = cells[60][81] = 1;
    cells[61][77] = cells[61][81] = 1;
    cells[62][78] = cells[62][79] = cells[62][80] = cells[62][81] = 1;
    cells[63][81] = 1;
    cells[64][78] = cells[64][79] = cells[64][80] = 1;

    // '
    cells[56][83] = cells[57][83] = 1;

    // s
    cells[58][86] = cells[58][87] = cells[58][88] = cells[58][89] = 1;
    cells[59][85] = 1;
    cells[60][86] = cells[60][87] = cells[60][88] = 1;
    cells[61][89] = 1;
    cells[62][85] = cells[62][86] = cells[62][87] = cells[62][88] = 1;

    // G
    cells[56][95] = cells[56][96] = cells[56][97] = cells[56][98] = 1;
    cells[57][94] = 1;
    cells[58][94] = 1;
    cells[59][94] = cells[59][96] = cells[59][97] = cells[59][98] = 1;
    cells[60][94] = cells[60][98] = 1;
    cells[61][94] = cells[61][98] = 1;
    cells[62][95] = cells[62][96] = cells[62][97] = cells[62][98] = 1;

    // a
    cells[58][101] = cells[58][102] = cells[58][103] = 1;
    cells[59][104] = 1;
    cells[60][101] = cells[60][102] = cells[60][103] = cells[60][104] = 1;
    cells[61][100] = cells[61][104] = 1;
    cells[62][100] = cells[62][101] = cells[62][102] = cells[62][103] = cells[62][104] = 1;

    // m
    cells[58][106] = cells[58][107] = cells[58][108] = cells[58][109] = cells[58][110] = cells[58][111] = 1;
    cells[59][106] = cells[59][109] = cells[59][112] = 1;
    cells[60][106] = cells[60][109] = cells[60][112] = 1;
    cells[61][106] = cells[61][109] = cells[61][112] = 1;
    cells[62][106] = cells[62][109] = cells[62][112] = 1;

    // e
    cells[58][115] = cells[58][116] = cells[58][117] = 1;
    cells[59][114] = cells[59][118] = 1;
    cells[60][114] = cells[60][115] = cells[60][116] = cells[60][117] = cells[60][118] = 1;
    cells[61][114] = 1;
    cells[62][115] = cells[62][116] = cells[62][117] = cells[62][118] = 1;

    // o
    cells[58][124] = cells[58][125] = cells[58][126] = 1;
    cells[59][123] = cells[59][127] = 1;
    cells[60][123] = cells[60][127] = 1;
    cells[61][123] = cells[61][127] = 1;
    cells[62][124] = cells[62][125] = cells[62][126] = 1;

    // f
    cells[56][131] = cells[56][132] = cells[56][133] = 1;
    cells[57][130] = 1;
    cells[58][130] = 1;
    cells[59][129] = cells[59][130] = cells[59][131] = cells[59][132] = cells[59][133] = 1;
    cells[60][130] = 1;
    cells[61][130] = 1;
    cells[62][130] = 1;

    // L
    cells[56][138] = 1;
    cells[57][138] = 1;
    cells[58][138] = 1;
    cells[59][138] = 1;
    cells[60][138] = 1;
    cells[61][138] = 1;
    cells[62][139] = cells[62][140] = cells[62][141] = cells[62][142] = 1;

    // i
    cells[57][144] = 1;
    cells[59][144] = 1;
    cells[60][144] = 1;
    cells[61][144] = 1;
    cells[62][144] = 1;

    // f
    cells[56][148] = cells[56][149] = cells[56][150] = 1;
    cells[57][147] = 1;
    cells[58][147] = 1;
    cells[59][146] = cells[59][147] = cells[59][148] = cells[59][149] = cells[59][150] = 1;
    cells[60][147] = 1;
    cells[61][147] = 1;
    cells[62][147] = 1;

    // e
    cells[58][153] = cells[58][154] = cells[58][155] = 1;
    cells[59][152] = cells[59][156] = 1;
    cells[60][152] = cells[60][153] = cells[60][154] = cells[60][155] = cells[60][156] = 1;
    cells[61][152] = 1;
    cells[62][153] = cells[62][154] = cells[62][155] = cells[62][156] = 1;

    placeCells();
  };

  // Create new world with values from game setting pod.
  var newGame = function() {
    height = parseInt($height.value, 10);
    width = parseInt($width.value, 10);
    size = parseInt($size.value, 10);
    gap = parseInt($gap.value, 10);
    cleanGame();
  };

  // Retrieve all default values and reset the world.
  var resetGame = function() {
    $height.value = height = parseInt($height.initial, 10);
    $width.value = width = parseInt($width.initial, 10);
    $size.value = size = parseInt($size.initial, 10);
    $gap.value = gap = parseInt($gap.initial, 10);
    $density.value = density = parseFloat($density.initial);
    $figure1.innerHTML = density.toFixed(2);
    $interval.value = interval = parseInt($interval.initial, 10);
    $figure2.innerHTML = interval;
    $examples.value = '0';
    cleanGame();
  };

  // Generate initial cells from examples.
  var presetGame = function() {
    evolve = false;
    initializeCells();

    switch($examples.value) {
      case '1': // Still Lifes: block, beehive, loaf, boat.
        cells[30][40] = cells[30][41] = cells[31][40] = cells[31][41] = 1;
        cells[30][80] = cells[30][81] = cells[31][79] = cells[31][82] = cells[32][80] = cells[32][81] = 1;
        cells[70][41] = cells[70][42] = cells[71][40] = cells[71][43] = cells[72][41] = cells[72][43] = cells[73][42] = 1;
        cells[70][80] = cells[70][81] = cells[71][80] = cells[71][82] = cells[72][81] = 1;
        break;
      case '2': // Small Exploder
        cells[50][51] = cells[51][50] = cells[51][51] = cells[51][52] = cells[52][50] = cells[52][52] = cells[53][51] = 1;
        break;
      case '3': // High Life
        cells[50][80] = cells[50][81] = cells[50][82] = 1;
        cells[51][79] = cells[51][82] = 1;
        cells[52][78] = cells[52][82] = 1;
        cells[53][78] = cells[53][81] = 1;
        cells[54][78] = cells[54][79] = cells[54][80] = 1;
        cells[54][84] = cells[54][85] = cells[54][86] = 1;
        cells[55][83] = cells[55][86] = 1;
        cells[56][82] = cells[56][86] = 1;
        cells[57][82] = cells[57][85] = 1;
        cells[58][82] = cells[58][83] = cells[58][84] = 1;
        cells[58][88] = cells[58][89] = cells[58][90] = 1;
        cells[59][87] = cells[59][90] = 1;
        cells[60][86] = cells[60][90] = 1;
        cells[61][86] = cells[61][89] = 1;
        cells[62][86] = cells[62][87] = cells[62][88] = 1;
        cells[62][92] = cells[62][93] = cells[62][94] = 1;
        cells[63][91] = cells[63][94] = 1;
        cells[64][90] = cells[64][94] = 1;
        cells[65][90] = cells[65][93] = 1;
        cells[66][90] = cells[66][91] = cells[66][92] = 1;
        break;
      case '4': // Oscillators: blinker (period 2), toad (period 2), beacon (period 2), pulsar (period 3), tumbler.
        cells[30][40] = cells[30][41] = cells[30][42] = 1;
        cells[30][81] = cells[30][82] = cells[30][83] = cells[31][80] = cells[31][81] = cells[31][82] = 1;
        cells[30][120] = cells[30][121] = cells[31][120] = cells[32][123] = cells[33][122] = cells[33][123] = 1;

        cells[70][42] = cells[70][43] = cells[70][44] = cells[70][48] = cells[70][49] = cells[70][50] = 1;
        cells[72][40] = cells[72][45] = cells[72][47] = cells[72][52] = 1;
        cells[73][40] = cells[73][45] = cells[73][47] = cells[73][52] = 1;
        cells[74][40] = cells[74][45] = cells[74][47] = cells[74][52] = 1;
        cells[75][42] = cells[75][43] = cells[75][44] = cells[75][48] = cells[75][49] = cells[75][50] = 1;
        cells[77][42] = cells[77][43] = cells[77][44] = cells[77][48] = cells[77][49] = cells[77][50] = 1;
        cells[78][40] = cells[78][45] = cells[78][47] = cells[78][52] = 1;
        cells[79][40] = cells[79][45] = cells[79][47] = cells[79][52] = 1;
        cells[80][40] = cells[80][45] = cells[80][47] = cells[80][52] = 1;
        cells[82][42] = cells[82][43] = cells[82][44] = cells[82][48] = cells[82][49] = cells[82][50] = 1;

        cells[70][91] = cells[70][95] = 1;
        cells[71][90] = cells[71][91] = cells[71][95] = cells[71][96] = 1;
        cells[72][90] = cells[72][92] = cells[72][94] = cells[72][96] = 1;
        cells[73][92] = cells[73][94] = 1;
        cells[74][91] = cells[74][92] = cells[74][94] = cells[74][95] = 1;
        cells[75][91] = cells[75][95] = 1;
        break;
      case '5': // Exploder
        cells[50][50] = cells[50][52] = cells[50][54] = 1;
        cells[51][50] = cells[51][54] = 1;
        cells[52][50] = cells[52][54] = 1;
        cells[53][50] = cells[53][54] = 1;
        cells[54][50] = cells[54][52] = cells[54][54] = 1;
        break;
      case '6': // 10 Cell Row
        cells[50][50] = cells[50][51] = cells[50][52] = cells[50][53] = cells[50][54] = 1;
        cells[50][55] = cells[50][56] = cells[50][57] = cells[50][58] = cells[50][59] = 1;
        break;
      case '7': // Flower
        cells[48][51] = cells[50][50] = cells[50][51] = cells[50][52] = 1;
        break;
      case '8': // Glider
        cells[30][31] = cells[31][32] = cells[32][30] = cells[32][31] = cells[32][32] = 1;
        break;
      case '9': // Lightweight Spaceship
        cells[50][31] = cells[50][32] = cells[50][33] = cells[50][34] = 1;
        cells[51][30] = cells[51][34] = 1;
        cells[52][34] = 1;
        cells[53][30] = cells[53][33] = 1;
        break;
      case '10': // The R-pentomino
        cells[54][90] = cells[54][91] = cells[55][89] = cells[55][90] = cells[56][90] = 1;
        break;
      case '11': // Die Hard
        cells[39][66] = cells[40][60] = cells[40][61] = cells[41][61] = cells[41][65] = cells[41][66] = cells[41][67] = 1;
        break;
      case '12': // Acron
        cells[54][90] = cells[55][92] = cells[56][89] = cells[56][90] = cells[56][92] = cells[56][93] = cells[56][94] = 1;
        break;
      case '13': // Gosper's Glider Gun
        cells[30][64] = 1;
        cells[31][62] = cells[31][64] = 1;
        cells[32][52] = cells[32][53] = cells[32][60] = cells[32][61] = cells[32][74] = cells[32][75] = 1;
        cells[33][51] = cells[33][55] = cells[33][60] = cells[33][61] = cells[33][74] = cells[33][75] = 1;
        cells[34][40] = cells[34][41] = cells[34][50] = cells[34][56] = cells[34][60] = cells[34][61] = 1;
        cells[35][40] = cells[35][41] = cells[35][50] = cells[35][54] = cells[35][56] = cells[35][57] = cells[35][62] = cells[35][64] = 1;
        cells[36][50] = cells[36][56] = cells[36][64] = 1;
        cells[37][51] = cells[37][55] = 1;
        cells[38][52] = cells[38][53] = 1;
        break;
      case '14': // Infinite 1
        cells[50][90] = cells[51][88] = cells[51][90] = cells[51][91] = cells[52][88] = cells[52][90] = 1;
        cells[53][88] = cells[54][86] = cells[55][84] = cells[55][86] = 1;
        break;
      case '15': // Infinite 2
        cells[50][90] = cells[50][91] = cells[50][92] = cells[50][94] = 1;
        cells[51][90] = 1;
        cells[52][93] = cells[52][94] = 1;
        cells[53][91] = cells[53][92] = cells[53][94] = 1;
        cells[54][90] = cells[54][92] = cells[54][94] = 1;
        break;
      case '16': // Infinite 3
        cells[50][80] = cells[50][81] = cells[50][82] = cells[50][83] = cells[50][84] = cells[50][85] = cells[50][86] = cells[50][87] = 1;
        cells[50][89] = cells[50][90] = cells[50][91] = cells[50][92] = cells[50][93] = 1;
        cells[50][97] = cells[50][98] = cells[50][99] = 1;
        cells[50][106] = cells[50][107] = cells[50][108] = cells[50][109] = cells[50][110] = cells[50][111] = cells[50][112] = 1;
        cells[50][114] = cells[50][115] = cells[50][116] = cells[50][117] = cells[50][118] = 1;
        break;
      default:  // Silence
        break;
    }

    placeCells();    
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
    // Add all the dirty listeners.
    $density.addEventListener('change', function() {
      density = parseFloat($density.value);
      $figure1.innerHTML = density.toFixed(2);
    }, false);

    $interval.addEventListener('change', function() {
      interval = parseInt($interval.value, 10);
      $figure2.innerHTML = interval;
    }, false);

    $multithreading.addEventListener('change', function() {
      multithreading = $multithreading.checked;
    }, false);

    $new.addEventListener('click', newGame, false);
    $reset.addEventListener('click', resetGame, false);
    $examples.addEventListener('change', presetGame, false);
    $random.addEventListener('click', randomizeGame, false);
    $start.addEventListener('click', startGame, false);
    $stop.addEventListener('click', stopGame, false);
    $step.addEventListener('click', stepGame, false);
    $clean.addEventListener('click', cleanGame, false);
    $world.addEventListener('click', impactGame, false);

    // Set initial values.
    $height.value = $height.initial = height;
    $width.value = $width.initial = width;
    $size.value = $size.initial = size;
    $gap.value = $gap.initial = gap;
    $density.value = $density.initial = density;
    $figure1.innerHTML = density.toFixed(2);
    $interval.value = $interval.initial = interval;
    $figure2.innerHTML = interval;

    // Try to initialize a worker.
    try {
      worker = new Worker('evolution.js');
      worker.onmessage = function(e) {
        cells = e.data;
        placeCells();
      };
    } catch(ex) {
      $multithreading.disabled = true;
    };

    // Prepare the world.
    cleanGame();
    initializeGame();
  };

  window.addEventListener('load', init, false);

}(window, document);