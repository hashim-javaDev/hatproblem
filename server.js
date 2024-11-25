const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('public'));

// WebSocket events
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Assign a random hat when the user connects
  const hatNumber = Math.floor(Math.random() * 100) + 1;
  socket.emit('hatAssigned', hatNumber);

  // Handle request for a new hat
  socket.on('requestNewHat', () => {
    const newHat = Math.floor(Math.random() * 100) + 1;
    socket.emit('newHat', newHat); // Send the new hat number to the client
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start the server
server.listen(3000, () => {
  console.log(`Server running on port 3000`);
});
