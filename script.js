let player1Name = "";
let player2Name = "";
let currentPlayer = 1;
let player1Score = 0;
let player2Score = 0;
let grid = Array(14).fill(7);
let currentIndex = -1;

let distributeTimeout;
let turnTimeLimit = 10;
let timerInterval;
let isDoubleStonesActive = false;
let player1DoubleUsed = false;
let player2DoubleUsed = false;
let player1SuddenStormUsed = false;
let player2SuddenStormUsed = false;

const powerUpStatus = document.getElementById("power-up-status");

// Add background balls on page load
window.onload = function() {
    createBackgroundBalls();
};

function createBackgroundBalls() {
    const container = document.createElement("div");
    container.className = "background-balls";
    document.body.appendChild(container);

    const numBalls = 20; // Number of balls
    for (let i = 0; i < numBalls; i++) {
        const ball = document.createElement("div");
        ball.className = "ball";

        // Random size between 20px and 50px
        const size = Math.random() * 30 + 20;
        ball.style.width = `${size}px`;
        ball.style.height = `${size}px`;

        // Random initial position
        ball.style.left = `${Math.random() * 100}vw`;
        ball.style.top = `${Math.random() * 100}vh`;

        // Random movement distance and duration for slow effect
        const xMove = (Math.random() - 2) * 100; // Move between -100px and 100px
        const yMove = (Math.random() - 2) * 100;
        const duration = Math.random() * 5 + 5; // Between 20s and 40s for slow movement
        ball.style.setProperty('--x-move', `${xMove}px`);
        ball.style.setProperty('--y-move', `${yMove}px`);
        ball.style.animationDuration = `${duration}s`;

        container.appendChild(ball);
    }
}

document.getElementById('back-btn').addEventListener('click', function() {
    window.location.href = 'open_game.html';
});

document.getElementById("double-stones-btn").addEventListener("mouseover", function() {
    const tooltip = document.getElementById("double-stones-tooltip");
    tooltip.style.display = "block";
    tooltip.style.opacity = "1";
});

document.getElementById("double-stones-btn").addEventListener("mouseout", function() {
    const tooltip = document.getElementById("double-stones-tooltip");
    tooltip.style.display = "none";
    tooltip.style.opacity = "0";
});

document.getElementById("sudden-storm-btn").addEventListener("mouseover", function() {
    const tooltip = document.getElementById("sudden-storm-tooltip");
    tooltip.style.display = "block";
    tooltip.style.opacity = "1";
});

document.getElementById("sudden-storm-btn").addEventListener("mouseout", function() {
    const tooltip = document.getElementById("sudden-storm-tooltip");
    tooltip.style.display = "none";
    tooltip.style.opacity = "0";
});

document.getElementById("next-btn").addEventListener("click", () => {
    const playerName = document.getElementById("player-name").value.trim();
    if (!playerName) {
        alert("Please enter a name.");
        return;
    }
    if (!player1Name) {
        player1Name = playerName;
        document.getElementById("prompt-text").textContent = "Enter Player 2 Name:";
        document.getElementById("player-name").value = "";
    } else {
        player2Name = playerName;
        startGame();
    }
});

function getCurrentPlayerName() {
    return currentPlayer === 1 ? player1Name : player2Name;
}

function startTurnTimer() {
    let timeLeft = turnTimeLimit;
    document.getElementById("timer").textContent = `Time Left: ${timeLeft}s`;

    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").textContent = `Time Left: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert(`${getCurrentPlayerName()}'s time is up!`);
            switchTurn();
        }
    }, 1000);
}

function stopTurnTimer() {
    clearInterval(timerInterval);
}

function activateDoubleStones() {
    if (isDistributing) {
        alert("Cannot activate Double Stones during distribution!");
        return;
    }
    if (currentPlayer === 1 && !player1DoubleUsed) {
        isDoubleStonesActive = true;
        player1DoubleUsed = true;
        document.getElementById("double-stones-btn").disabled = true;
        alert(`${player1Name} activated Double Stones! Click a cell to double its stones.`);
    } else if (currentPlayer === 2 && !player2DoubleUsed) {
        isDoubleStonesActive = true;
        player2DoubleUsed = true;
        document.getElementById("double-stones-btn").disabled = true;
        alert(`${player2Name} activated Double Stones! Click a cell to double its stones.`);
    } else {
        alert("Double Stones already used!");
    }
}

