# AoID 프로젝트 리팩토링 계획 v1

**작성일**: 2024-12-03
**프로젝트**: AoID (Association of Independent Developers)
**분석 범위**: Frontend (141 파일) + Backend (9,354 LoC)

---

## 목차

1. [Executive Summary](#executive-summary)
2. [Critical Issues](#critical-issues)
3. [High Priority Issues](#high-priority-issues)
4. [Medium Priority Issues](#medium-priority-issues)
5. [리팩토링 로드맵](#리팩토링-로드맵)
6. [상세 분석: 프론트엔드](#상세-분석-프론트엔드)
7. [상세 분석: 백엔드](#상세-분석-백엔드)
8. [예상 효과](#예상-효과)

---

## Executive Summary

### 프로젝트 현황

| 구분 | 수치 |
|-----|------|
| 프론트엔드 파일 수 | 141개 TypeScript/TSX |
| 백엔드 총 라인 수 | 9,354 LoC |
| 컨트롤러 파일 수 | 22개 |
| 가장 큰 컨트롤러 | adminController.ts (1,030줄) |

### 핵심 문제점

1. **서비스 레이어 부재**: 비즈니스 로직이 컨트롤러에 직접 구현됨
2. **N+1 쿼리 문제**: motionBoxController에서 심각한 성능 이슈
3. **코드 중복**: TabPanel, Pagination, 에러 처리 등 광범위한 중복
4. **타입 안전성 부족**: `any` 타입 과다 사용, API 응답 타입 미정의

---

## Critical Issues

### 1. 백엔드 N+1 쿼리 문제

**파일**: `backend/src/controllers/motionBoxController.ts:15-92`

**현재 구조**:
```
Query 1: SELECT * FROM motion_boxes
  → 각 box마다: SELECT * FROM motion_box_elements
    → 각 element마다: SELECT * FROM motion_box_keyframes
```

**영향**:
- 10개 박스 × 5개 엘리먼트 × 3개 키프레임 = **61개 쿼리**
- 최적화 시 **3개 쿼리**로 가능

**해결 방안**:
```sql
SELECT
  mb.*,
  json_agg(json_build_object(
    'id', mbe.id,
    'elementType', mbe.element_type,
    'keyframes', (SELECT json_agg(...) FROM motion_box_keyframes WHERE element_id = mbe.id)
  )) as elements
FROM motion_boxes mb
LEFT JOIN motion_box_elements mbe ON mb.id = mbe.motion_box_id
GROUP BY mb.id
```

---

### 2. Fat Controllers (서비스 레이어 부재)

**현재 아키텍처**:
```
HTTP Request → Route → Fat Controller (비즈니스 로직 + DB 쿼리) → Database
```

**문제가 있는 컨트롤러**:

| 컨트롤러 | 라인 수 | 문제점 |
|---------|--------|--------|
| adminController.ts | 1,030 | 모든 관리 기능 집중 |
| authController.ts | 587 | 인증 + 권한 + 등급 혼재 |
| postController.ts | 320 | 검색 로직 중복 |
| motionBoxController.ts | 300+ | N+1 쿼리 |

**권장 아키텍처**:
```
HTTP Request → Route + Validator → Controller (조율만) → Service (비즈니스 로직) → Repository → Database
```

**생성 필요한 서비스**:
- `UserService`: 사용자 관리, 프로필, 검증
- `PostService`: 게시글 CRUD, 검색, 통계
- `PermissionService`: 권한 검사, 카테고리별 권한
- `CategoryService`: 카테고리 관리
- `CommentService`: 댓글 관리

---

## High Priority Issues

### 프론트엔드

#### 1. TabPanel 컴포넌트 중복 (5-6개 파일)

**영향 받는 파일**:
- `components/admin/MemberManagement.tsx` (lines 14-35)
- `components/admin/BoardManagement.tsx` (lines 15-36)
- `components/admin/HomeManagement.tsx` (lines 14-41)
- `components/admin/AboutManagementContainer.tsx` (lines 14-41)
- `components/admin/TechTrendsManagement.tsx`
- `components/admin/ConnectionRoundManagement.tsx`

**중복 코드**:
```typescript
// 각 파일에서 동일하게 반복
function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index}
             id={`member-tabpanel-${index}`} {...other}>
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `member-tab-${index}`,
        'aria-controls': `member-tabpanel-${index}`,
    };
}
```

**해결**: 공통 컴포넌트 추출
```typescript
// components/common/TabbedPanel.tsx
export const TabPanel: React.FC<TabPanelProps> = ({
    children, value, index, idPrefix, ...other
}) => (
    <div role="tabpanel" hidden={value !== index}
         id={`${idPrefix}-tabpanel-${index}`}
         aria-labelledby={`${idPrefix}-tab-${index}`} {...other}>
        {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
);

export const a11yProps = (index: number, idPrefix: string) => ({
    id: `${idPrefix}-tab-${index}`,
    'aria-controls': `${idPrefix}-tabpanel-${index}`,
});
```

---

#### 2. API 클라이언트 중복

**현재 상태**:
- `src/api/client.ts` (6줄) - **미사용**
- `src/services/api.ts` (524줄) - 실제 사용

**조치**: `client.ts` 제거

---

#### 3. useEffect 보일러플레이트 (40+ 파일)

**반복되는 패턴**:
```typescript
useEffect(() => {
  let isMounted = true;
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get(...);
      if (isMounted) {
        setState(response.data);
      }
    } catch (error) {
      if (isMounted) {
        toast.error('데이터를 불러오는데 실패했습니다.');
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };
  fetchData();
  return () => { isMounted = false; };
}, []);
```

**해결**: 커스텀 훅 생성
```typescript
// hooks/useAsyncData.ts
export const useAsyncData = <T,>(
    asyncFn: () => Promise<T>,
    options: { errorMessage?: string; dependencies?: any[] } = {}
) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const isMountedRef = useRef(true);

    useEffect(() => {
        isMountedRef.current = true;
        setLoading(true);

        (async () => {
            try {
                const result = await asyncFn();
                if (isMountedRef.current) {
                    setData(result);
                    setError(null);
                }
            } catch (err) {
                if (isMountedRef.current) {
                    setError(err as Error);
                    if (options.errorMessage) {
                        toast.error(options.errorMessage);
                    }
                }
            } finally {
                if (isMountedRef.current) {
                    setLoading(false);
                }
            }
        })();

        return () => { isMountedRef.current = false; };
    }, options.dependencies || []);

    return { data, loading, error };
};
```

---

#### 4. 큰 컴포넌트 분할 필요

| 컴포넌트 | 현재 라인 | 분할 방안 |
|---------|---------|----------|
| UserManagement.tsx | 500+ | UserList, UserFilters, UserEditDialog, UserProfile |
| PostDetailPage.tsx | 400+ | PostHeader, PostContent, PostActions, PostComments |
| RichTextEditor.tsx | 600+ | EditorToolbar, EditorContent, ImageModal, TableModal |
| HomeManagement.tsx | 500+ | 각 탭별 독립 컴포넌트 |

---

### 백엔드

#### 5. 쿼리 로직 중복

**파일**: `postController.ts`

```typescript
// 라인 13-58: 메인 쿼리
let query = `SELECT p.*, ... FROM posts p WHERE 1=1`;
if (search) {
    query += ` AND (p.title ILIKE $${paramIndex} OR p.content ILIKE $${paramIndex})`;
}

// 라인 63-98: 카운트 쿼리 (동일 조건 복붙)
let countQuery = `SELECT COUNT(*) FROM posts p WHERE 1=1`;
if (search) {
    countQuery += ` AND (p.title ILIKE $${paramIndex} OR p.content ILIKE $${paramIndex})`;
}
```

**해결**: 쿼리 빌더 함수 추출

---

#### 6. Pagination 로직 중복 (8+ 컨트롤러)

**중복 코드**:
```typescript
const page = parseInt(req.query.page as string) || 1;
const limit = parseInt(req.query.limit as string) || 20;
const offset = (page - 1) * limit;
// ...
{
  page: Number(page),
  limit: Number(limit),
  total,
  totalPages: Math.ceil(total / limit),
}
```

**해결**:
```typescript
// middleware/pagination.ts
export const getPaginationParams = (query: any) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(query.limit) || 20));
  return { page, limit, offset: (page - 1) * limit };
};

export const paginationResponse = (page: number, limit: number, total: number) => ({
  page, limit, total, totalPages: Math.ceil(total / limit)
});
```

---

#### 7. Case Handling 중복

**반복 코드**:
```typescript
// 모든 컨트롤러에서 반복
const categoryId = req.body.category_id ?? req.body.categoryId;
const isPinned = req.body.is_pinned ?? req.body.isPinned ?? false;
```

**해결**:
```typescript
// utils/parseRequest.ts
export const parseBody = <T>(body: any, keyMap: Record<keyof T, string[]>): T => {
  const result = {} as T;
  for (const [outputKey, inputKeys] of Object.entries(keyMap)) {
    result[outputKey as keyof T] = inputKeys.reduce(
      (val, key) => val ?? body[key],
      undefined
    );
  }
  return result;
};
```

---

## Medium Priority Issues

### 프론트엔드

| 이슈 | 파일 수 | 설명 |
|-----|--------|------|
| `any` 타입 사용 | 10+ | useCRUD.ts, useFormDialog.ts 등 |
| localStorage 접근 패턴 중복 | 3 | AuthContext, api.ts, RichTextEditor |
| 폼 다이얼로그 패턴 불일치 | 15+ | useFormDialog 미활용 |
| API 응답 타입 미정의 | 전체 | `response.data[responseKey]` 패턴 |
| React Query 미활용 | 대부분 | useState + useEffect 조합 사용 |

### 백엔드

| 이슈 | 파일 수 | 설명 |
|-----|--------|------|
| 에러 처리 불일치 | 22 | 모든 에러가 동일한 일반 메시지 |
| 트랜잭션 미사용 | 9+ | 다단계 작업에서 트랜잭션 누락 |
| CRUDController 미활용 | 16+ | 구현됨(2개 사용) vs 22개 컨트롤러 |
| 입력 검증 결과 미확인 | 전체 | express-validator 결과 무시 |

---

## 리팩토링 로드맵

### Phase 1: Quick Wins (1주)

**목표**: 빠르게 달성 가능한 개선

| 작업 | 파일 | 예상 시간 |
|-----|------|----------|
| `client.ts` 제거 | 1개 | 10분 |
| 공통 `TabPanel` 컴포넌트 추출 | 6개 | 2시간 |
| `getPaginationParams()` 유틸리티 | 8개 | 1시간 |
| `parseBody()` 유틸리티 | 10개 | 1시간 |

**예상 코드 감소**: 200-300줄

---

### Phase 2: 핵심 구조 개선 (2-3주)

**목표**: 아키텍처 개선

#### 2-1. 백엔드 서비스 레이어 도입

| 서비스 | 대상 컨트롤러 | 주요 메서드 |
|--------|-------------|------------|
| UserService | authController, adminController, mypageController | getUserById, updateUser, validateEmail |
| PostService | postController, adminController | getPaginatedPosts, createPost, deleteWithDependencies |
| PermissionService | authController | getUserPermissions, checkCategoryPermission |
| CategoryService | adminController | getCategories, createCategory, validateHierarchy |

#### 2-2. N+1 쿼리 최적화

```typescript
// motionBoxController.ts 개선
const getMotionBoxesOptimized = async () => {
  const result = await pool.query(`
    SELECT
      mb.*,
      COALESCE(json_agg(
        json_build_object(
          'id', mbe.id,
          'elementType', mbe.element_type,
          'keyframes', (
            SELECT COALESCE(json_agg(
              json_build_object('id', k.id, 'time', k.time, 'value', k.value)
            ), '[]')
            FROM motion_box_keyframes k
            WHERE k.element_id = mbe.id
          )
        )
      ) FILTER (WHERE mbe.id IS NOT NULL), '[]') as elements
    FROM motion_boxes mb
    LEFT JOIN motion_box_elements mbe ON mb.id = mbe.motion_box_id
    GROUP BY mb.id
    ORDER BY mb.display_order
  `);
  return result.rows;
};
```

#### 2-3. 프론트엔드 커스텀 훅 생성

| 훅 | 용도 | 대상 파일 |
|---|-----|----------|
| useAsyncData | 데이터 로딩 | 40+ 파일 |
| useTabbedManagement | 탭 관리 | 6개 파일 |
| usePagination | 페이지네이션 | 10+ 파일 |

---

### Phase 3: 컴포넌트 분할 (2주)

**목표**: 대형 컴포넌트 분리

#### UserManagement 분할

```
components/admin/
├── UserManagement.tsx (컨테이너)
├── user-management/
│   ├── UserList.tsx
│   ├── UserListFilters.tsx
│   ├── UserListRow.tsx
│   ├── UserEditDialog.tsx
│   └── UserProfileEditor.tsx
```

#### PostDetailPage 분할

```
pages/
├── PostDetailPage.tsx (컨테이너)
└── post-detail/
    ├── PostHeader.tsx
    ├── PostContent.tsx
    ├── PostActions.tsx
    ├── PostComments.tsx
    └── PostNavigation.tsx
```

#### adminController 분할

```
controllers/admin/
├── index.ts (라우트 통합)
├── userAdminController.ts
├── categoryAdminController.ts
├── postAdminController.ts
├── commentAdminController.ts
└── statisticsController.ts
```

---

### Phase 4: 타입 안전성 (지속적)

**목표**: TypeScript 활용도 극대화

#### API 응답 타입 정의

```typescript
// types/api.ts
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 사용 예시
export const adminAPI = {
  getCategories: () =>
    api.get<ApiResponse<{ categories: Category[] }>>('/admin/categories'),

  getUsers: (params?: object) =>
    api.get<PaginatedResponse<User>>('/admin/users', { params }),
};
```

#### `any` 타입 제거

| 파일 | 위치 | 수정 방안 |
|-----|-----|----------|
| useCRUD.ts | line 10 | 제네릭 API 인터페이스 정의 |
| useFormDialog.ts | line 14, 18 | 폼 데이터 타입 명시 |
| api.ts | 여러 곳 | 응답 타입 정의 |

---

## 상세 분석: 프론트엔드

### 구조 개요

```
src/
├── components/
│   ├── about/          (7 섹션 컴포넌트)
│   ├── admin/          (65개 관리 컴포넌트) ⚠️ 가장 큰 영역
│   ├── board/          (게시판 레이아웃)
│   ├── common/         (공통 컴포넌트)
│   ├── connection-round/
│   ├── motionbox/
│   ├── mypage/         (마이페이지)
│   └── tech-trends/
├── pages/              (14개 페이지)
├── services/           (api.ts - 524줄)
├── contexts/           (AuthContext, ContainerWidthContext)
├── hooks/              (useCRUD, useFormDialog, useMotionBox)
├── utils/              (caseConverter, imageHelpers)
├── types/              (타입 정의)
└── config/             (메뉴 설정)
```

### 주요 코드 중복 위치

| 패턴 | 파일 수 | 중복 라인 |
|-----|--------|----------|
| TabPanel 컴포넌트 | 6 | ~150줄 |
| useEffect 데이터 로딩 | 40+ | ~1,000줄 |
| 폼 다이얼로그 상태 관리 | 15+ | ~500줄 |
| localStorage 접근 | 3 | ~30줄 |

### API 서비스 구조 개선 제안

**현재**: `services/api.ts` (524줄, 모든 API)

**제안**:
```
services/
├── api.ts (axios 인스턴스, 인터셉터)
├── types.ts (API 타입 정의)
└── endpoints/
    ├── auth.ts
    ├── posts.ts
    ├── comments.ts
    ├── admin/
    │   ├── users.ts
    │   ├── categories.ts
    │   └── index.ts
    └── index.ts
```

---

## 상세 분석: 백엔드

### 컨트롤러 규모

| 컨트롤러 | 라인 수 | 문제점 |
|---------|--------|--------|
| adminController.ts | 1,030 | 7개 기능 집중 |
| authController.ts | 587 | 권한 로직 중복 |
| motionBoxController.ts | 300+ | N+1 쿼리 |
| postController.ts | 320 | WHERE 중복 |
| heroController.ts | 280+ | N+1 가능성 |
| 나머지 17개 | 평균 200 | 다양한 중복 |

### N+1 쿼리 발생 위치

| 파일 | 라인 | 쿼리 수 (10개 항목 기준) |
|-----|-----|------------------------|
| motionBoxController.ts | 15-92 | 61+ |
| motionBoxController.ts | 97-188 | 31+ |
| heroController.ts | (확인 필요) | - |

### 트랜잭션 누락 위치

| 파일 | 함수 | 영향 |
|-----|-----|-----|
| adminController.ts | updateUser | users + profiles 동시 수정 |
| commentController.ts | deleteComment | 자식 댓글 처리 |
| postController.ts | deletePost | likes, comments 정리 안됨 |

### 보안 고려사항

| 항목 | 상태 | 비고 |
|-----|-----|-----|
| SQL Injection | ✅ 안전 | 파라미터화된 쿼리 사용 |
| 비밀번호 해싱 | ✅ 안전 | bcrypt SALT_ROUNDS=10 |
| JWT 토큰 | ⚠️ 주의 | OAuth 콜백에서 쿼리 파라미터로 전달 |
| Rate Limiting | ❌ 없음 | 로그인, 회원가입 등 |
| CORS | ⚠️ 주의 | 환경변수 없으면 localhost 허용 |
| Helmet | ❌ 없음 | 보안 헤더 미설정 |

---

## 예상 효과

### 정량적 개선

| 지표 | 현재 | 예상 |
|-----|-----|-----|
| 총 코드량 | 100% | 75-80% |
| 중복 코드 | ~2,000줄 | ~200줄 |
| 데이터베이스 쿼리 (목록 조회) | 61+ | 3 |
| 컨트롤러 평균 라인 | 320줄 | 100줄 |

### 정성적 개선

- **유지보수성**: 서비스 레이어로 비즈니스 로직 분리
- **테스트 용이성**: 서비스 단위 테스트 가능
- **성능**: N+1 쿼리 해결로 응답 시간 대폭 개선
- **타입 안전성**: `any` 제거로 런타임 에러 감소
- **개발 속도**: 공통 훅/컴포넌트로 보일러플레이트 감소

---

## 체크리스트

### Phase 1 완료 조건
- [ ] `client.ts` 제거됨
- [ ] `TabPanel` 공통 컴포넌트 생성 및 적용
- [ ] `getPaginationParams` 유틸리티 생성 및 적용
- [ ] `parseBody` 유틸리티 생성 및 적용

### Phase 2 완료 조건
- [ ] UserService 생성 및 적용
- [ ] PostService 생성 및 적용
- [ ] PermissionService 생성 및 적용
- [ ] motionBoxController N+1 해결
- [ ] useAsyncData 훅 생성 및 40+ 파일 적용
- [ ] useTabbedManagement 훅 생성 및 적용

### Phase 3 완료 조건
- [ ] UserManagement 분할 완료
- [ ] PostDetailPage 분할 완료
- [ ] adminController 분할 완료

### Phase 4 완료 조건
- [ ] API 응답 타입 전체 정의
- [ ] `any` 타입 0개
- [ ] React Query 적용 범위 확대

---

## 참고 자료

- [프로젝트 CLAUDE.md](../../CLAUDE.md)
- [Backend Schema](../../backend/database/schema.sql)
- [Frontend Structure](../../frontend/src/)

---

*이 문서는 지속적으로 업데이트됩니다.*
