// InteractableObject.js
export default class InteractableObject extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, texture, startFrame, animA, mode = 'toggle', frameIndex = 2, animB = null, animAEndFrame = null, animBEndFrame = null) {
    super(scene, x, y, texture, startFrame);
    this.scene = scene;
    this.animA = `${texture}_${animA}`;
    this.animB = animB ? `${texture}_${animB}` : null;
    this.mode = mode;
    this.frameIndex = frameIndex;
    this.animAEndFrame = animAEndFrame;
    this.animBEndFrame = animBEndFrame;
    this.state = 0;
    this.animPlaying = false;
    this.setOrigin(0.5, 1).setDepth(2);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setAllowGravity(false);
    this.body.setImmovable(true);
    this.id = `${scene.mapKey}_${Math.floor(x / 32)}_${Math.floor((y - 32) / 32)}`;
    this.registryKey = 'interactableStates';
    const stateData = scene.registry.get(this.registryKey) || {};
    if (stateData[this.id]) {
      this.state = stateData[this.id].state || 0;
      this.setFrame(stateData[this.id].frame ?? startFrame);
    } else {
      this.setFrame(startFrame);
    }
  }
  trigger() {
    if (this.animPlaying) return;
    if (this.mode === 'permanent' && this.state === 1) return;
    this.animPlaying = true;
    const isFirst = this.state === 0;
    const animKey = isFirst ? this.animA : (this.animB || this.animA);
    const endFrame = isFirst ? (this.animAEndFrame ?? this.frameIndex) : (this.animBEndFrame ?? this.frameIndex);
    this.play(animKey);
    this.once('animationcomplete', () => {
      this.animPlaying = false;
      this.setFrame(endFrame);
      if (this.mode === 'toggle' || this.mode === 'retrigger') {
        this.state = 1 - this.state;
      } else if (this.mode === 'permanent') {
        this.state = 1;
      } else if (this.mode === 'reset') {
        this.state = 0;
        this.setFrame(0);
      }
      if (this.mode === 'permanent' || this.mode === 'retrigger') {
        const stateData = this.scene.registry.get(this.registryKey) || {};
        stateData[this.id] = {
          state: this.state,
          frame: this.frame.name || this.frame.index
        };
        this.scene.registry.set(this.registryKey, stateData);
      }
    });
  }
}