// GameScene.js
import Player from '../objects/Player.js';
import VirtualJoystick from '../objects/VirtualJoystick.js';
import NPC from '../objects/NPC.js';
import QuestManager from '../objects/QuestManager.js';
import QuestPoint from '../objects/QuestPoint.js';
import InteractableObject from '../objects/InteractableObject.js';
import { createGameAnimations, playBloomAnimation, playTreeHealingAnimation } from './Animations.js';
import { createMemory, addMemory } from '../objects/MemoryHandler.js';
import { decorCollider } from '../objects/DecorCollider.js';
export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }
  init(data) {
    this.mapKey = data.mapKey || 'forestMap';
    this.spawnTileIndex = data.spawnTileIndex || 1000;
  }
  create() {
    const map = this.make.tilemap({ key: this.mapKey, tileWidth: 32, tileHeight: 32 });
    const tileset = map.addTilesetImage('tiles', null, 32, 32);
    map.createLayer(0, tileset).setDepth(0);
    this.map = map;
    this.npcs = this.add.group();
    this.memoryPoints = this.add.group();
    this.questPoints = this.add.group();
    this.decorations = this.add.group();
    this.portals = [];
    this.collectedMemories = this.registry.get('collectedMemories') || [];
    this.bloomedFlowers = this.registry.get('bloomedFlowers') || [];
    this.healedTrees = this.registry.get('healedTrees') || [];
    this.questManager = new QuestManager(this);
    this.registry.set('questManager', this.questManager);
    this.registry.set('completedQuestSteps', this.registry.get('completedQuestSteps') || []);
    this.registry.set('completedQuests', this.registry.get('completedQuests') || []);
    const spawn = this.getSpawnFromTileIndex(this.spawnTileIndex) || { x: 100, y: 100 };
    this.player = new Player(this, spawn.x, spawn.y);
    this.player.body.setCollideWorldBounds(true);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player).setZoom(2.2);
    this.joystick = new VirtualJoystick(this);
    this.player.setJoystick(this.joystick);
    this.currentNPC = null;
    this.interactables = this.add.group();
    this.currentInteractable = null;
    this.loadExtraMapLayers(this.mapKey, tileset);
    createGameAnimations(this);
    this.physics.add.collider(this.player, this.npcs);
    this.bgMusic = this.sound.add('bg_music', { loop: true, volume: 0.5 });
    this.bgMusic.play();
    this.scale.refresh();
  }
  getSpawnFromTileIndex(tileIndex) {
    const key = this.mapKey + '_spawn';
    if (!this.cache.tilemap.has(key)) return null;
    const tempMap = this.make.tilemap({ key, tileWidth: 32, tileHeight: 32 });
    const layer = tempMap.createLayer(0, tempMap.addTilesetImage('tiles'), 0, 0).setVisible(false);
    const tile = layer.findTile(t => t.index === tileIndex);
    return tile ? { x: tile.pixelX + 16, y: tile.pixelY + 32 } : null;
  }
  loadExtraMapLayers(baseKey, tileset) {
    ['_npcs', '_memories', '_portals', '_objects', '_quests'].forEach(suffix => {
      const key = baseKey + suffix;
      if (this.cache.tilemap.has(key)) {
        const tempMap = this.make.tilemap({ key, tileWidth: 32, tileHeight: 32 });
        const layer = tempMap.createLayer(0, tileset).setVisible(false);
        this.scanTilesFromLayer(layer, suffix);
      }
    });
  }
  scanTilesFromLayer(layer, type) {
    const questManager = this.questManager;
    const { tileWidth: tw, tileHeight: th } = layer.tilemap;
    layer.forEachTile(tile => {
      const x = tile.pixelX + tw / 2;
      const y = tile.pixelY + th / 2;
      const posID = `${this.mapKey}_${tile.x}_${tile.y}`;
      if (type === '_npcs') {
        const npcData = {
          100: ['normal', 'npc1', ['My mama said people who smile with sad eyes are the bravest.', 'When I feel scared, I talk to the moon. Maybe it listens to you too?'], null, 64],
          101: ['quest', 'npc3', [`That flower's been wilting for years… no matter the sun or rain. Some things need more than time.`, `There's a sachet in my home, Bloomroot.`, `I kept it hoping someone would come along… someone with gentle hands.`], [`That flower and I… we're both stubborn in our sadness.`, `But I see now, healing doesn't always come in big ways.`, `Sometimes it comes… quietly. Like you.`], 0],
          102: ['quest', 'npc6', ['That tree looks really tired… like it forgot how to grow.', 'My grandpa said trees listen better when you bring them water with care.', `There's an old can by the lake…`], ['If a tree can wake up again after all that… maybe people can, too. You think so?'], 0],
          103: ['normal', 'npc2', [`They say there's a whale in this lake. Not like any other, not one you see with your eyes, at least…`, `The whale's been silent for years. But when you came… the water moved.`, `I think it was waiting for someone who understands stillness.`], null, 32],
          104: ['quest', 'npc7', [`He's been curled up all day. Used to squeak nonstop.`, 'I think he misses something warm… something real.', `There's still a carrot in my pack, I think.`], [`You always thought your softness was weakness… but that's what saved him.`, `That's what keeps saving me.`], 0],
          105: ['normal', 'npc4', [`I wasn't always there… but I've always believed in you. You've always been enough.`, `You were always so strong, even when no one saw it. I wish I told you more often how proud I was.`], null, 64],
          106: ['normal', 'npc5', [`When you're quiet, I can still feel you. You're not invisible to me.`, `I told you no botox a few times. You rolled your eyes.`, `Then your dad says the same thing, and suddenly it's life wisdom? :P`], null, 64],
        }[tile.index];
        if (npcData) {
          const [npcType, sprite, dialogue, altDialogue, patrolSize = 32] = npcData;
          const npc = new NPC(this, x, y, npcType, sprite, patrolSize);
          npc.dialogue = dialogue;
          if (altDialogue) npc.altDialogue = altDialogue;
          if (tile.index === 101) npc.questKey = 'flower';
          if (tile.index === 102) npc.questKey = 'tree';
          if (tile.index === 104) npc.questKey = 'hamster';
          this.npcs.add(npc);
          npc.on('interaction-complete', () => {
            if (npc.questKey && !questManager.isActive() && !questManager.isCompleted(npc.questKey)) {
              if (npc.questKey === 'flower') questManager.startQuest('flower', ['flower01', 'flower02']);
              if (npc.questKey === 'tree') questManager.startQuest('tree', ['tree01', 'tree02']);
              if (npc.questKey === 'hamster') questManager.startQuest('hamster', ['hamster01', 'hamster02']);
            }
          });
        }
      }
      if (type === '_memories') {
        const memoryMap = {
          300: { key: 'forest01', text: `You walk through shadows, and still find wildflowers. That's who you are.` },
          301: { key: 'forest02', text: `You're not alone here. Even the trees remember how to grow again.` },
          302: { key: 'forest03', text: 'They called her fragile, but they never saw how she kept climbing anyway.' },
        };
        const memory = memoryMap[tile.index];
        if (memory) createMemory(this, x, y, memory.key, memory.text);
      }
      if (type === '_quests') {
        const questMap = {
          200: { stepId: 'flower01', type: 'step' },
          201: { stepId: 'flower02', type: 'interact' },
          202: { stepId: 'tree01',   type: 'step' },
          203: { stepId: 'tree02',   type: 'interact' },
          204: { stepId: 'hamster01',   type: 'step' },
          205: { stepId: 'hamster02',   type: 'step' }
        };
        const questInfo = questMap[tile.index];
        const { stepId, type: questType } = questInfo || {};
        const alreadyDone = stepId === 'flower02' ? this.bloomedFlowers.includes(posID)
                          : stepId === 'tree02' ? this.healedTrees.includes(posID)
                          : false;
        if (alreadyDone) {
          if (stepId === 'flower02') playBloomAnimation(this, x, y);
          if (stepId === 'tree02') playTreeHealingAnimation(this, x, y);
        } else if (stepId && !questManager.isStepCompleted(stepId)) {
          const callback = () => {
            if (stepId === 'flower01') {
              this.registry.events.emit('start-dialogue', [`You found it…`, `I thought maybe it had lost its strength. But maybe it just needed someone like you.`]);
            } else if (stepId === 'flower02') {
              playBloomAnimation(this, x, y);
              this.bloomedFlowers.push(posID);
              this.registry.events.emit('start-dialogue', [`It bloomed? Then maybe… maybe we were both waiting for you.`]);
              addMemory(this, 'flowerMemory');
            } else if (stepId === 'tree01') {
              this.registry.events.emit('start-dialogue', [`You really got it!`, `Maybe the tree will hear you better than it ever heard us.`]);
            } else if (stepId === 'tree02') {
              playTreeHealingAnimation(this, x, y);
              this.healedTrees.push(posID);
              this.registry.events.emit('start-dialogue', ['Woah… it stood up taller!',`I think… it believed in you. Trees don't do that for just anyone.`]);
              addMemory(this, 'treeMemory');
            } else if (stepId === 'hamster01') {
              this.registry.events.emit('start-dialogue', [`Funny how you're the one helping.`, `You always said you weren't strong… but look at you now.`]);
            } else if (stepId === 'hamster02') {
              this.registry.events.emit('start-dialogue', [`He's bouncing again! You gave him back his little world.`, `I hope you see what that means.`]);
              addMemory(this, 'hamsterMemory');
            }
          };
          const questSprites = {
            flower01: { texture: 'seed', frame: 0 },
            flower02: { texture: 'flower6', frame: 0 },
            tree01:   { texture: 'water-can', frame: 0 },
            tree02:   { texture: 'tree1', frame: 0 },
            hamster01: { texture: 'carrot', frame: 0 },
            hamster02: { texture: 'carrot', frame: 0 }
          };
          const { texture, frame } = questSprites[stepId];
          const qp = new QuestPoint(this, x, y, stepId, callback, texture, frame);
          qp.questType = questType;
          this.questPoints.add(qp);
          if (questType === 'step') {
            this.physics.add.overlap(this.player, qp, () => qp.trigger());
          } else if (questType === 'interact') {
            this.interactables.add(qp);
          }
        }
      }
      if (type === '_portals') {
        const portalTargets = {
          1001: ['buildingMap', 1010],
          1011: ['forestMap', 1002],
        };
        const targetData = portalTargets[tile.index];
        if (targetData) {
          const [target, spawnIndex] = targetData;
          this.portals.push({ x, y, target, spawnIndex });
        }
      }
      if (type === '_objects') {
        const decorMap = {
          400: ['shouse1', 0, 'sixtyFour'],
          401: ['shouse2', 0, 'sixtyFour'],
          402: ['shouse3', 0, 'sixtyFour'],
          403: ['lhouse1', 0, 'wideBuilding'],
          404: ['lhouse2', 0, 'wideBuilding'],
          405: ['lhouse3', 0, 'wideBuilding'],
          500: ['tree1', 0, 'thirtyTwo'],
          501: ['tree1', 1, 'thirtyTwo'],
          502: ['tree1', 2, 'thirtyTwo'],
          503: ['tree2', 0, 'thirtyTwo'],
          504: ['tree2', 1, 'thirtyTwo'],
          505: ['tree2', 2, 'thirtyTwo'],
          506: ['fence1', 0, 'thirtyTwo3'],
          507: ['fence1', 1, 'thirtyTwo3'],
          508: ['rock1', 0, 'thirtyTwo2'],
          509: ['rock1', 1, 'thirtyTwo2'],
          510: ['rock1', 2, 'thirtyTwo2'],
          511: ['flower1', 0, 'custom'],
          512: ['flower1', 1, 'custom'],
          513: ['flower1', 2, 'custom'],
          514: ['flower2', 2, 'custom'],
          515: ['flower3', 2, 'custom'],
          516: ['flower4', 2, 'custom'],
          517: ['flower5', 2, 'custom'],
          518: ['flower6', 2, 'custom'],
          519: ['blank', 0, 'fullThirtyTwo'],
        };
        const decor = decorMap[tile.index];
        if (decor) decorCollider(this, x, y, ...decor);
        const interactableMap = {
          1100: ['flower1', 0, 'bloom', 'reset'],
          1200: ['tree1', 0, 'healed', 'permanent', 2],
          1300: ['flower5', 0, 'bloom', 'toggle', 2, 'unbloom', 2, 0],
          1400: ['flower6', 0, 'bloom', 'retrigger', 2, 'unbloom', 2, 0],
        };
        const interactableData = interactableMap[tile.index];
        if (interactableData) {
          const obj = new InteractableObject(this, x, y, ...interactableData);
          this.interactables.add(obj);
        }
        const triggerMap = [
        { trigger: 1500, target: 1600, key: 'whale', frame: 0, anim: 'splash', reset: 'reset', varName: 'whaleTarget' },
        { trigger: 1501, target: 1601, key: 'tree1', frame: 0, anim: 'healed', reset: 'permanent', varName: 'treeTarget' },
        ];
        triggerMap.forEach(config => {
          if (tile.index === config.target) {
            const obj = new InteractableObject(this, x, y, config.key, config.frame, config.anim, config.reset);
            this.interactables.add(obj);
            this[config.varName] = obj;
          }
          if (tile.index === config.trigger) {
            const button = this.add.zone(x, y, 32, 32).setOrigin(0.5, 1);
            this.physics.world.enable(button);
            button.mode = 'button';
            button.trigger = () => this[config.varName]?.trigger();
            this.interactables.add(button);
          }
        });
      }
    });
  }
  update() {
    this.player.update();
    this.currentNPC = null;
    this.npcs.children.iterate(npc => {
      if (Phaser.Math.Distance.Between(this.player.x, this.player.y, npc.x, npc.y) < 20) {
        this.currentNPC = npc;
      }
    });
    this.currentInteractable = null;
    this.interactables.children.iterate(obj => {
      const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, obj.x, obj.y);
      const isPermanentAndDone = obj.mode === 'permanent' && obj.state === 1;
      const questManager = this.registry.get('questManager');
      const isAllowedStep = !obj.stepId || (questManager && questManager.getCurrentStepId() === obj.stepId);
      if (!obj.triggered && !isPermanentAndDone && distance < 20 && isAllowedStep) {
        this.currentInteractable = obj;
      }
    });
    this.currentPortal = this.portals.find(portal => Phaser.Math.Distance.Between(this.player.x, this.player.y, portal.x, portal.y) < 20) || null;
    const showInteract = this.currentNPC || this.currentInteractable || this.currentPortal;
    this.registry.events.emit(showInteract ? 'show-interact' : 'hide-interact');
  }
  interactWithNPC() {
    if (this.currentNPC) {
      this.currentNPC.facePlayer(this.player);
      const questKey = this.currentNPC.questKey;
      const completed = questKey && this.questManager.isCompleted(questKey);
      const useAlt = this.currentNPC.type === 'quest' && completed && this.currentNPC.altDialogue;
      const lines = useAlt ? this.currentNPC.altDialogue : this.currentNPC.dialogue;
      if (lines?.length) {
        this.registry.events.emit('start-dialogue', lines);
        this.currentNPC.emit('interaction-complete');
      }
    }
    if (this.currentInteractable && !this.currentInteractable.triggered) {
      this.currentInteractable.trigger();
    }
    if (this.currentPortal) {
      this.changeToMap(this.currentPortal.target, this.currentPortal.spawnIndex);
    }
  }
  changeToMap(mapKey, spawnTileIndex = 50) {
    this.registry.set('bloomedFlowers', this.bloomedFlowers);
    this.registry.set('healedTrees', this.healedTrees);
    this.registry.set('retriggerableInteractables', this.registry.get('retriggerableInteractables') || []);
    this.registry.set('permanentInteractables', this.registry.get('permanentInteractables') || []);
    this.scene.start('GameScene', { mapKey, spawnTileIndex });
  }
}
