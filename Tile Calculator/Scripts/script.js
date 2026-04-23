// Theme toggle functionality
const modeSwitch = document.querySelector("#themeSwitchIcon");
let lightMode = true;
const body = document.querySelector("body");

// Theme toggle functionality
modeSwitch.onclick = () => {
  if (lightMode) {
    body.classList.add("dark-mode");
    modeSwitch.classList.remove("bi-moon-fill");
    modeSwitch.classList.add("bi-sun-fill");
  } else {
    body.classList.remove("dark-mode");
    modeSwitch.classList.remove("bi-sun-fill");
    modeSwitch.classList.add("bi-moon-fill");
  }
  lightMode = !lightMode;
};

// Navigation functionality
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", function (event) {
    event.preventDefault();

    // Remove active class from all links
    document.querySelectorAll(".nav-link").forEach((el) => {
      el.classList.remove("active");
    });

    // Add active class to clicked link
    this.classList.add("active");

    const section = this.getAttribute("data-section");
    showSection(section);
  });
});

// Start calculation button on home page
document.getElementById("startCalculation").addEventListener("click", () => {
  showSection("tile-estimation");
  document.querySelector('[data-section="tile-estimation"]').classList.add("active");
  document.querySelector('[data-section="home"]').classList.remove("active");
});

function showSection(section) {
  // Hide all sections
  document.querySelectorAll(".section-container").forEach((element) => {
    element.style.display = "none";
  });

  // Show the selected section
  document.getElementById(section).style.display = "block";
}

// Shared state to store inputs
let sharedInputs = {
  roomLength: null,
  roomWidth: null,
  tileLength: null,
  tileWidth: null,
  price: null,
  roomArea: null,
  tileArea: null,
  numberOfTiles: null,
  totalCost: null
};

// Input validation functions
function validateInput(inputId, errorId, minValue, errorMessage) {
  const inputElement = document.getElementById(inputId);
  const errorElement = document.getElementById(errorId);
  const value = Number.parseFloat(inputElement.value);

  // Clear previous error
  errorElement.textContent = "";
  inputElement.classList.remove("is-invalid");

  // Check if input is empty
  if (inputElement.value.trim() === "") {
    errorElement.textContent = "This field is required";
    inputElement.classList.add("is-invalid");
    return false;
  }

  // Check if input is a valid number
  if (isNaN(value)) {
    errorElement.textContent = "Please enter a valid number";
    inputElement.classList.add("is-invalid");
    return false;
  }

  // Check if input meets minimum value requirement
  if (value < minValue) {
    errorElement.textContent = errorMessage || `Value must be at least ${minValue}`;
    inputElement.classList.add("is-invalid");
    return false;
  }

  return true;
}

function validateAllInputs() {
  const isRoomLengthValid = validateInput("roomLength", "roomLengthError", 0.1, "Room length must be at least 0.1m");
  const isRoomWidthValid = validateInput("roomWidth", "roomWidthError", 0.1, "Room width must be at least 0.1m");
  const isTileLengthValid = validateInput("tileLength", "tileLengthError", 1, "Tile length must be at least 1cm");
  const isTileWidthValid = validateInput("tileWidth", "tileWidthError", 1, "Tile width must be at least 1cm");
  const isPriceValid = validateInput("price", "priceError", 0, "Price cannot be negative");

  return isRoomLengthValid && isRoomWidthValid && isTileLengthValid && isTileWidthValid && isPriceValid;
}

// Tile calculation logic
document.getElementById("calculateBtn").addEventListener("click", () => {
  // Validate all inputs
  if (!validateAllInputs()) {
    return;
  }

  // Get input values
  const roomLength = Number.parseFloat(document.getElementById("roomLength").value);
  const roomWidth = Number.parseFloat(document.getElementById("roomWidth").value);
  const tileLength = Number.parseFloat(document.getElementById("tileLength").value);
  const tileWidth = Number.parseFloat(document.getElementById("tileWidth").value);
  const price = Number.parseFloat(document.getElementById("price").value);

  // Perform calculations
  const roomArea = roomLength * roomWidth; // Room area in m²
  const tileArea = tileLength/100 * tileWidth/100; // Tile area in m²
  const numberOfTilesWithoutWaste = roomArea / tileArea; // Tiles needed without waste
  const wasteTiles = numberOfTilesWithoutWaste * 0.10; // 10% extra tiles for waste
  const numberOfTiles = Math.ceil(numberOfTilesWithoutWaste + wasteTiles); // Total tiles needed (including waste)
  const totalCost = numberOfTiles * price; // Total cost of tiles
  const wasteFactor = (wasteTiles / numberOfTilesWithoutWaste) * 100; // Waste factor as a percentage

  // Display results
  const resultsElement = document.getElementById("tileResults");
  resultsElement.innerHTML = `
    <h3>Results</h3>
    <p><strong>Room Area:</strong> ${roomArea.toFixed(2)} m²</p>
    <p><strong>Tile Area:</strong> ${tileArea.toFixed(4)} m²</p>
    <p><strong>Number of Tiles Needed:</strong> ${numberOfTiles}</p>
    <p><strong>Total Cost:</strong> R${totalCost.toFixed(2)}</p>
    <p><strong>Waste Factor:</strong> ${wasteFactor.toFixed(2)}%</p>
  `;

  // Show the Done button
  document.getElementById("doneBtn").style.display = "block";
});

