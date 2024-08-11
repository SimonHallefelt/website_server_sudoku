var lastCellPressed;

function numberButton(number) {
    if (!isNaN(number)) {
        lastCellPressed.textContent = number
    } else {
        lastCellPressed.textContent = 1
    }
    lastCellPressed.textContent = number
    alert(number)
}

document.addEventListener('DOMContentLoaded', function() {
    var cells = document.querySelectorAll('td');
    cells.forEach(function(cell) {
        cell.addEventListener('click', function() {
            lastCellPressed = cell;
        });
    });
});