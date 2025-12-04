# AoID 프로젝트 리팩토링 계획서 (Phase 2)

**작성일**: 2025-12-04
**버전**: 2.0
**상태**: 초기 계획

---

## 1. 현재 상태 요약

### 1.1 프로젝트 통계

| 구분 | 파일 수 | 총 라인 수 | 비고 |
|------|---------|-----------|------|
| **Frontend** | 131개 (.tsx/.ts) | ~41,000줄 | React + TypeScript |
| **Backend** | 52개 (.ts) | ~15,000줄 | Express + TypeScript |
| **합계** | 183개 | ~56,000줄 | |

### 1.2 Phase 1 완료 현황 (이전 세션)

- [x] UserManagement 컴포넌트 분할
- [x] adminController 분할 (6개 도메인 컨트롤러)
- [x] PostDetailPage 분할 (8개 컴포넌트)
- [x] React Query hooks 구조 생성 (queryKeys, useUsers, usePosts, useCategories)
- [x] 백엔드 타입 정의 (request.ts, response.ts)
- [x] ESLint 경고 해결

---

## 2. 주요 문제점 분석

### 2.1 프론트엔드 문제점

#### 2.1.1 [HIGH] 과도하게 큰 컴포넌트

| 파일 | 라인 수 | 문제점 |
|------|---------|--------|
| `RichTextEditor.tsx` | 2,419 | Quill 설정, 이미지 업로드, 테이블, 수식 편집 등 혼재 |
| `MotionBoxEditor.tsx` | 1,473 | 편집, 타임라인, 프리뷰, 키프레임 관리 혼합 |
| `WeeklyNotificationManagement.tsx` | 1,172 | 뉴스, 섹션, 미리보기, 알림 설정 혼합 |
| `HomeGlobalSettings.tsx` | 920 | 여러 섹션 전역 설정이 한 파일에 |
| `Header.tsx` | 717 | 로고, 메뉴, 배경 효과, 사용자 메뉴 혼재 |

#### 2.1.2 [HIGH] GlobalSettings 중복 (8개 파일, ~5,900줄)

동일한 패턴이 8개 파일에서 반복:
- `AboutGlobalSettings.tsx` (829줄)
- `BusinessGlobalSettings.tsx` (827줄)
- `TechTrendsGlobalSettings.tsx` (828줄)
- `BoardGlobalSettings.tsx` (719줄)
- `ConnectionRoundGlobalSettings.tsx` (770줄)
- `MemberSpaceGlobalSettings.tsx` (713줄)
- `MypageGlobalSettings.tsx` (695줄)
- `FooterGlobalSettings.tsx` (498줄)

**중복 요소**:
- ContentTopSettings 인터페이스 정의
- defaultSettings 객체
- TabPanel 컴포넌트
- useEffect 데이터 로드 패턴
- 배경 이미지 선택기 UI

#### 2.1.3 [MEDIUM] 상태 관리 복잡성

| 컴포넌트 | useState 개수 | 문제점 |
|---------|-------------|--------|
| `HomeGlobalSettings.tsx` | 10+ | 관련 상태 분산 |
| `MotionBoxEditor.tsx` | 12+ | 복잡한 Record 객체 상태 |
| `MemberGradeManagement.tsx` | 다수 | 등급, 권한, 탭 상태 분산 |

#### 2.1.4 [MEDIUM] Hook 미활용

| Hook | 활용도 | 비고 |
|------|--------|------|
| `useCRUD` | 부분적 | 정의되어 있으나 일부만 사용 |
| `useFormDialog` | 낮음 | 3-4개 컴포넌트만 사용 |
| `useAsyncData` | 불명확 | 활용도 확인 필요 |

#### 2.1.5 [MEDIUM] API 호출 패턴 불일치

- 직접 API 호출 vs React Query 혼용
- 에러 처리 패턴 불일치
- 로딩 상태 관리 분산

### 2.2 백엔드 문제점

#### 2.2.1 [HIGH] 쿼리 최적화 부재

**이중 쿼리 문제**:
```typescript
// postController.ts - getPosts
const result = await pool.query(query, params);        // 조회
const countResult = await pool.query(countQuery, ...); // 카운트
```

**서브쿼리 남용**:
```typescript
// statisticsController.ts
(SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count,
(SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
```

#### 2.2.2 [HIGH] 타입 안정성 부족

