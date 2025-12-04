# Phase 1: Quick Wins

**목표**: 빠르게 달성 가능한 개선
**예상 기간**: 1주
**예상 코드 감소**: 200-300줄

---

## 작업 목록

### 1.1 `client.ts` 제거

**파일**: `frontend/src/api/client.ts`
**상태**: 미사용 (6줄)
**조치**: 파일 삭제

```bash
# 확인
grep -r "from.*api/client" frontend/src/
# 참조 없으면 삭제
rm frontend/src/api/client.ts
```

**완료 조건**:
- [ ] 참조 확인 완료
- [ ] 파일 삭제
- [ ] 빌드 성공

---

### 1.2 공통 TabPanel 컴포넌트 추출

**생성 파일**: `frontend/src/components/common/TabbedPanel.tsx`

```typescript
import React from 'react';
import { Box } from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  idPrefix: string;
}

export const TabPanel: React.FC<TabPanelProps> = ({
  children,
  value,
  index,
  idPrefix,
  ...other
}) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`${idPrefix}-tabpanel-${index}`}
    aria-labelledby={`${idPrefix}-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
  </div>
);

export const a11yProps = (index: number, idPrefix: string) => ({
  id: `${idPrefix}-tab-${index}`,
  'aria-controls': `${idPrefix}-tabpanel-${index}`,
});
```

**수정 대상 파일**:

| 파일 | 수정 내용 |
|-----|----------|
| `components/admin/MemberManagement.tsx` | 로컬 TabPanel 제거, import 추가 |
| `components/admin/BoardManagement.tsx` | 로컬 TabPanel 제거, import 추가 |
| `components/admin/HomeManagement.tsx` | 로컬 TabPanel 제거, import 추가 |
| `components/admin/AboutManagementContainer.tsx` | 로컬 TabPanel 제거, import 추가 |
| `components/admin/TechTrendsManagement.tsx` | 로컬 TabPanel 제거, import 추가 |
| `components/admin/ConnectionRoundManagement.tsx` | 로컬 TabPanel 제거, import 추가 |

**수정 예시** (MemberManagement.tsx):

```typescript
// Before
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

// After
import { TabPanel, a11yProps } from '../common/TabbedPanel';

// 사용시
<Tab label="회원 목록" {...a11yProps(0, 'member')} />
<TabPanel value={value} index={0} idPrefix="member">
  <UserManagement />
