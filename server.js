const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Store participants and their hats
let participants = {};
let shuffledHats = [];

// Serve static files
app.use(express.static('public'));

// Handle WebSocket connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Assign a random hat when a participant joins
  const hatNumber = Object.keys(participants).length + 1;
  participants[socket.id] = { hatNumber, newHat: null };
  io.emit('participantsUpdate', participants);

  // Handle the host shuffling hats
  socket.on('shuffleHats', () => {
    const hatNumbers = Object.values(participants).map((p) => p.hatNumber);
    shuffledHats = [...hatNumbers].sort(() => Math.random() - 0.5);

    // Assign new hats
    let index = 0;
    for (const id in participants) {
      participants[id].newHat = shuffledHats[index++];
    }
    io.emit('shuffleResult', participants);
  });

  // Handle disconnects
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    delete participants[socket.id];
    io.emit('participantsUpdate', participants);
  });
});

// Start the server
server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
