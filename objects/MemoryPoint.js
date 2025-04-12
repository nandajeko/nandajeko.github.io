// MemoryPoint.js
export default class MemoryPoint extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, id, message) {
    super(scene, x, y, 'memory');
    this.scene = scene;
    this.id = id;
    this.message = message;
    this.setOrigin(0.5);
    this.setDepth(1);
    this.setAlpha(0.9);
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.body.setImmovable(true);
    this.collected = false;
  }
  trigger() {
    if (this.collected) return;
    this.collected = true;
    this.scene.registry.events.emit('start-dialogue', [this.message]);
    this.scene.registry.events.emit('new-memory', {
      id: this.id,
      // text: this.message
    });
    if (!this.scene.collectedMemories.includes(this.id)) {
      this.scene.collectedMemories.push(this.id);
      this.scene.registry.set('collectedMemories', this.scene.collectedMemories);
    }
    this.setVisible(false);
    this.body.enable = false;
    this.destroy();
  }
}