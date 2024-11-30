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
      io.to(socket.id).emit('hostAssigned', { hostName: name }); // Send host info to the host
      io.emit('showHostActions'); // Show shuffle button to the host
      if (hostSocketId != socket.id) {
        io.emit('displayHostName', {
          hostName: participants[hostSocketId].name,
        }); // Broadcast host info to all clients
      }
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

    // Create an array of all participants' hat numbers
    const hatNumbers = Object.values(participants).map((p) => p.hatNumber);

    // Function to shuffle an array using Fisher-Yates algorithm
    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
      }
      return array;
    };

    // Shuffle the hat numbers
    let shuffledHats = shuffleArray([...hatNumbers]);

    // Ensure only one person gets their own hat
    let allowedMatch = false; // Track if the allowed match has occurred
    for (let i = 0; i < hatNumbers.length; i++) {
      if (hatNumbers[i] === shuffledHats[i]) {
        if (!allowedMatch) {
          // Allow the first match to remain
          allowedMatch = true;
        } else {
          // If another match occurs, swap with a random index
          let swapIndex = (i + 1) % hatNumbers.length;
          [shuffledHats[i], shuffledHats[swapIndex]] = [
            shuffledHats[swapIndex],
            shuffledHats[i],
          ];
        }
      }
    }

    // Reassign the shuffled hats to participants
    let index = 0;
    for (const id in participants) {
      participants[id].newHat = shuffledHats[index++];
    }

    // Emit the shuffle results to the host only
    io.to(hostSocketId).emit('shuffleResult', participants);

    // Emit the old and new hat numbers to all participants except the host
    for (const id in participants) {
      if (id !== hostSocketId) {
        io.to(id).emit('showNewHat', participants[id]);
      }
    }
  });

  // Handle disconnection of a participant
  socket.on('disconnect', () => {
    console.log('A user disconnected: ' + socket.id);
    // Remove the participant from the list of participants
    delete participants[socket.id];

    // If the host disconnects, assign a new host
    if (socket.id === hostSocketId) {
      hostSocketId = null;
      // Find the next available host
      for (const id in participants) {
        if (id !== socket.id) {
          hostSocketId = id;
          io.to(id).emit('hostAssigned', { hostName: participants[id].name });
          io.emit('displayHostName', { hostName: participants[id].name }); // Update host name for all participants
          io.emit('showHostActions');
          break;
        }
      }
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
