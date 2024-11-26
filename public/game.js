const socket = io();

// Get the DOM elements
const shuffleButton = document.getElementById('shuffleButton');
const hatStatus = document.getElementById('hatStatus');
const hatNumberSpan = document.getElementById('hatNumber');
const resultsDiv = document.getElementById('resultsDiv');
const resultsList = document.getElementById('resultsList');
const joinForm = document.getElementById('joinForm');
const nameInput = document.getElementById('nameInput');
const joinButton = document.getElementById('joinButton');
const hostNameSpan = document.getElementById('hostName');

// Join game function
function joinGame(name) {
  socket.emit('joinGame', name);
}

// Handle hat number assignment
socket.on('assignHat', (hatNumber) => {
  updateHatNumber(hatNumber);
});

// Handle shuffle result
socket.on('shuffleResult', (participants) => {
  updateShuffleResults(participants);
});

// Show shuffle button only for the host
socket.on('showHostActions', () => {
  shuffleButton.style.display = 'block';
});

// Display the host's name
socket.on('hostAssigned', (data) => {
  hostNameSpan.textContent = `Host: ${data.hostName}`;
});

// Display error message if non-host tries to shuffle
socket.on('error', (message) => {
  alert(message); // Show error message to non-hosts trying to shuffle
});

// Handle shuffle button click
shuffleButton.addEventListener('click', () => {
  socket.emit('shuffleHats');
});

// Update the hat number in the UI
function updateHatNumber(hatNumber) {
  hatStatus.style.display = 'block';
  hatNumberSpan.textContent = hatNumber;
}

// Update the shuffle results
function updateShuffleResults(participants) {
  resultsDiv.style.display = 'block';
  resultsList.innerHTML = '';
  for (const id in participants) {
    resultsList.innerHTML += `
            <li>${participants[id].name}: 
                Old Hat ${participants[id].hatNumber} -> New Hat ${participants[id].newHat}</li>`;
  }
}

// Join button event handler
joinButton.addEventListener('click', () => {
  const name = nameInput.value;
  if (name) {
    joinGame(name);
    joinForm.style.display = 'none';
  }
});
