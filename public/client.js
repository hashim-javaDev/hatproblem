const socket = io(); // Connect to the WebSocket server

// Display the initially assigned hat
socket.on('hatAssigned', (hat) => {
  document.getElementById('hatDisplay').innerText = `Your hat number: ${hat}`;
});

// Emit the event when the button is clicked
document.getElementById('requestHat').addEventListener('click', () => {
  socket.emit('requestNewHat'); // Emit 'requestNewHat' to the server
});

// Update the hat number when the server sends a new hat
socket.on('newHat', (newHat) => {
  document.getElementById('hatDisplay').innerText = `New hat number: ${newHat}`;
});
