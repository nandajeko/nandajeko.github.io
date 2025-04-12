export default class UIScene extends Phaser.Scene {
  constructor() {
    super('UIScene');
  }
  create() {
    this.interactBtn = this.add.image(this.scale.width / 2, this.scale.height - 60, 'btn-interact')
      .setOrigin(0.5).setDepth(100).setScrollFactor(0).setInteractive().setVisible(false);
    this.dialogueBg = this.add.image(this.scale.width / 2, this.scale.height - 120, 'dialogue-box')
      .setOrigin(0.5).setDepth(101).setScrollFactor(0).setVisible(false);
    this.dialogueText = this.add.text(this.dialogueBg.x, this.dialogueBg.y, '', {
      fontSize: '16px',
      wordWrap: { width: 220 },
      color: '#000000'
    }).setOrigin(0.5).setDepth(102).setScrollFactor(0).setVisible(false);
    this.dialogueIndex = 0;
    this.dialogueLines = [];
    this.canAdvance = false;
    this.registry.events.on('show-interact', () => {
      if (!this.dialogueBg.visible) this.interactBtn.setVisible(true);
    });
    this.registry.events.on('hide-interact', () => {
      this.interactBtn.setVisible(false);
    });
    this.registry.events.on('start-dialogue', (lines) => {
      this.dialogueLines = lines;
      this.dialogueIndex = 0;
      this.canAdvance = false;
      this.interactBtn.setVisible(false);
      this.showDialogueLine();
      this.time.delayedCall(100, () => this.canAdvance = true);
    });
    this.input.on('pointerdown', () => {
      if (this.dialogueBg.visible && this.canAdvance) {
        this.dialogueIndex++;
        if (this.dialogueIndex < this.dialogueLines.length) {
          this.showDialogueLine();
        } else {
          this.hideDialogue();
        }
      }
    });
    this.interactBtn.on('pointerdown', () => {
      this.scene.get('GameScene').interactWithNPC();
    });
    this.allMemories = [
      { id: 'forest01', text: 'Today, I walked further than I ever thought I could.' },
      { id: 'flowerMemory', text: `The forest whispered secrets I had forgotten, how strong I truly am. The trees didn't ask me to smile. They just stood beside me. I think strength is like that: quiet, steady, rooted deep beneath pain.` },
      { id: 'forest02', text: `At the lake, I saw my reflection, but it didn't look like someone broken.` },
      { id: 'treeMemory', text: `It looked like someone becoming. The ripples carried away the lies I've told myself, that I'm too much, too weak, too alone. I placed a piece of my heart there, hoping it will return healed.` },
      { id: 'forest03', text: `Up in the mountains, I found silence that didn't scare me. Just sky and breath and the soft echo of my own voice saying, "I'm still here."` },
      { id: 'flowerMemory', text: 'Even though my heart hurts,' },
      { id: 'treeMemory', text: 'Even though he left me waiting for years,' },
      { id: 'hamsterMemory', text: `Even though I've forgotten how to ask for help, I am still becoming.` },
      { id: 'hamsterMemory', text: `And maybe that's what healing is, not erasing the pain, but growing around it like vines reaching toward the sun.` },
      { id: 'flowerMemory', text: 'Tomorrow, I walk again.' },
      { id: 'treeMemory', text: 'Not to run from anything,' },
      { id: 'hamsterMemory', text: 'But to walk home to myself.' }
    ];
    this.puzzleMemoryIDs = ['forest01', 'flowerMemory', 'treeMemory', 'hamsterMemory'];
    this.puzzleNoteTexts = {
      forest01: 'A faded photo is taped here.',
      flowerMemory: `A little girl, hair messy, cheeks sun-warmed, eyes wide with wonder. She's holding a small stuffed bear like it's a treasure.`,
      treeMemory: `She didn't know life would get this hard. But she also didn't know she'd survive it.`,
      hamsterMemory: 'You are her. And she is still inside you. Waiting to be held again.'
    };
    this.journal = [];
    this.registry.events.on('new-memory', (entry) => {
      if (!this.journal.includes(entry.id)) {
        this.journal.push(entry.id);
        const puzzleIndex = this.puzzleMemoryIDs.indexOf(entry.id);
        if (this.journalPage === 1 && puzzleIndex !== -1) {
          const piece = this.puzzlePieces[puzzleIndex];
          if (piece) {
            this.tweens.add({
              targets: piece,
              alpha: { from: 0, to: 1 },
              scale: { from: 1.5, to: 1 },
              duration: 400,
              ease: 'Bounce'
            });
          }
        }
      }
    });
    this.journalBtn = this.add.image(50, 50, 'btn-journal')
      .setInteractive().setDepth(100).setScrollFactor(0);
    this.journalPanel = this.add.image(this.scale.width / 2, this.scale.height / 2, 'journal-panel')
      .setOrigin(0.5).setVisible(false).setDepth(200).setScrollFactor(0);
    this.journalText = this.add.text(this.journalPanel.x - 105, this.journalPanel.y - 210, '', {
      fontSize: '14px',
      wordWrap: { width: 225 },
      color: '#000000'
    }).setDepth(201).setScrollFactor(0).setVisible(false);
    this.puzzleNoteText = this.add.text(this.journalPanel.x + 5, this.journalPanel.y + 70,
      'The pieces… they feel like parts of me.',
      {
        fontSize: '14px',
        color: '#000000',
        wordWrap: { width: 225 },
        align: 'center'
      }
    ).setOrigin(0.5).setDepth(201).setScrollFactor(0).setVisible(false);
    this.journalPage = 0;
    this.pageText = this.add.text(this.journalPanel.x, this.journalPanel.y + 205, 'Page 1', {
      fontSize: '12px',
      color: '#000000'
    }).setOrigin(0.5).setDepth(202).setVisible(false).setScrollFactor(0);
    this.nextBtn = this.add.text(this.journalPanel.x + 80, this.journalPanel.y + 200, 'Next', {
      fontSize: '12px',
      color: '#0000ff'
    }).setInteractive().setDepth(202).setVisible(false).setScrollFactor(0);
    this.prevBtn = this.add.text(this.journalPanel.x - 110, this.journalPanel.y + 200, 'Prev', {
      fontSize: '12px',
      color: '#0000ff'
    }).setInteractive().setDepth(202).setVisible(false).setScrollFactor(0);
    this.nextBtn.on('pointerdown', () => {
      this.journalPage = (this.journalPage + 1) % 3;
      this.showJournalPage(this.journalPage);
    });
    this.prevBtn.on('pointerdown', () => {
      this.journalPage = (this.journalPage + 2) % 3;
      this.showJournalPage(this.journalPage);
    });
    this.puzzlePieces = [];
    const pieceWidth = 100;
    const pieceHeight = 70;
    for (let i = 0; i < 4; i++) {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const px = this.journalPanel.x - pieceWidth / 2 + col * pieceWidth;
      const py = this.journalPanel.y - pieceHeight - 100 + row * pieceHeight;
      const piece = this.add.image(px, py, 'memory-puzzle', i)
      .setDepth(201).setVisible(false).setAlpha(1).setScrollFactor(0);
      this.puzzlePieces.push(piece);
    }
    this.journalBtn.on('pointerdown', () => {
      const visible = this.journalPanel.visible;
      this.journalPanel.setVisible(!visible);
      this.journalText.setVisible(!visible);
      this.puzzleNoteText.setVisible(false);
      this.pageText.setVisible(!visible);
      this.nextBtn.setVisible(!visible);
      this.prevBtn.setVisible(!visible);
      this.puzzlePieces.forEach(p => p.setVisible(false));
      if (!visible) {
        this.showJournalPage(this.journalPage);
      }
    });
  }
  showJournalPage(page) {
    const unlocked = this.journal;
    this.journalText.setVisible(false);
    this.puzzleNoteText.setVisible(false);
    this.puzzlePieces.forEach(p => p.setVisible(false));
    if (page === 0 || page === 1) {
      const memSlice = page === 0
      ? this.allMemories.slice(0, 5)
      : this.allMemories.slice(5, 12);
      const paragraph = memSlice.map(mem => {
        return unlocked.includes(mem.id) ? mem.text : '[...]';
      }).join(' ');
      this.journalText.setText(paragraph || 'No memories yet.');
      this.journalText.setVisible(true);
    } else if (page === 2) {
      let noteLines = [];
      this.puzzlePieces.forEach((piece, i) => {
        const memID = this.puzzleMemoryIDs[i];
        const hasPiece = unlocked.includes(memID);
        piece.setVisible(hasPiece);
        if (hasPiece && this.puzzleNoteTexts[memID]) {
          noteLines.push(this.puzzleNoteTexts[memID]);
        }
      });
      const fullNote = noteLines.length > 0 ? noteLines.join('\n\n') : 'No puzzle pieces yet.';
      this.puzzleNoteText.setText(fullNote);
      this.puzzleNoteText.setVisible(true);
    }
    this.pageText.setText(`Page ${page + 1}`);
  }
  showDialogueLine() {
    this.dialogueBg.setVisible(true);
    this.dialogueText.setVisible(true);
    this.dialogueText.setText(this.dialogueLines[this.dialogueIndex]);
  }
  hideDialogue() {
    this.dialogueBg.setVisible(false);
    this.dialogueText.setVisible(false);
    this.dialogueIndex = 0;
    this.dialogueLines = [];
  }
}