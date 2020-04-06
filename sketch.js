/*

Example taken from ml5js repository:
https://github.com/ml5js/ml5-examples/tree/master/p5js/PoseNet

*/

let h = 640;
let w = 480;
let video;
let poseNet;
let poses = [];
let skeletons = [];
let canvas;

const particles = [];

let totalTime;

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(-20, 20);
    this.size = 4;
    this.color = 'rgba(0, 255, 0, 0.5)';
  }

  update() {
    this.pos.add(this.vel);
    this.edges();
  }

  changeParams(v, c) {
    this.vel = v;
    this.color = c;
  }

  draw() {
    noStroke();
    fill(this.color);
    circle(this.pos.x, this.pos.y, this.size * 2);
  }

  edges() {
    if (this.pos.x < 0 || this.pos.x > width) {
      this.vel.x *= -1;
    }

    if (this.pos.y < 0 || this.pos.y > height) {
      this.vel.y *= -1;
    }
  }

  checkParticles(particles) {
    particles.forEach(particle => {
      const d = dist(this.pos.x, this.pos.y, particle.pos.x, particle.pos.y);
      if (d < 120) {
        const alpha = map(d, 0, 120, 0, 0.25)
        stroke(`rgba(255, 255, 255, ${alpha})`);
        line(this.pos.x, this.pos.y, particle.pos.x, particle.pos.y)
      }
    });
  }
}


function setup() {

  
  canvas = createCanvas(1378, 750);
  canvas.style('z-index', '1');
  capture = createCapture(VIDEO);

  video = createVideo(['FinalestFinal.mov']);
  video.position(200,100);
  video.play();
  video.hide();
  poseNet = ml5.poseNet(capture, modelLoaded);

  poseNet.on('pose', function (results) {
    poses = results;
  });

  const particlesLength = 500;
  for (let i = 0; i < particlesLength; i++) {
    particles.push(new Particle());
  }


  capture.hide();
  fill(255);
  stroke(255);
}

function draw() {
  background(1380, 80);
  image(video, 0, 0, 1378, 750);
  totalTime = video.duration();
  drawKeypoints();
 // drawSkeleton();
}



function drawParticles() {
  particles.forEach((particle, idx) => {
    particle.update();
    particle.draw();
  });
}

function drawSkeleton() {
  for (let i = 0; i < poses.length; i++) {
    for (let j = 0; j < poses[i].skeleton.length; j++) {
      let partA = poses[i].skeleton[j][0];
      let partB = poses[i].skeleton[j][1];
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}

function drawKeypoints() {
  for (let i = 0; i < poses.length; i++) {
    for (let j = 0; j < poses[i].pose.keypoints.length; j++) {
      let keypoint = poses[i].pose.keypoints[j];
      // if (keypoint.score > 0.2) {
      //   ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      // }
    }
  }
  if (poses.length > 0) {
    const dist = poses[0].pose.keypoints[5].position.x - poses[0].pose.keypoints[6].position.x;
    console.log(dist);
    changevideoTime(dist);
  }
}

var currMood, prevMood, changed; 
var velocity, clr = 'rgba(0, 0, 255, 0.5)';
function changevideoTime(dist) {

  if (dist < 100) {
    currMood = 'lonely-complete';
    video.time(0);
  }
  if (100 <= dist && dist < 160) {
    video.time(floor((dist-100)/10));
    drawParticles();
    velocity = createVector(-5, 5);
    currMood = 'lonely';
    if (prevMood !== currMood)
      changed = true;
      clr = 'rgba(0, 0, 255, 0.5)';
  }
  if (160<= dist && dist < 220) {
    video.time(floor((dist-100)/10));
    drawParticles();
    velocity = createVector(-10, 10);
    currMood = 'ok-partial';
    if (prevMood !== currMood)
      changed = true;
      clr = 'rgba(255, 0, 0, 0.5)';
  }
  if (220 <= dist && dist < 280) {
    currMood = 'ok';
    video.time(16);
  }
  if (280 <= dist && dist < 340) {
    video.time(floor((dist-100)/10));
    drawParticles();
    velocity = createVector(-10, 10);
    currMood = 'ok';
    if (prevMood !== currMood)
      changed = true;
      clr = 'rgba(255, 0, 0, 0.5)';
  }
  if (340 <= dist && dist < 400) {
    video.time(floor((dist-100)/10));
    drawParticles();
    velocity = createVector(-20,20);
    currMood = 'sick-partial';
    if (prevMood !== currMood)
      changed = true;
      clr = 'rgba(0, 255, 0, 0.5)';
  }
  if (dist >= 400) {
    currMood = 'sick';
    video.time(totalTime-1);
  }
  console.log(currMood);
  prevMood = currMood;
  prevDistance = dist;
  if (changed) {
    changed = false;
    particles.forEach((particle, idx) => {
      particle.changeParams(velocity, clr);
    });
  }
}

function modelLoaded() {
  print('model loaded');
}


