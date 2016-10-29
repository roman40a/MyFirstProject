$(document).ready(function () {

    var quantityOfCells = 5;    // задаём количество чисел в сортируемой последовательности

    var sequence = new Sequence(quantityOfCells); // создаём последовательность из ячеек Cell

    // Animate начинает анимированную сортировку последовательности
    $('#btnAnimate').click(function () {
        if (sequence.isSorted) {    // проверка: может, уже отсортирован?
            alert('Последовательность уже отсортирована!');
        } else {    // если не отсортирован
            $(".button").hide(500); // при нажатии на Animate скрываем кнопки и
            sequence.sort();        // начинаем сортировку
        }
    });

    // Random Numbers создаёт новую последовательность ячеек с числами
    $('#btnRandomNumbers').click(function () {
        sequence.destroy();                 // уничтожаем последовательность
        sequence =
            new Sequence(quantityOfCells);  // создаём новую последовательность
    });

});