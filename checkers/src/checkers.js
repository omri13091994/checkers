const table = document.querySelector("#damka");
const tableJS = new Array(8);
let Xcount = 12;
let Ocount = 12;
let XTurnCount = 0;
let OTurnCount = 0;
let position = "";
let pawn;
let firstposition = "";
let newGameB = document.querySelector("#startB");
let cell;
let positionStartArray;
let positionEndArray;
function buildingTableJs() {
    for (var i = 0; i < 8; i++) {
        tableJS[i] = new Array(8);
    }
}
function putXXInRows(tableJS, rowNum, startPosition) {
    for (let i = startPosition; i < 8; i = i + 2) {
        tableJS[rowNum][i] = "X";
    }
}
function putOOInRows(tableJS, rowNum, startPosition) {
    for (let i = startPosition; i < 8; i = i + 2) {
        tableJS[rowNum][i] = "O";
    }
}
function firstplacement(table, tableJS) {
    for (let i = 0; i < 8; i++) {
        let currRow = table.rows[i];
        for (let j = 0; j < 8; j++) {
            let currCell = currRow.cells[j];
            if (tableJS[i][j])
                currCell.innerHTML = tableJS[i][j];
            else
                currCell.innerHTML = "";
        }
    }
}

function fillingBoard() {
    putXXInRows(tableJS, 0, 0);
    putXXInRows(tableJS, 1, 1);
    putXXInRows(tableJS, 2, 0);
    putOOInRows(tableJS, 7, 1);
    putOOInRows(tableJS, 6, 0);
    putOOInRows(tableJS, 5, 1);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function addEventToButton() {
    newGameB.addEventListener("click", newGame);
}
function addEventToTable() {
    table.addEventListener("click", move);
}

function ifiTXOrXX(cell) {

    return (cell.innerHTML === "X" || cell.innerHTML === "XX");
}
function moreXthenO() {
    return (XTurnCount >= OTurnCount);
}
function ifiTOorOO(cell) {

    return (cell.innerHTML === "O" || cell.innerHTML === "OO");
}
function moreOthenX() {
    return (OTurnCount - 1 === XTurnCount);
}
async function messageToPlayers(cell, message) {
    let div = document.createElement("div");
    div.style.position = "absolute";
    div.style.right = '600px';
    div.style.top = '200px';
    div.style.border = "1px solid black";
    div.innerHTML = message;
    document.body.appendChild(div);
    await sleep(2000);
    div.style.visibility = "hidden";
    position = "";
    pawn = "";
    cell.style.background = "white";
    if (firstposition !== "")
        firstposition.style.background = "white";
    firstposition = "";
    cell = "";
    return;
}
function savingFirstPosition() {
    position = cell.id;
    pawn = cell.innerHTML;
    firstposition = cell;
}
function isCellEmpty(cell) {
    return (cell.innerHTML === "" && position === "");
}
function isFirstStep() {
    return position === "";
}

function isdDestinationEmpty() {
    return (cell.innerHTML === "");
}
function getPone(row, col) {
    if (row === -1 || col === -1 || row === 8 || col === 8 ||
        row === -2 || row === 9 || col === -2 || col === 9) {
        return "%";
    }
    let currRow = table.rows[row];
    let hereCell = currRow.cells[col];
    return hereCell.innerHTML;
}
function ArraysForWork(cell) {
    positionStartArray = position.split("");
    positionEndArray = cell.id;
    positionEndArray = positionEndArray.split("");
    for (let i = 0; i < 2; i++) {
        positionStartArray[i] = parseInt(positionStartArray[i]);
        positionEndArray[i] = parseInt(positionEndArray[i]);
    }
}
function rightDown() {
    return (
        positionStartArray[0] + 1 === positionEndArray[0] &&
        positionStartArray[1] + 1 === positionEndArray[1]
    );
}
function leftDown() {
    return (positionStartArray[0] + 1 === positionEndArray[0] &&
        positionStartArray[1] - 1 === positionEndArray[1]);
}
function eatingRightDown(enemy) {
    return (positionStartArray[0] + 2 === positionEndArray[0] &&
        positionStartArray[1] + 2 === positionEndArray[1] &&
        getPone(positionStartArray[0] + 1, positionStartArray[1] + 1) === enemy);
}
function eatingLeftDown(enemy) {
    return (positionStartArray[0] + 2 === positionEndArray[0] &&
        positionStartArray[1] - 2 === positionEndArray[1] &&
        getPone(positionStartArray[0] + 1, positionStartArray[1] - 1) === enemy);
}
function ifXCantMove() {
    return (isdDestinationEmpty() && !(rightDown() || leftDown() ||
        eatingRightDown("O") || eatingRightDown("OO") ||
        eatingLeftDown("O") || eatingLeftDown("OO")
    ));
}
async function xUpdate(pawn, cell) {
    if (rightDown() || leftDown())
        updateBoard(1, pawn, positionStartArray, positionEndArray, cell);
    else if (eatingRightDown("O") || eatingRightDown("OO"))
        updateBoard(2, pawn, positionStartArray, positionEndArray, cell);
    else if (eatingLeftDown("O") || eatingLeftDown("OO"))
        updateBoard(3, pawn, positionStartArray, positionEndArray, cell);
}
function leftUp() {
    return (positionStartArray[0] - 1 === positionEndArray[0] && positionStartArray[1] - 1 === positionEndArray[1]);
}
function rightUp() {
    return (positionStartArray[0] - 1 === positionEndArray[0] && positionStartArray[1] + 1 === positionEndArray[1]);
}
function eatingUpRight(enemy) {
    return (positionStartArray[0] - 2 === positionEndArray[0] &&
        positionStartArray[1] + 2 === positionEndArray[1] &&
        getPone(positionStartArray[0] - 1, positionStartArray[1] + 1) === enemy);
}
function ifOCantMove() {
    return (isdDestinationEmpty() && !(leftUp() || rightUp() ||
        eatingUpRight("X") || eatingUpRight("XX") ||
        eatingUpLeft("X") || eatingUpLeft("XX")
    ));
}
function eatingUpLeft(enemy) {
    return (positionStartArray[0] - 2 === positionEndArray[0] &&
        positionStartArray[1] - 2 === positionEndArray[1] &&
        getPone(positionStartArray[0] - 1, positionStartArray[1] - 1) === enemy);
}
function oUpdate(pawn, cell) {
    if (leftUp() || rightUp())
        updateBoard(1, pawn, positionStartArray, positionEndArray, cell);
    else if (eatingUpRight("X") || eatingUpRight("XX"))
        updateBoard(4, pawn, positionStartArray, positionEndArray, cell);
    else if (eatingUpLeft("X" || eatingUpLeft("XX")))
        updateBoard(5, pawn, positionStartArray, positionEndArray, cell);
}
function ifXXCantMove() {
    return (isdDestinationEmpty() &&
        !(rightDown() || leftDown() || rightUp() || leftUp() || eatingLeftDown("O") || eatingLeftDown("OO") ||
            eatingRightDown("O") || eatingRightDown("OO") || eatingUpLeft("O") || eatingUpLeft("OO") ||
            eatingUpRight("O") || eatingUpRight("OO")));
}
function ifOOCantMove() {
    return (isdDestinationEmpty() &&
        !(rightDown() || leftDown() || rightUp() || leftUp() || eatingLeftDown("X") || eatingLeftDown("XX") ||
            eatingRightDown("X") || eatingRightDown("XX") || eatingUpLeft("X") || eatingUpLeft("XX") ||
            eatingUpRight("X") || eatingUpRight("XX")));
}
function xxUpdate(pawn, cell) {
    if (rightDown() || leftDown() || rightUp() || leftUp())
        updateBoard(1, pawn, positionStartArray, positionEndArray, cell);
    else if (eatingRightDown("O") || eatingRightDown("OO"))
        updateBoard(2, pawn, positionStartArray, positionEndArray, cell);
    else if (eatingLeftDown("O") || eatingLeftDown("OO"))
        updateBoard(3, pawn, positionStartArray, positionEndArray, cell);
    else if (eatingUpRight("O") || eatingUpRight("OO"))
        updateBoard(4, pawn, positionStartArray, positionEndArray, cell);
    else if (eatingUpLeft("O") || eatingUpLeft("OO"))
        updateBoard(5, pawn, positionStartArray, positionEndArray, cell);
}
function ooUpdate() {
    if (rightDown() || leftDown() || rightUp() || leftUp())
        updateBoard(1, pawn, positionStartArray, positionEndArray, cell);
    else if (eatingRightDown("X") || eatingRightDown("XX"))
        updateBoard(2, pawn, positionStartArray, positionEndArray, cell);
    else if (eatingLeftDown("X") || eatingLeftDown("XX"))
        updateBoard(3, pawn, positionStartArray, positionEndArray, cell);
    else if (eatingUpRight("X") || eatingUpRight("XX"))
        updateBoard(4, pawn, positionStartArray, positionEndArray, cell);
    else if (eatingUpLeft("X") || eatingUpLeft("XX"))
        updateBoard(5, pawn, positionStartArray, positionEndArray, cell);
}
async function messageWinner(winner) {
    let div = document.createElement("div");
    div.style.position = "absolute";
    div.style.right = '600px';
    div.style.top = '200px';
    div.style.border = "1px solid black";
    div.innerHTML = winner + " win!!!";
    document.body.appendChild(div);
    await sleep(8000);
    div.style.visibility = "hidden";
}
function updateStartPosition() {
    tableJS[positionStartArray[0]][positionStartArray[1]] = "";
    startRow = table.rows[positionStartArray[0]];
    startCell = startRow.cells[positionStartArray[1]];
    startCell.innerHTML = tableJS[positionStartArray[0]][positionStartArray[1]];
}
function updateDestination() {
    endRow = table.rows[positionEndArray[0]];
    endCell = endRow.cells[positionEndArray[1]];
    endCell.innerHTML = tableJS[positionEndArray[0]][positionEndArray[1]];
}
function updateEnemyCell(first, second, cell) {
    tableJS[positionStartArray[0] + first][positionStartArray[1] + second] = "";
    enemyRow = table.rows[positionStartArray[0] + first];
    enemyCell = enemyRow.cells[positionStartArray[1] + second];
    enemyCell.innerHTML = tableJS[positionStartArray[0] + first][positionStartArray[1] + second];
}
function resetVariable(pawn, cell) {
    firstposition.style.background = "white";
    cell.style.background = "white";
    firstposition = "";
    position = "";
    pawn = "";
}
function movePawnOnTableJs(pawn) {
    if (positionEndArray[0] === 7 && tableJS[positionStartArray[0]][positionStartArray[1]] === "X") {
        tableJS[positionEndArray[0]][positionEndArray[1]] = "XX";
    }
    else if (positionEndArray[0] === 0 && tableJS[positionStartArray[0]][positionStartArray[1]] === "O") {
        tableJS[positionEndArray[0]][positionEndArray[1]] = "OO";
    }
    else {
        tableJS[positionEndArray[0]][positionEndArray[1]] = pawn;
    }
}
function updatePawnCount(first, second) {
    if (tableJS[positionStartArray[0] + first][positionStartArray[1] + second] === "X" ||
    tableJS[positionStartArray[0] + first][positionStartArray[1] + second] == "XX") {
        Xcount--;
      
    }
    else if (tableJS[positionStartArray[0] + first][positionStartArray[1] + second] === "O" ||
     tableJS[positionStartArray[0] + first][positionStartArray[1] + second] === "OO") {
       
        Ocount--;
        
    }
}
function start() {
    fillingBoard();
    firstplacement(table, tableJS);
}
function newGame() {

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            tableJS[i][j] = "";
            start();
        }
    }
}
async function move(e) {
    cell = e.target
    if(cell.nodeName!=="TH"){
        messageToPlayers (cell,"dont press on frame");
        return
    }
    if (((firstposition !== "" && !moreXthenO() && cell.innerHTML !== "")) ||
        (firstposition !== "" && !moreOthenX() && cell.innerHTML !== "")) {
        messageToPlayers(cell, "cant go there");
        return;
    }
    if ((ifiTXOrXX(cell) && moreXthenO()) || (ifiTOorOO(cell) && moreOthenX())) {
        messageToPlayers(cell, "other player turn");
        return;
    }
    cell.style.background = "red";
    if (isCellEmpty(cell)) {
        messageToPlayers(cell, "no pawn there");
        return;
    }
    if (isFirstStep()) {
        savingFirstPosition();
    }
    else {
        tryToMove(cell)
    }

}
async function tryToMove(cell) {
    ArraysForWork(cell)
    if (pawn === "X") {
        if (ifXCantMove()) {
            messageToPlayers(cell, "cant move there");
            return;
        }
        else {
            XTurnCount++;
            xUpdate(pawn, cell);
        }
    }
    if (pawn === "O") {
        ArraysForWork(cell);
        if (ifOCantMove()) {
            messageToPlayers(cell, "cant move there");
            return;
        }

        else {
            OTurnCount++;
            oUpdate(pawn, cell);
        }
    }
    if (pawn === "XX") {
        ArraysForWork(cell);
        if (ifXXCantMove()) {
            messageToPlayers(cell, "cant move there");
            return;
        }

        else {
            XTurnCount++;
            xxUpdate(pawn, cell);
        }
    }
    if (pawn === "OO") {

        ArraysForWork(cell);
        if (ifOOCantMove()) {
            messageToPlayers(cell, "cant move there");
            return;
        }
        else {
            OTurnCount++;
            ooUpdate();
        }
    }

}

