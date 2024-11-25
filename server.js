const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Store participants and their hats
let participants = {};

// Serve static files (like HTML, client.js, game.js) from the 'public' folder
app.use(express.static('public'));

// When a user connects to the server
io.on('connection', (socket) => {
  console.log('A user connected: ' + socket.id);

  // Handle a user joining the game
  socket.on('joinGame', (name) => {
    const hatNumber = Math.floor(Math.random() * 100) + 1; // Randomly assign a hat number
    participants[socket.id] = { name, hatNumber };
    console.log(`${name} joined with hat number ${hatNumber}`);

    // Send the assigned hat number to the client
    socket.emit('assignHat', hatNumber);

    // If this is the first user to join, let the host know they can shuffle hats
    if (Object.keys(participants).length === 1) {
      io.emit('showHostActions');
    }
  });

  // Handle the hat shuffle triggered by the host
  socket.on('shuffleHats', () => {
    const hatNumbers = Object.values(participants).map((p) => p.hatNumber);
    const shuffledHats = [...hatNumbers].sort(() => Math.random() - 0.5);

    // Reassign hats to participants
    let index = 0;
    for (const id in participants) {
      participants[id].newHat = shuffledHats[index++];
    }

    // Emit the result to all clients (shuffle complete)
    io.emit('shuffleResult', participants);
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected: ' + socket.id);
    delete participants[socket.id];
  });
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
