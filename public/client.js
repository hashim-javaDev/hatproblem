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
  // Show shuffle button only if the user is the host
  shuffleButton.style.display = 'block';
});

// Display the host's name for all clients
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
    const participant = participants[id];
    const isSameHat = participant.hatNumber === participant.newHat;

    // Add a class to highlight if the participant has the same hat number
    const highlightClass = isSameHat ? 'highlight' : '';

    resultsList.innerHTML += `
            <li class="${highlightClass}">
              ${participant.name}: 
              Old Hat ${participant.hatNumber} -> New Hat ${participant.newHat}
            </li>`;
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
