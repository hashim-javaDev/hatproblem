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

// Listen for the 'participantCountUpdated' event from the server
socket.on('participantCountUpdated', (data) => {
  console.log('Participant count updated:', data.count); // Debug log
  const countSpan = document.getElementById('participant-count');
  if (countSpan) {
    countSpan.textContent = `:${data.count}`; // Update participant count
  } else {
    console.error('Participant count span not found!');
  }
});

// Display the host's name for all clients
socket.on('hostAssigned', (data) => {
  hostNameSpan.textContent = `${data.hostName}`;
});

// Display the host's name for all participants
socket.on('displayHostName', (data) => {
  hostNameSpan.textContent = `${data.hostName}`;
});

// Handle hat number assignment
socket.on('assignHat', (hatNumber) => {
  updateHatNumber(hatNumber);
});

// Handle shuffle result for the host
socket.on('shuffleResult', (participants) => {
  updateShuffleResults(participants); // Only visible to the host
});

// Show shuffle button only for the host
socket.on('showHostActions', () => {
  shuffleButton.style.display = 'block'; // Only host sees the shuffle button
});

// Show the new hat number for participants (old and new hat)
socket.on('showNewHat', (participant) => {
  hatStatus.style.display = 'block';
  hatNumberSpan.textContent = `Old Hat: ${participant.hatNumber} -> New Hat: ${participant.newHat}`;
  joinForm.style.display = 'none'; // Hide the join form once the game starts
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
  hatNumberSpan.textContent = `${hatNumber}`;
}

// Update the shuffle results (only for the host)
function updateShuffleResults(participants) {
  resultsDiv.style.display = 'block';
  resultsList.innerHTML = '';
  console.log('Fuck off');
  for (const id in participants) {
    const participant = participants[id];
    const isWinner = participant.hatNumber === participant.newHat;

    // Add class to highlight the winner
    const winnerClass = isWinner ? 'winner' : '';

    resultsList.innerHTML += `
      <li class="${winnerClass}">${participants[id].name}: Old Hat ${participants[id].hatNumber} -> New Hat ${participants[id].newHat}</li>`;
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
