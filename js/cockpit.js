import p1 from "../videos/pls/1.gif";
import p2 from "../videos/pls/2.gif";
import p3 from "../videos/pls/3.gif";
import p4 from "../videos/pls/4.gif";
import p5 from "../videos/pls/5.gif";
import p6 from "../videos/pls/6.gif";
import p7 from "../videos/pls/7.gif";
import p8 from "../videos/pls/8.gif";
import p9 from "../videos/pls/9.gif";
import p10 from "../videos/pls/10.gif";
import p11 from "../videos/pls/11.gif";
import p12 from "../videos/pls/12.gif";
import p13 from "../videos/pls/13.gif";
import p14 from "../videos/pls/14.gif";
import p15 from "../videos/pls/15.gif";
import p16 from "../videos/pls/16.gif";
import p17 from "../videos/pls/17.gif";
import p18 from "../videos/pls/18.gif";
import p19 from "../videos/pls/19.gif";
import p20 from "../videos/pls/20.gif";
import p21 from "../videos/pls/21.gif";
import p22 from "../videos/pls/22.gif";
import p23 from "../videos/pls/23.gif";
import p24 from "../videos/pls/24.gif";
import p25 from "../videos/pls/25.gif";
import p26 from "../videos/pls/26.gif";
import { gsap } from 'gsap';

const planetvideos = [
  p1,
  p2,
  p3,
  p4,
  p5,
  p6,
  p7,
  p8,
  p9,
  p10,
  p11,
  p12,
  p13,
  p14,
  p15,
  p16,
  p17,
  p18,
  p19,
  p20,
  p21,
  p22,
  p23,
  p24,
  p25,
  p26,
];

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

var stars = 300;
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
}

const carousel = document.getElementById("carousel");
const leftArrow = document.getElementById("left-arrow");
const rightArrow = document.getElementById("right-arrow");

leftArrow.addEventListener("click", () => {
  carousel.scrollBy({ left: -300, behavior: "smooth" });
});

rightArrow.addEventListener("click", () => {
  carousel.scrollBy({ left: 300, behavior: "smooth" });
});

fetch("/planets.json")
  .then((response) => response.json())
  .then((data) => {
    data.forEach((p) => {
      let temp = document.createElement("div");
      temp.classList.add("carousel-item");
      temp.innerHTML = `
      <div class="planet-info" id="${p.id}">
          <h2>${p.name}</h2>
          <img class="pgif" src="../videos/pls/${p.id}.gif" alt="">
      </div>`;
      temp.addEventListener("click", (e) => {
        console.log(p.name);

        window.location.href = `/pages/planet.html?${encodeToUrlEncoded(p)}`;
      });
      carousel.appendChild(temp);
    });
  });

function encodeToUrlEncoded(json) {
  return Object.keys(json)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(json[key]))
    .join("&");
}
