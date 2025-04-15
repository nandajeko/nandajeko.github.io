export default class QuestManager {
  constructor(scene) {
    this.scene = scene;
    this.activeQuest = null;
    this.stepIndex = 0;
    this.completedQuests = new Set(scene.registry.get('completedQuests') || []);
    const savedQuest = scene.registry.get('activeQuest');
    const savedIndex = scene.registry.get('activeQuestStep');
    if (savedQuest && Array.isArray(savedQuest.steps)) {
      this.activeQuest = savedQuest;
      this.stepIndex = savedIndex || 0;
    }
  }
  startQuest(id, steps) {
    if (this.completedQuests.has(id)) {
      console.log(`Quest ${id} already completed.`);
      return;
    }
    this.activeQuest = { id, steps };
    this.stepIndex = 0;
    this.scene.registry.set('activeQuest', this.activeQuest);
    this.scene.registry.set('activeQuestStep', this.stepIndex);
    console.log(`Started quest ${id}`);
  }
  getCurrentStepId() {
    if (!this.activeQuest) return null;
    return this.activeQuest.steps[this.stepIndex];
  }
  advanceStep() {
    if (!this.activeQuest) return;
    const completedSteps = this.scene.registry.get('completedQuestSteps') || [];
    const currentStep = this.getCurrentStepId();
    if (!completedSteps.includes(currentStep)) {
      completedSteps.push(currentStep);
      this.scene.registry.set('completedQuestSteps', completedSteps);
    }
    this.stepIndex++;
    this.scene.registry.set('activeQuestStep', this.stepIndex);
    if (this.stepIndex >= this.activeQuest.steps.length) {
      this.finishQuest();
    } else {
      this.scene.registry.set('activeQuestStep', this.stepIndex);
    }
  }
  finishQuest() {
    console.log(`Quest ${this.activeQuest.id} completed!`);
    let completed = this.scene.registry.get('completedQuests') || [];
    if (!this.completedQuests.has(this.activeQuest.id)) {
      this.completedQuests.add(this.activeQuest.id);
      const completed = this.scene.registry.get('completedQuests') || [];
      if (!completed.includes(this.activeQuest.id)) {
        completed.push(this.activeQuest.id);
        this.scene.registry.set('completedQuests', completed);
      }
    }
    this.activeQuest = null;
    this.stepIndex = 0;
    this.scene.registry.remove('activeQuest');
    this.scene.registry.remove('activeQuestStep');
  }
  isActive() {
    return this.activeQuest !== null;
  }
  isStepCompleted(stepId) {
    const steps = this.scene.registry.get('completedQuestSteps') || [];
    return steps.includes(stepId);
  }
  isCompleted(id) {
    const completed = this.scene.registry.get('completedQuests') || [];
    return completed.includes(id);
  }
}
