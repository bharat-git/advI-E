
// function setup() {}

// function draw(){

// }


var video = document.getElementById("myVideo");

setInterval(function(){
  
  console.log(video.duration+ "---------"+video.currentTime);
}, 100);

video.addEventListener('click',event =>{
  console.log("clicked");
  video.currentTime -= 2;
})