const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;
const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");
const road = new Road(carCanvas.width/2, carCanvas.width*0.9);
const cars = generateCars(1000);
let bestCar = cars[0];
if (localStorage.getItem("bestBrain")) {
    for (let i = 0; i < cars.length; i++) {
        cars[i].brain = JSON.parse(
            localStorage.getItem("bestBrain")
        );
        if (i != 0) {
            NeuralNetwork.mutate(cars[i].brain, 0.001);
        }
    }
}
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -620, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -600, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -400, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -820, 30, 50, "DUMMY", 2.2),
    new Car(road.getLaneCenter(1), -750, 30, 50, "DUMMY", 2.2),
    new Car(road.getLaneCenter(0), -860, 30, 50, "DUMMY", 2.2),
    new Car(road.getLaneCenter(2), -1000, 30, 50, "DUMMY", 2.2),
    new Car(road.getLaneCenter(1), -1100, 30, 50, "DUMMY", 2.2),
    new Car(road.getLaneCenter(2), -1100, 30, 50, "DUMMY", 2.2),
    new Car(road.getLaneCenter(0), -1000, 30, 50, "DUMMY", 2.5),
    new Car(road.getLaneCenter(0), -1200, 30, 50, "DUMMY", 2.5),
    new Car(road.getLaneCenter(1), -1400, 30, 50, "DUMMY", 2.5),
    new Car(road.getLaneCenter(2), -1200, 30, 50, "DUMMY", 2.5),
];


animate();

function save() {
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain));
}

function discard() {
    localStorage.removeItem("bestBrain");
}

function generateCars(n) {
    const cars = [];
    for (let i = 1; i <= n; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI", 4));
    }
    return cars;
}



function animate(time) {
    for (let i = 0; i< traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }

    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders, traffic);
    }

    bestCar = cars.find(
        c => c.y == Math.min(...cars.map(c => c.y))
    );
    
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * 0.65);


    road.draw(carCtx);
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].draw(carCtx, "red");
    }
    carCtx.globalAlpha = 0.2;
    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx, "blue");
    }
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, "blue", true);

    carCtx.restore();

    networkCtx.lineDashOffset = -time/80;
    Visualiser.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate);
}