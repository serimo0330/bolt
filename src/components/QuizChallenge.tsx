import React, { useState, useEffect } from 'react';
import { Tooltip } from './Tooltip';
import { WarningModal } from './WarningModal';
import { CheckCircle, XCircle, ArrowRight, ArrowLeft, Target, Brain, Home, RotateCcw, AlertTriangle } from 'lucide-react';

interface QuizQuestion {
  id: number;
  type: 'multiple-choice' | 'ox' | 'text-input' | 'drag-drop';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  dragItems?: { id: string; text: string }[];
  dropZones?: { id: string; label: string; correctItem: string }[];
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    type: 'drag-drop',
    question: "'초동대응 3대 원칙'의 이름을 올바른 설명에 끌어다 놓으세요.",
    dragItems: [
      { id: 'preservation', text: '증거 보존' },
      { id: 'reporting', text: '보고 및 전파' },
      { id: 'containment', text: '확산 방지' }
    ],
    dropZones: [
      { id: 'zone1', label: '섣부른 조치는 금물!', correctItem: 'preservation' },
      { id: 'zone2', label: '신속하고 정확하게!', correctItem: 'reporting' },
      { id: 'zone3', label: '증거 확보 후 신중하게!', correctItem: 'containment' }
    ],
    correctAnswer: ['preservation', 'reporting', 'containment'],
    explanation: '초동대응 3대 원칙: 1) 증거 보존 (섣부른 조치 금지), 2) 보고 및 전파 (신속한 상황 공유), 3) 확산 방지 (증거 확보 후 격리)'
  },
  {
    id: 2,
    type: 'multiple-choice',
    question: '초동대응 시 가장 먼저 해야 할 일은?',
    options: ['시스템 재부팅', '현장 증거 보존', '백신 실행', '네트워크 차단'],
    correctAnswer: '현장 증거 보존',
    explanation: '초동대응의 첫 번째 원칙은 증거 보존입니다. 섣부른 조치는 중요한 증거를 훼손할 수 있습니다.'
  },
  {
    id: 3,
    type: 'text-input',
    question: '시스템에서 절대 하면 안 되는 행동은? (두 가지 중 하나를 입력하세요)',
    correctAnswer: ['재부팅', '전원 차단'],
    explanation: '재부팅이나 전원 차단은 메모리(RAM)에 있는 중요한 증거(실행 중인 프로세스, 네트워크 연결 상태 등)를 완전히 삭제합니다.'
  },
  {
    id: 4,
    type: 'ox',
    question: '랜섬웨어 감염이 의심될 때, 가장 먼저 백신부터 실행해야 한다.',
    correctAnswer: 'X',
    explanation: '백신 실행 시 악성 파일이 삭제되어 공격 경로 분석에 필요한 증거가 훼손될 수 있습니다. 먼저 증거를 보존해야 합니다.'
  },
  {
    id: 5,
    type: 'multiple-choice',
    question: 'PC, 서버 등 엔드포인트 내부의 상세한 행위를 들여다보는 \'현미경\' 역할을 하는 SOC 도구는?',
    options: ['SIEM', 'EDR', 'SOAR', 'TIP'],
    correctAnswer: 'EDR',
    explanation: 'EDR(Endpoint Detection and Response)은 개별 엔드포인트에서 발생하는 프로세스, 파일 변경, 네트워크 연결 등을 실시간으로 모니터링하는 도구입니다.'
  },
  {
    id: 6,
    type: 'multiple-choice',
    question: '쇼핑몰 고객 DB에서 개인정보가 유출된 SQL 인젝션 사고 발생 시, 공격자의 침입 경로를 파악하기 위해 가장 먼저 분석해야 할 로그는?',
    options: ['데이터베이스 로그', '웹 서버 로그', '방화벽 로그', '시스템 로그'],
    correctAnswer: '웹 서버 로그',
    explanation: 'SQL 인젝션은 웹 애플리케이션의 취약점을 통해 이루어지므로, 웹 서버 로그에서 악성 SQL 쿼리가 포함된 HTTP 요청을 찾아야 합니다.'
  },
  {
    id: 7,
    type: 'multiple-choice',
    question: 'P1(긴급) 등급의 DDoS 공격 경보와 P3(중간) 등급의 무차별 대입 공격 경보가 동시에 발생했을 때, 어떤 경보를 먼저 처리해야 할까요?',
    options: ['P3 무차별 대입 공격', 'P1 DDoS 공격', '동시에 처리', '시간순으로 처리'],
    correctAnswer: 'P1 DDoS 공격',
    explanation: '경보 등급이 높을수록 더 위험하고 시급합니다. P1은 즉시 대응해야 하는 최고 위험 등급입니다.'
  },
  {
    id: 8,
    type: 'ox',
    question: '모든 보안 경보는 실제 위협이므로 즉시 차단 조치를 해야 한다.',
    correctAnswer: 'X',
    explanation: '정상적인 활동이 경보로 잘못 탐지되는 \'오탐\'일 수 있으므로 분석이 선행되어야 합니다. 섣부른 차단은 업무 중단을 야기할 수 있습니다.'
  },
  {
    id: 9,
    type: 'multiple-choice',
    question: '공격자가 남긴 흔적을 찾기 위해 방화벽, 서버 등 모든 시스템의 로그를 통합 검색하고 분석하는 SOC의 핵심 도구는?',
    options: ['EDR', 'SOAR', 'SIEM', 'TIP'],
    correctAnswer: 'SIEM',
    explanation: 'SIEM(Security Information and Event Management)은 전사의 모든 보안 로그를 수집하고 분석하여 위협을 탐지하는 통합 보안 관제 시스템입니다.'
  },
  {
    id: 10,
    type: 'multiple-choice',
    question: '표준화된 대응 절차인 \'플레이북\'을 자동으로 실행하여 분석가의 반복적인 업무를 줄여주는 SOC 도구는?',
    options: ['SIEM', 'EDR', 'SOAR', 'UEBA'],
    correctAnswer: 'SOAR',
    explanation: 'SOAR(Security Orchestration, Automation and Response)는 보안 사고 대응 과정을 자동화하고 표준화하여 신속한 대응을 지원하는 플랫폼입니다.'
  },
  {
    id: 11,
    type: 'multiple-choice',
    question: '분석 과정에서 발견된 의심스러운 IP 주소나 파일 해시가 알려진 악성 위협인지 외부 전문 데이터베이스에 조회하는 도구는?',
    options: ['SIEM', 'EDR', 'SOAR', 'TIP'],
    correctAnswer: 'TIP',
    explanation: 'TIP(Threat Intelligence Platform)는 위협 인텔리전스 정보를 수집, 분석, 공유하여 알려진 위협을 식별하는 도구입니다.'
  },
  {
    id: 12,
    type: 'multiple-choice',
    question: '평소와 다른 시간에 로그인하거나, 갑자기 대용량 데이터를 다운로드하는 등 사용자의 \'비정상적인 행위\'를 탐지하는 데 특화된 기술은?',
    options: ['SIEM', 'EDR', 'SOAR', 'UEBA'],
    correctAnswer: 'UEBA',
    explanation: 'UEBA(User and Entity Behavior Analytics)는 사용자와 엔티티의 행동 패턴을 분석하여 비정상적인 활동을 탐지하는 기술입니다.'
  },
  {
    id: 13,
    type: 'ox',
    question: '공급망 공격 시나리오에서, EDR이 탐지한 악성 파일의 해시값을 SOAR가 자동으로 TI 플랫폼에 조회하여 악성 여부를 판단했다. 이는 SOC 도구들이 유기적으로 연동된 사례이다.',
    correctAnswer: 'O',
    explanation: '이는 EDR(탐지) → SOAR(자동화) → TIP(위협 인텔리전스)가 연동되어 효율적인 위협 분석이 이루어진 좋은 사례입니다.'
  },
  {
    id: 14,
    type: 'drag-drop',
    question: '아래 [상황 정보]를 읽고, 정보 조각들을 분석의 핵심 목표(6하 원칙)에 맞는 올바른 티켓 항목에 끌어다 놓으세요.\n\n[상황 정보] "14:00경, 재무팀 PC(FIN-PC-07)에서 P1(긴급) 등급의 랜섬웨어 감염이 확인되었습니다."',
    dragItems: [
      { id: 'time', text: '14:00' },
      { id: 'malware', text: '랜섬웨어 감염' },
      { id: 'priority', text: 'P1 (긴급)' },
      { id: 'system', text: 'FIN-PC-07' }
    ],
    dropZones: [
      { id: 'when', label: '발생 시각 (When)', correctItem: 'time' },
      { id: 'what', label: '사고 유형 (What)', correctItem: 'malware' },
      { id: 'severity', label: '심각도 (Severity)', correctItem: 'priority' },
      { id: 'where', label: '피해 시스템 (Where)', correctItem: 'system' }
    ],
    correctAnswer: ['time', 'malware', 'priority', 'system'],
    explanation: '6하 원칙에 따라 When(14:00), What(랜섬웨어 감염), Severity(P1), Where(FIN-PC-07)를 정확히 분류해야 합니다.'
  },
  {
    id: 15,
    type: 'drag-drop',
    question: '아래 [상황 정보]를 읽고, 정보 조각들을 분석의 핵심 목표(6하 원칙)에 맞는 올바른 티켓 항목에 끌어다 놓으세요.\n\n[상황 정보] "VPN 서버(VPN-SRV-01)의 admin 계정에 대해 외부 IP(203.0.113.55)로부터 P3(중간) 등급의 무차별 대입 공격이 탐지되었습니다."',
    dragItems: [
      { id: 'attack', text: '무차별 대입 공격' },
      { id: 'level', text: 'P3 (중간)' },
      { id: 'server', text: 'VPN-SRV-01' },
      { id: 'attacker', text: '203.0.113.55' }
    ],
    dropZones: [
      { id: 'what2', label: '사고 유형 (What)', correctItem: 'attack' },
      { id: 'severity2', label: '심각도 (Severity)', correctItem: 'level' },
      { id: 'where2', label: '피해 시스템 (Where)', correctItem: 'server' },
      { id: 'who', label: '공격자 IP (Who)', correctItem: 'attacker' }
    ],
    correctAnswer: ['attack', 'level', 'server', 'attacker'],
    explanation: '6하 원칙에 따라 What(무차별 대입 공격), Severity(P3), Where(VPN-SRV-01), Who(203.0.113.55)를 정확히 분류해야 합니다.'
  }
];

