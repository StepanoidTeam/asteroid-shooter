import { Vector2 } from "./vector2.js";

export class Ship {
  position = null;
  velocity = null;
  size = null;
  angle = null;
  img = null;
  isThrusting = 0;
  isFiring = false;

  constructor({ x = 0, y = 0, angle = 0, size, img }) {
    this.position = new Vector2({ x, y });
    this.velocity = new Vector2();
    this.direction = new Vector2();

    this.size = size;
    this.angle = angle;

    this.img = img;
  }

  update(timestamp) {
    const ship = this;
    //
    const thrustModifier = 0.3;

    ship.direction.x = Math.cos(((ship.angle + 90) * Math.PI) / 180);
    ship.direction.y = Math.sin(((ship.angle + 90) * Math.PI) / 180);

    if (this.isThrusting) {
      ship.velocity.x += ship.direction.x * thrustModifier * this.isThrusting;
      ship.velocity.y += ship.direction.y * thrustModifier * this.isThrusting;
    }

    // apply friction
    ship.velocity.x *= 0.98;
    ship.velocity.y *= 0.98;

    //stop if low
    ship.velocity.x = Math.abs(ship.velocity.x) > 0.01 ? ship.velocity.x : 0;
    ship.velocity.y = Math.abs(ship.velocity.y) > 0.01 ? ship.velocity.y : 0;

    // apply velocities
    ship.position.x -= ship.velocity.x;
    ship.position.y -= ship.velocity.y;

    //check bounds
  }

  draw(ctx) {
    const ship = this;
    //
    drawImageCenter({
      ctx,
      img: ship.img,
      x: ship.position.x,
      y: ship.position.y,
      cx: ship.size / 2,
      cy: ship.size / 2,
      scale: 1,
      rotation: (ship.angle * Math.PI) / 180,
    });

    // To reset the 2D context transform
    ctx.setTransform(1, 0, 0, 1, 0, 0); // which is much quicker than save and restore

    //debug direction

    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(ship.position.x, ship.position.y);

    const pointLength = 50;
    ctx.lineTo(
      // todo(vmyshko): unsure about minuses
      ship.position.x - pointLength * ship.direction.x,
      ship.position.y - pointLength * ship.direction.y
    );
    ctx.closePath();
    ctx.stroke();
  }
}

function drawImageCenter({ ctx, img, x, y, cx, cy, scale, rotation }) {
  ctx.setTransform(scale, 0, 0, scale, x, y); // sets scale and origin
  ctx.rotate(rotation);
  ctx.drawImage(img, -cx, -cy);
}
