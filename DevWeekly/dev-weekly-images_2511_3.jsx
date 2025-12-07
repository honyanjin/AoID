import React, { useState } from 'react';
import { Monitor, Shield, Cpu, Database, Cloud, Code, Zap, AlertTriangle, Rocket, Server, Globe, Lock, Terminal, Box, FileCode, Sparkles, Brain, ChevronLeft, ChevronRight } from 'lucide-react';

const NewsImageGallery = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);

  const sections = [
    {
      title: "오프닝 빠른 소식",
      images: [
        // 1. Node.js
        {
          title: "Node.js v25.2.1 버그 수정 릴리스",
          render: () => (
            <div className="w-full h-80 bg-gradient-to-br from-green-900 via-green-800 to-black flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="absolute text-green-300 text-xs font-mono" style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    transform: `rotate(${Math.random() * 360}deg)`
                  }}>
                    {'{code}'}
                  </div>
                ))}
              </div>
              <div className="relative z-10 flex flex-col items-center">
                <img
                  src="./Ref_Asset/NodeJs_Logo_251127.svg"
                  alt="Node.js Logo"
                  className="w-28 h-28 mb-4"
                />
                <div className="text-white text-4xl font-bold mb-2">Node.js</div>
                <div className="bg-green-500 px-6 py-2 rounded-full">
                  <span className="text-white text-2xl font-mono font-bold">v25.2.1</span>
                </div>
                <div className="text-green-300 mt-3 text-sm">localStorage 변경 롤백 | 버그 수정</div>
              </div>
            </div>
          )
        },
        // 2. .NET
        {
          title: ".NET 11월 서비스 업데이트",
          render: () => (
            <div className="w-full h-80 bg-gradient-to-br from-purple-900 via-violet-800 to-purple-950 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-violet-500/20 rounded-full blur-3xl"></div>
              </div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="text-white text-5xl font-bold mb-2">.NET</div>
                <div className="flex gap-4 mt-4">
                  <div className="bg-purple-600 px-4 py-2 rounded-lg">
                    <span className="text-white font-mono font-bold">9.0.11</span>
                  </div>
                  <div className="bg-violet-600 px-4 py-2 rounded-lg">
                    <span className="text-white font-mono font-bold">8.0.22</span>
                  </div>
                </div>
                <div className="mt-4 text-purple-200 text-lg">November 2025 Update</div>
                <div className="mt-2 text-purple-300 text-sm">안정성 개선 | 버그 수정</div>
              </div>
            </div>
          )
        },
        // 3. GitHub Actions
        {
          title: "GitHub Actions 11월 업데이트",
          render: () => (
            <div className="w-full h-80 bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="absolute h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent w-full" style={{ top: `${20 + i * 15}%`, opacity: 0.3 }}></div>
                ))}
              </div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <Zap className="w-8 h-8 text-gray-900" />
                  </div>
                  <div className="text-white text-3xl font-bold">GitHub Actions</div>
                </div>
                <div className="flex gap-6 mt-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-400">10x</div>
                    <div className="text-gray-400 text-sm">중첩 한도</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-400">50</div>
                    <div className="text-gray-400 text-sm">워크플로우</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-400">M2</div>
                    <div className="text-gray-400 text-sm">macOS 러너</div>
                  </div>
                </div>
              </div>
            </div>
          )
        },
        // 4. PostgreSQL EOL
        {
          title: "PostgreSQL 13 지원 종료",
          render: () => (
            <div className="w-full h-80 bg-gradient-to-br from-slate-900 via-red-950 to-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <div className="w-64 h-64 border-8 border-red-500 rounded-full"></div>
              </div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="flex items-center gap-3 mb-2">
                  <Database className="w-12 h-12 text-blue-400" />
                  <span className="text-white text-3xl font-bold">PostgreSQL</span>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                  <span className="text-red-500 text-2xl font-bold">END OF LIFE</span>
                </div>
                <div className="bg-red-900/50 border border-red-500 px-6 py-3 rounded-lg mt-4">
                  <span className="text-white text-3xl font-mono font-bold">v13</span>
                </div>
                <div className="text-gray-400 mt-3 text-sm">⚠️ 즉시 v14 이상으로 마이그레이션 필요</div>
              </div>
            </div>
          )
        },
        // 5. Docker Desktop
        {
          title: "Docker Desktop 4.31 베타 기능",
          render: () => (
            <div className="w-full h-80 bg-gradient-to-br from-blue-900 via-cyan-900 to-blue-950 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute top-5 right-5 w-20 h-20 bg-cyan-500/20 rounded-full blur-2xl"></div>
              <div className="absolute bottom-5 left-5 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl"></div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="flex items-center gap-4 mb-4">
                  <Box className="w-14 h-14 text-cyan-400" />
                  <span className="text-3xl font-bold text-white">Docker Desktop</span>
                </div>
                <div className="bg-cyan-600 px-4 py-1 rounded-full mb-4">
                  <span className="text-white font-mono">v4.31 BETA</span>
                </div>
                <div className="flex items-center gap-3 bg-gray-800/50 px-6 py-3 rounded-lg">
                  <Zap className="w-6 h-6 text-yellow-400" />
                  <span className="text-white">GitHub Actions 빌드 검사</span>
                </div>
              </div>
            </div>
          )
        },
        // 6. AWS Lambda Rust
        {
          title: "AWS Lambda Rust 공식 지원",
          render: () => (
            <div className="w-full h-80 bg-gradient-to-br from-orange-900 via-amber-900 to-gray-900 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-orange-500 rotate-45"></div>
                <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border border-amber-500 rotate-12"></div>
              </div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="flex items-center gap-6 mb-4">
                  <div className="flex flex-col items-center">
                    <Cloud className="w-12 h-12 text-orange-400" />
                    <span className="text-orange-400 font-bold">AWS Lambda</span>
                  </div>
                  <span className="text-white text-3xl">+</span>
                  <div className="flex flex-col items-center">
                    <Code className="w-12 h-12 text-amber-500" />
                    <span className="text-amber-500 font-bold">Rust</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-orange-600 to-amber-600 px-6 py-2 rounded-full mt-4">
                  <span className="text-white font-bold">공식 지원 시작 🎉</span>
                </div>
                <div className="text-gray-400 mt-3 text-sm">Runtime Interface Client v1.0.0</div>
              </div>
            </div>
          )
        }
      ]
    },
    {
      title: "메인뉴스",
      images: [
        // Main 1. Gemini 3 Pro
        {
          title: "Google Gemini 3 Pro 출시",
          render: () => (
            <div className="w-full h-80 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0">
                {[...Array(30)].map((_, i) => (
                  <div key={i} className="absolute w-1 h-1 bg-white rounded-full animate-pulse" style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`
                  }}></div>
                ))}
              </div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-10 h-10 text-white" />
                  <span className="text-white text-4xl font-bold">Gemini 3</span>
                  <span className="bg-white text-purple-600 px-3 py-1 rounded-full font-bold">Pro</span>
                </div>
                <div className="text-white/80 text-lg mt-2 mb-4">"Vibe Coding" 시대의 시작</div>
                <div className="flex gap-4">
                  <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg text-center">
                    <div className="text-white text-2xl font-bold">54.2%</div>
                    <div className="text-white/70 text-xs">Terminal-Bench</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-lg text-center">
                    <div className="text-white text-2xl font-bold">1487</div>
                    <div className="text-white/70 text-xs">WebDev Elo</div>
                  </div>
                </div>
                <div className="mt-4 bg-black/30 px-4 py-2 rounded-full">
                  <span className="text-white text-sm">🚀 Antigravity Platform 동시 출시</span>
                </div>
              </div>
            </div>
          )
        },
        // Main 2. GPT-5.1
        {
          title: "OpenAI GPT-5.1 API 출시",
          render: () => (
            <div className="w-full h-80 bg-gradient-to-br from-emerald-900 via-teal-900 to-gray-900 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-emerald-500/20 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 border border-teal-500/20 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-green-500/20 rounded-full"></div>
              </div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="flex items-center gap-3 mb-2">
                  <Brain className="w-10 h-10 text-emerald-400" />
                  <span className="text-white text-4xl font-bold">GPT-5.1</span>
                </div>
                <div className="text-emerald-300 mb-4">적응형 추론 (Adaptive Reasoning)</div>
                <div className="flex gap-4">
                  <div className="bg-emerald-800/50 border border-emerald-500 px-4 py-2 rounded-lg text-center">
                    <div className="text-emerald-300 text-xl font-bold">2-3x</div>
                    <div className="text-gray-400 text-xs">더 빠름</div>
                  </div>
                  <div className="bg-teal-800/50 border border-teal-500 px-4 py-2 rounded-lg text-center">
                    <div className="text-teal-300 text-xl font-bold">50%</div>
                    <div className="text-gray-400 text-xs">토큰 절감</div>
                  </div>
                  <div className="bg-green-800/50 border border-green-500 px-4 py-2 rounded-lg text-center">
                    <div className="text-green-300 text-xl font-bold">76.3%</div>
                    <div className="text-gray-400 text-xs">SWE-bench</div>
                  </div>
                </div>
                <div className="mt-4 text-gray-400 text-sm">+ Codex-Max: 프로젝트 규모 코딩</div>
              </div>
            </div>
          )
        },
        // Main 3. Microsoft Ignite
        {
          title: "Microsoft Ignite 2025",
          render: () => (
            <div className="w-full h-80 bg-gradient-to-br from-blue-800 via-indigo-900 to-purple-900 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-blue-500"></div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="text-white text-2xl font-bold mb-1">Microsoft</div>
                <div className="text-cyan-400 text-4xl font-bold mb-4">Ignite 2025</div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-blue-600/50 border border-blue-400 px-3 py-2 rounded-lg text-center">
                    <Database className="w-6 h-6 text-blue-300 mx-auto mb-1" />
                    <div className="text-white text-sm font-bold">SQL 2025</div>
                    <div className="text-blue-300 text-xs">GA</div>
                  </div>
                  <div className="bg-purple-600/50 border border-purple-400 px-3 py-2 rounded-lg text-center">
                    <Cloud className="w-6 h-6 text-purple-300 mx-auto mb-1" />
                    <div className="text-white text-sm font-bold">HorizonDB</div>
                    <div className="text-purple-300 text-xs">Preview</div>
                  </div>
                  <div className="bg-cyan-600/50 border border-cyan-400 px-3 py-2 rounded-lg text-center">
                    <Sparkles className="w-6 h-6 text-cyan-300 mx-auto mb-1" />
                    <div className="text-white text-sm font-bold">Copilot</div>
                    <div className="text-cyan-300 text-xs">GPT-5</div>
                  </div>
                </div>
                <div className="mt-4 text-gray-300 text-sm">AI 준비 완료 데이터베이스 시대</div>
              </div>
            </div>
          )
        },
        // Main 4. Security Alert
        {
          title: "긴급 보안 이슈 종합",
          render: () => (
            <div className="w-full h-80 bg-gradient-to-br from-red-900 via-red-800 to-gray-900 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-30">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="absolute border border-red-500" style={{
                    width: `${50 + i * 30}px`,
                    height: `${50 + i * 30}px`,
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '50%'
                  }}></div>
                ))}
              </div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-10 h-10 text-red-500 animate-pulse" />
                  <span className="text-red-500 text-3xl font-bold">ZERO-DAY ALERT</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-red-900/50 border border-red-500 px-4 py-2 rounded-lg flex items-center gap-2">
                    <Globe className="w-5 h-5 text-yellow-400" />
                    <span className="text-white text-sm">Chrome V8</span>
                  </div>
                  <div className="bg-red-900/50 border border-red-500 px-4 py-2 rounded-lg flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-blue-400" />
                    <span className="text-white text-sm">Windows 커널</span>
                  </div>
                  <div className="bg-red-900/50 border border-red-500 px-4 py-2 rounded-lg flex items-center gap-2">
                    <Box className="w-5 h-5 text-cyan-400" />
                    <span className="text-white text-sm">runC 탈출</span>
                  </div>
                  <div className="bg-red-900/50 border border-red-500 px-4 py-2 rounded-lg flex items-center gap-2">
                    <FileCode className="w-5 h-5 text-green-400" />
                    <span className="text-white text-sm">7-Zip</span>
                  </div>
                </div>
                <div className="mt-4 bg-red-600 px-4 py-2 rounded-full">
                  <span className="text-white font-bold">⚠️ 즉시 패치 필요</span>
                </div>
              </div>
            </div>
          )
        },
        // Main 5. LangChain 1.0
        {
          title: "LangChain 1.0 정식 출시",
          render: () => (
            <div className="w-full h-80 bg-gradient-to-br from-amber-900 via-orange-900 to-gray-900 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="absolute w-4 h-4 border-2 border-amber-400" style={{
                    left: `${10 + i * 12}%`,
                    top: `${30 + (i % 3) * 20}%`,
                    transform: `rotate(${i * 15}deg)`
                  }}></div>
                ))}
              </div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="w-8 h-8 bg-amber-500 rounded-full -ml-2 first:ml-0 border-2 border-amber-900 flex items-center justify-center">
                        <Code className="w-4 h-4 text-white" />
                      </div>
                    ))}
                  </div>
                  <span className="text-white text-3xl font-bold">LangChain</span>
                </div>
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-2 rounded-full mb-4">
                  <span className="text-white text-2xl font-bold">1.0 STABLE</span>
                </div>
                <div className="flex gap-3">
                  <div className="bg-amber-800/50 px-3 py-2 rounded-lg text-center">
                    <span className="text-amber-300 text-sm">안정적 API</span>
                  </div>
                  <div className="bg-orange-800/50 px-3 py-2 rounded-lg text-center">
                    <span className="text-orange-300 text-sm">LangGraph Platform</span>
                  </div>
                </div>
                <div className="mt-3 text-gray-400 text-sm">AI 에이전트 개발의 새 기준</div>
              </div>
            </div>
          )
        },
        // Main 6. Korea News
        {
          title: "국내 AI·클라우드 동향",
          render: () => (
            <div className="w-full h-80 bg-gradient-to-br from-sky-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-10 left-10 text-6xl">🇰🇷</div>
                <div className="absolute bottom-10 right-10 text-4xl">🏢</div>
              </div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="text-white text-2xl font-bold mb-4">🇰🇷 국내 AI 인프라 투자</div>
                <div className="bg-sky-800/50 border border-sky-400 px-6 py-4 rounded-xl mb-4">
                  <div className="text-center">
                    <div className="text-sky-300 text-sm">Princeton Digital Group</div>
                    <div className="text-white text-3xl font-bold">$700M</div>
                    <div className="text-sky-400 text-sm">약 9,800억 원</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="bg-blue-800/50 px-3 py-2 rounded-lg text-center">
                    <Server className="w-5 h-5 text-blue-300 mx-auto" />
                    <div className="text-white text-xs mt-1">500MW</div>
                  </div>
                  <div className="bg-indigo-800/50 px-3 py-2 rounded-lg text-center">
                    <Cloud className="w-5 h-5 text-indigo-300 mx-auto" />
                    <div className="text-white text-xs mt-1">KT Cloud +23%</div>
                  </div>
                  <div className="bg-violet-800/50 px-3 py-2 rounded-lg text-center">
                    <Sparkles className="w-5 h-5 text-violet-300 mx-auto" />
                    <div className="text-white text-xs mt-1">AI Summit</div>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      ]
    },
    {
      title: "클로징 뉴스",
      images: [
        // Closing 1. Zork
        {
          title: "Microsoft, Zork 오픈소스화",
          render: () => (
            <div className="w-full h-80 bg-black flex flex-col items-center justify-center relative overflow-hidden font-mono">
              <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 to-black"></div>
              <div className="relative z-10 flex flex-col items-center text-green-400">
                <div className="border-2 border-green-500 p-6 rounded-lg bg-black/80">
                  <div className="text-sm mb-2">&gt; WEST OF HOUSE</div>
                  <div className="text-xs text-green-300 mb-4">You are standing in an open field...</div>
                  <div className="text-2xl font-bold text-center mb-2">ZORK I, II, III</div>
                  <div className="text-center">
                    <span className="bg-green-900 px-3 py-1 rounded text-sm">MIT License</span>
                  </div>
                </div>
                <div className="mt-4 text-green-300 text-sm">게임 역사의 소스코드 공개 🎮</div>
                <div className="text-green-500 text-xs mt-2 animate-pulse">_ </div>
              </div>
            </div>
          )
        },
        // Closing 2. CPython + Rust
        {
          title: "CPython에 Rust 도입 제안",
          render: () => (
            <div className="w-full h-80 bg-gradient-to-br from-yellow-900 via-orange-900 to-gray-900 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <div className="text-9xl">🐍</div>
              </div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-yellow-500 w-16 h-16 rounded-lg flex items-center justify-center">
                    <span className="text-3xl">🐍</span>
                  </div>
                  <span className="text-white text-3xl">+</span>
                  <div className="bg-orange-700 w-16 h-16 rounded-lg flex items-center justify-center">
                    <Code className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="text-white text-2xl font-bold mb-2">CPython + Rust</div>
                <div className="bg-yellow-800/50 border border-yellow-500 px-4 py-2 rounded-lg">
                  <span className="text-yellow-300">PEP 제안 논의 중</span>
                </div>
                <div className="mt-4 text-gray-400 text-sm">Python 30년 역사의 전환점?</div>
              </div>
            </div>
          )
        },
        // Closing 3. VS Code Open Source
        {
          title: "VS Code 인라인 제안 오픈소스화",
          render: () => (
            <div className="w-full h-80 bg-gradient-to-br from-blue-900 via-blue-800 to-gray-900 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="relative z-10 flex flex-col items-center">
                <div className="bg-blue-600 w-20 h-20 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/50">
                  <FileCode className="w-10 h-10 text-white" />
                </div>
                <div className="text-white text-2xl font-bold mb-2">VS Code</div>
                <div className="text-blue-300 mb-4">AI 인라인 제안 코드</div>
                <div className="flex items-center gap-2 bg-green-800/50 border border-green-500 px-4 py-2 rounded-full">
                  <Lock className="w-4 h-4 text-green-400" />
                  <span className="text-green-300 font-bold">OPEN SOURCE</span>
                </div>
                <div className="mt-3 text-gray-400 text-sm">투명성 + 커뮤니티 기여</div>
              </div>
            </div>
          )
        },
        // Closing 4. Weekly Trends
        {
          title: "이번 주 트렌드 정리",
          render: () => (
            <div className="w-full h-80 bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="relative z-10 flex flex-col items-center w-full px-8">
                <div className="text-white text-xl font-bold mb-6">📊 이번 주 핵심 키워드</div>
                <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                  <div className="bg-gradient-to-b from-purple-600 to-purple-800 p-4 rounded-xl text-center">
                    <Sparkles className="w-8 h-8 text-white mx-auto mb-2" />
                    <div className="text-white font-bold text-sm">AI 통합</div>
                    <div className="text-purple-200 text-xs mt-1">필수 시대</div>
                  </div>
                  <div className="bg-gradient-to-b from-orange-600 to-orange-800 p-4 rounded-xl text-center">
                    <Shield className="w-8 h-8 text-white mx-auto mb-2" />
                    <div className="text-white font-bold text-sm">메모리 안전</div>
                    <div className="text-orange-200 text-xs mt-1">Rust 급상승</div>
                  </div>
                  <div className="bg-gradient-to-b from-red-600 to-red-800 p-4 rounded-xl text-center">
                    <AlertTriangle className="w-8 h-8 text-white mx-auto mb-2" />
                    <div className="text-white font-bold text-sm">제로데이</div>
                    <div className="text-red-200 text-xs mt-1">즉시 패치</div>
                  </div>
                </div>
                <div className="mt-4 text-gray-400 text-sm">Dev Weekly - 다음 주에 만나요! 👋</div>
              </div>
            </div>
          )
        }
      ]
    }
  ];

  const currentSectionData = sections[currentSection];
  const currentImageData = currentSectionData.images[currentImage];

  const nextImage = () => {
    if (currentImage < currentSectionData.images.length - 1) {
      setCurrentImage(currentImage + 1);
    } else if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
      setCurrentImage(0);
    }
  };

  const prevImage = () => {
    if (currentImage > 0) {
      setCurrentImage(currentImage - 1);
    } else if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
      setCurrentImage(sections[currentSection - 1].images.length - 1);
    }
  };

  const totalImages = sections.reduce((acc, s) => acc + s.images.length, 0);
  const currentTotal = sections.slice(0, currentSection).reduce((acc, s) => acc + s.images.length, 0) + currentImage + 1;

  return (
    <div className="min-h-screen bg-gray-950 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-white text-2xl font-bold">Dev Weekly 뉴스 이미지</h1>
          <p className="text-gray-400 text-sm">2025년 11월 17일~23일</p>
        </div>

        {/* Section Tabs */}
        <div className="flex gap-2 mb-4 justify-center">
          {sections.map((section, idx) => (
            <button
              key={idx}
              onClick={() => { setCurrentSection(idx); setCurrentImage(0); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentSection === idx 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {section.title}
            </button>
          ))}
        </div>

        {/* Image Display */}
        <div className="bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
          {/* Image Title */}
          <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
            <span className="text-white font-medium">{currentImageData.title}</span>
            <span className="text-gray-400 text-sm">{currentTotal} / {totalImages}</span>
          </div>

          {/* Image Content */}
          <div className="relative">
            {currentImageData.render()}
          </div>

          {/* Navigation */}
          <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
            <button
              onClick={prevImage}
              disabled={currentSection === 0 && currentImage === 0}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              이전
            </button>
            
            <div className="flex gap-1">
              {currentSectionData.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImage(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentImage === idx ? 'bg-blue-500 w-4' : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextImage}
              disabled={currentSection === sections.length - 1 && currentImage === currentSectionData.images.length - 1}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white transition-all"
            >
              다음
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Image List */}
        <div className="mt-6 bg-gray-900 rounded-xl p-4">
          <h3 className="text-white font-bold mb-3">{currentSectionData.title} 이미지 목록</h3>
          <div className="grid grid-cols-2 gap-2">
            {currentSectionData.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImage(idx)}
                className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${
                  currentImage === idx
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {idx + 1}. {img.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsImageGallery;
