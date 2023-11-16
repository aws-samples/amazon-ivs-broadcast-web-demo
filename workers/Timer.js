var timer;

const startTimer = (start) => {
  if (!start) return;
  const now = new Date();

  const duration = (now - start) / 1000; // Get the difference in seconds between the two dates
  let minutes = Math.floor(duration / 60)
    .toString()
    .padStart(2, '0'); // Calculate the number of minutes
  let seconds = Math.round(duration % 60)
    .toString()
    .padStart(2, '0'); // Calculate the number of seconds

  // Format the duration as mm:ss
  postMessage(`${minutes}:${seconds}`);
  timer = setTimeout(() => startTimer(start), 1000); // Call the function again after 1 second
};

onmessage = function (e) {
  const { command, options } = e.data;

  switch (command) {
    case 'startTimer':
      clearTimeout(timer);
      startTimer(options);
      break;
    case 'stopTimer':
      clearTimeout(timer);
    default:
      break;
  }
};
