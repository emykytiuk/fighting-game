const rectangularCollision = (rectangle1, rectangle2) => {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
};

const determineWinner = (player1Health, player2Health, timerId) => {
  clearTimeout(timerId);
  let result;
  if (player1Health === player2Health) {
    result = "Tie!";
  } else if (player1Health > player2Health) {
    result = "Player 1 Wins!";
  } else {
    result = "Player 2 Wins!";
  }
  document.querySelector("#result").innerHTML = result;
  document.querySelector("#result").style.display = "flex";
};

let timer = 60;
let timerId;
const decreaseTimer = () => {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, [1000]);
    timer--;
    document.querySelector("#game-timer").innerHTML = timer;
  }
  if (timer === 0) {
    determineWinner(player.health, enemy.health, timerId);
  }
};
