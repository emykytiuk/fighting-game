const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

class Sprite {
  constructor({ position, velocity, color = "red", offset }) {
    this.position = position;
    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.lastKey;
    this.attackBox = {
      position: { x: this.position.x, y: this.position.y },
      offset,
      width: 100,
      height: 50,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;
  }

  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    if (this.isAttacking) {
      c.fillStyle = "green";
      c.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  }

  update() {
    this.draw();

    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += gravity;
    }
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, [100]);
  }
}

const player = new Sprite({
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 10 },
  offset: { x: 0, y: 0 },
});
const enemy = new Sprite({
  position: { x: 400, y: 100 },
  velocity: { x: 0, y: 0 },
  color: "blue",
  offset: { x: -50, y: 0 },
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
};

const detectCollisions = () => {
  if (rectangularCollision(player, enemy) && player.isAttacking) {
    enemy.health -= 20;
    document.querySelector("#enemy-health").style.width = enemy.health + "%";
    player.isAttacking = false;
  }

  if (rectangularCollision(enemy, player) && enemy.isAttacking) {
    player.health -= 20;
    document.querySelector("#player-health").style.width = player.health + "%";
    enemy.isAttacking = false;
  }
};

const movePlayers = () => {
  // player movement
  player.velocity.x = 0;
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
  }

  // enemy movement
  enemy.velocity.x = 0;
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
  }
};

const determineWinner = (player1Health, player2Health, timerId) => {
  clearTimeout(timerId)
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
decreaseTimer();

const animate = () => {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  player.update();
  enemy.update();

  movePlayers();
  detectCollisions();

  endGameOnHealth();
};

const endGameOnHealth = () => {
  if (player.health <= 0 || enemy.health <= 0) {
    determineWinner(player.health, enemy.health, timerId);
  }
};

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

animate();

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "a":
      player.lastKey = "a";
      keys.a.pressed = true;
      break;
    case "d":
      player.lastKey = "d";
      keys.d.pressed = true;
      break;
    case "w":
      player.velocity.y = -20;
      break;
    case " ":
      player.attack();
      break;

    // enemy
    case "ArrowLeft":
      enemy.lastKey = "ArrowLeft";
      keys.ArrowLeft.pressed = true;
      break;
    case "ArrowRight":
      enemy.lastKey = "ArrowRight";
      keys.ArrowRight.pressed = true;
      break;
    case "ArrowUp":
      enemy.velocity.y = -20;
      break;
    case "ArrowDown":
      enemy.attack();
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    // player
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "w":
      keys.w.pressed = false;
      break;

    // enemy
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowUp":
      keys.ArrowUp.pressed = false;
      break;
  }
});
