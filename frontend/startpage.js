var lastCellPressed;
var cells = document.querySelectorAll('.sudokuCell');
var sudokuStartValues = []

function numberButton(number) {
    if (!isNaN(number)) {
        lastCellPressed.textContent = number
    } else {
        lastCellPressed.textContent = 1
    }
    lastCellPressed.textContent = number
    alert()
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
    setStartCellValues();
});

function createDefaultStartSudoku() {
    sudokuStartValues.push([0,0,1, 0,7,6, 3,4,0])
    sudokuStartValues.push([0,0,4, 0,0,1, 6,7,0])
    sudokuStartValues.push([0,7,6, 0,4,8, 0,0,2])

    sudokuStartValues.push([0,0,0, 7,1,3, 0,0,0])
    sudokuStartValues.push([0,0,3, 4,6,0, 0,0,7])
    sudokuStartValues.push([2,6,0, 8,0,0, 4,0,0])

    sudokuStartValues.push([6,0,0, 1,2,7, 0,8,3])
    sudokuStartValues.push([3,0,9, 0,8,4, 7,2,0])
    sudokuStartValues.push([0,8,2, 0,0,0, 1,5,0])
}

function setStartCellValues() {
    cells.forEach(cell => {
        var value = sudokuStartValues[cell.getAttribute('data-row') -1][cell.getAttribute('data-col') -1];
        if (value != 0) {
            cell.textContent = value
        } else {
            cell.textContent = ' '
        }
    });
}