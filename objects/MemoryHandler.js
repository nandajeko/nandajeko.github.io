import MemoryPoint from './MemoryPoint.js';
export function createMemory(scene, x, y, key, text) {
  if (!scene.collectedMemories.includes(key)) {
    const mp = new MemoryPoint(scene, x, y, key, text);
    scene.memoryPoints.add(mp);
    scene.physics.add.overlap(scene.player, mp, () => mp.trigger());
  }
}
export function addMemory(scene, id) {
  if (!scene.collectedMemories.includes(id)) {
    scene.collectedMemories.push(id);
    scene.registry.set('collectedMemories', scene.collectedMemories);
    scene.registry.events.emit('new-memory', { id });
  }
}