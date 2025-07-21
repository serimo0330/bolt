export interface TrainingStep {
  id: number;
  title: string;
  description: string;
  tool: 'edr' | 'siem' | 'tip' | 'soar' | 'physical' | 'communication';
  action: 'click' | 'input' | 'select' | 'confirm' | 'query' | 'analyze';
  expectedResult: string;
  feedback: {
    success: string;
    failure: string;
  };
  data?: any;
  nextStep?: number;
}

export interface StepResult {
  stepId: number;
  status: 'success' | 'failure' | 'partial';
  data: any;
  timestamp: string;
  score: number;
}

export interface ScenarioTraining {
  scenarioId: number;
  steps: TrainingStep[];
  completionCriteria: {
    timeLimit: number;
    requiredSteps: number[];
    optionalSteps: number[];
  };
}

export interface TrainingResult {
  scenarioId: number;
  totalTime: number;
  completedSteps: number;
  accuracy: number;
  collectedEvidence: {
    who: string;
    what: string;
    when: string;
    where: string;
    how: string;
    howMuch: string;
  };
  badge: 'leader' | 'competent' | 'trainee';
}

export interface ChatMessage {
  id: number;
  sender: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
}