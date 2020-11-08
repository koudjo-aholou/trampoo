// eslint-disable-next-line max-classes-per-file
class Game {
  constructor(platformCount, score, level, cheatCount,
    timeMsIncreaseLvl, isGameOver, isGoingLeft, isGoingRight, isJumping) {
    this.platformCount = platformCount;
    this.platforms = [];
    this.score = score;
    this.level = level;
    this.cheatCount = cheatCount;
    this.timeIncreaseLvl = timeMsIncreaseLvl;
    this.isGameOver = isGameOver;
    this.isGoingLeft = isGoingLeft;
    this.isGoingRight = isGoingRight;
    this.isJumping = isJumping;
  }
}

class Doodle {
  constructor(avatar, doodleLeftSpace, doodleBottomSpace, startPoint) {
    this.doodleLeftSpace = doodleLeftSpace;
    this.doodleBottomSpace = doodleBottomSpace;
    this.startPoint = startPoint;
    this.defaultCarac = avatar;
  }
}
document.addEventListener('DOMContentLoaded', () => {
  const startGame = document.querySelector('#start');
  const container = document.querySelector('.container');
  // platformCount, score, level, timeIncreaseLvl, isGameOver, isGoingLeft, isGoingRight
  const newGame = new Game(5, 0, 0, 2, 70, false, false, false, true);
  const newDoodle = new Doodle('url(./src/img/naaf.svg)', 50, 250, 250); // avatar, doodleLeftSpace, doodleBottomSpace, startPoint
  const grid = document.querySelector('#grid');
  const doodler = document.createElement('div');
  const levelElement = document.getElementById('level');
  const scoreElement = document.getElementById('score');

  let upTimerId;
  let downTimerId;
  let leftTimerId;
  let rightTimerId;
  let platformTimrId;

  document.getElementById('start').addEventListener('click', () => { start(); });

  // Methode ?? de la classe Doodle ou Game ?
  function createDoodler() {
    grid.appendChild(doodler);
    doodler.classList.add('doodler');
    newDoodle.doodleLeftSpace = newGame.platforms[0].left;
    doodler.style.left = ` ${newDoodle.doodleLeftSpace}px`;
    doodler.style.bottom = ` ${newDoodle.doodleBottomSpace}px`;
  }

  function createElement(html) {
    return document.createElement(html);
  }
  class Platform {
    constructor(newPlatformBottom) {
      this.bottom = newPlatformBottom;
      let generateRandomWidth = Math.random() * 200;
      if (window.innerWidth > 400) {
        generateRandomWidth = Math.random() * 315;
      }
      this.left = generateRandomWidth;
      this.visual = createElement('div');
      const { visual } = this;
      visual.classList.add('platform');
      visual.style.left = `${this.left}px`;
      visual.style.bottom = `${this.bottom}px`;
      grid.appendChild(visual);
    }
  }

  function createPlatforms(platformCount) {
    const updatePlatform = [];
    for (let i = 0; i < platformCount; i += 1) {
      const platformGap = 600 / platformCount;
      const newPlatformBottom = 100 + i * platformGap;
      const newPlatform = new Platform(newPlatformBottom);
      updatePlatform.push(newPlatform);
    }
    return updatePlatform;
  }

  function moovePlatforms() {
    if (newDoodle.doodleBottomSpace > 200) {
      newGame.platforms.forEach((platform) => {
        platform.bottom -= 4;
        const { visual } = platform;
        visual.style.bottom = `${platform.bottom}px`;
        if (platform.bottom < 10) {
          const firstPlatform = newGame.platforms[0].visual;
          firstPlatform.remove();
          newGame.platforms.shift();
          newGame.score += 1;
          scoreElement.textContent = newGame.score;
          const newPlatform = new Platform(600);
          newGame.platforms.push(newPlatform);
        }
      });
    }
  }

  function jump() {
    newGame.isJumping = true;
    const avatar = doodler.style.backgroundImage;
    clearInterval(downTimerId);
    upTimerId = setInterval(() => {
      newDoodle.doodleBottomSpace += 15;
      doodler.style.bottom = `${newDoodle.doodleBottomSpace}px`;
      if (newDoodle.doodleBottomSpace > newDoodle.startPoint + 210) {
        fall();
      }
      if (avatar !== newDoodle.defaultCarac) {
        doodler.style.backgroundImage = newDoodle.defaultCarac;
      }
    }, 30);
  }

  function fall() {
    clearInterval(upTimerId);
    newGame.isJumping = false;
    downTimerId = setInterval(() => {
      newDoodle.doodleBottomSpace -= 10;
      doodler.style.bottom = `${newDoodle.doodleBottomSpace}px`;
      if (newDoodle.doodleBottomSpace <= 0) {
        gameOver();
      }
      newGame.platforms.forEach((platform) => {
        if (checkJump(newDoodle.doodleBottomSpace, newDoodle.doodleLeftSpace,
          platform, newGame.isJumping)) {
          newDoodle.startPoint = newDoodle.doodleBottomSpace;
          jump();
        }
      });
    }, 30);
  }

  function checkJump(bottomSpace, leftSpace, platform, isJumping) {
    return (bottomSpace >= platform.bottom)
    && (bottomSpace <= platform.bottom + 15)
    && ((leftSpace + 60) >= platform.left)
    && (leftSpace <= (platform.left + 70))
    && !isJumping;
  }

  function gameOver() {
    newGame.isGameOver = true;
    while (grid.firstChild) {
      grid.removeChild(grid.firstChild);
    }

    scoreElement.textContent = newGame.score;
    clearInterval(upTimerId);
    clearInterval(downTimerId);
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
    clearInterval(platformTimrId);
    tryAgain();
  }

  function tryAgain() {
    const gameOver = document.createElement('button');
    grid.appendChild(gameOver);
    gameOver.setAttribute('id', 'gameOver');
    gameOver.classList.add('homeBtn');
    gameOver.textContent = 'TRY AGAIN';
    document.removeEventListener('click', mobileControl);
    document.getElementById('gameOver').addEventListener('click', () => { location.reload(); });
  }
  function control(e) {
    if (e.key === 'ArrowLeft') {
      moveLeft();
    } else if (e.key === 'ArrowRight') {
      moveRight();
    } else if (e.key === 'ArrowUp') {
      moveStraight();
    } else if (e.key === 'ArrowDown') {
      if (!newGame.isGameOver) {
        cheat();
      }
    }
  }

  function cheat() {
    doodler.style.backgroundImage = 'url(./src/img/troll.png)';
    newDoodle.doodleBottomSpace += window.innerHeight / newGame.cheatCount;
    doodler.style.bottom = `${newDoodle.doodleBottomSpace}px`;
    newGame.cheatCount += 25;
  }
  function moveLeft() {
    doodler.style.backgroundImage = newDoodle.defaultCarac;
    newGame.isGoingLeft = true;
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
    if (newGame.isGoingRight) {
      clearInterval(rightTimerId);
      newGame.isGoingRight = false;
    }
    leftTimerId = setInterval(() => {
      if (newDoodle.doodleLeftSpace >= 0) {
        newDoodle.doodleLeftSpace -= 7;
        doodler.style.left = `${newDoodle.doodleLeftSpace}px`;
      } else moveRight();
    }, 30);
  }

  function moveRight() {
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
    doodler.style.backgroundImage = newDoodle.defaultCarac;
    if (newGame.isGoingLeft) {
      clearInterval(leftTimerId);
      newGame.isGoingLeft = false;
    }
    newGame.isGoingRight = true;
    rightTimerId = setInterval(() => {
      if (newDoodle.doodleLeftSpace <= 340) {
        newDoodle.doodleLeftSpace += 7;
        doodler.style.left = `${newDoodle.doodleLeftSpace}px`;
      } else moveLeft();
    }, 30);
  }

  function moveStraight() {
    newGame.isGoingLeft = false;
    newGame.isGoingRight = false;
    doodler.style.backgroundImage = 'url(./src/img/parachute.png)';
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
  }
  function increaseLevel() {
    platformTimrId = setInterval(() => {
      if (newGame.timeIncreaseLvl > 40) {
        newGame.timeIncreaseLvl -= 10;
        newGame.level += 1;
        levelElement.innerText = newGame.level;
      }
      setInterval(moovePlatforms, newGame.timeIncreaseLvl);
    }, 20000);
  }

  function mobileControl(id) {
    const value = id.target.attributes.id.value || null;
    switch (value) {
      case 'controlLeft':
        moveLeft();
        break;
      case 'controlRight':
        moveRight();
        break;
      case 'controlUp':
        moveStraight();
        break;
      case 'controlDown':
        cheat();
        break;
      case null:
        break;
      default:
        break;
    }
  }
  function start() {
    if (!newGame.isGameOver) {
      container.classList.remove('hide');
      container.classList.add('active');
      startGame.style.display = 'none';
      levelElement.innerText = newGame.level;
      scoreElement.innerText = newGame.score;
      newGame.platforms = createPlatforms(newGame.platformCount);
      createDoodler();
      platformTimrId = setInterval(moovePlatforms, 30);
      jump();
      document.addEventListener('keyup', control);
      document.addEventListener('click', mobileControl);
      increaseLevel();
    }
  }
});
