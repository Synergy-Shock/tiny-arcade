export type Mark = "X" | "O";
export const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
export function boardResult(board: (Mark | null)[]): Mark | "draw" | null {
  for (const [a, b, c] of winningLines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c])
      return board[a];
  }
  return board.every(Boolean) ? "draw" : null;
}
export type Choice = "rock" | "paper" | "scissors";
export function duelResult(
  player: Choice,
  computer: Choice,
): "win" | "lose" | "draw" {
  if (player === computer) return "draw";
  return { rock: "scissors", paper: "rock", scissors: "paper" }[player] ===
    computer
    ? "win"
    : "lose";
}
export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function randomChoice(): Choice {
  const choices: Choice[] = ["rock", "paper", "scissors"];
  return choices[Math.floor(Math.random() * choices.length)];
}
