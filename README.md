# AoID (Association of Independent Developers)

1인 개발자 협회의 공식 웹사이트 - 독립 개발자들의 네트워킹, 정보 공유, 협업을 위한 플랫폼

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791)](https://www.postgresql.org/)

## 목차

- [프로젝트 개요](#프로젝트-개요)
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [빠른 시작](#빠른-시작)
- [프로젝트 구조](#프로젝트-구조)
- [API 엔드포인트](#api-엔드포인트)
- [개발 환경 설정](#개발-환경-설정)
- [문제 해결](#문제-해결)
- [문서](#문서)

## 프로젝트 개요

AoID는 독립 개발자들을 위한 협회 플랫폼으로, 회원 관리, 게시판, 댓글 시스템, 관리자 기능을 포함한 풀스택 웹 애플리케이션입니다.

### 특징

- **현대적인 UI/UX**: Material-UI 기반의 깔끔하고 반응형 디자인
- **안전한 인증**: JWT + OAuth 2.0 (Google, GitHub)
- **완전한 CRUD**: 게시글, 댓글, 회원 관리
- **관리자 대시보드**: 통계, 회원 관리, 카테고리 관리
- **TypeScript**: 프론트엔드와 백엔드 모두 타입 안정성 보장

## 주요 기능

### 회원 관리
- 일반 회원가입 (이메일 + 비밀번호, bcrypt 해싱)
- OAuth 2.0 소셜 로그인 (Google, GitHub)
- JWT 기반 인증 (7일 유효기간)
- 회원 정보 수정 및 탈퇴

### 게시판 시스템
- 9개 카테고리 (공지사항, 협회 소식, 자유게시판, Q&A, 기술 공유, 프로젝트 협업, 갤러리, 자료실)
- 게시글 CRUD 작업
- 검색 기능 (제목, 내용)
- 페이지네이션 (20개/페이지)
- 좋아요 기능
- 조회수 자동 카운트
- 공지사항 고정

### 댓글 시스템
- 댓글 및 대댓글 작성
- 계층형 댓글 구조
- 댓글 수정 및 삭제
- 소프트 삭제 (대댓글이 있는 경우)

### 관리자 기능
- 회원 관리 (역할 변경, 활성화/비활성화)
- 게시판 카테고리 관리
- 통계 대시보드 (회원 수, 게시글 수, 카테고리별 통계)

## 기술 스택

### Frontend
- **React 19** + TypeScript
- **Material-UI (MUI)** - UI 컴포넌트
- **React Router v7** - 라우팅
- **Axios** - HTTP 클라이언트
- **React Toastify** - 알림

### Backend
- **Node.js** + Express
- **TypeScript**
- **PostgreSQL** - 데이터베이스
- **Passport.js** - OAuth 2.0 (Google, GitHub)
- **JWT** - 토큰 기반 인증
- **bcrypt** - 비밀번호 해싱
- **express-validator** - 입력 검증

## 빠른 시작

### 사전 요구사항
- Node.js 18 이상
- PostgreSQL 14 이상
- npm 또는 yarn

### 3단계 실행

#### 1. 데이터베이스 설정
```bash
# PostgreSQL 접속
psql -U postgres

# 스키마 적용
\i backend/database/schema.sql
```

#### 2. 백엔드 실행
```bash
cd backend
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일 편집 (아래 환경 변수 섹션 참고)

# 개발 서버 시작 (포트 5000)
npm run dev
```

#### 3. 프론트엔드 실행
```bash
# 새 터미널에서
cd frontend
npm install

# 개발 서버 시작 (포트 3000)
npm start
```

브라우저가 자동으로 http://localhost:3000 을 엽니다.

자세한 가이드: [빠른_시작.md](빠른_시작.md) 또는 [로컬_실행_가이드.md](로컬_실행_가이드.md)

## 프로젝트 구조

```
AoID/
├── backend/                    # 백엔드 서버
│   ├── database/
│   │   └── schema.sql         # PostgreSQL 스키마
│   ├── src/
│   │   ├── config/            # 설정 (DB, Passport)
│   │   ├── controllers/       # 비즈니스 로직
│   │   ├── middleware/        # 인증 미들웨어
│   │   ├── routes/            # API 라우트
│   │   ├── types/             # TypeScript 타입
│   │   └── index.ts           # 서버 진입점
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # 프론트엔드
│   ├── src/
│   │   ├── components/        # React 컴포넌트
│   │   │   ├── about/        # About 페이지
│   │   │   ├── admin/        # 관리자 기능
│   │   │   ├── auth/         # 인증 관련
│   │   │   ├── board/        # 게시판
│   │   │   ├── comment/      # 댓글
│   │   │   └── common/       # 공통 컴포넌트
│   │   ├── contexts/          # React Context
│   │   ├── pages/             # 페이지 컴포넌트
│   │   ├── services/          # API 서비스
│   │   ├── types/             # TypeScript 타입
│   │   └── App.tsx
│   ├── package.json
│   └── tsconfig.json
│
├── CLAUDE.md                   # Claude Code 작업 가이드
├── README.md                   # 프로젝트 개요 (현재 파일)
├── 빠른_시작.md                 # 빠른 실행 가이드
├── 로컬_실행_가이드.md           # 상세 실행 가이드
└── SETUP_GUIDE.md              # 설정 가이드
```

## API 엔드포인트

### 인증 (Auth)
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인 (JWT 토큰 반환)
- `GET /api/auth/google` - Google OAuth 시작
- `GET /api/auth/github` - GitHub OAuth 시작
- `GET /api/auth/me` - 현재 사용자 정보 (인증 필요)
- `DELETE /api/auth/account` - 회원 탈퇴 (인증 필요)

### 게시글 (Posts)
- `GET /api/posts` - 게시글 목록 (쿼리: categoryId, page, limit, search)
- `GET /api/posts/:id` - 게시글 상세
- `POST /api/posts` - 게시글 작성 (인증 필요)
- `PUT /api/posts/:id` - 게시글 수정 (인증 필요, 작성자만)
- `DELETE /api/posts/:id` - 게시글 삭제 (인증 필요, 작성자만)
- `POST /api/posts/:id/like` - 좋아요 토글 (인증 필요)

### 댓글 (Comments)
- `GET /api/comments/post/:postId` - 댓글 목록
- `POST /api/comments/post/:postId` - 댓글 작성 (인증 필요)
- `PUT /api/comments/:id` - 댓글 수정 (인증 필요, 작성자만)
- `DELETE /api/comments/:id` - 댓글 삭제 (인증 필요, 작성자만)

### 관리자 (Admin)
모든 관리자 API는 `authenticate` + `isAdmin` 미들웨어 필요

- `GET /api/admin/statistics` - 통계 대시보드
- `GET /api/admin/users` - 회원 목록
- `PUT /api/admin/users/:id/role` - 회원 역할 변경
- `PUT /api/admin/users/:id/status` - 회원 활성화/비활성화
- `GET /api/admin/categories` - 카테고리 목록
- `POST /api/admin/categories` - 카테고리 생성
- `PUT /api/admin/categories/:id` - 카테고리 수정
- `DELETE /api/admin/categories/:id` - 카테고리 삭제

## 개발 환경 설정

### 환경 변수

#### Backend (.env)
```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=aoid_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# OAuth - Google
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# OAuth - GitHub
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback

# Frontend
FRONTEND_URL=http://localhost:3000
```

JWT Secret 생성:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### Frontend (.env) - 선택사항
```env
REACT_APP_API_URL=http://localhost:5000
```

### OAuth 설정

#### Google OAuth
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 생성 → "API 및 서비스" → "사용자 인증 정보"
3. "OAuth 클라이언트 ID" 생성
4. 승인된 리디렉션 URI: `http://localhost:5000/api/auth/google/callback`

#### GitHub OAuth
1. [GitHub Developer Settings](https://github.com/settings/developers) 접속
2. "New OAuth App" 클릭
3. Authorization callback URL: `http://localhost:5000/api/auth/github/callback`

### 테스트 계정

#### 관리자 계정
- 이메일: `admin@aoid.org`
- 비밀번호: schema.sql에서 bcrypt 해시로 설정 필요

관리자 비밀번호 설정:
```bash
# backend 디렉토리에서
node -e "console.log(require('bcrypt').hashSync('your_password', 10))"
# 출력된 해시를 schema.sql의 admin 계정 password 필드에 입력
```

## 문제 해결

### 데이터베이스 연결 오류
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
- PostgreSQL 서비스 실행 확인
- .env 파일의 DB 설정 확인

### 포트 충돌
```bash
# Windows
netstat -ano | findstr :5000
taskkill //PID <PID> //F

# Mac/Linux
lsof -ti:5000 | xargs kill
```

### OAuth 리디렉션 오류
```
Error: redirect_uri_mismatch
```
- Google/GitHub 콘솔에서 리디렉션 URI 확인
- .env 파일의 CALLBACK_URL 확인

### JWT 토큰 오류
- 브라우저 개발자 도구 → Application → Local Storage → token 삭제

더 자세한 문제 해결: [로컬_실행_가이드.md](로컬_실행_가이드.md) 참고

## 보안

- bcrypt를 사용한 비밀번호 해싱 (SALT_ROUNDS=10)
- JWT 토큰 기반 인증 (7일 유효)
- OAuth 2.0 소셜 로그인
- SQL Injection 방지 (파라미터화된 쿼리)
- express-validator를 통한 입력 검증
- CORS 설정
- 권한 기반 접근 제어 (authenticate, isAdmin 미들웨어)

## 문서

| 문서 | 설명 | 대상 |
|-----|------|------|
| [README.md](README.md) | 프로젝트 전체 개요 | 모든 사용자 |
| [CLAUDE.md](CLAUDE.md) | Claude Code 작업 가이드 | AI 개발 도구 |
| [빠른_시작.md](빠른_시작.md) | 10분 실행 가이드 | 처음 시작하는 사람 |
| [로컬_실행_가이드.md](로컬_실행_가이드.md) | 상세 단계별 가이드 | 모든 개발자 |
| [SETUP_GUIDE.md](SETUP_GUIDE.md) | 설정 및 배포 가이드 | DevOps |
| [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) | 프로젝트 요약 | 기획자/PM |
| [FRONTEND_COMPLETE.md](FRONTEND_COMPLETE.md) | 프론트엔드 상세 | 프론트엔드 개발자 |

## 개발 스크립트

### Backend
```bash
npm run dev      # 개발 서버 (nodemon + ts-node)
npm run build    # TypeScript 컴파일
npm start        # 프로덕션 서버
```

### Frontend
```bash
npm start        # 개발 서버
npm run build    # 프로덕션 빌드
npm test         # 테스트 실행
```

## 향후 개발 계획

- [ ] 마크다운 에디터 통합
- [ ] 파일 첨부 기능
- [ ] 실시간 알림 (Socket.io)
- [ ] 다크모드
- [ ] PWA 지원
- [ ] 검색 자동완성
- [ ] 무한 스크롤

## 기여

기여를 환영합니다! Pull Request를 보내주세요.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 라이선스

MIT License

## 문의

이슈 트래커를 통해 문의해주세요: [GitHub Issues](https://github.com/yourusername/AoID/issues)

---

**현대적이고 안전한 협회 플랫폼** | Built with ❤️ using React, Node.js, and PostgreSQL
