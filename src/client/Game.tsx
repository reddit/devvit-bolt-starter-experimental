import React, { useState, useEffect, useCallback } from 'react';
import { Keyboard } from './Keyboard';
import { LetterState, CheckResponse } from '../shared/types/game';
import packageJson from '../../package.json';
import SuperSnoo from './assets/flyingSnoo.png';

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

interface Tile {
  letter: string;
  state: LetterState;
}

const icons: Record<LetterState, string | null> = {
  correct: '🟩',
  present: '🟨',
  absent: '⬜',
  initial: null,
};

const genResultGrid = (currentBoard: Tile[][], lastRowIndex: number): string => {
  return currentBoard
    .slice(0, lastRowIndex + 1)
    .map((row) => row.map((tile) => icons[tile.state] || ' ').join(''))
    .join('\n');
};

function extractSubredditName(): string | null {
  const devCommand = packageJson.scripts?.['dev:devvit'];

  if (!devCommand || !devCommand.includes('devvit playtest')) {
    console.warn('"dev:devvit" script is missing or malformed.');
    return null;
  }

  // Match the args after 'devvit playtest'
  const argsMatch = devCommand.match(/devvit\s+playtest\s+(.*)/);
  if (!argsMatch || !argsMatch[1]) {
    console.warn('Could not parse arguments in dev:devvit script.');
    return null;
  }

  const args = argsMatch[1].trim().split(/\s+/);

  // Find the first token that is not a flag (doesn't start with "-" or "--")
  const subreddit = args.find((arg) => !arg.startsWith('-'));

  if (!subreddit) {
    console.warn('No subreddit name found in dev:devvit command.');
    return null;
  }

  return subreddit;
}

