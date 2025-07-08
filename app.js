/**********************************************
 * STARTER CODE
 **********************************************/



/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle (src) {
  const copy = [...src]

  const length = copy.length
  for (let i = 0; i < length; i++) {
    const x = copy[i]
    const y = Math.floor(Math.random() * length)
    const z = copy[y]
    copy[i] = z
    copy[y] = x
  }

  if (typeof src === 'string') {
    return copy.join('')
  }

  return copy
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/
const { useState, useEffect } = React;

function App() {
  const WORD_LIST = [
    'orange', 'pizza', 'techno', 'bigroom', 'theweeknd', 
    'cardiB', 'modern', 'camera', 'instagram', 'canada' 
  ];

  const MAX_STRIKES = 3;
  const MAX_PASSES = 2;

  const [words, setWords] = useState([]);
  const [current, setCurrent] = useState('');
  const [scrambled, setScrambled] = useState('');
  const [score, setScore] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [passesRemaining, setPassesRemaining ] = useState(MAX_PASSES);
  const [guessInput, setGuessInput] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect (() => {
    const saved = JSON.parse(localStorage.getItem('scrambleGame'));
    if (saved && saved.words) {
      setWords(saved.words);
      setCurrent(saved.current);
      setScrambled(saved.scrambled);
      setScore(saved.score);
      setStrikes(saved.strikes);
      setPassesRemaining(saved.passesRemaining);
    } else {
      startNewRound(WORD_LIST);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'scrambleGame',
      JSON.stringify({ words, current, scrambled, score, strikes, passesRemaining })
    )
  }, [words, current, scrambled, score, strikes, passesRemaining]);

  function startNewRound(list) {
    if (list.length === 0) {
      setCurrent('');
      setScrambled('');
      return;
    }
    const remaining = [...list];
    const idx = Math.floor(Math.random() * remaining.length);
    const word = remaining.splice(idx, 1)[0];
    setWords(remaining);
    setCurrent(word);
    setScrambled(shuffle(word));
    setGuessInput('');
    setFeedback('');
  }

    function handleGuess(e) {
      e.preventDefault();
      const guess = guessInput.trim().toLowerCase();
      if (!guess) return;

      if(guess === current) {
        setScore(prev => prev + 1);
        setFeedback("Correct!");
        startNewRound(words);
      } else {
        setStrikes( prev => prev + 1);
        setFeedback('Try agains!');
      }
      setGuessInput('');
    }
  
  function handlePass() {
    if (passesRemaining <= 0) return;
    setPassesRemaining(prev => prev - 1);
    setFeedback(' Passed! ');
    startNewRound(words);
  }

  function resetGame() {
    localStorage.removeItem('scrambleGame');
    setScore(0);
    setStrikes(0);
    setPassesRemaining(MAX_PASSES);
    startNewRound(WORD_LIST);
  }

  const isGameOver = strikes >= MAX_STRIKES || (words.length === 0 && current === '');

  if(isGameOver) {
    return (
      <div className="container">
        <h1>Welcome ot Scramble.</h1>
        <div className="game-over">
          <h2>Game Over!</h2>
          <p>Your score: {score}</p>
          <button onClick={resetGame}>play agin?!</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Welcome to Scramble.</h1>

      <div className="stats">
        <div className="stat">
          <span className="stat-number">{score}</span>
          <span className="stat-label">Points</span>
        </div>
        <div className="stat">
          <span className="stat-number">{strikes}</span>
          <span className="stat-label">Strikes</span>
        </div>
        <div className="stat">
          <span className="stat-number">{passesRemaining}</span>
          <span className="stat-label">Passes</span>
        </div>
      </div>
      {feedback && <div className="feedback">{feedback}</div>}

      <h2 className="scrambled">{scrambled}</h2>

      <form onSubmit={handleGuess}>
        <input 
        type="text"
        value={guessInput}
        onChange={e => setGuessInput(e.target.value)}
        placeholder="Type your guess..."/>
      </form>

      <button className="pass-btn" onClick={handlePass} disabled={passesRemaining === 0} >
        {passesRemaining} Pass{passesRemaining !== 1 && 'es'} Remaining
      </button>
    </div>
  );
}


const root= document.getElementById('root');
ReactDOM.createRoot(root).render(<App />);