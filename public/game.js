const socket = io();

// Listen for DOMContentLoaded
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
    alert(`Your assigned hat number is: ${hatNumber}`);
  });

  // Listen for host actions
  socket.on('hostAssigned', (data) => {
    alert(`${data.hostName} is the host!`);
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
});