const Banner = () => {
  const subreddit = extractSubredditName();
  if (!subreddit) {
    return (
      <div className="w-full bg-red-600 text-white p-4 text-center mb-4">
        Please visit your playtest subreddit to play the game with network functionality.
      </div>
    );
  }

  const subredditUrl = `https://www.reddit.com/r/${subreddit}`;

  return (
    <div className="w-full bg-red-600 text-white p-4 text-center mb-4">
      Please visit{' '}
      <a
        href={subredditUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="underline font-bold"
      >
        r/{subreddit}
      </a>{' '}
      to play the game with network functionality. Remember to create a post from the three dots
      (beside the mod tools button).
    </div>
  );
};

export const Game: React.FC = () => {
  const [board, setBoard] = useState<Tile[][]>(
    Array.from({ length: MAX_GUESSES }, () =>
      Array.from({ length: WORD_LENGTH }, () => ({
        letter: '',
        state: 'initial' as LetterState,
      }))
    )
  );
  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const [currentColIndex, setCurrentColIndex] = useState(0);
  const [letterStates, setLetterStates] = useState<Record<string, LetterState>>({});
  const [message, setMessage] = useState('');
  const [shakeRowIndex, setShakeRowIndex] = useState(-1);
  const [success, setSuccess] = useState(false);
  const [allowInput, setAllowInput] = useState(true);
  const [grid, setGrid] = useState('');
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const hostname = window.location.hostname;
    setShowBanner(!hostname.endsWith('devvit.net'));
  }, []);

  const showMessage = useCallback((msg: string, time = 2000) => {
    setMessage(msg);
    if (time > 0) {
      setTimeout(() => {
        setMessage('');
      }, time);
    }
  }, []);

  const shake = useCallback(() => {
    setShakeRowIndex(currentRowIndex);
    setTimeout(() => {
      setShakeRowIndex(-1);
    }, 1000);
  }, [currentRowIndex]);

  const onKey = useCallback(
    async (key: string) => {
      if (!allowInput || success) return;

      const currentBoardRow = board[currentRowIndex];
      if (!currentBoardRow) return; // Should not happen

      if (/^[a-zA-Z]$/.test(key) && key.length === 1) {
        if (currentColIndex < WORD_LENGTH) {
          const newBoard = board.map((row) => [...row]); // Create a deep copy
          const tileToUpdate = newBoard[currentRowIndex]?.[currentColIndex];
          if (tileToUpdate) {
            tileToUpdate.letter = key.toLowerCase();
            tileToUpdate.state = 'initial';
            setBoard(newBoard);
            setCurrentColIndex(currentColIndex + 1);
          }
        }
      } else if (key === 'Backspace') {
        if (currentColIndex > 0) {
          const newBoard = board.map((row) => [...row]);
          const tileToUpdate = newBoard[currentRowIndex]?.[currentColIndex - 1];
          if (tileToUpdate) {
            tileToUpdate.letter = '';
            tileToUpdate.state = 'initial';
            setBoard(newBoard);
            setCurrentColIndex(currentColIndex - 1);
          }
        }
      } else if (key === 'Enter') {
        if (currentColIndex === WORD_LENGTH) {
          const guess = currentBoardRow.map((tile) => tile.letter).join('');

          setAllowInput(false);
          try {
            const response = await fetch('/api/check', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ guess }),
            });
            const result = (await response.json()) as CheckResponse;

            if (result.status === 'error') {
              showMessage(result.message || 'Error checking word');
              setAllowInput(true);
              return;
            }

            // status is 'success' from here
            if (result.exists === false) {
              shake();
              showMessage('Not in word list');
              setAllowInput(true);
              return;
            }

            const newBoard = board.map((row) => [...row]);
            const newLetterStates = { ...letterStates };
            const serverCheckedRow = newBoard[currentRowIndex];

            if (serverCheckedRow) {
              result.correct.forEach((letterResult, i) => {
                const tile = serverCheckedRow[i];
                if (tile) {
                  tile.state = letterResult;
                  if (tile.letter) {
                    const letterKey = tile.letter;
                    const currentKeyState = newLetterStates[letterKey];

                    if (letterResult === 'correct') {
                      newLetterStates[letterKey] = 'correct';
                    } else if (letterResult === 'present' && currentKeyState !== 'correct') {
                      newLetterStates[letterKey] = 'present';
                    } else if (
                      letterResult === 'absent' &&
                      currentKeyState !== 'correct' &&
                      currentKeyState !== 'present'
                    ) {
                      newLetterStates[letterKey] = 'absent';
                    } else if (!currentKeyState) {
                      // If no state yet, assign current result
                      newLetterStates[letterKey] = letterResult;
                    }
                  }
                }
              });
              setBoard(newBoard);
              setLetterStates(newLetterStates);
            }

            if (result.solved) {
              setSuccess(true);
              setTimeout(() => {
                if (
                  newBoard &&
                  typeof currentRowIndex === 'number' &&
                  currentRowIndex < newBoard.length
                ) {
                  setGrid(genResultGrid(newBoard, currentRowIndex));
                }
                showMessage(
                  ['Genius', 'Magnificent', 'Impressive', 'Splendid', 'Great', 'Phew'][
                    currentRowIndex
                  ] || 'Well Done!',
                  -1
                );
              }, 1600);
            } else if (currentRowIndex < MAX_GUESSES - 1) {
              setCurrentRowIndex(currentRowIndex + 1);
              setCurrentColIndex(0);
              setTimeout(() => setAllowInput(true), 1600);
            } else {
              showMessage(`Game Over! The word was: TODO - get word from server`, -1); // Placeholder for actual word
              setTimeout(() => setAllowInput(false), 1600);
            }
          } catch (error) {
            console.error('Error checking word:', error);
            showMessage('Network error, please try again.');
            setAllowInput(true);
          }
        } else {
          shake();
          showMessage('Not enough letters');
        }
      }
    },
    [allowInput, success, currentColIndex, board, currentRowIndex, letterStates, shake, showMessage]
  );

  useEffect(() => {
    const handleKeyup = (e: KeyboardEvent) => {
      void onKey(e.key); // Using void as onKey is async but we don't need to await its result here
    };
    window.addEventListener('keyup', handleKeyup);
    return () => {
      window.removeEventListener('keyup', handleKeyup);
    };
  }, [onKey]);

  useEffect(() => {
    const onResize = () => {
      document.body.style.setProperty('--vh', `${window.innerHeight}px`);
    };
    window.addEventListener('resize', onResize);
    onResize();
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="flex flex-col h-full items-center pt-2 pb-2 box-border">
      {showBanner && <Banner />}
      {message && (
        <div className="message">
          {message}
          {grid && <pre className="text-xs whitespace-pre-wrap">{grid}</pre>}
        </div>
      )}
      <header className="w-full max-w-md px-2 flex items-center justify-center gap-2">
        <img src={SuperSnoo} alt="Super Snoo" className="w-8 h-8" />
        <h1 className="text-4xl font-bold tracking-wider my-2">Word Guesser</h1>
        <img src={SuperSnoo} alt="Super Snoo" className="w-8 h-8" />
      </header>

      <div id="board" className="mb-4">
        {board.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`row ${shakeRowIndex === rowIndex ? 'shake' : ''} ${
              success && currentRowIndex === rowIndex ? 'jump' : ''
            }`}
          >
            {row.map((tile, tileIndex) => (
              <div
                key={tileIndex}
                className={`tile ${tile.letter ? 'filled' : ''} ${tile.state !== 'initial' ? 'revealed' : ''}`}
              >
                <div className="front" style={{ transitionDelay: `${tileIndex * 300}ms` }}>
                  {tile.letter}
                </div>
                <div
                  className={`back ${tile.state}`}
                  style={{
                    transitionDelay: `${tileIndex * 300}ms`,
                    animationDelay: `${tileIndex * 100}ms`,
                  }}
                >
                  {tile.letter}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <Keyboard onKey={onKey} letterStates={letterStates} />
    </div>
  );
};
