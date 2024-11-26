const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

// Initialize express and http server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Store participant information
let participants = {};
let hostSocketId = null;

// Serve the HTML, CSS, and JS files
app.use(express.static('public')); // Assuming your client files (index.html, game.js) are in the 'public' folder

// Handle a new connection
io.on('connection', (socket) => {
  console.log('A user connected: ' + socket.id);

  // Handle new participant joining
  socket.on('joinGame', (name) => {
    // Assign a random hat number to the participant
    const hatNumber = Math.floor(Math.random() * 100) + 1; // Random hat number between 1 and 100
    participants[socket.id] = { name, hatNumber };

    // If no host has been assigned yet, assign this player as the host
    if (!hostSocketId) {
      hostSocketId = socket.id;
      io.emit('hostAssigned', { hostName: name }); // Emit to all clients (including host)
      io.emit('showHostActions');
    }

    // Send the hat number to the participant
    io.to(socket.id).emit('assignHat', hatNumber);
  });

  // Handle hat shuffle
  socket.on('shuffleHats', () => {
    // Only allow the host to shuffle the hats
    if (socket.id !== hostSocketId) {
      socket.emit('error', 'Only the host can shuffle the hats!');
      return;
    }

    // Shuffle the hats: Create an array of all participants' hat numbers and shuffle it
    const hatNumbers = Object.values(participants).map((p) => p.hatNumber);
    const shuffledHats = [...hatNumbers].sort(() => Math.random() - 0.5);

    // Reassign the shuffled hats to participants
    let index = 0;
    for (const id in participants) {
      participants[id].newHat = shuffledHats[index++];
    }

    // Emit the shuffle results to all participants
    io.emit('shuffleResult', participants);
  });

  // Handle disconnection of a participant
  socket.on('disconnect', () => {
    console.log('A user disconnected: ' + socket.id);
    // If the host disconnects, assign a new host
    if (socket.id === hostSocketId) {
      // Find the next available host
      for (const id in participants) {
        if (id !== socket.id) {
          hostSocketId = id;
          io.to(id).emit('hostAssigned', { hostName: participants[id].name });
          io.emit('showHostActions');
          break;
        }
      }
    }

    // Remove the participant from the list of participants
    delete participants[socket.id];
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
