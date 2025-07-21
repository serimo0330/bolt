import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TrainingStep, StepResult, ChatMessage } from '../types/training';
import { scenarioTrainingData } from '../data/trainingSteps';
import { 
  Home, 
  ArrowLeft, 
  Clock, 
  AlertTriangle, 
  Target,
  Shield,
  Brain,
  Play,
  CheckCircle,
  XCircle,
  Database,
  Eye,
  Zap,
  MessageSquare,
  Users,
  Bell,
  Activity,
  Search,
  FileText,
  Settings
} from 'lucide-react';
import { Timer } from './Timer';
import { traditionalScenarios } from '../data/traditionalScenarios';
import { nextGenScenarios } from '../data/nextGenScenarios';

interface Scenario {
  id: number;
  title: string;
  priority: string;
  role: string;
  situation: string;
  flow: string;
  result: string;
}

const ScenarioTraining = () => {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  const navigate = useNavigate();
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [trainingSteps, setTrainingSteps] = useState<TrainingStep[]>([]);
  const [courseType, setCourseType] = useState<'traditional' | 'nextgen' | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [stepResults, setStepResults] = useState<{[key: number]: StepResult}>({});
  const [currentStepCompleted, setCurrentStepCompleted] = useState(false);
  const [alertAcknowledged, setAlertAcknowledged] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isAlertSounding, setIsAlertSounding] = useState(false);
  const [score, setScore] = useState(0);
  const [stepStartTime, setStepStartTime] = useState<Date | null>(null);
  const [selectedTool, setSelectedTool] = useState<'siem' | 'edr' | 'soar' | 'tip' | null>(null);
  const [currentStepData, setCurrentStepData] = useState<any>(null);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [isStepCompleted, setIsStepCompleted] = useState(false);
  const [playbookExecuted, setPlaybookExecuted] = useState(false);

  useEffect(() => {
    if (scenarioId) {
      const id = parseInt(scenarioId);
      
      // A코스 시나리오 먼저 확인
      const traditionalScenario = traditionalScenarios.find(s => s.id === id);
      if (traditionalScenario) {
        setScenario(traditionalScenario);
        setCourseType('traditional');
        
        // 훈련 단계 데이터 로드
        const trainingData = scenarioTrainingData[id];
        if (trainingData) {
          setTrainingSteps(trainingData.steps);
        }
        return;
      }
      
      // B코스 시나리오 확인
      const nextGenScenario = nextGenScenarios.find(s => s.id === id);
      if (nextGenScenario) {
        setScenario(nextGenScenario);
        setCourseType('nextgen');
        return;
      }
      
      // 시나리오를 찾지 못한 경우
      console.error(`시나리오 ID ${id}를 찾을 수 없습니다.`);
      navigate('/courses');
    }
  }, [scenarioId, navigate]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P1': 
      case '긴급': 
        return 'text-red-400 bg-red-900/30 border-red-500';
      case 'P2': 
      case '높음': 
        return 'text-orange-400 bg-orange-900/30 border-orange-500';
      case 'P3': 
      case '중간': 
        return 'text-yellow-400 bg-yellow-900/30 border-yellow-500';
      default: 
        return 'text-gray-400 bg-gray-900/30 border-gray-500';
    }
  };

  const handleStartTraining = () => {
    setIsStarted(true);
    setStepStartTime(new Date());
    // P1 등급 경보인 경우 사이렌 효과 시작
    if (scenario?.priority === 'P1') {
      setIsAlertSounding(true);
    }
    // 초기 경보 메시지 추가
    addChatMessage('시스템', `${scenario?.priority} 등급 경보 발생! 즉시 대응 필요`);
  };

  const addChatMessage = (sender: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const newMessage = {
      id: Date.now(),
      sender,
      message,
      timestamp: new Date().toLocaleTimeString(),
      type
    };
    setChatMessages(prev => [...prev, newMessage]);
  };

  // 단계 완료 처리
  const completeCurrentStep = (success: boolean = true, data?: any) => {
    const step = trainingSteps[currentStep];
    if (!step) return;

    const stepEndTime = new Date();
    const stepDuration = stepStartTime ? stepEndTime.getTime() - stepStartTime.getTime() : 0;

    const result: StepResult = {
      stepId: step.id,
      status: success ? 'success' : 'failure',
      data: data || step.data,
      timestamp: stepEndTime.toISOString(),
      score: success ? 100 : 0
    };

    setStepResults(prev => ({ ...prev, [step.id]: result }));
    
    if (success) {
      setCompletedSteps(prev => [...prev, step.id]);
      setScore(prev => prev + 100);
      setCurrentStepCompleted(true);
      
      // 성공 메시지 표시
      addChatMessage('시스템', step.feedback.success, 'success');
      
      // 3초 후 다음 단계로 이동
      setTimeout(() => {
        if (currentStep < trainingSteps.length - 1) {
          setCurrentStep(prev => prev + 1);
          setCurrentStepCompleted(false);
          setStepStartTime(new Date());
          
          const nextStep = trainingSteps[currentStep + 1];
          if (nextStep) {
            addChatMessage('상황실장', `다음 단계: ${nextStep.title}`, 'info');
          }
        } else {
          // 모든 단계 완료
          setIsCompleted(true);
          addChatMessage('상황실장', '모든 단계 완료! 훌륭한 대응이었습니다.', 'success');
        }
      }, 3000);
    } else {
      // 실패 메시지 표시
      addChatMessage('시스템', step.feedback.failure, 'error');
    }
  };

  // 현재 단계 정보 가져오기
  const getCurrentStep = () => {
    return trainingSteps[currentStep] || null;
  };

  // 단계별 액션 처리
  const handleStepAction = (actionType: string, data?: any) => {
    const currentStepInfo = getCurrentStep();
    if (!currentStepInfo || currentStepCompleted) return;

    // 올바른 액션인지 확인
    if (currentStepInfo.action === actionType) {
      completeCurrentStep(true, data || currentStepInfo.data);
    } else {
      completeCurrentStep(false);
    }
  };

  const completeStep = (stepId: number, data?: any) => {
    const step = trainingSteps.find(s => s.id === stepId);
    if (!step) return;
    
    setCompletedSteps(prev => [...prev, stepId]);
    setIsStepCompleted(true);
    setCurrentStepData(data);
    
    // 성공 메시지 표시
    addChatMessage('시스템', step.feedback.success, 'success');
    
    // 진행도 업데이트
    const newProgress = ((stepId) / trainingSteps.length) * 100;
    setProgressPercentage(newProgress);
    
    // 다음 단계로 이동 (2초 후)
    setTimeout(() => {
      if (stepId < trainingSteps.length) {
        setCurrentStep(stepId);
        setIsStepCompleted(false);
        setCurrentStepData(null);
        
        const nextStep = trainingSteps.find(s => s.id === stepId + 1);
        if (nextStep) {
          addChatMessage('상황실장', `${nextStep.title} 단계를 진행하세요`, 'info');
        }
      } else {
        // 모든 단계 완료
        setIsCompleted(true);
        addChatMessage('상황실장', '모든 단계 완료! 훌륭한 대응이었습니다.', 'success');
      }
    }, 2000);
  };

  // 도구별 액션 처리
  const handleToolAction = (tool: string, action: string, data?: any) => {
    const currentStepInfo = trainingSteps[currentStep];
    if (!currentStepInfo) return;

    if (currentStepInfo.tool === tool && currentStepInfo.action === action) {
      setCurrentStepData(data || currentStepInfo.data);
      completeStep(currentStepInfo.id, data);
    } else {
      addChatMessage('시스템', currentStepInfo.feedback.failure, 'error');
    }
  };

  // 현재 단계 정보 가져오기
  const getCurrentStepInfo = () => {
    return trainingSteps[currentStep] || null;
  };

  const handleAlertAcknowledge = () => {
    setAlertAcknowledged(true);
    setIsAlertSounding(false);
    
    if (trainingSteps.length > 0) {
      handleToolAction('edr', 'click', trainingSteps[0].data);
    }
  };

  const handleToolSelect = (tool: 'siem' | 'edr' | 'soar' | 'tip') => {
    setSelectedTool(tool);
    const toolNames = {
      siem: 'SIEM',
      edr: 'EDR', 
      soar: 'SOAR',
      tip: 'TIP'
    };
    
    const currentStepInfo = getCurrentStepInfo();
    if (currentStepInfo && currentStepInfo.tool === tool) {
      addChatMessage('분석가', `${toolNames[tool]} 도구를 선택했습니다.`, 'info');
      
      // 도구별 자동 액션 실행
      if (tool === 'siem' && currentStepInfo.action === 'query') {
        setTimeout(() => {
          handleToolAction('siem', 'query', currentStepInfo.data);
        }, 1000);
      } else if (tool === 'tip' && currentStepInfo.action === 'input') {
        setTimeout(() => {
          handleToolAction('tip', 'input', currentStepInfo.data);
        }, 1000);
      }
    }
  };

  const handlePlaybookExecution = () => {
    const currentStepInfo = getCurrentStepInfo();
    if (currentStepInfo && currentStepInfo.tool === 'soar') {
      handleToolAction('soar', 'select', currentStepInfo.data);
      setPlaybookExecuted(true);
      
      // 팀 협업 메시지들
      setTimeout(() => {
        addChatMessage('네트워크팀', '격리 조치 완료했습니다.', 'success');
      }, 1000);
      
      setTimeout(() => {
        addChatMessage('보안팀장', '플레이북 실행 확인됨. 다음 단계를 진행하세요.', 'info');
      }, 2000);
    }
  };

  // 물리적 액션 처리
  const handlePhysicalAction = (actionType: string) => {
    const currentStepInfo = getCurrentStepInfo();
    if (currentStepInfo && currentStepInfo.tool === 'physical') {
      handleToolAction('physical', 'confirm', { actionType, ...currentStepInfo.data });
    }
  };

  // 커뮤니케이션 액션 처리
  const handleCommunicationAction = (actionType: string) => {
    const currentStepInfo = getCurrentStepInfo();
    if (currentStepInfo && currentStepInfo.tool === 'communication') {
      handleToolAction('communication', 'confirm', { actionType, ...currentStepInfo.data });
    }
  };

  const handleCompleteTraining = () => {
    setIsCompleted(true);
  };

  const handleTimeUp = () => {
    setTimeUp(true);
    if (!isCompleted) {
      // 시간 초과 처리
      console.log('시간 초과!');
    }
  };

  const handleReturnToCourse = () => {
    if (courseType === 'traditional') {
      navigate('/course/traditional');
    } else if (courseType === 'nextgen') {
      navigate('/course/nextgen');
    } else {
      navigate('/courses');
    }
  };

  if (!scenario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-green-400 text-xl">시나리오 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative overflow-hidden">
      {/* 타이머 */}
      {isStarted && !isCompleted && !timeUp && (
        <Timer initialMinutes={10} onTimeUp={handleTimeUp} />
      )}

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* 네비게이션 */}
        <div className="mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg
                       hover:bg-gray-600 transition-all duration-300"
            >
              <Home className="w-4 h-4" />
              홈으로 가기
            </button>
            <button
              onClick={handleReturnToCourse}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-all duration-300 ${
                courseType === 'traditional' 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              {courseType === 'traditional' ? 'A코스로 돌아가기' : 'B코스로 돌아가기'}
            </button>
          </div>
        </div>

        {/* 시나리오 헤더 */}
        <div className="text-center mb-8">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
            courseType === 'traditional' ? 'bg-blue-600/30' : 'bg-green-600/30'
          }`}>
            {courseType === 'traditional' ? (
              <Shield className="w-10 h-10 text-blue-400" />
            ) : (
              <Brain className="w-10 h-10 text-green-400" />
            )}
          </div>
          <h1 className={`text-4xl font-bold mb-4 tracking-wider glow-text ${
            courseType === 'traditional' ? 'text-blue-400' : 'text-green-400'
          }`}>
            {courseType === 'traditional' ? 'A코스' : 'B코스'} - 시나리오 {scenario.id}
          </h1>
          <h2 className="text-2xl text-yellow-400 mb-4">{scenario.title}</h2>
          <div className="flex items-center justify-center gap-4">
            <span className={`px-4 py-2 rounded-lg border font-bold ${getPriorityColor(scenario.priority)}`}>
              {scenario.priority} 등급
            </span>
            <span className="text-cyan-400">역할: {scenario.role}</span>
          </div>
        </div>

        {!isStarted ? (
          /* 시나리오 브리핑 */
          <div className="max-w-4xl mx-auto">
            {/* 상황 정보 */}
            <div className="bg-black/50 backdrop-blur-sm border border-red-500/30 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <h3 className="text-2xl font-bold text-red-400">상황 정보</h3>
              </div>
              <p className="text-green-200 text-lg leading-relaxed">
                {scenario.situation}
              </p>
            </div>

            {/* 대응 흐름 */}
            <div className="bg-black/50 backdrop-blur-sm border border-blue-500/30 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-blue-400" />
                <h3 className="text-2xl font-bold text-blue-400">
                  {courseType === 'traditional' ? '대응 흐름' : 'AI 기반 대응 흐름'}
                </h3>
              </div>
              <p className="text-green-200 text-lg leading-relaxed">
                {scenario.flow}
              </p>
            </div>

            {/* 예상 결과 */}
            <div className="bg-black/50 backdrop-blur-sm border border-green-500/30 rounded-lg p-6 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <h3 className="text-2xl font-bold text-green-400">예상 대응 결과</h3>
              </div>
              <p className="text-green-200 text-lg leading-relaxed">
                {scenario.result}
              </p>
            </div>

            {/* 시작 버튼 */}
            <div className="text-center">
              <button
                onClick={handleStartTraining}
                className={`px-12 py-6 rounded-lg text-white font-bold text-2xl
                         transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 mx-auto ${
                  courseType === 'traditional'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 border-2 border-blue-400 hover:from-blue-500 hover:to-blue-600'
                    : 'bg-gradient-to-r from-green-600 to-green-700 border-2 border-green-400 hover:from-green-500 hover:to-green-600'
                }`}
              >
                <Play className="w-8 h-8" />
                10분 모의훈련 시작
              </button>
              <p className="text-yellow-300 text-lg mt-4">
                ⚠️ 시작하면 10분 타이머가 작동합니다
              </p>
            </div>
          </div>
        ) : isCompleted ? (
          /* 완료 화면 */
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-8">🎯</div>
            <h2 className="text-4xl font-bold text-green-400 mb-6">훈련 완료!</h2>
            <div className="bg-black/50 backdrop-blur-sm border border-green-500/30 rounded-lg p-8 mb-8">
              <p className="text-green-200 text-xl mb-4">
                시나리오 {scenario.id}: {scenario.title} 훈련을 성공적으로 완료했습니다!
              </p>
              <p className="text-yellow-300 text-lg">
                '대응 리더' 배지 획득 조건을 충족했습니다.
              </p>
            </div>
            <button
              onClick={handleReturnToCourse}
              className={`px-8 py-4 rounded-lg text-white font-bold text-xl
                       transition-all duration-300 ${
                courseType === 'traditional'
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {courseType === 'traditional' ? 'A코스로 돌아가기' : 'B코스로 돌아가기'}
            </button>
          </div>
        ) : timeUp ? (
          /* 시간 초과 화면 */
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-6xl mb-8">⏰</div>
            <h2 className="text-4xl font-bold text-red-400 mb-6">시간 초과!</h2>
            <div className="bg-black/50 backdrop-blur-sm border border-red-500/30 rounded-lg p-8 mb-8">
              <p className="text-red-200 text-xl mb-4">
                10분 골든타임이 초과되었습니다.
              </p>
              <p className="text-yellow-300 text-lg">
                다시 도전하여 '대응 리더' 배지 획득에 도전해보세요!
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setIsStarted(false);
                  setTimeUp(false);
                }}
                className="px-8 py-4 bg-yellow-600 text-white rounded-lg font-bold text-xl
                         hover:bg-yellow-700 transition-all duration-300"
              >
                다시 도전
              </button>
              <button
                onClick={handleReturnToCourse}
                className={`px-8 py-4 rounded-lg text-white font-bold text-xl
                         transition-all duration-300 ${
                  courseType === 'traditional'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {courseType === 'traditional' ? 'A코스로 돌아가기' : 'B코스로 돌아가기'}
              </button>
            </div>
          </div>
        ) : (
          /* 훈련 진행 화면 */
          <div className="w-full h-screen flex">
            {/* 사이렌 효과 */}
            {isAlertSounding && (
              <div className="fixed inset-0 bg-red-500/20 animate-pulse z-40 pointer-events-none">
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg font-bold text-xl animate-bounce">
                  🚨 P1 긴급 경보 발생! 클릭하여 인지하세요 🚨
                </div>
              </div>
            )}

            {/* 왼쪽 패널: 실시간 경보 피드 */}
            <div className="w-1/4 bg-gray-900 border-r border-gray-700 p-4">
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-red-400" />
                <h3 className="text-lg font-bold text-red-400">실시간 경보 피드</h3>
              </div>
              
              {/* 진행도 표시 */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-green-400">진행도</span>
                  <span className="text-sm text-green-400">{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {completedSteps.length} / {trainingSteps.length} 단계 완료
                </div>
              </div>
              
              {/* 경보 목록 */}
              <div className="space-y-2">
                <div 
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
                    !alertAcknowledged 
                      ? 'border-red-500 bg-red-900/30 animate-pulse' 
                      : 'border-green-500 bg-green-900/30'
                  }`}
                  onClick={!alertAcknowledged ? handleAlertAcknowledge : undefined}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${getPriorityColor(scenario?.priority || '')}`}>
                      {scenario?.priority}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-sm text-white font-semibold mb-1">
                    {scenario?.title}
                  </div>
                  <div className="text-xs text-gray-300">
                    역할: {scenario?.role}
                  </div>
                  {alertAcknowledged && (
                    <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      인지 완료
                    </div>
                  )}
                </div>
              </div>

              {/* 현재 단계 및 완료된 단계들 표시 */}
              {alertAcknowledged && trainingSteps.length > 0 && (
                <div className="mt-6 p-3 bg-blue-900/30 border border-blue-500/30 rounded-lg">
                  <h4 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    현재 단계 ({currentStep + 1}/{trainingSteps.length})
                  </h4>
                  {trainingSteps[currentStep] && (
                    <div>
                      <p className="text-sm font-semibold text-yellow-300 mb-1">
                        {trainingSteps[currentStep].title}
                      </p>
                      <p className="text-xs text-green-200">
                        {trainingSteps[currentStep].description}
                      </p>
                    </div>
                  )}
                </div>
              )}
              
              {/* 완료된 단계들 */}
              {completedSteps.length > 0 && (
                <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                  <h4 className="text-green-400 font-bold mb-2 text-sm">완료된 단계</h4>
                  <div className="space-y-1">
                    {completedSteps.map(stepId => {
                      const step = trainingSteps.find(s => s.id === stepId);
                      return step ? (
                        <div key={stepId} className="flex items-center gap-2 text-xs">
                          <CheckCircle className="w-3 h-3 text-green-400" />
                          <span className="text-green-300">{step.title}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 중앙 패널: 상세 정보 창 (SIEM, EDR) */}
            <div className="w-1/2 bg-black p-4">
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={() => handleToolSelect('siem')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    selectedTool === 'siem' 
                      ? 'bg-cyan-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Database className="w-4 h-4" />
                  SIEM
                </button>
                <button
                  onClick={() => handleToolSelect('edr')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    selectedTool === 'edr' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  EDR
                </button>
                <button
                  onClick={() => handleToolSelect('tip')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    selectedTool === 'tip' 
                      ? 'bg-yellow-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Search className="w-4 h-4" />
                  TIP
                </button>
              </div>

              {/* 도구별 상세 화면 */}
              <div className="bg-gray-800 rounded-lg p-4 h-96 overflow-y-auto">
                {selectedTool === 'siem' && (
                  <div>
                    <h4 className="text-cyan-400 font-bold mb-3">SIEM 로그 분석</h4>
                    {currentStepData && currentStepData.query ? (
                      <div className="font-mono text-sm space-y-2">
                        <div className="text-green-300">$ {currentStepData.query}</div>
                        <div className="text-gray-300">검색 결과: 로그 분석 중...</div>
                        <div className="text-yellow-300">
                          결과: {currentStepData.result}
                        </div>
                        {currentStepData.sourceIP && (
                          <div className="text-red-300">
                            공격자 IP: {currentStepData.sourceIP}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center text-gray-400 mt-10">
                        <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>쿼리를 실행하세요</p>
                      </div>
                    )}
                  </div>
                )}
                
                {selectedTool === 'edr' && (
                  <div>
                    <h4 className="text-purple-400 font-bold mb-3">EDR 엔드포인트 분석</h4>
                    {currentStepData ? (
                      <div className="space-y-3">
                        {currentStepData.processName && (
                          <div className="bg-gray-700 p-3 rounded">
                            <div className="text-yellow-300 font-semibold">탐지된 프로세스</div>
                            <div className="text-sm text-red-300 mt-1">
                              {currentStepData.processName} ⚠️ 악성 프로세스
                            </div>
                          </div>
                        )}
                        {currentStepData.alertDetails && (
                          <div className="bg-gray-700 p-3 rounded">
                            <div className="text-yellow-300 font-semibold">경보 상세</div>
                            <div className="text-sm text-gray-300 mt-1">
                              {currentStepData.alertDetails}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              시간: {currentStepData.timestamp}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center text-gray-400 mt-10">
                        <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>엔드포인트 데이터를 분석하세요</p>
                      </div>
                    )}
                  </div>
                )}

                {selectedTool === 'tip' && (
                  <div>
                    <h4 className="text-yellow-400 font-bold mb-3">위협 인텔리전스 조회</h4>
                    {currentStepData && currentStepData.fileHash ? (
                      <div className="space-y-3">
                        <div className="bg-gray-700 p-3 rounded">
                          <div className="text-yellow-300 font-semibold">파일 해시 조회</div>
                          <div className="text-xs text-gray-300 mt-1 font-mono">
                            {currentStepData.fileHash}
                          </div>
                        </div>
                        <div className="bg-gray-700 p-3 rounded">
                          <div className="text-yellow-300 font-semibold">위협 정보</div>
                          <div className="text-sm text-red-300 mt-1">
                            {currentStepData.malwareFamily}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            위험도: {currentStepData.threatLevel} | 최초 발견: {currentStepData.firstSeen}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400 mt-10">
                        <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>해시값을 조회하세요</p>
                      </div>
                    )}
                  </div>
                )}

                {!selectedTool && alertAcknowledged && (
                  <div className="text-center text-gray-400 mt-20">
                    <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>분석 도구를 선택하세요</p>
                    {trainingSteps[currentStep] && (
                      <p className="text-sm mt-2 text-yellow-300">
                        권장 도구: {trainingSteps[currentStep].tool.toUpperCase()}
                      </p>
                    )}
                  </div>
                )}
              </div>
              
              {/* 물리적 액션 버튼들 */}
              {alertAcknowledged && trainingSteps[currentStep]?.tool === 'physical' && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-orange-400 font-bold text-sm">물리적 조치</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handlePhysicalAction('preserve_evidence')}
                      className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      증거 보존
                    </button>
                    <button
                      onClick={() => handlePhysicalAction('network_isolate')}
                      className="px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                    >
                      네트워크 격리
                    </button>
                    <button
                      onClick={() => handlePhysicalAction('memory_dump')}
                      className="px-3 py-2 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors"
                    >
                      메모리 덤프
                    </button>
                    <button
                      onClick={() => handlePhysicalAction('confirm_action')}
                      className="px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      조치 확인
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 오른쪽 패널: 대응 플레이북 및 채팅 */}
            <div className="w-1/4 bg-gray-900 border-l border-gray-700 p-4">
              {/* 플레이북 섹션 */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-5 h-5 text-orange-400" />
                  <h3 className="text-lg font-bold text-orange-400">대응 플레이북</h3>
                </div>
                
                {alertAcknowledged && trainingSteps[currentStep]?.tool === 'soar' && (
                  <div className="space-y-2">
                    <div className="bg-orange-900/30 border border-orange-500/30 rounded-lg p-3">
                      <div className="text-orange-300 font-semibold mb-2">
                        추천 플레이북
                      </div>
                      <div className="text-sm text-gray-300 mb-3">
                        {trainingSteps[currentStep]?.data?.playbookName || `${scenario?.title} 대응 플레이북`}
                      </div>
                      <button
                        onClick={handlePlaybookExecution}
                        disabled={isStepCompleted}
                        className={`w-full px-3 py-2 rounded text-sm font-bold transition-all duration-300 ${
                          isStepCompleted
                            ? 'bg-green-600 text-white cursor-not-allowed'
                            : 'bg-orange-600 text-white hover:bg-orange-700'
                        }`}
                      >
                        {isStepCompleted ? '✓ 실행 완료' : '플레이북 실행'}
                      </button>
                    </div>
                  </div>
                )}
                
                {/* 커뮤니케이션 액션 */}
                {alertAcknowledged && trainingSteps[currentStep]?.tool === 'communication' && (
                  <div className="space-y-2">
                    <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-3">
                      <div className="text-blue-300 font-semibold mb-2">
                        커뮤니케이션 액션
                      </div>
                      <div className="text-sm text-gray-300 mb-3">
                        {trainingSteps[currentStep]?.description}
                      </div>
                      <button
                        onClick={() => handleCommunicationAction('report')}
                        disabled={isStepCompleted}
                        className={`w-full px-3 py-2 rounded text-sm font-bold transition-all duration-300 ${
                          isStepCompleted
                            ? 'bg-green-600 text-white cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {isStepCompleted ? '✓ 완료' : '보고/협조 요청'}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 팀 채팅 섹션 */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-green-400" />
                  <h3 className="text-lg font-bold text-green-400">팀 채팅</h3>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-3 h-64 overflow-y-auto">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className="mb-3 last:mb-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-3 h-3 text-blue-400" />
                        <span className="text-xs font-semibold text-blue-400">
                          {msg.sender}
                        </span>
                        <span className="text-xs text-gray-500">
                          {msg.timestamp}
                        </span>
                        {msg.type === 'success' && <CheckCircle className="w-3 h-3 text-green-400" />}
                        {msg.type === 'error' && <XCircle className="w-3 h-3 text-red-400" />}
                      </div>
                      <div className={`text-sm ml-5 ${
                        msg.type === 'success' ? 'text-green-200' :
                        msg.type === 'error' ? 'text-red-200' :
                        msg.type === 'warning' ? 'text-yellow-200' :
                        'text-gray-200'
                      }`}>
                        {msg.message}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 단계 완료 표시 */}
              {isStepCompleted && (
                <div className="mt-4 p-3 bg-green-900/30 border border-green-500/30 rounded-lg">
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-bold">단계 완료!</span>
                  </div>
                  <p className="text-sm text-green-200 mt-1">
                    다음 단계로 자동 이동합니다...
                  </p>
                </div>
              )}

              {/* 최종 완료 버튼 */}
              {currentStep >= trainingSteps.length && !isCompleted && (
                <button
                  onClick={handleCompleteTraining}
                  className="w-full mt-4 px-4 py-3 bg-green-600 text-white rounded-lg font-bold
                           hover:bg-green-700 transition-all duration-300"
                >
                  훈련 완료
                </button>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-green-600 text-sm">
          <p>© 2025 corebyte.labs. All content rights reserved.</p>
        </div>
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-20"></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-yellow-400 rounded-full animate-pulse opacity-30"></div>
        <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-red-400 rounded-full animate-ping opacity-15"></div>
      </div>
    </div>
  );
};

export default ScenarioTraining;