</TabPanel>
```

**완료 조건**:
- [ ] TabbedPanel.tsx 생성
- [ ] MemberManagement.tsx 수정
- [ ] BoardManagement.tsx 수정
- [ ] HomeManagement.tsx 수정
- [ ] AboutManagementContainer.tsx 수정
- [ ] TechTrendsManagement.tsx 수정
- [ ] ConnectionRoundManagement.tsx 수정
- [ ] 빌드 성공
- [ ] 탭 동작 테스트

---

### 1.3 Pagination 유틸리티 생성

**생성 파일**: `backend/src/utils/pagination.ts`

```typescript
export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const getPaginationParams = (query: {
  page?: string;
  limit?: string;
}): PaginationParams => {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = Math.max(1, Math.min(100, parseInt(query.limit || '20', 10)));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

export const paginationResponse = (
  page: number,
  limit: number,
  total: number
): PaginationResponse => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});
```

**수정 대상 파일**:

| 파일 | 현재 라인 |
|-----|----------|
| `controllers/adminController.ts` | 5-10, 427-432, 603-608 |
| `controllers/postController.ts` | 7-10 |
| `controllers/mypageController.ts` | 페이지네이션 부분 |
| `controllers/articlesController.ts` | 페이지네이션 부분 |

**수정 예시** (postController.ts):

```typescript
// Before
export const getPosts = async (req: Request, res: Response) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);
  // ...
  res.json({
    posts: result.rows,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
};

// After
import { getPaginationParams, paginationResponse } from '../utils/pagination';

export const getPosts = async (req: Request, res: Response) => {
  const { page, limit, offset } = getPaginationParams(req.query);
  // ...
  res.json({
    posts: result.rows,
    pagination: paginationResponse(page, limit, total),
  });
};
```

**완료 조건**:
- [ ] pagination.ts 생성
- [ ] adminController.ts 수정 (3곳)
- [ ] postController.ts 수정
- [ ] mypageController.ts 수정
- [ ] articlesController.ts 수정
- [ ] 빌드 성공
- [ ] API 응답 테스트

---

### 1.4 Request Body 파싱 유틸리티 생성

**생성 파일**: `backend/src/utils/parseRequest.ts`

```typescript
type KeyMapping<T> = {
  [K in keyof T]: string[];
};

export const parseBody = <T extends Record<string, any>>(
  body: Record<string, any>,
  keyMap: KeyMapping<T>
): T => {
  const result = {} as T;

  for (const [outputKey, inputKeys] of Object.entries(keyMap)) {
    for (const inputKey of inputKeys as string[]) {
      if (body[inputKey] !== undefined) {
        result[outputKey as keyof T] = body[inputKey];
        break;
      }
    }
  }

  return result;
};

// 자주 사용되는 매핑 프리셋
export const commonMappings = {
  categoryId: ['category_id', 'categoryId'],
  parentSection: ['parent_section', 'parentSection'],
  isPinned: ['is_pinned', 'isPinned'],
  isNotice: ['is_notice', 'isNotice'],
  displayOrder: ['display_order', 'displayOrder'],
};
```

**수정 대상 파일**:

| 파일 | 현재 패턴 |
|-----|----------|
| `controllers/authController.ts` | line 42-43 |
| `controllers/postController.ts` | line 150-152, 183-185 |
| `controllers/adminController.ts` | line 167-168, 213-217 |
| `controllers/articlesController.ts` | line 31, 56 |

**수정 예시** (postController.ts):

```typescript
// Before
export const createPost = async (req: Request, res: Response) => {
  const { title, content } = req.body;
  const categoryId = req.body.category_id ?? req.body.categoryId;
  const isPinned = req.body.is_pinned ?? req.body.isPinned ?? false;
  // ...
};

// After
import { parseBody, commonMappings } from '../utils/parseRequest';

interface CreatePostBody {
  title: string;
  content: string;
  categoryId: number;
  isPinned: boolean;
}

export const createPost = async (req: Request, res: Response) => {
  const { title, content } = req.body;
  const { categoryId, isPinned = false } = parseBody<Pick<CreatePostBody, 'categoryId' | 'isPinned'>>(
    req.body,
    {
      categoryId: commonMappings.categoryId,
      isPinned: commonMappings.isPinned,
    }
  );
  // ...
};
```

**완료 조건**:
- [ ] parseRequest.ts 생성
- [ ] authController.ts 수정
- [ ] postController.ts 수정
- [ ] adminController.ts 수정
- [ ] articlesController.ts 수정
- [ ] 빌드 성공
- [ ] API 동작 테스트

---

## 테스트 계획

### 수동 테스트

1. **TabPanel 테스트**
   - [ ] MemberManagement 탭 전환
   - [ ] BoardManagement 탭 전환
   - [ ] HomeManagement 탭 전환
   - [ ] 접근성 속성 확인 (aria-controls, role)

2. **Pagination 테스트**
   - [ ] 게시글 목록 페이지네이션
   - [ ] 관리자 회원 목록 페이지네이션
   - [ ] 관리자 게시글 목록 페이지네이션

3. **Request Body 테스트**
   - [ ] snake_case로 게시글 생성
   - [ ] camelCase로 게시글 생성
   - [ ] 혼합된 케이스로 게시글 생성

---

## 롤백 계획

각 작업은 독립적이므로 개별 롤백 가능:

```bash
# Git으로 특정 파일 롤백
git checkout HEAD~1 -- frontend/src/components/admin/MemberManagement.tsx
```

---

## 완료 체크리스트

- [ ] 1.1 client.ts 제거
- [ ] 1.2 TabPanel 컴포넌트 추출 및 적용
- [ ] 1.3 Pagination 유틸리티 생성 및 적용
- [ ] 1.4 Request Body 파싱 유틸리티 생성 및 적용
- [ ] 전체 빌드 성공
- [ ] 수동 테스트 통과
- [ ] 코드 리뷰 완료
