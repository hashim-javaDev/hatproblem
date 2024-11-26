const socket = io();

// Wait for DOM to be loaded
document.addEventListener('DOMContentLoaded', () => {
  const joinButton = document.getElementById('joinButton');
  const nameInput = document.getElementById('nameInput');

  // Join game button click event
  joinButton.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (!name) {
      alert('Please enter your name!');
      return;
    }
    // Emit joinGame event to the server
    socket.emit('joinGame', name);
  });

  // Listen for assigned hat number from the server
  socket.on('assignHat', (hatNumber) => {
    const hatStatus = document.getElementById('hatStatus');
    const hatNumberSpan = document.getElementById('hatNumber');
    hatStatus.style.display = 'block';
    hatNumberSpan.textContent = hatNumber;
  });

  // Listen for host actions (show shuffle button)
  socket.on('showHostActions', () => {
    const shuffleButton = document.getElementById('shuffleButton');
    shuffleButton.style.display = 'block';
  });

  // Listen for host assignment
  socket.on('hostAssigned', (data) => {
    const hostNameSpan = document.getElementById('hostName');
    hostNameSpan.textContent = `Host: ${data.hostName}`;
  });

  // Listen for shuffle result
  socket.on('shuffleResult', (participants) => {
    let resultMessage = 'Hat Shuffle Results:\n';
    for (const id in participants) {
      const participant = participants[id];
      resultMessage += `${participant.name} now has hat ${participant.newHat}\n`;
    }
    alert(resultMessage);
  });

  // Handle errors
  socket.on('error', (message) => {
    alert(message);
  });
});
