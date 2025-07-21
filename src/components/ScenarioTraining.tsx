import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Shield, 
  Home, 
  ArrowLeft,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Database,
  Brain,
  Zap,
  Search,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  Monitor,
  Terminal,
  FileText
} from 'lucide-react';
import { Timer } from './Timer';
import { Tooltip } from './Tooltip';

import { scenarios } from '../data/scenarios';
interface IOCItem {
  id: string;
  value: string;
  type: 'ip' | 'domain' | 'hash' | 'filename' | 'email' | 'port' | 'process';
  category: string;
}

interface ScenarioStep {
  id: number;
  title: string;
  tool: string;
  description: string;
  instruction: string;
  availableIOCs: IOCItem[];
  correctIOCs: string[];
  hints: string[];
  mockData: any;
}

interface Scenario {
  id: number;
  title: string;
  priority: string;
  role: string;
  situation: string;
  steps: ScenarioStep[];
}

const scenarioData: { [key: number]: Scenario } = {
  1: {
    id: 1,
    title: "랜섬웨어 감염",
    priority: "P1",
    role: "현장 조치 담당자",
    situation: "재무팀 PC가 랜섬웨어에 감염되어 모든 회계 문서가 암호화되었고, 업무가 중단되었습니다.",
    steps: [
      {
        id: 1,
        title: "EDR에서 프로세스 트리 분석",
        tool: "EDR",
        description: "감염된 PC(FIN-PC-07)의 EDR 화면에서 악성 프로세스를 찾아보세요.",
        instruction: "의심스러운 프로세스를 클릭하여 선택하세요.",
        availableIOCs: [
          { id: 'proc1', value: 'explorer.exe', type: 'process', category: '정상 프로세스' },
          { id: 'proc2', value: 'chrome.exe', type: 'process', category: '정상 프로세스' },
          { id: 'proc3', value: 'svchost.exe', type: 'process', category: '의심 프로세스' },
          { id: 'proc4', value: 'notepad.exe', type: 'process', category: '정상 프로세스' }
        ],
        correctIOCs: ['proc3'],
        hints: [
          "정상적인 시스템 프로세스로 위장한 악성 프로세스를 찾아보세요",
          "svchost.exe 프로세스 중 비정상적인 것이 있는지 확인하세요",
          "네트워크 연결 상태를 확인해보세요"
        ],
        mockData: {
          processes: [
            { name: "explorer.exe", pid: 1234, status: "정상", network: "없음" },
            { name: "chrome.exe", pid: 2345, status: "정상", network: "HTTPS" },
            { name: "svchost.exe", pid: 3456, status: "의심", network: "185.220.101.24:443" },
            { name: "notepad.exe", pid: 4567, status: "정상", network: "없음" }
          ]
        }
      },
      {
        id: 2,
        title: "TI 플랫폼에서 C2 서버 확인",
        tool: "TIP",
        description: "발견된 정보가 악성인지 위협 인텔리전스 플랫폼에서 확인하세요.",
        instruction: "이전 단계에서 발견된 IOC 중 TI 플랫폼에서 조회할 정보를 클릭하여 선택하세요.",
        availableIOCs: [
          { id: 'ip1', value: '185.220.101.24', type: 'ip', category: '네트워크 정보' },
          { id: 'port1', value: '443', type: 'port', category: '네트워크 정보' },
          { id: 'proc3', value: 'svchost.exe', type: 'process', category: '프로세스 정보' },
          { id: 'host1', value: 'FIN-PC-07', type: 'domain', category: '시스템 정보' }
        ],
        correctIOCs: ['ip1'],
        hints: [
          "TI 플랫폼에서는 IP 주소, 도메인, 파일 해시를 조회할 수 있습니다",
          "이전 단계에서 발견한 외부 통신 IP를 확인해보세요",
          "185.220.101.24를 조회해보세요"
        ],
        mockData: {
          threatInfo: {
            ip: "185.220.101.24",
            reputation: "악성",
            category: "LockBit 랜섬웨어 C2 서버",
            firstSeen: "2024-01-15",
            confidence: "높음"
          }
        }
      },
      {
        id: 3,
        title: "SIEM에서 최초 유입 경로 확인",
        tool: "SIEM",
        description: "SIEM에서 쿼리 구성 요소를 선택하여 최초 유입 경로를 찾아보세요.",
        instruction: "프록시 로그에서 해당 IP로의 차단된 접속을 검색하는 쿼리 구성 요소를 클릭하여 선택하세요.",
        availableIOCs: [
          { id: 'index1', value: 'index="proxy"', type: 'domain', category: '로그 소스' },
          { id: 'index2', value: 'index="firewall"', type: 'domain', category: '로그 소스' },
          { id: 'status1', value: 'status="blocked"', type: 'domain', category: '상태 조건' },
          { id: 'status2', value: 'status="allowed"', type: 'domain', category: '상태 조건' },
          { id: 'dest1', value: 'dest_ip="185.220.101.24"', type: 'ip', category: 'IP 조건' },
          { id: 'cmd1', value: '| top user', type: 'domain', category: '집계 명령' }
        ],
        correctIOCs: ['index1', 'status1', 'dest1', 'cmd1'],
        hints: [
          "프록시 로그를 검색해야 합니다",
          "차단된(blocked) 상태의 로그를 찾아보세요",
          "사용자별로 집계해보세요"
        ],
        mockData: {
          queryResults: [
            { user: "jlee@company.com", count: 15, file: "invoice.zip" },
            { user: "kpark@company.com", count: 3, file: "document.pdf" }
          ]
        }
      },
      {
        id: 4,
        title: "SOAR에서 플레이북 실행",
        tool: "SOAR",
        description: "상황에 맞는 대응 플레이북을 선택하여 실행하세요.",
        instruction: "현재 상황에 가장 적합한 플레이북을 클릭하여 선택하세요.",
        availableIOCs: [
          { id: 'pb1', value: 'DDoS 공격 대응', type: 'domain', category: '네트워크 공격' },
          { id: 'pb2', value: '랜섬웨어 초기 대응', type: 'domain', category: '악성코드' },
          { id: 'pb3', value: '내부 정보 유출 대응', type: 'domain', category: '데이터 보호' },
          { id: 'pb4', value: '계정 탈취 대응', type: 'domain', category: '인증 보안' }
        ],
        correctIOCs: ['pb2'],
        hints: [
          "랜섬웨어 관련 플레이북을 찾아보세요",
          "초기 대응 절차를 포함한 플레이북을 선택하세요",
          "현재 상황은 파일 암호화 공격입니다"
        ],
        mockData: {
          playbooks: [
            "DDoS 공격 대응",
            "랜섬웨어 초기 대응",
            "내부 정보 유출 대응",
            "계정 탈취 대응"
          ]
        }
      }
    ]
  },
  3: {
    id: 3,
    title: "SQL 인젝션 및 데이터 유출",
    priority: "P1",
    role: "분석 및 검색 담당자",
    situation: "쇼핑몰 고객 DB가 SQL 인젝션 공격을 받아 고객 15만 명의 개인정보가 탈취되었습니다.",
    steps: [
      {
        id: 1,
        title: "SIEM에서 웹 서버 에러 급증 확인",
        tool: "SIEM",
        description: "웹 서버에서 비정상적인 에러가 급증하고 있는지 확인하세요.",
        instruction: "웹 서버 에러 로그를 검색하는 쿼리 구성 요소를 클릭하여 선택하세요.",
        availableIOCs: [
          { id: 'index1', value: 'index="web_server"', type: 'domain', category: '로그 소스' },
          { id: 'index2', value: 'index="database"', type: 'domain', category: '로그 소스' },
          { id: 'status1', value: 'status="error"', type: 'domain', category: '상태 조건' },
          { id: 'status2', value: 'status="success"', type: 'domain', category: '상태 조건' },
          { id: 'time1', value: 'earliest=-1h', type: 'domain', category: '시간 조건' },
          { id: 'cmd1', value: '| timechart count', type: 'domain', category: '집계 명령' }
        ],
        correctIOCs: ['index1', 'status1', 'time1', 'cmd1'],
        hints: [
          "웹 서버 로그를 검색해야 합니다",
          "에러 상태의 로그를 찾아보세요",
          "시간별 추이를 확인하세요"
        ],
        mockData: {
          queryResults: [
            { time: "14:00", count: 5, normal: true },
            { time: "14:15", count: 8, normal: true },
            { time: "14:30", count: 156, normal: false },
            { time: "14:45", count: 203, normal: false }
          ]
        }
      },
      {
        id: 2,
        title: "웹 로그에서 공격 구문 확인",
        tool: "SIEM",
        description: "웹 로그에서 SQL 인젝션 공격 구문을 찾아보세요.",
        instruction: "SQL 인젝션 공격을 검색하는 쿼리 구성 요소를 클릭하여 선택하세요.",
        availableIOCs: [
          { id: 'index1', value: 'index="web_access"', type: 'domain', category: '로그 소스' },
          { id: 'search1', value: 'search="*UNION*SELECT*"', type: 'domain', category: '공격 패턴' },
          { id: 'search2', value: 'search="*ORDER*BY*"', type: 'domain', category: '공격 패턴' },
          { id: 'search3', value: 'search="*DROP*TABLE*"', type: 'domain', category: '공격 패턴' },
          { id: 'field1', value: 'src_ip', type: 'domain', category: '필드 추출' },
          { id: 'cmd1', value: '| stats count by src_ip', type: 'domain', category: '집계 명령' }
        ],
        correctIOCs: ['index1', 'search1', 'field1', 'cmd1'],
        hints: [
          "웹 접근 로그를 검색해야 합니다",
          "UNION SELECT 구문은 대표적인 SQL 인젝션 패턴입니다",
          "공격자 IP별로 집계해보세요"
        ],
        mockData: {
          queryResults: [
            { src_ip: "203.0.113.45", count: 47, attack_type: "UNION SELECT", target: "/shop/product.php" },
            { src_ip: "198.51.100.23", count: 12, attack_type: "UNION SELECT", target: "/shop/login.php" }
          ]
        }
      },
      {
        id: 3,
        title: "TI 플랫폼에서 공격자 IP 확인",
        tool: "TIP",
        description: "발견된 공격자 IP가 알려진 악성 IP인지 확인하세요.",
        instruction: "이전 단계에서 발견된 공격자 IP를 클릭하여 선택하세요.",
        availableIOCs: [
          { id: 'ip1', value: '203.0.113.45', type: 'ip', category: '공격자 IP' },
          { id: 'ip2', value: '198.51.100.23', type: 'ip', category: '공격자 IP' },
          { id: 'url1', value: '/shop/product.php', type: 'domain', category: '공격 대상' },
          { id: 'pattern1', value: 'UNION SELECT', type: 'domain', category: '공격 패턴' }
        ],
        correctIOCs: ['ip1'],
        hints: [
          "가장 많은 공격을 시도한 IP를 조회해보세요",
          "203.0.113.45 IP를 확인해보세요",
          "TI 플랫폼에서는 IP 주소의 평판을 확인할 수 있습니다"
        ],
        mockData: {
          threatInfo: {
            ip: "203.0.113.45",
            reputation: "악성",
            category: "SQL 인젝션 공격 봇넷",
            firstSeen: "2024-12-15",
            confidence: "높음",
            associatedMalware: "SQLMap 자동화 도구"
          }
        }
      },
      {
        id: 4,
        title: "SOAR에서 플레이북 실행",
        tool: "SOAR",
        description: "SQL 인젝션 공격에 맞는 대응 플레이북을 선택하여 실행하세요.",
        instruction: "현재 상황에 가장 적합한 플레이북을 클릭하여 선택하세요.",
        availableIOCs: [
          { id: 'pb1', value: 'DDoS 공격 대응', type: 'domain', category: '네트워크 공격' },
          { id: 'pb2', value: 'SQL 인젝션 대응', type: 'domain', category: '웹 공격' },
          { id: 'pb3', value: '내부 정보 유출 대응', type: 'domain', category: '데이터 보호' },
          { id: 'pb4', value: '계정 탈취 대응', type: 'domain', category: '인증 보안' }
        ],
        correctIOCs: ['pb2'],
        hints: [
          "SQL 인젝션 관련 플레이북을 찾아보세요",
          "웹 공격 대응 절차를 선택하세요",
          "현재 상황은 데이터베이스 공격입니다"
        ],
        mockData: {
          playbooks: [
            "DDoS 공격 대응",
            "SQL 인젝션 대응",
            "내부 정보 유출 대응",
            "계정 탈취 대응"
          ]
        }
      }
    ]
  },
  4: {
    id: 4,
    title: "스피어 피싱 및 계정 탈취",
    priority: "P2",
    role: "분석 및 검색 담당자",
    situation: "임원 대상 스피어 피싱으로 이메일 계정이 탈취되었습니다. 공격자가 이 계정으로 2차 피해를 유발하고 있습니다.",
    steps: [
      {
        id: 1,
        title: "EDR에서 메일 헤더 분석",
        tool: "EDR",
        description: "임원 PC(CEO-PC-01)의 EDR에서 의심스러운 이메일 관련 활동을 찾아보세요.",
        instruction: "의심스러운 이메일 프로세스를 클릭하여 선택하세요.",
        availableIOCs: [
          { id: 'proc1', value: 'outlook.exe', type: 'process', category: '정상 프로세스' },
          { id: 'proc2', value: 'chrome.exe', type: 'process', category: '정상 프로세스' },
          { id: 'proc3', value: 'powershell.exe', type: 'process', category: '의심 프로세스' },
          { id: 'proc4', value: 'notepad.exe', type: 'process', category: '정상 프로세스' }
        ],
        correctIOCs: ['proc3'],
        hints: [
          "스피어 피싱 이메일은 종종 PowerShell 스크립트를 실행합니다",
          "비정상적인 PowerShell 활동을 찾아보세요",
          "이메일 첨부파일에서 실행된 프로세스를 확인하세요"
        ],
        mockData: {
          processes: [
            { name: "outlook.exe", pid: 1234, status: "정상", network: "outlook.office365.com", activity: "이메일 동기화" },
            { name: "chrome.exe", pid: 2345, status: "정상", network: "HTTPS", activity: "웹 브라우징" },
            { name: "powershell.exe", pid: 3456, status: "의심", network: "185.220.102.15:443", activity: "스크립트 실행" },
            { name: "notepad.exe", pid: 4567, status: "정상", network: "없음", activity: "문서 편집" }
          ],
          emailInfo: {
            sender: "finance@company-update.com",
            subject: "긴급: 분기 재무보고서 검토 요청",
            attachment: "Q4_Report.docm",
            executedScript: "credential_harvester.ps1"
          }
        }
      },
      {
        id: 2,
        title: "SIEM에서 해외 IP 로그인 기록 확인",
        tool: "SIEM",
        description: "SIEM에서 임원 계정의 비정상적인 로그인 기록을 확인하세요.",
        instruction: "해외 IP에서의 로그인을 검색하는 쿼리 구성 요소를 클릭하여 선택하세요.",
        availableIOCs: [
          { id: 'index1', value: 'index="authentication"', type: 'domain', category: '로그 소스' },
          { id: 'user1', value: 'user="ceo@company.com"', type: 'email', category: '사용자 조건' },
          { id: 'geo1', value: 'src_country!="Korea"', type: 'domain', category: '지역 조건' },
          { id: 'status1', value: 'status="success"', type: 'domain', category: '상태 조건' },
          { id: 'time1', value: 'earliest=-24h', type: 'domain', category: '시간 조건' },
          { id: 'cmd1', value: '| table _time src_ip src_country', type: 'domain', category: '출력 명령' }
        ],
        correctIOCs: ['index1', 'user1', 'geo1', 'status1', 'cmd1'],
        hints: [
          "인증 로그를 검색해야 합니다",
          "CEO 계정의 로그인 기록을 확인하세요",
          "한국이 아닌 해외에서의 로그인을 찾아보세요"
        ],
        mockData: {
          queryResults: [
            { time: "2024-12-20 15:23:45", src_ip: "185.220.102.15", src_country: "Russia", device: "Unknown", browser: "Chrome/Linux" },
            { time: "2024-12-20 15:45:12", src_ip: "185.220.102.15", src_country: "Russia", device: "Unknown", browser: "Chrome/Linux" }
          ]
        }
      },
      {
        id: 3,
        title: "TI 플랫폼에서 공격자 IP 확인",
        tool: "TIP",
        description: "해외 로그인 IP가 알려진 악성 IP인지 확인하세요.",
        instruction: "이전 단계에서 발견된 해외 IP를 클릭하여 선택하세요.",
        availableIOCs: [
          { id: 'ip1', value: '185.220.102.15', type: 'ip', category: '해외 로그인 IP' },
          { id: 'country1', value: 'Russia', type: 'domain', category: '국가 정보' },
          { id: 'user1', value: 'ceo@company.com', type: 'email', category: '피해 계정' },
          { id: 'time1', value: '15:23:45', type: 'domain', category: '시간 정보' }
        ],
        correctIOCs: ['ip1'],
        hints: [
          "러시아에서 로그인한 IP를 조회해보세요",
          "185.220.102.15 IP를 확인해보세요",
          "해당 IP의 평판과 관련 위협을 확인하세요"
        ],
        mockData: {
          threatInfo: {
            ip: "185.220.102.15",
            reputation: "악성",
            category: "피싱 및 계정 탈취 인프라",
            firstSeen: "2024-11-20",
            confidence: "높음",
            associatedGroup: "APT29 (Cozy Bear)"
          }
        }
      },
      {
        id: 4,
        title: "SOAR에서 플레이북 실행",
        tool: "SOAR",
        description: "계정 탈취 상황에 맞는 대응 플레이북을 선택하여 실행하세요.",
        instruction: "현재 상황에 가장 적합한 플레이북을 클릭하여 선택하세요.",
        availableIOCs: [
          { id: 'pb1', value: 'DDoS 공격 대응', type: 'domain', category: '네트워크 공격' },
          { id: 'pb2', value: 'SQL 인젝션 대응', type: 'domain', category: '웹 공격' },
          { id: 'pb3', value: '내부 정보 유출 대응', type: 'domain', category: '데이터 보호' },
          { id: 'pb4', value: '계정 탈취 대응', type: 'domain', category: '인증 보안' }
        ],
        correctIOCs: ['pb4'],
        hints: [
          "계정 탈취 관련 플레이북을 찾아보세요",
          "인증 보안 관련 대응 절차를 선택하세요",
          "현재 상황은 이메일 계정 탈취입니다"
        ],
        mockData: {
          playbooks: [
            "DDoS 공격 대응",
            "SQL 인젝션 대응",
            "내부 정보 유출 대응",
            "계정 탈취 대응"
          ]
        }
      }
    ]
  },
  5: {
    id: 5,
    title: "워터링 홀 공격",
    priority: "P2",
    role: "분석 및 검색 담당자",
    situation: "개발자들이 자주 방문하는 커뮤니티가 해킹되어, 접속한 다수 개발자 PC가 악성코드에 감염되었습니다.",
    steps: [
      {
        id: 1,
        title: "EDR에서 비정상 행위 확인",
        tool: "EDR",
        description: "개발팀 PC(DEV-PC-05)의 EDR에서 비정상적인 프로세스 활동을 찾아보세요.",
        instruction: "의심스러운 프로세스를 클릭하여 선택하세요.",
        availableIOCs: [
          { id: 'proc1', value: 'chrome.exe', type: 'process', category: '정상 프로세스' },
          { id: 'proc2', value: 'vscode.exe', type: 'process', category: '정상 프로세스' },
          { id: 'proc3', value: 'rundll32.exe', type: 'process', category: '의심 프로세스' },
          { id: 'proc4', value: 'git.exe', type: 'process', category: '정상 프로세스' }
        ],
        correctIOCs: ['proc3'],
        hints: [
          "rundll32.exe는 정상 프로세스이지만 악성코드가 자주 악용합니다",
          "비정상적인 네트워크 연결을 확인하세요",
          "워터링 홀 공격은 웹 브라우저를 통해 시작됩니다"
        ],
        mockData: {
          processes: [
            { name: "chrome.exe", pid: 1234, status: "정상", network: "HTTPS", activity: "웹 브라우징" },
            { name: "vscode.exe", pid: 2345, status: "정상", network: "없음", activity: "코드 편집" },
            { name: "rundll32.exe", pid: 3456, status: "의심", network: "203.0.113.88:8080", activity: "DLL 로딩" },
            { name: "git.exe", pid: 4567, status: "정상", network: "github.com", activity: "버전 관리" }
          ],
          malwareInfo: {
            parentProcess: "chrome.exe",
            downloadedFile: "update.dll",
            c2Server: "203.0.113.88:8080",
            injectedProcess: "rundll32.exe"
          }
        }
      },
      {
        id: 2,
        title: "SIEM에서 공통 접속 사이트 확인",
        tool: "SIEM",
        description: "SIEM에서 감염된 PC들이 공통으로 접속한 웹사이트를 찾아보세요.",
        instruction: "프록시 로그에서 공통 접속 사이트를 검색하는 쿼리 구성 요소를 클릭하여 선택하세요.",
        availableIOCs: [
          { id: 'index1', value: 'index="proxy"', type: 'domain', category: '로그 소스' },
          { id: 'src1', value: 'src_ip="192.168.1.*"', type: 'ip', category: 'IP 조건' },
          { id: 'time1', value: 'earliest=-2h', type: 'domain', category: '시간 조건' },
          { id: 'status1', value: 'status="200"', type: 'domain', category: '상태 조건' },
          { id: 'cmd1', value: '| stats count by dest_domain', type: 'domain', category: '집계 명령' },
          { id: 'cmd2', value: '| where count > 5', type: 'domain', category: '필터 명령' }
        ],
        correctIOCs: ['index1', 'src1', 'time1', 'status1', 'cmd1', 'cmd2'],
        hints: [
          "프록시 로그에서 내부 IP 대역을 검색하세요",
          "성공적으로 접속한 사이트를 찾아보세요",
          "여러 PC가 공통으로 접속한 사이트를 찾아보세요"
        ],
        mockData: {
          queryResults: [
            { dest_domain: "devforum-community.org", count: 12, category: "개발자 커뮤니티" },
            { dest_domain: "github.com", count: 8, category: "정상 사이트" },
            { dest_domain: "stackoverflow.com", count: 6, category: "정상 사이트" }
          ]
        }
      },
      {
        id: 3,
        title: "TI 플랫폼에서 의심 사이트 확인",
        tool: "TIP",
        description: "공통으로 접속한 사이트가 악성 사이트인지 확인하세요.",
        instruction: "이전 단계에서 발견된 의심 사이트를 클릭하여 선택하세요.",
        availableIOCs: [
          { id: 'domain1', value: 'devforum-community.org', type: 'domain', category: '의심 사이트' },
          { id: 'domain2', value: 'github.com', type: 'domain', category: '정상 사이트' },
          { id: 'domain3', value: 'stackoverflow.com', type: 'domain', category: '정상 사이트' },
          { id: 'count1', value: '12회 접속', type: 'domain', category: '접속 통계' }
        ],
        correctIOCs: ['domain1'],
        hints: [
          "가장 많은 접속이 있었던 사이트를 조회해보세요",
          "devforum-community.org 도메인을 확인해보세요",
          "개발자 커뮤니티 사이트의 평판을 확인하세요"
        ],
        mockData: {
          threatInfo: {
            domain: "devforum-community.org",
            reputation: "악성",
            category: "워터링 홀 공격 사이트",
            firstSeen: "2024-12-18",
            confidence: "높음",
            attackMethod: "브라우저 익스플로잇 킷"
          }
        }
      },
      {
        id: 4,
        title: "SOAR에서 플레이북 실행",
        tool: "SOAR",
        description: "워터링 홀 공격에 맞는 대응 플레이북을 선택하여 실행하세요.",
        instruction: "현재 상황에 가장 적합한 플레이북을 클릭하여 선택하세요.",
        availableIOCs: [
          { id: 'pb1', value: '워터링 홀 공격 대응', type: 'domain', category: '웹 공격' },
          { id: 'pb2', value: 'SQL 인젝션 대응', type: 'domain', category: '웹 공격' },
          { id: 'pb3', value: '내부 정보 유출 대응', type: 'domain', category: '데이터 보호' },
          { id: 'pb4', value: '계정 탈취 대응', type: 'domain', category: '인증 보안' }
        ],
        correctIOCs: ['pb1'],
        hints: [
          "워터링 홀 공격 관련 플레이북을 찾아보세요",
          "웹 공격 대응 절차를 선택하세요",
          "현재 상황은 악성 웹사이트를 통한 감염입니다"
        ],
        mockData: {
          playbooks: [
            "워터링 홀 공격 대응",
            "SQL 인젝션 대응",
            "내부 정보 유출 대응",
            "계정 탈취 대응"
          ]
        }
      }
    ]
  },
  6: {
    id: 6,
    title: "무차별 대입 공격 (Brute Force)",
    priority: "P3",
    role: "분석 및 검색 담당자",
    situation: "VPN 서버 관리자 계정에 대해 무차별 대입 공격이 발생 중입니다. 계정 탈취 시 내부망 전체가 장악될 수 있습니다.",
    steps: [
      {
        id: 1,
        title: "SIEM에서 로그인 실패 급증 확인",
        tool: "SIEM",
        description: "VPN 서버에서 로그인 실패가 급증하고 있는지 확인하세요.",
        instruction: "VPN 로그인 실패를 검색하는 쿼리 구성 요소를 클릭하여 선택하세요.",
        availableIOCs: [
          { id: 'index1', value: 'index="vpn_auth"', type: 'domain', category: '로그 소스' },
          { id: 'index2', value: 'index="web_server"', type: 'domain', category: '로그 소스' },
          { id: 'status1', value: 'status="failed"', type: 'domain', category: '상태 조건' },
          { id: 'status2', value: 'status="success"', type: 'domain', category: '상태 조건' },
          { id: 'user1', value: 'user="admin"', type: 'domain', category: '사용자 조건' },
          { id: 'cmd1', value: '| timechart count by src_ip', type: 'domain', category: '집계 명령' }
        ],
        correctIOCs: ['index1', 'status1', 'user1', 'cmd1'],
        hints: [
          "VPN 인증 로그를 검색해야 합니다",
          "실패한 로그인 시도를 찾아보세요",
          "admin 계정에 대한 공격을 확인하세요"
        ],
        mockData: {
          queryResults: [
            { time: "15:00", src_ip: "203.0.113.77", count: 156 },
            { time: "15:15", src_ip: "203.0.113.77", count: 203 },
            { time: "15:30", src_ip: "203.0.113.77", count: 187 },
            { time: "15:45", src_ip: "203.0.113.77", count: 234 }
          ]
        }
      },
      {
        id: 2,
        title: "SIEM에서 공격 패턴 분석",
        tool: "SIEM",
        description: "공격자의 상세한 공격 패턴을 분석하세요.",
        instruction: "공격자 IP의 상세 활동을 검색하는 쿼리 구성 요소를 클릭하여 선택하세요.",
        availableIOCs: [
          { id: 'index1', value: 'index="vpn_auth"', type: 'domain', category: '로그 소스' },
          { id: 'src1', value: 'src_ip="203.0.113.77"', type: 'ip', category: 'IP 조건' },
          { id: 'time1', value: 'earliest=-1h', type: 'domain', category: '시간 조건' },
          { id: 'field1', value: 'password_attempted', type: 'domain', category: '필드 추출' },
          { id: 'cmd1', value: '| stats count by password_attempted', type: 'domain', category: '집계 명령' },
          { id: 'cmd2', value: '| sort -count', type: 'domain', category: '정렬 명령' }
        ],
        correctIOCs: ['index1', 'src1', 'time1', 'field1', 'cmd1', 'cmd2'],
        hints: [
          "특정 공격자 IP로 필터링하세요",
          "시도된 패스워드 목록을 확인하세요",
          "가장 많이 시도된 패스워드 순으로 정렬하세요"
        ],
        mockData: {
          queryResults: [
            { password_attempted: "admin", count: 45 },
            { password_attempted: "password", count: 38 },
            { password_attempted: "123456", count: 32 },
            { password_attempted: "admin123", count: 28 }
          ]
        }
      },
      {
        id: 3,
        title: "TI 플랫폼에서 공격자 IP 확인",
        tool: "TIP",
        description: "무차별 대입 공격을 시도하는 IP가 알려진 악성 IP인지 확인하세요.",
        instruction: "이전 단계에서 발견된 공격자 IP를 클릭하여 선택하세요.",
        availableIOCs: [
          { id: 'ip1', value: '203.0.113.77', type: 'ip', category: '공격자 IP' },
          { id: 'attack1', value: '무차별 대입 공격', type: 'domain', category: '공격 유형' },
          { id: 'target1', value: 'admin 계정', type: 'domain', category: '공격 대상' },
          { id: 'count1', value: '780회 시도', type: 'domain', category: '공격 통계' }
        ],
        correctIOCs: ['ip1'],
        hints: [
          "780회의 로그인 시도를 한 IP를 조회해보세요",
          "203.0.113.77 IP를 확인해보세요",
          "해당 IP의 평판과 관련 공격 이력을 확인하세요"
        ],
        mockData: {
          threatInfo: {
            ip: "203.0.113.77",
            reputation: "악성",
            category: "무차별 대입 공격 봇넷",
            firstSeen: "2024-10-15",
            confidence: "높음",
            associatedAttacks: "SSH, RDP, VPN 무차별 대입 공격"
          }
        }
      },
      {
        id: 4,
        title: "SOAR에서 플레이북 실행",
        tool: "SOAR",
        description: "무차별 대입 공격에 맞는 대응 플레이북을 선택하여 실행하세요.",
        instruction: "현재 상황에 가장 적합한 플레이북을 클릭하여 선택하세요.",
        availableIOCs: [
          { id: 'pb1', value: '무차별 대입 공격 대응', type: 'domain', category: '인증 공격' },
          { id: 'pb2', value: 'SQL 인젝션 대응', type: 'domain', category: '웹 공격' },
          { id: 'pb3', value: '내부 정보 유출 대응', type: 'domain', category: '데이터 보호' },
          { id: 'pb4', value: '계정 탈취 대응', type: 'domain', category: '인증 보안' }
        ],
        correctIOCs: ['pb1'],
        hints: [
          "무차별 대입 공격 관련 플레이북을 찾아보세요",
          "인증 공격 대응 절차를 선택하세요",
          "현재 상황은 VPN 계정에 대한 무차별 대입 공격입니다"
        ],
        mockData: {
          playbooks: [
            "무차별 대입 공격 대응",
            "SQL 인젝션 대응",
            "내부 정보 유출 대응",
            "계정 탈취 대응"
          ]
        }
      }
    ]
  },
  2: {
    id: 2,
    title: "내부 정보 유출 의심",
    priority: "P2",
    role: "커뮤니케이터",
    situation: "마케팅팀 직원의 PC에서 차기 신제품 출시 전략 등 핵심 영업기밀이 외부 클라우드 스토리지로 대량 유출된 정황이 포착되었습니다.",
    steps: [
      {
        id: 1,
        title: "EDR에서 데이터 업로드 기록 확인",
        tool: "EDR",
        description: "마케팅팀 PC(MKT-PC-07)의 EDR 화면에서 외부 업로드 활동을 찾아보세요.",
        instruction: "대용량 데이터를 외부로 전송한 의심스러운 프로세스를 클릭하여 선택하세요.",
        availableIOCs: [
          { id: 'proc1', value: 'chrome.exe', type: 'process', category: '정상 프로세스' },
          { id: 'proc2', value: 'dropbox.exe', type: 'process', category: '의심 프로세스' },
          { id: 'proc3', value: 'outlook.exe', type: 'process', category: '정상 프로세스' },
          { id: 'proc4', value: 'teams.exe', type: 'process', category: '정상 프로세스' }
        ],
        correctIOCs: ['proc2'],
        hints: [
          "클라우드 스토리지 관련 프로세스를 찾아보세요",
          "개인 클라우드 서비스는 회사 정책 위반입니다",
          "dropbox.exe 프로세스의 네트워크 활동을 확인하세요"
        ],
        mockData: {
          processes: [
            { name: "chrome.exe", pid: 1234, status: "정상", network: "HTTPS", activity: "웹 브라우징" },
            { name: "dropbox.exe", pid: 2345, status: "의심", network: "dropbox.com:443", activity: "파일 업로드 50MB" },
            { name: "outlook.exe", pid: 3456, status: "정상", network: "outlook.office365.com", activity: "이메일 동기화" },
            { name: "teams.exe", pid: 4567, status: "정상", network: "teams.microsoft.com", activity: "화상회의" }
          ],
          uploadRecord: {
            file: "2025_신제품_출시전략.pptx",
            size: "50MB",
            destination: "dropbox.com",
            time: "14:23:15",
            user: "mkim@company.com"
          }
        }
      },
      {
        id: 2,
        title: "TI 플랫폼에서 외부 서비스 확인",
        tool: "TIP",
        description: "업로드 대상 서비스가 회사 정책에 위반되는지 확인하세요.",
        instruction: "이전 단계에서 발견된 외부 서비스 도메인을 클릭하여 선택하세요.",
        availableIOCs: [
          { id: 'proc2', value: 'dropbox.exe', type: 'process', category: '프로세스 정보' },
          { id: 'domain1', value: 'dropbox.com', type: 'domain', category: '외부 서비스' },
          { id: 'file1', value: '2025_신제품_출시전략.pptx', type: 'filename', category: '유출 파일' },
          { id: 'time1', value: '14:23:15', type: 'domain', category: '시간 정보' }
        ],
        correctIOCs: ['domain1'],
        hints: [
          "TI 플랫폼에서는 도메인의 평판과 정책 위반 여부를 확인할 수 있습니다",
          "dropbox.com 도메인을 조회해보세요",
          "외부 클라우드 서비스의 위험도를 확인하세요"
        ],
        mockData: {
          domainInfo: {
            domain: "dropbox.com",
            reputation: "합법적 서비스",
            category: "클라우드 스토리지",
            riskLevel: "중간",
            companyPolicy: "금지됨",
            reason: "개인 클라우드 사용 금지 정책 위반"
          }
        }
      },
      {
        id: 3,
        title: "SIEM에서 추가 유출 의심 PC 확인",
        tool: "SIEM",
        description: "SIEM에서 동일한 외부 서비스로 업로드한 다른 PC가 있는지 확인하세요.",
        instruction: "프록시 로그에서 dropbox.com으로의 업로드를 검색하는 쿼리 구성 요소를 클릭하여 선택하세요.",
        availableIOCs: [
          { id: 'index1', value: 'index="proxy"', type: 'domain', category: '로그 소스' },
          { id: 'index2', value: 'index="firewall"', type: 'domain', category: '로그 소스' },
          { id: 'dest1', value: 'dest_domain="dropbox.com"', type: 'domain', category: '대상 도메인' },
          { id: 'action1', value: 'action="upload"', type: 'domain', category: '행위 조건' },
          { id: 'action2', value: 'action="download"', type: 'domain', category: '행위 조건' },
          { id: 'cmd1', value: '| stats count by src_ip', type: 'domain', category: '집계 명령' }
        ],
        correctIOCs: ['index1', 'dest1', 'action1', 'cmd1'],
        hints: [
          "프록시 로그에서 검색해야 합니다",
          "dropbox.com으로의 업로드 행위를 찾아보세요",
          "소스 IP별로 집계하여 다른 PC도 확인하세요"
        ],
        mockData: {
          queryResults: [
            { src_ip: "192.168.1.103", hostname: "MKT-PC-03", count: 3, files: ["제품카탈로그.pdf", "고객리스트.xlsx", "마케팅전략.pptx"] },
            { src_ip: "192.168.1.107", hostname: "MKT-PC-07", count: 1, files: ["2025_신제품_출시전략.pptx"] },
            { src_ip: "192.168.1.112", hostname: "MKT-PC-12", count: 2, files: ["경쟁사분석.docx", "가격정책.xlsx"] }
          ]
        }
      },
      {
        id: 4,
        title: "SOAR에서 플레이북 실행",
        tool: "SOAR",
        description: "내부 정보 유출 상황에 맞는 대응 플레이북을 선택하여 실행하세요.",
        instruction: "현재 상황에 가장 적합한 플레이북을 클릭하여 선택하세요.",
        availableIOCs: [
          { id: 'pb1', value: 'DDoS 공격 대응', type: 'domain', category: '네트워크 공격' },
          { id: 'pb2', value: '랜섬웨어 초기 대응', type: 'domain', category: '악성코드' },
          { id: 'pb3', value: '내부 정보 유출 대응', type: 'domain', category: '데이터 보호' },
          { id: 'pb4', value: '계정 탈취 대응', type: 'domain', category: '인증 보안' }
        ],
        correctIOCs: ['pb3'],
        hints: [
          "내부 정보 유출 관련 플레이북을 찾아보세요",
          "데이터 보호 관련 대응 절차를 선택하세요",
          "현재 상황은 기밀 정보의 외부 유출입니다"
        ],
        mockData: {
          playbooks: [
            "DDoS 공격 대응",
            "랜섬웨어 초기 대응",
            "내부 정보 유출 대응",
            "계정 탈취 대응"
          ]
        }
      }
    ]
  }
};

