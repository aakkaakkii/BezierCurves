let canvas = document.querySelector('canvas');

canvas.width = window.innerWidth - 30;
canvas.height = window.innerHeight - 30;

let c = canvas.getContext('2d');
let selectedPoint;
let radius = 10;
let pointId = 0;
let lineWidth = 10;
let t = 0;
let dt = 0;
let points = [];
let anmRef;
let movingPoints = [];
let curvePoints = [];
let showCurve = false;
let isAnimationStarted = false;

function recursionMoveMovingPoints(pnts) {
    let newPnts = [];

    if(pnts.length === 1){
        if (points.length !== 3) {
            pnts[0].point.connectPoint(pnts[0].to, '#b000a0');
        }
        curvePoints.push( moveMovingPoint(pnts[0]));
        return
    }


    for (let i = 0; i < pnts.length; i++){
        if (pnts[i+1]){
            pnts[i].point.connectPoint(pnts[i + 1].point, '#28B048');
            pnts.forEach(function (p) {
                moveMovingPoint(p);
            });
            newPnts.push({
                from: pnts[i].point,
                to: pnts[i + 1].point,
                point: new Point(pnts[i].point.x, pnts[i].point.y, 'blue', 5),
                linearEquation: findLinearEquation(pnts[i].point, pnts[i + 1].point)
            });
        }
    }
    return recursionMoveMovingPoints(newPnts);
}

function animateMovingPoints() {
    anmRef = requestAnimationFrame(animateMovingPoints);
    c.clearRect(0, 0, innerWidth, innerHeight);
    drawHelpingLines();
    t += dt;

    recursionMoveMovingPoints(movingPoints);

    if(showCurve){
        drawCurve();
    }
}

function moveMovingPoint(p) {
    p.point.x = lerp(p.from.x, p.to.x, t);
    p.point.y = p.point.x * p.linearEquation.k + p.linearEquation.b;
    p.point.drawPoint();

    if(p.from.x > p.to.x){
        if ( p.point.x <= p.to.x) {
            p.point.x = p.from.x;
            p.point.y = p.from.y;
            t = 0;
            curvePoints = [];
        }
    } else if ( p.point.x >= p.to.x){
        p.point.x = p.from.x;
        p.point.y = p.from.y;
        t = 0;
        curvePoints = [];
    }

    return {x:p.point.x, y:p.point.y }
}

function startAnimation() {
    stopAnimation();
    isAnimationStarted = true;
    dt = parseFloat(document.querySelector('#deltaT').value);

    for (let i = 0; i < points.length; i++){
        if (points[i+1]){
            movingPoints.push({
                from: points[i],
                to: points[i+1],
                point: new Point(points[i].x, points[i].y, '#808D9E', 5),
                linearEquation: findLinearEquation(points[i], points[i+1])
            });
        }
    }
    animateMovingPoints();
}

function stopAnimation() {
    isAnimationStarted = false;
    if (anmRef) {
        cancelAnimationFrame(anmRef);
    } else {
        drawHelpingLines();
    }
}

function drawCurve() {
    c.beginPath();
    for (let i = 0; i < curvePoints.length ;i++){
        if (curvePoints[i+1]){
            c.moveTo(curvePoints[i].x, curvePoints[i].y);
            c.lineTo(curvePoints[i+1].x, curvePoints[i+1].y);
        }
    }
    c.strokeStyle = 'red';
    c.stroke();
}


// +++++++++++++++++++++++++++++++++++++++++++++

function showHideCurve() {
    showCurve = !showCurve;
}

//formulas
function lerp(a, b, t) {
    return (1 - t) * a + t * b;
}

function findLinearEquation(p1, p2) {
    let k = (p1.y - p2.y) / (p1.x - p2.x);
    let b = p1.y - k * p1.x;
    return {k: k, b: b}
}

// +++++++++++++++++++++++++++++++++++++++++++++

function Point(x, y, color, radius) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = radius;
    this.id = pointId++;

    this.drawPoint = function () {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.strokeStyle = this.color;
        c.fillStyle = this.color;
        c.fill();
        c.stroke();
    };

    this.connectPoint = function (point, color) {
        c.beginPath();
        c.moveTo(this.x, this.y);
        c.lineTo(point.x, point.y);
        c.strokeStyle = color ? color : '#4d4b4d';
        c.lineWidth = lineWidth;
        c.stroke();
    };
}

function drawPoints() {
    points.forEach(p => p.drawPoint());
}

function connectPoints() {
    for (let i = 0; i < points.length; i++){
        if (points[i+1]){
            points[i].connectPoint(points[i+1])
        }
    }
}

// event Listeners
canvas.addEventListener('mousedown', function (event) {
    points.forEach(function (p) {
        if (detectClick(p, event.offsetX, event.offsetY)) {
            selectedPoint = p;
        }
    })
});

canvas.addEventListener('mouseup', function (event) {
    selectedPoint = null;
});

canvas.addEventListener('mousemove', function (event) {
    if (selectedPoint) {
        selectedPoint.x = event.offsetX;
        selectedPoint.y = event.offsetY;
        c.clearRect(0, 0, innerWidth, innerHeight);
        drawHelpingLines();
        if (isAnimationStarted) {
            curvePoints = [];
            movingPoints = [];
            startAnimation();
        }
    }
});

//++++++++++++++++++++++++++++++++++++++++++

function detectClick(point, x, y) {
    let r = radius + lineWidth;
    let distanceSquared = (x - point.x) * (x - point.x) + (y - point.y) * (y - point.y);
    return distanceSquared <= r * r;
}

function drawHelpingLines() {
    connectPoints();
    drawPoints();
}

function main() {
    drawHelpingLines();
}

// main();

//init

function initPoints(count) {
    points = [];

    let color = '#808D9E';
    let startX = 100;
    let startY = 100;
    for (let i = 0; i < count; i++){
        points.push(new Point(startX + 25*i, startY + 25*i, color, radius))
    }
}

function setup(){
    let points = parseInt(document.querySelector('#pointCount').value, 10);
    if (points >= 3){
        stopAnimation();
        c.clearRect(0, 0, innerWidth, innerHeight);
        initPoints(points);
        drawHelpingLines();
    }else {
        alert("3 or more point required")
    }
}
