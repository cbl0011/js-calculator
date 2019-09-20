const calcContainer = document.querySelector("#calc-container");
const calcDisplay = calcContainer.querySelector("#display");
let displayValue = calcDisplay.textContent;
let currentNum = "";
let answer = "";
let decLock = false;
let operations = [];

const calcButtons = calcContainer.querySelectorAll(".calc-button");
calcButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
        if (Number(e.target.textContent) || e.target.id == 'zero') {
            if (answer != "") {
                operations = [];
                answer = "";
                updateDisplay(e.target.textContent);
                currentNum = e.target.textContent;
            } else if (displayValue == '0') {
                updateDisplay(e.target.textContent);
                currentNum = e.target.textContent;
            } else {
                appendDisplay(e.target.textContent);
                currentNum = currentNum + "" + e.target.textContent;
            }
        } else if (e.target.id == 'clear') {
            clear();
        } else if (e.target.id == 'decimal') {
            if (!decLock) {
                currentNum = currentNum + ".";
                appendDisplay('.');
                decLock = true;
            }
        } else if (e.target.id == 'equals') {
            evaluate();
        } else {
            if (answer != "") {
                operations = [];
                currentNum = answer;
                answer = "";
            }
            isOperand(e.target.textContent);
        }
        console.log(operations);
    })
});

function evaluate() {
    decLock = false;
    if (currentNum != "") operations.push(currentNum);
    currentNum = '';
    replaceExpression(['*','/','-','+']);
    answer = Math.round(operations[0]*100000)/100000;
    if (answer > 99999999999) {
        updateDisplay('OVERFLOW');
    } else {
        updateDisplay(answer);
    }
}

function replaceExpression(opArr) {
    opArr.forEach((op) => {
        while (operations.indexOf(op) >= 0) {
            let operationFunction;
            switch(op) {
                case '*':
                        operationFunction = multiply;
                        break;
                case '/': 
                        operationFunction = divide;
                        break;
                case '+':
                        operationFunction = add;
                        break;
                case '-': 
                        operationFunction = subtract;
                        break;
            }
            let opIndex = operations.indexOf(op);
            operations.splice(opIndex - 1, 3, 
                operationFunction(+operations[opIndex - 1], +operations[opIndex + 1]));
        }
    });
}

function isOperand(op) {
    if (op == 'X') op = '*';
    if (op == '÷') op = '/';
    appendDisplay(' ' + op + ' ');
    decLock = false;
    if (currentNum == '') {
        updateDisplay('ERROR');
    } else {
        operations.push(Number(currentNum));
        operations.push(op);
    }   
    currentNum = '';
    answer = '';
}

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b == '0') {
        updateDisplay('DIV/0');
        answer = 0;
        currentNum = '';
        return 'DIV/0';
    }
    return a / b;
}

function operate(operator, firstNum, secondNum) {
    switch(operator) {
        case '+':
            return add(firstNum, secondNum);
        case '-':
            return subtract(firstNum, secondNum);
        case '*':
            return multiply(firstNum, secondNum);
        case '/':
            return divide(firstNum, secondNum);
        default:
            return 'ERROR';
    }
}

function updateDisplay(text) {
    displayValue = text;
    calcDisplay.textContent = displayValue;
}

function appendDisplay(text) {
    updateDisplay(displayValue + text);
}

function clear() {
    updateDisplay('0');
    decLock = false;
    currentNum = "";
    operations = [];
    answer = "";
}