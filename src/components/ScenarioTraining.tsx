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
  Lightbulb,
  Shield,
  Eye,
  Database,
  Zap,
  Users,
  ArrowRight
} from 'lucide-react';

const ScenarioTraining = () => {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [stepResults, setStepResults] = useState<StepResult[]>([]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [isTrainingComplete, setIsTrainingComplete] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrectAction, setIsCorrectAction] = useState(false);
  
  // 각 단계별 선택 결과 저장
  const [stepChoices, setStepChoices] = useState<{[key: number]: any}>({});
  const [currentTool, setCurrentTool] = useState<string>('');
  const [toolData, setToolData] = useState<any>({});
  const [showToolInterface, setShowToolInterface] = useState(false);
  const [toolLoading, setToolLoading] = useState(false);

  const scenario = scenarioId ? scenarioTrainingData[parseInt(scenarioId)] : null;
  const totalSteps = 8; // 고정된 8단계

  useEffect(() => {
    if (scenario && !startTime) {
      setStartTime(new Date());
    }
  }, [scenario, startTime]);

  // SOC 도구별 인터페이스 데이터
  const getToolInterface = (stepId: number) => {
    switch (stepId) {
      case 1: // EDR Console
        return {
          toolName: 'EDR Console',
          toolIcon: '🖥️',
          color: 'purple',
          interface: {
            alerts: [
              { id: 1, severity: 'HIGH', process: 'ransomware.exe', action: 'File Encryption', time: '14:23:17', status: 'ACTIVE' },
              { id: 2, severity: 'MEDIUM', process: 'explorer.exe', action: 'Unusual File Access', time: '14:23:15', status: 'INVESTIGATING' }
            ],
            processTree: {
              parent: 'winword.exe (PID: 1234)',
              children: ['ransomware.exe (PID: 5678)', 'crypto.dll (Loaded)']
            },
            networkConnections: [
              { ip: '203.0.113.45', port: '443', protocol: 'HTTPS', status: 'ESTABLISHED', direction: 'OUTBOUND' }
            ]
          }
        };
      
      case 2: // SIEM Query Interface
        return {
          toolName: 'SIEM Query Console',
          toolIcon: '📊',
          color: 'cyan',
          interface: {
            queryHistory: [
              'source="email" AND dest="FIN-PC-07" AND attachment="*.exe"',
              'index=web_logs src_ip="FIN-PC-07" | stats count by url',
              'index=usb_logs host="FIN-PC-07" action="connect"'
            ],
            timeline: [
              { time: '14:20:33', event: 'Email received: invoice.exe attachment', source: 'Mail Server', severity: 'INFO' },
              { time: '14:22:15', event: 'File execution detected', source: 'FIN-PC-07', severity: 'WARNING' },
              { time: '14:23:17', event: 'Mass file encryption started', source: 'EDR Agent', severity: 'CRITICAL' }
            ],
            searchResults: {
              emailLogs: { count: 15, suspicious: 1 },
              webLogs: { count: 0, suspicious: 0 },
              usbLogs: { count: 0, suspicious: 0 }
            }
          }
        };
      
      case 3: // Network Security Console
        return {
          toolName: 'Network Security Console',
          toolIcon: '🌐',
          color: 'green',
          interface: {
            networkMap: {
              infected: [{ name: 'FIN-PC-07', ip: '192.168.1.107', status: 'INFECTED' }],
              clean: [
                { name: 'FIN-PC-01', ip: '192.168.1.101', status: 'CLEAN' },
                { name: 'FIN-PC-02', ip: '192.168.1.102', status: 'CLEAN' }
              ],
              isolated: []
            },
            isolationOptions: [
              { method: 'Network Cable Disconnect', time: 'Immediate', reversible: true },
              { method: 'Firewall Block', time: '30 seconds', reversible: true },
              { method: 'VLAN Quarantine', time: '2 minutes', reversible: true }
            ],
            evidenceTools: [
              { name: 'Memory Dump', status: 'Ready', size: '8GB', time: '3 min' },
              { name: 'Screen Capture', status: 'Ready', size: '2MB', time: '5 sec' },
              { name: 'Process List', status: 'Ready', size: '1MB', time: '10 sec' }
            ]
          }
        };
      
      case 4: // Digital Forensics Toolkit
        return {
          toolName: 'Digital Forensics Toolkit',
          toolIcon: '🔍',
          color: 'orange',
          interface: {
            availableTools: [
              { name: 'Volatility', version: '3.0', purpose: 'Memory Analysis' },
              { name: 'FTK Imager', version: '4.5', purpose: 'Disk Imaging' },
              { name: 'KAPE', version: '1.3', purpose: 'Artifact Collection' }
            ],
            acquisitionStatus: {
              memoryDump: { status: 'Ready', estimatedTime: '3 minutes', integrity: 'MD5 + SHA256' },
              diskImage: { status: 'Ready', estimatedTime: '45 minutes', integrity: 'Bit-by-bit copy' },
              liveArtifacts: { status: 'Ready', estimatedTime: '5 minutes', integrity: 'Hash verified' }
            },
            chainOfCustody: {
              investigator: 'SOC Analyst',
              timestamp: '2024-01-15 14:25:00',
              location: 'Finance Department',
              witness: 'IT Manager'
            }
          }
        };
      
      case 5: // Threat Intelligence Platform
        return {
          toolName: 'Threat Intelligence Platform',
          toolIcon: '🧠',
          color: 'indigo',
          interface: {
            searchQuery: {
              type: 'File Hash',
              value: 'a1b2c3d4e5f6789012345678901234567890abcd',
              status: 'Analyzing...'
            },
            threatIntel: {
              malwareFamily: 'WannaCry Variant',
              threatActor: 'Lazarus Group (APT38)',
              firstSeen: '2024-01-10 08:30:00',
              lastSeen: '2024-01-15 12:45:00',
              confidence: 'High (87%)',
              severity: 'Critical'
            },
            relatedIOCs: [
              { type: 'IP', value: '203.0.113.45', reputation: 'Malicious', sources: 5 },
              { type: 'Domain', value: 'malware-c2.evil.com', reputation: 'Malicious', sources: 8 },
              { type: 'File Hash', value: 'b2c3d4e5f6...', reputation: 'Suspicious', sources: 3 }
            ],
            campaigns: [
              { name: 'Operation Ghost', active: true, targets: 'Financial Sector' }
            ]
          }
        };
      
      case 6: // SIEM Dashboard (Impact Assessment)
        return {
          toolName: 'SIEM Impact Dashboard',
          toolIcon: '📈',
          color: 'red',
          interface: {
            impactMetrics: {
              affectedSystems: { count: 1, percentage: '0.5%' },
              encryptedFiles: { count: 1247, size: '15.6 GB' },
              affectedUsers: { count: 3, department: 'Finance' },
              downtime: { duration: '23 minutes', cost: '$12,500' }
            },
            spreadAnalysis: {
              networkSpread: 'CONTAINED',
              lateralMovement: 'NOT DETECTED',
              dataExfiltration: 'UNDER INVESTIGATION',
              persistenceMechanisms: 'NONE FOUND'
            },
            businessImpact: {
              primaryImpact: 'Finance Department Offline',
              secondaryImpact: 'Month-end Reporting Delayed',
              complianceRisk: 'Medium',
              reputationRisk: 'Low'
            }
          }
        };
      
      case 7: // SOAR Playbook Console
        return {
          toolName: 'SOAR Playbook Console',
          toolIcon: '⚡',
          color: 'yellow',
          interface: {
            recommendedPlaybooks: [
              { 
                name: 'Ransomware Incident Response', 
                steps: 12, 
                eta: '15 minutes',
                automation: '75%',
                success_rate: '94%'
              },
              { 
                name: 'Malware Containment', 
                steps: 8, 
                eta: '10 minutes',
                automation: '85%',
                success_rate: '98%'
              }
            ],
            currentExecution: {
              playbook: 'None Selected',
              progress: '0%',
              nextAction: 'Select Playbook',
              approvalRequired: true
            },
            automationCapabilities: [
              { action: 'Network Isolation', automated: true, approval: false },
              { action: 'Evidence Collection', automated: true, approval: false },
              { action: 'Threat Hunting', automated: false, approval: true },
              { action: 'System Recovery', automated: false, approval: true }
            ]
          }
        };
      
      case 8: // Incident Management System
        return {
          toolName: 'Incident Management System',
          toolIcon: '📋',
          color: 'blue',
          interface: {
            ticketInfo: {
              ticketID: 'INC-2024-0115-001',
              priority: 'P1 - Critical',
              status: 'In Progress',
              assignee: 'SOC Team Lead',
              created: '2024-01-15 14:23:30',
              sla: '4 hours remaining'
            },
            stakeholders: [
              { role: 'CEO', notified: true, acknowledged: false },
              { role: 'CISO', notified: true, acknowledged: true },
              { role: 'IT Director', notified: true, acknowledged: true },
              { role: 'Legal Counsel', notified: false, acknowledged: false }
            ],
            reportGeneration: {
              executiveSummary: 'Ready',
              technicalDetails: 'In Progress',
              lessonsLearned: 'Pending',
              actionItems: 'Draft'
            },
            communicationLog: [
              { time: '14:25', action: 'Initial notification sent', recipient: 'CISO' },
              { time: '14:30', action: 'Situation update', recipient: 'Executive Team' }
            ]
          }
        };
      
      default:
        return null;
    }
  };

  // 8단계 구성 데이터
  const getStepData = (stepId: number) => {
    const baseData = {
      who: stepChoices[5]?.attacker || "알려지지 않은 공격자",
      where: stepChoices[6]?.target || "FIN-PC-07",
      what: stepChoices[1]?.threatType || "랜섬웨어",
      when: "2024-01-15 14:23:17",
      how: stepChoices[2]?.method || "이메일 첨부파일",
      howMuch: stepChoices[7]?.impact || "회계 문서 암호화"
    };

    switch (stepId) {
      case 1: // 위협 식별
        return {
          title: "1단계: 위협 식별",
          description: "EDR 경보를 분석하여 위협 유형을 식별하세요",
          icon: <AlertTriangle className="w-6 h-6 text-red-400" />,
          data: {
            alertInfo: "FIN-PC-07에서 P1 등급 경보 발생",
            processName: "ransomware.exe",
            behavior: "대량 파일 암호화 시도",
            networkActivity: "외부 IP와 통신 중"
          },
          question: "🚨 이 경보가 나타내는 위협 유형은 무엇입니까?",
          options: [
            { id: "ransomware", label: "🔒 랜섬웨어 공격", description: "파일을 암호화하여 금전 요구" },
            { id: "spyware", label: "👁️ 스파이웨어", description: "정보 수집 및 감시" },
            { id: "ddos", label: "⚡ DDoS 공격", description: "서비스 마비 공격" },
            { id: "false_positive", label: "❌ 오탐", description: "정상적인 활동으로 판단" }
          ],
          correctAnswer: "ransomware"
        };

      case 2: // 감염 경로 추정
        return {
          title: "2단계: 감염 경로 추정",
          description: `${stepChoices[1]?.threatType || '위협'}이 어떻게 시스템에 침입했는지 추정하세요`,
          icon: <Search className="w-6 h-6 text-blue-400" />,
          data: {
            timelineInfo: "14:20 이메일 수신 → 14:22 첨부파일 실행 → 14:23 경보 발생",
            emailLogs: "invoice.exe 첨부파일이 포함된 이메일",
            browserHistory: "의심스러운 웹사이트 방문 기록 없음",
            usbActivity: "USB 연결 기록 없음"
          },
          question: "🔍 가장 가능성이 높은 감염 경로는 무엇입니까?",
          options: [
            { id: "email", label: "📧 이메일 첨부파일", description: "악성 첨부파일 실행" },
            { id: "web", label: "🌐 악성 웹사이트", description: "드라이브 바이 다운로드" },
            { id: "usb", label: "💾 USB 감염", description: "감염된 USB 연결" },
            { id: "network", label: "🌐 네트워크 침투", description: "네트워크 취약점 악용" }
          ],
          correctAnswer: "email"
        };

      case 3: // 즉시 조치 결정
        return {
          title: "3단계: 즉시 조치 결정",
          description: `${stepChoices[1]?.threatType || '위협'} 확산을 막기 위한 즉시 조치를 선택하세요`,
          icon: <Shield className="w-6 h-6 text-green-400" />,
          data: {
            currentStatus: "감염 진행 중, 파일 암호화 계속됨",
            networkStatus: "다른 시스템으로 확산 가능성 있음",
            evidenceStatus: "현재 메모리에 중요 증거 존재",
            timeConstraint: "골든타임 7분 남음"
          },
          question: "⚡ 가장 우선적으로 해야 할 조치는 무엇입니까?",
          options: [
            { id: "isolate", label: "🔌 네트워크 격리", description: "확산 방지를 위한 네트워크 차단" },
            { id: "preserve", label: "📸 증거 보존", description: "화면 캡처 및 메모리 덤프" },
            { id: "shutdown", label: "⚡ 시스템 종료", description: "즉시 전원 차단" },
            { id: "antivirus", label: "🛡️ 백신 실행", description: "악성코드 제거 시도" }
          ],
          correctAnswer: "preserve"
        };

      case 4: // 증거 수집 방법
        return {
          title: "4단계: 증거 수집 방법",
          description: `${stepChoices[3]?.action || '조치'} 후 어떤 증거를 수집해야 할까요?`,
          icon: <FileText className="w-6 h-6 text-purple-400" />,
          data: {
            availableEvidence: "메모리 덤프, 하드디스크 이미지, 네트워크 로그, 화면 캡처",
            timeLimit: "증거 수집 시간 제한: 5분",
            priority: "법정 증거 능력을 갖춘 증거 필요",
            resources: "포렌식 도구 사용 가능"
          },
          question: "📋 가장 중요한 증거는 무엇입니까?",
          options: [
            { id: "memory", label: "🧠 메모리 덤프", description: "실행 중인 악성 프로세스 정보" },
            { id: "disk", label: "💽 하드디스크 이미지", description: "전체 시스템 상태 보존" },
            { id: "network", label: "🌐 네트워크 로그", description: "외부 통신 기록" },
            { id: "screen", label: "📸 화면 캡처", description: "랜섬노트 및 현재 상태" }
          ],
          correctAnswer: "memory"
        };

      case 5: // 공격자 추적
        return {
          title: "5단계: 공격자 추적",
          description: `수집된 ${stepChoices[4]?.evidence || '증거'}를 바탕으로 공격자를 추적하세요`,
          icon: <Eye className="w-6 h-6 text-yellow-400" />,
          data: {
            ipAddress: "203.0.113.45 (외부 IP)",
            fileHash: "a1b2c3d4e5f6789012345678901234567890abcd",
            c2Server: "malware-command.evil.com",
            geolocation: "동유럽 지역으로 추정"
          },
          question: "🕵️ 이 공격의 배후는 누구일 가능성이 높습니까?",
          options: [
            { id: "apt", label: "🎯 APT 그룹", description: "국가 지원 해킹 그룹" },
            { id: "criminal", label: "💰 사이버 범죄자", description: "금전적 이익 추구" },
            { id: "insider", label: "👤 내부자", description: "내부 직원의 악의적 행위" },
            { id: "script_kiddie", label: "🔰 스크립트 키디", description: "기술력이 낮은 해커" }
          ],
          correctAnswer: "criminal"
        };

      case 6: // 피해 범위 평가
        return {
          title: "6단계: 피해 범위 평가",
          description: `${stepChoices[5]?.attacker || '공격자'}의 공격으로 인한 피해 범위를 평가하세요`,
          icon: <Target className="w-6 h-6 text-orange-400" />,
          data: {
            affectedSystems: "FIN-PC-07 (확인됨)",
            networkScan: "다른 시스템 감염 여부 조사 중",
            dataStatus: "회계 문서 1,247개 암호화됨",
            businessImpact: "재무팀 업무 중단"
          },
          question: "📊 주요 피해 대상은 무엇입니까?",
          options: [
            { id: "single_pc", label: "💻 단일 PC", description: "FIN-PC-07만 감염" },
            { id: "department", label: "🏢 부서 전체", description: "재무팀 전체 시스템" },
            { id: "network", label: "🌐 전사 네트워크", description: "회사 전체 시스템" },
            { id: "external", label: "🔗 외부 연결", description: "고객사까지 확산" }
          ],
          correctAnswer: "single_pc"
        };

      case 7: // 대응 전략 수립
        return {
          title: "7단계: 대응 전략 수립",
          description: `${stepChoices[6]?.target || '피해 범위'}에 맞는 대응 전략을 수립하세요`,
          icon: <Brain className="w-6 h-6 text-cyan-400" />,
          data: {
            availableOptions: "격리, 복구, 협상, 법적 대응",
            backupStatus: "최신 백업: 어제 23:00",
            decryptionTool: "무료 복호화 도구 없음",
            ransomAmount: "비트코인 0.5개 요구"
          },
          question: "🎯 최적의 대응 전략은 무엇입니까?",
          options: [
            { id: "restore", label: "🔄 백업 복구", description: "백업으로부터 시스템 복구" },
            { id: "negotiate", label: "💬 협상", description: "공격자와 협상 시도" },
            { id: "pay", label: "💰 몸값 지불", description: "요구 금액 지불" },
            { id: "rebuild", label: "🔨 시스템 재구축", description: "처음부터 시스템 재설치" }
          ],
          correctAnswer: "restore"
        };

      case 8: // 사후 조치
        return {
          title: "8단계: 사후 조치",
          description: `${stepChoices[7]?.strategy || '대응 전략'} 실행 후 필요한 사후 조치를 선택하세요`,
          icon: <Users className="w-6 h-6 text-indigo-400" />,
          data: {
            recoveryStatus: "시스템 복구 완료",
            securityGap: "이메일 보안 강화 필요",
            reporting: "경영진 보고 대기",
            prevention: "재발 방지 대책 수립 필요"
          },
          question: "📋 가장 중요한 사후 조치는 무엇입니까?",
          options: [
            { id: "report", label: "📊 경영진 보고", description: "사고 경위 및 대응 결과 보고" },
            { id: "security", label: "🔒 보안 강화", description: "이메일 보안 정책 개선" },
            { id: "training", label: "📚 직원 교육", description: "피싱 메일 대응 교육" },
            { id: "monitoring", label: "👁️ 모니터링 강화", description: "24시간 감시 체계 구축" }
          ],
          correctAnswer: "report"
        };

      default:
        return null;
    }
  };

  const handleChoice = (choice: any) => {
    const stepData = getStepData(currentStep);
    if (!stepData) return;

    const isCorrect = choice.id === stepData.correctAnswer;
    setIsCorrectAction(isCorrect);
    setShowFeedback(true);

    // 선택 결과 저장
    const newStepChoices = {
      ...stepChoices,
      [currentStep]: {
        ...choice,
        isCorrect,
        timestamp: new Date().toISOString()
      }
    };
    setStepChoices(newStepChoices);

    // 결과 저장
    const result: StepResult = {
      stepId: currentStep,
      status: isCorrect ? 'success' : 'failure',
      data: choice,
      timestamp: new Date().toISOString(),
      score: isCorrect ? 100 : 0
    };

    setStepResults(prev => [...prev, result]);

    if (isCorrect) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }

    // SOC 도구 인터페이스 표시
    const toolInterface = getToolInterface(currentStep);
    if (toolInterface) {
      setToolLoading(true);
      setCurrentTool(toolInterface.toolName);
      
      // 실제 도구 로딩 시뮬레이션
      setTimeout(() => {
        setToolData(toolInterface);
        setToolLoading(false);
        setShowToolInterface(true);
      }, 1500);
    }
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setShowFeedback(false);
      setIsCorrectAction(false);
      setShowToolInterface(false);
      setToolData({});
      setCurrentTool('');
    } else {
      // 훈련 완료
      setIsTrainingComplete(true);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setShowFeedback(false);
      setIsCorrectAction(false);
      setShowToolInterface(false);
      setToolData({});
      setCurrentTool('');
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
            
            <div className="bg-black/50 backdrop-blur-sm border border-green-500/30 rounded-lg p-8 mb-8 max-w-4xl mx-auto">
              <div className="text-4xl mb-4">
                {completedSteps.length} / {totalSteps}
              </div>
              <div className="text-xl text-green-300 mb-6">
                완료율: {Math.round(completionRate)}%
              </div>
              
              {/* 6하 원칙 결과 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <p className="text-yellow-300 font-bold">누가 (Who)</p>
                  <p className="text-green-200 text-sm">{stepChoices[5]?.label || '미확인'}</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <p className="text-yellow-300 font-bold">무엇을 (What)</p>
                  <p className="text-green-200 text-sm">{stepChoices[1]?.label || '미확인'}</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <p className="text-yellow-300 font-bold">언제 (When)</p>
                  <p className="text-green-200 text-sm">2024-01-15 14:23:17</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <p className="text-yellow-300 font-bold">어디서 (Where)</p>
                  <p className="text-green-200 text-sm">{stepChoices[6]?.label || '미확인'}</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <p className="text-yellow-300 font-bold">어떻게 (How)</p>
                  <p className="text-green-200 text-sm">{stepChoices[2]?.label || '미확인'}</p>
                </div>
                <div className="bg-gray-800/50 p-4 rounded-lg">
                  <p className="text-yellow-300 font-bold">얼마나 (How much)</p>
                  <p className="text-green-200 text-sm">{stepChoices[7]?.label || '미확인'}</p>
                </div>
              </div>
              
              <div className="text-lg text-yellow-300">
                획득 배지: {badge === 'leader' ? '🏆 대응 리더' : badge === 'competent' ? '🥈 유능한 분석가' : '🥉 훈련생'}
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

  const currentStepData = getStepData(currentStep);

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

        {/* 진행상황 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-blue-400">진행 상황</h2>
            <span className="text-green-400 font-bold">
              {currentStep} / {totalSteps}
            </span>
          </div>
          <div className="flex gap-2 mb-4">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i + 1}
                className={`flex-1 h-3 rounded-full transition-all duration-300 ${
                  completedSteps.includes(i + 1)
                    ? 'bg-green-500'
                    : i + 1 === currentStep
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
              <div className="flex items-center gap-4">
                <div className="bg-yellow-500 text-black rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg">
                  {currentStep}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-yellow-400 flex items-center gap-3">
                    {currentStepData.icon}
                    {currentStepData.title}
                  </h2>
                  <p className="text-green-200 text-lg mt-2">{currentStepData.description}</p>
                </div>
              </div>
            </div>

            {/* 수집된 정보 */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-cyan-400 mb-3">📊 수집된 정보</h3>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  {Object.entries(currentStepData.data).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-yellow-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="text-green-200">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 질문 및 선택지 */}
            {!showFeedback && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-green-300 mb-4">{currentStepData.question}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentStepData.options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleChoice(option)}
                        className="p-4 rounded-lg border-2 border-gray-600 bg-gray-800/30 hover:border-yellow-400 hover:bg-yellow-900/20 transition-all duration-300 text-left group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="text-2xl">{option.label.split(' ')[0]}</div>
                          <div>
                            <div className="font-bold text-green-300 group-hover:text-yellow-300 transition-colors">
                              {option.label.substring(2)}
                            </div>
                            <div className="text-sm text-gray-400 mt-1">
                              {option.description}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 피드백 */}
            {showFeedback && (
              <div className="space-y-6">
                {/* SOC 도구 로딩 */}
                {toolLoading && (
                  <div className="bg-gray-800/50 border border-blue-500/30 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                      <h3 className="text-lg font-bold text-blue-400">SOC 도구 연결 중...</h3>
                    </div>
                    <div className="bg-black/50 p-4 rounded-lg font-mono text-sm">
                      <div className="text-green-400 mb-2">
                        {'>'} {currentTool} 초기화 중...
                      </div>
                      <div className="space-y-1 text-gray-400">
                        <div>{'>'} 보안 연결 설정...</div>
                        <div>{'>'} 데이터 동기화...</div>
                        <div>{'>'} 인터페이스 로딩...</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* SOC 도구 인터페이스 */}
                {showToolInterface && toolData && (
                  <div className={`bg-gray-800/50 border border-${toolData.color}-500/30 rounded-lg p-6`}>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{toolData.toolIcon}</span>
                      <h3 className={`text-xl font-bold text-${toolData.color}-400`}>
                        {toolData.toolName}
                      </h3>
                      <div className={`px-2 py-1 bg-${toolData.color}-900/30 text-${toolData.color}-300 text-xs rounded-full`}>
                        CONNECTED
                      </div>
                    </div>

                    {/* 도구별 인터페이스 렌더링 */}
                    <div className="bg-black/50 p-4 rounded-lg">
                      {currentStep === 1 && toolData.interface && (
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-purple-300 font-bold mb-2">🚨 Active Alerts</h4>
                            <div className="space-y-2">
                              {toolData.interface.alerts?.map((alert: any, idx: number) => (
                                <div key={idx} className={`p-2 rounded border-l-4 ${
                                  alert.severity === 'HIGH' ? 'border-red-500 bg-red-900/20' : 'border-yellow-500 bg-yellow-900/20'
                                }`}>
                                  <div className="flex justify-between items-center">
                                    <span className="font-mono text-sm">{alert.process}</span>
                                    <span className={`px-2 py-1 rounded text-xs ${
                                      alert.severity === 'HIGH' ? 'bg-red-600 text-white' : 'bg-yellow-600 text-white'
                                    }`}>
                                      {alert.severity}
                                    </span>
                                  </div>
                                  <div className="text-gray-300 text-xs mt-1">{alert.action} at {alert.time}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-purple-300 font-bold mb-2">🌳 Process Tree</h4>
                            <div className="font-mono text-sm text-green-300">
                              <div>└─ {toolData.interface.processTree?.parent}</div>
                              {toolData.interface.processTree?.children?.map((child: string, idx: number) => (
                                <div key={idx} className="ml-4">├─ {child}</div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {currentStep === 2 && toolData.interface && (
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-cyan-300 font-bold mb-2">📊 Query Results</h4>
                            <div className="grid grid-cols-3 gap-4">
                              <div className="text-center p-2 bg-gray-700/50 rounded">
                                <div className="text-2xl font-bold text-green-400">{toolData.interface.searchResults?.emailLogs?.suspicious}</div>
                                <div className="text-xs text-gray-400">Suspicious Emails</div>
                              </div>
                              <div className="text-center p-2 bg-gray-700/50 rounded">
                                <div className="text-2xl font-bold text-gray-400">{toolData.interface.searchResults?.webLogs?.suspicious}</div>
                                <div className="text-xs text-gray-400">Web Threats</div>
                              </div>
                              <div className="text-center p-2 bg-gray-700/50 rounded">
                                <div className="text-2xl font-bold text-gray-400">{toolData.interface.searchResults?.usbLogs?.suspicious}</div>
                                <div className="text-xs text-gray-400">USB Infections</div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-cyan-300 font-bold mb-2">⏰ Timeline Analysis</h4>
                            <div className="space-y-2">
                              {toolData.interface.timeline?.map((event: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-3 p-2 bg-gray-700/30 rounded">
                                  <span className="font-mono text-xs text-yellow-400">{event.time}</span>
                                  <span className="text-sm text-green-300">{event.event}</span>
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    event.severity === 'CRITICAL' ? 'bg-red-600' : 
                                    event.severity === 'WARNING' ? 'bg-yellow-600' : 'bg-blue-600'
                                  } text-white`}>
                                    {event.severity}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {currentStep === 3 && toolData.interface && (
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-green-300 font-bold mb-2">🗺️ Network Map</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-red-400 font-bold mb-2">🔴 Infected Systems</div>
                                {toolData.interface.networkMap?.infected?.map((system: any, idx: number) => (
                                  <div key={idx} className="p-2 bg-red-900/20 border border-red-500/30 rounded">
                                    <div className="font-mono text-sm">{system.name}</div>
                                    <div className="text-xs text-gray-400">{system.ip}</div>
                                  </div>
                                ))}
                              </div>
                              <div>
                                <div className="text-green-400 font-bold mb-2">🟢 Clean Systems</div>
                                {toolData.interface.networkMap?.clean?.slice(0, 2).map((system: any, idx: number) => (
                                  <div key={idx} className="p-2 bg-green-900/20 border border-green-500/30 rounded mb-1">
                                    <div className="font-mono text-sm">{system.name}</div>
                                    <div className="text-xs text-gray-400">{system.ip}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {currentStep === 4 && toolData.interface && (
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-orange-300 font-bold mb-2">🔧 Available Tools</h4>
                            <div className="grid grid-cols-3 gap-2">
                              {toolData.interface.availableTools?.map((tool: any, idx: number) => (
                                <div key={idx} className="p-2 bg-gray-700/50 rounded text-center">
                                  <div className="font-bold text-sm">{tool.name}</div>
                                  <div className="text-xs text-gray-400">{tool.purpose}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-orange-300 font-bold mb-2">📦 Evidence Collection Status</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center p-2 bg-green-900/20 rounded">
                                <span>Memory Dump</span>
                                <span className="text-green-400 font-bold">READY</span>
                              </div>
                              <div className="flex justify-between items-center p-2 bg-blue-900/20 rounded">
                                <span>Chain of Custody</span>
                                <span className="text-blue-400 font-bold">VERIFIED</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {currentStep === 5 && toolData.interface && (
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-indigo-300 font-bold mb-2">🔍 Threat Analysis</h4>
                            <div className="p-3 bg-red-900/20 border border-red-500/30 rounded">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <div className="text-red-400 font-bold">{toolData.interface.threatIntel?.malwareFamily}</div>
                                  <div className="text-sm text-gray-300">Threat Actor: {toolData.interface.threatIntel?.threatActor}</div>
                                </div>
                                <div>
                                  <div className="text-yellow-400 font-bold">Confidence: {toolData.interface.threatIntel?.confidence}</div>
                                  <div className="text-sm text-gray-300">Severity: {toolData.interface.threatIntel?.severity}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-indigo-300 font-bold mb-2">🎯 Related IOCs</h4>
                            <div className="space-y-1">
                              {toolData.interface.relatedIOCs?.slice(0, 2).map((ioc: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center p-2 bg-gray-700/30 rounded">
                                  <span className="font-mono text-sm">{ioc.value}</span>
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    ioc.reputation === 'Malicious' ? 'bg-red-600' : 'bg-yellow-600'
                                  } text-white`}>
                                    {ioc.reputation}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {currentStep === 6 && toolData.interface && (
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-red-300 font-bold mb-2">📊 Impact Metrics</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-3 bg-red-900/20 rounded">
                                <div className="text-2xl font-bold text-red-400">{toolData.interface.impactMetrics?.affectedSystems?.count}</div>
                                <div className="text-sm text-gray-300">Affected Systems</div>
                              </div>
                              <div className="p-3 bg-yellow-900/20 rounded">
                                <div className="text-2xl font-bold text-yellow-400">{toolData.interface.impactMetrics?.encryptedFiles?.count}</div>
                                <div className="text-sm text-gray-300">Encrypted Files</div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-red-300 font-bold mb-2">🏢 Business Impact</h4>
                            <div className="p-3 bg-gray-700/30 rounded">
                              <div className="text-orange-400 font-bold">{toolData.interface.businessImpact?.primaryImpact}</div>
                              <div className="text-sm text-gray-300 mt-1">{toolData.interface.businessImpact?.secondaryImpact}</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {currentStep === 7 && toolData.interface && (
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-yellow-300 font-bold mb-2">📋 Recommended Playbooks</h4>
                            <div className="space-y-2">
                              {toolData.interface.recommendedPlaybooks?.map((playbook: any, idx: number) => (
                                <div key={idx} className="p-3 bg-yellow-900/20 border border-yellow-500/30 rounded">
                                  <div className="flex justify-between items-center">
                                    <div>
                                      <div className="font-bold text-yellow-300">{playbook.name}</div>
                                      <div className="text-sm text-gray-300">{playbook.steps} steps • {playbook.eta}</div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-green-400 font-bold">{playbook.success_rate}</div>
                                      <div className="text-xs text-gray-400">Success Rate</div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {currentStep === 8 && toolData.interface && (
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-blue-300 font-bold mb-2">🎫 Incident Ticket</h4>
                            <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <div className="text-blue-400 font-bold">{toolData.interface.ticketInfo?.ticketID}</div>
                                  <div className="text-sm text-gray-300">{toolData.interface.ticketInfo?.priority}</div>
                                </div>
                                <div>
                                  <div className="text-green-400 font-bold">{toolData.interface.ticketInfo?.status}</div>
                                  <div className="text-sm text-gray-300">SLA: {toolData.interface.ticketInfo?.sla}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-blue-300 font-bold mb-2">👥 Stakeholder Notifications</h4>
                            <div className="space-y-1">
                              {toolData.interface.stakeholders?.slice(0, 3).map((stakeholder: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center p-2 bg-gray-700/30 rounded">
                                  <span>{stakeholder.role}</span>
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    stakeholder.acknowledged ? 'bg-green-600' : 'bg-yellow-600'
                                  } text-white`}>
                                    {stakeholder.acknowledged ? 'ACKNOWLEDGED' : 'PENDING'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className={`p-6 rounded-lg border-2 ${
                  isCorrectAction 
                    ? 'border-green-500 bg-green-900/20' 
                    : 'border-orange-500 bg-orange-900/20'
                }`}>
                  <div className="flex items-center gap-3 mb-4">
                    {isCorrectAction ? (
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    ) : (
                      <XCircle className="w-8 h-8 text-orange-400" />
                    )}
                    <h3 className="text-xl font-bold text-yellow-400">
                      {isCorrectAction ? '✅ 정답입니다!' : '⚠️ 다시 생각해보세요'}
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-bold text-cyan-400 mb-3">📊 당신의 선택</h4>
                      <div className="bg-gray-800/50 p-4 rounded-lg">
                        <p className="font-bold text-green-300">{stepChoices[currentStep]?.label}</p>
                        <p className="text-sm text-gray-300 mt-2">{stepChoices[currentStep]?.description}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-bold text-green-400 mb-3">✅ 전문가 해설</h4>
                      <div className="bg-gray-800/50 p-4 rounded-lg">
                        <p className={`font-bold ${isCorrectAction ? 'text-green-300' : 'text-orange-300'}`}>
                          {isCorrectAction 
                            ? '올바른 판단입니다. 이 선택이 최적의 대응입니다.'
                            : '이 상황에서는 다른 접근이 더 효과적일 수 있습니다.'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

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

                  <button
                    onClick={handleNextStep}
                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300"
                  >
                    {currentStep === totalSteps ? '훈련 완료' : '다음 단계'}
                    {currentStep < totalSteps ? (
                      <ArrowRight className="w-5 h-5" />
                    ) : (
                      <Award className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScenarioTraining;