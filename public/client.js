const socket = io();

// Display assigned hat
socket.on('hatAssigned', (hat) => {
  document.getElementById('hatDisplay').innerText = `Your hat number: ${hat}`;
});

// Handle new hat requests
document.getElementById('requestHat').addEventListener('click', () => {
  socket.emit('requestNewHat');
});

// Display new hat
socket.on('newHat', (newHat) => {
  document.getElementById('hatDisplay').innerText = `New hat number: ${newHat}`;
});