function activateSuddenStorm() {
    if (currentPlayer === 1 && !player1SuddenStormUsed) {
        document.getElementById("sudden-storm-btn").disabled = true;
        powerUpStatus.textContent = "Sudden Storm Activated! Shuffling stones...";
        shuffleStones();
        setTimeout(() => {
            powerUpStatus.textContent = "";
        }, 2000);
        player1SuddenStormUsed = true;
        document.getElementById("sudden-storm-btn").disabled = true;
    } else if (currentPlayer === 2 && !player2SuddenStormUsed) {
        document.getElementById("sudden-storm-btn").disabled = true;
        powerUpStatus.textContent = "Sudden Storm Activated! Shuffling stones...";
        shuffleStones();
        setTimeout(() => {
            powerUpStatus.textContent = "";
        }, 2000);
        player2SuddenStormUsed = true;
        document.getElementById("sudden-storm-btn").disabled = true;
    }
}

function shuffleStones() {
    let shuffledGrid = Array(14).fill(0);
    for (let i = 0; i < grid.length; i++) {
        let stones = grid[i];
        while (stones > 0) {
            const randomIndex = Math.floor(Math.random() * 14);
            shuffledGrid[randomIndex]++;
            stones--;
        }
    }
    grid = shuffledGrid;
    initializeGrid();
}

function startGame() {
    document.getElementById("player-name-screen").style.display = "none";
    document.getElementById("game-screen").style.display = "block";
    document.getElementById("player-turn").textContent = `${player1Name}'s Turn`;
    document.getElementById("player-turn").classList.add('active');
    initializeGrid();
    const arrowIndicator = document.getElementById("arrow-indicator");
    document.getElementById("power-up-container").style.display = "flex";
    document.getElementById("sudden-storm-btn").disabled = false;
    arrowIndicator.style.display = "block";
    setTimeout(() => {
        arrowIndicator.style.display = "none";
    }, 4000);
    startTurnTimer();
    document.getElementById("double-stones-btn").disabled = false;
}

function initializeGrid() {
    const gridContainer = document.querySelector(".grid");
    gridContainer.innerHTML = ""; // Clear existing grid

    for (let i = 0; i < 14; i++) {
        const cell = document.createElement("div");
        cell.className = "cell initial-load";
        cell.id = `cell-${i}`;
        const stoneCount = grid[i];
        
        for (let j = 0; j < stoneCount; j++) {
            const stoneImg = document.createElement("img");
            stoneImg.src = "stone1.png";
            stoneImg.alt = "Stone";
            stoneImg.classList.add("stone");
            const maxPos = 40;
            stoneImg.style.left = `${Math.random() * maxPos}px`;
            stoneImg.style.top = `${Math.random() * maxPos}px`;
            cell.appendChild(stoneImg);
        }

        const stoneCountLabel = document.createElement("span");
        stoneCountLabel.classList.add("stone-count");
        stoneCountLabel.textContent = stoneCount;
        cell.appendChild(stoneCountLabel);

        const newCell = cell.cloneNode(true);
        gridContainer.appendChild(newCell);

        if ((currentPlayer === 1 && i <= 6) || (currentPlayer === 2 && i >= 7)) {
            newCell.addEventListener("click", () => handleCellClick(i));
        } else {
            newCell.classList.add("disabled");
        }

        setTimeout(() => newCell.classList.remove("initial-load"), 2000);
    }
}

let isDistributing = false;

function handleCellClick(index) {
    if (isDistributing) {
        alert("Stones are being distributed, please wait until your turn ends.");
        return;
    }
    if (grid[index] === 0) {
        alert("This box is empty. Choose another box.");
        return;
    }
    currentIndex = index;
    playTurn();
}

