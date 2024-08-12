var lastCellPressed;
var cells = document.querySelectorAll('.sudokuCell');
var sudokuStartValues = []
var allSudokuValues = []
var sudokuCorrect = false

function setNumber(number) {
    if (sudokuStartValues[lastCellPressed.getAttribute('data-row') -1][lastCellPressed.getAttribute('data-col') -1] == 0 && !sudokuCorrect) {
        lastCellPressed.textContent = number;
        allSudokuValues[lastCellPressed.getAttribute('data-row') -1][lastCellPressed.getAttribute('data-col') -1] = number;
        if (isSudokuCorrect()) {
            sudokuCorrect = true
            // todo, show the user they won
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var cells = document.querySelectorAll('.sudokuCell');
    cells.forEach(function(cell) {
        cell.addEventListener('click', function() {
            lastCellPressed = cell;
        });
    });
});

// triggers when page load
document.addEventListener('DOMContentLoaded', function() {
    createDefaultStartSudoku();
    setCellValues();
});

function createDefaultStartSudoku() {
    sudokuStartValues.push([0,0,1, 0,7,6, 3,4,0])
    sudokuStartValues.push([8,0,4, 0,0,1, 6,7,0])
    sudokuStartValues.push([0,7,6, 0,4,8, 0,0,2])

    sudokuStartValues.push([0,9,0, 7,1,3, 0,0,0])
    sudokuStartValues.push([0,0,3, 4,6,0, 0,0,7])
    sudokuStartValues.push([2,6,0, 8,0,0, 4,0,1])

    sudokuStartValues.push([6,0,0, 1,2,7, 0,8,3])
    sudokuStartValues.push([3,0,9, 0,8,4, 7,2,0])
    sudokuStartValues.push([0,8,2, 0,0,0, 1,5,0])

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
    allSudokuValues.forEach(array => {
        if (!contains1To9(array)) {
            console.log('row false')
            return false
        }
    })
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