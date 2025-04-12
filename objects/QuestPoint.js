export default class QuestPoint extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, stepId, action, texture, frame) {
    super(scene, x, y, texture, frame);
    this.scene = scene;
    this.stepId = stepId;
    this.action = action;
    this.setOrigin(0.5);
    this.setDepth(1);
    this.setAlpha(0.9);
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.body.setImmovable(true);
    this.triggered = false;
  }
  trigger() {
    const questManager = this.scene.registry.get('questManager');
    if (this.triggered || !questManager || questManager.getCurrentStepId() !== this.stepId) return;
    this.triggered = true;
    if (typeof this.action === 'function') this.action();
    questManager.advanceStep();
    this.setVisible(false);
    this.body.enable = false;
    this.destroy();
  }
}