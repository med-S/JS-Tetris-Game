const tetris = document.getElementById("tetris");
const canvas = tetris.getContext('2d');

const scoreElement = document.getElementById('score');

const I = [
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
    ],
    [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
    ],
    [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
    ]
];
const J = [
    [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0]
    ],
    [
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1]
    ],
    [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0]
    ]
];
const L = [
    [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1]
    ],
    [
        [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0]
    ],
    [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0]
    ]
];
const O = [
    [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
    ]
];
const S = [
    [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    [
        [0, 1, 0],
        [0, 1, 1],
        [0, 0, 1]
    ],
    [
        [0, 0, 0],
        [0, 1, 1],
        [1, 1, 0]
    ],
    [
        [1, 0, 0],
        [1, 1, 0],
        [0, 1, 0]
    ]
];
const T = [
    [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0]
    ],
    [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0]
    ],
    [
        [0, 1, 0],
        [1, 1, 0],
        [0, 1, 0]
    ]
];
const Z = [
    [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0]
    ],
    [
        [0, 0, 0],
        [1, 1, 0],
        [0, 1, 1]
    ],
    [
        [0, 1, 0],
        [1, 1, 0],
        [1, 0, 0]
    ]
];

const sq = 25; //the size (width=height=sq) of each square
const row = 20;
const column = 10;
const emptySquare = "white";

let score = 0;

//Drawing function
function drawSquare(x, y, color) {
    canvas.fillStyle = color;
    canvas.fillRect(x * sq, y * sq, sq, sq);
    canvas.strokeStyle = 'black';
    canvas.strokeRect(x * sq, y * sq, sq, sq); // (X : number of squares from the left, Y : number of squares from the top)
}

//Create the board
let board = [];
for (i = 0; i < row; i++) {
    board[i] = [];
    for (r = 0; r < column; r++) {
        board[i][r] = emptySquare;
    }
}

//Draw the board
function drawBoard() {
    for (i = 0; i < row; i++) {
        for (r = 0; r < column; r++) {
            drawSquare(r, i, board[i][r]);
        }
    }
}
drawBoard();

const pieces = [
    [Z, 'red'],
    [S, 'green'],
    [T, 'black'],
    [O, 'indigo'],
    [I, 'blue'],
    [L, 'purple'],
    [J, 'orange']
];

//Random pieces function
function randomPiece() {
    let randomN = Math.floor(Math.random() * pieces.length); //It gives us number between 0 and 6
    return new Piece(pieces[randomN][0], pieces[randomN][1]);
}

let p = randomPiece();

//the Tetromino construction function and it's prototypes
function Piece(tetromino, color) {
    this.tetromino = tetromino; //the tetromino array
    this.tetrominoN = 0; //start from tetromino[tetrominoN=0]
    this.activeTetromino = this.tetromino[this.tetrominoN];
    this.color = color;
    this.x = 3;
    this.y = -2;
}
//draw a Tetromino functions
Piece.prototype.fill = function(color) {
        for (r = 0; r < this.activeTetromino.length; r++) {
            for (c = 0; c < this.activeTetromino.length; c++) {
                // we draw only occupied squares
                if (this.activeTetromino[r][c]) {
                    drawSquare(this.x + c, this.y + r, color);
                }
            }
        }
    }
    // draw a piece to the board
Piece.prototype.draw = function() {
        this.fill(this.color);
    }
    // undraw a piece
Piece.prototype.undraw = function() {
        this.fill(emptySquare);
    }
    //Lock a piece
Piece.prototype.lock = function() {
        for (r = 0; r < this.activeTetromino.length; r++) {
            for (c = 0; c < this.activeTetromino.length; c++) {
                // we skip the vacant squares
                if (!this.activeTetromino[r][c]) {
                    continue;
                }
                // pieces to lock on top = game over
                if (this.y + r < 0) {
                    alert("Game Over");
                    // stop request animation frame
                    gameOver = true;
                    location.reload();
                    break;
                }
                // we lock the piece
                board[this.y + r][this.x + c] = this.color;
            }
        }
        // remove full rows
        for (r = 0; r < row; r++) {
            let isRowFull = true;
            for (c = 0; c < column; c++) {
                isRowFull = isRowFull && (board[r][c] != emptySquare);
            }
            if (isRowFull) {
                // if the row is full
                // we move down all the rows above it
                for (y = r; y > 1; y--) {
                    for (c = 0; c < column; c++) {
                        board[y][c] = board[y - 1][c];
                    }
                }
                // the top row board[0][..] has no row above it
                for (c = 0; c < column; c++) {
                    board[0][c] = emptySquare;
                }
                // increment the score
                score += 10;
            }
        }
        // update the board
        drawBoard();
        // update the score
        scoreElement.innerHTML = score;
    }
    //Movements functions
Piece.prototype.moveDown = function() {
    if (!this.collision(0, 1, this.activeTetromino)) {
        this.undraw();
        this.y++;
        this.draw();
    } else {
        this.lock();
        p = randomPiece();
    }
}
Piece.prototype.moveLeft = function() {
    if (!this.collision(-1, 0, this.activeTetromino)) {
        this.undraw();
        this.x--;
        this.draw();
    } else {

    }
}
Piece.prototype.moveRight = function() {
    if (!this.collision(1, 0, this.activeTetromino)) {
        this.undraw();
        this.x++;
        this.draw();
    } else {

    }
}
Piece.prototype.rotate = function() {
    let nextPattern = this.tetromino[(this.tetrominoN + 1) % this.tetromino.length];
    let kick = 0;
    if (this.collision(0, 0, nextPattern)) {
        if (this.x > column / 2) {
            kick = -1; //move the piece to the left of the right wall
        } else {
            kick = 1; //move the piece to the right of the left wall
        }
    }
    if (!this.collision(kick, 0, nextPattern)) {
        this.undraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1) % this.tetromino.length; // (0+1)%4 => 1
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    }
}


//collision function
Piece.prototype.collision = function(x, y, piece) {
    for (r = 0; r < piece.length; r++) {
        for (c = 0; c < piece.length; c++) {
            // if the square is empty, we skip it
            if (!piece[r][c]) {
                continue;
            }
            // coordinates of the piece after movement
            let newX = this.x + c + x;
            let newY = this.y + r + y;

            // conditions
            if (newX < 0 || newX >= column || newY >= row) {
                return true;
            }
            // skip newY < 0; board[-1] will crush our game
            if (newY < 0) {
                continue;
            }
            // check if there is a locked piece alrady in place
            if (board[newY][newX] != emptySquare) {
                return true;
            }
        }
    }
    return false;
}

//contol function
document.addEventListener('keydown', Control);

function Control(event) {
    if (event.keyCode == 37) {
        p.moveLeft();
        dropStart = Date.now();
    } else if (event.keyCode == 38) {
        p.rotate();
        dropStart = Date.now();
    } else if (event.keyCode == 39) {
        p.moveRight();
        dropStart = Date.now();
    } else if (event.keyCode == 40) {
        p.moveDown();
    }
}

let dropStart = Date.now();
let gameOver = false;
//Drop function
function drop() {
    let now = Date.now();
    let delta = now - dropStart;
    if (delta > 1000) {
        p.moveDown();
        dropStart = Date.now();
    }
    if (!gameOver) {
        requestAnimationFrame(drop);
    }
}

drop();