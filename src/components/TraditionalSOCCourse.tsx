import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Home, 
  ArrowLeft,
  Search,
  Database,
  Eye,
  Brain,
  FileText,
  Zap,
  Clock,
  Target,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Play
} from 'lucide-react';
import { Tooltip } from './Tooltip';
import { traditionalScenarios } from '../data/traditionalScenarios';

const TraditionalSOCCourse = () => {
  const navigate = useNavigate();
  const [showToolsSection, setShowToolsSection] = useState(false);
  const [showScenariosSection, setShowScenariosSection] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P1': return 'text-red-400 bg-red-900/30 border-red-500';
      case 'P2': return 'text-orange-400 bg-orange-900/30 border-orange-500';
      case 'P3': return 'text-yellow-400 bg-yellow-900/30 border-yellow-500';
      default: return 'text-gray-400 bg-gray-900/30 border-gray-500';
    }
  };

  const handleScenarioStart = (scenarioId: number) => {
    console.log(`시나리오 ${scenarioId} 시작`);
    // 시나리오 훈련 페이지로 이동
    navigate(`/scenario/${scenarioId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative overflow-hidden">
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

        {/* 코스 제목 */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-blue-600/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-blue-400" />
          </div>
          <h1 className="text-5xl font-bold text-blue-400 mb-4 tracking-wider glow-text">
            A코스: 전통적인 SOC
          </h1>
          <p className="text-green-200 text-xl max-w-4xl mx-auto leading-relaxed">
            AI의 도움 없이, 기본적인 보안 도구를 직접 다루며 데이터의 의미를 해석하는 능력을 기릅니다.
          </p>
          <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg max-w-4xl mx-auto">
            <p className="text-blue-300 text-lg">
              💡 <strong>안내:</strong> "모든 분석의 기본은 데이터입니다. 각 도구의 역할을 이해하고, 어떤 상황에서 어떤 도구를 사용해야 할지 익혀보세요."
            </p>
          </div>
        </div>

        {/* 핵심 SOC 도구 소개 */}
        <div className="mb-12">
          <div className="bg-black/50 backdrop-blur-sm border border-green-500/30 rounded-lg p-6">
            <button
              onClick={() => setShowToolsSection(!showToolsSection)}
              className="w-full flex items-center justify-between text-left hover:bg-green-500/10 p-2 rounded transition-colors"
            >
              <div className="flex items-center gap-3">
                <Search className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-bold text-green-400">핵심 SOC 도구 소개</h2>
              </div>
              {showToolsSection ? (
                <ChevronUp className="w-6 h-6 text-green-400" />
              ) : (
                <ChevronDown className="w-6 h-6 text-green-400" />
              )}
            </button>
            
            {showToolsSection && (
              <div className="mt-6 animate-fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* SIEM */}
                  <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-600/30">
                    <div className="flex items-center gap-3 mb-4">
                      <Database className="w-6 h-6 text-cyan-400" />
                      <h3 className="text-xl font-bold text-cyan-400">
                        <Tooltip text="SIEM" tooltip="Security Information and Event Management. 전사의 모든 보안 로그를 수집하고 분석하여 위협을 탐지하는 통합 보안 관제 시스템입니다." className="text-cyan-400" />
                      </h3>
                    </div>
                    <p className="text-green-200 mb-3">
                      <strong>역할:</strong> 모든 시스템의 로그를 수집, 검색, 분석하는 관제의 '두뇌'입니다.
                    </p>
                    <p className="text-green-200 text-sm">
                      <strong>사용법:</strong> 분석가는 공격의 흔적을 찾기 위해 쿼리 언어를 사용하여 방대한 로그 데이터베이스를 직접 검색해야 합니다. 가설을 세우고, 그 가설을 검증할 수 있는 정확한 쿼리를 작성하는 능력이 핵심입니다.
                    </p>
                  </div>

                  {/* EDR */}
                  <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-600/30">
                    <div className="flex items-center gap-3 mb-4">
                      <Eye className="w-6 h-6 text-purple-400" />
                      <h3 className="text-xl font-bold text-purple-400">
                        <Tooltip text="EDR" tooltip="Endpoint Detection and Response. 개별 PC나 서버 등 엔드포인트에서 발생하는 악성 행위를 실시간으로 탐지하고 대응하는 보안 솔루션입니다." className="text-purple-400" />
                      </h3>
                    </div>
                    <p className="text-green-200 mb-3">
                      <strong>역할:</strong> PC나 서버 같은 엔드포인트 내부를 상세히 들여다보는 '현미경'입니다.
                    </p>
                    <p className="text-green-200 text-sm">
                      <strong>사용법:</strong> 특정 시스템에 경보가 발생했을 때, 해당 시스템의 EDR 화면에 접속하여 실시간으로 프로세스 트리, 네트워크 연결, 파일 생성/삭제 이벤트를 수동으로 분석하여 악성 행위를 식별해야 합니다.
                    </p>
                  </div>

                  {/* TIP */}
                  <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-600/30">
                    <div className="flex items-center gap-3 mb-4">
                      <Brain className="w-6 h-6 text-yellow-400" />
                      <h3 className="text-xl font-bold text-yellow-400">
                        <Tooltip text="위협 인텔리전스 플랫폼 (TIP)" tooltip="Threat Intelligence Platform. 위협 인텔리전스 정보를 수집, 분석, 공유하여 알려진 위협을 식별하는 도구입니다." className="text-yellow-400" />
                      </h3>
                    </div>
                    <p className="text-green-200 mb-3">
                      <strong>역할:</strong> 분석 중 발견한 IP, 도메인, 파일 해시 등이 악성인지 조회하는 '신원 조회 시스템'입니다.
                    </p>
                    <p className="text-green-200 text-sm">
                      <strong>사용법:</strong> SIEM이나 EDR에서 발견한 의심스러운 정보(IOC)를 복사하여 TIP 검색창에 직접 붙여넣고, 그 평판과 관련 위협 정보를 확인하여 분석에 활용합니다.
                    </p>
                  </div>

                  {/* SOAR */}
                  <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-600/30">
                    <div className="flex items-center gap-3 mb-4">
                      <Zap className="w-6 h-6 text-orange-400" />
                      <h3 className="text-xl font-bold text-orange-400">
                        <Tooltip text="SOAR" tooltip="Security Orchestration, Automation and Response. 보안 사고 대응 과정을 자동화하고 표준화하여 신속한 대응을 지원하는 플랫폼입니다." className="text-orange-400" />
                      </h3>
                    </div>
                    <p className="text-green-200 mb-3">
                      <strong>역할:</strong> 사전 정의된 대응 절차(<Tooltip text="플레이북" tooltip="보안 사고 대응을 위한 표준화된 절차서로, 각 상황별로 어떤 순서로 무엇을 해야 하는지 단계별로 정의되어 있습니다." className="text-green-200" />)를 실행하는 '자동화 도구\'입니다.
                    </p>
                    <p className="text-green-200 text-sm">
                      <strong>사용법:</strong> 분석가가 상황을 종합적으로 판단한 후, 여러 플레이북 중에서 현재 상황에 가장 적합한 것을 직접 선택하여 실행해야 합니다.
                    </p>
                  </div>

                  {/* 티켓 관리 시스템 */}
                  <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-600/30 lg:col-span-2">
                    <div className="flex items-center gap-3 mb-4">
                      <FileText className="w-6 h-6 text-green-400" />
                      <h3 className="text-xl font-bold text-green-400">
                        <Tooltip text="티켓 관리 시스템" tooltip="보안 사고의 모든 분석과 조치 내용을 기록하고 다른 팀과의 협업을 관리하는 시스템입니다." className="text-green-400" />
                      </h3>
                    </div>
                    <p className="text-green-200 mb-3">
                      <strong>역할:</strong> 모든 분석과 조치 내용을 기록하고 협업을 요청하는 '사건 일지'입니다.
                    </p>
                    <p className="text-green-200 text-sm">
                      <strong>사용법:</strong> 분석가는 경보 인지부터 조치 완료까지 모든 과정을 시간 순서대로 수동으로 기록하고, 다른 팀의 협조가 필요할 때 해당 팀을 지정하여 티켓을 전달합니다.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 시나리오 기반 모의훈련 */}
        <div className="mb-12">
          <div className="bg-black/50 backdrop-blur-sm border border-red-500/30 rounded-lg p-6">
            <button
              onClick={() => setShowScenariosSection(!showScenariosSection)}
              className="w-full flex items-center justify-between text-left hover:bg-red-500/10 p-2 rounded transition-colors"
            >
              <div className="flex items-center gap-3">
                <Target className="w-6 h-6 text-red-400" />
                <h2 className="text-2xl font-bold text-red-400">시나리오 기반 모의훈련 (10개 시나리오)</h2>
              </div>
              {showScenariosSection ? (
                <ChevronUp className="w-6 h-6 text-red-400" />
              ) : (
                <ChevronDown className="w-6 h-6 text-red-400" />
              )}
            </button>
            
            {showScenariosSection && (
              <div className="mt-6 animate-fade-in">
                <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                  <p className="text-blue-300 text-lg">
                    <strong>실전 적용:</strong> 사용자는 직접 SIEM 쿼리를 작성하고, EDR 데이터를 분석하며, IOC를 복사하여 TI 플랫폼에 조회하는 등 수동적인 분석 과정을 통해 시나리오를 해결합니다.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {traditionalScenarios.map((scenario) => (
                    <div key={scenario.id} className="bg-gray-800/50 p-6 rounded-lg border border-gray-600/30 hover:border-blue-500/50 transition-all duration-300">
                      {/* 시나리오 헤더 */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-yellow-400 mb-2">
                            시나리오 {scenario.id}: {scenario.title}
                          </h3>
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-3 py-1 rounded-lg border text-sm font-bold ${getPriorityColor(scenario.priority)}`}>
                              {scenario.priority} {scenario.priority === 'P1' ? '긴급' : scenario.priority === 'P2' ? '높음' : '중간'}
                            </span>
                            <span className="text-cyan-400 text-sm">
                              역할: {scenario.role}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-green-400" />
                          <span className="text-green-400 text-sm">10분</span>
                        </div>
                      </div>

                      {/* 상황 정보 */}
                      <div className="mb-4">
                        <h4 className="text-green-400 font-bold mb-2">상황 정보:</h4>
                        <p className="text-green-200 text-sm leading-relaxed">
                          {scenario.situation}
                        </p>
                      </div>

                      {/* 대응 흐름 */}
                      <div className="mb-4">
                        <h4 className="text-blue-400 font-bold mb-2">대응 흐름:</h4>
                        <p className="text-green-200 text-sm leading-relaxed">
                          {scenario.flow}
                        </p>
                      </div>

                      {/* 대응 결과 */}
                      <div className="mb-6">
                        <h4 className="text-purple-400 font-bold mb-2">대응 결과:</h4>
                        <p className="text-green-200 text-sm leading-relaxed">
                          {scenario.result}
                        </p>
                      </div>

                      {/* 시작 버튼 */}
                      <button
                        onClick={() => handleScenarioStart(scenario.id)}
                        className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 
                                 border-2 border-blue-400 rounded-lg text-white font-bold
                                 hover:from-blue-500 hover:to-blue-600 hover:border-blue-300
                                 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Play className="w-5 h-5" />
                        모의훈련 {scenario.id} 시작
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 공통 안내 */}
        <div className="bg-black/50 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <AlertTriangle className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl font-bold text-yellow-400">훈련 목표</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div>
              <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                시간 제한
              </h3>
              <p className="text-green-200 text-sm">
                각 시나리오마다 10분의 골든타임 안에 <Tooltip text="초동대응" tooltip="해킹 사고가 발생했을 때, 피해가 더 커지기 전에 가장 먼저 취하는 초기 조치를 말합니다." className="text-green-200" />을 완료해야 합니다.
              </p>
            </div>
            <div>
              <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                <Target className="w-5 h-5" />
                핵심 목표
              </h3>
              <p className="text-green-200 text-sm">
                공격의 6하 원칙(Who, What, When, Where, How, How much)을 파악하여 정확한 초동대응을 수행합니다.
              </p>
            </div>
            <div>
              <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                평가 기준
              </h3>
              <p className="text-green-200 text-sm">
                정확성, 신속성, 절차 준수 등을 종합적으로 평가하여 '대응 리더' 배지를 수여합니다.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-green-600 text-sm">
          <p>© 2025 corebyte.labs. All content rights reserved.</p>
        </div>
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-20"></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-green-400 rounded-full animate-pulse opacity-30"></div>
        <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping opacity-15"></div>
        <div className="absolute top-3/4 left-1/5 w-1 h-1 bg-cyan-400 rounded-full animate-pulse opacity-25"></div>
        <div className="absolute top-1/6 right-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping opacity-20"></div>
      </div>
    </div>
  );
};

export default TraditionalSOCCourse;