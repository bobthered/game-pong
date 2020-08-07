/* eslint-disable no-undef */
let ball,
  background,
  cursors,
  opponent,
  player,
  scoreOpponent,
  scorePlayer,
  scoreTextOpponent,
  scoreTextPlayer,
  velocity;

const config = {
  dom: {
    createContainer: true,
  },
  height: 1080,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      debugShowBody: true,
      debugShowStaticBody: true,
      debugShowVelocity: true,
      debugVelocityColor: 0xffff00,
      debugBodyColor: 0x0000ff,
      debugStaticBodyColor: 0xffffff,
    },
  },
  scene: {
    preload: preloadGame,
    create: createGame,
    update: updateGame,
  },
  type: Phaser.AUTO,
  width: 1920,
};
config.scale = {
  mode: Phaser.Scale.FIT,
  parent: 'body',
  width: config.width,
  height: config.height,
};

const paddleSpeed = (config.width / 800) * 300;

function hitOpponent(ball) {
  velocity.x = velocity.x - (config.width / 800) * 50;
  velocity.x = velocity.x * -1;
  console.log(velocity.x);

  ball.body.setVelocityX(velocity.x);

  if (velocity.y < 0) {
    velocity.y = velocity.y * -1;
    ball.body.setVelocityY(velocity.y);
  }
}
function hitPlayer(ball) {
  velocity.x = velocity.x + (config.width / 800) * 50;
  velocity.x = velocity.x * -1;

  ball.body.setVelocityX(velocity.x);

  if (velocity.y < 0) {
    velocity.y = velocity.y * -1;
    ball.body.setVelocityY(velocity.y);
  }
}
function reset() {
  velocity.x =
    (Math.random() * ((config.width / 800) * 50) + (config.width / 800) * 50) *
    (Math.floor(Math.random() * 2) === 0 ? 1 : -1);
  velocity.y =
    (config.width / 800) * 100 * (Math.floor(Math.random() * 2) === 0 ? 1 : -1);
  opponent.x = (config.width * 20) / 800;
  opponent.y = (config.width * 200) / 800;
  player.x = config.width - (config.width * 20) / 800;
  player.y = (config.width * 200) / 800;
  ball.x = config.width / 2;
  ball.y = config.height / 2;
  ball.body.setVelocityX(velocity.x);
  ball.body.setVelocityY(velocity.y);
}
function preloadGame() {}
function createGame() {
  cursors = this.input.keyboard.createCursorKeys();

  this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

  background = this.add.graphics();
  background.fillStyle(0x84e6e9);
  background.fillRectShape(
    new Phaser.Geom.Rectangle(0, 0, config.width / 2, config.height),
  );
  background.fillStyle(0xff96ad);
  background.fillRectShape(
    new Phaser.Geom.Rectangle(config.width / 2, 0, config.width, config.height),
  );

  opponent = this.add.graphics();
  opponent.fillStyle(0xffffff);
  opponent.fillRectShape(
    new Phaser.Geom.Rectangle(
      0,
      0,
      (config.width / 800) * 8,
      (config.width / 800) * 60,
    ),
  );

  this.physics.world.enable(opponent);
  opponent.body.setSize((config.width / 800) * 8, (config.width / 800) * 60);
  opponent.body.setCollideWorldBounds(true);
  opponent.body.setImmovable(true);

  player = this.add.graphics();
  player.fillStyle(0xffffff);
  player.fillRectShape(
    new Phaser.Geom.Rectangle(
      0,
      0,
      (config.width / 800) * 8,
      (config.width / 800) * 60,
    ),
  );

  this.physics.world.enable(player);
  player.body.setSize((config.width / 800) * 8, (config.width / 800) * 60);
  player.body.setCollideWorldBounds(true);
  player.body.setImmovable(true);

  velocity = {
    x: 0,
    y: 0,
  };

  ball = this.add.graphics();
  ball.fillStyle(0xffffff);
  ball.fillCircleShape(
    new Phaser.Geom.Circle(
      (config.width / 800) * 6,
      (config.width / 800) * 6,
      (config.width / 800) * 6,
    ),
  );

  this.physics.world.enable(ball);
  ball.body.bounce.set(1);
  ball.body.setCircle((config.width / 800) * 6);
  ball.body.x = config.width / 2;
  ball.body.y = config.height / 2;
  ball.body.setCollideWorldBounds(true);

  this.physics.add.collider(ball, player, hitPlayer, null, this);
  this.physics.add.collider(ball, opponent, hitOpponent, null, this);

  scoreOpponent = 0;
  scorePlayer = 0;
  scoreTextOpponent = this.add.text(
    (config.width / 800) * 16,
    (config.width / 800) * 16,
    `score: ${scoreOpponent}`,
    {
      fontFamily: '"Lato", sans-serif',
      fontSize: `${(config.width / 800) * 16}px`,
      fill: '#FFFFFF',
    },
  );
  scoreTextPlayer = this.add.text(
    (config.width / 800) * 720,
    (config.width / 800) * 16,
    `score: ${scorePlayer}`,
    {
      align: 'right',
      fontFamily: '"Lato", sans-serif',
      fontSize: `${(config.width / 800) * 16}px`,
      fill: '#FFFFFF',
    },
  );

  reset();
}
function updateGame() {
  opponent.body.setVelocityY(0);
  if (this.keyW.isDown) opponent.body.setVelocityY(-paddleSpeed);
  if (this.keyS.isDown) opponent.body.setVelocityY(paddleSpeed);

  player.body.setVelocityY(0);
  if (cursors.up.isDown) player.body.setVelocityY(-paddleSpeed);
  if (cursors.down.isDown) player.body.setVelocityY(paddleSpeed);

  if (ball.body.x > (config.width / 800) * 788) {
    scoreOpponent += 1;
    scoreTextOpponent.setText(`score: ${scoreOpponent}`);
    reset();
  }
  if (ball.body.x < (config.width / 800) * 5) {
    scorePlayer += 1;
    scoreTextPlayer.setText(`score: ${scorePlayer}`);
    reset();
  }
}

new Phaser.Game(config);
