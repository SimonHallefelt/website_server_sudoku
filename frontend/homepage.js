var cells = document.querySelectorAll('.sudokuCell');
var lastCellPressed = cells[0];
var sudokuStartValues = [];
var allSudokuValues = [];
var sudokuCorrect = false;
var scoreCell;
var score = 0;
var startTime = new Date().getTime();
var TimePrevious = 0;
var doubleNumberSet = new Set();

function setNumber(number) {
    var row = lastCellPressed.getAttribute('data-row') -1
    var col = lastCellPressed.getAttribute('data-col') -1
    if (sudokuStartValues[row][col] == 0 && !sudokuCorrect) {
        lastCellPressed.textContent = number;
        allSudokuValues[row][col] = number;
        checkDoubleNumbers(row, col)
        if (isSudokuCorrect()) {
            if (postServerIsSudokuCorrect()) {
                console.log("sudoku is correct!!!")
                sudokuCorrect = true
                TimePrevious += new Date().getTime() - startTime
                // todo, show the user they won
            }
        }
    }
}

// triggers when page load
document.addEventListener('DOMContentLoaded', function() {
    var cells = document.querySelectorAll('.sudokuCell')
    cells.forEach(function(cell) {
        cell.addEventListener('click', function() {
            lastCellPressed = cell
            var row = lastCellPressed.getAttribute('data-row') -1
            var col = lastCellPressed.getAttribute('data-col') -1
            formatCellColors(row, col)
        });
    });
    var cells = document.querySelectorAll('.player-info-td')
    cells.forEach(function(cell) {
        if (cell.id === "score") {
            scoreCell = cell
            scoreCell.textContent = "Score: " + score
        }
    });
    createDefaultStartSudoku()
    setCellValues()
});

function createDefaultStartSudoku() {
    // sudokuStartValues.push([0,2,1, 0,7,6, 3,4,0])
    // sudokuStartValues.push([8,0,4, 0,0,1, 6,7,0])
    // sudokuStartValues.push([0,7,6, 0,4,8, 0,0,2])

    // sudokuStartValues.push([0,9,0, 7,1,3, 0,0,0])
    // sudokuStartValues.push([0,0,3, 4,6,0, 0,0,7])
    // sudokuStartValues.push([2,6,0, 8,0,0, 4,0,1])

    // sudokuStartValues.push([6,0,0, 1,2,7, 0,8,3])
    // sudokuStartValues.push([3,0,9, 0,8,4, 7,2,0])
    // sudokuStartValues.push([0,8,2, 0,0,0, 1,5,0])

    sudokuStartValues.push([5,2,1, 9,7,6, 3,4,8])
    sudokuStartValues.push([8,3,4, 2,5,1, 6,7,9])
    sudokuStartValues.push([9,7,6, 3,4,8, 5,1,2])

    sudokuStartValues.push([4,9,8, 7,1,3, 2,6,5])
    sudokuStartValues.push([1,5,3, 4,6,0, 8,9,7])
    sudokuStartValues.push([2,6,7, 8,0,5, 4,3,1])

    sudokuStartValues.push([6,4,5, 1,2,7, 9,8,3])
    sudokuStartValues.push([3,1,9, 5,8,4, 7,2,6])
    sudokuStartValues.push([7,8,2, 6,3,9, 1,5,0])

    sudokuStartValues.forEach(array => {
        allSudokuValues.push([].concat(array));
    });
}

function setCellValues() {
    cells.forEach(cell => {
        var value = sudokuStartValues[cell.getAttribute('data-row') -1][cell.getAttribute('data-col') -1];
        if (value != 0) {
            cell.textContent = value;
            cell.style.fontWeight = 'bold';
        } else {
            cell.textContent = ' ';
            cell.style.fontWeight = 'normal';
        }
    });
}

function isSudokuCorrect() {
    // test rows
    var allRowsCorrect = allSudokuValues.every(array => contains1To9(array))
    if (!allRowsCorrect) {
        console.log('row false')
        return false
    }
    // test columns
    for (let i = 0; i < 9; i++) {
        let col = []
        allSudokuValues.forEach(array => {
            col.push(array[i])
        })
        if (!contains1To9(col)) {
            console.log('col false')
            return false
        }
    }
    // test 3x3
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            var array = []
            for (let k = 0; k < 3; k++) {
                for (let h = 0; h < 3; h++) {
                    array.push(allSudokuValues[i*3+k][j*3+h])
                }
            }
            if (!contains1To9(array)) {
                console.log('3x3 false')
                return false
            }
        }
    }
    // all correct
    console.log('sudoku was correct')
    return true
}

