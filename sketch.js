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

const particles = [];

var sickImage, okImage, lonelyImage;

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

  changeParams(v, c, s) {
    this.vel = v;
    this.color = c;
    this.size = s;
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


  sickImage = loadImage('images/sick.png');
  okImage = loadImage('images/ok.jpg');
  lonelyImage = loadImage('images/lonely.png');

  video.hide();
  fill(255);
  stroke(255);
}

function draw() {
  background(1000, 80);
  //image(sickImage, 0, 0, w, h);
  drawKeypoints();
  drawSkeleton();
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
  console.log(poses);
  if (poses.length > 0) {
    const dist = poses[0].pose.keypoints[5].position.x - poses[0].pose.keypoints[6].position.x;
    console.log(dist);
    changeImages(dist);
  }
}

var prevMood = 'ok';
var currMood;
var velocity, color, size = 0;
var changed = false;
function changeImages(dist) {



  if (dist < 130) {

    image(lonelyImage, 420, 50, w, h);
  }
  if (130 <= dist && dist < 190) {
    drawParticles();
    velocity = createVector(random(-1, 1), random(-1, 1));
    currMood = 'lonely';
    if (prevMood !== currMood)
      changed = true;
    color = 'rgba(0, 0, 255, 0.5)';
    size += 1;
  }
  if (190 <= dist && dist < 250) {
    drawParticles();
    velocity = createVector(random(-10, 10), random(-10, 10));
    currMood = 'ok';
    if (prevMood !== currMood)
      changed = true;
    color = 'rgba(255, 0, 0, 0.5)';
    size -= 1;
  }
  if (250 <= dist && dist < 310) {
    image(okImage, 420, 50, w, h);
  }
  if (310 <= dist && dist < 360) {
    drawParticles();
    velocity = createVector(random(-10, 10), random(-10, 10));
    currMood = 'ok';
    if (prevMood !== currMood)
      changed = true;
    color = 'rgba(255, 0, 0, 0.5)';
    size += 1;
  }
  if (360 <= dist && dist < 410) {
    drawParticles();
    velocity = createVector(random(-15, 15), random(-15, 15));
    currMood = 'sick';
    if (prevMood !== currMood)
      changed = true;
    color = 'rgba(0, 255, 0, 0.5)';
    size -= 1;
  }
  if (dist >= 410) {
    image(sickImage, 420, 50, w, h);

  }
  console.log(currMood);


  prevMood = currMood;
  if (changed) {
    changed = false;
    if (size > 5) {
      size = 5;
    }
    else if (size < 0) {
      size = 2;
    }
    particles.forEach((particle, idx) => {
      particle.changeParams(velocity, color, size);
    });
  }
}

function modelLoaded() {
  print('model loaded');
}


