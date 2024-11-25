// DOM Elements
const hatStatus = document.getElementById('hatStatus');
const hatNumberSpan = document.getElementById('hatNumber');
const resultsDiv = document.getElementById('results');
const resultsList = document.getElementById('resultsList');
const shuffleButton = document.getElementById('shuffleButton');
const joinForm = document.getElementById('joinForm');
const nameInput = document.getElementById('nameInput');
const joinButton = document.getElementById('joinButton');

// Show the user's hat number
function updateHatNumber(hatNumber) {
  hatStatus.style.display = 'block';
  hatNumberSpan.textContent = hatNumber;
}

// Show shuffle results
function updateShuffleResults(participants) {
  resultsDiv.style.display = 'block';
  resultsList.innerHTML = '';

  // Display participants' names, old and new hats
  for (const id in participants) {
    resultsList.innerHTML += `
            <li>${participants[id].name}: 
                Old Hat ${participants[id].hatNumber} -> New Hat ${participants[id].newHat}</li>`;
  }
}

// When a participant clicks join
joinButton.addEventListener('click', () => {
  const name = nameInput.value;
  if (name) {
    joinGame(name);
    joinForm.style.display = 'none'; // Hide the name input form
  }
});

// Handle the shuffle button click (triggering the host action)
shuffleButton.addEventListener('click', () => {
  shuffleHats();
});