const ScenarioTraining: React.FC = () => {
  const navigate = useNavigate();
  const { scenarioId } = useParams<{ scenarioId: string }>();
  const [currentStep, setCurrentStep] = useState(0);
  const [stepResults, setStepResults] = useState<boolean[]>([]);
  
  // Early return if scenario not found
  const scenario = scenarioData[parseInt(scenarioId || '0')];
  if (!scenario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="mb-6">
            <button
              onClick={() => navigate('/courses')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg
                       hover:bg-gray-600 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              코스 선택으로 돌아가기
            </button>
          </div>
          
          <div className="text-center">
            <div className="text-6xl mb-8">❌</div>
            <h1 className="text-4xl font-bold text-red-400 mb-6">시나리오를 찾을 수 없습니다</h1>
            <p className="text-green-200 text-xl mb-8">
              요청하신 시나리오 ID({scenarioId})에 해당하는 훈련이 존재하지 않습니다.
            </p>
            <button
              onClick={() => navigate('/course/traditional')}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              A코스로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  const currentStepData = scenario?.steps[currentStep];

  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10분
  const [isTrainingActive, setIsTrainingActive] = useState(true);
  const [score, setScore] = useState(0);
  const [trainingCompleted, setTrainingCompleted] = useState(false);
  const [selectedItems, setSelectedItems] = useState<IOCItem[]>([]);
  const [discoveredIOCs, setDiscoveredIOCs] = useState<IOCItem[]>([]);
  const [highlightedIOC, setHighlightedIOC] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showStepResult, setShowStepResult] = useState(false);

  useEffect(() => {
    if (!scenario) {
      navigate('/course/traditional');
    }
  }, [scenario, navigate]);

  useEffect(() => {
    if (timeRemaining <= 0 && isTrainingActive) {
      setIsTrainingActive(false);
      setTrainingCompleted(true);
    }
  }, [timeRemaining, isTrainingActive]);

  useEffect(() => {
    // 현재 단계의 IOC들을 발견된 정보에 설정
    if (currentStepData) {
      setDiscoveredIOCs(currentStepData.availableIOCs);
    }
  }, [currentStep, currentStepData]);

  const handleIOCClick = (item: IOCItem) => {
    if (!selectedItems.find(selected => selected.id === item.id)) {
      const newSelectedItems = [...selectedItems, item];
      setSelectedItems(newSelectedItems);
      
      // 시각적 하이라이트 효과
      setHighlightedIOC(item.id);
      setTimeout(() => setHighlightedIOC(null), 500);
    }
  };

  const handleStepSubmit = () => {
    if (!currentStepData) return;

    const selectedIds = selectedItems.map(item => item.id);
    const isCorrect = currentStepData.correctIOCs.every(id => selectedIds.includes(id)) &&
                     selectedIds.length === currentStepData.correctIOCs.length;

    const newResults = [...stepResults];
    newResults[currentStep] = isCorrect;
    setStepResults(newResults);

    if (isCorrect) {
      setScore(score + 25);
    }

    // 즉시 다음 단계로 이동
    if (currentStep < scenario.steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedItems([]);
      setShowHint(false);
      setHintIndex(0);
    } else {
      setTrainingCompleted(true);
      setIsTrainingActive(false);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setSelectedItems([]);
      setShowHint(false);
      setHintIndex(0);
      setIsProcessing(false);
      setShowStepResult(false);
      // 이전 단계 결과 제거
      const newResults = [...stepResults];
      newResults[currentStep] = undefined as any;
      setStepResults(newResults);
    }
  };

  const showNextHint = () => {
    if (hintIndex < currentStepData.hints.length - 1) {
      setHintIndex(hintIndex + 1);
    }
    setShowHint(true);
  };

  const resetTraining = () => {
    setCurrentStep(0);
    setStepResults([]);
    setShowHint(false);
    setHintIndex(0);
    setTimeRemaining(600);
    setIsTrainingActive(true);
    setScore(0);
    setTrainingCompleted(false);
    setSelectedItems([]);
    setHighlightedIOC(null);
    setDiscoveredIOCs(scenario?.steps[0]?.availableIOCs || []);
    setIsProcessing(false);
    setShowStepResult(false);
  };

  const removeSelectedItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P1': return 'text-red-400 bg-red-900/30 border-red-500';
      case 'P2': return 'text-orange-400 bg-orange-900/30 border-orange-500';
      case 'P3': return 'text-yellow-400 bg-yellow-900/30 border-yellow-500';
      default: return 'text-gray-400 bg-gray-900/30 border-gray-500';
    }
  };

  const getToolIcon = (tool: string) => {
    switch (tool) {
      case 'EDR': return <Eye className="w-5 h-5" />;
      case 'SIEM': return <Database className="w-5 h-5" />;
      case 'TIP': return <Brain className="w-5 h-5" />;
      case 'SOAR': return <Zap className="w-5 h-5" />;
      case 'TICKET': return <FileText className="w-5 h-5" />;
      default: return <Monitor className="w-5 h-5" />;
    }
  };

  const getIOCTypeColor = (type: string) => {
    switch (type) {
      case 'ip': return 'bg-red-600/30 border-red-500 text-red-300';
      case 'domain': return 'bg-blue-600/30 border-blue-500 text-blue-300';
      case 'hash': return 'bg-purple-600/30 border-purple-500 text-purple-300';
      case 'filename': return 'bg-green-600/30 border-green-500 text-green-300';
      case 'email': return 'bg-yellow-600/30 border-yellow-500 text-yellow-300';
      case 'port': return 'bg-cyan-600/30 border-cyan-500 text-cyan-300';
      case 'process': return 'bg-orange-600/30 border-orange-500 text-orange-300';
      default: return 'bg-gray-600/30 border-gray-500 text-gray-300';
    }
  };

  if (trainingCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="text-center">
            <div className="text-6xl mb-8">
              {score >= 75 ? '🏆' : score >= 50 ? '🥈' : '🥉'}
            </div>
            <h1 className="text-4xl font-bold text-yellow-400 mb-6">모의훈련 완료!</h1>
            
            <div className="bg-black/50 backdrop-blur-sm border border-green-500/30 rounded-lg p-8 mb-8 max-w-2xl mx-auto">
              <div className="text-4xl font-bold text-green-400 mb-4">
                점수: {score}/100
              </div>
              <div className="text-xl text-green-300 mb-4">
                {score >= 75 ? '우수! 완벽한 대응이었습니다!' : 
                 score >= 50 ? '양호! 추가 연습으로 더욱 발전하세요!' : 
                 '더 많은 연습이 필요합니다.'}
              </div>
              <div className="text-lg text-yellow-300">
                소요 시간: {Math.floor((600 - timeRemaining) / 60)}분 {(600 - timeRemaining) % 60}초
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={resetTraining}
                className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                다시 도전
              </button>
              <button
                onClick={() => navigate('/course/traditional')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                코스로 돌아가기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative overflow-hidden">
      {/* 타이머 */}
      <Timer 
        initialMinutes={10} 
        onTimeUp={() => {
          setIsTrainingActive(false);
          setTrainingCompleted(true);
        }}
      />

      <div className="container mx-auto px-4 py-8 relative z-10">
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
              onClick={() => navigate('/course/traditional')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              A코스로 돌아가기
            </button>
          </div>
        </div>

        {/* 시나리오 헤더 */}
        <div className="bg-black/50 backdrop-blur-sm border border-red-500/30 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-yellow-400 mb-2">
                시나리오 {scenario.id}: {scenario.title}
              </h1>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-lg border text-sm font-bold ${getPriorityColor(scenario.priority)}`}>
                  {scenario.priority} {scenario.priority === 'P1' ? '긴급' : scenario.priority === 'P2' ? '높음' : '중간'}
                </span>
                <span className="text-cyan-400">역할: {scenario.role}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-green-400 text-lg font-bold">점수: {score}/100</div>
            </div>
          </div>
          <p className="text-green-200 leading-relaxed">{scenario.situation}</p>
        </div>

        {/* 진행 상황 */}
        <div className="bg-black/50 backdrop-blur-sm border border-blue-500/30 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-blue-400">진행 상황</h2>
            <span className="text-green-300">{currentStep + 1} / {scenario.steps.length}</span>
          </div>
          <div className="flex gap-2">
            {scenario.steps.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-3 rounded-full transition-all duration-300 ${
                  index < currentStep 
                    ? stepResults[index] 
                      ? 'bg-green-500' 
                      : 'bg-red-500'
                    : index === currentStep 
                      ? 'bg-yellow-500 animate-pulse' 
                      : 'bg-gray-600'
                }`}
              ></div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* 발견된 정보 */}
          <div className="bg-black/50 backdrop-blur-sm border border-green-500/30 rounded-lg p-6">
            <h3 className="text-green-400 font-bold mb-4 flex items-center gap-2">
              <Search className="w-5 h-5" />
              {currentStepData.tool === 'EDR' && `프로세스 목록 (단계 ${currentStep + 1})`}
              {currentStepData.tool === 'TIP' && `IOC 정보 (단계 ${currentStep + 1})`}
              {currentStepData.tool === 'SIEM' && `쿼리 구성 요소 (단계 ${currentStep + 1})`}
              {currentStepData.tool === 'SOAR' && `플레이북 목록 (단계 ${currentStep + 1})`}
            </h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {discoveredIOCs.map((ioc) => {
                const isSelected = selectedItems.find(item => item.id === ioc.id);
                const isHighlighted = highlightedIOC === ioc.id;
                return (
                  <div
                    key={ioc.id}
                    onClick={() => handleIOCClick(ioc)}
                    className={`p-3 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                      isSelected 
                        ? 'opacity-50 border-green-500 bg-green-900/30'
                        : isHighlighted
                          ? `scale-105 ring-2 ring-yellow-400 ${getIOCTypeColor(ioc.type)}`
                          : `hover:scale-105 hover:ring-2 hover:ring-yellow-400/50 ${getIOCTypeColor(ioc.type)}`
                    }`}
                  >
                    <div className="font-mono text-sm font-bold">{ioc.value}</div>
                    <div className="text-xs opacity-75">{ioc.category}</div>
                    {isSelected && (
                      <div className="text-xs text-green-400 mt-1 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        선택됨
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 현재 단계 */}
          <div className="bg-black/50 backdrop-blur-sm border border-yellow-500/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              {getToolIcon(currentStepData.tool)}
              <h2 className="text-xl font-bold text-yellow-400">
                단계 {currentStep + 1}: {currentStepData.title}
              </h2>
              <span className="px-3 py-1 bg-purple-900/30 text-purple-300 rounded-lg text-sm">
                {currentStepData.tool}
              </span>
            </div>
            
            <p className="text-green-200 mb-4">{currentStepData.description}</p>
            <p className="text-yellow-300 mb-6 font-semibold">{currentStepData.instruction}</p>

            {/* 선택된 항목 표시 영역 */}
            <div
              className="border-2 border-dashed border-yellow-400 rounded-lg p-6 min-h-32 bg-yellow-900/10"
            >
              <div className="text-center text-yellow-300 mb-4">
                {selectedItems.length === 0 ? (
                  <div>
                    <div className="text-2xl mb-2">👆</div>
                    <div>
                      {currentStepData.tool === 'EDR' && '프로세스를 클릭하여 선택하세요'}
                      {currentStepData.tool === 'TIP' && 'IOC를 클릭하여 선택하세요'}
                      {currentStepData.tool === 'SIEM' && '쿼리 구성 요소를 클릭하여 선택하세요'}
                      {currentStepData.tool === 'SOAR' && '플레이북을 클릭하여 선택하세요'}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-sm text-green-400 mb-3">
                      {currentStepData.tool === 'EDR' && '선택된 프로세스:'}
                      {currentStepData.tool === 'TIP' && '선택된 IOC:'}
                      {currentStepData.tool === 'SIEM' && '선택된 쿼리 구성 요소:'}
                      {currentStepData.tool === 'SOAR' && '선택된 플레이북:'}
                    </div>
                    {selectedItems.map((item) => (
                      <div
                        key={item.id}
                        className={`p-2 rounded border flex items-center justify-between ${getIOCTypeColor(item.type)}`}
                      >
                        <span className="font-mono text-sm">{item.value}</span>
                        <button
                          onClick={() => removeSelectedItem(item.id)}
                          className="text-red-400 hover:text-red-300 ml-2"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 분석 결과 */}
          <div className="bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6">
            <h3 className="text-purple-400 font-bold mb-4 flex items-center gap-2">
              <Terminal className="w-5 h-5" />
              분석 결과
            </h3>
            
            {/* 선택된 항목이 없을 때 안내 메시지 */}
            {selectedItems.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <div className="text-4xl mb-4">🔍</div>
                <p>
                  {currentStepData.tool === 'EDR' && '프로세스를 선택하면 분석 결과가 여기에 표시됩니다.'}
                  {currentStepData.tool === 'TIP' && 'IOC를 선택하면 위협 정보가 여기에 표시됩니다.'}
                  {currentStepData.tool === 'SIEM' && '쿼리 구성 요소를 선택하면 검색 결과가 여기에 표시됩니다.'}
                  {currentStepData.tool === 'SOAR' && '플레이북을 선택하면 실행 결과가 여기에 표시됩니다.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* EDR 도구 결과 */}
                {currentStepData.tool === 'EDR' && (
                  <div className="space-y-3">
                    {selectedItems.map((item) => {
                      const processData = currentStepData.mockData.processes?.find((p: any) => p.name === item.value);
                      return processData ? (
                        <div key={item.id} className="bg-gray-800/50 p-3 rounded border border-gray-600">
                          <div className="font-mono text-sm text-green-300">{processData.name}</div>
                          <div className="text-xs text-gray-400">PID: {processData.pid}</div>
                          <div className={`text-xs ${processData.status === '의심' ? 'text-red-400' : 'text-green-400'}`}>
                            상태: {processData.status}
                          </div>
                          <div className="text-xs text-cyan-400">네트워크: {processData.network}</div>
                          {processData.activity && (
                            <div className="text-xs text-yellow-400">활동: {processData.activity}</div>
                          )}
                          {scenario.id === 2 && processData.name === 'dropbox.exe' && currentStepData.mockData.uploadRecord && (
                            <div className="mt-2 p-2 bg-red-900/30 border border-red-500/30 rounded text-xs">
                              <div className="text-red-400 font-bold">⚠️ 대용량 파일 업로드 감지!</div>
                              <div className="text-yellow-300">파일: {currentStepData.mockData.uploadRecord.file}</div>
                              <div className="text-yellow-300">크기: {currentStepData.mockData.uploadRecord.size}</div>
                              <div className="text-yellow-300">시간: {currentStepData.mockData.uploadRecord.time}</div>
                              <div className="text-yellow-300">사용자: {currentStepData.mockData.uploadRecord.user}</div>
                            </div>
                          )}
                        </div>
                      ) : null;
                    })}
                  </div>
                )}

                {/* TIP 도구 결과 - 시나리오 1 */}
                {currentStepData.tool === 'TIP' && scenario.id === 1 && selectedItems.some(item => item.value === '185.220.101.24') && (
                  <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4">
                    <h4 className="text-red-400 font-bold mb-2">⚠️ 위협 정보 발견!</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-400">IP:</span> {currentStepData.mockData.threatInfo.ip}</p>
                      <p><span className="text-gray-400">평판:</span> <span className="text-red-400">{currentStepData.mockData.threatInfo.reputation}</span></p>
                      <p><span className="text-gray-400">카테고리:</span> {currentStepData.mockData.threatInfo.category}</p>
                      <p><span className="text-gray-400">신뢰도:</span> {currentStepData.mockData.threatInfo.confidence}</p>
                    </div>
                  </div>
                )}

                {/* TIP 도구 결과 - 시나리오 2 */}
                {currentStepData.tool === 'TIP' && scenario.id === 2 && selectedItems.some(item => item.value === 'dropbox.com') && (
                  <div className="bg-orange-900/30 border border-orange-500/50 rounded-lg p-4">
                    <h4 className="text-orange-400 font-bold mb-2">🔍 도메인 정보 확인!</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-400">도메인:</span> {currentStepData.mockData.domainInfo.domain}</p>
                      <p><span className="text-gray-400">평판:</span> <span className="text-green-400">{currentStepData.mockData.domainInfo.reputation}</span></p>
                      <p><span className="text-gray-400">카테고리:</span> {currentStepData.mockData.domainInfo.category}</p>
                      <p><span className="text-gray-400">위험도:</span> <span className="text-yellow-400">{currentStepData.mockData.domainInfo.riskLevel}</span></p>
                      <p><span className="text-gray-400">회사 정책:</span> <span className="text-red-400">{currentStepData.mockData.domainInfo.companyPolicy}</span></p>
                      <p><span className="text-gray-400">사유:</span> {currentStepData.mockData.domainInfo.reason}</p>
                    </div>
                  </div>
                )}

                {/* SIEM 도구 결과 - 시나리오 1 */}
                {currentStepData.tool === 'SIEM' && scenario.id === 1 && selectedItems.length >= 4 && (
                  <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4">
                    <h4 className="text-blue-400 font-bold mb-2">🔍 검색 결과</h4>
                    <div className="text-green-300 text-sm mb-2">
                      쿼리: index="proxy" status="blocked" dest_ip="185.220.101.24" | top user
                    </div>
                    <div className="space-y-2">
                      {currentStepData.mockData.queryResults.map((result: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{result.user}</span>
                          <span className="text-yellow-400">{result.count}회</span>
                          <span className="text-red-400">{result.file}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 p-2 bg-red-900/30 border border-red-500/30 rounded text-sm">
                      <span className="text-red-400 font-bold">⚠️ 최초 유입 경로:</span>
                      <span className="text-yellow-300"> jlee@company.com이 invoice.zip 파일을 통해 최초 감염</span>
                    </div>
                  </div>
                )}

                {/* SIEM 도구 결과 - 시나리오 2 */}
                {currentStepData.tool === 'SIEM' && scenario.id === 2 && selectedItems.length >= 4 && (
                  <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4">
                    <h4 className="text-blue-400 font-bold mb-2">🔍 검색 결과</h4>
                    <div className="text-green-300 text-sm mb-2">
                      쿼리: index="proxy" dest_domain="dropbox.com" action="upload" | stats count by src_ip
                    </div>
                    <div className="space-y-3">
                      {currentStepData.mockData.queryResults.map((result: any, index: number) => (
                        <div key={index} className="bg-gray-800/50 p-2 rounded border border-gray-600">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-cyan-400 font-bold">{result.hostname}</span>
                            <span className="text-yellow-400">{result.count}건 업로드</span>
                          </div>
                          <div className="text-xs text-gray-400 mb-1">IP: {result.src_ip}</div>
                          <div className="text-xs text-green-300">
                            파일: {result.files.join(', ')}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 p-2 bg-red-900/30 border border-red-500/30 rounded text-sm">
                      <span className="text-red-400 font-bold">⚠️ 추가 유출 발견:</span>
                      <span className="text-yellow-300"> 총 3대 PC에서 6건의 기밀 파일이 외부로 유출됨</span>
                    </div>
                  </div>
                )}

                {/* SOAR 도구 결과 - 시나리오 1 */}
                {currentStepData.tool === 'SOAR' && scenario.id === 1 && selectedItems.length > 0 && (
                  <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4">
                    <h4 className="text-green-400 font-bold mb-2">🚀 플레이북 실행</h4>
                    <div className="text-sm">
                      선택된 플레이북: <span className="text-yellow-400">{selectedItems[0]?.value}</span>
                    </div>
                    {selectedItems[0]?.value === '랜섬웨어 초기 대응' && (
                      <div className="mt-4 space-y-2">
                        <div className="text-green-300 font-bold">📋 자동 실행 절차:</div>
                        <div className="space-y-1 text-sm text-green-200">
                          <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            <span>1. 감염된 PC(FIN-PC-07) 네트워크 격리</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            <span>2. C2 서버(185.220.101.24) 방화벽 차단</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            <span>3. 메모리 덤프 및 악성 파일 증거 수집</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            <span>4. 침해사고분석팀에 티켓 자동 생성</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            <span>5. 전사 랜섬웨어 스캔 실행</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            <span>6. 경영진 및 유관부서 상황 전파</span>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-green-900/30 border border-green-500/30 rounded text-sm">
                          <span className="text-green-400 font-bold">🎯 대응 완료:</span>
                          <span className="text-green-200"> 랜섬웨어 확산이 차단되었고, 추가 피해 방지 조치가 완료되었습니다.</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* SOAR 도구 결과 - 시나리오 2 */}
                {currentStepData.tool === 'SOAR' && scenario.id === 2 && selectedItems.length > 0 && (
                  <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4">
                    <h4 className="text-green-400 font-bold mb-2">🚀 플레이북 실행</h4>
                    <div className="text-sm">
                      선택된 플레이북: <span className="text-yellow-400">{selectedItems[0]?.value}</span>
                    </div>
                    {selectedItems[0]?.value === '내부 정보 유출 대응' && (
                      <div className="mt-4 space-y-2">
                        <div className="text-green-300 font-bold">📋 자동 실행 절차:</div>
                        <div className="space-y-1 text-sm text-green-200">
                          <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            <span>1. 관련 사용자 계정 임시 비활성화</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            <span>2. Dropbox.com 접속 차단 정책 적용</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            <span>3. 유출된 파일 목록 수집 및 분류</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            <span>4. 법무팀 및 보안팀에 즉시 보고</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            <span>5. 관련 직원 보안 교육 예약</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            <span>6. 데이터 분류 정책 재검토 요청</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            <span>7. 개인정보보호위원회 신고 검토</span>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-green-900/30 border border-green-500/30 rounded text-sm">
                          <span className="text-green-400 font-bold">🎯 대응 완료:</span>
                          <span className="text-green-200"> 추가 정보 유출이 차단되었고, 법적 대응 및 재발 방지 조치가 완료되었습니다.</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* SIEM 도구 결과 - 시나리오 3 */}
                {currentStepData.tool === 'SIEM' && scenario.id === 3 && currentStep === 0 && selectedItems.length >= 4 && (
                  <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4">
                    <h4 className="text-blue-400 font-bold mb-2">🔍 검색 결과</h4>
                    <div className="text-green-300 text-sm mb-2">
                      쿼리: index="web_server" status="error" earliest=-1h | timechart count
                    </div>
                    <div className="space-y-2">
                      {currentStepData.mockData.queryResults.map((result: any, index: number) => (
                        <div key={index} className={`flex justify-between text-sm p-2 rounded ${result.normal ? 'bg-gray-800/50' : 'bg-red-900/30'}`}>
                          <span>{result.time}</span>
                          <span className={result.normal ? 'text-green-400' : 'text-red-400'}>{result.count}건</span>
                          <span className={result.normal ? 'text-gray-400' : 'text-red-400'}>{result.normal ? '정상' : '급증!'}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 p-2 bg-red-900/30 border border-red-500/30 rounded text-sm">
                      <span className="text-red-400 font-bold">⚠️ 이상 징후:</span>
                      <span className="text-yellow-300"> 14:30부터 웹 서버 에러가 급격히 증가 (정상 대비 20배 이상)</span>
                    </div>
                  </div>
                )}

                {/* SIEM 도구 결과 - 시나리오 3 (2단계) */}
                {currentStepData.tool === 'SIEM' && scenario.id === 3 && currentStep === 1 && selectedItems.length >= 4 && (
                  <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4">
                    <h4 className="text-blue-400 font-bold mb-2">🔍 검색 결과</h4>
                    <div className="text-green-300 text-sm mb-2">
                      쿼리: index="web_access" search="*UNION*SELECT*" src_ip | stats count by src_ip
                    </div>
                    <div className="space-y-3">
                      {currentStepData.mockData.queryResults.map((result: any, index: number) => (
                        <div key={index} className="bg-red-900/30 p-3 rounded border border-red-500">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-red-400 font-bold">{result.src_ip}</span>
                            <span className="text-yellow-400">{result.count}회 공격</span>
                          </div>
                          <div className="text-xs text-gray-400 mb-1">공격 유형: {result.attack_type}</div>
                          <div className="text-xs text-green-300">대상: {result.target}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 p-2 bg-red-900/30 border border-red-500/30 rounded text-sm">
                      <span className="text-red-400 font-bold">⚠️ SQL 인젝션 공격 탐지:</span>
                      <span className="text-yellow-300"> 2개 IP에서 총 59회의 UNION SELECT 공격 시도</span>
                    </div>
                  </div>
                )}

                {/* TIP 도구 결과 - 시나리오 3 */}
                {currentStepData.tool === 'TIP' && scenario.id === 3 && selectedItems.some(item => item.value === '203.0.113.45') && (
                  <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4">
                    <h4 className="text-red-400 font-bold mb-2">⚠️ 위협 정보 발견!</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-400">IP:</span> {currentStepData.mockData.threatInfo.ip}</p>
                      <p><span className="text-gray-400">평판:</span> <span className="text-red-400">{currentStepData.mockData.threatInfo.reputation}</span></p>
                      <p><span className="text-gray-400">카테고리:</span> {currentStepData.mockData.threatInfo.category}</p>
                      <p><span className="text-gray-400">신뢰도:</span> {currentStepData.mockData.threatInfo.confidence}</p>
                      <p><span className="text-gray-400">관련 도구:</span> {currentStepData.mockData.threatInfo.associatedMalware}</p>
                    </div>
                  </div>
                )}

                {/* SOAR 도구 결과 - 시나리오 3 */}
                {currentStepData.tool === 'SOAR' && scenario.id === 3 && selectedItems.length > 0 && (
                  <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4">
                    <h4 className="text-green-400 font-bold mb-2">🚀 플레이북 실행</h4>
                    <div className="text-sm">
                      선택된 플레이북: <span className="text-yellow-400">{selectedItems[0]?.value}</span>
                    </div>
                    {selectedItems[0]?.value === 'SQL 인젝션 대응' && (
                      <div className="mt-4 space-y-2">
                        <div className="text-green-300 font-bold">📋 자동 실행 절차:</div>
                        <div className="space-y-1 text-sm text-green-200">
                          <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            <span>1. 공격자 IP(203.0.113.45, 198.51.100.23) 방화벽 차단</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            <span>2. 웹방화벽에 SQL 인젝션 차단 정책 긴급 적용</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            <span>3. 데이터베이스 접근 로그 수집 및 분석</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            <span>4. 개인정보보호팀에 유출 의심 신고</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            <span>5. 웹 애플리케이션 보안 점검 요청</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            <span>6. 고객 대응팀에 상황 전파</span>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-green-900/30 border border-green-500/30 rounded text-sm">
                          <span className="text-green-400 font-bold">🎯 대응 완료:</span>
                          <span className="text-green-200"> SQL 인젝션 공격이 차단되었고, 추가 데이터 유출 방지 조치가 완료되었습니다.</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* EDR 도구 결과 - 시나리오 4 */}
                {currentStepData.tool === 'EDR' && scenario.id === 4 && (
                  <div className="space-y-3">
                    {selectedItems.map((item) => {
                      const processData = currentStepData.mockData.processes?.find((p: any) => p.name === item.value);
                      return processData ? (
                        <div key={item.id} className="bg-gray-800/50 p-3 rounded border border-gray-600">
                          <div className="font-mono text-sm text-green-300">{processData.name}</div>
                          <div className="text-xs text-gray-400">PID: {processData.pid}</div>
                          <div className={`text-xs ${processData.status === '의심' ? 'text-red-400' : 'text-green-400'}`}>
                            상태: {processData.status}
                          </div>
                          <div className="text-xs text-cyan-400">네트워크: {processData.network}</div>
                          <div className="text-xs text-yellow-400">활동: {processData.activity}</div>
                          {processData.name === 'powershell.exe' && currentStepData.mockData.emailInfo && (
                            <div className="mt-2 p-2 bg-red-900/30 border border-red-500/30 rounded text-xs">
                              <div className="text-red-400 font-bold">⚠️ 스피어 피싱 이메일 탐지!</div>
                              <div className="text-yellow-300">발신자: {currentStepData.mockData.emailInfo.sender}</div>
                              <div className="text-yellow-300">제목: {currentStepData.mockData.emailInfo.subject}</div>
                              <div className="text-yellow-300">첨부파일: {currentStepData.mockData.emailInfo.attachment}</div>
                              <div className="text-yellow-300">실행된 스크립트: {currentStepData.mockData.emailInfo.executedScript}</div>
                            </div>
                          )}
                        </div>
                      ) : null;
                    })}
                  </div>
                )}

                {/* SIEM 도구 결과 - 시나리오 4 */}
                {currentStepData.tool === 'SIEM' && scenario.id === 4 && selectedItems.length >= 4 && (
                  <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4">
                    <h4 className="text-blue-400 font-bold mb-2">🔍 검색 결과</h4>
                    <div className="text-green-300 text-sm mb-2">
                      쿼리: index="authentication" user="ceo@company.com" src_country!="Korea" status="success" | table _time src_ip src_country
                    </div>
                    <div className="space-y-3">
                      {currentStepData.mockData.queryResults.map((result: any, index: number) => (
                        <div key={index} className="bg-red-900/30 p-3 rounded border border-red-500">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-red-400 font-bold">{result.src_ip}</span>
                            <span className="text-yellow-400">{result.src_country}</span>
                          </div>
                          <div className="text-xs text-gray-400 mb-1">시간: {result.time}</div>
                          <div className="text-xs text-green-300">디바이스: {result.device}</div>
                          <div className="text-xs text-green-300">브라우저: {result.browser}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 p-2 bg-red-900/30 border border-red-500/30 rounded text-sm">
                      <span className="text-red-400 font-bold">⚠️ 비정상 로그인 탐지:</span>
                      <span className="text-yellow-300"> CEO 계정이 러시아에서 2회 로그인됨</span>
                    </div>
                  </div>
                )}

                {/* TIP 도구 결과 - 시나리오 4 */}
                {currentStepData.tool === 'TIP' && scenario.id === 4 && selectedItems.some(item => item.value === '185.220.102.15') && (
                  <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4">
                    <h4 className="text-red-400 font-bold mb-2">⚠️ 위협 정보 발견!</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-400">IP:</span> {currentStepData.mockData.threatInfo.ip}</p>
                      <p><span className="text-gray-400">평판:</span> <span className="text-red-400">{currentStepData.mockData.threatInfo.reputation}</span></p>
                      <p><span className="text-gray-400">카테고리:</span> {currentStepData.mockData.threatInfo.category}</p>
                      <p><span className="text-gray-400">신뢰도:</span> {currentStepData.mockData.threatInfo.confidence}</p>
                      <p><span className="text-gray-400">관련 그룹:</span> {currentStepData.mockData.threatInfo.associatedGroup}</p>
                    </div>
                  </div>
                )}

                {/* SOAR 도구 결과 - 시나리오 4 */}
                {currentStepData.tool === 'SOAR' && scenario.id === 4 && selectedItems.length > 0 && (
                  <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4">
                    <h4 className="text-green-400 font-bold mb-2">🚀 플레이북 실행</h4>
                    <div className="text-sm">
                      선택된 플레이북: <span className="text-yellow-400">{selectedItems[0]?.value}</span>
                    </div>
                    {selectedItems[0]?.value === '계정 탈취 대응' && (
                      <div className="mt-4 space-y-2">
                        <div className="text-green-300 font-bold">📋 자동 실행 절차:</div>
                        <div className="space-y-1 text-sm text-green-200">
                          <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            <span>1. CEO 계정 즉시 비밀번호 강제 변경</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            <span>2. 모든 활성 세션 강제 종료</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            <span>3. 공격자 IP(185.220.102.15) 방화벽 차단</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            <span>4. 다단계 인증(MFA) 강제 활성화</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            <span>5. 이메일 계정 보안 스캔 실행</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            <span>6. 경영진 및 IT팀에 즉시 보고</span>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-green-900/30 border border-green-500/30 rounded text-sm">
                          <span className="text-green-400 font-bold">🎯 대응 완료:</span>
                          <span className="text-green-200"> 탈취된 계정이 보호되었고, 공격자의 접근이 차단되었습니다.</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* EDR 도구 결과 - 시나리오 5 */}
                {currentStepData.tool === 'EDR' && scenario.id === 5 && (
                  <div className="space-y-3">
                    {selectedItems.map((item) => {
                      const processData = currentStepData.mockData.processes?.find((p: any) => p.name === item.value);
                      return processData ? (
                        <div key={item.id} className="bg-gray-800/50 p-3 rounded border border-gray-600">
                          <div className="font-mono text-sm text-green-300">{processData.name}</div>
                          <div className="text-xs text-gray-400">PID: {processData.pid}</div>
                          <div className={`text-xs ${processData.status === '의심' ? 'text-red-400' : 'text-green-400'}`}>
                            상태: {processData.status}
                          </div>
                          <div className="text-xs text-cyan-400">네트워크: {processData.network}</div>
                          <div className="text-xs text-yellow-400">활동: {processData.activity}</div>
                          {processData.name === 'rundll32.exe' && currentStepData.mockData.malwareInfo && (
                            <div className="mt-2 p-2 bg-red-900/30 border border-red-500/30 rounded text-xs">
                              <div className="text-red-400 font-bold">⚠️ 워터링 홀 공격 탐지!</div>
                              <div className="text-yellow-300">부모 프로세스: {currentStepData.mockData.malwareInfo.parentProcess}</div>
                              <div className="text-yellow-300">다운로드된 파일: {currentStepData.mockData.malwareInfo.downloadedFile}</div>
                              <div className="text-yellow-300">C2 서버: {currentStepData.mockData.malwareInfo.c2Server}</div>
                              <div className="text-yellow-300">주입된 프로세스: {currentStepData.mockData.malwareInfo.injectedProcess}</div>
                            </div>
                          )}
                        </div>
                      ) : null;
                    })}
                  </div>
                )}

                {/* SIEM 도구 결과 - 시나리오 5 */}
                {currentStepData.tool === 'SIEM' && scenario.id === 5 && selectedItems.length >= 6 && (
                  <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4">
                    <h4 className="text-blue-400 font-bold mb-2">🔍 검색 결과</h4>
                    <div className="text-green-300 text-sm mb-2">
                      쿼리: index="proxy" src_ip="192.168.1.*" earliest=-2h status="200" | stats count by dest_domain | where count &gt; 5
                    </div>
                    <div className="space-y-3">
                      {currentStepData.mockData.queryResults.map((result: any, index: number) => (
                        <div key={index} className={`p-3 rounded border ${result.category === '개발자 커뮤니티' ? 'bg-red-900/30 border-red-500' : 'bg-gray-800/50 border-gray-600'}`}>
                          <div className="flex justify-between items-center mb-1">
                            <span className={result.category === '개발자 커뮤니티' ? 'text-red-400 font-bold' : 'text-green-400'}>{result.dest_domain}</span>
                            <span className="text-yellow-400">{result.count}회 접속</span>
                          </div>
                          <div className="text-xs text-gray-400">카테고리: {result.category}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 p-2 bg-red-900/30 border border-red-500/30 rounded text-sm">
                      <span className="text-red-400 font-bold">⚠️ 공통 접속 사이트 발견:</span>
                      <span className="text-yellow-300"> 12명이 devforum-community.org에 공통 접속</span>
                    </div>
                  </div>
                )}

                {/* TIP 도구 결과 - 시나리오 5 */}
                {currentStepData.tool === 'TIP' && scenario.id === 5 && selectedItems.some(item => item.value === 'devforum-community.org') && (
                  <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4">
                    <h4 className="text-red-400 font-bold mb-2">⚠️ 위협 정보 발견!</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-400">도메인:</span> {currentStepData.mockData.threatInfo.domain}</p>
                      <p><span className="text-gray-400">평판:</span> <span className="text-red-400">{currentStepData.mockData.threatInfo.reputation}</span></p>
                      <p><span className="text-gray-400">카테고리:</span> {currentStepData.mockData.threatInfo.category}</p>
                      <p><span className="text-gray-400">신뢰도:</span> {currentStepData.mockData.threatInfo.confidence}</p>
                      <p><span className="text-gray-400">공격 방법:</span> {currentStepData.mockData.threatInfo.attackMethod}</p>
                    </div>
                  </div>
                )}

                {/* SOAR 도구 결과 - 시나리오 5 */}
                {currentStepData.tool === 'SOAR' && scenario.id === 5 && selectedItems.length > 0 && (
                  <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4">
                    <h4 className="text-green-400 font-bold mb-2">🚀 플레이북 실행</h4>
                    <div className="text-sm">
                      선택된 플레이북: <span className="text-yellow-400">{selectedItems[0]?.value}</span>
                    </div>
                    {selectedItems[0]?.value === '워터링 홀 공격 대응' && (
                      <div className="mt-4 space-y-2">
                        <div className="text-green-300 font-bold">📋 자동 실행 절차:</div>
                        <div className="space-y-1 text-sm text-green-200">
                          <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            <span>1. 감염된 PC들(DEV-PC-05 등) 네트워크 격리</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            <span>2. devforum-community.org 전사 접속 차단</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            <span>3. C2 서버(203.0.113.88) 방화벽 차단</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            <span>4. 전사 악성코드 스캔 실행</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            <span>5. 개발팀에 보안 경고 발송</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            <span>6. 브라우저 보안 정책 강화</span>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-green-900/30 border border-green-500/30 rounded text-sm">
                          <span className="text-green-400 font-bold">🎯 대응 완료:</span>
                          <span className="text-green-200"> 악성 사이트 접속이 차단되었고, 감염된 PC들이 격리되어 추가 피해가 방지되었습니다.</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* SIEM 도구 결과 - 시나리오 6 (1단계) */}
                {currentStepData.tool === 'SIEM' && scenario.id === 6 && currentStep === 0 && selectedItems.length >= 4 && (
                  <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4">
                    <h4 className="text-blue-400 font-bold mb-2">🔍 검색 결과</h4>
                    <div className="text-green-300 text-sm mb-2">
                      쿼리: index="vpn_auth" status="failed" user="admin" | timechart count by src_ip
                    </div>
                    <div className="space-y-2">
                      {currentStepData.mockData.queryResults.map((result: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm p-2 rounded bg-red-900/30">
                          <span>{result.time}</span>
                          <span className="text-red-400 font-bold">{result.src_ip}</span>
                          <span className="text-yellow-400">{result.count}회 실패</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 p-2 bg-red-900/30 border border-red-500/30 rounded text-sm">
                      <span className="text-red-400 font-bold">⚠️ 무차별 대입 공격 탐지:</span>
                      <span className="text-yellow-300"> 203.0.113.77에서 1시간 동안 780회 로그인 시도</span>
                    </div>
                  </div>
                )}

                {/* SIEM 도구 결과 - 시나리오 6 (2단계) */}
                {currentStepData.tool === 'SIEM' && scenario.id === 6 && currentStep === 1 && selectedItems.length >= 6 && (
                  <div className="bg-blue-900/30 border border-blue-500/50 rounded-lg p-4">
                    <h4 className="text-blue-400 font-bold mb-2">🔍 검색 결과</h4>
                    <div className="text-green-300 text-sm mb-2">
                      쿼리: index="vpn_auth" src_ip="203.0.113.77" earliest=-1h password_attempted | stats count by password_attempted | sort -count
                    </div>
                    <div className="space-y-2">
                      {currentStepData.mockData.queryResults.map((result: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm p-2 rounded bg-gray-800/50">
                          <span className="text-yellow-400">{result.password_attempted}</span>
                          <span className="text-red-400">{result.count}회 시도</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 p-2 bg-red-900/30 border border-red-500/30 rounded text-sm">
                      <span className="text-red-400 font-bold">⚠️ 사전 공격 패턴:</span>
                      <span className="text-yellow-300"> 일반적인 약한 패스워드 사전을 이용한 체계적 공격</span>
                    </div>
                  </div>
                )}

                {/* TIP 도구 결과 - 시나리오 6 */}
                {currentStepData.tool === 'TIP' && scenario.id === 6 && selectedItems.some(item => item.value === '203.0.113.77') && (
                  <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4">
                    <h4 className="text-red-400 font-bold mb-2">⚠️ 위협 정보 발견!</h4>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-gray-400">IP:</span> {currentStepData.mockData.threatInfo.ip}</p>
                      <p><span className="text-gray-400">평판:</span> <span className="text-red-400">{currentStepData.mockData.threatInfo.reputation}</span></p>
                      <p><span className="text-gray-400">카테고리:</span> {currentStepData.mockData.threatInfo.category}</p>
                      <p><span className="text-gray-400">신뢰도:</span> {currentStepData.mockData.threatInfo.confidence}</p>
                      <p><span className="text-gray-400">관련 공격:</span> {currentStepData.mockData.threatInfo.associatedAttacks}</p>
                    </div>
                  </div>
                )}

                {/* SOAR 도구 결과 - 시나리오 6 */}
                {currentStepData.tool === 'SOAR' && scenario.id === 6 && selectedItems.length > 0 && (
                  <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4">
                    <h4 className="text-green-400 font-bold mb-2">🚀 플레이북 실행</h4>
                    <div className="text-sm">
                      선택된 플레이북: <span className="text-yellow-400">{selectedItems[0]?.value}</span>
                    </div>
                    {selectedItems[0]?.value === '무차별 대입 공격 대응' && (
                      <div className="mt-4 space-y-2">
                        <div className="text-green-300 font-bold">📋 자동 실행 절차:</div>
                        <div className="space-y-1 text-sm text-green-200">
                          <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            <span>1. 공격자 IP(203.0.113.77) 방화벽 차단</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            <span>2. admin 계정 임시 잠금 조치</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            <span>3. VPN 접속 실패 임계값 강화</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            <span>4. 관리자 계정 패스워드 정책 강화</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            <span>5. 다단계 인증(MFA) 강제 적용</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-green-400">✓</span>
                            <span>6. IT 관리팀에 보안 강화 권고</span>
                          </div>
                        </div>
                        <div className="mt-3 p-2 bg-green-900/30 border border-green-500/30 rounded text-sm">
                          <span className="text-green-400 font-bold">🎯 대응 완료:</span>
                          <span className="text-green-200"> 무차별 대입 공격이 차단되었고, VPN 보안이 강화되었습니다.</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 힌트 및 액션 */}
        <div className="flex gap-4 justify-between items-center">
          <div className="flex gap-4">
            <button
              onClick={goToPreviousStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg
                       hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              이전 단계
            </button>
            
            <button
              onClick={showNextHint}
              disabled={hintIndex >= currentStepData.hints.length - 1 && showHint}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              💡 힌트 {showHint ? `(${hintIndex + 1}/${currentStepData.hints.length})` : ''}
            </button>
            
            {showHint && (
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 max-w-md">
                <p className="text-yellow-300 text-sm">{currentStepData.hints[hintIndex]}</p>
              </div>
            )}
          </div>

          <button
            onClick={handleStepSubmit}
            disabled={selectedItems.length === 0 || !currentStepData}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-bold"
          >
            {currentStep === scenario.steps.length - 1 ? '완료' : '다음 단계'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default ScenarioTraining;