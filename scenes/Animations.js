export function createGameAnimations(scene) {
  for (let i = 1; i <= 6; i++) {
    const key = `flower${i}`;
    if (!scene.anims.exists(`${key}_bloom`)) {
      scene.anims.create({
        key: `${key}_bloom`,
        frames: scene.anims.generateFrameNumbers(key, { start: 0, end: 2 }),
        frameRate: 3,
        repeat: 0
      });
    }
    if (!scene.anims.exists(`${key}_unbloom`)) {
      scene.anims.create({
        key: `${key}_unbloom`,
        frames: scene.anims.generateFrameNumbers(key, { start: 2, end: 0 }),
        frameRate: 3,
        repeat: 0
      });
    }
  }
  if (!scene.anims.exists('tree1_healed')) {
    scene.anims.create({
      key: 'tree1_healed',
      frames: scene.anims.generateFrameNumbers('tree1', { start: 0, end: 2 }),
      frameRate: 3,
      repeat: 0
    });
  }
  if (!scene.anims.exists('whale_splash')) {
    scene.anims.create({
      key: 'whale_splash',
      frames: scene.anims.generateFrameNumbers('whale', { start: 0, end: 7 }),
      frameRate: 6,
      repeat: 0
    });
  }
}
export function playBloomAnimation(scene, x, y) {
  const flower = scene.add.sprite(x, y, 'flower6', 2)
    .setOrigin(0.5)
    .setDepth(2);
  flower.play(`flower6_bloom`);
  scene.decorations.add(flower);
  scene.sound.play('healing', { volume: 0.5 });
}
export function playTreeHealingAnimation(scene, x, y) {
  const tree = scene.add.sprite(x, y, 'tree1', 2)
    .setOrigin(0.5)
    .setDepth(2);
  tree.play('tree1_healed');
  scene.decorations.add(tree);
  scene.sound.play('healing', { volume: 0.5 });
}