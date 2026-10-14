"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  boardResult,
  duelResult,
  shuffle,
  randomChoice,
  type Mark,
  type Choice,
} from "@/lib/game-logic";

const games = [
  {
    id: "tic",
    name: "Tic-tac-toe",
    icon: "✕",
    tag: "Two players",
    description: "An old-school showdown. Three in a row takes the crown.",
  },
  {
    id: "memory",
    name: "Memory match",
    icon: "✦",
    tag: "Solo puzzle",
    description: "Flip a little. Remember a little. Find all six pairs.",
  },
  {
    id: "duel",
    name: "Rock, paper, scissors",
    icon: "✌",
    tag: "You vs. computer",
    description: "Trust your instincts. Or just keep picking rock.",
  },
] as const;
type Game = (typeof games)[number]["id"];

export default function Home() {
  const [active, setActive] = useState<Game>("tic");
  const game = games.find((g) => g.id === active)!;
  return (
    <main className="arcade-shell">
      <header className="topbar">
        <Link href="/" className="wordmark">
          <span className="brand-icon">✳</span> tiny arcade
          <span className="wordmark-dot">.</span>
        </Link>
        <span className="top-note">
          <span className="live-dot" /> Zero downloads. Maximum procrastination.
        </span>
      </header>
      <section className="hero">
        <div className="eyebrow">SMALL GAMES. GOOD BREAKS.</div>
        <h1>
          A little play goes
          <br />a <span>long way.</span>
        </h1>
        <p>
          Three tiny games for your next tiny break.
          <br />
          No login, no leaderboard, no big deal.
        </p>
        <div className="hero-stamp">
          <span>100%</span>
          <small>JUST FOR FUN</small>
          <div>✧</div>
        </div>
      </section>
      <nav aria-label="Choose a game" className="game-grid">
        {games.map((g, i) => (
          <button
            key={g.id}
            type="button"
            aria-pressed={active === g.id}
            onClick={() => setActive(g.id)}
            className={`game-card ${active === g.id ? "selected" : ""}`}
          >
            <div className="game-card-top">
              <span className={`game-icon icon-${g.id}`}>{g.icon}</span>
              <span className="game-number">0{i + 1}</span>
            </div>
            <div className="game-tag">{g.tag}</div>
            <h2>
              {g.name}
              <span aria-hidden>↗</span>
            </h2>
            <p>{g.description}</p>
          </button>
        ))}
      </nav>
      <section className="play-area" aria-label={game.name}>
        <div className="play-heading">
          <div>
            <div className="eyebrow">NOW PLAYING</div>
            <h2>{game.name}</h2>
          </div>
          <span className="play-pill">{game.tag}</span>
        </div>
        {active === "tic" ? (
          <TicTacToe />
        ) : active === "memory" ? (
          <Memory />
        ) : (
          <Duel />
        )}
      </section>
      <footer>
        <span>Made for the joy of doing absolutely nothing productive.</span>
        <span>Take your time. Have a little fun. ✳</span>
      </footer>
    </main>
  );
}
function TicTacToe() {
  const [board, setBoard] = useState<(Mark | null)[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<Mark>("X");
  const result = boardResult(board);
  function pick(i: number) {
    if (board[i] || result) return;
    setBoard(board.map((cell, j) => (j === i ? turn : cell)));
    setTurn(turn === "X" ? "O" : "X");
  }
  return (
    <div className="game-content">
      <div className="game-instructions">
        <h3>Make your mark.</h3>
        <p>
          Grab a friend and take turns on the same screen. Get three in a row,
          column, or diagonal to win.
        </p>
        <div className="status-box" role="status">
          {result === "draw" ? (
            "A draw. Friendship preserved."
          ) : result ? (
            `Player ${result} wins! Nicely played.`
          ) : (
            <>
              Player <strong>{turn}</strong>, you’re up.
            </>
          )}
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setBoard(Array(9).fill(null));
            setTurn("X");
          }}
        >
          ↻ New round
        </Button>
      </div>
      <div className="tic-board" aria-label="Tic-tac-toe board">
        {board.map((cell, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Square ${i + 1}${cell ? `: ${cell}` : ": empty"}`}
            disabled={!!cell || !!result}
            onClick={() => pick(i)}
            className={cell === "O" ? "mark-o" : "mark-x"}
          >
            {cell}
          </button>
        ))}
      </div>
    </div>
  );
}
const symbols = ["🍒", "🍋", "🍇", "🍊", "🥝", "🍓"];
function Memory() {
  const [cards, setCards] = useState([...symbols, ...symbols]);
  const [picks, setPicks] = useState<number[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    if (picks.length !== 2) return;
    const same = cards[picks[0]] === cards[picks[1]];
    const timer = setTimeout(
      () => {
        if (same) setMatched((m) => [...m, cards[picks[0]]]);
        setPicks([]);
      },
      same ? 300 : 900,
    );
    return () => clearTimeout(timer);
  }, [picks, cards]);
  function reset() {
    setCards(shuffle([...symbols, ...symbols]));
    setPicks([]);
    setMatched([]);
    setMoves(0);
    setStarted(true);
  }
  function flip(i: number) {
    if (
      !started ||
      picks.length === 2 ||
      picks.includes(i) ||
      matched.includes(cards[i])
    )
      return;
    if (picks.length === 1) setMoves((m) => m + 1);
    setPicks((p) => [...p, i]);
  }
  return (
    <div className="game-content">
      <div className="game-instructions">
        <h3>A little brain stretch.</h3>
        <p>
          Reveal two cards at a time. Matching fruit stays face up; a mismatch
          flips back. Find all six pairs.
        </p>
        <div className="status-box" role="status">
          {matched.length === 6
            ? `All matched in ${moves} moves!`
            : started
              ? `${matched.length}/6 pairs · ${moves} moves`
              : "Ready when you are."}
        </div>
        <Button variant="outline" onClick={reset}>
          ↻ {started ? "Shuffle cards" : "Start game"}
        </Button>
      </div>
      <div className="memory-board" aria-label="Memory cards">
        {cards.map((fruit, i) => {
          const visible = picks.includes(i) || matched.includes(fruit);
          return (
            <button
              key={i}
              type="button"
              disabled={
                !started ||
                matched.includes(fruit) ||
                picks.length === 2 ||
                picks.includes(i)
              }
              className={`memory-card ${visible ? "revealed" : ""}`}
              onClick={() => flip(i)}
              aria-label={`Card ${i + 1}: ${visible ? fruit : "face down"}`}
            >
              {visible ? fruit : "✳"}
            </button>
          );
        })}
      </div>
    </div>
  );
}
const choices: Choice[] = ["rock", "paper", "scissors"];
const hand = { rock: "✊", paper: "✋", scissors: "✌️" };
function Duel() {
  const [round, setRound] = useState<{
    player: Choice;
    computer: Choice;
    result: "win" | "lose" | "draw";
  } | null>(null);
  const [scores, setScores] = useState({ win: 0, lose: 0, draw: 0 });
  function play(player: Choice) {
    const computer = randomChoice();
    const result = duelResult(player, computer);
    setRound({ player, computer, result });
    setScores((s) => ({ ...s, [result]: s[result] + 1 }));
  }
  return (
    <div className="game-content">
      <div className="game-instructions">
        <h3>One, two, three… shoot.</h3>
        <p>
          Rock beats scissors. Scissors beat paper. Paper beats rock. The
          computer’s choice is random, so go with your gut.
        </p>
        <div className="status-box" role="status">
          {round
            ? round.result === "win"
              ? "You win this round!"
              : round.result === "lose"
                ? "Computer takes this one."
                : "Great minds think alike. Draw!"
            : "Pick your opening move."}
        </div>
        <div className="score-line">
          <span>
            You <b>{scores.win}</b>
          </span>
          <span>
            Computer <b>{scores.lose}</b>
          </span>
          <span>
            Draws <b>{scores.draw}</b>
          </span>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setRound(null);
            setScores({ win: 0, lose: 0, draw: 0 });
          }}
        >
          ↻ Reset score
        </Button>
      </div>
      <div className="duel-board">
        <div className="duel-results">
          <div>
            <span>{round ? hand[round.player] : "?"}</span>
            <small>YOU</small>
          </div>
          <b>vs.</b>
          <div>
            <span>{round ? hand[round.computer] : "?"}</span>
            <small>COMPUTER</small>
          </div>
        </div>
        <div className="choice-row">
          {choices.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => play(c)}
              aria-label={`Choose ${c}`}
            >
              <span>{hand[c]}</span>
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
