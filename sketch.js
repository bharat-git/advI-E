/*

Example taken from ml5js repository:
https://github.com/ml5js/ml5-examples/tree/master/p5js/PoseNet

*/

let w = 640;
let h = 480;
let video;
let poseNet;
let poses = [];
let skeletons = [];

const particles = [];

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(random(-20, 20), random(-20, 20));
    this.size = 5;
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

    // 		if(this.pos.x > width) {
    // 			this.pos.x = 0;
    // 		}

    // 		if(this.pos.y > height) {
    // 			this.pos.y = 0;
    // 		}
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
  createCanvas(1300, 600);
  video = createCapture(VIDEO);

  poseNet = ml5.poseNet(video, modelLoaded);

  poseNet.on('pose', function (results) {
    poses = results;
  });

  const particlesLength = Math.min(Math.floor(window.innerWidth / 10), 100);
  for (let i = 0; i < particlesLength; i++) {
    particles.push(new Particle());
  }

  video.hide();
  fill(255);
  stroke(255);
}

function draw() {
  background(1000, 80);
  //image(video, 0, 0, w, h);
  particles.forEach((particle, idx) => {
    particle.update();
    particle.draw();
    //particle.checkParticles(particles.slice(idx));
  });
  drawKeypoints();
  drawSkeleton();
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
  console.log(poses);
  if (poses.length > 0) {
    const dist = poses[0].pose.keypoints[5].position.x - poses[0].pose.keypoints[6].position.x;
    console.log(dist);
    changeImages(dist);
  }
}

var prevMood = 'ok';
var currMood;
var velocity, color;
var changed = false;
function changeImages(dist) {
  if (dist < 180) {
    velocity = createVector(random(-1, 1), random(-1, 1));
    currMood = 'lonely';
    if (prevMood !== currMood)
      changed = true;
    color = 'rgba(0, 0, 255, 0.5)';
  }
  if (180 <= dist && dist < 280 ) {
    velocity = createVector(random(-10, 10), random(-10, 10));
    currMood = 'ok';
    if (prevMood !== currMood)
      changed = true;
    color = 'rgba(255, 0, 0, 0.5)';
  }
  if (dist >= 280) {
    velocity = createVector(random(-15, 15), random(-15, 15));
    currMood = 'sick';
    if (prevMood !== currMood)
      changed = true;
    color = 'rgba(0, 255, 0, 0.5)';
  }
  console.log(currMood);
  prevMood = currMood;
  if (changed) {
    console.log("changed !!!!!!!!!!!!!!!!");
    changed = false;
    particles.forEach((particle, idx) => {
      particle.changeParams(velocity, color);
    });
  }
}

function modelLoaded() {
  print('model loaded');
}


