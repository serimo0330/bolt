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

  // B코스용 시나리오 데이터
  const nextGenScenarios = [
    {
      id: 1,
      title: "랜섬웨어 감염",
      priority: "P1",
      role: "현장 조치 담당자",
      situation: "재무팀 PC가 랜섬웨어에 감염되어 모든 회계 문서가 암호화되었고, 업무가 중단되었습니다. 화면에는 데이터를 공개하겠다는 협박 메시지와 함께 비트코인을 요구하는 랜섬노트가 떠 있습니다.",
      flow: "AI 알림 확인 및 TI 정보 자동 요약 확인 → 이 공격의 최초 유입 경로는 뭐야? 질문 → '랜섬웨어 초기 대응' 플레이북 실행",
      result: "감염된 PC가 네트워크에서 격리되어 랜섬웨어의 내부 확산이 차단되었습니다. 확보된 메모리 덤프와 악성 파일은 심층 분석을 위해 침해사고분석팀으로 이관되었습니다."
    },
    {
      id: 2,
      title: "내부 정보 유출 의심",
      priority: "P2",
      role: "커뮤니케이터",
      situation: "마케팅팀 직원의 PC에서 차기 신제품 출시 전략 등 핵심 영업기밀이 외부 클라우드 스토리지로 대량 유출된 정황이 포착되었습니다.",
      flow: "UEBA 경보 확인 → dkim 계정이 최근 24시간 동안 접속한 외부 사이트와 업로드한 파일 용량 알려줘 질문 → '내부 정보 유출 대응' 플레이북 실행",
      result: "유출에 사용된 계정이 비활성화되고 관련 PC들이 격리되어 추가적인 정보 유출이 차단되었습니다. 법무팀에 관련 내용이 전달되어 후속 조치를 준비합니다."
    },
    {
      id: 3,
      title: "SQL 인젝션 및 데이터 유출",
      priority: "P1",
      role: "분석 및 검색 담당자",
      situation: "쇼핑몰 고객 DB가 SQL 인젝션 공격을 받아 고객 15만 명의 개인정보가 탈취되었습니다. 법적 문제 및 기업 이미지 실추가 우려됩니다.",
      flow: "AI 알림 확인 → 이 공격으로 데이터 유출도 발생했어? 질문 → AI의 상관 분석 결과 확인 → '웹 공격 대응' 플레이북 실행",
      result: "공격에 사용된 IP가 방화벽에서 차단되었고, 웹방화벽(WAF)에 해당 공격 패턴을 차단하는 긴급 정책이 적용되었습니다. 개발팀에 취약점 패치가 요청되었습니다."
    },
    {
      id: 4,
      title: "스피어 피싱 및 계정 탈취",
      priority: "P2",
      role: "분석 및 검색 담당자",
      situation: "임원 대상 스피어 피싱으로 이메일 계정이 탈취되었습니다. 공격자가 이 계정으로 2차 피해를 유발하고 있습니다.",
      flow: "'피싱 메일 분석' 플레이북 실행 → jlee 계정으로 최근 1시간 내 로그인 성공 기록 전부 찾아줘 질문 → '계정 탈취 대응' 플레이북 실행",
      result: "탈취된 임원 계정의 비밀번호가 강제 변경되고 모든 활성 세션이 종료되어 공격자의 접근이 차단되었습니다. 전사에 유사 피싱 메일에 대한 주의 공지가 발송되었습니다."
    },
    {
      id: 5,
      title: "워터링 홀 공격",
      priority: "P2",
      role: "분석 및 검색 담당자",
      situation: "개발자들이 자주 방문하는 커뮤니티가 해킹되어, 접속한 다수 개발자 PC가 악성코드에 감염되었습니다. 회사의 핵심 기술 자산이 유출될 위험에 처했습니다.",
      flow: "AI 위협 사냥 경보 확인 → 이 PowerShell 실행 직전에 공통적으로 접속한 웹사이트 목록 보여줘 질문 → '워터링 홀 대응' 플레이북 실행",
      result: "감염된 PC들이 격리되었고, 악성코드 유포지로 확인된 웹사이트는 전사 프록시에서 접속이 차단되었습니다."
    },
    {
      id: 6,
      title: "무차별 대입 공격 (Brute Force)",
      priority: "P3",
      role: "분석 및 검색 담당자",
      situation: "VPN 서버 관리자 계정에 대해 무차별 대입 공격이 발생 중입니다. 계정 탈취 시 내부망 전체가 장악될 수 있습니다.",
      flow: "AI 알림 확인 → 최근 1시간 동안 로그인 실패가 가장 많은 계정과 공격 IP 상위 5개 알려줘 질문 → '무차별 대입 공격 대응' 플레이북 실행",
      result: "공격자 IP가 방화벽에서 차단되었고, 공격 대상이 된 계정은 보안을 위해 임시 잠금 조치되었습니다."
    },
    {
      id: 7,
      title: "분산 서비스 거부(DDoS) 공격",
      priority: "P1",
      role: "커뮤니케이터",
      situation: "공식 웹사이트에 대규모 DDoS 공격으로 서비스가 중단되어 막대한 매출 손실이 발생하고 있습니다.",
      flow: "AI 알림 확인 → 어떤 유형의 DDoS 공격이야? 질문 → AI의 분석 결과 확인 → 'DDoS 공격 대응' 플레이북 실행",
      result: "DDoS 방어 장비가 활성화되어 공격 트래픽이 정상적으로 필터링되기 시작했습니다. 웹사이트 서비스가 복구되었습니다."
    },
    {
      id: 8,
      title: "소스코드 유출을 통한 클라우드 계정 탈취",
      priority: "P1",
      role: "분석 및 검색 담당자",
      situation: "개발자 실수로 AWS 엑세스 키가 공개 GitHub에 유출되었습니다. 공격자가 이 키로 고사양 서버를 대량 생성하여 클라우드 요금이 급증하고 있습니다.",
      flow: "클라우드 운영팀 전화 수신 → 최근 클라우드 비용 급증의 원인이 뭐야? 질문 → AI의 상관 분석 결과(키 유출 경로 포함) 확인 → '클라우드 계정 침해 대응' 플레이북 실행",
      result: "유출된 엑세스 키가 비활성화되고, 공격자가 생성한 모든 가상서버가 삭제되어 과도한 비용 발생이 중단되었습니다."
    },
    {
      id: 9,
      title: "오탐(False Positive) 처리",
      priority: "P2",
      role: "커뮤니케이터",
      situation: "DB 백업 서버에서 대량 파일 삭제 행위가 탐지되어 '높음' 등급 경보가 발생했습니다. 랜섬웨어 또는 내부자 파괴 행위일 수 있습니다.",
      flow: "EDR 경보 확인 → 이 파일 삭제 행위가 정상적인 작업일 가능성은? 질문 → AI의 티켓 시스템 조회 결과 확인 → '오탐'으로 경보 종결 처리",
      result: "해당 경보가 정상적인 관리 작업으로 인한 오탐임을 확인하고 티켓을 종결했습니다. AI 어시스턴트가 유사 경보 재발 방지를 위해 EDR 탐지 정책 예외 처리를 자동으로 제안했습니다."
    },
    {
      id: 10,
      title: "공급망 공격 (Supply Chain Attack)",
      priority: "P1",
      role: "현장 조치 담당자",
      situation: "정상 문서 편집기 프로그램의 자동 업데이트 기능을 통해 악성코드가 유포되어, 다수 PC에서 악성 C2 서버로의 통신이 탐지되었습니다.",
      flow: "AI 상관분석 경보 확인 → 이 공격을 받은 시스템들의 공통점은 뭐야? 질문 → AI의 분석 결과 확인 → '공급망 공격 대응' 플레이북 실행",
      result: "악성 C2 서버와의 통신이 전사적으로 차단되었고, 감염된 PC들이 모두 격리되어 추가 피해가 방지되었습니다. 소프트웨어 공급사에 해당 문제에 대해 긴급 공지를 요청했습니다."
    }
  ];

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

                      {/* 시작 버튼 */}
                      <button
                        onClick={() => handleScenarioStart(scenario.id)}
                        className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 
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