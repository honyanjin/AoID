import React, { useState } from 'react';
import { Monitor, Shield, Cpu, Database, Cloud, Code, Zap, AlertTriangle, Rocket, Server, Globe, Lock, Terminal, Box, FileCode, Sparkles, Brain, ChevronLeft, ChevronRight, Package, Layers, Settings, Coffee, Anchor, GitBranch, Container, Eye, Key, Skull, Flag } from 'lucide-react';

const NewsImageGallery = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);

  const sections = [
    {
      title: "오프닝 빠른 소식",
      images: [
        // 1. .NET 10 LTS
        {
          title: ".NET 10 LTS 정식 출시",
          render: () => (
            <div className="w-full h-80 bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-950 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-violet-500/20 rounded-full blur-3xl"></div>
              </div>
              <div className="absolute inset-0 opacity-10">
                {[...Array(15)].map((_, i) => (
                  <div key={i} className="absolute text-white text-2xl font-mono" style={{
                    left: `${(i % 5) * 22}%`,
                    top: `${Math.floor(i / 5) * 35}%`,
                    transform: 'rotate(-15deg)'
                  }}>
                    {'{ }'}
                  </div>
                ))}
              </div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="text-white text-5xl font-bold mb-2">.NET</div>
                <div className="bg-white px-8 py-3 rounded-xl shadow-lg mb-4">
                  <span className="text-purple-700 text-4xl font-mono font-black">10</span>
                </div>
                <div className="flex items-center gap-2 bg-green-500 px-5 py-2 rounded-full">
                  <Shield className="w-5 h-5 text-white" />
                  <span className="text-white font-bold">LTS - 3년 지원</span>
                </div>
                <div className="mt-4 flex gap-3">
                  <span className="bg-purple-600/50 px-3 py-1 rounded-full text-purple-200 text-sm">C# 14</span>
                  <span className="bg-violet-600/50 px-3 py-1 rounded-full text-violet-200 text-sm">F# 10</span>
                  <span className="bg-indigo-600/50 px-3 py-1 rounded-full text-indigo-200 text-sm">NativeAOT</span>
                </div>
                <div className="mt-3 text-purple-300 text-sm">2025.11 → 2028.11</div>
              </div>
            </div>
          )
        },
        // 2. Spring Framework 7.0
        {
          title: "Spring Framework 7.0 GA",
          render: () => (
            <div className="w-full h-80 bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="absolute text-green-300" style={{
                    left: `${(i % 4) * 28}%`,
                    top: `${Math.floor(i / 4) * 35}%`,
                    fontSize: '50px',
                    transform: `rotate(${i * 30}deg)`
                  }}>
                    🍃
                  </div>
                ))}
              </div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-500/50">
                  <span className="text-4xl">🍃</span>
                </div>
                <div className="text-white text-2xl font-light mb-1">Spring Framework</div>
                <div className="text-white text-5xl font-black mb-3">7.0</div>
                <div className="flex items-center gap-2 bg-yellow-400 text-green-900 px-5 py-2 rounded-full font-bold">
                  <Sparkles className="w-5 h-5" />
                  General Availability
                </div>
                <div className="mt-4 flex gap-2">
                  <span className="bg-green-600/50 px-3 py-1 rounded-full text-green-200 text-sm">Jakarta EE 11</span>
                  <span className="bg-emerald-600/50 px-3 py-1 rounded-full text-emerald-200 text-sm">Java 17-25</span>
                </div>
                <div className="mt-2 text-green-300 text-sm">Spring Boot 4.0의 기반</div>
              </div>
              <div className="absolute top-4 right-4 text-3xl opacity-40">☕</div>
            </div>
          )
        },
        // 3. Docker Desktop 4.51
        {
          title: "Docker Desktop 4.51 - K8s 뷰",
          render: () => (
            <div className="w-full h-80 bg-gradient-to-br from-blue-900 via-cyan-900 to-blue-950 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute top-5 right-5 w-20 h-20 bg-cyan-500/20 rounded-full blur-2xl"></div>
              <div className="absolute bottom-5 left-5 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl"></div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-white rounded-xl p-3 shadow-xl">
                    <Box className="w-10 h-10 text-blue-600" />
                  </div>
                  <span className="text-white text-3xl">+</span>
                  <div className="bg-white rounded-xl p-3 shadow-xl">
                    <Anchor className="w-10 h-10 text-blue-600" />
                  </div>
                </div>
                <div className="text-white text-2xl font-bold mb-2">Docker Desktop</div>
                <div className="bg-cyan-500 px-5 py-2 rounded-full mb-4">
                  <span className="text-white font-mono font-bold">v4.51.0</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-800/50 border border-cyan-400 px-4 py-2 rounded-lg">
                  <Eye className="w-5 h-5 text-cyan-400" />
                  <span className="text-white font-bold">NEW Kubernetes View</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <span className="bg-blue-600/50 px-2 py-1 rounded text-blue-200 text-xs">Pods</span>
                  <span className="bg-cyan-600/50 px-2 py-1 rounded text-cyan-200 text-xs">Services</span>
                  <span className="bg-teal-600/50 px-2 py-1 rounded text-teal-200 text-xs">Deployments</span>
                </div>
              </div>
            </div>
          )
        },
        // 4. PostgreSQL 보안 업데이트
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
                <div className="mt-4 flex gap-2">
                  {['18.1', '17.7', '16.11', '15.15', '14.20'].map((v) => (
                    <span key={v} className="bg-blue-600 px-2 py-1 rounded text-white text-xs font-mono">v{v}</span>
                  ))}
                </div>
                <div className="text-gray-400 mt-3 text-sm">⚠️ 즉시 v14 이상으로 마이그레이션 필요</div>
              </div>
            </div>
          )
        },
        // 5. OpenAI GPT-5.1
        {
          title: "OpenAI GPT-5.1 출시",
          render: () => (
            <div className="w-full h-80 bg-gradient-to-br from-emerald-900 via-teal-900 to-gray-900 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-emerald-500/20 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 border border-teal-500/20 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-green-500/20 rounded-full"></div>
              </div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="bg-black rounded-xl px-4 py-2 mb-3 shadow-lg">
                  <span className="text-white text-xl font-bold">OpenAI</span>
                </div>
                <div className="text-white text-5xl font-black mb-2">GPT-5.1</div>
                <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-5 py-2 rounded-full font-bold mb-3">
                  <Zap className="w-5 h-5" />
                  5X FASTER
                </div>
                <div className="bg-emerald-800/50 border border-emerald-500 px-4 py-2 rounded-lg text-center mb-3">
                  <div className="text-emerald-300 font-bold">적응형 추론</div>
                  <div className="text-gray-400 text-xs">Adaptive Reasoning</div>
                </div>
                <div className="flex gap-3">
                  <div className="text-center">
                    <div className="text-teal-300 text-lg font-bold">76.3%</div>
                    <div className="text-gray-500 text-xs">SWE-bench</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-300 text-lg font-bold">400K</div>
                    <div className="text-gray-500 text-xs">Context</div>
                  </div>
                </div>
              </div>
            </div>
          )
        },
        // 6. Node.js 25.2
        {
          title: "Node.js v25.2 릴리스",
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
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-green-500/50">
                  <Terminal className="w-12 h-12 text-white" />
                </div>
                <div className="text-white text-4xl font-bold mb-2">Node.js</div>
                <div className="bg-green-500 px-6 py-2 rounded-full">
                  <span className="text-white text-2xl font-mono font-bold">v25.2.0</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <span className="bg-green-700/50 px-2 py-1 rounded text-green-200 text-xs">V8 14.1</span>
                  <span className="bg-green-700/50 px-2 py-1 rounded text-green-200 text-xs">Web Storage</span>
                  <span className="bg-green-700/50 px-2 py-1 rounded text-green-200 text-xs">--allow-net</span>
                </div>
                <div className="text-green-300 mt-3 text-sm">JSON.stringify 성능 대폭 개선</div>
              </div>
            </div>
          )
        }
      ]
    },
    {
      title: "메인뉴스",
      images: [
        // Main 1. npm 공급망 공격
        {
          title: "🚨 npm 공급망 공격 - Shai-Hulud 2.0",
          render: () => (
            <div className="w-full h-80 bg-gradient-to-br from-red-950 via-red-900 to-gray-900 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2" style={{background: 'repeating-linear-gradient(45deg, #000 0px, #000 10px, #fbbf24 10px, #fbbf24 20px)'}}></div>
              <div className="absolute bottom-0 left-0 right-0 h-2" style={{background: 'repeating-linear-gradient(45deg, #000 0px, #000 10px, #fbbf24 10px, #fbbf24 20px)'}}></div>
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
                <div className="flex items-center gap-2 mb-2">
                  <div className="bg-red-600 rounded-lg px-4 py-2 relative">
                    <span className="text-white text-2xl font-bold font-mono">npm</span>
                    <Skull className="w-6 h-6 text-white absolute -top-2 -right-2" />
                  </div>
                </div>
                <div className="text-red-400 font-mono text-lg mb-1">Shai-Hulud 2.0</div>
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-500 animate-pulse" />
                  <span className="text-red-500 text-2xl font-bold">CRITICAL</span>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-red-900/50 border border-red-500 px-3 py-2 rounded-lg text-center">
                    <div className="text-red-300 text-xl font-bold">700+</div>
                    <div className="text-gray-400 text-xs">감염 패키지</div>
                  </div>
                  <div className="bg-red-900/50 border border-red-500 px-3 py-2 rounded-lg text-center">
                    <div className="text-red-300 text-xl font-bold">25K+</div>
                    <div className="text-gray-400 text-xs">영향 저장소</div>
                  </div>
                  <div className="bg-red-900/50 border border-red-500 px-3 py-2 rounded-lg text-center">
                    <div className="text-red-300 text-xl font-bold">132M</div>
                    <div className="text-gray-400 text-xs">월간 DL</div>
                  </div>
                </div>
                <div className="text-yellow-400 text-sm font-mono">⚠️ API 키, 클라우드 자격 증명 탈취 위험</div>
              </div>
            </div>
          )
        },
        // Main 2. Microsoft Patch Tuesday
        {
          title: "11월 Patch Tuesday - 63개 취약점",
          render: () => (
            <div className="w-full h-80 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500"></div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="flex items-center gap-2 mb-2">
                  <Monitor className="w-10 h-10 text-blue-400" />
                  <span className="text-white text-2xl font-bold">Microsoft</span>
                </div>
                <div className="text-cyan-400 text-3xl font-bold mb-4">Patch Tuesday</div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-blue-800/50 border border-blue-500 px-4 py-2 rounded-lg text-center">
                    <div className="text-blue-300 text-2xl font-bold">63</div>
                    <div className="text-gray-400 text-xs">총 CVE</div>
                  </div>
                  <div className="bg-red-800/50 border border-red-500 px-4 py-2 rounded-lg text-center">
                    <div className="text-red-300 text-2xl font-bold">1</div>
                    <div className="text-gray-400 text-xs">Zero-Day</div>
                  </div>
                </div>
                <div className="flex gap-2 mb-3">
                  <span className="bg-red-600 px-2 py-1 rounded text-white text-xs font-bold">Critical 5</span>
                  <span className="bg-orange-600 px-2 py-1 rounded text-white text-xs font-bold">Important 58</span>
                </div>
                <div className="bg-red-900/50 border border-red-400 px-4 py-2 rounded-lg flex items-center gap-2">
                  <Lock className="w-4 h-4 text-red-400" />
                  <span className="text-red-300 text-sm">CVE-2025-62215 - 커널 권한 상승</span>
                </div>
              </div>
            </div>
          )
        },
        // Main 3. Fortinet FortiWeb Zero-Day
        {
          title: "FortiWeb 이중 제로데이",
          render: () => (
            <div className="w-full h-80 bg-gradient-to-br from-orange-900 via-red-900 to-gray-900 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="absolute w-4 h-4 border-2 border-orange-400" style={{
                    left: `${10 + i * 12}%`,
                    top: `${30 + (i % 3) * 20}%`,
                    transform: `rotate(${i * 15}deg)`
                  }}></div>
                ))}
              </div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-10 h-10 text-orange-400" />
                  <span className="text-white text-2xl font-bold">Fortinet FortiWeb</span>
                </div>
                <div className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-full mb-4">
                  <AlertTriangle className="w-5 h-5 text-white" />
                  <span className="text-white font-bold">DOUBLE ZERO-DAY</span>
                </div>
                <div className="flex gap-3 mb-4">
                  <div className="bg-orange-900/50 border border-orange-500 px-3 py-2 rounded-lg text-center">
                    <div className="text-orange-300 text-sm font-mono">CVE-2025-64446</div>
                    <div className="text-gray-400 text-xs">Path Traversal</div>
                    <div className="text-red-400 text-xs font-bold">CVSS 9.8</div>
                  </div>
                  <div className="bg-red-900/50 border border-red-500 px-3 py-2 rounded-lg text-center">
                    <div className="text-red-300 text-sm font-mono">CVE-2025-58034</div>
                    <div className="text-gray-400 text-xs">OS Command Injection</div>
                    <div className="text-orange-400 text-xs font-bold">CVSS 6.7</div>
                  </div>
                </div>
                <div className="bg-yellow-600 px-4 py-2 rounded-full">
                  <span className="text-black font-bold text-sm">⚠️ CISA KEV 등재 - 7일 패치 기한</span>
                </div>
              </div>
            </div>
          )
        },
        // Main 4. Spring Framework 7.0 + .NET 10 동시 출시
        {
          title: "프레임워크 빅뱅: .NET 10 + Spring 7",
          render: () => (
            <div className="w-full h-80 bg-gradient-to-br from-purple-900 via-slate-900 to-green-900 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-purple-600/20 to-transparent"></div>
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-green-600/20 to-transparent"></div>
              </div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="text-white text-xl font-bold mb-4">🎉 프레임워크 메이저 동시 릴리스</div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="bg-purple-600 w-16 h-16 rounded-xl flex items-center justify-center mb-2 shadow-lg shadow-purple-500/50">
                      <Code className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-purple-300 font-bold">.NET 10</div>
                    <div className="text-purple-400 text-xs">LTS</div>
                  </div>
                  <div className="text-white text-3xl">+</div>
                  <div className="text-center">
                    <div className="bg-green-600 w-16 h-16 rounded-xl flex items-center justify-center mb-2 shadow-lg shadow-green-500/50">
                      <span className="text-3xl">🍃</span>
                    </div>
                    <div className="text-green-300 font-bold">Spring 7</div>
                    <div className="text-green-400 text-xs">GA</div>
                  </div>
                </div>
                <div className="mt-6 bg-slate-800/50 border border-slate-600 px-6 py-3 rounded-xl text-center">
                  <div className="text-white font-bold">엔터프라이즈 개발 생태계</div>
                  <div className="text-gray-400 text-sm">역사적 전환점 🚀</div>
                </div>
              </div>
            </div>
          )
        },
        // Main 5. GitHub Copilot GPT-5.1 추가
        {
          title: "GitHub Copilot에 GPT-5.1 추가",
          render: () => (
            <div className="w-full h-80 bg-gradient-to-br from-gray-900 via-slate-800 to-black flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="absolute h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent w-full" style={{ top: `${20 + i * 15}%`, opacity: 0.3 }}></div>
                ))}
              </div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                    <GitBranch className="w-8 h-8 text-gray-900" />
                  </div>
                  <span className="text-white text-2xl font-bold">GitHub Copilot</span>
                </div>
                <div className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 rounded-full mb-4">
                  <Sparkles className="w-5 h-5 text-white" />
                  <span className="text-white font-bold">GPT-5.1 Models 추가</span>
                </div>
                <div className="flex gap-2 mb-3">
                  <span className="bg-purple-800/50 px-3 py-1 rounded-lg text-purple-200 text-sm">GPT-5.1</span>
                  <span className="bg-pink-800/50 px-3 py-1 rounded-lg text-pink-200 text-sm">Codex</span>
                  <span className="bg-violet-800/50 px-3 py-1 rounded-lg text-violet-200 text-sm">Codex-Mini</span>
                </div>
                <div className="text-gray-400 text-sm">VS Code, JetBrains, Xcode, Eclipse 지원</div>
              </div>
            </div>
          )
        },
        // Main 6. Anthropic Claude Structured Outputs
        {
          title: "Claude Structured Outputs 베타",
          render: () => (
            <div className="w-full h-80 bg-gradient-to-br from-amber-900 via-orange-900 to-gray-900 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-amber-500 rotate-45"></div>
                <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border border-orange-500 rotate-12"></div>
              </div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="bg-amber-600 w-16 h-16 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div className="text-white text-2xl font-bold mb-2">Anthropic Claude</div>
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2 rounded-full mb-4">
                  <span className="text-white font-bold">Structured Outputs</span>
                </div>
                <div className="flex gap-3 mb-3">
                  <div className="bg-amber-800/50 px-3 py-2 rounded-lg text-center">
                    <FileCode className="w-5 h-5 text-amber-300 mx-auto mb-1" />
                    <span className="text-amber-300 text-sm">JSON Mode</span>
                  </div>
                  <div className="bg-orange-800/50 px-3 py-2 rounded-lg text-center">
                    <Settings className="w-5 h-5 text-orange-300 mx-auto mb-1" />
                    <span className="text-orange-300 text-sm">Strict Tools</span>
                  </div>
                </div>
                <div className="text-gray-400 text-sm">Sonnet 4.5, Opus 4.1 지원</div>
              </div>
            </div>
          )
        }
      ]
    },
    {
      title: "클로징 뉴스",
      images: [
        // Closing 1. 국내 클라우드 GPU 확보
        {
          title: "국내 클라우드 3사, GPU 1.3만개 확보",
          render: () => (
            <div className="w-full h-80 bg-gradient-to-br from-sky-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-10 left-10 text-6xl">🇰🇷</div>
                <div className="absolute bottom-10 right-10 text-4xl">🏢</div>
              </div>
              <div className="relative z-10 flex flex-col items-center">
                <div className="text-white text-xl font-bold mb-3">🇰🇷 정부 GPU 인프라 사업</div>
                <div className="flex gap-2 mb-4">
                  <div className="bg-green-500 text-white px-3 py-1 rounded-lg font-bold text-sm">NAVER</div>
                  <div className="bg-yellow-400 text-black px-3 py-1 rounded-lg font-bold text-sm">kakao</div>
                  <div className="bg-orange-500 text-white px-3 py-1 rounded-lg font-bold text-sm">NHN</div>
                </div>
                <div className="bg-sky-800/50 border border-sky-400 px-8 py-4 rounded-xl mb-4 text-center">
                  <div className="text-white text-4xl font-bold">13,000+</div>
                  <div className="text-sky-300">AI 가속기 확보</div>
                </div>
                <div className="flex gap-2">
                  <div className="bg-green-800/50 px-3 py-2 rounded-lg text-center">
                    <div className="text-green-300 text-sm">네이버</div>
                    <div className="text-white font-bold">3,056</div>
                    <div className="text-green-400 text-xs">H200</div>
                  </div>
                  <div className="bg-yellow-800/50 px-3 py-2 rounded-lg text-center">
                    <div className="text-yellow-300 text-sm">카카오</div>
                    <div className="text-white font-bold">2,424</div>
                    <div className="text-yellow-400 text-xs">B200</div>
                  </div>
                  <div className="bg-orange-800/50 px-3 py-2 rounded-lg text-center">
                    <div className="text-orange-300 text-sm">NHN</div>
                    <div className="text-white font-bold">7,656</div>
                    <div className="text-orange-400 text-xs">B200</div>
                  </div>
                </div>
              </div>
            </div>
          )
        },
        // Closing 2. JetBrains Amper 0.9
        {
          title: "JetBrains Amper 0.9 - 확장성 프리뷰",
          render: () => (
            <div className="w-full h-80 bg-gradient-to-br from-pink-900 via-purple-900 to-gray-900 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="relative z-10 flex flex-col items-center">
                <div className="bg-gradient-to-r from-pink-500 to-purple-500 w-16 h-16 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <div className="text-white text-2xl font-bold mb-1">JetBrains</div>
                <div className="text-pink-300 text-3xl font-bold mb-3">Amper 0.9.0</div>
                <div className="flex items-center gap-2 bg-purple-600 px-4 py-2 rounded-full mb-4">
                  <Sparkles className="w-5 h-5 text-white" />
                  <span className="text-white font-bold">Extensibility Preview</span>
                </div>
                <div className="flex gap-2">
                  <span className="bg-pink-800/50 px-3 py-1 rounded text-pink-200 text-sm">커스텀 태스크</span>
                  <span className="bg-purple-800/50 px-3 py-1 rounded text-purple-200 text-sm">플러그인</span>
                </div>
                <div className="mt-3 text-gray-400 text-sm">amper.org | JVM 21 기본</div>
              </div>
            </div>
          )
        },
        // Closing 3. AWS-OpenAI 파트너십
        {
          title: "AWS-OpenAI $380억 파트너십",
          render: () => (
            <div className="w-full h-80 bg-gradient-to-br from-orange-900 via-amber-900 to-gray-900 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="relative z-10 flex flex-col items-center">
                <div className="flex items-center gap-6 mb-4">
                  <div className="flex flex-col items-center">
                    <Cloud className="w-12 h-12 text-orange-400" />
                    <span className="text-orange-400 font-bold">AWS</span>
                  </div>
                  <span className="text-white text-3xl">🤝</span>
                  <div className="flex flex-col items-center">
                    <Brain className="w-12 h-12 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">OpenAI</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-orange-600 to-amber-600 px-6 py-3 rounded-xl mb-4">
                  <span className="text-white text-3xl font-bold">$38B</span>
                  <span className="text-amber-200 text-lg ml-2">/ 7년</span>
                </div>
                <div className="flex gap-2">
                  <span className="bg-orange-800/50 px-3 py-1 rounded text-orange-200 text-sm">NVIDIA GPU</span>
                  <span className="bg-amber-800/50 px-3 py-1 rounded text-amber-200 text-sm">EC2 UltraServers</span>
                </div>
                <div className="mt-3 text-gray-400 text-sm">역대 최대 규모 AI 인프라 협력</div>
              </div>
            </div>
          )
        },
        // Closing 4. 이번 주 트렌드 정리
        {
          title: "이번 주 핵심 키워드",
          render: () => (
            <div className="w-full h-80 bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="relative z-10 flex flex-col items-center w-full px-8">
                <div className="text-white text-xl font-bold mb-6">📊 2025.11.10~16 핵심 키워드</div>
                <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                  <div className="bg-gradient-to-b from-purple-600 to-purple-800 p-4 rounded-xl text-center">
                    <Layers className="w-8 h-8 text-white mx-auto mb-2" />
                    <div className="text-white font-bold text-sm">프레임워크</div>
                    <div className="text-purple-200 text-xs mt-1">.NET 10 + Spring 7</div>
                  </div>
                  <div className="bg-gradient-to-b from-red-600 to-red-800 p-4 rounded-xl text-center">
                    <AlertTriangle className="w-8 h-8 text-white mx-auto mb-2" />
                    <div className="text-white font-bold text-sm">공급망 보안</div>
                    <div className="text-red-200 text-xs mt-1">npm 긴급</div>
                  </div>
                  <div className="bg-gradient-to-b from-emerald-600 to-emerald-800 p-4 rounded-xl text-center">
                    <Brain className="w-8 h-8 text-white mx-auto mb-2" />
                    <div className="text-white font-bold text-sm">AI 코딩</div>
                    <div className="text-emerald-200 text-xs mt-1">GPT-5.1</div>
                  </div>
                </div>
                <div className="mt-6 text-gray-400 text-sm">Dev Weekly - 다음 주에 만나요! 👋</div>
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
          <h1 className="text-white text-2xl font-bold">📺 Dev Weekly 뉴스 이미지</h1>
          <p className="text-gray-400 text-sm">2025년 11월 10일~16일</p>
        </div>

        {/* Section Tabs */}
        <div className="flex gap-2 mb-4 justify-center">
          {sections.map((section, idx) => (
            <button
              key={idx}
              onClick={() => { setCurrentSection(idx); setCurrentImage(0); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentSection === idx 
                  ? idx === 1 ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
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
