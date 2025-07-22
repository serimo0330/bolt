import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Timer } from './Timer';
import { scenarioTrainingData } from '../data/trainingSteps';
import { TrainingStep, StepResult, TrainingResult } from '../types/training';
import { 
  Home, 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  User,
  Target,
  Play,
  Award,
  Brain,
  Search,
  FileText,
  MessageSquare,
  Lightbulb
} from 'lucide-react';

const ScenarioTraining = () => {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [stepResults, setStepResults] = useState<StepResult[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isTrainingComplete, setIsTrainingComplete] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrectAction, setIsCorrectAction] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'analysis' | 'hypothesis' | 'priority' | 'action'>('analysis');
  const [analysisAnswers, setAnalysisAnswers] = useState<{[key: string]: any}>({});
  const [hypothesis, setHypothesis] = useState('');
  const [riskLevel, setRiskLevel] = useState<number>(1);
  const [priorityOrder, setPriorityOrder] = useState<string[]>([]);
  const [reasoning, setReasoning] = useState('');

  const scenario = scenarioId ? scenarioTrainingData[parseInt(scenarioId)] : null;
  const currentStepData = scenario?.steps.find(step => step.id === currentStep);
  const totalSteps = scenario?.steps.length || 0;
  const phaseNames = {
    analysis: '상황 분석',
    hypothesis: '가설 수립',
    priority: '우선순위 결정',
    action: '행동 선택'
  };

  useEffect(() => {
    if (scenario && !startTime) {
      setStartTime(new Date());
    }
  }, [scenario, startTime]);

  const handlePhaseComplete = () => {
    if (currentPhase === 'analysis') {
      setCurrentPhase('hypothesis');
    } else if (currentPhase === 'hypothesis') {
      setCurrentPhase('priority');
    } else if (currentPhase === 'priority') {
      setCurrentPhase('action');
    } else {
      // 최종 평가
      evaluateStep();
    }
  };

  const evaluateStep = () => {
    let isCorrect = false;
    let score = 0;
    
    // 종합 평가 로직
    switch (currentStep) {
      case 1: // EDR P1 경보 확인
        isCorrect = analysisAnswers.alertType === 'ransomware' && 
                   hypothesis.includes('랜섬웨어') && 
                   riskLevel >= 4;
        score = isCorrect ? 100 : Math.max(0, (riskLevel * 20) + (hypothesis.length > 10 ? 20 : 0));
        break;
      case 2: // 현장 증거 보존
        isCorrect = analysisAnswers.evidenceType === 'screen_memory' && 
                   priorityOrder[0] === 'preserve_evidence';
        score = isCorrect ? 100 : 60;
        break;
      // 다른 단계들도 유사하게 구현
      default:
        isCorrect = score >= 70;
        break;
    }

    setIsCorrectAction(isCorrect);
    setShowFeedback(true);

    // 결과 저장
    const result: StepResult = {
      stepId: currentStep,
      status: isCorrect ? 'success' : 'failure',
      data: { 
        analysisAnswers, 
        hypothesis, 
        riskLevel, 
        priorityOrder, 
        reasoning,
        timestamp: new Date().toISOString() 
      },
      timestamp: new Date().toISOString(),
      score
    };

    setStepResults(prev => [...prev, result]);

    if (isCorrect) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setCurrentPhase('analysis');
      setAnalysisAnswers({});
      setHypothesis('');
      setRiskLevel(1);
      setPriorityOrder([]);
      setReasoning('');
      setShowFeedback(false);
      setIsCorrectAction(false);
    } else {
      // 훈련 완료
      setIsTrainingComplete(true);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setCurrentPhase('analysis');
      setAnalysisAnswers({});
      setHypothesis('');
      setRiskLevel(1);
      setPriorityOrder([]);
      setReasoning('');
      setSelectedAction(null);
      setShowFeedback(false);
      setIsCorrectAction(false);
    }
  };

  const getStepContent = (stepId: number) => {
    switch (stepId) {
      case 1:
        return {
          situation: "EDR 시스템에서 P1 등급 경보가 발생했습니다.",
          data: {
            timestamp: "2024-01-15 14:23:17",
            system: "FIN-PC-07",
            process: "ransomware.exe",
            behavior: "대량 파일 암호화 시도",
            networkActivity: "외부 IP 203.0.113.45와 통신"
          },
          analysisQuestions: [
            {
              question: "이 경보의 위협 유형은 무엇입니까?",
              options: ["랜섬웨어", "스파이웨어", "애드웨어", "정상 프로그램"],
              correct: "랜섬웨어",
              key: "alertType"
            },
            {
              question: "가장 우려되는 피해는 무엇입니까?",
              options: ["데이터 암호화", "정보 유출", "시스템 손상", "네트워크 마비"],
              correct: "데이터 암호화",
              key: "primaryConcern"
            }
          ],
          priorityOptions: [
            "경보 상세 분석",
            "현장 증거 보존",
            "네트워크 격리",
            "상급자 보고"
          ]
        };
      case 2:
        return {
          situation: "랜섬웨어 감염이 확인된 PC에서 증거를 보존해야 합니다.",
          data: {
            screen: "랜섬노트 표시 중",
            processes: "ransomware.exe, crypto.dll 실행 중",
            files: "Documents 폴더 암호화 진행 중",
            memory: "악성 프로세스 메모리 정보 존재"
          },
          analysisQuestions: [
            {
              question: "가장 중요한 증거는 무엇입니까?",
              options: ["화면 캡처", "메모리 덤프", "하드디스크 이미지", "네트워크 로그"],
              correct: "메모리 덤프",
              key: "evidenceType"
            }
          ],
          priorityOptions: [
            "화면 캡처",
            "메모리 덤프 수집",
            "PC 전원 차단",
            "네트워크 분리"
          ]
        };
      default:
        return {
          situation: "단계별 상황 정보",
          data: {},
          analysisQuestions: [],
          priorityOptions: []
        };
    }
  };

  if (!scenario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-400 mb-4">시나리오를 찾을 수 없습니다</h1>
          <button
            onClick={() => navigate('/courses')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            코스 선택으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (isTrainingComplete) {
    const completionRate = (completedSteps.length / totalSteps) * 100;
    const badge = completionRate >= 80 ? 'leader' : completionRate >= 60 ? 'competent' : 'trainee';
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
        <div className="container mx-auto px-4 py-8">
          {/* 네비게이션 */}
          <div className="mb-6">
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-300"
              >
                <Home className="w-4 h-4" />
                홈으로 가기
              </button>
              <button
                onClick={() => navigate('/courses')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4" />
                코스 선택으로 돌아가기
              </button>
            </div>
          </div>

          {/* 완료 화면 */}
          <div className="text-center">
            <div className="text-6xl mb-8">
              {badge === 'leader' ? '🏆' : badge === 'competent' ? '🥈' : '🥉'}
            </div>
            <h1 className="text-4xl font-bold text-yellow-400 mb-6">훈련 완료!</h1>
            
            <div className="bg-black/50 backdrop-blur-sm border border-green-500/30 rounded-lg p-8 mb-8 max-w-2xl mx-auto">
              <div className="text-4xl mb-4">
                {completedSteps.length} / {totalSteps}
              </div>
              <div className="text-xl text-green-300 mb-4">
                완료율: {Math.round(completionRate)}%
              </div>
              <div className="text-lg text-yellow-300">
                획득 배지: {badge === 'leader' ? '대응 리더' : badge === 'competent' ? '유능한 분석가' : '훈련생'}
              </div>
            </div>

            <button
              onClick={() => navigate('/courses')}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 border-2 border-blue-400 rounded-lg text-white font-bold text-xl hover:from-blue-500 hover:to-blue-600 transition-all duration-300"
            >
              다른 시나리오 도전하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      {/* 타이머 */}
      <Timer initialMinutes={10} />
      
      <div className="container mx-auto px-4 py-8">
        {/* 네비게이션 */}
        <div className="mb-6">
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all duration-300"
            >
              <Home className="w-4 h-4" />
              홈으로 가기
            </button>
            <button
              onClick={() => navigate('/courses')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              코스 선택으로 돌아가기
            </button>
          </div>
        </div>

        {/* 브레드크럼 */}
        <div className="mb-8">
          <div className="text-green-400 text-sm mb-2">
            코스 선택 → 시나리오 목록 → 훈련 진행 중
          </div>
        </div>

        {/* 진행상황 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-blue-400">진행 상황</h2>
            <span className="text-green-400 font-bold">
              {Math.min(currentStep, totalSteps)} / {totalSteps}
            </span>
          </div>
          <div className="flex gap-2 mb-4">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i + 1}
                className={`flex-1 h-3 rounded-full transition-all duration-300 ${
                  completedSteps.includes(i + 1)
                    ? 'bg-green-500'
                    : i + 1 === currentStep && currentStep <= totalSteps
                    ? 'bg-yellow-500'
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            {Array.from({ length: totalSteps }, (_, i) => (
              <span key={i + 1}>{i + 1}</span>
            ))}
          </div>
        </div>

        {/* 현재 단계 */}
        {currentStepData && (
          <div className="bg-black/50 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-8 mb-8">
            {/* 단계 헤더 */}
            <div className="flex items-center justify-between mb-6">
              <div className="bg-yellow-500 text-black rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                {currentStep}
              </div>
              <div className="flex-1 ml-4">
                <h2 className="text-2xl font-bold text-yellow-400">{currentStepData.title}</h2>
                <p className="text-green-200 text-lg mt-2">{currentStepData.description}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-cyan-400 mb-1">현재 단계</div>
                <div className="text-lg font-bold text-cyan-300">{phaseNames[currentPhase]}</div>
              </div>
            </div>

            {/* 단계별 콘텐츠 */}
            {!showFeedback && (
              <div className="space-y-6">
                {/* 1단계: 상황 분석 */}
                {currentPhase === 'analysis' && (
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Search className="w-6 h-6 text-blue-400" />
                      <h3 className="text-xl font-bold text-blue-400">1단계: 상황 분석</h3>
                    </div>
                    
                    {/* 상황 정보 */}
                    <div className="mb-6">
                      <h4 className="text-lg font-bold text-cyan-400 mb-3">📊 수집된 정보</h4>
                      <div className="bg-gray-800/50 p-4 rounded-lg">
                        <p className="text-green-200 mb-3">{getStepContent(currentStep).situation}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          {Object.entries(getStepContent(currentStep).data).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-yellow-300">{key}:</span>
                              <span className="text-green-200">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 분석 질문들 */}
                    <div className="space-y-4">
                      {getStepContent(currentStep).analysisQuestions.map((q, index) => (
                        <div key={index} className="mb-4">
                          <p className="text-green-300 font-bold mb-3">{q.question}</p>
                          <div className="grid grid-cols-2 gap-3">
                            {q.options.map((option) => (
                              <button
                                key={option}
                                onClick={() => setAnalysisAnswers({...analysisAnswers, [q.key]: option})}
                                className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                                  analysisAnswers[q.key] === option
                                    ? 'border-blue-400 bg-blue-900/30 text-blue-300'
                                    : 'border-gray-600 bg-gray-800/30 hover:border-blue-400'
                                }`}
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2단계: 가설 수립 */}
                {currentPhase === 'hypothesis' && (
                  <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Lightbulb className="w-6 h-6 text-purple-400" />
                      <h3 className="text-xl font-bold text-purple-400">2단계: 가설 수립</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-green-300 font-bold mb-3">
                          💭 현재 상황에 대한 당신의 가설을 서술하세요:
                        </label>
                        <textarea
                          value={hypothesis}
                          onChange={(e) => setHypothesis(e.target.value)}
                          placeholder="예: 이것은 WannaCry 계열의 랜섬웨어로 보이며, 이메일 첨부파일을 통해 감염된 것으로 추정됩니다..."
                          className="w-full h-24 p-4 bg-gray-800 border-2 border-gray-600 rounded-lg text-green-300 
                                   focus:border-purple-400 focus:outline-none resize-none"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-green-300 font-bold mb-3">
                          ⚠️ 위험도 평가 (1-5점):
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <button
                              key={level}
                              onClick={() => setRiskLevel(level)}
                              className={`w-12 h-12 rounded-lg border-2 font-bold transition-all duration-300 ${
                                riskLevel === level
                                  ? level >= 4 
                                    ? 'border-red-400 bg-red-900/30 text-red-300'
                                    : level >= 3
                                    ? 'border-yellow-400 bg-yellow-900/30 text-yellow-300'
                                    : 'border-green-400 bg-green-900/30 text-green-300'
                                  : 'border-gray-600 bg-gray-800/30 hover:border-purple-400'
                              }`}
                            >
                              {level}
                            </button>
                          ))}
                        </div>
                        <p className="text-sm text-gray-400 mt-2">
                          1: 매우 낮음 | 2: 낮음 | 3: 보통 | 4: 높음 | 5: 매우 높음
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3단계: 우선순위 결정 */}
                {currentPhase === 'priority' && (
                  <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Target className="w-6 h-6 text-orange-400" />
                      <h3 className="text-xl font-bold text-orange-400">3단계: 우선순위 결정</h3>
                    </div>
                    
                    <div>
                      <p className="text-green-300 font-bold mb-4">
                        🎯 현재 상황에서 가장 먼저 해야 할 일은 무엇입니까?
                      </p>
                      <div className="grid grid-cols-1 gap-3">
                        {getStepContent(currentStep).priorityOptions.map((option, index) => (
                          <button
                            key={option}
                            onClick={() => setPriorityOrder([option])}
                            className={`p-4 rounded-lg border-2 text-left transition-all duration-300 ${
                              priorityOrder[0] === option
                                ? 'border-orange-400 bg-orange-900/30 text-orange-300'
                                : 'border-gray-600 bg-gray-800/30 hover:border-orange-400'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-6 h-6 bg-orange-500 text-black rounded-full flex items-center justify-center text-sm font-bold">
                                {index + 1}
                              </span>
                              <span className="text-green-200">{option}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                      
                      {priorityOrder.length > 0 && (
                        <div className="mt-4 p-3 bg-orange-900/20 border border-orange-500/30 rounded-lg">
                          <p className="text-orange-300 font-bold">선택한 우선순위:</p>
                          <p className="text-green-200">{priorityOrder[0]}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 4단계: 행동 선택 */}
                {currentPhase === 'action' && (
                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Play className="w-6 h-6 text-green-400" />
                      <h3 className="text-xl font-bold text-green-400">4단계: 행동 선택</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-green-300 font-bold mb-3">
                          🎯 최종 행동 계획을 서술하세요:
                        </label>
                        <textarea
                          value={reasoning}
                          onChange={(e) => setReasoning(e.target.value)}
                          placeholder="예: 1) 즉시 화면 캡처 후 메모리 덤프 수집, 2) 네트워크 케이블 물리적 분리, 3) 상급자 보고..."
                          className="w-full h-32 p-4 bg-gray-800 border-2 border-gray-600 rounded-lg text-green-300 
                                   focus:border-green-400 focus:outline-none resize-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 단계 완료 버튼 */}
                <div className="text-center">
                  <button
                    onClick={handlePhaseComplete}
                    disabled={
                      (currentPhase === 'analysis' && getStepContent(currentStep).analysisQuestions.some(q => !analysisAnswers[q.key])) ||
                      (currentPhase === 'hypothesis' && (hypothesis.length < 10 || riskLevel === 1)) ||
                      (currentPhase === 'priority' && priorityOrder.length === 0) ||
                      (currentPhase === 'action' && reasoning.length < 20)
                    }
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 border-2 border-blue-400 
                             rounded-lg text-white font-bold text-lg hover:from-blue-500 hover:to-blue-600 
                             disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    {currentPhase === 'action' ? '최종 평가 받기' : '다음 단계로'}
                  </button>
                </div>
              </div>
            )}

            {/* 피드백 */}
            {showFeedback && (
              <div className="space-y-6">
                {/* 종합 평가 */}
                <div className={`p-6 rounded-lg border-2 ${
                  isCorrectAction 
                    ? 'border-green-500 bg-green-900/20' 
                    : 'border-orange-500 bg-orange-900/20'
                }`}>
                  <div className="flex items-center gap-3 mb-4">
                    <Brain className="w-6 h-6 text-yellow-400" />
                    <h3 className="text-xl font-bold text-yellow-400">종합 평가</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-bold text-cyan-400 mb-3">📊 당신의 분석</h4>
                      <div className="space-y-2 text-sm">
                        <div><span className="text-yellow-300">상황 분석:</span> <span className="text-green-200">{JSON.stringify(analysisAnswers)}</span></div>
                        <div><span className="text-yellow-300">가설:</span> <span className="text-green-200">{hypothesis}</span></div>
                        <div><span className="text-yellow-300">위험도:</span> <span className="text-green-200">{riskLevel}/5</span></div>
                        <div><span className="text-yellow-300">행동 계획:</span> <span className="text-green-200">{reasoning}</span></div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-bold text-green-400 mb-3">✅ 전문가 평가</h4>
                      <div className="space-y-2 text-sm">
                        <div className={`p-3 rounded-lg ${isCorrectAction ? 'bg-green-900/30' : 'bg-orange-900/30'}`}>
                          <p className={`font-bold ${isCorrectAction ? 'text-green-300' : 'text-orange-300'}`}>
                            {isCorrectAction ? '✅ 우수한 분석입니다!' : '⚠️ 개선이 필요합니다'}
                          </p>
                          <p className="text-green-200 mt-2">
                            {isCorrectAction 
                              ? '위협을 정확히 식별하고 적절한 대응 방안을 수립했습니다.'
                              : '일부 분석이 부족하거나 우선순위 설정에 개선이 필요합니다.'
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 네비게이션 버튼 */}
            {showFeedback && (
              <div className="flex justify-between mt-6">
              <button
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5" />
                이전 단계
              </button>

                <button
                  onClick={handleNextStep}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
                >
                  {currentStep === totalSteps ? '훈련 완료' : '다음 단계'}
                  {currentStep < totalSteps && <ArrowLeft className="w-5 h-5 rotate-180" />}
                  {currentStep === totalSteps && <Award className="w-5 h-5" />}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScenarioTraining;