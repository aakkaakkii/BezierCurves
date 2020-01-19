let canvas = document.querySelector('canvas');

canvas.width = window.innerWidth - 30;
canvas.height = window.innerHeight - 30;

let c = canvas.getContext('2d');
let selectedPoint;

let x = 200;
let y = 200;
let dx = 2;
let dy = 2;
let radius = 10;
let pointId = 0;
let lineWidth = 10;
let t = 0;
let dt = 0;
let points = [
    new Point(120, 222, '#808D9E', radius),
    new Point(220, 122, '#808D9E', radius),
    new Point(250, 222, '#808D9E', radius),
];
let anmRef;
let movingPoints = [];
let connectionPoints = [];
let curvePoints = [];
let showCurve = false;
let isAnimationStarted = false;

// animation
/*function animate() {
    let anm = requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);
    c.beginPath();
    c.arc(x, y, radius, 0, Math.PI * 2, false);
    c.strokeStyle = '#808D9E';
    c.fillStyle = '#808D9E';
    c.fill();
    c.stroke();

    x += dx;
    y += dy;

    if (x > innerWidth) {
        cancelAnimationFrame(anm)
    }
}*/

function animateMovingPoints() {
    anmRef = requestAnimationFrame(animateMovingPoints);
    c.clearRect(0, 0, innerWidth, innerHeight);
    drawHelpingLines();
    t += dt;

    movingPoints[0].point.connectPoint(movingPoints[1].point, '#28B048');
    movingPoints.forEach(function (p) {
        moveMovingPoint(p);
    });

    let points = moveMovingPoint({
        from: movingPoints[0].point,
        to: movingPoints[1].point,
        point: new Point(movingPoints[0].point.x, movingPoints[0].point.y, 'blue', 5),
        linearEquation: findLinearEquation(movingPoints[0].point, movingPoints[1].point)
    });

    curvePoints.push(points);

    if(showCurve){
        drawCurve();
    }
}

function moveMovingPoint(p) {
    p.point.x = lerp(p.from.x, p.to.x, t);
    p.point.y = p.point.x * p.linearEquation.k + p.linearEquation.b;
    p.point.drawPoint();

    if (p.point.x >= p.to.x) {
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

    let p1 = points[0];
    let p2 = points[1];
    let p3 = points[2];

    movingPoints[0] = {
        from: p1,
        to: p2,
        point: new Point(p1.x, p1.y, '#808D9E', 5),
        linearEquation: findLinearEquation(p1, p2)
    };
    movingPoints[1] = {
        from: p2,
        to: p3,
        point: new Point(p2.x, p2.y, '#808D9E', 5),
        linearEquation: findLinearEquation(p2, p3)
    };
    animateMovingPoints();
}

function stopAnimation() {
    isAnimationStarted = false;
    if (anmRef) {
        cancelAnimationFrame(anmRef);
    }
    c.clearRect(0, 0, innerWidth, innerHeight);
    drawHelpingLines();
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
    points[0].connectPoint(points[1]);
    points[1].connectPoint(points[2]);
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
        console.log(isAnimationStarted)
        if (isAnimationStarted) {
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

main();