function contains1To9(array) {
    for (let i = 1; i <= 9; i++) {
        var found = false
        array.forEach(value => {
            if (value == i) {
                found = true
            }
        })
        if (!found) {
            return false
        }
    }
    return true
}

// timer, update every 500ms
var x = setInterval(function() {
    // console.log('timer Start')
    var now = new Date().getTime();
    var timeDifference = TimePrevious + now - startTime; // ms
    
    var sec = Math.floor((timeDifference % (60 * 1000)) / 1000);
    var min = Math.floor(timeDifference / (60 * 1000));

    if (sec < 10) {
        sec = '0' + sec
    }
    if (min < 10) {
        min = '0' + min
    }

    if (!sudokuCorrect) {
        document.getElementById("timer").innerHTML = min + ':' + sec;
    }
}, 200); 

function postServerIsSudokuCorrect() {
    var jsonData = JSON.stringify({"allSudokuValues": allSudokuValues,})
    console.log("jsonDataToSent:", jsonData)
    return fetch("http://127.0.0.1/post/isSudokuCorrect", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: jsonData,
    })
    .then(response => response.json())
    .then(json => {
        console.log(json.message, "Points received", json.points)
        score = score + json.points
        scoreCell.textContent = "Score: " + score
        if (json.points > 0) {
            return true
        }
        return false
    })
}

function resetSudoku() {
    if (!sudokuCorrect) {
        allSudokuValues = [];
        sudokuStartValues.forEach(array => {
            allSudokuValues.push([].concat(array));
        });
        setCellValues();
    } else {
        alert('your sudoku is already correct')
    }
}

function getNewSudoku() {
    return fetch("http://127.0.0.1/post/newSudoku", {
        method: "POST",
    })
    .then(response => response.json())
    .then(json => {
        console.log("New Sudoku: " + json.new_sudoku)
        var new_sudoku = json.new_sudoku
        sudokuStartValues = []
        for (let i = 0; i < 9; i++) {
            sudokuStartValues.push(new_sudoku[i])
        }
        allSudokuValues = []
        sudokuStartValues.forEach(array => {
            allSudokuValues.push([].concat(array));
        });
        
        sudokuCorrect = false;
        setCellValues()
        startTime = new Date().getTime();
    })
}

function checkDoubleNumbers(r, c) {
    var oldDoubleNumberSet = doubleNumberSet
    var newDoubleNumberSet = new Set()

    var set = doubleNumber(r, c)
    set.forEach(newDoubleNumber => {
        newDoubleNumberSet.add(JSON.stringify(newDoubleNumber))
    })

    oldDoubleNumberSet.forEach(previousDoubleNumberString => {
        var previousDoubleNumber = JSON.parse(previousDoubleNumberString)
        set = doubleNumber(previousDoubleNumber[0], previousDoubleNumber[1])
        set.forEach(newDoubleNumber => {
            if (!newDoubleNumberSet.has(JSON.stringify(newDoubleNumber))) {
                newDoubleNumberSet.add(JSON.stringify(newDoubleNumber))
            }
        })
    })
    doubleNumberSet = newDoubleNumberSet
    console.log("doubleNumberSet:", doubleNumberSet)
    formatCellColors(r, c)
}

function doubleNumber(row, col) {
    let value = allSudokuValues[row][col];
    var setDoubleNumberFound = new Set();
    // row and col
    for (let i = 0; i < 9; i++) {
        if (allSudokuValues[row][i] == value && i != col) {
            setDoubleNumberFound.add([row, i])
        }
        if (allSudokuValues[i][col] == value && i != row) {
            setDoubleNumberFound.add([i, col])
        }
    }
    // 9x9 box
    let rowBoxStart = Math.floor(row/3); // will it optimize away multiplication and division?
    let colBoxStart = Math.floor(col/3);
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (allSudokuValues[i+rowBoxStart*3][j+colBoxStart*3] == value && (i+rowBoxStart*3 != row || j+colBoxStart*3 != col)) {
                setDoubleNumberFound.add([i+rowBoxStart*3, j+colBoxStart*3])
            }
        }
    }
    if (setDoubleNumberFound.size > 0) {
        setDoubleNumberFound.add([row, col])
    }
    return setDoubleNumberFound;
}

function formatCellColors(r, c) {
    cells.forEach(cell => {
        var row = cell.getAttribute('data-row') -1
        var col = cell.getAttribute('data-col') -1
        if (row == r && col == c) {
            if (doubleNumberSet.has(JSON.stringify([row, col]))) {
                cell.style.backgroundColor = 'darkred'
            } else {
                cell.style.backgroundColor = 'gray'
            }
        } else if (doubleNumberSet.has(JSON.stringify([row, col]))) {
            cell.style.backgroundColor = 'red'
        } else {
            cell.style.backgroundColor = 'white'
        }
    })
}