// Calculate waste factor.... here we calculate the waste we should put there on top when compiling the tile result
/*function calculateWasteFactor() {
  const exactTiles = sharedInputs.roomArea / sharedInputs.tileArea;
  const wasteFactor = ((sharedInputs.numberOfTiles - exactTiles) / sharedInputs.numberOfTiles) * 100;
  return wasteFactor;!!! this section should be in the calculation and display up ^
}*/

// Reset button functionality
document.getElementById("resetBtn").addEventListener("click", () => {
  document.getElementById("tileForm").reset();
  document.getElementById("tileResults").innerHTML = `
    <h3>Results</h3>
    <p>Calculated results will be displayed here.</p>
  `;
  document.getElementById("doneBtn").style.display = "none";
  
  // Clear error messages
  document.querySelectorAll(".error-message").forEach(el => {
    el.textContent = "";
  });
  
  // Remove invalid class from inputs
  document.querySelectorAll("input").forEach(el => {
    el.classList.remove("is-invalid");
  });
});

// Done button functionality
document.getElementById("doneBtn").addEventListener("click", () => {
  showSection("survey");
  document.querySelector('[data-section="survey"]').classList.add("active");
  document.querySelector('[data-section="tile-estimation"]').classList.remove("active");
});

// Survey validation class
class SurveyValidator {
  constructor() {
    this.form = document.getElementById("surveyForm");
    this.nameInput = document.getElementById("name");
    this.emailInput = document.getElementById("email");
    this.ratingInput = document.getElementById("rating");
    this.feedbackInput = document.getElementById("feedback");
    
    this.nameError = document.getElementById("nameError");
    this.emailError = document.getElementById("emailError");
    this.ratingError = document.getElementById("ratingError");
    
    this.thankYouMessage = document.getElementById("thankYouMessage");
  }
  
  validateName() {
    if (this.nameInput.value.trim() === "") {
      this.nameError.textContent = "Please enter your name";
      this.nameInput.classList.add("is-invalid");
      return false;
    }
    this.nameError.textContent = "";
    this.nameInput.classList.remove("is-invalid");
    return true;
  }
  
  validateEmail() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.emailInput.value.trim() === "") {
      this.emailError.textContent = "Please enter your email";
      this.emailInput.classList.add("is-invalid");
      return false;
    }
    if (!emailRegex.test(this.emailInput.value)) {
      this.emailError.textContent = "Please enter a valid email address";
      this.emailInput.classList.add("is-invalid");
      return false;
    }
    this.emailError.textContent = "";
    this.emailInput.classList.remove("is-invalid");
    return true;
  }
  
  validateRating() {
    if (this.ratingInput.value === "") {
      this.ratingError.textContent = "Please select a rating";
      this.ratingInput.classList.add("is-invalid");
      return false;
    }
    this.ratingError.textContent = "";
    this.ratingInput.classList.remove("is-invalid");
    return true;
  }
  
  validateAll() {
    const isNameValid = this.validateName();
    const isEmailValid = this.validateEmail();
    const isRatingValid = this.validateRating();
    
    return isNameValid && isEmailValid && isRatingValid;
  }
  
  showThankYouMessage() {
    this.form.style.display = "none";
    this.thankYouMessage.style.display = "block";
    
    // Redirect to home page after 5 seconds
    setTimeout(() => {
      showSection("home");
      document.querySelector('[data-section="home"]').classList.add("active");
      document.querySelector('[data-section="survey"]').classList.remove("active");
      
      // Reset the survey form
      this.form.reset();
      this.form.style.display = "block";
      this.thankYouMessage.style.display = "none";
    }, 5000);
  }
}

// Initialize survey validator
const surveyValidator = new SurveyValidator();

// Survey submit button functionality
document.getElementById("submitSurveyBtn").addEventListener("click", () => {
  if (surveyValidator.validateAll()) {
    surveyValidator.showThankYouMessage();
  }
});

// Initialize the app by showing the home section
showSection("home");

document.addEventListener('DOMContentLoaded', function() {
  // Add names to team members
  const members = document.querySelectorAll('#contact-us .member');
  const names = [
    "Ernest Malatji",
    "Milano Faarland",
    "Mthokozisi Justice",
    "Siyanda Nkosi",
    "Sharon Lesele",
    "Fortune Ntokozo"
  ];
  
  members.forEach((member, index) => {
    if (index < names.length) {
      member.setAttribute('data-name', names[index]);
    }
  });
});

//Gallery functionality

// Function to open the full image
function openFullImg(src) {
  const fullImgContainer = document.getElementById("fullImgContainer");
  const fullImg = document.getElementById("fullImg");

  // Set the source of the full image
  fullImg.src = src;

  // Display the full image container
  fullImgContainer.style.display = "flex";
}

