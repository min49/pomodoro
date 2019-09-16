function secondsToMinuteSecondString(seconds) {
  const minute = Math.floor(seconds / 60).toString().padStart(2, '0');
  const second = (seconds % 60).toString().padStart(2, '0');
  return `${minute}:${second}`;
}

function secondsToRoundedMinutes(seconds) {
  return Math.round(seconds / 60);
}

function minutesToSeconds(minutes) {
  return minutes * 60;
}

export {
  secondsToMinuteSecondString,
  secondsToRoundedMinutes,
  minutesToSeconds
}
