# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

AoID (Association of Independent Developers)는 독립 개발자들을 위한 협회 플랫폼입니다. 백엔드(Express + TypeScript + PostgreSQL)와 프론트엔드(React + TypeScript)로 구성된 풀스택 애플리케이션입니다.

## 개발 환경 설정

### 필수 사전 조건
- Node.js 18+
- PostgreSQL 14+
- 두 OAuth 프로바이더(Google, GitHub)의 클라이언트 자격 증명

### 초기 설정

**데이터베이스:**
```bash
psql -U postgres -f backend/database/schema.sql
```

**백엔드:**
```bash
cd backend
npm install
cp .env.example .env  # 환경 변수 설정 필요
npm run dev           # 개발 서버 (포트 5000)
npm run build         # TypeScript 컴파일
npm start             # 프로덕션 서버
```

**프론트엔드:**
```bash
cd frontend
npm install
npm start             # 개발 서버 (포트 3000)
npm run build         # 프로덕션 빌드
npm test              # Jest 테스트 실행
```

### 환경 변수 (.env)

백엔드에서 반드시 설정해야 하는 환경 변수:
- `DB_*`: PostgreSQL 연결 정보
- `JWT_SECRET`: JWT 토큰 서명 키
- `GOOGLE_CLIENT_ID/SECRET`: Google OAuth 자격 증명
- `GITHUB_CLIENT_ID/SECRET`: GitHub OAuth 자격 증명
- `FRONTEND_URL`: CORS 설정용 프론트엔드 URL

## 아키텍처

### 백엔드 구조

**계층 분리:**
- `controllers/`: 요청 처리 로직 (authController, postController, commentController, adminController)
- `routes/`: Express 라우트 정의
- `middleware/`: 인증 미들웨어 (`authenticate`, `isAdmin`)
- `config/`: 데이터베이스 연결, Passport OAuth 전략 설정
- `types/`: TypeScript 타입 정의

**인증 시스템:**
- JWT 기반 인증 (Bearer 토큰)
- Passport를 사용한 OAuth 2.0 (Google, GitHub)
- bcrypt를 사용한 비밀번호 해싱
- 미들웨어: `authenticate` (인증 확인), `isAdmin` (관리자 권한 확인)

**데이터베이스:**
- PostgreSQL with `pg` 라이브러리
- Connection pool (`config/database.ts`)
- 주요 테이블: `users`, `user_profiles`, `board_categories`, `posts`, `comments`, `post_likes`
- 파라미터화된 쿼리로 SQL Injection 방지

### 프론트엔드 구조

**상태 관리:**
- `AuthContext`: 전역 인증 상태 관리 (로그인, 로그아웃, 사용자 정보)
- React Context API 사용

**라우팅:**
- React Router v6
- 주요 페이지: HomePage, LoginPage, RegisterPage, BoardPage, PostDetailPage, AboutPage

**API 통신:**
- `services/api.ts`: Axios 인스턴스
- 요청 인터셉터: localStorage에서 JWT 토큰을 자동으로 Authorization 헤더에 추가
- 응답 인터셉터: 401 에러 시 자동 로그아웃 처리
- API 모듈: `authAPI`, `postAPI`, `commentAPI`, `adminAPI`

**UI 프레임워크:**
- Material-UI (MUI)
- react-toastify로 알림 표시

**컴포넌트 구조:**
- `components/about/`: About 페이지 관련 컴포넌트
- `components/admin/`: 관리자 기능 컴포넌트
- `components/auth/`: 인증 관련 컴포넌트
- `components/board/`: 게시판 컴포넌트
- `components/comment/`: 댓글 컴포넌트
- `components/common/`: 공통 컴포넌트 (Header, Footer 등)

## API 엔드포인트

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인 (JWT 토큰 반환)
- `GET /api/auth/google` - Google OAuth 시작
- `GET /api/auth/github` - GitHub OAuth 시작
- `GET /api/auth/me` - 현재 사용자 정보 (인증 필요)
- `DELETE /api/auth/account` - 회원 탈퇴 (인증 필요)

