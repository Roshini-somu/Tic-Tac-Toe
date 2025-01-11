document.addEventListener('DOMContentLoaded', () => {
  let currentPlayer = 'X';
  let board = ['', '', '', '', '', '', '', '', ''];
  let gameActive = true;
  let gameMode = '';
  let playerXName = 'Player X';
  let playerOName = 'Player O';

  document.getElementById('two-player-btn').addEventListener('click', () => {
    gameMode = 'player';
    document.getElementById('welcome-container').style.display = 'none';
    document.getElementById('name-container').style.display = 'block';
  });

  document.getElementById('ai-player-btn').addEventListener('click', () => {
    gameMode = 'ai';
    document.getElementById('welcome-container').style.display = 'none';
    document.getElementById('name-container').style.display = 'block';
  });

  document.getElementById('start-game').addEventListener('click', () => {
    playerXName = document.getElementById('playerX').value || 'Player X';
    playerOName = document.getElementById('playerO').value || 'Player O';

    document.getElementById('name-container').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    initializeGame();
  });

  function createBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    board.forEach((cell, index) => {
      const cellElement = document.createElement('div');
      cellElement.classList.add('cell');
      cellElement.dataset.index = index;
      if (cell) {
        cellElement.textContent = cell;
      }
      cellElement.addEventListener('click', handleCellClick);
      gameBoard.appendChild(cellElement);
    });
  }

  function handleCellClick(event) {
    const index = event.target.dataset.index;
    if (board[index] || !gameActive) return;

    board[index] = currentPlayer;
    createBoard();

    if (checkWinner()) {
      document.getElementById('status').textContent = `${currentPlayer === 'X' ? playerXName : playerOName} Wins!`;
      gameActive = false;
      document.getElementById('restart-game').style.display = 'block';
      document.getElementById('back-to-welcome').style.display = 'block';
      celebrateWinner(currentPlayer === 'X' ? playerXName : playerOName);
      return;
    }

    if (checkDraw()) {
      document.getElementById('status').textContent = "It's a Draw!";
      gameActive = false;
      document.getElementById('restart-game').style.display = 'block';
      document.getElementById('back-to-welcome').style.display = 'block';
      return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    document.getElementById('status').textContent = `${currentPlayer === 'X' ? playerXName : playerOName}'s Turn`;

    if (gameMode === 'ai' && currentPlayer === 'O') {
      aiMove();
    }
  }

  function checkWinner() {
    const winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], 
      [0, 3, 6], [1, 4, 7], [2, 5, 8], 
      [0, 4, 8], [2, 4, 6] 
    ];

    for (let combination of winningCombinations) {
      const [a, b, c] = combination;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        highlightWinningCells(combination);
        return true;
      }
    }
    return false;
  }

  function checkDraw() {
    return board.every(cell => cell !== '');
  }

  function highlightWinningCells(winningCombination) {
    winningCombination.forEach(index => {
      const cell = document.querySelector(`[data-index='${index}']`);
      cell.classList.add('winner');
    });
  }

  function aiMove() {
    setTimeout(() => {
      const emptyCells = board.reduce((acc, curr, index) => {
        if (!curr) acc.push(index);
        return acc;
      }, []);
      const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      board[randomIndex] = 'O';
      createBoard();

      if (checkWinner()) {
        document.getElementById('status').textContent = `${playerOName} Wins!`;
        gameActive = false;
        document.getElementById('restart-game').style.display = 'block';
        document.getElementById('back-to-welcome').style.display = 'block';
        celebrateWinner(playerOName);
      } else if (checkDraw()) {
        document.getElementById('status').textContent = "It's a Draw!";
        gameActive = false;
        document.getElementById('restart-game').style.display = 'block';
        document.getElementById('back-to-welcome').style.display = 'block';
      } else {
        currentPlayer = 'X';
        document.getElementById('status').textContent = `${playerXName}'s Turn`;
      }
    }, 500);
  }

  function celebrateWinner(winnerName) {
    const gameContainer = document.getElementById('game-container');
    const celebrationMessage = document.createElement('div');
    celebrationMessage.classList.add('celebration-message');
    celebrationMessage.textContent = `${winnerName} Wins! 🎉`;
    gameContainer.appendChild(celebrationMessage);

    setTimeout(() => {
      celebrationMessage.classList.add('celebration-effect');
    }, 100);

    setTimeout(() => {
      celebrationMessage.remove();
    }, 3000); // Remove the message after 3 seconds
  }

  document.getElementById('restart-game').addEventListener('click', () => {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    document.getElementById('status').textContent = `${playerXName}'s Turn`;
    document.getElementById('restart-game').style.display = 'none';
    document.getElementById('back-to-welcome').style.display = 'none';
    createBoard();
  });

  document.getElementById('back-to-welcome').addEventListener('click', () => {
    board = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    document.getElementById('welcome-container').style.display = 'block';
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('status').textContent = '';
    document.getElementById('back-to-welcome').style.display = 'none';
    document.getElementById('restart-game').style.display = 'none';
    document.getElementById('name-container').style.display = 'none';
  });

  function initializeGame() {
    createBoard();
    document.getElementById('status').textContent = `${playerXName}'s Turn`;
  }
});
