// DOM Elements
const hatStatus = document.getElementById('hatStatus');
const hatNumberSpan = document.getElementById('hatNumber');
const resultsDiv = document.getElementById('results');
const resultsList = document.getElementById('resultsList');
const shuffleButton = document.getElementById('shuffleButton');
const joinForm = document.getElementById('joinForm');
const nameInput = document.getElementById('nameInput');
const joinButton = document.getElementById('joinButton');
const hostNameSpan = document.getElementById('hostName'); // Display the host's name

// Show the user's hat number
function updateHatNumber(hatNumber) {
  hatStatus.style.display = 'block';
  hatNumberSpan.textContent = hatNumber;
}

// Show shuffle results
function updateShuffleResults(participants) {
  resultsDiv.style.display = 'block';
  resultsList.innerHTML = '';

  for (const id in participants) {
    resultsList.innerHTML += `
            <li>${participants[id].name}: 
                Old Hat ${participants[id].hatNumber} -> New Hat ${participants[id].newHat}</li>`;
  }
}

// Handle the join button click
joinButton.addEventListener('click', () => {
  const name = nameInput.value;
  if (name) {
    joinGame(name);
    joinForm.style.display = 'none';
  }
});
