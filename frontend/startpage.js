function numberButton(number) {
    alert(number)
}

document.addEventListener('DOMContentLoaded', function() {
    var cells = document.querySelectorAll('td');
    cells.forEach(function(cell) {
        cell.addEventListener('click', function() {
            var currentValue = parseInt(cell.textContent);
            if (!isNaN(currentValue)) {
                cell.textContent = (currentValue + 1) % 10;
            } else {
                cell.textContent = 1
            }
        });
    });
});