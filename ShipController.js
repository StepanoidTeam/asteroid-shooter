export class ShipController {
  ship = null;
  keys = null;
  keysPressed = null;

  constructor({ ship, keys, keysPressed, bounds: { min, max } }) {
    this.ship = ship;
    this.keys = keys;
    this.minBounds = min;
    this.maxBounds = max;

    this.keysPressed = keysPressed;
  }

  update(timestamp) {
    const { left, right, forward, back, fire } = this.keys;

    const { ship, keysPressed } = this;

    //move forward
    ship.isThrusting = keysPressed.has(forward)
      ? 1
      : keysPressed.has(back)
      ? -1
      : 0;

    //firing
    ship.isFiring = keysPressed.has(fire);

    const angleStep = 5;
    //turns
    if (keysPressed.has(left)) {
      ship.angle -= angleStep;
    }

    if (keysPressed.has(right)) {
      ship.angle += angleStep;
    }

    if (keysPressed.size) console.log(keysPressed);

    //bounds

    // todo(vmyshko): not sure where to keep it
    if (ship.position.x < this.minBounds.x) {
      ship.position.x = this.maxBounds.x;
    }
    if (ship.position.x > this.maxBounds.x) {
      ship.position.x = this.minBounds.x;
    }
    if (ship.position.y < this.minBounds.y) {
      ship.position.y = this.maxBounds.y;
    }
    if (ship.position.y > this.maxBounds.y) {
      ship.position.y = this.minBounds.y;
    }
  }
}
