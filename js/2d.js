var pixelSize = 10;
var lineWidth = 0.5;
var rules = [0, 0, 0, 0, 0, 0, 0, 0];
var w, h, cells, context, canvas, intervalId;
var curRow = 0;

$(document).ready(function() {
  canvas = document.getElementById('canvas');
  context = canvas.getContext("2d");
  var cellColor = '#000';

  // Init grid
  var grid = renderGrid(pixelSize, 'black', canvas, context);
  w = grid.columns;
  h = grid.rows;
  cells = initCells(context);

  // Init listeners
  initListeners();
});

function initListeners() {
  $("#clear").click(function() {
    resetGrid();
  });

  $("#execute").click(function() {
    clearInterval(intervalId);
    intervalId = window.setInterval(execute, 50);
  });
}

function execute() {
  var next = new Array(w);
  for (var i = 0; i < w; i++) {
    next[i] = new Array(h);
  }
  for (var i = 0; i < cells.length - 1; i++) {
    for (var j = 0; j < cells[i].length - 1; j++) {
      var neighbours = 0;
      // Top
      if (i != 0 && cells[i-1][j-1]) neighbours++;
      if (cells[i][j-1]) neighbours++;
      if (cells[i+1][j-1]) neighbours++;

      // Middle
      if (i != 0 && cells[i-1][j]) neighbours++;
      if (cells[i+1][j]) neighbours++;

      // Bottom
      if (i != 0 && cells[i-1][j+1]) neighbours++;
      if (cells[i][j+1]) neighbours++;
      if (cells[i+1][j+1]) neighbours++;

      // Calculate next cell
      if (cells[i][j] && (neighbours < 2 || neighbours > 3)) {
        next[i][j] = 0;
      } else if (!cells[i][j] && neighbours == 3) {
        next[i][j] = 1;
      } else {
        next[i][j] = cells[i][j];
      }
    }
  }

  cells = next;
  for (var i = 0; i < cells.length - 1; i++) {
    for (var j = 0; j < cells[i].length - 1; j++) {
      if (cells[i][j]) {
        fillCell(i, j, context);
      } else {
        clearCell(i, j, context);
      }
    }
  }
}

/**
* Renders the grid on the canvas
* @param {Number} gridPixelSize
* @param {Sting} color
* @return {Void}
*/
function renderGrid(gridPixelSize, color, canvas, context)
{
  context.save();
  context.lineWidth = lineWidth;
  context.strokeStyle = color;

  var rows = 0;
  var columns = 0;

  // horizontal grid lines
  for(var i = 0; i <= canvas.height; i = i + gridPixelSize)
  {
      context.beginPath();
      context.moveTo(0, i);
      context.lineTo(canvas.width, i);
      context.closePath();
      context.stroke();
      rows++;
  }

  // vertical grid lines
  for(var j = 0; j <= canvas.width; j = j + gridPixelSize)
  {
      context.beginPath();
      context.moveTo(j, 0);
      context.lineTo(j, canvas.height);
      context.closePath();
      context.stroke();
      columns++;
  }

  context.restore();

  var grid = {columns: columns, rows: rows};
  return grid;
}

/**
* Initalize a cells array with the corresponding width and height. Set the
* grid seed for the cellular automata
*
*/
function initCells(context) {
  // Init grid array
  var cells = new Array(w);
  for (var i = 0; i < w; i++) {
    cells[i] = new Array(h);
  }

  // Set default grid values
  for (var i = 0; i < cells.length - 1; i++) {
    for (var j = 0; j < cells[i].length - 1; j++) {
      var state = Math.round(Math.random());
      cells[i][j] = state;
      if (state) {
        fillCell(i, j, context);
      } else {
        clearCell(i, j, context);
      }
    }
  }

  return cells;
}

/**
* Reset cells grid
*/
function resetGrid() {
  clearInterval(intervalId);

  // Set default grid values
  for (var i = 0; i < cells.length - 1; i++) {
    for (var j = 0; j < cells[i].length - 1; j++) {
      var state = Math.round(Math.random());
      cells[i][j] = state;
      if (state) {
        fillCell(i, j, context);
      } else {
        clearCell(i, j, context);
      }
    }
  }
  return cells;
}

/**
* Fills a cell on the 2d grid at the ith jth position
* @param {Number} i
* @param {Number} j
*/
function fillCell(i, j, context) {
  context.fillRect(
    i * pixelSize + lineWidth,
    j * pixelSize + lineWidth,
    pixelSize - lineWidth,
    pixelSize - lineWidth
  );
}

/**
* Clears a cell on the 2d grid at the ith jth position
* @param {Number} i
* @param {Number} j
*/
function clearCell(i, j, context) {
  context.clearRect(
    i * pixelSize + lineWidth,
    j * pixelSize + lineWidth,
    pixelSize - lineWidth,
    pixelSize - lineWidth
  );
}