- `any` 타입 다수 사용 (postController, userAdminController 등)
- `as unknown as` 위험한 캐스팅 (authController)
- 파라미터 타입 미지정

#### 2.2.3 [HIGH] 큰 컨트롤러 파일

| 파일 | 라인 수 | 책임 |
|------|---------|------|
| `motionBoxController.ts` | 1,110 | 모션박스 전체 관리 |
| `authController.ts` | 586 | 회원가입, 로그인, OAuth, 권한 |
| `mypageController.ts` | 489 | 게시글, 댓글, 프로필, 비밀번호 |
| `gradeController.ts` | 423 | 등급 관리 |

#### 2.2.4 [MEDIUM] 서비스 레이어 미활용

- `services/` 폴더에 userService, postService 존재
- 대부분 controller에서 직접 `pool.query()` 호출
- 비즈니스 로직이 controller에 혼재

#### 2.2.5 [MEDIUM] 검증 로직 분산

동일한 검증이 여러 파일에서 반복:
- username 검증 (authController, mypageController)
- email 검증 (authController, mypageController)
- 권한 체크 (여러 controller)

#### 2.2.6 [MEDIUM] 에러 처리 불일치

- HTTP 상태 코드 불일치 (대부분 500)
- 에러 응답 형식 불일치 (`{ error }` vs `{ message, error }`)
- 세부 에러 정보 부족

---

## 3. 리팩토링 우선순위

### 3.1 Phase 2-A: 즉시 실행 (HIGH Priority)

#### A-1. RichTextEditor 분할
**예상 효과**: 2,419줄 → ~600줄 (5개 파일)

```
frontend/src/components/common/rich-text-editor/
├── index.ts                    # 메인 export
├── RichTextEditor.tsx          # 메인 컴포넌트 (~300줄)
├── hooks/
│   └── useQuillEditor.ts       # Quill 초기화 및 설정
├── components/
│   ├── QuillToolbar.tsx        # 도구 모음
│   ├── ImageUploadDialog.tsx   # 이미지 업로드
│   ├── TableDialog.tsx         # 테이블 삽입
│   ├── MathDialog.tsx          # 수식 편집
│   └── ImageLibraryDialog.tsx  # 이미지 라이브러리
└── types.ts                    # 타입 정의
```

#### A-2. GlobalSettings 템플릿화
**예상 효과**: 5,900줄 → ~800줄 (90% 감소)

```
frontend/src/components/admin/global-settings/
├── index.ts
├── GlobalSettingsTemplate.tsx  # 공통 템플릿 (~300줄)
├── hooks/
│   └── useGlobalSettings.ts    # 설정 로드/저장 로직
├── components/
│   ├── ContentTopPanel.tsx     # 상단 설정 패널
│   ├── BackgroundPanel.tsx     # 배경 설정 패널
│   ├── AnimationPanel.tsx      # 애니메이션 설정
│   └── MenuPanel.tsx           # 메뉴 설정
├── types.ts                    # 공통 타입
└── configs/                    # 페이지별 설정
    ├── aboutConfig.ts
    ├── businessConfig.ts
    ├── techTrendsConfig.ts
    └── ...
```

#### A-3. 백엔드 쿼리 최적화
**예상 효과**: DB 호출 50% 감소

```typescript
// Before: 이중 쿼리
const result = await pool.query(dataQuery);
const countResult = await pool.query(countQuery);

// After: 단일 쿼리 + COUNT(*) OVER()
const result = await pool.query(`
  SELECT *, COUNT(*) OVER() as total_count
  FROM posts
  WHERE ...
  LIMIT $1 OFFSET $2
`);
```

#### A-4. 백엔드 타입 안정성 강화
**예상 효과**: 런타임 에러 감소

- `any` 타입 전면 제거
- 쿼리 파라미터 타입 정의
- 응답 타입 명시

### 3.2 Phase 2-B: 단기 실행 (MEDIUM Priority)

#### B-1. MotionBoxEditor 분할
```
frontend/src/components/admin/motion-box/
├── index.ts
├── MotionBoxEditor.tsx         # 메인 (~300줄)
├── hooks/
│   └── useMotionBoxEditor.ts   # useReducer 기반 상태 관리
├── components/
│   ├── MotionBoxForm.tsx       # 기본 정보 폼
│   ├── ElementManager.tsx      # 요소 관리
│   ├── KeyframeEditor.tsx      # 키프레임 편집
│   └── StylePanel.tsx          # 스타일 설정
└── types.ts
```

