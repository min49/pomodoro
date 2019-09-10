function secondsToMinuteSecondString(seconds) {
  const minute = Math.floor(seconds / 60).toString().padStart(2, '0');
  const second = (seconds % 60).toString().padStart(2, '0');
  return `${minute}:${second}`;
}

export {secondsToMinuteSecondString}
