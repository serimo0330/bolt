import { ScenarioTraining } from '../types/training';

export const scenarioTrainingData: { [key: number]: ScenarioTraining } = {
  1: {
    scenarioId: 1,
    steps: [
      {
        id: 1,
        title: "EDR P1 경보 확인",
        description: "FIN-PC-07에서 발생한 랜섬웨어 탐지 경보를 확인하세요",
        tool: 'edr',
        action: 'click',
        expectedResult: "경보 상세 정보 확인",
        feedback: {
          success: "✅ 경보 확인 완료. FIN-PC-07에서 WannaCry 변종 탐지됨",
          failure: "❌ 경보를 먼저 확인해주세요"
        },
        data: {
          alertDetails: "FIN-PC-07 WannaCry 변종 탐지",
          timestamp: "2024-01-15 14:23:17",
          severity: "P1",
          processName: "ransomware.exe"
        }
      },
      {
        id: 2,
        title: "현장 증거 보존",
        description: "PC 전원을 유지하고 화면을 촬영하세요",
        tool: 'physical',
        action: 'confirm',
        expectedResult: "증거 보존 완료",
        feedback: {
          success: "✅ 증거 보존 완료. 랜섬노트 화면 캡처됨",
          failure: "❌ 전원을 끄면 메모리 증거가 손실됩니다"
        },
        data: {
          evidenceType: "screen_capture",
          location: "FIN-PC-07",
          preservedData: "랜섬노트 화면, 실행 중인 프로세스"
        }
      },
      {
        id: 3,
        title: "네트워크 케이블 물리적 분리",
        description: "감염 확산 방지를 위해 네트워크 케이블을 분리하세요",
        tool: 'physical',
        action: 'confirm',
        expectedResult: "네트워크 격리 완료",
        feedback: {
          success: "✅ 네트워크 격리 완료. 랜섬웨어 확산 차단됨",
          failure: "❌ 네트워크 연결 상태에서는 확산 위험이 있습니다"
        },
        data: {
          isolationType: "physical_disconnect",
          status: "isolated",
          timestamp: "2024-01-15 14:25:30"
        }
      },
      {
        id: 4,
        title: "메모리 덤프 수집",
        description: "volatility 도구를 사용하여 메모리 덤프를 수집하세요",
        tool: 'physical',
        action: 'confirm',
        expectedResult: "메모리 덤프 수집 완료",
        feedback: {
          success: "✅ 메모리 덤프 수집 완료. 악성 프로세스 정보 확보됨",
          failure: "❌ 메모리 덤프 수집이 필요합니다"
        },
        data: {
          dumpFile: "FIN-PC-07_memory_dump.raw",
          size: "8GB",
          maliciousProcesses: ["ransomware.exe", "crypto.dll"]
        }
      },
      {
        id: 5,
        title: "SIEM 쿼리 작성하여 최초 감염 경로 추적",
        description: "SIEM에서 FIN-PC-07의 최초 감염 경로를 추적하세요",
        tool: 'siem',
        action: 'query',
        expectedResult: "감염 경로 식별",
        feedback: {
          success: "✅ 감염 경로 확인. 이메일 첨부파일을 통한 감염으로 판단됨",
          failure: "❌ 올바른 쿼리를 작성해주세요"
        },
        data: {
          query: 'source="email" AND dest="FIN-PC-07" AND attachment="*.exe"',
          result: "악성 이메일 첨부파일 (invoice.exe) 실행",
          sourceIP: "203.0.113.45",
          infectionVector: "email_attachment"
        }
      },
      {
        id: 6,
        title: "악성 파일 해시값 TIP 조회",
        description: "수집된 악성 파일의 해시값을 TIP에서 조회하세요",
        tool: 'tip',
        action: 'input',
        expectedResult: "악성 파일 정보 확인",
        feedback: {
          success: "✅ 악성 파일 확인. WannaCry 변종으로 식별됨",
          failure: "❌ 해시값을 정확히 입력해주세요"
        },
        data: {
          fileHash: "a1b2c3d4e5f6789012345678901234567890abcd",
          malwareFamily: "WannaCry 변종",
          threatLevel: "High",
          firstSeen: "2024-01-10"
        }
      },
      {
        id: 7,
        title: "랜섬웨어 초기 대응 플레이북 실행",
        description: "적절한 대응 플레이북을 선택하고 실행하세요",
        tool: 'soar',
        action: 'select',
        expectedResult: "플레이북 실행 완료",
        feedback: {
          success: "✅ 랜섬웨어 초기 대응 플레이북 실행 완료",
          failure: "❌ 올바른 플레이북을 선택해주세요"
        },
        data: {
          playbookName: "랜섬웨어 초기 대응",
          actions: ["격리", "백업 확인", "복구 준비"],
          status: "executed"
        }
      },
      {
        id: 8,
        title: "침해사고분석팀 이관",
        description: "수집된 증거와 분석 결과를 침해사고분석팀에 이관하세요",
        tool: 'communication',
        action: 'confirm',
        expectedResult: "이관 완료",
        feedback: {
          success: "✅ 침해사고분석팀 이관 완료. 심층 분석 시작됨",
          failure: "❌ 이관 절차를 완료해주세요"
        },
        data: {
          transferredData: ["메모리 덤프", "악성 파일", "감염 경로 분석"],
          assignedTeam: "침해사고분석팀",
          ticketNumber: "INC-2024-0115-001"
        }
      }
    ],
    completionCriteria: {
      timeLimit: 600, // 10분
      requiredSteps: [1, 2, 3, 4, 5, 6, 7, 8],
      optionalSteps: []
    }
  },
  2: {
    scenarioId: 2,
    steps: [
      {
        id: 1,
        title: "DLP P2 경보 확인",
        description: "대용량 파일 외부 전송 탐지 경보를 확인하세요",
        tool: 'edr',
        action: 'click',
        expectedResult: "DLP 경보 상세 정보 확인",
        feedback: {
          success: "✅ DLP 경보 확인 완료. 대용량 파일 외부 전송 탐지됨",
          failure: "❌ 경보를 먼저 확인해주세요"
        },
        data: {
          alertType: "DLP_DATA_EXFILTRATION",
          user: "dkim@company.com",
          fileCount: 23,
          totalSize: "156MB"
        }
      },
      {
        id: 2,
        title: "SIEM에서 dkim 계정 활동 로그 검색",
        description: "SIEM에서 해당 직원의 계정 활동을 분석하세요",
        tool: 'siem',
        action: 'query',
        expectedResult: "계정 활동 로그 확인",
        feedback: {
          success: "✅ 계정 활동 분석 완료. 비정상적인 파일 접근 패턴 발견",
          failure: "❌ 올바른 쿼리를 작성해주세요"
        },
        data: {
          query: 'user="dkim" AND action="file_access" AND time="last_24h"',
          suspiciousActivity: "새벽 시간대 기밀 파일 대량 접근",
          accessedFiles: ["신제품_전략.docx", "마케팅_계획.pptx"]
        }
      },
      {
        id: 3,
        title: "파일 업로드 시간대 및 파일명 목록 확인",
        description: "업로드된 파일의 상세 정보를 확인하세요",
        tool: 'siem',
        action: 'analyze',
        expectedResult: "업로드 파일 목록 확인",
        feedback: {
          success: "✅ 업로드 파일 목록 확인 완료. 기밀 문서 23개 식별됨",
          failure: "❌ 파일 목록을 확인해주세요"
        },
        data: {
          uploadTime: "2024-01-15 09:45:33",
          destination: "personal_google_drive",
          fileList: ["신제품_전략.docx", "경쟁사_분석.xlsx", "마케팅_예산.pdf"]
        }
      },
      {
        id: 4,
        title: "해당 직원 PC 원격 접속하여 브라우저 히스토리 확인",
        description: "직원 PC의 브라우저 히스토리를 확인하세요",
        tool: 'edr',
        action: 'analyze',
        expectedResult: "브라우저 히스토리 확인",
        feedback: {
          success: "✅ 브라우저 히스토리 확인 완료. Google Drive 접속 기록 발견",
          failure: "❌ 브라우저 히스토리를 확인해주세요"
        },
        data: {
          browserHistory: ["drive.google.com", "gmail.com"],
          uploadActivity: "개인 Google Drive에 회사 파일 업로드",
          timeRange: "09:30-10:00"
        }
      },
      {
        id: 5,
        title: "상급자(마케팅 팀장) 긴급 보고",
        description: "마케팅 팀장에게 상황을 긴급 보고하세요",
        tool: 'communication',
        action: 'confirm',
        expectedResult: "상급자 보고 완료",
        feedback: {
          success: "✅ 마케팅 팀장 보고 완료. 추가 조치 지시 받음",
          failure: "❌ 상급자 보고가 필요합니다"
        },
        data: {
          reportedTo: "마케팅 팀장",
          reportTime: "2024-01-15 10:15:00",
          response: "즉시 계정 정지 및 법무팀 협조 요청"
        }
      },
      {
        id: 6,
        title: "법무팀 협조 요청 티켓 생성",
        description: "법무팀에 협조 요청 티켓을 생성하세요",
        tool: 'communication',
        action: 'confirm',
        expectedResult: "법무팀 협조 요청 완료",
        feedback: {
          success: "✅ 법무팀 협조 요청 티켓 생성 완료",
          failure: "❌ 법무팀 협조 요청이 필요합니다"
        },
        data: {
          ticketNumber: "LEGAL-2024-0115-001",
          requestType: "내부 정보 유출 사건 처리",
          urgency: "High"
        }
      },
      {
        id: 7,
        title: "계정 임시 비활성화 조치",
        description: "해당 직원의 계정을 임시 비활성화하세요",
        tool: 'soar',
        action: 'select',
        expectedResult: "계정 비활성화 완료",
        feedback: {
          success: "✅ 계정 비활성화 완료. 추가 유출 차단됨",
          failure: "❌ 계정 비활성화가 필요합니다"
        },
        data: {
          account: "dkim@company.com",
          action: "temporary_disable",
          reason: "정보 유출 의심"
        }
      },
      {
        id: 8,
        title: "내부 정보 유출 대응 플레이북 실행",
        description: "내부 정보 유출 대응 플레이북을 실행하세요",
        tool: 'soar',
        action: 'select',
        expectedResult: "플레이북 실행 완료",
        feedback: {
          success: "✅ 내부 정보 유출 대응 플레이북 실행 완료",
          failure: "❌ 올바른 플레이북을 선택해주세요"
        },
        data: {
          playbookName: "내부 정보 유출 대응",
          actions: ["계정 정지", "접근 로그 수집", "법무 협조"],
          status: "executed"
        }
      },
      {
        id: 9,
        title: "유출 파일 목록 법무팀 전달",
        description: "유출된 파일 목록을 법무팀에 전달하세요",
        tool: 'communication',
        action: 'confirm',
        expectedResult: "파일 목록 전달 완료",
        feedback: {
          success: "✅ 유출 파일 목록 법무팀 전달 완료",
          failure: "❌ 파일 목록 전달이 필요합니다"
        },
        data: {
          deliveredTo: "법무팀",
          fileCount: 23,
          classification: "기밀",
          legalAction: "손해 배상 검토"
        }
      }
    ],
    completionCriteria: {
      timeLimit: 600,
      requiredSteps: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      optionalSteps: []
    }
  }
  // 나머지 시나리오들도 동일한 패턴으로 구성...
};