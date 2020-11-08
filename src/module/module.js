export function checkJump(bottomSpace, leftSpace, platform, isJumping) {
  return (bottomSpace >= platform.bottom)
  && (bottomSpace <= platform.bottom + 15)
  && ((leftSpace + 60) >= platform.left)
  && (leftSpace <= (platform.left + 70))
  && !isJumping;
}

export function mobileControl(id) {
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
