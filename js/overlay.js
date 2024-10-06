import prof from '../images/prof.png';
import '../css/planet.css';
import { color } from 'dat.gui';
export class OverlaySystem {
  constructor(planetInfo, callback) {
    this.planetInfo = planetInfo;
    this.callback = callback;
    this.isActive = false;
    // Create the overlay elements
    this.createOverlay();
    this.createToggleText();

    // Listen for keypresses to show the overlay
    document.addEventListener("keydown", (event) => {
      if (event.key.toLowerCase() === "o" && !this.isActive) {
        this.showOverlay();
      }
    });
  }

  createOverlay() {
    // Create overlay container
    this.overlayContainer = document.createElement("div");
    this.overlayContainer.style.fontFamily = '"Urbanist", sans-serif';
    this.overlayContainer.id = "overlay-container";
    Object.assign(this.overlayContainer.style, {
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      background: "rgba(0, 0, 0, 0.3)",
      color: "white",
      zIndex: "1000",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    });
    document.body.appendChild(this.overlayContainer);

    // Create hide button
    this.hideButton = document.createElement("button");
    this.hideButton.id = "hide-button";
    this.hideButton.innerText = "❍ Hide Text";
    Object.assign(this.hideButton.style, {
      color: "white",
      position: "absolute",
      top: "20px",
      left: "20px",
      padding: "10px",
      background: "rgba(255, 255, 255, 0.0)",
      border: "none",
      cursor: "pointer",
      fontSize: "1.2rem",
    });
    this.hideButton.addEventListener("click", () => this.hideOverlay());
    this.overlayContainer.appendChild(this.hideButton);

    // Content container
    const overlayContent = document.createElement("div");
    overlayContent.id = "overlay-content";
    Object.assign(overlayContent.style, {
      padding: "40px",
      display: "flex",
      justifyContent: "space-between",
    });
    this.overlayContainer.appendChild(overlayContent);

    // Left panel for title and description
    const leftPanel = document.createElement("div");
    leftPanel.id = "left-panel";
    Object.assign(leftPanel.style, {
      flex: "1",
      maxWidth: "50%",
    });
    overlayContent.appendChild(leftPanel);

    const title = document.createElement("h1");
    title.innerText = this.planetInfo.name;
    title.style.fontFamily = '"Naza", sans-serif';
    Object.assign(title.style, {
      fontSize: "4rem",
      marginBottom: "1rem",
    });
    leftPanel.appendChild(title);

    const description = document.createElement("p");
    description.innerText = this.planetInfo.description;
    Object.assign(description.style, {
      fontSize: "1.5rem",
    });
    leftPanel.appendChild(description);

    const distance = document.createElement("p");
    distance.innerText = `You are ${this.planetInfo.distance} light years from Earth`;
    Object.assign(distance.style, {
      fontSize: "1.5rem",
      marginTop: "20px",
    });
    leftPanel.appendChild(distance);

    // Right panel for planet properties
    const rightPanel = document.createElement("div");
    rightPanel.id = "right-panel";
    Object.assign(rightPanel.style, {
      flex: "1",
      maxWidth: "40%",
      textAlign: "right",
    });
    overlayContent.appendChild(rightPanel);

    const planetDetails = `
        <p><strong>Planet Type:</strong> ${this.planetInfo.type}</p>
        <p><strong>Habitable?:</strong> ${this.planetInfo.habitable}</p>
        <p><strong>Discovered in:</strong> ${this.planetInfo.discoveryYear}</p>
        <p><strong>Detection Method:</strong> ${this.planetInfo.detectionMethod}</p>
        <p><strong>Observed by:</strong> ${this.planetInfo.observedBy}</p>
        <p><strong>Orbital Radius:</strong> ${this.planetInfo.orbitalRadius}</p>
        <p><strong>Orbital Period:</strong> ${this.planetInfo.orbitalPeriod}</p>
        <p><strong>Orbital Eccentricity:</strong> ${this.planetInfo.orbitalEccentricity}</p>
      `;
    rightPanel.innerHTML = planetDetails;
    Object.assign(rightPanel.querySelectorAll("p"), {
      fontSize: "1.2rem",
      margin: "5px 0",
    });

    // Character image at bottom right
    const characterImage = document.createElement("img");
    // characterImage.src = this.planetInfo.characterImage;
    characterImage.src = prof
    characterImage.alt = "Character Image";
    characterImage.onclick = () => {
        this.hideOverlay();
        this.callback();
    };
    Object.assign(characterImage.style, {
      position: "absolute",
      bottom: "20px",
      right: "20px",
      width: "150px",
      height: "150px",
      borderRadius: "50%",
      border: "5px solid white",
      objectFit: "cover",
    });
    this.overlayContainer.appendChild(characterImage);
  }

  createToggleText() {
    // Create the text that stays visible when overlay is hidden
    this.toggleText = document.createElement("p");
    this.toggleText.innerText = "Press 'O' to show overlay";
    Object.assign(this.toggleText.style, {
      position: "absolute",
      bottom: "10px",
      right: "10px",
      fontSize: "1.5rem",
      color: "white",
      background: "rgba(0, 0, 0, 0.5)",
      padding: "10px",
      borderRadius: "5px",
      zIndex: "999", // Ensure it's above everything except overlay
      display: "none", // Initially hidden
    });
    document.body.appendChild(this.toggleText);
  }

  showOverlay() {
    this.overlayContainer.style.display = "flex";
    this.toggleText.style.display = "none";
    this.isActive = true;
  }

  hideOverlay() {
    this.overlayContainer.style.display = "none";
    this.toggleText.style.display = "block";
    this.isActive = false;
  }

  isOverlayActive() {
    return this.isActive;
  }
}
