export function generateProgressPercentage(completed: number, possible: number) {
  return Math.round((completed / possible) * 100);
}