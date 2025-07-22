import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Timer } from './Timer';
import { 
  Shield, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  Target,
  Home,
  ArrowLeft,
  Play
} from 'lucide-react';

interface Scenario {
  id: number;
  title: string;
  priority: string;
  role: string;
  situation: string;
  flow: string;
  result: string;
}

const scenarios: Scenario[] = [
  {
    id: 1,
    title: "랜섬웨어 감염",
    priority: "P1",
    role: "현장 조치 담당자",
    situation: "재무팀 PC가 랜섬웨어에 감염되어 모든 회계 문서가 암호화되었고, 업무가 중단되었습니다. 화면에는 데이터를 공개하겠다는 협박 메시지와 함께 비트코인을 요구하는 랜섬노트가 떠 있습니다.",
    flow: "1단계: EDR P1 경보 확인 (FIN-PC-07 랜섬웨어 탐지) → 2단계: 현장 증거 보존 (PC 전원 유지, 화면 촬영) → 3단계: 네트워크 케이블 물리적 분리 → 4단계: 메모리 덤프 수집 (volatility 도구 사용) → 5단계: SIEM 쿼리 작성하여 최초 감염 경로 추적 → 6단계: 악성 파일 해시값 TIP 조회 → 7단계: '랜섬웨어 초기 대응' 플레이북 실행 → 8단계: 침해사고분석팀 이관",
    result: "감염된 PC가 네트워크에서 격리되어 랜섬웨어의 내부 확산이 차단되었습니다. 확보된 메모리 덤프와 악성 파일은 심층 분석을 위해 침해사고분석팀으로 이관되었습니다."
  }
];

const ScenarioTraining: React.FC = () => {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  const navigate = useNavigate();
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null);

  useEffect(() => {
    if (scenarioId) {
      const scenario = scenarios.find(s => s.id === parseInt(scenarioId));
      setCurrentScenario(scenario || null);
    }
  }, [scenarioId]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P1': return 'text-red-400 bg-red-900/30 border-red-500';
      case 'P2': return 'text-orange-400 bg-orange-900/30 border-orange-500';
      case 'P3': return 'text-yellow-400 bg-yellow-900/30 border-yellow-500';
      default: return 'text-gray-400 bg-gray-900/30 border-gray-500';
    }
  };

  if (!currentScenario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex items-center justify-center">
        <div className="text-center">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative overflow-hidden">
      {/* Timer */}
      <Timer initialMinutes={10} />
      
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
              onClick={() => navigate('/courses')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg
                       hover:bg-blue-700 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              코스 선택으로 돌아가기
            </button>
          </div>
        </div>

        {/* 시나리오 헤더 */}
        <div className="bg-black/50 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-yellow-400">
              시나리오 {currentScenario.id}: {currentScenario.title}
            </h1>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-bold">10분</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-lg border text-sm font-bold ${getPriorityColor(currentScenario.priority)}`}>
              {currentScenario.priority} 긴급
            </span>
            <span className="text-cyan-400">
              역할: {currentScenario.role}
            </span>
          </div>
        </div>

        {/* 상황 정보 */}
        <div className="bg-black/50 backdrop-blur-sm border border-red-500/30 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <h2 className="text-2xl font-bold text-red-400">상황 정보</h2>
          </div>
          <p className="text-green-200 leading-relaxed">
            {currentScenario.situation}
          </p>
        </div>

        {/* 대응 흐름 */}
        <div className="bg-black/50 backdrop-blur-sm border border-blue-500/30 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-blue-400">대응 흐름</h2>
          </div>
          <p className="text-green-200 leading-relaxed">
            {currentScenario.flow}
          </p>
        </div>

        {/* 대응 결과 */}
        <div className="bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold text-purple-400">대응 결과</h2>
          </div>
          <p className="text-green-200 leading-relaxed">
            {currentScenario.result}
          </p>
        </div>

        {/* 시작 버튼 */}
        <div className="text-center">
          <button className="w-full max-w-md px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 
                           border-2 border-blue-400 rounded-lg text-white font-bold text-xl
                           hover:from-blue-500 hover:to-blue-600 hover:border-blue-300
                           transition-all duration-300 flex items-center justify-center gap-2 mx-auto">
            <Play className="w-6 h-6" />
            모의훈련 {currentScenario.id} 시작
          </button>
        </div>

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
        <div className="absolute top-3/4 left-1/5 w-1 h-1 bg-cyan-400 rounded-full animate-pulse opacity-25"></div>
        <div className="absolute top-1/6 right-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping opacity-20"></div>
      </div>
    </div>
  );
};

export default ScenarioTraining;