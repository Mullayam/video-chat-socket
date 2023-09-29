export function generateRoomID() {
  // Generate three random parts
  const part1 = Math.random().toString(36).substr(2, 3);
  const part2 = Math.random().toString(36).substr(2, 4);
  const part3 = Math.random().toString(36).substr(2, 5);

  const timestampPart = new Date().getTime().toString(36).substr(2, 5);

  // Combine the parts with hyphens
  const roomIdWithTime = `${part1}-${part2}-${part3}-${timestampPart}`;
  const roomId = `${part1}-${part2}-${part3}`;

  return roomId;
}
