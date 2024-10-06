
import '../css/planet.css';
export class DialogueSystem {
    constructor(dialogues) {
      this.dialogues = dialogues;
      this.currentDialogue = 0;
      this.isActive = false;
  
      // Create the overlay elements
      this.createDialogueOverlay();
    }
  
    createDialogueOverlay() {
        // Create avatar container outside of the dialogue
        this.avatarContainer = document.createElement("div");
        this.avatarContainer.id = "avatar-container";
        this.avatarContainer.style.position = "absolute";
        this.avatarContainer.style.bottom = "15%";
        this.avatarContainer.style.left = "5%";
        this.avatarContainer.style.zIndex = "1001"; // Above the dialogue box
        this.avatarContainer.style.display = "none"; // Ensure it's hidden initially
        document.body.appendChild(this.avatarContainer);
      
        // Create avatar image
        this.avatar = document.createElement("img");
        this.avatar.id = "avatar";
        this.avatar.style.width = "300px";
        this.avatar.style.height = "400px";
        this.avatar.style.objectFit = "contain";
        this.avatar.style.borderRadius = "10px";
        // this.avatar.style.background = "rgba(0, 0, 0, 0.5)"; // Optional for the hologram effect
        this.avatarContainer.appendChild(this.avatar);
      
        // Create dialogue overlay container
        this.dialogueContainer = document.createElement("div");
        this.dialogueContainer.id = "dialogue-overlay";
        this.dialogueContainer.style.position = "absolute";
        this.dialogueContainer.style.bottom = "10%";
        this.dialogueContainer.style.width = "90%";
        this.dialogueContainer.style.left = "5%";
        this.dialogueContainer.style.display = "flex";
        this.dialogueContainer.style.justifyContent = "space-between";
        this.dialogueContainer.style.alignItems = "center"; // Align items vertically center
        this.dialogueContainer.style.background = "rgba(0, 0, 0, 0.4)";
        this.dialogueContainer.style.color = "white";
        this.dialogueContainer.style.padding = "20px";
        this.dialogueContainer.style.borderRadius = "10px";
        this.dialogueContainer.style.fontFamily = "Urbanist, sans-serif";
        this.dialogueContainer.style.zIndex = "1000";
        this.dialogueContainer.style.padding = "40px 30px 20px 10px";
        this.dialogueContainer.style.display = "none"; // Ensure it's hidden initially
        document.body.appendChild(this.dialogueContainer);
      
        // Create dialogue text container
        this.dialogueBox = document.createElement("div");
        this.dialogueBox.id = "dialogue-box";
        this.dialogueBox.style.flex = "4";
        this.dialogueBox.style.fontSize = "18px";
        this.dialogueBox.style.lineHeight = "1.5";
        this.dialogueContainer.appendChild(this.dialogueBox);
      
        // Character name
        this.characterName = document.createElement("span");
        this.characterName.id = "character-name";
        this.characterName.style.color = "#0096ff";
        this.characterName.style.fontWeight = "bold";
        this.dialogueBox.appendChild(this.characterName);
      
        this.dialogueText = document.createElement("span");
        this.dialogueText.id = "dialogue-text";
        this.dialogueBox.appendChild(this.dialogueText);
      
        // Next button, aligned to the right
        this.nextButton = document.createElement("button");
        this.nextButton.id = "next-button";
        this.nextButton.style.padding = "10px 20px";
        this.nextButton.style.backgroundColor = "#fff";
        this.nextButton.style.color = "black";
        this.nextButton.style.border = "none";
        this.nextButton.style.borderRadius = "5px";
        this.nextButton.style.cursor = "pointer";
        this.dialogueContainer.appendChild(this.nextButton);
      
        // Handle Next button click
        this.nextButton.innerText = "Next";
        this.nextButton.addEventListener("click", () => this.showNextDialogue());
      }
        
    showNextDialogue() {
      this.currentDialogue++;
  
      if (this.currentDialogue < this.dialogues.length) {
        this.showDialogue(this.currentDialogue);
      } else {
        // Hide dialogue overlay when finished
        this.dialogueContainer.style.display = "none";
        this.avatarContainer.style.display = "none";
        this.isActive = false;
      }
    }
  
    showDialogue(index) {
      const dialogue = this.dialogues[index];
      this.characterName.textContent = `${dialogue.name}: `;
      this.dialogueText.textContent = dialogue.text;
      this.avatar.src = dialogue.avatar;
  
      // Show the overlay
      this.dialogueContainer.style.display = "flex";
      this.avatarContainer.style.display = "block";
      this.isActive = true;
    }
  
    start() {
      this.currentDialogue = 0;
      this.showDialogue(this.currentDialogue);
    }
  
    isDialogueActive() {
      return this.isActive;
    }
  }
  