#### B-2. Header 분할
```
frontend/src/components/common/header/
├── index.ts
├── Header.tsx                  # 메인 (~150줄)
├── components/
│   ├── Logo.tsx
│   ├── MainNav.tsx             # 메인 네비게이션
│   ├── UserMenu.tsx            # 사용자 메뉴
│   ├── MobileDrawer.tsx        # 모바일 드로어
│   └── HeaderBackground.tsx    # 배경 효과
└── hooks/
    └── useHeaderData.ts        # 데이터 로드
```

#### B-3. Management 컴포넌트 표준화
- 모든 Management에서 `useCRUD` Hook 활용
- 공통 ManagementTable 컴포넌트 생성
- 표준화된 FormDialog 패턴

#### B-4. 백엔드 서비스 레이어 완성
```
backend/src/services/
├── postService.ts      # 확장
├── userService.ts      # 확장
├── gradeService.ts     # 신규
├── categoryService.ts  # 신규
└── permissionService.ts # 신규 (권한 로직 통합)
```

#### B-5. 백엔드 컨트롤러 분할
```
authController.ts (586줄) →
├── authController.ts (~150줄)      # 로그인/회원가입
├── permissionController.ts (~150줄) # 권한 관리
└── verificationController.ts (~100줄) # 이메일 검증

mypageController.ts (489줄) →
├── mypagePostController.ts
├── mypageCommentController.ts
├── mypageProfileController.ts
└── mypagePasswordController.ts
```

### 3.3 Phase 2-C: 장기 실행 (LOW Priority)

#### C-1. React Query 전면 적용
- 기존 컴포넌트에 React Query hooks 적용
- 캐싱 전략 수립
- Optimistic updates 구현

#### C-2. 상태 관리 개선
- 복잡한 상태에 `useReducer` 적용
- Context 최적화
- 필요시 Zustand 도입 검토

#### C-3. 백엔드 Repository 패턴 도입
```
Controller → Service → Repository → Database
```

#### C-4. 테스트 커버리지 확대
- Service 레이어 단위 테스트
- Integration 테스트
- E2E 테스트

---

## 4. 상세 실행 계획

### 4.1 Phase 2-A 상세 (즉시 실행)

#### Task A-1: RichTextEditor 분할

**파일 생성**:
1. `frontend/src/components/common/rich-text-editor/types.ts`
2. `frontend/src/components/common/rich-text-editor/hooks/useQuillEditor.ts`
3. `frontend/src/components/common/rich-text-editor/components/QuillToolbar.tsx`
4. `frontend/src/components/common/rich-text-editor/components/ImageUploadDialog.tsx`
5. `frontend/src/components/common/rich-text-editor/components/TableDialog.tsx`
6. `frontend/src/components/common/rich-text-editor/components/MathDialog.tsx`
7. `frontend/src/components/common/rich-text-editor/components/ImageLibraryDialog.tsx`
8. `frontend/src/components/common/rich-text-editor/RichTextEditor.tsx`
9. `frontend/src/components/common/rich-text-editor/index.ts`

**리팩토링 단계**:
1. 타입 정의 추출
2. Quill 설정 로직을 Hook으로 추출
3. 다이얼로그 컴포넌트 분리
4. 메인 컴포넌트 정리
5. 기존 import 경로 업데이트
6. 빌드 테스트

#### Task A-2: GlobalSettings 템플릿화

**파일 생성**:
1. `frontend/src/components/admin/global-settings/types.ts`
2. `frontend/src/components/admin/global-settings/hooks/useGlobalSettings.ts`
3. `frontend/src/components/admin/global-settings/components/ContentTopPanel.tsx`
4. `frontend/src/components/admin/global-settings/components/BackgroundPanel.tsx`
5. `frontend/src/components/admin/global-settings/GlobalSettingsTemplate.tsx`
6. 각 페이지별 config 파일

**리팩토링 단계**:
1. 공통 타입 추출
2. 공통 Hook 생성
3. 패널 컴포넌트 분리
4. 템플릿 컴포넌트 생성
5. 기존 GlobalSettings를 템플릿 기반으로 전환
6. 빌드 테스트

#### Task A-3: 백엔드 쿼리 최적화

**대상 파일**:
- `postController.ts` - getPosts
- `statisticsController.ts` - 서브쿼리 제거
- 모든 페이지네이션 엔드포인트

