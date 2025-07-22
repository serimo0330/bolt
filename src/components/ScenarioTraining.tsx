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
  Award
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

  const scenario = scenarioId ? scenarioTrainingData[parseInt(scenarioId)] : null;
  const currentStepData = scenario?.steps.find(step => step.id === currentStep);
  const totalSteps = scenario?.steps.length || 0;

  useEffect(() => {
    if (scenario && !startTime) {
      setStartTime(new Date());
    }
  }, [scenario, startTime]);

  const handleActionSelect = (action: string) => {
    if (!currentStepData || showFeedback) return;

    setSelectedAction(action);
    
    // 정답 확인 로직
    let isCorrect = false;
    
    switch (currentStep) {
      case 1: // EDR P1 경보 확인
        isCorrect = action === 'confirm_alert';
        break;
      case 2: // 현장 증거 보존
        isCorrect = action === 'preserve_evidence';
        break;
      case 3: // 네트워크 케이블 물리적 분리
        isCorrect = action === 'disconnect_network';
        break;
      case 4: // 메모리 덤프 수집
        isCorrect = action === 'collect_memory_dump';
        break;
      case 5: // SIEM 쿼리 작성
        isCorrect = action === 'siem_query';
        break;
      case 6: // 악성 파일 해시값 TIP 조회
        isCorrect = action === 'tip_lookup';
        break;
      case 7: // 랜섬웨어 초기 대응 플레이북 실행
        isCorrect = action === 'ransomware_playbook';
        break;
      case 8: // 침해사고분석팀 이관
        isCorrect = action === 'transfer_to_analysis_team';
        break;
      default:
        isCorrect = false;
    }

    setIsCorrectAction(isCorrect);
    setShowFeedback(true);

    // 결과 저장
    const result: StepResult = {
      stepId: currentStep,
      status: isCorrect ? 'success' : 'failure',
      data: { action, timestamp: new Date().toISOString() },
      timestamp: new Date().toISOString(),
      score: isCorrect ? 100 : 0
    };

    setStepResults(prev => [...prev, result]);

    if (isCorrect) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setSelectedAction(null);
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
      setSelectedAction(null);
      setShowFeedback(false);
      setIsCorrectAction(false);
    }
  };

  const getStepActions = (stepId: number) => {
    switch (stepId) {
      case 1:
        return [
          { id: 'confirm_alert', label: 'EDR 경보 상세 정보 확인', correct: true },
          { id: 'ignore_alert', label: '경보 무시하고 다른 업무 진행', correct: false }
        ];
      case 2:
        return [
          { id: 'preserve_evidence', label: 'PC 전원 유지하고 화면 촬영', correct: true },
          { id: 'shutdown_pc', label: 'PC 전원 즉시 차단', correct: false }
        ];
      case 3:
        return [
          { id: 'disconnect_network', label: '네트워크 케이블 물리적 분리', correct: true },
          { id: 'software_block', label: '소프트웨어로 네트워크 차단', correct: false }
        ];
      case 4:
        return [
          { id: 'collect_memory_dump', label: 'volatility 도구로 메모리 덤프 수집', correct: true },
          { id: 'reboot_system', label: '시스템 재부팅 후 분석', correct: false }
        ];
      case 5:
        return [
          { id: 'siem_query', label: 'source="email" AND dest="FIN-PC-07" 쿼리 실행', correct: true },
          { id: 'web_logs_only', label: '웹 브라우징 로그만 검색', correct: false }
        ];
      case 6:
        return [
          { id: 'tip_lookup', label: '악성 파일 해시값 TIP 조회 실행', correct: true },
          { id: 'skip_tip', label: 'TIP 조회 건너뛰고 다음 단계 진행', correct: false }
        ];
      case 7:
        return [
          { id: 'ransomware_playbook', label: '랜섬웨어 초기 대응 플레이북 실행', correct: true },
          { id: 'general_malware_playbook', label: '일반 악성코드 대응 플레이북 실행', correct: false }
        ];
      case 8:
        return [
          { id: 'transfer_to_analysis_team', label: '침해사고분석팀 이관 완료', correct: true },
          { id: 'self_resolve', label: '자체적으로 해결 시도', correct: false }
        ];
      default:
        return [];
    }
  };

  const getFeedbackMessage = (stepId: number, isCorrect: boolean) => {
    const messages = {
      1: {
        success: "✅ 경보 확인 완료. FIN-PC-07에서 WannaCry 변종 탐지됨",
        failure: "❌ 경보를 먼저 확인해주세요"
      },
      2: {
        success: "✅ 증거 보존 완료. 랜섬노트 화면 캡처됨",
        failure: "❌ 전원을 끄면 메모리 증거가 손실됩니다"
      },
      3: {
        success: "✅ 네트워크 격리 완료. 랜섬웨어 확산 차단됨",
        failure: "❌ 네트워크 연결 상태에서는 확산 위험이 있습니다"
      },
      4: {
        success: "✅ 메모리 덤프 수집 완료. 악성 프로세스 정보 확보됨",
        failure: "❌ 메모리 덤프 수집이 필요합니다"
      },
      5: {
        success: "✅ 감염 경로 확인. 이메일 첨부파일을 통한 감염으로 판단됨",
        failure: "❌ 올바른 쿼리를 작성해주세요"
      },
      6: {
        success: "✅ 악성 파일 확인. WannaCry 변종으로 식별됨",
        failure: "❌ 해시값을 정확히 입력해주세요"
      },
      7: {
        success: "✅ 랜섬웨어 초기 대응 플레이북 실행 완료",
        failure: "❌ 올바른 플레이북을 선택해주세요"
      },
      8: {
        success: "✅ 침해사고분석팀 이관 완료. 심층 분석 시작됨",
        failure: "❌ 이관 절차를 완료해주세요"
      }
    };

    return messages[stepId as keyof typeof messages]?.[isCorrect ? 'success' : 'failure'] || '';
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
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-yellow-500 text-black rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg">
                {currentStep}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-yellow-400">{currentStepData.title}</h2>
                <p className="text-green-200 text-lg mt-2">{currentStepData.description}</p>
              </div>
            </div>

            {/* 액션 선택 */}
            <div className="space-y-4 mb-6">
              {getStepActions(currentStep).map((action) => (
                <button
                  key={action.id}
                  onClick={() => handleActionSelect(action.id)}
                  disabled={showFeedback}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-300 ${
                    showFeedback
                      ? action.correct
                        ? 'border-green-500 bg-green-900/30 text-green-300'
                        : selectedAction === action.id
                        ? 'border-red-500 bg-red-900/30 text-red-300'
                        : 'border-gray-600 bg-gray-800/30 text-gray-400'
                      : selectedAction === action.id
                      ? 'border-yellow-400 bg-yellow-900/20 text-yellow-300'
                      : 'border-gray-600 bg-gray-800/30 hover:border-yellow-400 hover:bg-yellow-900/20'
                  } disabled:cursor-not-allowed`}
                >
                  <div className="flex items-center justify-between">
                    <span>{action.label}</span>
                    {showFeedback && action.correct && (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                    {showFeedback && selectedAction === action.id && !action.correct && (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* 피드백 */}
            {showFeedback && (
              <div className={`p-4 rounded-lg border-2 mb-6 ${
                isCorrectAction 
                  ? 'border-green-500 bg-green-900/20' 
                  : 'border-red-500 bg-red-900/20'
              }`}>
                <p className={`font-bold ${isCorrectAction ? 'text-green-300' : 'text-red-300'}`}>
                  {getFeedbackMessage(currentStep, isCorrectAction)}
                </p>
              </div>
            )}

            {/* 네비게이션 버튼 */}
            <div className="flex justify-between">
              <button
                onClick={handlePrevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5" />
                이전 단계
              </button>

              {showFeedback && (
                <button
                  onClick={handleNextStep}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
                >
                  {currentStep === totalSteps ? '훈련 완료' : '다음 단계'}
                  {currentStep < totalSteps && <ArrowLeft className="w-5 h-5 rotate-180" />}
                  {currentStep === totalSteps && <Award className="w-5 h-5" />}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScenarioTraining;