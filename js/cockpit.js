window.onload = () => {
  var myCanvas = document.getElementById("canvas");

  var ctx = myCanvas.getContext("2d");

  myCanvas.width = innerWidth;
  myCanvas.height = innerHeight;

  window.onresize = function () {
    myCanvas.width = innerWidth;
    myCanvas.height = innerHeight;
  };

  var Star = function () {
    this.myX = Math.random() * innerWidth;
    this.myY = Math.random() * innerHeight;
    this.myColor = 0;
  };

  var xMod = 0;
  var yMod = 0;

  Star.prototype.updatePos = function () {
    var speedMult = 0.02;
    if (warpSpeed) {
      speedMult = 0.028;
    }
    this.myX += xMod + (this.myX - innerWidth / 2) * speedMult;
    this.myY += yMod + (this.myY - innerHeight / 2) * speedMult;
    this.updateColor();

    if (this.myX > innerWidth || this.myX < 0) {
      this.myX = Math.random() * innerWidth;
      this.myColor = 0;
    }
    if (this.myY > innerHeight || this.myY < 0) {
      this.myY = Math.random() * innerHeight;
      this.myColor = 0;
    }
  };

  Star.prototype.updateColor = function () {
    if (this.myColor < 255) {
      this.myColor += 5;
    } else {
      this.myColor = 255;
    }
  };

  var starField = [];
  var starCounter = 0;

  while (starCounter < stars) {
    var newStar = new Star();
    starField.push(newStar);
    starCounter++;
  }

  function init() {
    myCanvas.focus();
    window.requestAnimationFrame(draw);
  }

  function draw(event) {
    if (warpSpeed == 0) {
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.fillRect(0, 0, innerWidth, innerHeight);
    }
    for (var i = 0; i < starField.length; i++) {
      ctx.fillStyle =
        "rgb(" +
        starField[i].myColor +
        "," +
        starField[i].myColor +
        "," +
        starField[i].myColor +
        ")";
      ctx.fillRect(
        starField[i].myX,
        starField[i].myY,
        starField[i].myColor / 128,
        starField[i].myColor / 128
      );
      starField[i].updatePos();
    }
    window.requestAnimationFrame(draw);
  }

  init();

};

var stars=300;
var warpSpeed = 0;


let button = document.getElementById("btn");
button.addEventListener("click", spawnCards);

function spawnCards() {
  const carouselItems = document.querySelectorAll(".carousel-item");
  gsap.fromTo(
    carouselItems,
    {
      opacity: 0, // Start fully transparent
      x: "100%", // Start offscreen to the right
    },
    {
      opacity: 1, // Fade in to full opacity
      x: "0%", // Move into the view
      duration: 1, // Duration of the animation for each item
      ease: "power3.out", // Smooth easing for the animation
      stagger: 0.2, // Stagger each item by 0.2 seconds
    }
  );
  button.hidden = true;

  // Your code here
}

const koi = document.getElementById('koi');
const proxima = document.getElementById('proxima');
const kepler452 = document.getElementById('kepler452');
const kepler186 = document.getElementById('kepler186');
const cancri = document.getElementById('cancri');

function handlePlanetClick() {
  stars = 1000;
  warpSpeed = 1;
  setTimeout(() => {
    window.location.href = '/pages/planet?tColor=%23441212&noiseFreq=0.3&maxHeight=40&octaves=8&per=0.4&lac=2.2&tScale=2&spd=600&fog=0.0001&tType=Solid';
  }, 100);
}

koi.addEventListener('click', handlePlanetClick);
proxima.addEventListener('click', handlePlanetClick);
kepler452.addEventListener('click', handlePlanetClick);
kepler186.addEventListener('click', handlePlanetClick);
cancri.addEventListener('click', handlePlanetClick);
