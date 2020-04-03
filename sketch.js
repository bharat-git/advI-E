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

var Sickconverge, SickDisperse, Normalconverge, NormalDisperse, Lonelyconverge, LonelyDisperse;
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


  Sickconverge = createVideo(['videos/SickConverge.mov']);
  SickDisperse = createVideo(['videos/SickDisperse.mov']);
  Normalconverge = createVideo(['videos/NormalConverge.mov']);
  NormalDisperse = createVideo(['videos/NormalDisperse.mov']);
  Lonelyconverge = createVideo(['videos/LonelyConverge.mov']);
  LonelyDisperse = createVideo(['videos/LonelyDisperse.mov']);
  hideAllVideo();
  video.hide();
  fill(255);
  stroke(255);
}

function hideAllVideo() {
  Sickconverge.hide();
  SickDisperse.hide();
  Normalconverge.hide();
  NormalDisperse.hide();
  Lonelyconverge.hide();
  LonelyDisperse.hide();
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
var prevDistance;
var sickbool = true, lonelyBool = true, okbool = true;
function changeImages(dist) {



  if (dist < 130) {
    currMood = 'lonely';
    sickbool = okbool = true;
    if (lonelyBool) {
      lonelyBool = false;
      if (prevDistance > dist) {
        hideAllVideo();
        //Lonelyconverge.show();
        Lonelyconverge.play();
        image(Lonelyconverge, 420, 50, w, h);
      }
      else if (prevDistance < dist) {
        hideAllVideo();
        //LonelyDisperse.show();
        LonelyDisperse.play();
        image(LonelyDisperse, 420, 50, w, h);
      }
    }
  }
  if (130 <= dist && dist < 190) {
    drawParticles();
    velocity = createVector(random(-5, 5), random(-5, 5));
    currMood = 'ok';
    if (prevMood !== currMood)
      changed = true;
    color = 'rgba(0, 0, 255, 0.5)';
  }
  if (190 <= dist && dist < 250) {
    drawParticles();
    velocity = createVector(random(-10, 10), random(-10, 10));
    currMood = 'ok';
    if (prevMood !== currMood)
      changed = true;
    color = 'rgba(255, 0, 0, 0.5)';
  }
  if (250 <= dist && dist < 310) {
    lonelyBool = sickbool = true;
    currMood = 'ok';
    if (okbool) {
      okbool = false;

      if (prevDistance > dist) {
        hideAllVideo();
        // Normalconverge.show();
        Normalconverge.play();
        image(Normalconverge, 420, 50, w, h);
      }
      else if (prevDistance < dist) {
        hideAllVideo();
        // NormalDisperse.show();
        NormalDisperse.play();
        image(NormalDisperse, 420, 50, w, h);
      }
    }
  }
  if (310 <= dist && dist < 360) {
    drawParticles();
    velocity = createVector(random(-10, 10), random(-10, 10));
    currMood = 'ok';
    if (prevMood !== currMood)
      changed = true;
    color = 'rgba(255, 0, 0, 0.5)';
  }
  if (360 <= dist && dist < 410) {
    drawParticles();
    velocity = createVector(random(-20, 20), random(-20, 20));
    currMood = 'ok';
    if (prevMood !== currMood)
      changed = true;
    color = 'rgba(0, 255, 0, 0.5)';
  }
  if (dist >= 410) {
    currMood = 'sick';
    okbool = lonelyBool = true;
    if (sickbool) {
      sickbool = false;
      if (prevDistance > dist) {
        hideAllVideo();
        // SickDisperse.show();
        SickDisperse.play();
        image(SickDisperse, 420, 50, w, h);
      }
      else if (prevDistance < dist) {
        hideAllVideo();
        // Sickconverge.show();
        Sickconverge.play();
        image(Sickconverge, 420, 50, w, h);
      }
    }
  }
  console.log(currMood);
  prevMood = currMood;
  prevDistance = dist;
  if (changed) {
    changed = false;
    particles.forEach((particle, idx) => {
      particle.changeParams(velocity, color);
    });
  }
}

function modelLoaded() {
  print('model loaded');
}
