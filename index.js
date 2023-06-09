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

const shop = new Sprite({
  position: { x: 600, y: 128 },
  imageSrc: "./img/shop.png",
  scale: 2.75,
  framesMax: 6,
});

const player = new Fighter({
  position: { x: 250, y: 0 },
  velocity: { x: 0, y: 10 },
  offset: { x: 0, y: 0 },
  imageSrc: "./img/samuraiMack/Idle.png",
  framesMax: 8,
  scale: 2.5,
  offset: { x: 215, y: 157 },
  sprites: {
    idle: { imageSrc: "./img/samuraiMack/Idle.png", framesMax: 8 },
    run: { imageSrc: "./img/samuraiMack/Run.png", framesMax: 8 },
    jump: { imageSrc: "./img/samuraiMack/Jump.png", framesMax: 2 },
    fall: { imageSrc: "./img/samuraiMack/Fall.png", framesMax: 2 },
    attack1: { imageSrc: "./img/samuraiMack/Attack1.png", framesMax: 6 },
    takeHit: {
      imageSrc: "./img/samuraiMack/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    death: { imageSrc: "./img/samuraiMack/Death.png", framesMax: 6 },
  },
  attackBox: {
    offset: { x: 100, y: 50 },
    width: 160,
    height: 50,
  },
});

const enemy = new Fighter({
  position: { x: canvas.width - 250, y: 100 },
  velocity: { x: 0, y: 0 },
  color: "blue",
  offset: { x: -50, y: 0 },
  imageSrc: "./img/kenji/Idle.png",
  offset: { x: 215, y: 170 },
  framesMax: 4,
  scale: 2.5,
  sprites: {
    idle: { imageSrc: "./img/kenji/Idle.png", framesMax: 4 },
    run: { imageSrc: "./img/kenji/Run.png", framesMax: 8 },
    jump: { imageSrc: "./img/kenji/Jump.png", framesMax: 2 },
    fall: { imageSrc: "./img/kenji/Fall.png", framesMax: 2 },
    attack1: { imageSrc: "./img/kenji/Attack1.png", framesMax: 4 },
    takeHit: { imageSrc: "./img/kenji/Take hit.png", framesMax: 3 },
    death: { imageSrc: "./img/kenji/Death.png", framesMax: 7 },
  },
  attackBox: {
    offset: { x: -172, y: 50 },
    width: 172,
    height: 50,
  },
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
  // enemy gets hit
  if (
    rectangularCollision(player, enemy) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takeHit();
    gsap.to("#enemy-health", {
      width: enemy.health + "%",
    });
    player.isAttacking = false;
  }

  // if player misses
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

  if (
    rectangularCollision(enemy, player) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    player.takeHit();
    gsap.to("#player-health", {
      width: player.health + "%",
    });
    enemy.isAttacking = false;
  }
  // if enemy misses
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
  }
};

const movePlayer = () => {
  player.velocity.x = 0;

  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }
};

const moveEnemy = () => {
  enemy.velocity.x = 0;
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }

  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }
};

const movePlayers = () => {
  movePlayer();
  moveEnemy();
};

decreaseTimer();

const animate = () => {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  background.update();
  shop.update();
  c.fillStyle = "rgba(255,255,255,0.2)";
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

animate();

window.addEventListener("keydown", (event) => {
  if (!player.dead && !enemy.dead) {
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
