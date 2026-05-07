export function rankFight(accuracy: number, failed: boolean) {
  if (failed) {
    return "LOST";
  }
  if (accuracy >= 95) {
    return "REALM GOD";
  }
  if (accuracy >= 90) {
    return "S";
  }
  if (accuracy >= 80) {
    return "A";
  }
  if (accuracy >= 70) {
    return "B";
  }
  if (accuracy >= 60) {
    return "C";
  }
  return "D";
}