function playTurn() {
    let stones = grid[currentIndex];
    if (isDoubleStonesActive) {
        stones *= 2;
        isDoubleStonesActive = false;
        document.getElementById("double-stones-btn").disabled = true;
        alert(`Double Stones activated! You now have ${stones} stones to distribute.`);
    }
    stopTurnTimer();
    grid[currentIndex] = 0;
    disableAllExceptReset();
    isDistributing = true;
    document.getElementById("double-stones-btn").disabled = true;
    document.getElementById("sudden-storm-btn").disabled = true;

    const distribute = () => {
        if (stones > 0) {
            const prevIndex = currentIndex;
            currentIndex = (currentIndex + 1) % 14;
            grid[currentIndex]++;
            stones--;
            const currentCell = document.getElementById(`cell-${currentIndex}`);
            const prevCell = document.getElementById(`cell-${prevIndex}`);
            currentCell.classList.add("yellow");

            // Update previous cell visuals
            updateCell(prevCell, grid[prevIndex]);
            prevCell.classList.add("shakeBox");
            setTimeout(() => prevCell.classList.remove("shakeBox"), 500);

            // Animate stone movement with enhanced yellow glow
            const stoneImg = document.createElement("img");
            stoneImg.src = "stone1.png";
            stoneImg.alt = "Stone";
            stoneImg.classList.add("stone", "move", "glow"); // Added "glow" class for pulsing effect
            const stoneSize = 30;
            stoneImg.style.width = `${stoneSize}px`;
            stoneImg.style.height = `${stoneSize}px`;
            stoneImg.style.filter = "drop-shadow(0 0 10px #ffbf00) drop-shadow(0 0 20px #ffbf00)"; // Enhanced glow
            const prevCellRect = prevCell.getBoundingClientRect();
            stoneImg.style.position = "absolute";
            const startX = prevCellRect.left + prevCellRect.width / 2 - stoneSize / 2;
            const startY = prevCellRect.top + prevCellRect.height / 2 - stoneSize / 2;
            stoneImg.style.left = `${startX}px`;
            stoneImg.style.top = `${startY}px`;
            document.body.appendChild(stoneImg);

            const currentCellRect = currentCell.getBoundingClientRect();
            const endX = currentCellRect.left + currentCellRect.width / 2 - stoneSize / 2;
            const endY = currentCellRect.top + currentCellRect.height / 2 - stoneSize / 2;

            animateStone(stoneImg, startX, startY, endX, endY, () => {
                document.body.removeChild(stoneImg); // Clean up moving stone
                stoneImg.classList.remove("move", "glow"); // Remove glow-related classes
                stoneImg.style.position = "absolute";
                stoneImg.style.filter = "none"; // Remove glow after landing
                const maxPos = 40;
                const randomX = Math.random() * maxPos;
                const randomY = Math.random() * maxPos;
                stoneImg.style.left = `${randomX}px`;
                stoneImg.style.top = `${randomY}px`;
                stoneImg.style.visibility = "visible";
                currentCell.appendChild(stoneImg);

                // Trigger yellow splash effect when stone lands
                createYellowSplash(currentCell);

                // Update current cell visuals to reflect all stones
                updateCell(currentCell, grid[currentIndex]);

                // Clear when stones reach 4
                if (grid[currentIndex] === 4) {
                    grid[currentIndex] = 0;
                    currentCell.classList.add("red");
                    while (currentCell.getElementsByClassName("stone").length > 0) {
                        currentCell.removeChild(currentCell.getElementsByClassName("stone")[0]);
                    }
                    updateCell(currentCell, 0);
                    if (currentIndex <= 6) {
                        player1Score += 4;
                        document.getElementById("player1-score").textContent = `${player1Name}'s score: ${player1Score}`;
                    } else {
                        player2Score += 4;
                        document.getElementById("player2-score").textContent = `${player2Name}'s score: ${player2Score}`;
                    }
                }

                if (prevIndex >= 0) {
                    document.getElementById(`cell-${prevIndex}`).classList.remove("highlight");
                }
                currentCell.classList.add("highlight");

                setTimeout(() => {
                    distributeTimeout = setTimeout(distribute, 200);
                }, 500); // Delay for animation visibility
            });
        } else {
            const nextIndex = (currentIndex + 1) % 14;
            if (grid[nextIndex] !== 0) {
                stones = grid[nextIndex];
                grid[nextIndex] = 0;
                const prevIndex = currentIndex;
                currentIndex = nextIndex;
                if (prevIndex >= 0) {
                    document.getElementById(`cell-${prevIndex}`).classList.remove("highlight");
                }
                const nextCell = document.getElementById(`cell-${nextIndex}`);
                nextCell.classList.add("highlight");
                updateCell(nextCell, 0);
                setTimeout(() => {
                    distributeTimeout = setTimeout(distribute, 50);
                }, 50);
            } else {
                handleZeroBox(nextIndex);
            }
        }
    };
    distribute();
}

