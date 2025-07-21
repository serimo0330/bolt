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
  const handleAlertAcknowledge = () => {
    setAlertAcknowledged(true);
    setIsAlertSounding(false);
    
    // 첫 번째 단계가 EDR 경보 확인인 경우
    const firstStep = trainingSteps[0];
    if (firstStep && firstStep.tool === 'edr' && firstStep.action === 'click') {
      handleStepAction('click', firstStep.data);
    }
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
          <div className="max-w-6xl mx-auto">
            {/* 사이렌 효과 */}
            {isAlertSounding && (
              <div className="fixed inset-0 bg-red-500/20 animate-pulse z-40 pointer-events-none">
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg font-bold text-xl animate-bounce">
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg font-bold text-xl animate-bounce cursor-pointer"
                     onClick={handleAlertAcknowledge}>
                  🚨 P1 긴급 경보 발생! 클릭하여 인지하세요 🚨
                </div>
              </div>
            )}

            {/* 시나리오 헤더 */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-yellow-400 mb-4">
                시나리오 {scenario.id}: {scenario.title}
              </h1>
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className={`px-4 py-2 rounded-lg border font-bold ${getPriorityColor(scenario.priority)}`}>
                  {scenario.priority} 등급
                </span>
                <span className="text-cyan-400">역할: {scenario.role}</span>
              </div>
              <p className="text-green-200 text-lg max-w-4xl mx-auto">
                {scenario.situation}
              </p>
            </div>

            {/* 진행 상황 */}
            <div className="bg-black/50 backdrop-blur-sm border border-blue-500/30 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-blue-400">진행 상황</h3>
                <span className="text-blue-400 text-lg font-bold">
                  {currentStep + 1} / {trainingSteps.length}
                </span>
              </div>
              
              {/* 진행도 바 */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  {trainingSteps.map((step, index) => (
                    <div key={step.id} className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-2 ${
                        index < currentStep ? 'bg-green-500 text-white' :
                        index === currentStep ? 'bg-yellow-500 text-black' :
                        'bg-gray-600 text-gray-300'
                      }`}>
                        {index < currentStep ? '✓' : index + 1}
                      </div>
                      <div className={`text-xs text-center max-w-20 ${
                        index === currentStep ? 'text-yellow-400 font-bold' : 'text-gray-400'
                      }`}>
                        {step.title.split(' ')[0]}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 mt-4">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(currentStep / trainingSteps.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* 현재 단계 */}
            {trainingSteps[currentStep] && (
              <div className="bg-black/50 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-8 mb-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-yellow-500 text-black rounded-full flex items-center justify-center font-bold text-xl">
                    {currentStep + 1}
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-yellow-400">
                      {trainingSteps[currentStep].title}
                    </h3>
                    <p className="text-green-200 text-lg mt-2">
                      {trainingSteps[currentStep].description}
                    </p>
                  </div>
                </div>

                {/* 단계별 액션 버튼들 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* EDR 도구 */}
                  {trainingSteps[currentStep].tool === 'edr' && (
                    <button
                      onClick={() => handleStepAction('click')}
                      disabled={currentStepCompleted}
                      className={`p-6 rounded-lg border-2 transition-all duration-300 ${
                        currentStepCompleted
                          ? 'border-green-500 bg-green-900/30 cursor-not-allowed'
                          : 'border-purple-500 bg-purple-900/30 hover:bg-purple-800/50'
                      }`}
                    >
                      <Eye className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                      <div className="text-purple-400 font-bold text-lg mb-2">EDR 도구</div>
                      <div className="text-green-200 text-sm">
                        {currentStepCompleted ? '✓ 완료됨' : '경보 확인하기'}
                      </div>
                    </button>
                  )}

                  {/* SIEM 도구 */}
                  {trainingSteps[currentStep].tool === 'siem' && (
                    <button
                      onClick={() => handleStepAction('query')}
                      disabled={currentStepCompleted}
                      className={`p-6 rounded-lg border-2 transition-all duration-300 ${
                        currentStepCompleted
                          ? 'border-green-500 bg-green-900/30 cursor-not-allowed'
                          : 'border-cyan-500 bg-cyan-900/30 hover:bg-cyan-800/50'
                      }`}
                    >
                      <Database className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                      <div className="text-cyan-400 font-bold text-lg mb-2">SIEM 도구</div>
                      <div className="text-green-200 text-sm">
                        {currentStepCompleted ? '✓ 완료됨' : '로그 분석하기'}
                      </div>
                    </button>
                  )}

                  {/* TIP 도구 */}
                  {trainingSteps[currentStep].tool === 'tip' && (
                    <button
                      onClick={() => handleStepAction('input')}
                      disabled={currentStepCompleted}
                      className={`p-6 rounded-lg border-2 transition-all duration-300 ${
                        currentStepCompleted
                          ? 'border-green-500 bg-green-900/30 cursor-not-allowed'
                          : 'border-yellow-500 bg-yellow-900/30 hover:bg-yellow-800/50'
                      }`}
                    >
                      <Search className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                      <div className="text-yellow-400 font-bold text-lg mb-2">TIP 도구</div>
                      <div className="text-green-200 text-sm">
                        {currentStepCompleted ? '✓ 완료됨' : '위협 정보 조회'}
                      </div>
                    </button>
                  )}

                  {/* SOAR 도구 */}
                  {trainingSteps[currentStep].tool === 'soar' && (
                    <button
                      onClick={() => handleStepAction('select')}
                      disabled={currentStepCompleted}
                      className={`p-6 rounded-lg border-2 transition-all duration-300 ${
                        currentStepCompleted
                          ? 'border-green-500 bg-green-900/30 cursor-not-allowed'
                          : 'border-orange-500 bg-orange-900/30 hover:bg-orange-800/50'
                      }`}
                    >
                      <Zap className="w-8 h-8 text-orange-400 mx-auto mb-3" />
                      <div className="text-orange-400 font-bold text-lg mb-2">SOAR 도구</div>
                      <div className="text-green-200 text-sm">
                        {currentStepCompleted ? '✓ 완료됨' : '플레이북 실행'}
                      </div>
                    </button>
                  )}

                  {/* 물리적 조치 */}
                  {trainingSteps[currentStep].tool === 'physical' && (
                    <button
                      onClick={() => handleStepAction('confirm')}
                      disabled={currentStepCompleted}
                      className={`p-6 rounded-lg border-2 transition-all duration-300 ${
                        currentStepCompleted
                          ? 'border-green-500 bg-green-900/30 cursor-not-allowed'
                          : 'border-red-500 bg-red-900/30 hover:bg-red-800/50'
                      }`}
                    >
                      <Shield className="w-8 h-8 text-red-400 mx-auto mb-3" />
                      <div className="text-red-400 font-bold text-lg mb-2">물리적 조치</div>
                      <div className="text-green-200 text-sm">
                        {currentStepCompleted ? '✓ 완료됨' : '현장 조치 수행'}
                      </div>
                    </button>
                  )}

                  {/* 커뮤니케이션 */}
                  {trainingSteps[currentStep].tool === 'communication' && (
                    <button
                      onClick={() => handleStepAction('confirm')}
                      disabled={currentStepCompleted}
                      className={`p-6 rounded-lg border-2 transition-all duration-300 ${
                        currentStepCompleted
                          ? 'border-green-500 bg-green-900/30 cursor-not-allowed'
                          : 'border-blue-500 bg-blue-900/30 hover:bg-blue-800/50'
                      }`}
                    >
                      <MessageSquare className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                      <div className="text-blue-400 font-bold text-lg mb-2">커뮤니케이션</div>
                      <div className="text-green-200 text-sm">
                        {currentStepCompleted ? '✓ 완료됨' : '보고 및 협조'}
                      </div>
                    </button>
                  )}
                  </div>
                </div>
              </div>
            )}

            {/* 단계 완료 표시 */}
            {currentStepCompleted && (
              <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-6 mb-8 animate-fade-in">
                <div className="flex items-center gap-3 text-green-400">
                  <CheckCircle className="w-8 h-8" />
                  <div>
                    <h4 className="text-xl font-bold">단계 완료!</h4>
                    <p className="text-green-200">3초 후 다음 단계로 자동 이동합니다...</p>
                  </div>
                </div>
              </div>
            )}

            {/* 팀 채팅 */}
            {chatMessages.length > 0 && (
              <div className="bg-black/50 backdrop-blur-sm border border-green-500/30 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-green-400" />
                  <h3 className="text-lg font-bold text-green-400">팀 채팅</h3>
                </div>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className="flex items-start gap-3">
                      <Users className="w-4 h-4 text-blue-400 mt-1" />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-blue-400">{msg.sender}</span>
                          <span className="text-xs text-gray-500">{msg.timestamp}</span>
                          {msg.type === 'success' && <CheckCircle className="w-3 h-3 text-green-400" />}
                          {msg.type === 'error' && <XCircle className="w-3 h-3 text-red-400" />}
                        </div>
                        <div className={`text-sm ${
                          msg.type === 'success' ? 'text-green-200' :
                          msg.type === 'error' ? 'text-red-200' :
                          msg.type === 'warning' ? 'text-yellow-200' :
                          'text-gray-200'
                        }`}>
                          {msg.message}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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