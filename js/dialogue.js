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
      this.avatarContainer.style.bottom = "20%";
      this.avatarContainer.style.left = "5%";
      this.avatarContainer.style.zIndex = "999"; // Above the dialogue box
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
      this.dialogueContainer.style.padding = "30px 20px 100px 20px";
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

      // Create options container
      this.optionsContainer = document.createElement("div");
      this.optionsContainer.id = "options-container";
      this.optionsContainer.style.display = "flex";
      this.optionsContainer.style.flexDirection = "column";
      this.optionsContainer.style.marginTop = "10px";
      this.dialogueBox.appendChild(this.optionsContainer);

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
      console.log(this.currentDialogue)
      const dialogue = this.dialogues[index];
      this.characterName.textContent = `${dialogue.name}: `;
      this.dialogueText.textContent = dialogue.text;
      this.avatar.src = dialogue.avatar;

      // Show the overlay
      this.dialogueContainer.style.display = "flex";
      this.avatarContainer.style.display = "block";
      this.isActive = true;

      // Check if there are options
      if (dialogue.options) {
        // Hide nextButton
        this.nextButton.style.display = "none";

        // Clear previous options
        this.optionsContainer.innerHTML = "";

        // Display options as buttons
        dialogue.options.forEach((optionText) => {
          const optionButton = document.createElement("button");
          optionButton.innerText = optionText;
          optionButton.style.marginBottom = "5px";
          optionButton.style.padding = "10px";
          optionButton.style.backgroundColor = "#fff";
          optionButton.style.color = "black";
          optionButton.style.border = "none";
          optionButton.style.borderRadius = "5px";
          optionButton.style.cursor = "pointer";

          optionButton.addEventListener("click", () => {
            // Handle option selection
            this.handleOptionSelection(dialogue, optionText);
          });

          this.optionsContainer.appendChild(optionButton);
        });
      } else {
        // Show nextButton
        this.nextButton.style.display = "block";
        // Hide optionsContainer
        this.optionsContainer.innerHTML = "";
      }
    }

    handleOptionSelection(dialogue, optionText) {
      if (optionText === "quit") {
        // End dialogue
        this.dialogueContainer.style.display = "none";
        this.avatarContainer.style.display = "none";
        this.isActive = false;
      } else {
        console.log(optionText)
        // Get response
        const responseKey = optionText.replace(/\s+/g, '_').replace(/\W/g, '');
        const response = dialogue.responses[responseKey];

        // console.log(response)
        // console.log(responseKey)


        if (response) {

          const responseDialogue = {
            name: dialogue.name,
            text: response.text,
            avatar: dialogue.avatar,
          };
          console.log(responseDialogue)

          // Replace current dialogue with response and options dialogue
          this.dialogues.splice(this.currentDialogue, 1, responseDialogue, dialogue);

          // Proceed to next dialogue (which is the response)
          // console.log(this.dialogues)
          this.showDialogue(this.currentDialogue)
          // this.showNextDialogue();
        } else {
          console.error("No response found for option:", optionText);
        }
      }
    }
  
    start() {
      this.currentDialogue = 0;
      this.showDialogue(this.currentDialogue);
    }
  
    isDialogueActive() {
      return this.isActive;
    }
  }