// Function to create yellow splash effect
function createYellowSplash(cell) {
    const rect = cell.getBoundingClientRect();
    for (let i = 0; i < 5; i++) {
        const splash = document.createElement("div");
        splash.classList.add("splash");
        const xOffset = Math.random() * 20 - 10;
        const yOffset = Math.random() * 20 - 10;
        splash.style.left = `${rect.left + rect.width / 2}px`;
        splash.style.top = `${rect.top + rect.height / 2}px`;
        splash.style.setProperty('--x-offset', `${xOffset}px`);
        splash.style.setProperty('--y-offset', `${yOffset}px`);
        document.body.appendChild(splash);
        setTimeout(() => splash.remove(), 500);
    }
}

function updateCell(cell, stoneCount) {
    // Remove existing stones
    while (cell.getElementsByClassName("stone").length > 0) {
        cell.removeChild(cell.getElementsByClassName("stone")[0]);
    }
    // Add new stones based on count
    for (let i = 0; i < stoneCount; i++) {
        const stoneImg = document.createElement("img");
        stoneImg.src = "stone1.png";
        stoneImg.alt = "Stone";
        stoneImg.classList.add("stone");
        const maxPos = 40;
        stoneImg.style.left = `${Math.random() * maxPos}px`;
        stoneImg.style.top = `${Math.random() * maxPos}px`;
        cell.appendChild(stoneImg);
    }
    // Update stone count label
    const stoneCountLabel = cell.querySelector(".stone-count");
    stoneCountLabel.textContent = stoneCount;
}

function animateStone(stone, startX, startY, endX, endY, callback) {
    const duration = 100;
    let startTime = null;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);

        const currentX = startX + (endX - startX) * progress;
        const peakHeight = 40;
        const a = 4 * peakHeight;
        const currentY = startY + (endY - startY) * progress + a * progress * (progress - 1);

        stone.style.left = `${currentX}px`;
        stone.style.top = `${currentY}px`;

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            callback();
        }
    }

    requestAnimationFrame(step);
}

function disableAllExceptReset() {
    const elements = document.querySelectorAll(".cell");
    elements.forEach((el) => {
        el.classList.add("disabled");
        el.removeEventListener("click", handleCellClick);
    });
}

function handleZeroBox(index) {
    const score = calculateScore(index);
    if (currentPlayer === 1) {
        player1Score += score;
        document.getElementById("player1-score").textContent = `${player1Name}'s score: ${player1Score}`;
    } else {
        player2Score += score;
        document.getElementById("player2-score").textContent = `${player2Name}'s score: ${player2Score}`;
    }
    setTimeout(() => {
        isDistributing = false;
        switchTurn();
    }, 1000);
}

function calculateScore(index) {
    let score = 0;
    const nextIndex = (index + 1) % 14;
    if (grid[nextIndex] !== 0) {
        score += grid[nextIndex];
        grid[nextIndex] = 0;
    }
    return score;
}

function switchTurn() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    document.getElementById("double-stones-btn").disabled = 
        (currentPlayer === 1 && player1DoubleUsed) || (currentPlayer === 2 && player2DoubleUsed);
    document.getElementById("sudden-storm-btn").disabled = 
        (currentPlayer === 1 && player1SuddenStormUsed) || (currentPlayer === 2 && player2SuddenStormUsed);
    document.getElementById("player-turn").textContent = 
        `${getCurrentPlayerName()}'s Turn`;
    initializeGrid();
    startTurnTimer();
}

document.getElementById("reset-btn").addEventListener("click", resetGame);

function resetGame() {
    clearTimeout(distributeTimeout);
    clearInterval(timerInterval);
    player1Score = 0;
    player2Score = 0;
    currentPlayer = 1;
    grid = Array(14).fill(7);
    isDistributing = false;
    currentIndex = -1;
    player1DoubleUsed = false;
    player2DoubleUsed = false;
    player1SuddenStormUsed = false;
    player2SuddenStormUsed = false;
    document.getElementById("player1-score").textContent = `${player1Name}'s score: 0`;
    document.getElementById("player2-score").textContent = `${player2Name}'s score: 0`;
    document.getElementById("player-turn").textContent = `${player1Name}'s Turn`;
    initializeGrid();
    startTurnTimer();
    document.getElementById("double-stones-btn").disabled = false;
    powerUpStatus.textContent = "";
    document.getElementById("sudden-storm-btn").disabled = false;
    document.getElementById("power-up-status").textContent = "";
    setTimeout(() => {
        isDistributing = false;
    }, 0);
}