**리팩토링 단계**:
1. COUNT(*) OVER() 패턴 적용
2. 서브쿼리를 JOIN으로 변환
3. 파라미터 빌더 유틸리티 생성
4. 테스트

#### Task A-4: 백엔드 타입 강화

**대상 파일**:
- `postController.ts`
- `userAdminController.ts`
- `categoryAdminController.ts`
- `postAdminController.ts`

**리팩토링 단계**:
1. `any` 타입 위치 식별
2. 적절한 타입 정의
3. 타입 적용
4. 빌드 테스트

---

## 5. 예상 효과

### 5.1 코드 감소

| 영역 | 현재 | 예상 | 감소율 |
|------|------|------|--------|
| GlobalSettings (8개) | 5,900줄 | 800줄 | 86% |
| RichTextEditor | 2,419줄 | 600줄 | 75% |
| Management 중복 | 4,500줄 | 1,500줄 | 67% |
| **합계** | 12,819줄 | 2,900줄 | 77% |

### 5.2 유지보수성

- **변경 영향 범위**: 단일 파일 → 전체 전파 (템플릿 기반)
- **버그 수정**: 한 곳 수정 → 전체 적용
- **새 기능 추가**: 설정 파일만 추가

### 5.3 성능

- **DB 호출**: 페이지네이션당 2회 → 1회 (50% 감소)
- **번들 크기**: 중복 코드 제거로 10-15% 감소
- **초기 렌더링**: 컴포넌트 분할로 lazy loading 가능

---

## 6. 위험 요소 및 대응

### 6.1 기능 회귀

**위험**: 리팩토링 중 기존 기능 손상
**대응**:
- 단위별 빌드 테스트
- 기능별 수동 테스트 체크리스트
- Git 브랜치 전략 (feature 브랜치)

### 6.2 일정 지연

**위험**: 예상보다 복잡한 의존성
**대응**:
- 우선순위에 따른 단계적 실행
- 각 Task 완료 후 검증

### 6.3 팀 적응

**위험**: 새로운 패턴에 대한 학습 곡선
**대응**:
- 상세한 문서화
- 예시 코드 제공

---

## 7. 실행 순서

```
Phase 2-A (HIGH)
├── A-1: RichTextEditor 분할
├── A-2: GlobalSettings 템플릿화
├── A-3: 백엔드 쿼리 최적화
└── A-4: 백엔드 타입 강화

Phase 2-B (MEDIUM)
├── B-1: MotionBoxEditor 분할
├── B-2: Header 분할
├── B-3: Management 표준화
├── B-4: 서비스 레이어 완성
└── B-5: 컨트롤러 분할

Phase 2-C (LOW)
├── C-1: React Query 전면 적용
├── C-2: 상태 관리 개선
├── C-3: Repository 패턴
└── C-4: 테스트 확대
```

---

## 8. 체크리스트

### Phase 2-A 완료 기준

- [ ] RichTextEditor 5개 이상 파일로 분할
- [ ] GlobalSettings 템플릿 기반 전환
- [ ] 이중 쿼리 제거
- [ ] `any` 타입 제거
- [ ] 프론트엔드 빌드 성공
- [ ] 백엔드 빌드 성공
- [ ] 주요 기능 동작 확인

### Phase 2-B 완료 기준

- [ ] MotionBoxEditor 분할
- [ ] Header 분할
- [ ] Management 컴포넌트 useCRUD 적용
- [ ] 서비스 레이어 확장
- [ ] 컨트롤러 분할
- [ ] 빌드 성공
- [ ] 기능 테스트 통과

---

## 9. 부록

### 9.1 참조 파일 목록

**프론트엔드 주요 파일**:
- `frontend/src/components/common/RichTextEditor.tsx`
- `frontend/src/components/admin/*GlobalSettings.tsx` (8개)
- `frontend/src/components/admin/MotionBoxEditor.tsx`
- `frontend/src/components/common/Header.tsx`

**백엔드 주요 파일**:
- `backend/src/controllers/postController.ts`
- `backend/src/controllers/authController.ts`
- `backend/src/controllers/mypageController.ts`
- `backend/src/controllers/motionBoxController.ts`

### 9.2 관련 문서

- `Refactory/refactory_plan_1_251203/` - Phase 1 계획 및 결과

---

*이 문서는 프로젝트 진행에 따라 업데이트됩니다.*
