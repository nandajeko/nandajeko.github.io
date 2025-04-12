// PreloadScene.js
export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }
  preload() {
    this.cameras.main.setBackgroundColor('#1a1a1a');
    const { width, height } = this.cameras.main;
    const loadingBar = this.add.graphics();
    const progressBox = this.add.graphics().fillStyle(0x222222, 0.8)
      .fillRect(width / 2 - 100, height / 2 - 25, 200, 50);
    const loadingText = this.add.text(width / 2, height / 2 - 60, 'Loading...', {
      font: '18px sans-serif',
      fill: '#ffffff'
    }).setOrigin(0.5);
    this.load.on('progress', (value) => {
      loadingBar.clear()
        .fillStyle(0xffffff, 1)
        .fillRect(width / 2 - 90, height / 2 - 15, 180 * value, 30);
    });
    this.load.on('complete', () => {
      loadingBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });
    this.load.image('tiles', 'assets/images/tiles.png');
    this.load.tilemapCSV('forestMap', 'assets/maps/forest.csv');
    this.load.tilemapCSV('buildingMap', 'assets/maps/buildingMap.csv');
    const tilemapKeys = [
      'forestMap_npcs', 'forestMap_memories', 'forestMap_portals', 'forestMap_objects',
      'forestMap_spawn', 'forestMap_quests', 'buildingMap_quests',
      'buildingMap_npcs', 'buildingMap_portals', 'buildingMap_spawn'
    ];
    tilemapKeys.forEach(key => {
      this.load.tilemapCSV(key, `assets/maps/${key}.csv`);
    });
    this.load.spritesheet('fuuran_walk', 'assets/images/character/fuuran-walk.png', { frameWidth: 14, frameHeight: 16, spacing: 1 });
    this.load.spritesheet('fuuran_idle', 'assets/images/character/fuuran-idle.png', { frameWidth: 14, frameHeight: 16, spacing: 1 });
    ['npc1', 'npc2', 'npc3', 'npc4', 'npc5', 'npc6', 'npc7'].forEach(npc => {
      this.load.spritesheet(`${npc}_walk`, `assets/images/character/${npc}-walk.png`, { frameWidth: 14, frameHeight: 16, spacing: 1 });
      this.load.spritesheet(`${npc}_idle`, `assets/images/character/${npc}-idle.png`, { frameWidth: 14, frameHeight: 16, spacing: 1 });
    });
    this.load.image('dialogue-box', 'assets/images/dialogue-box.png');
    this.load.image('btn-interact', 'assets/images/btn-interact.png');
    this.load.image('btn-journal', 'assets/images/btn-journal.png');
    this.load.image('journal-panel', 'assets/images/journal-ui.png');
    this.load.image('memory', 'assets/images/memory.png');
    this.load.image('seed', 'assets/images/seed.png');
    this.load.image('carrot', 'assets/images/carrot.png');
    this.load.image('water-can', 'assets/images/water-can.png');
    this.load.image('blank', 'assets/images/blank.png');
    this.load.image('shouse1', 'assets/images/building/shouse1.png');
    this.load.image('shouse2', 'assets/images/building/shouse2.png');
    this.load.image('shouse3', 'assets/images/building/shouse3.png');
    this.load.image('lhouse1', 'assets/images/building/lhouse1.png');
    this.load.image('lhouse2', 'assets/images/building/lhouse2.png');
    this.load.image('lhouse3', 'assets/images/building/lhouse3.png');
    this.load.spritesheet('tree1', 'assets/images/tree1.png', { frameWidth: 32, frameHeight: 32, spacing: 1 });
    this.load.spritesheet('tree2', 'assets/images/tree2.png', { frameWidth: 32, frameHeight: 32, spacing: 1 });
    this.load.spritesheet('flower1', 'assets/images/flower1.png', { frameWidth: 16, frameHeight: 16, spacing: 1 });
    this.load.spritesheet('flower2', 'assets/images/flower2.png', { frameWidth: 16, frameHeight: 16, spacing: 1 });
    this.load.spritesheet('flower3', 'assets/images/flower3.png', { frameWidth: 16, frameHeight: 16, spacing: 1 });
    this.load.spritesheet('flower4', 'assets/images/flower4.png', { frameWidth: 16, frameHeight: 16, spacing: 1 });
    this.load.spritesheet('flower5', 'assets/images/flower5.png', { frameWidth: 16, frameHeight: 16, spacing: 1 });
    this.load.spritesheet('flower6', 'assets/images/flower6.png', { frameWidth: 16, frameHeight: 16, spacing: 1 });
    this.load.spritesheet('whale', 'assets/images/whale1.png', { frameWidth: 32, frameHeight: 32, spacing: 1 });
    this.load.spritesheet('fence1', 'assets/images/fence1.png', { frameWidth: 32, frameHeight: 16, spacing: 1 });
    this.load.spritesheet('rock1', 'assets/images/rock1.png', { frameWidth: 16, frameHeight: 16, spacing: 1 });
    this.load.spritesheet('memory-puzzle', 'assets/images/memory-puzzle.png', { frameWidth: 100, frameHeight: 70 });
    this.load.audio('bg_music', ['assets/audio/background.mp3']);
    this.load.audio('footsteps', ['assets/audio/footsteps.mp3']);
    this.load.audio('healing', ['assets/audio/healing.mp3']);
  }
  create() {
    this.scene.start('GameScene');
    this.scene.launch('UIScene');
  }
}
