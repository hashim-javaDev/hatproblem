// Connect to the server via socket.io
const socket = io();

// Emit event when user joins the game (pass their name)
function joinGame(name) {
  socket.emit('joinGame', name);
}

// Listen for the assigned hat number from the server
socket.on('assignHat', (hatNumber) => {
  // Call a function in game.js to update the UI with the hat number
  updateHatNumber(hatNumber);
});

// Listen for the shuffled hat result from the server
socket.on('shuffleResult', (participants) => {
  // Call a function in game.js to update the UI with the shuffle result
  updateShuffleResults(participants);
});

// Function to shuffle hats
function shuffleHats() {
  socket.emit('shuffleHats');
}
