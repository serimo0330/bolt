import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from './Tooltip';
import { 
  Brain, 
  Home, 
  ArrowLeft,
  Search,
  Database,
  Eye,
  Zap,
  FileText,
  Clock,
  Target,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Play,
  Sparkles,
  MessageSquare,
  BarChart3
} from 'lucide-react';

const NextGenSOCCourse = () => {
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

  // B코스용 시나리오 데이터 - 현재 비어있음
  const nextGenScenarios = [];

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
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg
                       hover:bg-green-700 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              코스 선택으로 돌아가기
            </button>
          </div>
        </div>

        {/* 코스 제목 */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-600/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-5xl font-bold text-green-400 mb-4 tracking-wider glow-text">
            B코스: 차세대 SOC
          </h1>
          <p className="text-green-200 text-xl max-w-4xl mx-auto leading-relaxed">
            AI 어시스턴트, 자연어 검색 등 분석가의 판단을 돕는 AI 기능을 활용하여 분석의 효율성과 정확성을 높이는 방법을 훈련합니다.
          </p>
          <div className="mt-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg max-w-4xl mx-auto">
            <p className="text-green-300 text-lg">
              💡 <strong>안내:</strong> "차세대 SOC의 주인공은 당신입니다. AI는 당신의 눈과 손을 확장해 주는 강력한 도구일 뿐입니다. AI에게 어떤 질문을 던져야 원하는 증거를 찾을 수 있는지, AI가 요약한 데이터의 핵심을 어떻게 파악할지 익혀보세요."
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
                <Sparkles className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-bold text-green-400">AI 기반 핵심 SOC 도구 소개</h2>
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
                  {/* AI 기반 SIEM */}
                  <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-600/30">
                    <div className="flex items-center gap-3 mb-4">
                      <Database className="w-6 h-6 text-cyan-400" />
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      <h3 className="text-xl font-bold text-cyan-400">
                        <Tooltip text="SIEM (AI 기반)" tooltip="AI가 수많은 로그를 자동으로 상관 분석하여, 단순 경보가 아닌 '하나의 사고'로 종합하여 보여주는 차세대 SIEM입니다." className="text-cyan-400" />
                      </h3>
                    </div>
                    <p className="text-green-200 mb-3">
                      <strong>역할:</strong> AI가 수많은 로그를 자동으로 상관 분석하여, 단순 경보가 아닌 '하나의 사고'로 종합하여 보여줍니다.
                    </p>
                    <p className="text-green-200 text-sm">
                      <strong>사용법:</strong> 복잡한 쿼리 대신 자연어 검색을 통해 "어제 새벽에 해외에서 로그인한 계정 찾아줘"와 같이 질문하여 원하는 정보를 얻습니다.
                    </p>
                  </div>

                  {/* AI 기반 EDR */}
                  <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-600/30">
                    <div className="flex items-center gap-3 mb-4">
                      <Eye className="w-6 h-6 text-purple-400" />
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      <h3 className="text-xl font-bold text-purple-400">
                        <Tooltip text="EDR (AI 기반)" tooltip="AI가 엔드포인트의 행위를 실시간으로 분석하여, 알려지지 않은 위협이라도 비정상적인 패턴을 보이면 자동으로 탐지하고 위험도를 평가해주는 차세대 EDR입니다." className="text-purple-400" />
                      </h3>
                    </div>
                    <p className="text-green-200 mb-3">
                      <strong>역할:</strong> AI가 엔드포인트의 행위를 실시간으로 분석하여, 알려지지 않은 위협이라도 비정상적인 패턴을 보이면 자동으로 탐지하고 위험도를 평가해줍니다.
                    </p>
                    <p className="text-green-200 text-sm">
                      <strong>사용법:</strong> 분석가는 AI가 제시한 '의심스러운 행위 체인'을 보고, 공격의 흐름을 직관적으로 파악하는 데 집중합니다.
                    </p>
                  </div>

                  {/* AI 연동 TIP */}
                  <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-600/30">
                    <div className="flex items-center gap-3 mb-4">
                      <Brain className="w-6 h-6 text-yellow-400" />
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      <h3 className="text-xl font-bold text-yellow-400">
                        <Tooltip text="위협 인텔리전스 플랫폼 (TIP, AI 연동)" tooltip="SIEM이나 EDR에서 위협이 탐지되는 즉시, 관련 IOC가 자동으로 TIP에 조회되고 그 결과가 경보에 자동으로 포함되는 AI 연동 TIP입니다." className="text-yellow-400" />
                      </h3>
                    </div>
                    <p className="text-green-200 mb-3">
                      <strong>역할:</strong> SIEM이나 EDR에서 위협이 탐지되는 즉시, 관련 IOC가 자동으로 TIP에 조회되고 그 결과가 경보에 자동으로 포함됩니다.
                    </p>
                    <p className="text-green-200 text-sm">
                      <strong>사용법:</strong> 분석가는 별도의 조회 없이도, 경보 화면에서 "이 IP는 APT38 그룹이 사용하는 C2 서버입니다"와 같은 풍부한 컨텍스트 정보를 바로 확인할 수 있습니다.
                    </p>
                  </div>

                  {/* AI 기반 SOAR */}
                  <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-600/30">
                    <div className="flex items-center gap-3 mb-4">
                      <Zap className="w-6 h-6 text-orange-400" />
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      <h3 className="text-xl font-bold text-orange-400">
                        <Tooltip text="SOAR (AI 기반)" tooltip="AI가 현재 사고의 맥락을 분석하여, 가장 적합한 플레이북을 자동으로 추천해주거나, 기존 플레이북에 새로운 대응 단계를 동적으로 추가할 것을 제안하는 차세대 SOAR입니다." className="text-orange-400" />
                      </h3>
                    </div>
                    <p className="text-green-200 mb-3">
                      <strong>역할:</strong> AI가 현재 사고의 맥락을 분석하여, 가장 적합한 플레이북을 자동으로 추천해주거나, 기존 플레이북에 새로운 대응 단계를 동적으로 추가할 것을 제안합니다.
                    </p>
                    <p className="text-green-200 text-sm">
                      <strong>사용법:</strong> 분석가는 AI의 추천을 검토하고 클릭 한 번으로 대응을 실행하거나, 제안을 수정하여 더 정교한 대응을 수행합니다.
                    </p>
                  </div>

                  {/* UEBA */}
                  <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-600/30">
                    <div className="flex items-center gap-3 mb-4">
                      <BarChart3 className="w-6 h-6 text-indigo-400" />
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      <h3 className="text-xl font-bold text-indigo-400">
                        <Tooltip text="UEBA (사용자 행위 분석)" tooltip="User and Entity Behavior Analytics. 사용자와 엔티티의 행동 패턴을 AI로 분석하여 비정상적인 활동을 자동으로 탐지하는 기술입니다." className="text-indigo-400" />
                      </h3>
                    </div>
                    <p className="text-green-200 mb-3">
                      <strong>역할:</strong> AI가 사용자의 평소 행동 패턴을 학습하여, 비정상적인 활동을 자동으로 탐지하고 위험도를 평가합니다.
                    </p>
                    <p className="text-green-200 text-sm">
                      <strong>사용법:</strong> "dkim 계정이 최근 24시간 동안 접속한 외부 사이트와 업로드한 파일 용량 알려줘"와 같은 자연어 질문으로 사용자 행위를 분석합니다.
                    </p>
                  </div>

                  {/* AI 연동 티켓 관리 시스템 */}
                  <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-600/30">
                    <div className="flex items-center gap-3 mb-4">
                      <FileText className="w-6 h-6 text-green-400" />
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      <h3 className="text-xl font-bold text-green-400">
                        <Tooltip text="티켓 관리 시스템 (AI 연동)" tooltip="분석이 진행됨에 따라, AI가 티켓의 주요 항목(사고 개요, 조치 사항 등)을 자동으로 채워주거나 요약 보고서를 초안으로 작성해주는 AI 연동 티켓 시스템입니다." className="text-green-400" />
                      </h3>
                    </div>
                    <p className="text-green-200 mb-3">
                      <strong>역할:</strong> 분석이 진행됨에 따라, AI가 티켓의 주요 항목(사고 개요, 조치 사항 등)을 자동으로 채워주거나 요약 보고서를 초안으로 작성해줍니다.
                    </p>
                    <p className="text-green-200 text-sm">
                      <strong>사용법:</strong> 분석가는 AI가 작성한 내용을 검토하고 수정하는 것만으로도 신속하게 기록 및 보고 업무를 완료할 수 있습니다.
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
                <h2 className="text-2xl font-bold text-red-400">AI 기반 시나리오 모의훈련 (10개 시나리오)</h2>
              </div>
              {showScenariosSection ? (
                <ChevronUp className="w-6 h-6 text-red-400" />
              ) : (
                <ChevronDown className="w-6 h-6 text-red-400" />
              )}
            </button>
            
            {showScenariosSection && (
              <div className="mt-6 animate-fade-in">
                <div className="mb-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                  <p className="text-green-300 text-lg">
                    <strong>실전 적용:</strong> 사용자는 AI가 제공한 초기 단서(경보)를 바탕으로, 스스로 가설을 세우고 자연어 검색으로 증거를 수집하며, 최종 판단에 따라 직접 플레이북을 선택하고 실행하는 종합적인 분석 과정을 수행합니다.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {nextGenScenarios.map((scenario) => (
                    <div key={scenario.id} className="bg-gray-800/50 p-6 rounded-lg border border-gray-600/30 hover:border-green-500/50 transition-all duration-300">
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
                          <Sparkles className="w-4 h-4 text-yellow-400" />
                        </div>
                      </div>

                      {/* 상황 정보 */}
                      <div className="mb-4">
                        <h4 className="text-green-400 font-bold mb-2">상황 정보:</h4>
                        <p className="text-green-200 text-sm leading-relaxed">
                          {scenario.situation}
                        </p>
                      </div>

                      {/* AI 기반 대응 흐름 */}
                      <div className="mb-4">
                        <h4 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          AI 기반 대응 흐름:
                        </h4>
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
                        className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 
                                 border-2 border-green-400 rounded-lg text-white font-bold
                                 hover:from-green-500 hover:to-green-600 hover:border-green-300
                                 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <Play className="w-5 h-5" />
                        <Sparkles className="w-4 h-4" />
                        AI 모의훈련 {scenario.id} 시작
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
            <h2 className="text-2xl font-bold text-yellow-400">AI 기반 훈련 목표</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div>
              <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                시간 제한
              </h3>
              <p className="text-green-200 text-sm">
                각 시나리오마다 10분의 골든타임 안에 AI와 협업하여 <Tooltip text="초동대응" tooltip="해킹 사고가 발생했을 때, 피해가 더 커지기 전에 가장 먼저 취하는 초기 조치를 말합니다." className="text-green-200" />을 완료해야 합니다.
              </p>
            </div>
            <div>
              <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                AI 활용 능력
              </h3>
              <p className="text-green-200 text-sm">
                자연어 질문을 통해 AI로부터 정확한 정보를 얻고, AI의 분석 결과를 올바르게 해석하는 능력을 기릅니다.
              </p>
            </div>
            <div>
              <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                <Brain className="w-5 h-5" />
                평가 기준
              </h3>
              <p className="text-green-200 text-sm">
                AI 도구 활용 능력, 정확성, 신속성, 절차 준수 등을 종합적으로 평가하여 '차세대 대응 리더' 배지를 수여합니다.
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
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-20"></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-yellow-400 rounded-full animate-pulse opacity-30"></div>
        <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping opacity-15"></div>
        <div className="absolute top-3/4 left-1/5 w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-25"></div>
        <div className="absolute top-1/6 right-1/4 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping opacity-20"></div>
      </div>
    </div>
  );
};

export default NextGenSOCCourse;