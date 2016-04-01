var pixelSize = 10;
  var rules = [0, 1, 0, 1, 1, 0, 1, 0];

$(document).ready(function() {
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext("2d");
  var cellColor = '#000';

  initRulesSelect();

  // Init grid
  var grid = renderGrid(pixelSize, 'black', canvas, context);
  var w = grid.columns;
  var h = grid.rows;

  // Init grid array
  var cells = new Array(w);
  for (var i = 0; i < w; i++) {
    cells[i] = new Array(h);
  }

  // Set default grid values
  for (var i = 0; i < cells.length; i++) {
    for (var j = 0; j < cells[i].length; j++) {
      cells[i][j] = 0;
    }
  }

  // Init seed
  var middle = Math.round(w/2);
  cells[0][middle] = 1;
  fillCell(middle, 0, context);

  // Run through rows executing rules
  for (var i = 0; i < cells.length - 1; i++) {
    for (var j = 1; j < cells[i].length - 1; j++) {
      var left = cells[i][j-1];
      var cur = cells[i][j];
      var right = cells[i][j+1];

      var val = getRule(left, cur, right);
      if (val) {
        cells[i+1][j] = 1;
        fillCell(j, i+1, context);
      }
    }
  }
});

/**
 * Returns the rule result based on the provided a,b,c cell values
 * @param {Number} a
 * @param {Number} b
 * @param {Number} c
 * @return {Boolean}
 */
function getRule(a, b, c) {
  var val = a + "" + b + "" + c;
  if (val == "111") return rules[0];
  if (val == "110") return rules[1];
  if (val == "101") return rules[2];
  if (val == "100") return rules[3];
  if (val == "011") return rules[4];
  if (val == "010") return rules[5];
  if (val == "001") return rules[6];
  if (val == "000") return rules[7];
  return 0;
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
    context.lineWidth = 0.5;
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
 * Fills a cell on the 2d grid at the ith jth position
 * @param {Number} i
 * @param {Number} j
 */
function fillCell(i, j, context) {
  context.fillRect(i * pixelSize, j * pixelSize, pixelSize, pixelSize);

}

function initRulesSelect() {
    var x = document.getElementById("rules");
    for (var i = 0; i < 256; i++) {
      var option = document.createElement("option");
      option.text = "Rule" + i;
      option.value = i;
      x.add(option);
    }

}
