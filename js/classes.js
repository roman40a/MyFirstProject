var neededTime = 1000;   // регулировка длительности

// Класс Cell - это ячейка с целым числом 0..99
class Cell {
    constructor(index) {   // в конструкторе необходимо задать положение по оси y и порядковый номер
        this.int = getRand();   // поле int содержит произвольное целое число 0..99
        this.index = index;     // поле index - порядковый номер
        // Визуализируем на странице ячейку. Здесь .sequence  - это div,
        // в котором помещаются ячейки
        $('.sequence').append('<div class="numberCells">' + this.int + '</div>');

        // Положение по оси y задается, исходя из порядкового номера
        var DIST = 15;  // расстояние между ячейками по вертикали
        var CELL_HEIGHT = 90;    // высота ячейки
        var INITIAL_TOP = 10;   // y-координата верхней ячейки
        var top = index * DIST + index * CELL_HEIGHT + INITIAL_TOP;
        this.top = top + "px";
        this.obj = $('.numberCells').eq(this.index);    // Сохраним в поле obj объект jquery, соответствующий данной ячейке
        this.obj.css({"top": this.top});    // выставим положение по оси y
    }

    // Вытащить ячейку из последовательности: задается длительность этого
    // процесса и действие func, которое выполнится сразу после
    moveOut(interval, func) {
        return this.obj.animate({left: '200px'}, interval, "easeInOutElastic", func);
    }

    // Поместить ячейку обратно в последовательность: задается длительность этого
    // процесса и действие func, которое выполнится сразу после
    moveIn(interval, func) {
        return this.obj.animate({left: '30px'}, interval, "easeInOutElastic", func);
    }

    // Метод перекрашивает ячейку за 1 сек в указанный цвет color
    // и выполняет действие func сразу после
    repaint(color, func) {
        return this.obj.animate({"background-color": color, "color": "#fafafa"}, 1000, func);
    }
}

// Вспомогательная функция генерации целых чисел 0..99
function getRand() {
    return Math.floor((Math.random() * 100));
}


// Класс Sequence - последовательность объектов класса Cell
class Sequence {
    // Конструктор принимает количество ячеек
    constructor(quantityOfCells) {
        this.cellsArray = [];   // cellsArray - массив объектов класса Cell
        this.startingArray = [];    // startingArray - в этом массиве сохраним первоначальный набор чисел
        $('body')
            .append('<div class="sequence"></div>');   // добавим div, в котором будут ячейки
        // Наполним cellsArray ячейками, а startingArray их числами
        for (var cellIndex = 0; cellIndex < quantityOfCells; cellIndex++) {
            this.cellsArray.push(new Cell(cellIndex));
            this.startingArray.push(this.cellsArray[cellIndex].int);
        }

        // Поле isSorted - это статус последовательности:
        // true - отсортирована, false - не отсортирована
        // первоначально true
        this.isSorted = true;
        var compareArray = this.startingArray.slice(0); // создадим новый массив и скопируем в него startingArray
        compareArray.sort();    // отсортируем его
        // Проверим, совпадают ли массивы startingArray и compareArray.sort() и, если нет - меняем isSorted на false
        for (var i = 0; i < compareArray.length; i++) {
            if (compareArray[i] != this.startingArray[i]) {
                this.isSorted = false;
                break;
            }
        }
    }

    // Метод swapCellsWithCond меняет местами i-ую и j-ую ячейки местами при условии,
    // что число в i-ой > числа в j-ой ячейке
    swapCellsWithCond(i, j) {
        var firstTop = this.cellsArray[i].top;  // два top скопированы для обмена
        var secondTop = this.cellsArray[j].top;

        var iCell = this.cellsArray[i]; // два объекта Cell скопированны для обмена
        var jCell = this.cellsArray[j]; // и для краткости записи

        var firstNum = parseInt(this.cellsArray[i].int);    // в этих трёх строчках принимается решение
        var secondNum = parseInt(this.cellsArray[j].int);   // менять или не менять местами ячейки
        var mustSwap = secondNum < firstNum;    // условие сортировки (вверху самый маленьний)

        var self = this; // фиксируется окружение (this -> Sequance)

        iCell.moveOut(neededTime, function () {    // для начала выдвинем первую ячейку
            if (mustSwap) { // если true, то поставим первую ячейку на место второй по вертикали
                iCell.obj.animate({top: secondTop}, neededTime / 2, function () {
                    iCell.top = secondTop;  // поставим первую ячейку на место второй по вертикали
                    iCell.moveIn(neededTime);  // вернем ячейку на место
                    self.cellsArray[i] = jCell; // также поменяем местами ячейки в массиве cellsArray
                });
            } else {    // ...иначе, просто вернём на место
                iCell.moveIn(neededTime);
            }
        });

        // выдвинем вторую ячейку, действия аналогичны действиям для первой ячейки
        jCell.moveOut(neededTime, function () {
            if (mustSwap) {
                jCell.obj.animate({top: firstTop}, neededTime / 2, function () {
                    jCell.top = firstTop;
                    jCell.moveIn(neededTime);
                    self.cellsArray[j] = iCell;
                });
            } else {
                jCell.moveIn(neededTime);
            }
        });
    }

    // Метод sort - анимированная сортировка последовательности
    sort() {
        var self = this;    // фиксируется окружение (this -> Sequance)
        var j = 1;  // идем поочереди: i = j - 1, а j-ую ячейку меняем
        var barrier = this.cellsArray.length;   // это номер, с которого последовательность идет уже отсортированная
        // длительность операции с одной парой ячеек (нужна для рекурсивного setTimeout)
        var duration = neededTime + neededTime / 2 + neededTime + 50;
        var color = '#009a9d';  // цвет отсортированных ячеек

        // Для повторяемости используется рекурсивный setTimeout (первый вызов происходим тут же)
        setTimeout(function run() {
            // Перекрасим очередную отсортированную ячейку с номером
            // barrier, если конечно он < cellsArray.length
            if (barrier < self.cellsArray.length) {
                self.cellsArray[barrier].repaint(color);
            }
            // проверяем соседние ячейки: если порядок неправильный - меняем местами, затем j++
            self.swapCellsWithCond(j - 1, j);
            j++;
            // проверяем, не дошли ли мы до конца неотсортированной части последовательности
            // если нет - повторяем все предыдущие дейстия уже со следующей парой
            // если дошли - сдвигаем barrier вверх и делаем новый обход по неотсортированной
            // части последовательности
            if (j < barrier) {
                setTimeout(run, duration);
            } else {
                j = 1;
                // проверяем: если barrier находится на позиции 2, то проверяется последняя пара,
                // а затем (через duration миллисекунд) это пара закрашивается
                // и появляется модальное окно с исходной последовательностью
                if (barrier > 2) {
                    barrier--;
                    setTimeout(run, duration);
                } else {
                    setTimeout(function () {
                        self.cellsArray[1].repaint(color, function () {
                            self.cellsArray[0].repaint(color, function () {
                                // $(".button").prop("disabled", false);
                                $("#btnAnimate").show(500, function () {
                                    $('#btnRandomNumbers').show(500, function () {
                                        self.isSorted = true;
                                        alert('Sorting is finished!\n' + 'Starting Array:\n' + self.startingArray);
                                    });
                                });
                            })
                        })
                    }, duration);
                }
            }
        }, 0);
    }

    // Метод destroy уничтожает последовательность и на странице, и в оперативной памяти (cellsArray = [])
    destroy() {
        $('.numberCells').remove();
        $('.sequence').remove();
        this.cellsArray = [];
    }
}