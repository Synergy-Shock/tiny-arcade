import test from "node:test";
import assert from "node:assert/strict";
import {
  boardResult,
  duelResult,
  shuffle,
  winningLines,
} from "../src/lib/game-logic.ts";
test("every winning line works for either player", () => {
  for (const mark of ["X", "O"])
    for (const line of winningLines) {
      const board = Array(9).fill(null);
      line.forEach((i) => (board[i] = mark));
      assert.equal(boardResult(board), mark);
    }
});
test("draw and unfinished boards are distinguished", () => {
  assert.equal(
    boardResult(["X", "O", "X", "X", "O", "O", "O", "X", "X"]),
    "draw",
  );
  assert.equal(boardResult(Array(9).fill(null)), null);
});
test("all nine rock paper scissors outcomes", () => {
  for (const a of ["rock", "paper", "scissors"])
    for (const b of ["rock", "paper", "scissors"]) {
      const reverse = duelResult(b, a);
      assert.equal(
        duelResult(a, b),
        a === b ? "draw" : reverse === "win" ? "lose" : "win",
      );
    }
  assert.equal(duelResult("rock", "scissors"), "win");
});
test("shuffle preserves all memory pairs and leaves the original intact", () => {
  const cards = ["a", "b", "c", "d", "e", "f", "a", "b", "c", "d", "e", "f"];
  const shuffled = shuffle(cards);
  assert.deepEqual([...shuffled].sort(), [...cards].sort());
  assert.notEqual(shuffled, cards);
  assert.deepEqual(cards.slice(0, 6), ["a", "b", "c", "d", "e", "f"]);
});
