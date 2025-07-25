// A코스용 기존 시나리오 데이터 (기본 SOC 운영)
export const traditionalScenarios = [
  {
    id: 1,
    title: "랜섬웨어 감염",
    priority: "P1",
    role: "현장 조치 담당자",
    situation: "재무팀 PC가 랜섬웨어에 감염되어 모든 회계 문서가 암호화되었고, 업무가 중단되었습니다. 화면에는 데이터를 공개하겠다는 협박 메시지와 함께 비트코인을 요구하는 랜섬노트가 떠 있습니다.",
    flow: "EDR 경보 확인 → 감염된 PC 네트워크 격리 → 메모리 덤프 및 악성 파일 수집 → SIEM에서 공격 경로 추적 → '랜섬웨어 초기 대응' 플레이북 실행",
    flow: "1단계: EDR P1 경보 확인 (FIN-PC-07 랜섬웨어 탐지) → 2단계: 현장 증거 보존 (PC 전원 유지, 화면 촬영) → 3단계: 네트워크 케이블 물리적 분리 → 4단계: 메모리 덤프 수집 (volatility 도구 사용) → 5단계: SIEM 쿼리 작성하여 최초 감염 경로 추적 → 6단계: 악성 파일 해시값 TIP 조회 → 7단계: '랜섬웨어 초기 대응' 플레이북 실행 → 8단계: 침해사고분석팀 이관",
    result: "감염된 PC가 네트워크에서 격리되어 랜섬웨어의 내부 확산이 차단되었습니다. 확보된 메모리 덤프와 악성 파일은 심층 분석을 위해 침해사고분석팀으로 이관되었습니다.",
    analysis: {
      who: "203.0.113.45 (공격자 IP)",
      where: "FIN-PC-07 (재무팀 PC)",
      what: "WannaCry 변종 랜섬웨어",
      when: "2024-01-15 14:23:17",
      how: "이메일 첨부파일 (악성 매크로)",
      howMuch: "회계 문서 1,247개 암호화",
      severity: "P1 (긴급)"
    }
  },
  {
    id: 2,
    title: "내부 정보 유출 의심",
    priority: "P2",
    role: "커뮤니케이터",
    situation: "마케팅팀 직원의 PC에서 차기 신제품 출시 전략 등 핵심 영업기밀이 외부 클라우드 스토리지로 대량 유출된 정황이 포착되었습니다.",
    flow: "DLP 경보 확인 → 해당 직원 계정 활동 로그 분석 → 업로드된 파일 목록 확인 → 상급자 및 법무팀 보고 → '내부 정보 유출 대응' 플레이북 실행",
    flow: "1단계: DLP P2 경보 확인 (대용량 파일 외부 전송 탐지) → 2단계: SIEM에서 dkim 계정 활동 로그 검색 → 3단계: 파일 업로드 시간대 및 파일명 목록 확인 → 4단계: 해당 직원 PC 원격 접속하여 브라우저 히스토리 확인 → 5단계: 상급자(마케팅 팀장) 긴급 보고 → 6단계: 법무팀 협조 요청 티켓 생성 → 7단계: 계정 임시 비활성화 조치 → 8단계: '내부 정보 유출 대응' 플레이북 실행 → 9단계: 유출 파일 목록 법무팀 전달",
    result: "유출에 사용된 계정이 비활성화되고 관련 PC들이 격리되어 추가적인 정보 유출이 차단되었습니다. 법무팀에 관련 내용이 전달되어 후속 조치를 준비합니다.",
    analysis: {
      who: "dkim@company.com (내부 직원)",
      where: "MKT-PC-12 (마케팅팀 PC)",
      what: "기밀 문서 무단 유출",
      when: "2024-01-15 09:45:33",
      how: "개인 Google Drive 업로드",
      howMuch: "기밀 문서 23개 (총 156MB)",
      severity: "P2 (높음)"
    }
  },
  {
    id: 3,
    title: "SQL 인젝션 및 데이터 유출",
    priority: "P1",
    role: "분석 및 검색 담당자",
    situation: "쇼핑몰 고객 DB가 SQL 인젝션 공격을 받아 고객 15만 명의 개인정보가 탈취되었습니다. 법적 문제 및 기업 이미지 실추가 우려됩니다.",
    flow: "WAF 경보 확인 → 웹 서버 로그에서 악성 SQL 쿼리 분석 → DB 접근 로그 확인 → 유출된 데이터 범위 파악 → '웹 공격 대응' 플레이북 실행",
    flow: "1단계: WAF P1 경보 확인 (SQL 인젝션 패턴 탐지) → 2단계: 웹 서버 access.log에서 악성 요청 URL 분석 → 3단계: SIEM 쿼리로 공격자 IP의 모든 요청 추적 → 4단계: DB 서버 접속하여 쿼리 실행 로그 확인 → 5단계: SELECT 쿼리 결과로 유출 데이터 범위 산정 → 6단계: 공격자 IP 방화벽 긴급 차단 → 7단계: WAF에 SQL 인젝션 차단 정책 추가 → 8단계: 개발팀에 취약점 패치 요청 → 9단계: '웹 공격 대응' 플레이북 실행 → 10단계: 개인정보보호위원회 신고 준비",
    result: "공격에 사용된 IP가 방화벽에서 차단되었고, 웹방화벽(WAF)에 해당 공격 패턴을 차단하는 긴급 정책이 적용되었습니다. 개발팀에 취약점 패치가 요청되었습니다.",
    analysis: {
      who: "198.51.100.77 (공격자 IP)",
      where: "WEB-SRV-01 (쇼핑몰 웹서버)",
      what: "SQL 인젝션 공격",
      when: "2024-01-15 02:15:44",
      how: "상품 검색 파라미터 취약점 악용",
      howMuch: "고객 개인정보 150,000건 유출",
      severity: "P1 (긴급)"
    }
  },
  {
    id: 4,
    title: "스피어 피싱 및 계정 탈취",
    priority: "P2",
    role: "분석 및 검색 담당자",
    situation: "임원 대상 스피어 피싱으로 이메일 계정이 탈취되었습니다. 공격자가 이 계정으로 2차 피해를 유발하고 있습니다.",
    flow: "이메일 보안 시스템 경보 확인 → 피싱 메일 분석 → 탈취된 계정의 로그인 기록 추적 → 2차 피해 범위 확인 → '계정 탈취 대응' 플레이북 실행",
    flow: "1단계: 이메일 보안 시스템 P2 경보 확인 → 2단계: 피싱 메일 원본 확보 및 첨부파일/URL 분석 → 3단계: SIEM에서 jlee 계정 로그인 기록 검색 → 4단계: 비정상적인 해외 IP 로그인 확인 → 5단계: 해당 계정으로 발송된 이메일 목록 확인 → 6단계: 2차 피싱 메일 발송 여부 점검 → 7단계: 계정 비밀번호 강제 변경 → 8단계: 모든 활성 세션 강제 종료 → 9단계: 전사 피싱 주의 공지 발송 → 10단계: '계정 탈취 대응' 플레이북 실행 → 11단계: 임원 PC EDR 점검",
    result: "탈취된 임원 계정의 비밀번호가 강제 변경되고 모든 활성 세션이 종료되어 공격자의 접근이 차단되었습니다. 전사에 유사 피싱 메일에 대한 주의 공지가 발송되었습니다.",
    analysis: {
      who: "185.220.101.42 (공격자 IP)",
      where: "jlee@company.com (임원 이메일 계정)",
      what: "스피어 피싱 및 계정 탈취",
      when: "2024-01-15 11:30:22",
      how: "가짜 Microsoft 로그인 페이지",
      howMuch: "임원 이메일 1개 계정 탈취",
      severity: "P2 (높음)"
    }
  },
  {
    id: 5,
    title: "워터링 홀 공격",
    priority: "P2",
    role: "분석 및 검색 담당자",
    situation: "개발자들이 자주 방문하는 커뮤니티가 해킹되어, 접속한 다수 개발자 PC가 악성코드에 감염되었습니다. 회사의 핵심 기술 자산이 유출될 위험에 처했습니다.",
    flow: "EDR 다중 경보 확인 → 공통 감염 경로 분석 → 악성 웹사이트 식별 → 감염된 PC들 격리 → '워터링 홀 대응' 플레이북 실행",
    flow: "1단계: EDR에서 다중 P2 경보 확인 (3대 PC 동시 악성코드 탐지) → 2단계: 감염 시간대 분석으로 공통 패턴 확인 → 3단계: 각 PC의 웹 브라우저 히스토리 수집 → 4단계: 공통 방문 사이트 'dev-community.com' 식별 → 5단계: 해당 사이트의 악성 스크립트 분석 → 6단계: 감염된 PC 3대 네트워크 격리 → 7단계: 프록시 서버에서 해당 사이트 접속 차단 → 8단계: 개발팀 전체에 주의 공지 → 9단계: '워터링 홀 대응' 플레이북 실행 → 10단계: 소스코드 저장소 접근 권한 점검",
    result: "감염된 PC들이 격리되었고, 악성코드 유포지로 확인된 웹사이트는 전사 프록시에서 접속이 차단되었습니다.",
    analysis: {
      who: "dev-community-hacker (해킹 그룹)",
      where: "DEV-PC-03, DEV-PC-07, DEV-PC-11 (개발팀 PC들)",
      what: "워터링 홀 공격",
      when: "2024-01-15 16:45:12",
      how: "개발자 커뮤니티 사이트 감염",
      howMuch: "개발팀 PC 3대 감염",
      severity: "P2 (높음)"
    }
  },
  {
    id: 6,
    title: "무차별 대입 공격 (Brute Force)",
    priority: "P3",
    role: "분석 및 검색 담당자",
    situation: "VPN 서버 관리자 계정에 대해 무차별 대입 공격이 발생 중입니다. 계정 탈취 시 내부망 전체가 장악될 수 있습니다.",
    flow: "VPN 로그 분석 → 공격 패턴 및 소스 IP 확인 → 로그인 실패 횟수 집계 → 공격자 IP 차단 → '무차별 대입 공격 대응' 플레이북 실행",
    flow: "1단계: VPN 서버 P3 경보 확인 (로그인 실패 임계치 초과) → 2단계: VPN 로그에서 admin 계정 로그인 시도 기록 분석 → 3단계: SIEM 쿼리로 공격자 IP별 시도 횟수 집계 → 4단계: 공격 패턴 분석 (사전 공격 vs 무작위) → 5단계: 공격자 IP 203.0.113.88 방화벽 차단 → 6단계: admin 계정 임시 잠금 처리 → 7단계: VPN 접속 정책 강화 (계정 잠금 임계치 조정) → 8단계: '무차별 대입 공격 대응' 플레이북 실행 → 9단계: 관리자 계정 2FA 설정 권고",
    result: "공격자 IP가 방화벽에서 차단되었고, 공격 대상이 된 계정은 보안을 위해 임시 잠금 조치되었습니다.",
    analysis: {
      who: "203.0.113.88 (공격자 IP)",
      where: "VPN-SRV-01 (VPN 서버)",
      what: "무차별 대입 공격",
      when: "2024-01-15 20:12:35",
      how: "관리자 계정 패스워드 무차별 시도",
      howMuch: "로그인 시도 2,847회 (1시간 내)",
      severity: "P3 (중간)"
    }
  },
  {
    id: 7,
    title: "분산 서비스 거부(DDoS) 공격",
    priority: "P1",
    role: "커뮤니케이터",
    situation: "공식 웹사이트에 대규모 DDoS 공격으로 서비스가 중단되어 막대한 매출 손실이 발생하고 있습니다.",
    flow: "1단계: 네트워크 모니터링 P1 경보 확인 (트래픽 급증) → 2단계: 웹 서버 상태 점검 (응답 불가 확인) → 3단계: 방화벽 로그에서 공격 트래픽 패턴 분석 → 4단계: DDoS 공격 유형 식별 (SYN Flood) → 5단계: 네트워크팀 긴급 협조 요청 → 6단계: DDoS 방어 장비 활성화 → 7단계: CDN 업체 긴급 연락 → 8단계: 경영진 상황 보고 → 9단계: 'DDoS 공격 대응' 플레이북 실행",
    result: "DDoS 방어 장비가 활성화되어 공격 트래픽이 정상적으로 필터링되기 시작했습니다. 웹사이트 서비스가 복구되었습니다.",
    analysis: {
      who: "다수의 봇넷 IP (약 15,000개)",
      where: "WEB-SRV-01, WEB-SRV-02 (웹서버 클러스터)",
      what: "SYN Flood DDoS 공격",
      when: "2024-01-15 13:45:22",
      how: "봇넷을 이용한 대량 SYN 패킷 전송",
      howMuch: "초당 50Gbps 트래픽, 서비스 2시간 중단",
      severity: "P1 (긴급)"
    }
  },
  {
    id: 8,
    title: "소스코드 유출을 통한 클라우드 계정 탈취",
    priority: "P1",
    role: "분석 및 검색 담당자",
    situation: "개발자 실수로 AWS 엑세스 키가 공개 GitHub에 유출되었습니다. 공격자가 이 키로 고사양 서버를 대량 생성하여 클라우드 요금이 급증하고 있습니다.",
    flow: "1단계: 클라우드 운영팀 긴급 전화 수신 → 2단계: AWS 콘솔에서 비정상적인 리소스 생성 확인 → 3단계: CloudTrail 로그에서 API 호출 기록 분석 → 4단계: 유출된 액세스 키 식별 → 5단계: GitHub 스캔으로 키 유출 경로 확인 → 6단계: 해당 액세스 키 즉시 비활성화 → 7단계: 공격자가 생성한 모든 EC2 인스턴스 강제 종료 → 8단계: 개발팀에 보안 코딩 교육 요청 → 9단계: '클라우드 계정 침해 대응' 플레이북 실행",
    result: "유출된 엑세스 키가 비활성화되고, 공격자가 생성한 모든 가상서버가 삭제되어 과도한 비용 발생이 중단되었습니다.",
    analysis: {
      who: "GitHub 스캐너 봇 + 공격자",
      where: "AWS 계정 (us-east-1 리전)",
      what: "클라우드 계정 탈취 및 리소스 남용",
      when: "2024-01-15 22:30:15",
      how: "GitHub 공개 저장소의 하드코딩된 AWS 키",
      howMuch: "EC2 인스턴스 47대 생성, 예상 비용 $12,000",
      severity: "P1 (긴급)"
    }
  },
  {
    id: 9,
    title: "오탐(False Positive) 처리",
    priority: "P2",
    role: "커뮤니케이터",
    situation: "DB 백업 서버에서 대량 파일 삭제 행위가 탐지되어 '높음' 등급 경보가 발생했습니다. 랜섬웨어 또는 내부자 파괴 행위일 수 있습니다.",
    flow: "1단계: EDR P2 경보 확인 (대량 파일 삭제 탐지) → 2단계: 삭제된 파일 경로 및 패턴 분석 → 3단계: 해당 서버 관리자에게 작업 내역 확인 → 4단계: 티켓 시스템에서 정기 백업 정리 작업 일정 조회 → 5단계: 삭제 시간과 정기 작업 시간 일치 확인 → 6단계: 정상 작업임을 확인하고 경보 '오탐' 처리 → 7단계: EDR 정책에서 해당 경로 예외 처리 추가 → 8단계: 유사 오탐 방지를 위한 정책 개선 제안",
    result: "해당 경보가 정상적인 관리 작업으로 인한 오탐임을 확인하고 티켓을 종결했습니다. 향후 유사한 오탐을 방지하기 위해 EDR 탐지 정책에 예외 처리를 추가했습니다.",
    analysis: {
      who: "backup-admin (백업 관리자 계정)",
      where: "DB-BACKUP-01 (데이터베이스 백업 서버)",
      what: "정기 백업 파일 정리 작업 (정상)",
      when: "2024-01-15 03:00:00",
      how: "스케줄된 배치 스크립트 실행",
      howMuch: "30일 이전 백업 파일 1,247개 삭제",
      severity: "P2 (높음) → 오탐 처리"
    }
  },
  {
    id: 10,
    title: "공급망 공격 (Supply Chain Attack)",
    priority: "P1",
    role: "현장 조치 담당자",
    situation: "정상 문서 편집기 프로그램의 자동 업데이트 기능을 통해 악성코드가 유포되어, 다수 PC에서 악성 C2 서버로의 통신이 탐지되었습니다.",
    flow: "1단계: EDR 다중 P1 경보 확인 (여러 PC에서 C2 통신 탐지) → 2단계: 공통 프로세스 'DocumentEditor.exe' 식별 → 3단계: 해당 프로그램의 업데이트 시간 확인 → 4단계: 악성 C2 서버 IP 주소 수집 → 5단계: 방화벽에서 C2 서버 통신 즉시 차단 → 6단계: 감염된 모든 PC 네트워크 격리 → 7단계: 소프트웨어 공급사에 긴급 연락 → 8단계: 전사 해당 프로그램 사용 중단 공지 → 9단계: '공급망 공격 대응' 플레이북 실행",
    result: "악성 C2 서버와의 통신이 전사적으로 차단되었고, 감염된 PC들이 모두 격리되어 추가 피해가 방지되었습니다. 소프트웨어 공급사에 해당 문제에 대해 긴급 공지를 요청했습니다.",
    analysis: {
      who: "공급망 공격자 (DocumentEditor 업데이트 서버 침해)",
      where: "OFF-PC-15, OFF-PC-23, OFF-PC-31 등 12대 PC",
      what: "공급망 공격 (소프트웨어 업데이트 변조)",
      when: "2024-01-15 10:15:30",
      how: "정상 소프트웨어 업데이트에 악성코드 삽입",
      howMuch: "전사 PC 12대 감염, C2 서버 통신 시도",
      severity: "P1 (긴급)"
    }
  }
];