function updateBoard(caseNum, pawn, positionStartArray, positionEndArray, cell) {
    let startRow = "";
    let startCell = "";
    let enemyRow = "";
    let enemyCell = "";
    let endRow = "";
    let endcell = "";
    switch (caseNum) {
        case 1:
        
            movePawnOnTableJs(pawn)
                ; updateStartPosition();
            updateDestination();
            resetVariable(pawn, cell);

            break;
        case 2:
        
            movePawnOnTableJs(pawn);
            updatePawnCount(1, 1);  
            updateStartPosition();
            updateEnemyCell(1, 1, cell);
            updateDestination();
            resetVariable(pawn, cell);
            break;
        case 3:
        
            movePawnOnTableJs(pawn);
            updatePawnCount(1, -1);
            updateStartPosition();
            updateEnemyCell(1, -1, cell);
            updateDestination();
            resetVariable(pawn, cell);
            break;

        case 4:
            movePawnOnTableJs(pawn);
            updatePawnCount(-1, 1);
            updateStartPosition();
            updateEnemyCell(-1, 1, cell);
            updateDestination();
            resetVariable(pawn, cell);
            break;
        case 5:
            movePawnOnTableJs(pawn);
            updatePawnCount(-1, -1);
            updateStartPosition();
            updateEnemyCell(-1, -1, cell);
            updateDestination();
            resetVariable(pawn, cell);
            break;
    }
    if (caseNum === 2 || caseNum === 3 || caseNum === 4 || caseNum === 5) {
        winner();
    }
}

async function winner() {
    if (Xcount === 0)
        messageWinner("O");
    if (Ocount === 0)
        messageWinner("X");
}
buildingTableJs();
start();
addEventToButton();
addEventToTable();


