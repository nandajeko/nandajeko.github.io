// NPC.js
export default class NPC extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, type = 'normal', name = 'npc', patrolSize = 32) {
  super(scene, x, y, `${name}_idle`);
    this.scene = scene;
    this.name = name;
    this.id = name;
    this.type = type;
    this.dialogue = [];
    this.direction = 'down';
    this.isMoving = false;
    this.player = scene.player;
    this.spawnX = x;
    this.spawnY = y;
    this.patrolSize = patrolSize;
    scene.physics.world.enable(this);
    scene.add.existing(this);
    this.setDepth(1);
    this.setScale(1);
    this.setOrigin(0.5, 0.5);
    this.body.setCollideWorldBounds(true);
    this.body.setImmovable(true);
    const directions = ['down', 'left', 'right', 'up'];
    directions.forEach((dir, i) => {
      const walkKey = `${name}_walk-${dir}`;
      const idleKey = `${name}_idle-${dir}`;
      if (!scene.anims.exists(walkKey)) {
        scene.anims.create({
          key: walkKey,
          frames: scene.anims.generateFrameNumbers(`${name}_walk`, {
            start: i * 3,
            end: i * 3 + 2
          }),
          frameRate: 6,
          repeat: -1
        });
      }
      if (!scene.anims.exists(idleKey)) {
        scene.anims.create({
          key: idleKey,
          frames: [
            { key: `${name}_idle`, frame: i * 2 },
            { key: `${name}_idle`, frame: i * 2 + 1 }
          ],
          frameRate: 1,
          repeat: -1
        });
      }
    });
    if (this.type === 'normal') {
      this.startRandomWalk();
    } else if (this.type === 'quest') {
      this.anims.play(`${name}_idle-down`);
    }
  }
  startRandomWalk() {
    this.scene.time.addEvent({
      delay: Phaser.Math.Between(2000, 4000),
      loop: true,
      callback: () => {
        if (!this.active) return;
        const directions = ['down', 'left', 'right', 'up'];
        Phaser.Utils.Array.Shuffle(directions);
        for (let dir of directions) {
          const velocityMap = {
            down: { x: 0, y: 1 },
            up: { x: 0, y: -1 },
            left: { x: -1, y: 0 },
            right: { x: 1, y: 0 }
          };
          const { x, y } = velocityMap[dir];
          const newX = this.x + x * this.patrolSize;
          const newY = this.y + y * this.patrolSize;
          if (
          Math.abs(newX - this.spawnX) <= this.patrolSize &&
          Math.abs(newY - this.spawnY) <= this.patrolSize
          ) {
            this.direction = dir;
            this.body.setVelocity(x * 30, y * 30);
            this.anims.play(`${this.name}_walk-${dir}`, true);
            this.scene.time.delayedCall(1000, () => {
              this.body.setVelocity(0);
              this.anims.play(`${this.name}_idle-${dir}`, true);
            });
            break;
          }
        }
      }
    });
  }
  facePlayer(player) {
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      this.direction = dx > 0 ? 'right' : 'left';
    } else {
      this.direction = dy > 0 ? 'down' : 'up';
    }
    this.anims.play(`${this.name}_idle-${this.direction}`, true);
  }
}