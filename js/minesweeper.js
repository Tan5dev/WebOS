(function(){
    const minesweeperWindow = document.getElementById("minesweeper-window");
    const minesweeperIcon = document.getElementById("minesweeper-icon");
    const minesweeperMinBtn = document.getElementById("minesweeper-min-btn");
    const minesweeperMaxBtn = document.getElementById("minesweeper-max-btn");
    const minesweeperCloseBtn = document.getElementById("minesweeper-close-btn");
    const taskbar = document.getElementById("taskbar");
    const gameContainer = document.getElementById("minesweeper-game-container");

    let minesweeperMaximized = false;
    let minesweeperPrevState = {
        width: minesweeperWindow.style.width,
        height: minesweeperWindow.style.height,
        left: minesweeperWindow.style.left,
        top: minesweeperWindow.style.top
    };


    let ROWS = 9;
    let COLS = 9;
    let MINE_COUNT = 10;
    let currentDifficulty = "beginner";

    let board =[]
    let gameOver = false;
    let gameStarted = false;
    let minesFlagged = 0;
    let timerInterval = null;
    let timeElapsed = 0;

    let menuBar, diffSelect, headerPanel, mineCounter, resetBtn, resetBtnImg, timerDisplay, gridElement;


    minesweeperIcon.addEventListener("click", () => {
        applyWindowDimensions();
        minesweeperWindow.classList.remove("maximized");
        minesweeperMaximized = false;
        minesweeperWindow.style.display = "flex";
        window.focusWindow(minesweeperWindow);
        addMinesweeperToTaskbar();
        initGameUI();
    });
    minesweeperCloseBtn.addEventListener("click", () => {
        minesweeperWindow.style.display = "none";
        if(minesweeperMaximized){
            taskbar.classList.remove("solid");
            minesweeperMaximized = false;
        }
        window.removeFromTaskbar("taskbar-minesweeper");
        stopTimer();
    });
    minesweeperMinBtn.addEventListener("click", () => {
        minesweeperWindow.style.display = "none";
        if(!document.getElementById("taskbar-minesweeper")){
            addMinesweeperToTaskbar();
        }
    });
    minesweeperMaxBtn.addEventListener("click", () => {
        if(!minesweeperMaximized){
            minesweeperPrevState = {
                width: minesweeperWindow.style.width,
                height: minesweeperWindow.style.height,
                left: minesweeperWindow.style.left,
                top: minesweeperWindow.style.top
            };
            minesweeperWindow.style.width = "100vw";
            minesweeperWindow.style.height = "calc(100vh - 50px)";
            minesweeperWindow.style.left = "0px";
            minesweeperWindow.style.top = "0px";
            minesweeperWindow.classList.add("maximized");
            taskbar.classList.add("solid");
        }
        else{
            minesweeperWindow.style.width = minesweeperPrevState.width;
            minesweeperWindow.style.height = minesweeperPrevState.height;
            minesweeperWindow.style.left = minesweeperPrevState.left;
            minesweeperWindow.style.top = minesweeperPrevState.top;
            minesweeperWindow.classList.remove("maximized");
            taskbar.classList.remove("solid");
        }
        minesweeperMaximized = !minesweeperMaximized;
    });

    function applyWindowDimensions(){
        if(minesweeperMaximized) return;

        if(currentDifficulty === "beginner"){
            minesweeperWindow.style.width = "336px";
            minesweeperWindow.style.height = "495px";
        }
        else if(currentDifficulty === "intermediate"){
            minesweeperWindow.style.width = "560px";
            minesweeperWindow.style.height = "720px";
        }
        else if (currentDifficulty === "expert") {
            minesweeperWindow.style.width = "1008px";
            minesweeperWindow.style.height = "720px";
        }
    }

    function handleDifficultyChange(targetValue){
        currentDifficulty = targetValue;

        if (currentDifficulty === "beginner"){
            ROWS = 9; COLS = 9; MINE_COUNT = 10;
        }
        else if (currentDifficulty === "intermediate"){
            ROWS = 16; COLS = 16; MINE_COUNT = 40;
        }
        else if(currentDifficulty === "expert"){
            ROWS = 16; COLS = 30; MINE_COUNT = 99;
        }

        applyWindowDimensions();
        initGameUI();
    }

    function initGameUI(){
        gameContainer.innerHTML = "";

        const calculatedWidth = (COLS * 32) + "px";

        menuBar = document.createElement("div");
        menuBar.style.cssText = `display:flex; width:${calculatedWidth}; background:#222; padding:4px 8px; border-radius:4px; margin-bottom:8px; box-sizing:border-box; border:1px solid #333; align-items:center; gap:10px;`;

        const label = document.createElement("span");
        label.textContent = "Difficulty:";
        label.style.cssText = "color:#aaa; font-size:12px; font-family:sans-serif; font-weight:bold;";

        diffSelect = document.createElement("select");
        diffSelect.style.cssText = "background:#111; color:#fff; border:1px solid #444; border-radius:3px; padding:2px 4px; font-size:12px; cursor:pointer; outline:none; font-family:sans-serif;";

        const optBeginner = new Option("Beginner (9x9)", "beginner", false, currentDifficulty === "beginner");
        const optInter = new Option("Intermediate (16x16)", "intermediate", false, currentDifficulty === "intermediate");
        const optExpert = new Option("Expert (30x16)", "expert", false, currentDifficulty === "expert");

        diffSelect.add(optBeginner);
        diffSelect.add(optInter);
        diffSelect.add(optExpert);

        diffSelect.addEventListener("change", (e) => handleDifficultyChange(e.target.value));

        menuBar.appendChild(label);
        menuBar.appendChild(diffSelect);
        gameContainer.appendChild(menuBar);

        headerPanel = document.createElement("div");
        headerPanel.style.cssText = `display:flex; justify-content:space-between; align-items:center; width:${calculatedWidth}; background:#111; padding:10px; border-radius:4px; margin-bottom:15px; box-sizing:border-box; border:1px solid #333;`;
        
        mineCounter = document.createElement("div");
        mineCounter.style.cssText = "color:#ff0000; font-family:monospace; font-size:20px; font-weight:bold; background:#000; padding:2px 6px; border-radius:3px; min-width:40px; text-align:center;";

        resetBtn = document.createElement("button");
        resetBtn.style.cssText = "background:none; border:none; cursor:pointer; outline:none; padding:0; margin:0; display:flex; align-items:center; justify-content:center;";

        resetBtnImg = document.createElement("img");
        resetBtnImg.style.cssText = "width:26px; height:26px; object-fit:contain;";
        resetBtn.appendChild(resetBtnImg);
        resetBtn.addEventListener("click", setupNewGame);

        timerDisplay = document.createElement("div");
        timerDisplay.style.cssText = "color:#ff0000; font-family:monospace; font-size:20px; font-weight:bold; background:#000; padding:2px 6px; border-radius:3px; min-width:40px; text-align:center;";

        headerPanel.appendChild(mineCounter);
        headerPanel.appendChild(resetBtn);
        headerPanel.appendChild(timerDisplay);
        gameContainer.appendChild(headerPanel);

        gridElement = document.createElement("div");
        gridElement.style.cssText = `display:grid; grid-template-columns: repeat(${COLS}, 32px); grid-template-rows: repeat(${ROWS}, 32px); gap:1px; background:#444; padding:2px; border-radius:4px; border: 1px solid #555; width:${calculatedWidth}; box-sizing:border-box;`;        gameContainer.appendChild(gridElement);

        setupNewGame();
    }

    function setupNewGame(){
        stopTimer();
        gameOver = false;
        gameStarted = false;
        minesFlagged = 0;
        timeElapsed = 0;

        mineCounter.textContent = String(MINE_COUNT).padStart(3, '0');
        timerDisplay.textContent = "000";
        resetBtnImg.src = "assets/face-smile.png";

        board = [];
        gridElement.innerHTML = "";

        for (let r = 0; r<ROWS; r++){
            board[r] = [];
            for (let c = 0; c < COLS; c++){
                const cellElement = document.createElement("div");
                cellElement.style.cssText = "width:32px; height:32px; background:#3a3a3a; display:flex; align-items:center; justify-content:center; font-family:sans-serif; font-size:16px; font-weight:bold; cursor:pointer; user-select:none; border-top:2px solid #555; border-left:2px solid #555; border-right:2px solid #222; border-bottom:2px solid #222; box-sizing:border-box; padding:2px;";
            
                cellElement.addEventListener("click", () => handleCellLeftClick(r, c));

                cellElement.addEventListener("contextmenu", (e) => {
                    e.preventDefault();
                    handleCellRightClick(r, c);
                });

                gridElement.appendChild(cellElement);

                board[r][c] = {
                    row: r,
                    col: c,
                    isMine: false,
                    isRevealed: false,
                    isFlagged: false,
                    neighborMines: 0,
                    element: cellElement
                };
            }
        }
    }

    function generateMinesAndNumbers(firstRow, firstCol){
        let minesPlaced = 0;

        while(minesPlaced < MINE_COUNT) {
            const r = Math.floor(Math.random()*ROWS);
            const c = Math.floor(Math.random() * COLS);

            if(!board[r][c].isMine && (r !== firstRow || c !== firstCol)){
                board[r][c].isMine = true;
                minesPlaced++;
            }
        }
    
        for(let r = 0; r < ROWS; r++){
            for(let c = 0; c < COLS; c++){
                if(board[r][c].isMine) continue;

                let count = 0;
                for(let dr= -1; dr <= 1; dr++){
                    for(let dc = -1; dc <= 1; dc++){
                        const nr = r+dr;
                        const nc = c+dc;
                        if (nr>= 0 && nr<ROWS && nc >= 0 && nc<COLS){
                            if(board[nr][nc].isMine) count++;
                        } 
                    }
                }

                board[r][c].neighborMines = count;
            }
        }
    }
    
    function handleCellLeftClick(r,c){
        if(gameOver || board[r][c].isRevealed || board[r][c].isFlagged) return;

        if(!gameStarted){
            gameStarted = true;
            generateMinesAndNumbers(r,c);
            startTimer();
        }

        revealCell(r,c);
    }

    function revealCell(r,c){
        const cell = board[r][c];
        if(cell.isRevealed || cell.isFlagged) return;

        cell.isRevealed = true;

        cell.element.style.background = "#292929";
        cell.element.style.border = "1px solid #444";

        if(cell.isMine){
            triggerGameOver(r,c);
            return;
        }

        if(cell.neighborMines > 0){
            cell.element.textContent = cell.neighborMines;
            cell.element.style.color = getNumberColor(cell.neighborMines);
        }
        else{
            for(let dr = -1; dr <= 1; dr++){
                for (let dc = -1; dc<=1; dc++){
                    const nr = r + dr;
                    const nc = c + dc;
                    if(nr >= 0 && nr< ROWS && nc >= 0 && nc < COLS){
                        revealCell(nr, nc);
                    }
                }
            }
        }

        checkWinCondition();
    }

    function handleCellRightClick(r, c){
        if(gameOver || board[r][c].isRevealed) return;

        const cell = board[r][c];

        if(!cell.isFlagged){
            cell.isFlagged = true;
            cell.element.innerHTML = '<img src="assets/flag.png" style="width:100%; height:100%; object-fit:contain;">';
            minesFlagged++;
        }
        else {
            cell.isFlagged = false;
            cell.element.innerHTML = "";
            minesFlagged--;
        }

        const displayMinesLeft = Math.max(0, MINE_COUNT - minesFlagged);
        mineCounter.textContent = String(displayMinesLeft).padStart(3, '0');

    }

    function getNumberColor(num){
        const colors = {
            1: "#3b82f6",
            2: "#10b981",
            3: "#ef4444",
            4: "#8b5cf6",
            5: "#b91c1c",
            6: "#06b6d4",
            7: "#000000",
            8: "#6b7280"
        };
        return colors[num] || "#fff";
    }

    function triggerGameOver(hitRow, hitCol){
        gameOver = true;
        stopTimer();
        resetBtnImg.src = "assets/face-dead.png";

        for (let r = 0; r<ROWS; r++){
            for(let c = 0; c < COLS; c++){
                const cell = board[r][c]
                if(cell.isMine){
                    cell.element.style.background = "#442222";
                    cell.element.style.border = "1px solid #553333";

                    if(r === hitRow && c === hitCol){
                        cell.element.innerHTML = '<img src="assets/mine-exploded.png" style="width:100%; height:100%; object-fit:contain;">';
                        cell.element.style.background = "#ef4444";
                    }
                    else{
                        cell.element.innerHTML = '<img src="assets/mine.png" style="width:100%; height:100%; object-fit:contain;">';    
                    }
                }
                else if (cell.isFlagged){
                    cell.element.innerHTML = '<img src="assets/flag-wrong.png" style="width:100%; height:100%; object-fit:contain;">';
                }
            }
        }
    }

    function checkWinCondition(){
        let unrevealedSafeCells = 0;

        for (let r = 0; r<ROWS; r++){
            for(let c = 0; c<COLS; c++){
                if(!board[r][c].isMine && !board[r][c].isRevealed){
                    unrevealedSafeCells++;
                }
            }
        }

        if(unrevealedSafeCells === 0){
            gameOver = true;
            stopTimer();
            resetBtnImg.src = "assets/face-win.png";
            mineCounter.textContent = "000";

            for(let r = 0; r < ROWS; r++){
                for(let c = 0; c<COLS; c++){
                    if(board[r][c].isMine){
                        board[r][c].element.innerHTML = '<img src="assets/flag.png" style="width:100%; height:100%; object-fit:contain;">';   
                    }
                }
            }
        }
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            timeElapsed++;
            if(timeElapsed > 999) timeElapsed = 999;
            timerDisplay.textContent = String(timeElapsed).padStart(3, '0');
        }, 1000);
    }

    function stopTimer(){
        if (timerInterval){
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }

    function addMinesweeperToTaskbar(){
        const taskbarItems = document.getElementById("taskbar-items");
        if(document.getElementById("taskbar-minesweeper")) return;

        const item = document.createElement("button");
        item.id = "taskbar-minesweeper";
        item.style.cursor = "pointer";
        item.style.background = "none";
        item.style.border = "none";
        item.style.padding = "0";
        item.style.margin = "0 5px";

        const img = document.createElement("img");
        img.src = "assets/minesweeper-icon.png";
        img.style.width = "40px";
        img.style.height = "40px";

        item.addEventListener("mouseenter", () => {
            item.style.background = "rgba(54,52,52,0.1)";
            item.style.borderRadius = "4px";
            item.style.border = "1px solid rgba(255,255,255,0.2)";
        });

        item.addEventListener("mouseleave", () => {
            item.style.background = "none";
            item.style.border = "none";
        });

        item.addEventListener("click", () => {
            if(minesweeperWindow.style.display === "none"){
                minesweeperWindow.style.display = "flex";
                window.focusWindow(minesweeperWindow);
                if (minesweeperMaximized) taskbar.classList.add("solid");
            }
            else{
                minesweeperWindow.style.display = "none";
                if(minesweeperMaximized) taskbar.classList.remove("solid");
            }
        });
        item.appendChild(img);
        taskbarItems.appendChild(item);
    }
    
    minesweeperWindow.addEventListener("mousedown", () => {
        window.bringToFront(minesweeperWindow);
    });
})();