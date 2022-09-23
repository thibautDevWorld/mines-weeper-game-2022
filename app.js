let board = [];
let rows = 8;
let columns = 8;

let minesCount = 5;
let minesLocation = []; // "2-2", "3-4", "2-1"

let tilesClicked = 0;
let flagEnabled = false;

let gameover = false;

window.onload = () => {
    startGame();
}

function setMines() {
    let minesLeft = minesCount;
    while (minesLeft > 0) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        let id = r + "-" + c

        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
}

function startGame() {
    document.getElementById('mines-count').innerText = minesCount;
    document.getElementById('flag-button').addEventListener('click', setFlag);
    setMines()

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement('div');
            tile.id = r + "-" + c
            tile.addEventListener('click', clickTile);
            document.getElementById('board').append(tile);
            row.push(tile)
        }
        board.push(row)
        
    }
}

function setFlag() {
    if(flagEnabled) {
        flagEnabled = false;
        document.getElementById('flag-button').style.backgroundColor = 'lightgray';
    }
    else {
        flagEnabled = true;
        document.getElementById('flag-button').style.backgroundColor = 'darkgray'
    }
}



function clickTile() {

    if (gameover || this.classList.contains('tile-clicked')) {
        return
    };

    let tile = this;
    console.log(this);
    if (flagEnabled) {
        if(tile.innerText == '') {
            tile.innerText = "🚩"
        }
        else if (tile.innerText == "🚩") {
            tile.innerText = '';
        }
        return;
    }
    if (minesLocation.includes(tile.id)) {
        // alert("GAME OVER");
        gameover = true;
        revealMines()
        return;
    }

    let coords = tile.id.split('-'); // "0-0" --> ["0", "0"] 
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1])
    checkMine(r, c);
}

function revealMines() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board[r][c];
            if(minesLocation.includes(tile.id)) {
                tile.innerText = '💣'
                tile.style.backgroundColor = 'red';
            }
        }
    }
}


function checkMine(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }
    if (board[r][c].classList.contains('tile-clicked')) return;

    board[r][c].classList.add('tile-clicked');
    tilesClicked += 1;

    let minesFound = 0;
    //top 3
    minesFound += ckeckTile(r-1, c-1) //top left
    minesFound += ckeckTile(r-1, c)     //top 
    minesFound += ckeckTile(r-1, c+1)   //top right

    //middle
    minesFound += ckeckTile(r, c-1)   //left
    minesFound += ckeckTile(r, c+1)   //right
    
    //bottom 3
    minesFound += ckeckTile(r+1, c-1)   //top right
    minesFound += ckeckTile(r+1, c)   //top right
    minesFound += ckeckTile(r+1, c+1)   //top right

    if (minesFound > 0) {
        board[r][c].innerText = minesFound;
        board[r][c].classList.add('x'+ minesFound);
    }
    else {
        // implementation of recursion
        //top 3
        checkMine(r-1, c-1); //top left
        checkMine(r-1, c); //top left
        checkMine(r-1, c+1); //top left
        //left and right
        checkMine(r-1, c-1); //top left
        checkMine(r-1, c+1); //top left
        //bottom 3
        checkMine(r+1, c-1); //bottom left
        checkMine(r+1, c); //bottom left
        checkMine(r+1, c+1); //bottom left
    }

    if (tilesClicked == rows * columns - minesCount) {
        document.getElementById('mines-count').innerText = 'Cleared';
        gameover = true;
    }

}

function ckeckTile(r, c) {



    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    }
    if (minesLocation.includes(r + "-" + c)) {
        return 1;
    }
    return 0
}