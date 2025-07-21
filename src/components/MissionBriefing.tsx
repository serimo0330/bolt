import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  AlertTriangle, 
  Clock, 
  MessageSquare, 
  Target, 
  Users, 
  Search,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Tooltip } from '../components/Tooltip';

const MissionBriefing = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);
  const [showMissionButton, setShowMissionButton] = useState(false);
  const [showAlertSystem, setShowAlertSystem] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowContent(true), 2000);
    const timer2 = setTimeout(() => setShowMissionButton(true), 4000);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleMissionAccept = () => {
    navigate('/quiz');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative overflow-hidden">
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Mission Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-yellow-400 mb-6 tracking-wider glow-text">
            <Tooltip text="SOC" tooltip="우리 회사의 모든 IT 시스템을 24시간 감시하는 '종합상황실'입니다. 해커의 침입 시도를 가장 먼저 발견하고 대응하는 역할을 합니다." className="text-yellow-400" /> 10분 <Tooltip text="초동대응" tooltip="해킹 사고가 발생했을 때, 피해가 더 커지기 전에 가장 먼저 취하는 초기 조치를 말합니다. '골든타임' 안에 얼마나 빠르고 정확하게 초동대응을 하느냐에 따라 피해 규모가 결정됩니다." className="text-yellow-400" /> 챌린지
          </h1>
          <div className="flex items-center justify-center gap-2 text-green-300 mb-4">
            <MessageSquare className="w-6 h-6" />
            <span className="text-xl">Mission Briefing</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-red-400 animate-pulse">
            <Clock className="w-5 h-5" />
            <span className="text-lg font-bold">긴급 상황 발생 - 즉시 대응 필요</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* 배경 스토리 */}
          <div className="bg-black/50 backdrop-blur-sm border border-red-500/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h2 className="text-2xl font-bold text-red-400">[ 배경 스토리 ]</h2>
            </div>
            <div className="space-y-3 text-green-200">
              <p>최근 우리와 유사한 산업군을 타겟으로 하는 해킹 그룹 <Tooltip text="APT38" tooltip="북한 정찰총국 산하의 사이버 공격 조직으로, 주로 금융기관을 대상으로 한 해킹과 암호화폐 탈취를 전문으로 하는 국가지원 해킹그룹(State-sponsored APT)입니다. SWIFT 네트워크를 통한 은행 해킹과 암호화폐 거래소 공격으로 유명합니다." className="text-red-400 font-bold" />의 활동이 급증했다는 외부 위협 정보가 있었습니다. 모든 요원은 각별히 주의를 기울여 주시기 바랍니다.</p>
            </div>
          </div>

          {/* 미션 목표 */}
          <div className="bg-black/50 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-yellow-400">[ 미션 목표 ]</h2>
            </div>
            <div className="space-y-3">
              <p className="text-red-400 font-bold text-xl animate-pulse">경보 발생! 10분 안에 <Tooltip text="초동대응" tooltip="해킹 사고가 발생했을 때, 피해가 더 커지기 전에 가장 먼저 취하는 초기 조치를 말합니다. '골든타임' 안에 얼마나 빠르고 정확하게 초동대응을 하느냐에 따라 피해 규모가 결정됩니다." className="text-red-400" />을 완료하여 피해 확산을 막고 '대응 리더' 배지를 획득하라!</p>
            </div>
          </div>
        </div>

        {showContent && (
          <div className="mb-12">
            {/* 핵심 원칙 */}
            <div className="bg-black/50 backdrop-blur-sm border border-green-500/30 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-bold text-green-400">[ 핵심 원칙 ]</h2>
              </div>
              <p className="text-green-200 mb-4">이번 훈련에서 가장 중요한 <Tooltip text="초동대응" tooltip="해킹 사고가 발생했을 때, 피해가 더 커지기 전에 가장 먼저 취하는 초기 조치를 말합니다. '골든타임' 안에 얼마나 빠르고 정확하게 초동대응을 하느냐에 따라 피해 규모가 결정됩니다." className="text-green-200" /> 3대 원칙을 숙지합니다.</p>
              <div className="space-y-4">
                <div>
                  <p className="text-green-300 font-bold">1. 증거 보존 (Preservation First)</p>
                  <p className="text-cyan-400 ml-4">→ 섣부른 조치는 금물!</p>
                </div>
                <div>
                  <p className="text-green-300 font-bold">2. 보고 및 전파 (Reporting)</p>
                  <p className="text-cyan-400 ml-4">→ 신속하고 정확하게!</p>
                </div>
                <div>
                  <p className="text-green-300 font-bold">3. 확산 방지 (Containment)</p>
                  <p className="text-cyan-400 ml-4">→ 증거 확보 후 신중하게!</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {showContent && (
          <div className="mb-12">
            {/* 3인 대응팀 구성 */}
            <div className="bg-black/50 backdrop-blur-sm border border-blue-500/30 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-blue-400">[ 오늘의 미션: 3인 대응팀 ]</h2>
              </div>
              <p className="text-green-200 mb-4">당신은 오늘 3인 대응팀의 일원이 되어 미션을 수행합니다. 각 시나리오마다 당신의 역할이 부여될 것입니다.</p>
              <div className="space-y-4">
                <div>
                  <p className="text-yellow-300 font-bold">현장 조치 담당자</p>
                  <p className="text-green-200 text-sm ml-4">증거 수집, 시스템 격리 등 현장에서의 기술적 조치를 담당합니다.</p>
                </div>
                <div>
                  <p className="text-yellow-300 font-bold">커뮤니케이터</p>
                  <p className="text-green-200 text-sm ml-4">상황 전파, 티켓 관리, 유관부서 협업 등 소통의 중심 역할을 합니다.</p>
                </div>
                <div>
                  <p className="text-yellow-300 font-bold">분석 및 검색 담당자</p>
                  <p className="text-green-200 text-sm ml-4">
                    <Tooltip text="SIEM" tooltip="Security Information and Event Management. 전사의 모든 보안 로그를 수집하고 분석하여 위협을 탐지하는 통합 보안 관제 시스템입니다." className="text-green-200" />, <Tooltip text="SOAR" tooltip="Security Orchestration, Automation and Response. 보안 사고 대응 과정을 자동화하고 표준화하여 신속한 대응을 지원하는 플랫폼입니다." className="text-green-200" />, <Tooltip text="EDR" tooltip="Endpoint Detection and Response. 개별 PC나 서버 등 엔드포인트에서 발생하는 악성 행위를 실시간으로 탐지하고 대응하는 보안 솔루션입니다." className="text-green-200" /> 등 도구를 활용해 공격의 전체 그림을 그리는 분석가 역할을 합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {showContent && (
          <div className="mb-12">
            {/* 분석 목표: 공격의 6하 원칙 */}
            <div className="bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <Search className="w-6 h-6 text-purple-400" />
                <h2 className="text-3xl font-bold text-purple-400">[ 분석의 핵심 목표: 공격의 6하 원칙 파악 ]</h2>
              </div>
              <p className="text-green-200 text-lg mb-6">
                모든 시나리오에서 당신의 목표는 단순히 경보를 해결하는 것을 넘어, 다음 정보들을 신속하게 파악하여 공격의 전체 그림을 그리는 것입니다.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-600/30">
                  <p className="text-yellow-300 font-bold">누가 (Who)</p>
                  <p className="text-green-200 text-sm">공격자 IP 주소</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-600/30">
                  <p className="text-yellow-300 font-bold">어디를 (Where)</p>
                  <p className="text-green-200 text-sm">대상 시스템 IP 주소 및 포트 번호</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-600/30">
                  <p className="text-yellow-300 font-bold">무엇을 (What)</p>
                  <p className="text-green-200 text-sm">공격 유형 (예: <Tooltip text="랜섬웨어" tooltip="사용자의 파일을 암호화하여 사용할 수 없게 만든 후, 복구를 위해 금전을 요구하는 악성 소프트웨어입니다." className="text-green-200" />, <Tooltip text="SQL 인젝션" tooltip="웹 애플리케이션의 데이터베이스 쿼리 취약점을 악용하여 비정상적인 SQL 명령을 실행시키는 공격 기법입니다." className="text-green-200" />)</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-600/30">
                  <p className="text-yellow-300 font-bold">어떻게 (How)</p>
                  <p className="text-green-200 text-sm">공격 경로 (예: 이메일 첨부파일, 웹 취약점)</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-600/30">
                  <p className="text-yellow-300 font-bold">얼마나 (How much)</p>
                  <p className="text-green-200 text-sm">피해 현황 (예: 암호화된 파일 수, 유출된 개인정보 건수)</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-600/30">
                  <p className="text-yellow-300 font-bold">중요도 (Severity)</p>
                  <p className="text-green-200 text-sm"><Tooltip text="경보 등급" tooltip="모든 보안 경보의 위험도를 나타내는 등급입니다. P1(긴급)처럼 숫자가 낮을수록 더 위험하고 시급한 사고를 의미하며, 분석가는 이 등급에 따라 대응 우선순위를 정합니다." className="text-green-200" /> (P1, P2 등)</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {showContent && (
          <div className="mb-12">
            {/* 경보 등급 체계 접이식 섹션 */}
            <div className="bg-black/50 backdrop-blur-sm border border-orange-500/30 rounded-lg p-6">
              <button
                onClick={() => setShowAlertSystem(!showAlertSystem)}
                className="w-full flex items-center justify-between text-left hover:bg-orange-500/10 p-2 rounded transition-colors"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-orange-400" />
                  <h2 className="text-2xl font-bold text-orange-400">[ <Tooltip text="경보 등급" tooltip="모든 보안 경보의 위험도를 나타내는 등급입니다. P1(긴급)처럼 숫자가 낮을수록 더 위험하고 시급한 사고를 의미하며, 분석가는 이 등급에 따라 대응 우선순위를 정합니다." className="text-orange-400" /> 체계 자세히 보기 ]</h2>
                </div>
                {showAlertSystem ? (
                  <ChevronUp className="w-6 h-6 text-orange-400" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-orange-400" />
                )}
              </button>
              
              {showAlertSystem && (
                <div className="mt-6 animate-fade-in">
                  <p className="text-green-200 text-lg mb-6">
                    모든 침해사고 대응은 경보 등급에 따른 우선순위 판단에서 시작됩니다.
                  </p>
                  
                  {/* 경보 등급 표 */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-600">
                      <thead>
                        <tr className="bg-gray-800/50">
                          <th className="border border-gray-600 p-3 text-yellow-300 font-bold">등급</th>
                          <th className="border border-gray-600 p-3 text-yellow-300 font-bold">명칭</th>
                          <th className="border border-gray-600 p-3 text-yellow-300 font-bold">시각/청각적 표현</th>
                          <th className="border border-gray-600 p-3 text-yellow-300 font-bold">대응 목표 (SLA)</th>
                          <th className="border border-gray-600 p-3 text-yellow-300 font-bold">정의 및 판단 기준</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-red-900/20">
                          <td className="border border-gray-600 p-3 text-red-400 font-bold text-center">P1</td>
                          <td className="border border-gray-600 p-3 text-red-400 font-bold">긴급 (Critical)</td>
                          <td className="border border-gray-600 p-3 text-green-200 text-sm">화면 전체 붉은색 점멸, 사이렌 경고음</td>
                          <td className="border border-gray-600 p-3 text-red-300 font-bold text-center">즉시 (5분 이내)</td>
                          <td className="border border-gray-600 p-3 text-green-200 text-sm">전사적 서비스 중단, 대규모 개인정보 유출, 막대한 금전적 손실을 초래하는 최고 수준의 위협.</td>
                        </tr>
                        <tr className="bg-red-800/10">
                          <td className="border border-gray-600 p-3 text-red-300 font-bold text-center">P2</td>
                          <td className="border border-gray-600 p-3 text-red-300 font-bold">높음 (High)</td>
                          <td className="border border-gray-600 p-3 text-green-200 text-sm">화면 상단 붉은색 배너, 반복적 경고음</td>
                          <td className="border border-gray-600 p-3 text-orange-300 font-bold text-center">15분 이내</td>
                          <td className="border border-gray-600 p-3 text-green-200 text-sm">핵심 시스템/데이터에 대한 직접적 위협으로, 신속한 조치가 없으면 '긴급' 등급으로 격상될 가능성이 매우 높은 위협.</td>
                        </tr>
                        <tr className="bg-orange-800/10">
                          <td className="border border-gray-600 p-3 text-orange-400 font-bold text-center">P3</td>
                          <td className="border border-gray-600 p-3 text-orange-400 font-bold">중간 (Medium)</td>
                          <td className="border border-gray-600 p-3 text-green-200 text-sm">경보 목록 주황색 표시, 단발성 알림음</td>
                          <td className="border border-gray-600 p-3 text-yellow-300 font-bold text-center">1시간 이내</td>
                          <td className="border border-gray-600 p-3 text-green-200 text-sm">잠재적 위협이나 정책 위반. 즉각적인 피해는 없으나 방치 시 위험으로 발전할 수 있어 분석이 필요한 위협.</td>
                        </tr>
                        <tr className="bg-yellow-800/10">
                          <td className="border border-gray-600 p-3 text-yellow-400 font-bold text-center">P4</td>
                          <td className="border border-gray-600 p-3 text-yellow-400 font-bold">낮음 (Low)</td>
                          <td className="border border-gray-600 p-3 text-green-200 text-sm">경보 목록 노란색 표시, 알림 없음</td>
                          <td className="border border-gray-600 p-3 text-green-300 font-bold text-center">8시간 이내</td>
                          <td className="border border-gray-600 p-3 text-green-200 text-sm">추가적인 분석이 필요한 정보성 이벤트나 경미한 정책 위반.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  {/* 핵심 훈련 목표 */}
                  <div className="mt-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                    <h3 className="text-blue-400 font-bold text-lg mb-3">[핵심 훈련 목표]</h3>
                    <p className="text-green-200 text-sm leading-relaxed">
                      위 표의 대응 목표 시간의 핵심은 이 시간이 <span className="text-yellow-300 font-bold">'사고를 완전히 해결하는 시간(Resolution Time)'</span>이 아니라, 관제 요원이 경보를 <span className="text-yellow-300 font-bold">'인지하고 초기 분석 및 대응을 시작하는 시간(Triage/Initial Response Time)'</span>이라는 점입니다. 이 훈련의 가장 중요한 목표 중 하나는, 쏟아지는 경보 속에서 무엇이 더 중요하고 시급한지를 판단하는 <span className="text-red-400 font-bold">\'우선순위 결정 능력'</span>까지 훈련하는 것입니다.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mission Accept Button */}
        {showMissionButton && (
          <div className="text-center animate-fade-in">
            <div className="mb-8">
              <div className="inline-block animate-bounce mb-4">
                <div className="w-6 h-6 bg-red-500 rounded-full animate-pulse"></div>
              </div>
              <p className="text-red-400 font-bold text-2xl mb-4">
                ⚠️ 미션 수락 대기 중 ⚠️
              </p>
              <p className="text-green-300 text-xl mb-2">
                모든 브리핑이 완료되었습니다.
              </p>
              <p className="text-yellow-300 text-lg">
                미션을 수락하시겠습니까?
              </p>
            </div>
            
            <button
              onClick={handleMissionAccept}
              className="group relative px-16 py-6 bg-gradient-to-r from-red-600 to-red-700 
                       border-2 border-red-400 rounded-lg text-white font-bold text-2xl
                       hover:from-red-500 hover:to-red-600 hover:border-red-300
                       transform hover:scale-105 transition-all duration-300
                       shadow-lg hover:shadow-red-500/25 glow-text"
            >
              <span className="relative z-10">🎯 미션 수락</span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-600 opacity-0 
                            group-hover:opacity-20 rounded-lg transition-opacity duration-300"></div>
            </button>
            
            <div className="mt-6 text-yellow-300 text-lg animate-pulse">
              ※ 미션 수락 후 지식 점검 퀴즈가 시작됩니다
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-20 text-center text-green-600 text-sm">
          <p>© 2025 corebyte.labs. All content rights reserved.</p>
        </div>
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-20">\</div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-yellow-400 rounded-full animate-pulse opacity-30"></div>
        <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-red-400 rounded-full animate-ping opacity-15"></div>
        <div className="absolute top-3/4 left-1/5 w-1 h-1 bg-cyan-400 rounded-full animate-pulse opacity-25"></div>
        <div className="absolute top-1/6 right-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping opacity-20"></div>
      </div>
    </div>
  );
};

export default MissionBriefing;