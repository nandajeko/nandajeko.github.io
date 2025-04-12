export function decorCollider(scene, x, y, spriteKey, frame = 0, colliderType = 'thirtyTwo', depth = 2) {
  const sprite = scene.add.sprite(x, y, spriteKey, frame).setOrigin(0.5, 1).setDepth(depth);
  scene.decorations.add(sprite);
  let zones = [];
  switch (colliderType) {
    case 'thirtyTwo':
      zones = [[0, -8, 16, 12]];
      break;
    case 'thirtyTwo2':
      zones = [[0, -8, 16, 16]];
      break;
    case 'thirtyTwo3':
      zones = [[0, -8, 32, 16]];
      break;
    case 'fullThirtyTwo':
      zones = [[0, -16, 32, 32]];
      break;
    case 'sixtyFour':
      zones = [[0, -16, 64, 32]];
      break;
    case 'wideBuilding':
      zones = [[0, -16, 128, 32]];
      break;
    case 'custom':
      zones = [];
      break;
    default:
      zones = [[0, -16, 32, 16]];
  }
  zones.forEach(([ox, oy, w, h]) => {
    const zone = scene.add.zone(x + ox, y + oy, w, h);
    scene.physics.world.enable(zone);
    zone.body.setImmovable(true).setAllowGravity(false);
    scene.physics.add.collider(scene.player, zone);
  });
}
