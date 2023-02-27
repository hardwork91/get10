// elelentos HTML
const gameContainerDiv = document.getElementById('game-container');
const digitSelector = document.getElementById('digit-selector');
const startButton = document.getElementById('start');
const restartButton = document.getElementById('restart');
const digitos = document.getElementById('digitos');
const numberLabel = document.getElementById('number');
const solutionLabel = document.getElementById('solution');
const operationsContainer = document.getElementById('operations');
const answerLabel = document.getElementById('answer');

// variables
let number;
let digitCount;
const EXPECTED_RESULT = 10;
const OPERATIONS = ['+', '-', '*', '/'];
let posibleOperationsCombinations = {};
let answer = '';

const boot = () => {
  posibleOperationsCombinations = {
    2: getPermutationsWithRepetition(1),
    3: getPermutationsWithRepetition(2),
    4: getPermutationsWithRepetition(3),
    5: getPermutationsWithRepetition(4),
  };

  OPERATIONS.forEach((operation) => {
    const node = document.createElement('div');
    node.className = 'operator';
    const textnode = document.createTextNode(operation);
    node.appendChild(textnode);
    node.onclick = handleOperationClick(operation);
    operationsContainer.appendChild(node);
  });
};

const updateAnswer = (newAnswer) => {
  if (newAnswer.length < digitCount) {
    answer = newAnswer;
    answerLabel.textContent = newAnswer;

    if (newAnswer.length === digitCount - 1) {
      checkAnswer();
    }
  }
};

const clearAnswer = () => {
  answer = '';
  answerLabel.textContent = '';
};

const checkAnswer = () => {
  const result = evalFullOperation(number.toString().split(''), answer);
  if (result === EXPECTED_RESULT) {
    alert('ganaste');
    start()
  }
};

const handleOperationClick = (operation) => {
  return () => {
    updateAnswer(`${answer}${operation}`);
  };
};

const start = () => {
  digitSelector.style.display = 'none';
  startButton.style.display = 'none';
  gameContainerDiv.style.display = 'flex';
  restartButton.style.display = 'flex';
  digitos.disabled = true;
  clearAnswer();
  startGame();
};

const restart = () => {
  digitSelector.style.display = 'block';
  startButton.style.display = 'flex';
  gameContainerDiv.style.display = 'none';
  restartButton.style.display = 'none';
  digitos.disabled = false;
};

const getPermutationsWithRepetition = (n) => {
  const result = [];

  function permute(current) {
    if (current.length === n) {
      result.push(current.slice());
      return;
    }

    for (let i = 0; i < OPERATIONS.length; i++) {
      current.push(OPERATIONS[i]);
      permute(current);
      current.pop();
    }
  }

  permute([]);

  return result;
};

const startGame = () => {
  digitCount = digitos.value;
  generateNumber();
};

const generateNumber = () => {
  let min = Math.pow(10, digitCount - 1);
  let max = Math.pow(10, digitCount) - 1;
  number = Math.floor(Math.random() * (max - min + 1) + min);

  const solutions = findSolutions();
  if (solutions.length === 0) {
    generateNumber();
  } else {
    numberLabel.textContent = number;
    console.log(solutions);
    // solutionLabel.textContent = solutions[0].join(" ");
  }
};

const findSolutions = () => {
  const digits = number.toString().split('');
  const validOperations = [];
  posibleOperationsCombinations[digitCount].forEach((combination) => {
    const result = evalFullOperation(digits, combination);
    if (result === EXPECTED_RESULT) {
      validOperations.push(combination);
    }
  });
  return validOperations;
};

const evalFullOperation = ([firstDigit, ...digits], OPERATIONS) => {
  let expression = `${firstDigit}`;
  digits.forEach((digit, index) => {
    expression = `(${expression}${OPERATIONS[index]}${digit})`;
  });
  return eval(expression);
};

boot();
