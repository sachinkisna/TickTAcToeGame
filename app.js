
    document.addEventListener('DOMContentLoaded', () => {
      const statusDisplay = document.getElementById('status');
      const boardElement = document.getElementById('board');
      const resetButton = document.getElementById('resetBtn');
      const scoreXDisplay = document.getElementById('scoreX');
      const scoreODisplay = document.getElementById('scoreO');
      
      let gameActive = true;
      let currentPlayer = 'X';
      let gameState = ['', '', '', '', '', '', '', '', ''];
      let scores = { X: 0, O: 0 };
      
      const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
      ];
      
      const messages = {
        playerTurn: () => `${currentPlayer}'s turn`,
        gameWin: () => `Player ${currentPlayer} wins!`,
        gameDraw: () => `Game ended in a draw!`,
      };
      
      function handleCellClick(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
        
        if (gameState[clickedCellIndex] !== '' || !gameActive) {
          return;
        }
        
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase());
        
        handleResultValidation();
      }
      
      function handleResultValidation() {
        let roundWon = false;
        let winningLine = [];
        
        for (let i = 0; i < winningConditions.length; i++) {
          const [a, b, c] = winningConditions[i];
          const position1 = gameState[a];
          const position2 = gameState[b];
          const position3 = gameState[c];
          
          if (position1 === '' || position2 === '' || position3 === '') {
            continue;
          }
          
          if (position1 === position2 && position2 === position3) {
            roundWon = true;
            winningLine = [a, b, c];
            break;
          }
        }
        
        if (roundWon) {
          statusDisplay.textContent = messages.gameWin();
          gameActive = false;
          scores[currentPlayer]++;
          updateScoreboard();
          highlightWinningCells(winningLine);
          return;
        }
        
        const roundDraw = !gameState.includes('');
        if (roundDraw) {
          statusDisplay.textContent = messages.gameDraw();
          gameActive = false;
          return;
        }
        
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDisplay.textContent = messages.playerTurn();
      }
      
      function highlightWinningCells(line) {
        line.forEach(index => {
          const cell = document.querySelector(`.cell[data-index="${index}"]`);
          cell.classList.add('winner');
        });
      }
      
      function updateScoreboard() {
        scoreXDisplay.textContent = scores.X;
        scoreODisplay.textContent = scores.O;
      }
      
      function handleRestartGame() {
        gameActive = true;
        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
        statusDisplay.textContent = messages.playerTurn();
        
        document.querySelectorAll('.cell').forEach(cell => {
          cell.textContent = '';
          cell.classList.remove('x', 'o', 'winner');
        });
      }
      
      // Event listeners
      boardElement.querySelectorAll('.cell').forEach(cell => {
        cell.addEventListener('click', handleCellClick);
      });
      
      resetButton.addEventListener('click', handleRestartGame);
    });
