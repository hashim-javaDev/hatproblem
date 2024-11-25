const socket = io();

function joinGame(name) {
  socket.emit('joinGame', name);
}

socket.on('assignHat', (hatNumber) => {
  updateHatNumber(hatNumber);
});

socket.on('shuffleResult', (participants) => {
  updateShuffleResults(participants);
});

socket.on('showHostActions', () => {
  // Show the shuffle button only if the user is the host
  document.getElementById('shuffleButton').style.display = 'block';
});

socket.on('hostAssigned', (data) => {
  // Display the host's name on the screen
  document.getElementById('hostName').textContent = `Host: ${data.hostName}`;
});

socket.on('error', (message) => {
  alert(message); // Show error message to non-hosts trying to shuffle
});

shuffleButton.addEventListener('click', () => {
  socket.emit('shuffleHats');
});
