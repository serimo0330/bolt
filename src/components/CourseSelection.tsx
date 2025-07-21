import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Brain, 
  Home,
  Target,
  AlertTriangle,
  Clock,
  Cpu,
  Search,
  Zap,
  Users,
  RotateCcw
} from 'lucide-react';
import { Tooltip } from './Tooltip';

const CourseSelection = () => {
  const navigate = useNavigate();

  const handleCourseSelect = (courseType: string) => {
    // 실제 코스별 시나리오 페이지로 이동
    navigate(`/course/${courseType}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative overflow-hidden">
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* 홈으로 가기 버튼 */}
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
              onClick={() => navigate('/quiz')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg
                       hover:bg-blue-700 transition-all duration-300"
            >
              <RotateCcw className="w-4 h-4" />
              퀴즈 다시 도전하기
            </button>
          </div>
        </div>

        {/* 페이지 제목 */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-yellow-400 mb-6 tracking-wider glow-text">
            🎯 시나리오 기반 실전 모의훈련
          </h1>
          <div className="flex items-center justify-center gap-2 text-green-300 mb-4">
            <Target className="w-6 h-6" />
            <span className="text-xl">Course Selection</span>
          </div>
          <p className="text-green-200 text-lg max-w-4xl mx-auto leading-relaxed">
            <Tooltip text="SOC" tooltip="Security Operation Center. 우리 회사의 모든 IT 시스템을 24시간 감시하는 '종합상황실'입니다. 해커의 침입 시도를 가장 먼저 발견하고 대응하는 역할을 합니다." className="text-green-200" /> 신입 요원이 주어진 도구를 활용하여 스스로 증거를 분석하고 판단하며 골든타임 안에 <Tooltip text="초동대응" tooltip="해킹 사고가 발생했을 때, 피해가 더 커지기 전에 가장 먼저 취하는 초기 조치를 말합니다. '골든타임' 안에 얼마나 빠르고 정확하게 초동대응을 하느냐에 따라 피해 규모가 결정됩니다." className="text-green-200" />을 수행하는 종합적인 역량을 훈련합니다.
          </p>
        </div>

        {/* 코스 선택 카드들 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* A코스 - 전통적인 SOC */}
          <div className="bg-blue-900/20 backdrop-blur-sm border border-blue-500/30 rounded-lg p-8 
                         hover:scale-105 transition-all duration-300 cursor-pointer
                         hover:shadow-lg hover:shadow-blue-500/20">
            {/* 코스 헤더 */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-blue-600/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-10 h-10 text-blue-400" />
              </div>
              <h2 className="text-3xl font-bold text-blue-400 mb-2">A코스</h2>
              <h3 className="text-xl text-blue-300 font-semibold">전통적인 SOC</h3>
            </div>

            {/* 코스 설명 */}
            <div className="mb-6">
              <p className="text-green-200 text-lg leading-relaxed text-center mb-4">
                AI의 도움 없이, 기본적인 보안 도구를 직접 다루며 분석의 기초 체력을 기릅니다.
              </p>
            </div>

            {/* 주요 특징 */}
            <div className="mb-6">
              <h4 className="text-cyan-400 font-bold text-lg mb-3 flex items-center gap-2">
                <Search className="w-5 h-5" />
                주요 특징
              </h4>
              <ul className="space-y-2">
                <li className="text-green-300 flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span><Tooltip text="SIEM" tooltip="Security Information and Event Management. 전사의 모든 보안 로그를 수집하고 분석하여 위협을 탐지하는 통합 보안 관제 시스템입니다." className="text-green-300" />, <Tooltip text="EDR" tooltip="Endpoint Detection and Response. 개별 PC나 서버 등 엔드포인트에서 발생하는 악성 행위를 실시간으로 탐지하고 대응하는 보안 솔루션입니다." className="text-green-300" /> 등 기본 도구 직접 조작</span>
                </li>
                <li className="text-green-300 flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>수동 로그 분석 및 패턴 인식</span>
                </li>
                <li className="text-green-300 flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>분석가의 직관과 경험 중심 접근</span>
                </li>
                <li className="text-green-300 flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>보안 분석의 기초 원리 체득</span>
                </li>
              </ul>
            </div>

            {/* 사용 도구 */}
            <div className="mb-6">
              <h4 className="text-purple-400 font-bold text-lg mb-3">주요 도구</h4>
              <div className="flex flex-wrap gap-2">
                {['SIEM', 'EDR', 'SOAR', '방화벽 로그', '웹 로그', 'DNS 로그'].map((tool, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-800/50 text-purple-300 text-sm rounded border border-purple-500/30"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* 시작 버튼 */}
            <button
              onClick={() => handleCourseSelect('traditional')}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 
                       border-2 border-blue-400 rounded-lg text-white font-bold text-xl
                       hover:from-blue-500 hover:to-blue-600 hover:border-blue-300
                       transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Shield className="w-6 h-6" />
              A코스 시작
            </button>
          </div>

          {/* B코스 - 차세대 SOC */}
          <div className="bg-green-900/20 backdrop-blur-sm border border-green-500/30 rounded-lg p-8 
                         hover:scale-105 transition-all duration-300 cursor-pointer
                         hover:shadow-lg hover:shadow-green-500/20">
            {/* 코스 헤더 */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-green-600/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold text-green-400 mb-2">B코스</h2>
              <h3 className="text-xl text-green-300 font-semibold">차세대 SOC</h3>
            </div>

            {/* 코스 설명 */}
            <div className="mb-6">
              <p className="text-green-200 text-lg leading-relaxed text-center mb-4">
                AI 기반 플랫폼을 '도구'로서 능동적으로 활용하여, 분석의 효율성과 깊이를 더하는 방법을 훈련합니다.
              </p>
            </div>

            {/* 주요 특징 */}
            <div className="mb-6">
              <h4 className="text-cyan-400 font-bold text-lg mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                주요 특징
              </h4>
              <ul className="space-y-2">
                <li className="text-green-300 flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>AI 기반 위협 탐지 및 분석 도구 활용</span>
                </li>
                <li className="text-green-300 flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>자동화된 패턴 인식 및 이상 탐지</span>
                </li>
                <li className="text-green-300 flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>AI와 협업하는 하이브리드 분석</span>
                </li>
                <li className="text-green-300 flex items-start gap-2">
                  <span className="text-yellow-400 mt-1">•</span>
                  <span>효율적인 대용량 데이터 분석</span>
                </li>
              </ul>
            </div>

            {/* 사용 도구 */}
            <div className="mb-6">
              <h4 className="text-purple-400 font-bold text-lg mb-3">주요 도구</h4>
              <div className="flex flex-wrap gap-2">
                {['AI-SIEM', 'ML 기반 EDR', 'UEBA', 'AI 위협 헌팅', '자동화 SOAR', 'AI 분석 엔진'].map((tool, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-800/50 text-purple-300 text-sm rounded border border-purple-500/30"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* 시작 버튼 */}
            <button
              onClick={() => handleCourseSelect('nextgen')}
              className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-green-700 
                       border-2 border-green-400 rounded-lg text-white font-bold text-xl
                       hover:from-green-500 hover:to-green-600 hover:border-green-300
                       transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Brain className="w-6 h-6" />
              B코스 시작
            </button>
          </div>
        </div>

        {/* 코스 비교 및 안내 */}
        <div className="bg-black/50 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-8 mb-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Users className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl font-bold text-yellow-400">코스 선택 가이드</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-blue-400 font-bold text-lg mb-3">A코스를 추천하는 경우</h3>
              <ul className="space-y-2 text-green-200 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">▶</span>
                  <span>보안 분석 기초를 탄탄히 다지고 싶은 경우</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">▶</span>
                  <span>수동 분석 능력을 기르고 싶은 경우</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">▶</span>
                  <span>전통적인 SOC 환경에서 근무할 예정인 경우</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">▶</span>
                  <span>보안 도구의 원리를 깊이 이해하고 싶은 경우</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-green-400 font-bold text-lg mb-3">B코스를 추천하는 경우</h3>
              <ul className="space-y-2 text-green-200 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">▶</span>
                  <span>AI 도구를 활용한 효율적 분석을 배우고 싶은 경우</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">▶</span>
                  <span>대용량 데이터 분석 능력을 기르고 싶은 경우</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">▶</span>
                  <span>차세대 SOC 환경에서 근무할 예정인 경우</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">▶</span>
                  <span>AI와 협업하는 분석 방법을 익히고 싶은 경우</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 공통 안내 */}
        <div className="bg-black/50 backdrop-blur-sm border border-red-500/30 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <h2 className="text-2xl font-bold text-red-400">공통 미션 목표</h2>
          </div>
          <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
            <p className="text-blue-300 text-lg">
              💡 <strong>퀴즈를 건너뛰고 오셨나요?</strong> 위의 "퀴즈 다시 도전하기" 버튼을 클릭하여 
              SOC 기초 지식을 점검하고 '대응 리더\' 배지 획득에 도전해보세요!
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div>
              <h3 className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                시간 제한
              </h3>
              <p className="text-green-200 text-sm">
                각 시나리오마다 10분의 골든타임 안에 초동대응을 완료해야 합니다.
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
                <Cpu className="w-5 h-5" />
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
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-ping opacity-20"></div>
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-yellow-400 rounded-full animate-pulse opacity-30"></div>
        <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-red-400 rounded-full animate-ping opacity-15"></div>
        <div className="absolute top-3/4 left-1/5 w-1 h-1 bg-cyan-400 rounded-full animate-pulse opacity-25"></div>
        <div className="absolute top-1/6 right-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-ping opacity-20"></div>
      </div>
    </div>
  );
};

export default CourseSelection;