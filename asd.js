var canvas_element = document.getElementById('canvas');
var context = canvas_element.getContext('2d');

var tiles_array = [];

function Tile(x, y, width, height, id, fillColor, strokeStyle) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.workWidth = {
        start: x,
        end: x + width
    }
    this.workHeight = {
        start: y,
        end: y + height
    }
    this.fillColor = fillColor;
    this.strokeStyle = 'black';
}

//var tile = new Tile(0, 0, 200, 150)

canvas_element.onclick = function(e) {
    event = e;
    //checkClick(event);
    var elementClickedId = checkClick(event);
    console.log(`You click element with number ${elementClickedId}`);
    tiles_array[elementClickedId].fillColor = 'white';
    drawTiles();
}

canvas_element.onmousemove = function(e) {
    var elementUnder = checkClick(event);
    if (elementUnder == 1) {
        changeCursor('pointer');
    } else {
        changeCursor('default');
    }
}

canvas_element.onmouseout = function(e) {
    changeCursor('default');
}


//context.fillRect(tile.x, tile.y, tile.width, tile.height);

function checkClick(event) {
    var clickX = event.layerX;
    var clickY = event.layerY;

    var element;

    tiles_array.forEach(function(tile, i, arr) {
        if (
            clickX > tile.workWidth.start &&
            clickX < tile.workWidth.end &&
            clickY > tile.workHeight.start &&
            clickY < tile.workHeight.end
        ) {
            element = tile.id;
        }
    });
    return element;
}

// Create Tiles
function createTiles(quantityX, quantityY) {
    var quantityAll = quantityX * quantityY;
    var tileWidth = canvas_element.width / quantityX;
    var tileHeight = canvas_element.height / quantityY;

    var drawPosition = {
        x: 0,
        y: 0
    }

    for (var i = 0; i < quantityAll; i++) {
        var fillColor = getRandomColor();
        var tile = new Tile(drawPosition.x, drawPosition.y, tileWidth, tileHeight, i, fillColor);
        tiles_array.push(tile);

        drawPosition.x = drawPosition.x + tileWidth;
        if (drawPosition.x >= canvas_element.width) {
            drawPosition.x = 0;
            drawPosition.y = drawPosition.y + tileHeight;
        }
    }

}

createTiles(6, 6);


function drawTiles() {
    tiles_array.forEach(function(tile, i, arr) {
        context.beginPath()

        context.fillStyle = tile.fillColor;
        context.rect(tile.x, tile.y, tile.width, tile.height);

        context.lineWidth="2";
        context.strokeStyle = tile.strokeStyle;
        context.stroke()

        context.fill();
    });
}

drawTiles();


function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

//

function changeCursor(cursorType){
    document.body.style.cursor = cursorType;
}

