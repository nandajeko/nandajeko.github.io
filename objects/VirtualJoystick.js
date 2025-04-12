export default class VirtualJoystick {
  constructor(scene) {
    this.scene = scene;
    this.forceX = 0;
    this.forceY = 0;
    this.active = false;
    this.maxDistance = 40;
    scene.input.on('pointerdown', this.start, this);
    scene.input.on('pointermove', this.move, this);
    scene.input.on('pointerup', this.end, this);
  }
  start(pointer) {
    this.startX = pointer.x;
    this.startY = pointer.y;
    this.active = true;
  }
  move(pointer) {
    if (!this.active) return;
    const dx = pointer.x - this.startX;
    const dy = pointer.y - this.startY;
    const dist = Math.min(this.maxDistance, Math.sqrt(dx * dx + dy * dy));
    const angle = Math.atan2(dy, dx);
    const x = Math.cos(angle) * dist;
    const y = Math.sin(angle) * dist;
    this.forceX = Phaser.Math.Clamp(x / this.maxDistance, -1, 1);
    this.forceY = Phaser.Math.Clamp(y / this.maxDistance, -1, 1);
  }
  end() {
    this.active = false;
    this.forceX = 0;
    this.forceY = 0;
  }
}