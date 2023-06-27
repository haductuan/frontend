export function convertMsToHM(milliseconds: number) {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);
  seconds = seconds % 60;
  minutes = minutes % 60;
  hours = hours % 24;
  return `${days} days ${hours} hours ${minutes} minutes`;
}
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
