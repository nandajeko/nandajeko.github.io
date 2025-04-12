// Player.js
export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'fuuran_walk');
    scene.physics.world.enable(this);
    scene.add.existing(this);
    this.footstepSound = scene.sound.add('footsteps', { loop: true, volume: 0.5 });
    this.setDepth(1);
    this.setScale(1);
    this.setOrigin(0.5, 0.5);
    const directions = ['down', 'left', 'right', 'up'];
    directions.forEach((dir, i) => {
      if (!scene.anims.exists(`walk-${dir}`)) {
        scene.anims.create({
          key: `walk-${dir}`,
          frames: scene.anims.generateFrameNumbers('fuuran_walk', {
            start: i * 3,
            end: i * 3 + 2
          }),
          frameRate: 8,
          repeat: -1
        });
      }
      if (!scene.anims.exists(`idle-${dir}`)) {
        scene.anims.create({
          key: `idle-${dir}`,
          frames: [
            { key: 'fuuran_idle', frame: i * 2 },
            { key: 'fuuran_idle', frame: i * 2 + 1 }
          ],
          frameRate: 1,
          repeat: -1
        });
      }
    });
    this.direction = 'down';
    this.speed = 100;
    this.joystick = null;
  }
  setJoystick(joystick) {
    this.joystick = joystick;
  }
  update() {
    if (!this.joystick) return;
    const { forceX, forceY } = this.joystick;
    this.body.setVelocity(0);
    if (forceX !== 0 || forceY !== 0) {
      this.body.setVelocity(forceX * this.speed, forceY * this.speed);
      this.body.velocity.normalize().scale(this.speed);
      if (Math.abs(forceY) > Math.abs(forceX)) {
        this.direction = forceY > 0 ? 'down' : 'up';
      } else {
        this.direction = forceX > 0 ? 'right' : 'left';
      }
      this.anims.play(`walk-${this.direction}`, true);
      if (!this.footstepSound.isPlaying) {
        this.footstepSound.play();
      }
    } else {
      this.anims.play(`idle-${this.direction}`, true);
      if (this.footstepSound.isPlaying) {
        this.footstepSound.stop();
      }
    }
  }
}