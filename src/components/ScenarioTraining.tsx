import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Settings,
  ArrowRight,
  Monitor,
  Network,
  HardDrive,
  BookOpen,
  Phone
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

interface StepData {
  id: number;
  title: string;
  description: string;
  tool: string;
  content: any;
  expectedAction: string;
  successMessage: string;
  nextStepHint: string;
}

const ScenarioTraining = () => {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  const navigate = useNavigate();
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [courseType, setCourseType] = useState<'traditional' | 'nextgen' | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [stepCompleted, setStepCompleted] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  // 8단계 데이터 정의
  const trainingSteps: StepData[] = [
    {
      id: 1,
      title: "EDR P1 경보 확인",
      description: "FIN-PC-07에서 발생한 경보를 분석하여 가장 위험한 프로세스를 식별하세요",
      tool: "EDR",
      content: {
        alerts: [
          { id: 1, pc: "FIN-PC-07", process: "ransomware.exe", risk: "HIGH", time: "14:23:17", description: "실행 파일, 높은 CPU 사용률" },
          { id: 2, pc: "FIN-PC-07", process: "crypto.dll", risk: "HIGH", time: "14:23:18", description: "DLL 파일, 암호화 관련 API 호출" },
          { id: 3, pc: "FIN-PC-07", process: "explorer.exe", risk: "LOW", time: "14:23:15", description: "시스템 프로세스, 정상 동작" },
          { id: 4, pc: "FIN-PC-07", process: "notepad.exe", risk: "LOW", time: "14:20:10", description: "사용자 애플리케이션, 정상 동작" }
        ]
      },
      expectedAction: "ransomware.exe",
      successMessage: "정확한 분석입니다. 해당 프로세스가 주요 위협으로 확인되었습니다.",
      nextStepHint: "증거 보존이 필요합니다."
    },
    {
      id: 2,
      title: "현장 증거 보존",
      description: "현재 상황에서 가장 중요한 증거를 보존하는 방법을 선택하세요",
      tool: "물리적 조치",
      content: {
        actions: [
          { id: 1, action: "PC 전원 끄기", description: "시스템 종료로 추가 피해 방지", correct: false },
          { id: 2, action: "화면 촬영", description: "현재 화면 상태 기록", correct: true },
          { id: 3, action: "재부팅", description: "시스템 재시작으로 정상화", correct: false },
          { id: 4, action: "백신 실행", description: "악성코드 즉시 제거", correct: false }
        ]
      },
      expectedAction: "화면 촬영",
      successMessage: "올바른 선택입니다. 중요한 증거가 보존되었습니다.",
      nextStepHint: "확산 방지 조치가 필요합니다."
    },
    {
      id: 3,
      title: "네트워크 케이블 물리적 분리",
      description: "감염 확산을 방지하기 위한 가장 효과적인 격리 방법을 선택하세요",
      tool: "물리적 조치",
      content: {
        actions: [
          { id: 1, action: "네트워크 케이블 분리", description: "물리적 연결 차단", correct: true },
          { id: 2, action: "Wi-Fi 비활성화", description: "무선 연결 해제", correct: false },
          { id: 3, action: "방화벽 설정", description: "소프트웨어적 차단", correct: false },
          { id: 4, action: "네트워크 드라이버 제거", description: "드라이버 수준 차단", correct: false }
        ]
      },
      expectedAction: "네트워크 케이블 분리",
      successMessage: "효과적인 격리 조치입니다. 확산이 차단되었습니다.",
      nextStepHint: "휘발성 증거 수집이 필요합니다."
    },
    {
      id: 4,
      title: "메모리 덤프 수집",
      description: "현재 상황에서 휘발성 증거를 수집하기 위한 적절한 도구를 선택하세요",
      tool: "포렌식 도구",
      content: {
        tools: [
          { id: 1, tool: "volatility", description: "메모리 분석 및 덤프 도구", correct: true },
          { id: 2, tool: "wireshark", description: "네트워크 패킷 분석 도구", correct: false },
          { id: 3, tool: "autopsy", description: "디스크 포렌식 분석 도구", correct: false },
          { id: 4, tool: "hashcalc", description: "파일 해시 계산 도구", correct: false }
        ]
      },
      expectedAction: "volatility",
      successMessage: "적절한 도구 선택입니다. 메모리 증거가 확보되었습니다.",
      nextStepHint: "감염 경로 분석이 필요합니다."
    },
    {
      id: 5,
      title: "SIEM 쿼리 작성하여 최초 감염 경로 추적",
      description: "FIN-PC-07의 감염 경로를 찾기 위한 가장 적절한 검색 조건을 선택하세요",
      tool: "SIEM",
      content: {
        queries: [
          { id: 1, query: 'source="email" AND dest="FIN-PC-07" AND attachment="*.exe"', description: "이메일 첨부파일 검색", correct: true },
          { id: 2, query: 'source="web" AND dest="FIN-PC-07"', description: "웹 접속 기록 검색", correct: false },
          { id: 3, query: 'source="usb" AND dest="FIN-PC-07"', description: "USB 연결 기록 검색", correct: false },
          { id: 4, query: 'source="network" AND dest="FIN-PC-07"', description: "네트워크 연결 검색", correct: false }
        ]
      },
      expectedAction: 'source="email" AND dest="FIN-PC-07" AND attachment="*.exe"',
      successMessage: "효과적인 쿼리입니다. 감염 경로가 확인되었습니다.",
      nextStepHint: "위협 정보 확인이 필요합니다."
    },
    {
      id: 6,
      title: "악성 파일 해시값 TIP 조회",
      description: "위협 정보를 확인하기 위해 조회할 파일을 선택하세요",
      tool: "TIP",
      content: {
        hashes: [
          { id: 1, hash: "a1b2c3d4e5f6789012345678901234567890abcd", file: "ransomware.exe", description: "의심 프로세스 파일", correct: true },
          { id: 2, hash: "1234567890abcdef1234567890abcdef12345678", file: "explorer.exe", description: "시스템 프로세스 파일", correct: false },
          { id: 3, hash: "abcdef1234567890abcdef1234567890abcdef12", file: "system32.dll", description: "시스템 라이브러리 파일", correct: false },
          { id: 4, hash: "fedcba0987654321fedcba0987654321fedcba09", file: "notepad.exe", description: "사용자 애플리케이션 파일", correct: false }
        ]
      },
      expectedAction: "a1b2c3d4e5f6789012345678901234567890abcd",
      successMessage: "정확한 선택입니다. 위협 정보가 확인되었습니다.",
      nextStepHint: "대응 절차 실행이 필요합니다."
    },
    {
      id: 7,
      title: "랜섬웨어 초기 대응 플레이북 실행",
      description: "현재 상황에 가장 적합한 대응 절차를 선택하세요",
      tool: "SOAR",
      content: {
        playbooks: [
          { id: 1, name: "랜섬웨어 초기 대응", description: "격리, 백업 확인, 복구 준비", correct: true },
          { id: 2, name: "DDoS 공격 대응", description: "트래픽 차단, 서버 보호", correct: false },
          { id: 3, name: "피싱 메일 대응", description: "계정 잠금, 패스워드 변경", correct: false },
          { id: 4, name: "내부자 위협 대응", description: "계정 모니터링, 접근 제한", correct: false }
        ]
      },
      expectedAction: "랜섬웨어 초기 대응",
      successMessage: "적절한 대응 절차입니다. 플레이북이 실행되었습니다.",
      nextStepHint: "전문팀 이관이 필요합니다."
    },
    {
      id: 8,
      title: "침해사고분석팀 이관",
      description: "현재 상황을 처리하기에 가장 적합한 전문팀을 선택하세요",
      tool: "커뮤니케이션",
      content: {
        teams: [
          { id: 1, team: "침해사고분석팀", description: "심층 분석 및 복구 전문", correct: true },
          { id: 2, team: "네트워크팀", description: "네트워크 보안 강화 전문", correct: false },
          { id: 3, team: "개발팀", description: "시스템 개발 및 유지보수", correct: false },
          { id: 4, team: "법무팀", description: "법적 대응 및 컴플라이언스", correct: false }
        ]
      },
      expectedAction: "침해사고분석팀",
      successMessage: "올바른 선택입니다. 전문팀으로 이관되었습니다.",
      nextStepHint: "초동대응이 완료되었습니다."
    }
  ];

  useEffect(() => {
    if (scenarioId) {
      const id = parseInt(scenarioId);
      
      const traditionalScenario = traditionalScenarios.find(s => s.id === id);
      if (traditionalScenario) {
        setScenario(traditionalScenario);
        setCourseType('traditional');
        return;
      }
      
      const nextGenScenario = nextGenScenarios.find(s => s.id === id);
      if (nextGenScenario) {
        setScenario(nextGenScenario);
        setCourseType('nextgen');
        return;
      }
      
      navigate('/courses');
    }
  }, [scenarioId, navigate]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P1': 
        return 'text-red-400 bg-red-900/30 border-red-500';
      case 'P2': 
        return 'text-orange-400 bg-orange-900/30 border-orange-500';
      case 'P3': 
        return 'text-yellow-400 bg-yellow-900/30 border-yellow-500';
      default: 
        return 'text-gray-400 bg-gray-900/30 border-gray-500';
    }
  };

  const handleStartTraining = () => {
    setIsStarted(true);
    addChatMessage("상황실장: 훈련을 시작합니다. 첫 번째 단계를 진행하세요.");
  };

  const addChatMessage = (message: string) => {
    setChatMessages(prev => [...prev, `${new Date().toLocaleTimeString()} - ${message}`]);
  };

  const handleStepAction = (action: string) => {
    const currentStepData = trainingSteps[currentStep - 1];
    setSelectedItem(action);
    setAttemptCount(prev => prev + 1);
    
    if (action === currentStepData.expectedAction) {
      setStepCompleted(true);
      // 시도 횟수에 따른 점수 차등 부여
      const stepScore = attemptCount === 0 ? 100 : attemptCount === 1 ? 80 : attemptCount === 2 ? 60 : 40;
      setScore(prev => prev + stepScore);
      
      // 단계별 분석 결과 설정
      switch (currentStep) {
        case 1:
          setAnalysisResult({
            processName: "ransomware.exe",
            riskLevel: "HIGH",
            description: "WannaCry 변종 랜섬웨어 프로세스 탐지",
            actions: ["파일 암호화 시도", "네트워크 스캔", "레지스트리 수정"]
          });
          break;
        case 2:
          setAnalysisResult({
            evidenceType: "화면 캡처",
            location: "FIN-PC-07",
            content: "랜섬노트 메시지 및 암호화된 파일 목록",
            timestamp: "2024-01-15 14:25:30"
          });
          break;
        case 3:
          setAnalysisResult({
            networkStatus: "격리됨",
            method: "물리적 케이블 분리",
            result: "랜섬웨어 확산 차단 완료"
          });
          break;
        case 4:
          setAnalysisResult({
            dumpFile: "FIN-PC-07_memory_dump.raw",
            size: "8GB",
            processes: ["ransomware.exe", "crypto.dll", "winlogon.exe"],
            networkConnections: ["203.0.113.45:443", "198.51.100.77:80"]
          });
          break;
        case 5:
          setAnalysisResult({
            query: currentStepData.expectedAction,
            results: "이메일 첨부파일 (invoice.exe) 실행 확인",
            sourceIP: "203.0.113.45",
            timestamp: "2024-01-15 14:20:15"
          });
          break;
        case 6:
          setAnalysisResult({
            hash: currentStepData.expectedAction,
            malwareFamily: "WannaCry 변종",
            threatLevel: "High",
            firstSeen: "2024-01-10",
            description: "파일 암호화 및 비트코인 요구"
          });
          break;
        case 7:
          setAnalysisResult({
            playbookName: "랜섬웨어 초기 대응",
            actions: ["시스템 격리", "백업 확인", "복구 계획 수립"],
            status: "실행 중",
            estimatedTime: "30분"
          });
          break;
        case 8:
          setAnalysisResult({
            transferredTo: "침해사고분석팀",
            ticketNumber: "INC-2024-0115-001",
            evidence: ["메모리 덤프", "화면 캡처", "로그 분석 결과"],
            nextSteps: "심층 분석 및 복구 작업"
          });
          break;
      }
      
      addChatMessage(`상황실장: ${currentStepData.successMessage}`);
      
      if (currentStep < 8 && !showHint) {
        addChatMessage(`상황실장: ${currentStepData.nextStepHint}`);
      } else {
        addChatMessage("상황실장: 모든 초동대응이 완료되었습니다. 훌륭한 대응이었습니다!");
      }
    } else {
      addChatMessage("상황실장: 다시 시도해보세요. 올바른 선택이 아닙니다.");
      
      // 3번 틀리면 힌트 제공
      if (attemptCount >= 2 && !showHint) {
        setShowHint(true);
        addChatMessage("상황실장: 힌트 - 위험도가 높고 실행 파일 형태인 프로세스를 찾아보세요.");
      }
    }
    
    // 선택 후 3초 뒤에 선택 상태 초기화
    setTimeout(() => setSelectedItem(null), 3000);
  };

  const handleNextStep = () => {
    if (currentStep < 8) {
      setCurrentStep(prev => prev + 1);
      setStepCompleted(false);
      setAnalysisResult(null);
      setSelectedItem(null);
      setShowHint(false);
      setAttemptCount(0);
      addChatMessage(`상황실장: ${currentStep + 1}단계를 시작합니다.`);
    } else {
      setIsCompleted(true);
    }
  };

  const handleTimeUp = () => {
    setTimeUp(true);
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

  const renderStepContent = () => {
    const stepData = trainingSteps[currentStep - 1];
    
    return (
      <div className="bg-black/50 backdrop-blur-sm border border-blue-500/30 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          {stepData.tool === 'EDR' && <Eye className="w-6 h-6 text-purple-400" />}
          {stepData.tool === '물리적 조치' && <Monitor className="w-6 h-6 text-red-400" />}
          {stepData.tool === '포렌식 도구' && <HardDrive className="w-6 h-6 text-green-400" />}
          {stepData.tool === 'SIEM' && <Database className="w-6 h-6 text-cyan-400" />}
          {stepData.tool === 'TIP' && <Search className="w-6 h-6 text-yellow-400" />}
          {stepData.tool === 'SOAR' && <Zap className="w-6 h-6 text-orange-400" />}
          {stepData.tool === '커뮤니케이션' && <Phone className="w-6 h-6 text-blue-400" />}
          <h3 className="text-2xl font-bold text-white">{stepData.tool} 도구</h3>
        </div>

        <p className="text-green-200 text-lg mb-6">{stepData.description}</p>

        {/* 단계별 콘텐츠 렌더링 */}
        {currentStep === 1 && (
          <div className="space-y-4">
            {selectedItem && <div className="mb-4 p-3 bg-blue-900/30 border border-blue-500 rounded-lg text-blue-300">선택된 프로세스: <span className="font-bold text-white">{selectedItem}</span></div>}
            <h4 className="text-purple-400 font-bold text-lg">탐지된 프로세스 목록</h4>
            <p className="text-gray-300 text-sm mb-4">각 프로세스의 정보를 분석하여 가장 위험한 프로세스를 선택하세요.</p>
            {stepData.content.alerts.map((alert: any) => (
              <div
                key={alert.id}
                onClick={() => handleStepAction(alert.process)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                  selectedItem === alert.process ? 'border-yellow-400 bg-yellow-900/30' : alert.risk === 'HIGH' 
                    ? 'border-red-500 bg-red-900/20 hover:bg-red-800/30' 
                    : 'border-gray-500 bg-gray-800/20 hover:bg-gray-700/30'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white">{alert.process}</div>
                    <div className="text-sm text-gray-400">{alert.description}</div>
                    <div className="text-sm text-gray-300">PC: {alert.pc}</div>
                  </div>
                  <div className="text-right">
                    <div className={`px-2 py-1 rounded text-xs font-bold ${
                      alert.risk === 'HIGH' ? 'bg-red-600 text-white' : 'bg-gray-600 text-gray-200'
                    }`}>
                      {alert.risk}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">{alert.time}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            {selectedItem && <div className="mb-4 p-3 bg-blue-900/30 border border-blue-500 rounded-lg text-blue-300">선택된 조치: <span className="font-bold text-white">{selectedItem}</span></div>}
            <h4 className="text-red-400 font-bold text-lg">가능한 조치</h4>
            <p className="text-gray-300 text-sm mb-4">현재 상황에서 증거 보존을 위한 최적의 방법을 선택하세요.</p>
            {stepData.content.actions.map((action: any) => (
              <button
                key={action.id}
                onClick={() => handleStepAction(action.action)}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                  selectedItem === action.action ? 'border-yellow-400 bg-yellow-900/30' : 'border-red-500 bg-red-900/20'
                } hover:bg-red-800/30`}
              >
                <div className="font-bold text-white">{action.action}</div>
                <div className="text-sm text-gray-300 mt-1">{action.description}</div>
              </button>
            ))}
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            {selectedItem && <div className="mb-4 p-3 bg-blue-900/30 border border-blue-500 rounded-lg text-blue-300">선택된 방법: <span className="font-bold text-white">{selectedItem}</span></div>}
            <h4 className="text-red-400 font-bold text-lg">격리 방법</h4>
            <p className="text-gray-300 text-sm mb-4">감염 확산을 방지하기 위한 가장 효과적인 방법을 선택하세요.</p>
            {stepData.content.actions.map((action: any) => (
              <button
                key={action.id}
                onClick={() => handleStepAction(action.action)}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                  selectedItem === action.action ? 'border-yellow-400 bg-yellow-900/30' : 'border-red-500 bg-red-900/20'
                } hover:bg-red-800/30`}
              >
                <div className="font-bold text-white">{action.action}</div>
                <div className="text-sm text-gray-300 mt-1">{action.description}</div>
              </button>
            ))}
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            {selectedItem && <div className="mb-4 p-3 bg-blue-900/30 border border-blue-500 rounded-lg text-blue-300">선택된 도구: <span className="font-bold text-white">{selectedItem}</span></div>}
            <h4 className="text-green-400 font-bold text-lg">포렌식 도구 선택</h4>
            <p className="text-gray-300 text-sm mb-4">휘발성 증거 수집에 가장 적합한 도구를 선택하세요.</p>
            {stepData.content.tools.map((tool: any) => (
              <button
                key={tool.id}
                onClick={() => handleStepAction(tool.tool)}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                  selectedItem === tool.tool ? 'border-yellow-400 bg-yellow-900/30' : 'border-green-500 bg-green-900/20'
                } hover:bg-green-800/30`}
              >
                <div className="font-bold text-white">{tool.tool}</div>
                <div className="text-sm text-gray-300">{tool.description}</div>
              </button>
            ))}
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-4">
            {selectedItem && <div className="mb-4 p-3 bg-blue-900/30 border border-blue-500 rounded-lg text-blue-300">선택된 쿼리: <span className="font-mono text-sm text-white">{selectedItem}</span></div>}
            <h4 className="text-cyan-400 font-bold text-lg">SIEM 쿼리 선택</h4>
            <p className="text-gray-300 text-sm mb-4">감염 경로를 추적하기 위한 최적의 검색 조건을 선택하세요.</p>
            {stepData.content.queries.map((query: any) => (
              <button
                key={query.id}
                onClick={() => handleStepAction(query.query)}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                  selectedItem === query.query ? 'border-yellow-400 bg-yellow-900/30' : 'border-cyan-500 bg-cyan-900/20'
                } hover:bg-cyan-800/30`}
              >
                <div className="text-sm text-gray-300 mb-1">{query.description}</div>
                <div className="font-mono text-sm text-white">{query.query}</div>
              </button>
            ))}
          </div>
        )}

        {currentStep === 6 && (
          <div className="space-y-4">
            {selectedItem && <div className="mb-4 p-3 bg-blue-900/30 border border-blue-500 rounded-lg text-blue-300">선택된 해시: <span className="font-mono text-sm text-white">{selectedItem}</span></div>}
            <h4 className="text-yellow-400 font-bold text-lg">파일 해시 선택</h4>
            <p className="text-gray-300 text-sm mb-4">위협 정보 확인을 위해 조회할 파일을 선택하세요.</p>
            {stepData.content.hashes.map((hash: any) => (
              <button
                key={hash.id}
                onClick={() => handleStepAction(hash.hash)}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                  selectedItem === hash.hash ? 'border-yellow-400 bg-yellow-900/30' : 'border-yellow-500 bg-yellow-900/20'
                } hover:bg-yellow-800/30`}
              >
                <div className="font-bold text-white">{hash.file}</div>
                <div className="text-sm text-gray-300 mb-1">{hash.description}</div>
                <div className="font-mono text-xs text-gray-300">{hash.hash}</div>
              </button>
            ))}
          </div>
        )}

        {currentStep === 7 && (
          <div className="space-y-4">
            {selectedItem && <div className="mb-4 p-3 bg-blue-900/30 border border-blue-500 rounded-lg text-blue-300">선택된 플레이북: <span className="font-bold text-white">{selectedItem}</span></div>}
            <h4 className="text-orange-400 font-bold text-lg">대응 플레이북 선택</h4>
            <p className="text-gray-300 text-sm mb-4">현재 상황에 가장 적합한 대응 절차를 선택하세요.</p>
            {stepData.content.playbooks.map((playbook: any) => (
              <button
                key={playbook.id}
                onClick={() => handleStepAction(playbook.name)}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                  selectedItem === playbook.name ? 'border-yellow-400 bg-yellow-900/30' : 'border-orange-500 bg-orange-900/20'
                } hover:bg-orange-800/30`}
              >
                <div className="font-bold text-white">{playbook.name}</div>
                <div className="text-sm text-gray-300">{playbook.description}</div>
              </button>
            ))}
          </div>
        )}

        {currentStep === 8 && (
          <div className="space-y-4">
            {selectedItem && <div className="mb-4 p-3 bg-blue-900/30 border border-blue-500 rounded-lg text-blue-300">선택된 팀: <span className="font-bold text-white">{selectedItem}</span></div>}
            <h4 className="text-blue-400 font-bold text-lg">이관 대상 팀 선택</h4>
            <p className="text-gray-300 text-sm mb-4">현재 상황을 처리하기에 가장 적합한 전문팀을 선택하세요.</p>
            {stepData.content.teams.map((team: any) => (
              <button
                key={team.id}
                onClick={() => handleStepAction(team.team)}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                  selectedItem === team.team ? 'border-yellow-400 bg-yellow-900/30' : 'border-blue-500 bg-blue-900/20'
                } hover:bg-blue-800/30`}
              >
                <div className="font-bold text-white">{team.team}</div>
                <div className="text-sm text-gray-300">{team.description}</div>
              </button>
            ))}
          </div>
        )}

        {/* 힌트 표시 */}
        {showHint && (
          <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
            <h4 className="text-yellow-400 font-bold text-sm mb-2">💡 힌트</h4>
            <p className="text-yellow-200 text-sm">위험도가 높고 실행 파일 형태인 프로세스를 찾아보세요.</p>
          </div>
        )}

        {/* 분석 결과 표시 */}
        {analysisResult && (
          <div className="mt-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
            <h4 className="text-green-400 font-bold text-lg mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              분석 결과
            </h4>
            <div className="mb-3 text-green-300 text-sm">
              획득 점수: +{attemptCount === 0 ? 100 : attemptCount === 1 ? 80 : attemptCount === 2 ? 60 : 40}점
            </div>
            <div className="space-y-2 text-sm">
              {Object.entries(analysisResult).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                  <span className="text-white font-mono">
                    {Array.isArray(value) ? value.join(', ') : String(value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 다음 단계 버튼 */}
        {stepCompleted && (
          <div className="mt-6 text-center">
            <button
              onClick={handleNextStep}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 
                       border-2 border-green-400 rounded-lg text-white font-bold text-xl
                       hover:from-green-500 hover:to-green-600 hover:border-green-300
                       transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
            >
              {currentStep < 8 ? (
                <>
                  다음 단계로
                  <ArrowRight className="w-6 h-6" />
                </>
              ) : (
                <>
                  훈련 완료
                  <CheckCircle className="w-6 h-6" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    );
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

        {!isStarted ? (
          /* 시나리오 브리핑 */
          <div className="max-w-4xl mx-auto">
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

            {/* 8단계 진행 과정 */}
            <div className="bg-black/50 backdrop-blur-sm border border-blue-500/30 rounded-lg p-6 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-blue-400" />
                <h3 className="text-2xl font-bold text-blue-400">8단계 대응 과정</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trainingSteps.map((step, index) => (
                  <div key={step.id} className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {step.id}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{step.title}</div>
                      <div className="text-xs text-gray-400">{step.tool}</div>
                    </div>
                  </div>
                ))}
              </div>
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
                8단계 모의훈련 시작
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
            <h2 className="text-4xl font-bold text-green-400 mb-6">8단계 훈련 완료!</h2>
            <div className="bg-black/50 backdrop-blur-sm border border-green-500/30 rounded-lg p-8 mb-8">
              <p className="text-green-200 text-xl mb-4">
                시나리오 {scenario.id}: {scenario.title} 훈련을 성공적으로 완료했습니다!
              </p>
              <div className="text-2xl font-bold text-yellow-400 mb-4">
                최종 점수: {score} / 800
              </div>
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
                  setCurrentStep(1);
                  setStepCompleted(false);
                  setAnalysisResult(null);
                  setChatMessages([]);
                  setSelectedItem(null);
                  setScore(0);
                  setAttemptCount(0);
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
          /* 단계별 훈련 화면 */
          <div className="max-w-6xl mx-auto">
            {/* 상단 정보 바 */}
            <div className="bg-black/50 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-bold text-yellow-400">
                    시나리오 {scenario.id}: {scenario.title}
                  </h1>
                  <span className={`px-3 py-1 rounded-lg border font-bold ${getPriorityColor(scenario.priority)}`}>
                    {scenario.priority} 긴급
                  </span>
                  <span className="text-cyan-400">역할: {scenario.role}</span>
                </div>
                <div className="text-green-400 font-bold">
                  점수: {score} / 800
                </div>
              </div>
            </div>

            {/* 진행 상황 */}
            <div className="bg-black/50 backdrop-blur-sm border border-blue-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-blue-400">진행 상황</h2>
                <span className="text-blue-400 font-bold">{currentStep} / 8</span>
              </div>
              <div className="flex gap-2">
                {Array.from({ length: 8 }, (_, i) => (
                  <div
                    key={i + 1}
                    className={`flex-1 h-3 rounded-full ${
                      i + 1 < currentStep
                        ? 'bg-green-500'
                        : i + 1 === currentStep
                        ? 'bg-yellow-500'
                        : 'bg-gray-600'
                    }`}
                  ></div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                {trainingSteps.map((step, index) => (
                  <span key={step.id} className={`${index + 1 === currentStep ? 'text-yellow-400 font-bold' : ''}`}>
                    {step.id}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 왼쪽: 현재 단계 */}
              <div className="lg:col-span-2">
                <div className="bg-black/50 backdrop-blur-sm border border-green-500/30 rounded-lg p-4 mb-6">
                  <h2 className="text-xl font-bold text-green-400 mb-4">
                    단계 {currentStep}: {trainingSteps[currentStep - 1].title}
                  </h2>
                </div>
                {renderStepContent()}
              </div>

              {/* 오른쪽: 팀 채팅 */}
              <div className="bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-5 h-5 text-purple-400" />
                  <h3 className="text-lg font-bold text-purple-400">팀 채팅</h3>
                </div>
                <div className="bg-gray-800 rounded-lg p-3 h-96 overflow-y-auto">
                  {chatMessages.map((msg, index) => (
                    <div key={index} className="mb-3 last:mb-0">
                      <div className="text-sm text-green-200">
                        {msg}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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