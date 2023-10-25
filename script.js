import { ShipController } from "./ShipController.js";
import { Ship } from "./ship.js";
import { Vector2 } from "./vector2.js";

console.log(document.body);

const width = 1024;
const height = 768;

const scale = 1;

// init

const ctx = canvas.getContext("2d");
canvas.width = width * scale;
canvas.height = height * scale;
ctx.scale(scale, scale);
ctx.imageSmoothingEnabled = false; // pixelated

ctx.font = ctx.font.replace(/\d+px/, "16px");

(async function init() {
  const imgShip1 = await getImage("./ship-1.png");
  const imgShip2 = await getImage("./ship-3.png");

  const ship1 = new Ship({
    x: ctx.canvas.width * 0.5 * 0.5,
    y: ctx.canvas.height / 2,
    img: imgShip1,
    angle: 0, //deg
    size: imgShip1.width,
  });

  const ship2 = new Ship({
    x: (ctx.canvas.width * 0.5 * 3) / 2,
    y: ctx.canvas.height / 2,
    img: imgShip2,
    angle: 0, //deg
    size: imgShip2.width,
  });

  const keysPressed = new Set();

  // todo(vmyshko): reg all pressed keys
  document.addEventListener("keydown", (event) => {
    keysPressed.add(event.code);
  });

  document.addEventListener("keyup", (event) => {
    keysPressed.delete(event.code);
  });

  const ship1ctrl = new ShipController({
    ship: ship1,
    keysPressed,
    keys: {
      left: "ArrowLeft",
      right: "ArrowRight",
      forward: "ArrowUp",
      back: "ArrowDown",
      fire: "Space",
    },
    bounds: {
      min: new Vector2({ x: 0, y: 0 }),
      max: new Vector2({ x: ctx.canvas.width / 2, y: ctx.canvas.height }),
    },
  });

  const ship2ctrl = new ShipController({
    ship: ship2,
    keysPressed,
    keys: {
      left: "KeyA",
      right: "KeyD",
      forward: "KeyW",
      back: "KeyS",
      fire: "ShiftLeft",
    },
    bounds: {
      min: new Vector2({ x: ctx.canvas.width / 2, y: 0 }),
      max: new Vector2({ x: ctx.canvas.width, y: ctx.canvas.height }),
    },
  });

  (function draw(timestamp) {
    //gameloop?

    ship1.update(timestamp);
    ship2.update(timestamp);

    ship1ctrl.update(timestamp);
    ship2ctrl.update(timestamp);

    //draw
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = "rgba(0,300,0,0.1)";
    ctx.fillRect(
      ...Object.values(ship1ctrl.minBounds),
      ...Object.values(ship1ctrl.maxBounds)
    );

    // draw ship
    ship1.draw(ctx);

    ship2.draw(ctx);
    // forces

    //debug coords
    ctx.fillText(`x:${ship1.x}; y:${ship1.y}, angle: ${ship1.angle}`, 100, 50);

    ctx.fillText(
      `vx:${ship1.velX}; vy:${ship1.velY}, thrust: ${ship1.thrust}`,
      100,
      100
    );

    requestAnimationFrame(draw);
  })();
})();

/**
 * loads image from /images/ dir
 * @param {string} name image name in /images/ folder
 * @returns {Promise<HTMLImageElement>} promise with loaded image
 */
function getImage(name) {
  return new Promise((resolve) => {
    const imgElement = document.createElement("img");
    imgElement.src = "images/" + name;

    imgElement.addEventListener("load", () => resolve(imgElement), {
      once: true,
    });
  });
}
