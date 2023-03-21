const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
  position: { x: 0, y: 0 },
  imageSrc: "./img/background.png",
});

const player = new Fighter({
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 10 },
  offset: { x: 0, y: 0 },
});

const enemy = new Fighter({
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

decreaseTimer();

const animate = () => {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  background.update();

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
