// chladni frequency params
let a=1, b=1;

// vibration strength params
let A = 0.02;
let minWalk = 0.002;

// settings
const nParticles = 10000;
const canvasSize = 600;

// pi
const pi = 3.1415926535;

// draw the underlying chladni function
let drawFunction = false;

function setup() {
  createCanvas(canvasSize, canvasSize);

  // sliders
  sliders = {
    m : select('#mSlider'), // freq param 1
    n : select('#nSlider'), // freq param 2
    v : select('#vSlider'), // velocity
    N : select('#Nslider'), // number
  }

  // particle array
  particles = [];
  for (let i = 0; i < nParticles; i++) {
    particles[i] = new Particle();
  }
}

function draw() {
  background(30);
  stroke(255);
  
  // update parameters via sliders
  m = sliders.m.value();
  n = sliders.n.value();
  v = sliders.v.value();
  N = sliders.N.value();
    
  // draw the function in the background
  if (drawFunction) {
  	let res = 3;
    for (let i = 0; i <= width; i+=res) {
      for (let j = 0; j <= height; j+=res) {
        let eq = chladni(i/width, j/height, a, b, m, n);
        noStroke();
        fill((eq + 1) * 127.5);
        square(i, j, res);
      }
    }
  }

  movingParticles = particles.slice(0, N);

  // particle movement
  for(let particle of movingParticles) {
    particle.move();
    particle.show();
  }
}

class Particle {
  constructor() {
    this.x = random(0,1);
    this.y = random(0,1);
    this.stochasticAmplitude;

    // this.color = [random(100,255), random(100,255), random(100,255)];
    
    this.updateOffsets();
  }

  move() {
    // what is our chladni value i.e. how much are we vibrating? (between -1 and 1, zeroes are nodes)
    let eq = chladni(this.x, this.y, a, b, m, n);

    // set the amplitude of the move -> proportional to the vibration
    this.stochasticAmplitude = v * abs(eq);

    if (this.stochasticAmplitude <= minWalk) this.stochasticAmplitude = minWalk;

    // perform one random walk
    this.x += random(-this.stochasticAmplitude, this.stochasticAmplitude);
    this.y += random(-this.stochasticAmplitude, this.stochasticAmplitude);
 
    this.updateOffsets();
  }

  updateOffsets() {
  	// handle edges
  	if (this.x <= 0) this.x = 0;
  	if (this.x >= 1) this.x = 1;
  	if (this.y <= 0) this.y = 0;
  	if (this.y >= 1) this.y = 1;

  	// convert to screen space
    this.xOff = width * this.x; // (this.x + 1) / 2 * width;
    this.yOff = height * this.y; // (this.y + 1) / 2 * height;
  }

  show() {
    // stroke(...this.color);
    point(this.xOff, this.yOff)
  }
}

// returns between -1 and 1
function chladni(x, y, a, b, m, n) {
  return a * sin(pi*n*x) * sin(pi*m*y) + b * sin(pi*m*x) * sin(pi*n*y);
}