interface QuizChallengeProps {
  onGoHome?: () => void;
  onSkipToScenario?: () => void;
}

export const QuizChallenge: React.FC<QuizChallengeProps> = ({ onGoHome, onSkipToScenario }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: any }>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showSectionSkipModal, setShowSectionSkipModal] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [dropZoneAssignments, setDropZoneAssignments] = useState<{ [key: string]: string }>({});

  const question = quizQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

  const handleAnswer = (answer: any) => {
    if (isAnswered) return;

    setAnswers({ ...answers, [question.id]: answer });
    setIsAnswered(true);
    setShowExplanation(true);

    // 정답 체크
    let isCorrect = false;
    if (question.type === 'multiple-choice' || question.type === 'ox') {
      isCorrect = answer === question.correctAnswer;
    } else if (question.type === 'text-input') {
      const correctAnswers = Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer];
      isCorrect = correctAnswers.some(correct => 
        answer.toLowerCase().trim() === correct.toLowerCase().trim()
      );
    } else if (question.type === 'drag-drop') {
      const zones = question.dropZones || [];
      isCorrect = zones.every(zone => dropZoneAssignments[zone.id] === zone.correctItem);
    }

    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
      setIsAnswered(false);
      setDropZoneAssignments({});
    } else {
      setQuizCompleted(true);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowExplanation(false);
      setIsAnswered(false);
      setDropZoneAssignments({});
    }
  };

  const handleSkipSection = () => {
    setShowSectionSkipModal(true);
  };

  const confirmSectionSkip = () => {
    setShowSectionSkipModal(false);
    if (onSkipToScenario) {
      onSkipToScenario();
    }
  };

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, zoneId: string) => {
    e.preventDefault();
    if (draggedItem && !isAnswered) {
      const newAssignments = { ...dropZoneAssignments };
      
      // 기존 할당 제거
      Object.keys(newAssignments).forEach(key => {
        if (newAssignments[key] === draggedItem) {
          delete newAssignments[key];
        }
      });
      
      // 새 할당
      newAssignments[zoneId] = draggedItem;
      setDropZoneAssignments(newAssignments);
      
      // 모든 드롭존이 채워졌는지 확인
      const zones = question.dropZones || [];
      if (zones.every(zone => newAssignments[zone.id])) {
        handleAnswer(newAssignments);
      }
    }
    setDraggedItem(null);
  };

  const getScoreColor = () => {
    const percentage = (score / quizQuestions.length) * 100;
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreMessage = () => {
    const percentage = (score / quizQuestions.length) * 100;
    if (percentage >= 80) return '🏆 우수! SOC 분석가 자질을 갖추셨습니다!';
    if (percentage >= 60) return '👍 양호! 추가 학습으로 더욱 발전하세요!';
    return '📚 더 많은 학습이 필요합니다. 다시 도전해보세요!';
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowExplanation(false);
    setIsAnswered(false);
    setScore(0);
    setQuizCompleted(false);
    setShowSectionSkipModal(false);
    setDraggedItem(null);
    setDropZoneAssignments({});
  };

  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-green-400 font-mono p-8">
        <div className="max-w-4xl mx-auto">
          {/* 홈으로 가기 버튼 */}
          <div className="mb-4">
            <button
              onClick={onGoHome}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg
                       hover:bg-gray-600 transition-all duration-300"
            >
              <Home className="w-4 h-4" />
              홈으로 가기
            </button>
          </div>
          
          <div className="text-center">
            <div className="text-6xl mb-8">🎯</div>
            <h1 className="text-4xl font-bold text-yellow-400 mb-6">퀴즈 챌린지 완료!</h1>
            
            <div className="bg-black/50 backdrop-blur-sm border border-green-500/30 rounded-lg p-8 mb-8">
              <div className="text-6xl mb-4">
                {score >= 12 ? '🏆' : score >= 9 ? '🥈' : '🥉'}
              </div>
              <div className={`text-4xl font-bold mb-4 ${getScoreColor()}`}>
                {score} / {quizQuestions.length}
              </div>
              <div className="text-xl text-green-300 mb-4">
                {getScoreMessage()}
              </div>
              <div className="text-lg text-yellow-300">
                정답률: {Math.round((score / quizQuestions.length) * 100)}%
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 다시 도전 */}
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-yellow-400 mb-4">다시 도전하기</h2>
                <p className="text-green-300 text-lg mb-4">
                  더 높은 점수를 목표로 다시 도전해보세요!
                </p>
                <button 
                  onClick={handleRetry}
                  className="w-full px-6 py-4 bg-gradient-to-r from-yellow-600 to-yellow-700 
                           border-2 border-yellow-400 rounded-lg text-white font-bold text-xl
                           hover:from-yellow-500 hover:to-yellow-600 hover:border-yellow-300
                           transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2">
                  <RotateCcw className="w-6 h-6" />
                  다시 도전
                </button>
              </div>
              
              {/* 실전 시나리오 */}
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-blue-400 mb-4">다음 단계: 실전 시나리오</h2>
                <p className="text-green-300 text-lg mb-4">
                  이제 실제 사이버 보안 인시던트 대응 시나리오가 시작됩니다!
                </p>
                <button className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 
                               border-2 border-blue-400 rounded-lg text-white font-bold text-xl
                               hover:from-blue-500 hover:to-blue-600 hover:border-blue-300
                               transform hover:scale-105 transition-all duration-300">
                  🚀 실전 시나리오 시작
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-green-400 font-mono p-8">
      <div className="max-w-6xl mx-auto">
        {/* 홈으로 가기 버튼 */}
        <div className="mb-4">
          <div className="flex gap-4">
            <button
              onClick={onGoHome}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg
                       hover:bg-gray-600 transition-all duration-300"
            >
              <Home className="w-4 h-4" />
              홈으로 가기
            </button>
            <button
              onClick={handleSkipSection}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg
                       hover:bg-yellow-700 transition-all duration-300"
            >
              <AlertTriangle className="w-4 h-4" />
              퀴즈 건너뛰고 실전 모의훈련으로
            </button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Brain className="w-6 h-6 text-yellow-400" />
              <span className="text-yellow-400 font-bold text-xl">지식 점검 퀴즈</span>
            </div>
            <div className="flex items-center gap-2 text-green-300">
              <Target className="w-5 h-5" />
              <span>{currentQuestion + 1} / {quizQuestions.length}</span>
            </div>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-right text-sm text-green-300 mt-1">
            {Math.round(progress)}% 완료
          </div>
        </div>

        {/* Question */}
        <div className="bg-black/50 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-8 mb-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-yellow-500 text-black rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg">
              {currentQuestion + 1}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-yellow-400 mb-4 leading-relaxed whitespace-pre-line">
                {question.question}
              </h2>
              
              {/* Multiple Choice */}
              {question.type === 'multiple-choice' && (
                <div className="space-y-3">
                  {question.options?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(option)}
                      disabled={isAnswered}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-300
                        ${isAnswered 
                          ? option === question.correctAnswer
                            ? 'border-green-500 bg-green-900/30 text-green-300'
                            : answers[question.id] === option
                              ? 'border-red-500 bg-red-900/30 text-red-300'
                              : 'border-gray-600 bg-gray-800/30 text-gray-400'
                          : 'border-gray-600 bg-gray-800/30 hover:border-yellow-400 hover:bg-yellow-900/20'
                        } disabled:cursor-not-allowed`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-sm">
                          {String.fromCharCode(65 + index)}
                        </span>
                        {option}
                        {isAnswered && option === question.correctAnswer && (
                          <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                        )}
                        {isAnswered && answers[question.id] === option && option !== question.correctAnswer && (
                          <XCircle className="w-5 h-5 text-red-400 ml-auto" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* O/X Quiz */}
              {question.type === 'ox' && (
                <div className="flex gap-4">
                  {['O', 'X'].map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      disabled={isAnswered}
                      className={`flex-1 p-6 rounded-lg border-2 transition-all duration-300 text-2xl font-bold
                        ${isAnswered 
                          ? option === question.correctAnswer
                            ? 'border-green-500 bg-green-900/30 text-green-300'
                            : answers[question.id] === option
                              ? 'border-red-500 bg-red-900/30 text-red-300'
                              : 'border-gray-600 bg-gray-800/30 text-gray-400'
                          : 'border-gray-600 bg-gray-800/30 hover:border-yellow-400 hover:bg-yellow-900/20'
                        } disabled:cursor-not-allowed`}
                    >
                      {option}
                      {isAnswered && option === question.correctAnswer && (
                        <CheckCircle className="w-6 h-6 text-green-400 mx-auto mt-2" />
                      )}
                      {isAnswered && answers[question.id] === option && option !== question.correctAnswer && (
                        <XCircle className="w-6 h-6 text-red-400 mx-auto mt-2" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Text Input */}
              {question.type === 'text-input' && (
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="답을 입력하세요..."
                    disabled={isAnswered}
                    className="w-full p-4 bg-gray-800 border-2 border-gray-600 rounded-lg text-green-300 
                             focus:border-yellow-400 focus:outline-none disabled:opacity-50"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !isAnswered) {
                        handleAnswer((e.target as HTMLInputElement).value);
                      }
                    }}
                  />
                  {!isAnswered && (
                    <button
                      onClick={() => {
                        const input = document.querySelector('input') as HTMLInputElement;
                        if (input?.value) handleAnswer(input.value);
                      }}
                      className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      답안 제출
                    </button>
                  )}
                </div>
              )}

              {/* Drag and Drop */}
              {question.type === 'drag-drop' && (
                <div className="space-y-6">
                  {/* Drag Items */}
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <h3 className="text-lg font-bold text-cyan-400 mb-3">정보 조각들:</h3>
                    <div className="flex flex-wrap gap-3">
                      {question.dragItems?.map((item) => {
                        const isUsed = Object.values(dropZoneAssignments).includes(item.id);
                        return (
                          <div
                            key={item.id}
                            draggable={!isAnswered && !isUsed}
                            onDragStart={(e) => handleDragStart(e, item.id)}
                            className={`px-4 py-2 rounded-lg border-2 cursor-move transition-all duration-300
                              ${isUsed 
                                ? 'border-gray-600 bg-gray-700 text-gray-400 cursor-not-allowed opacity-50'
                                : isAnswered
                                  ? 'border-gray-600 bg-gray-700 text-gray-300 cursor-not-allowed'
                                  : 'border-cyan-400 bg-cyan-900/30 text-cyan-300 hover:bg-cyan-800/50'
                              }`}
                          >
                            {item.text}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Drop Zones */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {question.dropZones?.map((zone) => {
                      const assignedItem = dropZoneAssignments[zone.id];
                      const assignedItemText = question.dragItems?.find(item => item.id === assignedItem)?.text;
                      const isCorrect = isAnswered && assignedItem === zone.correctItem;
                      const isIncorrect = isAnswered && assignedItem && assignedItem !== zone.correctItem;
                      
                      return (
                        <div
                          key={zone.id}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, zone.id)}
                          className={`p-4 rounded-lg border-2 border-dashed min-h-[100px] flex flex-col justify-center
                            transition-all duration-300
                            ${isCorrect 
                              ? 'border-green-500 bg-green-900/30'
                              : isIncorrect
                                ? 'border-red-500 bg-red-900/30'
                                : assignedItem
                                  ? 'border-yellow-400 bg-yellow-900/20'
                                  : 'border-gray-500 bg-gray-800/30 hover:border-yellow-400'
                            }`}
                        >
                          <div className="text-center">
                            <div className="font-bold text-yellow-300 mb-2">{zone.label}</div>
                            {assignedItemText ? (
                              <div className={`px-3 py-1 rounded-lg inline-block
                                ${isCorrect 
                                  ? 'bg-green-600 text-white'
                                  : isIncorrect
                                    ? 'bg-red-600 text-white'
                                    : 'bg-yellow-600 text-white'
                                }`}>
                                {assignedItemText}
                                {isCorrect && <CheckCircle className="w-4 h-4 inline ml-2" />}
                                {isIncorrect && <XCircle className="w-4 h-4 inline ml-2" />}
                              </div>
                            ) : (
                              <div className="text-gray-400 text-sm">여기에 끌어다 놓으세요</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className="bg-black/50 backdrop-blur-sm border border-blue-500/30 rounded-lg p-6 mb-6 animate-fade-in">
            <h3 className="text-xl font-bold text-blue-400 mb-3 flex items-center gap-2">
              <Target className="w-5 h-5" />
              해설
            </h3>
            <p className="text-green-200 leading-relaxed">{question.explanation}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg
                     hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            이전 문제
          </button>

          <div className="flex flex-col items-center gap-2">
            <div className="text-green-300 text-lg">
              현재 점수: <span className="font-bold text-yellow-400">{score}</span> / {currentQuestion + (isAnswered ? 1 : 0)}
            </div>
          </div>

          <button
            onClick={nextQuestion}
            disabled={false}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg
                     hover:bg-green-700
                     transition-all duration-300"
          >
            {currentQuestion === quizQuestions.length - 1 ? '결과 보기' : '다음 문제'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Section Skip Warning Modal */}
        <WarningModal
          isOpen={showSectionSkipModal}
          onClose={() => setShowSectionSkipModal(false)}
          onConfirm={confirmSectionSkip}
          title="퀴즈 섹션 건너뛰기"
          message="퀴즈를 건너뛰고 바로 실전 모의훈련으로 이동하시겠습니까? 퀴즈를 건너뛰면 '대응 리더' 배지를 획득할 수 없습니다."
        />
      </div>
    </div>
  );
};