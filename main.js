let canvas = document.querySelector('canvas');

canvas.width = window.innerWidth - 30;
canvas.height = window.innerHeight - 30;

let c = canvas.getContext('2d');

let x = 200;
let y = 200;
let dx = 14;
let dy = 14;
let radius = 10;

function animate() {
    let anm = requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);
    c.beginPath();
    c.arc(x, y, radius, 0, Math.PI * 2, false);
    c.strokeStyle = 'red';
    c.fillStyle = 'red';
    c.fill();
    c.stroke();

    x += dx;
    y += dy;

    if (x > innerWidth) {
        cancelAnimationFrame(anm)
    }
}

//animate();

//draw line
// c.beginPath();
// c.moveTo(0, 0);
// c.lineTo(300, 150);
// c.strokeStyle = 'red';
// c.stroke();
let pointId = 0;
function Point(x, y, color, radius){
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = radius;
    this.id = pointId++;

}

let points = [
    new Point(120, 222, 'red', radius),
    new Point(220, 122, 'red', radius),
    new Point(250, 222, 'red', radius),
];

function drawPoints(){
    points.forEach(p => drawPoint(p));
}

function drawPoint(point) {
    console.log(point.id)
    c.beginPath();
    c.arc(point.x, point.y, point.radius, 0, Math.PI * 2, false);
    c.strokeStyle = point.color;
    c.fillStyle = point.color;
    c.fill();
    c.stroke();
}

// c.clearRect(0, 0, innerWidth, innerHeight);

drawPoints();
canvas.addEventListener('mousedown',  function (event) {
    console.log(event.offsetX, event.offsetY)
    console.log(event)

    //TODO - detect point click
})