### 게시글
- `GET /api/posts` - 게시글 목록 (쿼리: categoryId, page, limit, search)
- `GET /api/posts/:id` - 게시글 상세
- `POST /api/posts` - 게시글 작성 (인증 필요)
- `PUT /api/posts/:id` - 게시글 수정 (인증 필요, 작성자만)
- `DELETE /api/posts/:id` - 게시글 삭제 (인증 필요, 작성자만)
- `POST /api/posts/:id/like` - 좋아요 토글 (인증 필요)

### 댓글
- `GET /api/comments/post/:postId` - 댓글 목록
- `POST /api/comments/post/:postId` - 댓글 작성 (인증 필요)
- `PUT /api/comments/:id` - 댓글 수정 (인증 필요, 작성자만)
- `DELETE /api/comments/:id` - 댓글 삭제 (인증 필요, 작성자만)

### 관리자 (모두 `authenticate` + `isAdmin` 필요)
- `GET /api/admin/statistics` - 통계 대시보드
- `GET /api/admin/users` - 회원 목록
- `PUT /api/admin/users/:id/role` - 회원 역할 변경
- `PUT /api/admin/users/:id/status` - 회원 활성화/비활성화
- `GET /api/admin/categories` - 카테고리 목록
- `POST /api/admin/categories` - 카테고리 생성
- `PUT /api/admin/categories/:id` - 카테고리 수정
- `DELETE /api/admin/categories/:id` - 카테고리 삭제

## 개발 시 주의사항

### 인증 처리
- 프론트엔드에서 API 호출 시 토큰은 자동으로 헤더에 추가됨 (api.ts 인터셉터)
- 백엔드에서 인증이 필요한 라우트는 `authenticate` 미들웨어 사용
- 관리자 전용 라우트는 `authenticate, isAdmin` 미들웨어 사용

### 데이터베이스 쿼리
- 항상 파라미터화된 쿼리 사용 (`$1, $2` 플레이스홀더)
- `pool.query()`는 Promise를 반환하므로 async/await 사용
- 트랜잭션이 필요한 경우 `pool.connect()`로 클라이언트 획득

### 에러 처리
- 백엔드: try-catch로 에러를 잡고 적절한 HTTP 상태 코드와 메시지 반환
- 프론트엔드: catch 블록에서 `react-toastify`로 사용자에게 에러 표시

### TypeScript
- 백엔드와 프론트엔드 모두 엄격한 TypeScript 사용
- 공통 타입은 `types/` 디렉토리에 정의
- `any` 타입은 최대한 피하고 명시적 타입 사용

### OAuth 콜백
- Google/GitHub OAuth 콜백 URL은 반드시 각 플랫폼 콘솔에 등록
- 콜백 처리 후 프론트엔드로 리다이렉트할 때 JWT 토큰을 쿼리 파라미터로 전달

## 일반적인 작업

### 새 API 엔드포인트 추가
1. `backend/src/controllers/`에 컨트롤러 함수 작성
2. `backend/src/routes/`에 라우트 추가
3. 필요 시 미들웨어 적용
4. 프론트엔드 `services/api.ts`에 API 함수 추가

### 새 페이지 추가
1. `frontend/src/pages/`에 페이지 컴포넌트 생성
2. `frontend/src/App.tsx`의 Routes에 라우트 추가
3. 필요 시 `components/common/Header.tsx`에 네비게이션 링크 추가

### 데이터베이스 스키마 변경
1. `backend/database/schema.sql` 수정
2. `psql -U postgres -d aoid_db -f backend/database/schema.sql` 실행
3. 영향받는 컨트롤러/쿼리 코드 업데이트

### 새 환경 변수 추가
1. `backend/.env.example` 업데이트
2. 실제 `.env` 파일에 값 추가
3. README/SETUP_GUIDE에 문서화

## 보안 고려사항

- 비밀번호는 절대 평문으로 저장하지 않음 (bcrypt 해싱 사용)
- JWT_SECRET은 강력한 랜덤 문자열 사용
- SQL 쿼리는 항상 파라미터화
- 사용자 입력은 express-validator로 검증
- CORS는 신뢰할 수 있는 출처만 허용
- 프로덕션 환경에서는 HTTPS 사용 필수
