const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine;
var ground;
var canvas;
var world;
var tower;

var balls = [];
var boats = [];

var angle = 20;

function preload() {
    backgroundImg = loadImage("background.gif");
    towerImg = loadImage("tower.png");
}

function setup() {
    canvas = createCanvas(1200, 600);
    engine = Engine.create();
    world = engine.world;
    angleMode(DEGREES);
    angle = 15;
    var ground_options = {
        isStatic: true
    }
    ground = Bodies.rectangle(0, 590, 1200, 20, ground_options);
    World.add(world, ground);
    tower = Bodies.rectangle(160, 350, 160, 310, ground_options);
    World.add(world, tower);
    cannon = new Cannon(180, 110, 130, 100, angle);
    cannonball = new CannonBall(cannon.x, cannon.y);
}

function draw() {
    image(backgroundImg, 0, 0, 1200, 600)
    Engine.update(engine);
    rect(ground.position.x, ground.position.y, 1200, 20);
    push();
    translate(tower.position.x, tower.position.y);
    rotate(tower.angle);
    imageMode(CENTER);
    image(towerImg, 0, 0, 160, 310);
    pop();
    showBoats();
    for (var i = 0; i < balls.length; i++) {
        showCannonballs(balls[i], i);
        collisionWithBoat(i);
    }
    cannon.display();
}

function keyReleased() {
    if (keyCode == RIGHT_ARROW) {
        balls[balls.length - 1].shoot();
    }
}

function showBoats() {
    if (boats.length > 0) {
        if (boats[boats.length - 1] === undefined ||
            boats[boats.length - 1].body.position.x < width - 300) {
            var positions = [-40, -60, -70, -20];
            var position = random(positions);
            var boat = new Boat(width, height - 100, 170, 170, position);
            boats.push(boat);
        }
        for (var i = 0; i < boats.length; i++) {
            if (boats[i]) {
                Matter.Body.setVelocity(boats[i].body, {
                    x: -0.9,
                    y: 0
                });
                boats[i].display()
            }
        }
    }
    else {
        var boat = new Boat(width, height - 60, 170, 170, -60);
        boats.push(boat);
    }
}


function showCannonballs(ball, index) {
    if (ball) {
        ball.display();
    }
}

function keyPressed() {
    if (keyCode == RIGHT_ARROW) {
        var cannonball = new CannonBall(cannon.x, cannon.y);
        cannonball.trajectory = [];
        Matter.Body.setAngle(cannonball.body, cannon.angle);
        balls.push(cannonball);
    }
}

function collisionWithBoat(index) {
    for (var i = 0; i < boats.length; i++) {
        if (balls[index] !== undefined && boats[i] != undefined) {
            var collision = Matter.SAT.collides(balls[index].body, balls[i].body);
            if (collision.collided) {
                boats[i].remove;
                Matter.World.remove(world, balls[index].body);
                delete balls[index];
            }
        }
    }
}