// Function to close the full image
function closeFullImg() {
  const fullImgContainer = document.getElementById("fullImgContainer");

  // Hide the full image container
  fullImgContainer.style.display = "none";
}

// Add event listener to the close button
document.getElementById("closeBtn").addEventListener("click", closeFullImg);

//MOBILE DEVICE MENU FUNCTIONALITY
function toggleMenu() {
  document.getElementById("Sidebar").classList.toggle("active");
   // Close sidebar on link click (mobile)
   document.querySelectorAll('.sidebar .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const sidebar = document.getElementById('Sidebar');
      if (window.innerWidth <= 768 && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
      }
    });
  });
}
// Collapse sidebar when toggle button clicked
document.getElementById("toggleSidebar").addEventListener("click", function () {
  const sidebar = document.getElementById("Sidebar");

  // Toggle hidden 
  sidebar.classList.toggle("hidden");

  // Change arrows direction
  this.textContent = sidebar.classList.contains("hidden") ? "→" : "←";
});


function storeTileData() {
  

  const roomLength = document.getElementById("roomLength").value;
  const roomWidth = document.getElementById("roomWidth").value;
  const tileLength = document.getElementById("tileLength").value;
  const tileWidth = document.getElementById("tileWidth").value;
  const price = document.getElementById("price").value;


  const tileData = {
      roomLength,
      roomWidth,
      tileLength,
      tileWidth,
      price,
      timestamp: new Date().toISOString()
  };

  
  let storedTileData = JSON.parse(localStorage.getItem("tileData")) || [];

  
  storedTileData.push(tileData);

  
  localStorage.setItem("tileData", JSON.stringify(storedTileData));

  alert("Tile data has been saved successfully!");
}


document.getElementById("calculateBtn").addEventListener("click", storeTileData);


function storeSurveyData() {
  
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const rating = document.getElementById("rating").value;
  const feedback = document.getElementById("feedback").value;

  
  const surveyData = {
      name,
      email,
      rating,
      feedback,
      timestamp: new Date().toISOString() 
  };

  
  let storedSurveyData = JSON.parse(localStorage.getItem("surveyData")) || [];

  
  storedSurveyData.push(surveyData);

  
  localStorage.setItem("surveyData", JSON.stringify(storedSurveyData));

  alert("Survey data has been saved successfully!");
}


document.getElementById("submitSurveyBtn").addEventListener("click", storeSurveyData);


function displaySurveyData() {
  const storedSurveyData = JSON.parse(localStorage.getItem("surveyData")) || [];
  
  const resultBox = document.getElementById("surveyResults");
  resultBox.innerHTML = "";

  storedSurveyData.forEach(data => {
      const div = document.createElement("div");
      div.classList.add("survey-result");
      div.innerHTML = `
          <p>Name: ${data.name}</p>
          <p>Email: ${data.email}</p>
          <p>Rating: ${data.rating}</p>
          <p>Feedback: ${data.feedback}</p>
          <p>Submitted on: ${data.timestamp}</p>
          <hr>
      `;
      resultBox.appendChild(div);
  });
}


displaySurveyData();



function displayTileData() {
  const storedTileData = JSON.parse(localStorage.getItem("tileData")) || [];
  
  const resultBox = document.getElementById("tileResults");
  resultBox.innerHTML = "";

  storedTileData.forEach(data => {
      const div = document.createElement("div");
      div.classList.add("tile-result");
      div.innerHTML = `
          <p>Room Dimensions: ${data.roomLength}m x ${data.roomWidth}m</p>
          <p>Tile Dimensions: ${data.tileLength}cm x ${data.tileWidth}cm</p>
          <p>Price per Tile: R${data.price}</p>
          <p>Calculated on: ${data.timestamp}</p>
          <hr>
      `;
      resultBox.appendChild(div);
  });
}


displayTileData();



function clearSurveyData() {
  localStorage.removeItem("surveyData");
  alert("Survey data has been cleared!");
}


function clearTileData() {
  localStorage.removeItem("tileData");
  alert("Tile data has been cleared!");
}



document.getElementById("calculateBtn").addEventListener("click", function () {
  const roomLength = document.getElementById("roomLength").value;
  const roomWidth = document.getElementById("roomWidth").value;
  const tileLength = document.getElementById("tileLength").value;
  const tileWidth = document.getElementById("tileWidth").value;
  const price = document.getElementById("price").value;

  
  const roomArea = roomLength * roomWidth;
  const tileArea = (tileLength * tileWidth) / 10000; 
  const tilesNeeded = Math.ceil(roomArea / tileArea);
  const totalCost = tilesNeeded * price;

  
  const tileResults = {
      roomLength: roomLength,
      roomWidth: roomWidth,
      tileLength: tileLength,
      tileWidth: tileWidth,
      price: price,
      quantity: tilesNeeded,
      totalCost: totalCost
  };

  sessionStorage.setItem("tileResults", JSON.stringify(tileResults));

  
  document.getElementById("tileResults").style.display = "block";
});