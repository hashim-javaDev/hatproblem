const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Store participants and their hats
let participants = {};
let hostSocketId = null; // Variable to store the host's socket ID

// Serve static files (like HTML, client.js, game.js) from the 'public' folder
app.use(express.static('public'));

// When a user connects to the server
io.on('connection', (socket) => {
  console.log('A user connected: ' + socket.id);

  // Handle a user joining the game
  socket.on('joinGame', (name) => {
    const hatNumber = Math.floor(Math.random() * 100) + 1; // Randomly assign a hat number
    participants[socket.id] = { name, hatNumber };

    // If this is the first user, assign them as the host
    if (!hostSocketId) {
      hostSocketId = socket.id; // First user is the host
      io.emit('hostAssigned', { hostName: name });
    }

    console.log(`${name} joined with hat number ${hatNumber}`);

    // Send the assigned hat number to the client
    socket.emit('assignHat', hatNumber);

    // If this is the first user to join, let the host know they can shuffle hats
    if (Object.keys(participants).length === 1) {
      io.emit('showHostActions'); // Notify everyone that the host can shuffle hats
    }
  });

  // Handle the hat shuffle triggered by the host
  socket.on('shuffleHats', () => {
    // Only allow the host to shuffle the hats
    if (socket.id !== hostSocketId) {
      socket.emit('error', 'Only the host can shuffle the hats!');
      return;
    }

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

    // If the host disconnects, assign a new host
    if (socket.id === hostSocketId) {
      // Find a new host (first player to remain in the game)
      const remainingSockets = Object.keys(participants);
      if (remainingSockets.length > 0) {
        hostSocketId = remainingSockets[0]; // Assign first remaining player as host
        io.emit('hostAssigned', { hostName: participants[hostSocketId].name });
      } else {
        hostSocketId = null; // Reset host if no players are left
      }
    }
  });
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
