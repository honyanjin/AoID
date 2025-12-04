# Phase 4: 타입 안전성 강화

**목표**: TypeScript 활용도 극대화 및 런타임 에러 감소
**예상 기간**: 지속적 (2주 집중 + 유지보수)
**의존성**: Phase 1-3 완료 권장 (독립적 진행 가능)

---

## 작업 목록

### 4.1 API 응답 타입 정의

#### 4.1.1 기본 응답 타입

**파일**: `frontend/src/types/api.ts`

```typescript
// 기본 API 응답
export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 페이지네이션 응답
export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// 에러 응답
export interface ApiError {
  error: string;
  message?: string;
  details?: Record<string, string[]>;
}

// 목록 응답 헬퍼
export interface ListResponse<T, K extends string> {
  [key in K]: T[];
}
```

#### 4.1.2 도메인별 응답 타입

```typescript
// types/api/auth.ts
export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterResponse {
  user: User;
  message: string;
}

export interface MeResponse {
  user: User;
}

// types/api/posts.ts
export interface PostListResponse {
  posts: Post[];
  pagination: Pagination;
}

export interface PostDetailResponse {
  post: PostDetail;
}

export interface PostCreateResponse {
  post: Post;
  message: string;
}

// types/api/admin.ts
export interface UserListResponse {
  users: User[];
  pagination: Pagination;
}

export interface CategoryListResponse {
  categories: Category[];
}

export interface StatisticsResponse {
  statistics: {
    totalUsers: number;
    totalPosts: number;
    totalComments: number;
    newUsersToday: number;
    newPostsToday: number;
  };
}
```

#### 4.1.3 API 서비스에 타입 적용

```typescript
// services/api.ts
import axios, { AxiosResponse } from 'axios';
import {
  LoginResponse,
  RegisterResponse,
  MeResponse,
  PostListResponse,
  PostDetailResponse,
  UserListResponse,
  CategoryListResponse,
} from '../types/api';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// 인터셉터...

// Auth API
export const authAPI = {
  login: (email: string, password: string): Promise<AxiosResponse<LoginResponse>> =>
    api.post('/auth/login', { email, password }),

  register: (data: RegisterData): Promise<AxiosResponse<RegisterResponse>> =>
    api.post('/auth/register', data),

  getMe: (): Promise<AxiosResponse<MeResponse>> =>
    api.get('/auth/me'),

  logout: (): Promise<AxiosResponse<void>> =>
    api.post('/auth/logout'),
};

// Post API
export const postAPI = {
  getPosts: (params?: PostListParams): Promise<AxiosResponse<PostListResponse>> =>
    api.get('/posts', { params }),

  getPost: (id: number): Promise<AxiosResponse<PostDetailResponse>> =>
    api.get(`/posts/${id}`),

  createPost: (data: PostCreateData): Promise<AxiosResponse<PostCreateResponse>> =>
    api.post('/posts', data),

  updatePost: (id: number, data: PostUpdateData): Promise<AxiosResponse<PostCreateResponse>> =>
    api.put(`/posts/${id}`, data),

  deletePost: (id: number): Promise<AxiosResponse<void>> =>
    api.delete(`/posts/${id}`),
};

// Admin API
export const adminAPI = {
  getUsers: (params?: UserListParams): Promise<AxiosResponse<UserListResponse>> =>
    api.get('/admin/users', { params }),

  getCategories: (): Promise<AxiosResponse<CategoryListResponse>> =>
    api.get('/admin/categories'),

  // ... 기타 관리자 API
};
```

---

### 4.2 `any` 타입 제거

#### 4.2.1 useCRUD 훅 타입 개선

**현재 (문제)**:
```typescript
// 타입 안전하지 않음
export function useCRUD(api: any, responseKey: string) {
  const response = await api[getAllMethod]();
  setItems(response.data[responseKey]);
}
```

**개선**:
```typescript
// hooks/useCRUD.ts
export interface CRUDApi<T, CreateData = Partial<T>, UpdateData = Partial<T>> {
  getAll: () => Promise<{ data: { [key: string]: T[] } }>;
  create: (data: CreateData) => Promise<{ data: T }>;
  update: (id: number, data: UpdateData) => Promise<{ data: T }>;
  delete: (id: number) => Promise<void>;
  reorder?: (id: number, direction: 'up' | 'down') => Promise<void>;
}

export interface UseCRUDOptions {
  responseKey: string;
  onError?: (error: Error, action: string) => void;
  onSuccess?: (action: string) => void;
}

export function useCRUD<T extends { id: number }, C = Partial<T>, U = Partial<T>>(
  api: CRUDApi<T, C, U>,
  options: UseCRUDOptions
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.getAll();
      setItems(response.data[options.responseKey] as T[]);
    } catch (err) {
      const error = err as Error;
      setError(error);
      options.onError?.(error, 'fetch');
    } finally {
      setLoading(false);
    }
  }, [api, options]);

  const createItem = useCallback(async (data: C): Promise<T | null> => {
    try {
      const response = await api.create(data);
      await fetchItems();
      options.onSuccess?.('create');
      return response.data;
    } catch (err) {
      options.onError?.(err as Error, 'create');
      return null;
    }
  }, [api, fetchItems, options]);

  const updateItem = useCallback(async (id: number, data: U): Promise<T | null> => {
    try {
      const response = await api.update(id, data);
      await fetchItems();
      options.onSuccess?.('update');
      return response.data;
    } catch (err) {
      options.onError?.(err as Error, 'update');
      return null;
    }
  }, [api, fetchItems, options]);

  const deleteItem = useCallback(async (id: number): Promise<boolean> => {
    try {
      await api.delete(id);
      await fetchItems();
      options.onSuccess?.('delete');
      return true;
    } catch (err) {
      options.onError?.(err as Error, 'delete');
      return false;
    }
  }, [api, fetchItems, options]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items,
    loading,
    error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  };
}
```

**사용 예시**:
```typescript
interface Category {
  id: number;
  name: string;
  parentSection: string;
}

interface CategoryCreate {
  name: string;
  parentSection: string;
}

const categoryApi: CRUDApi<Category, CategoryCreate> = {
  getAll: () => adminAPI.getCategories(),
  create: (data) => adminAPI.createCategory(data),
  update: (id, data) => adminAPI.updateCategory(id, data),
  delete: (id) => adminAPI.deleteCategory(id),
};

const { items: categories, loading, createItem, updateItem, deleteItem } = useCRUD(
  categoryApi,
  {
    responseKey: 'categories',
    onError: (error, action) => toast.error(`${action} 실패: ${error.message}`),
    onSuccess: (action) => toast.success(`${action} 성공`),
  }
);
```

---

#### 4.2.2 useFormDialog 훅 타입 개선

**현재 (문제)**:
```typescript
export function useFormDialog(initialData: any) {
  const openEdit = (item?: any) => {
    // ...
  };
}
```

**개선**:
```typescript
// hooks/useFormDialog.ts
export interface UseFormDialogOptions<T> {
  initialData: T;
  transformForEdit?: (item: any) => T;
}

export interface UseFormDialogResult<T> {
  open: boolean;
  editingId: number | null;
  formData: T;
  isEditing: boolean;
  openCreate: () => void;
  openEdit: (id: number, item: Partial<T>) => void;
  close: () => void;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  updateField: <K extends keyof T>(field: K, value: T[K]) => void;
}

export function useFormDialog<T extends Record<string, any>>(
  options: UseFormDialogOptions<T>
): UseFormDialogResult<T> {
  const { initialData, transformForEdit } = options;
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<T>(initialData);

  const openCreate = useCallback(() => {
    setEditingId(null);
    setFormData(initialData);
    setOpen(true);
  }, [initialData]);

  const openEdit = useCallback((id: number, item: Partial<T>) => {
    setEditingId(id);
    const data = transformForEdit ? transformForEdit(item) : { ...initialData, ...item };
    setFormData(data as T);
    setOpen(true);
  }, [initialData, transformForEdit]);

  const close = useCallback(() => {
    setOpen(false);
    setEditingId(null);
    setFormData(initialData);
  }, [initialData]);

  const updateField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  return {
    open,
    editingId,
    formData,
    isEditing: editingId !== null,
    openCreate,
    openEdit,
    close,
    setFormData,
    updateField,
  };
}
```

**사용 예시**:
```typescript
interface CategoryFormData {
  name: string;
  parentSection: string;
  description: string;
}

const {
  open,
  editingId,
  formData,
  isEditing,
  openCreate,
  openEdit,
  close,
  updateField,
} = useFormDialog<CategoryFormData>({
  initialData: {
    name: '',
    parentSection: 'community',
    description: '',
  },
  transformForEdit: (item) => ({
    name: item.name,
    parentSection: item.parent_section || item.parentSection,
    description: item.description || '',
  }),
});

// 사용
<TextField
  value={formData.name}
  onChange={(e) => updateField('name', e.target.value)}
/>
```

---

### 4.3 도메인 타입 강화

#### 4.3.1 User 타입 개선

```typescript
// types/user.ts
export type UserRole = 'admin' | 'member';
export type UserStatus = 'active' | 'inactive' | 'suspended';
export type AuthProvider = 'local' | 'google' | 'github';

export interface UserPermissions {
  canRead: boolean;
  canWrite: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canComment: boolean;
  canEditComment: boolean;
  canDeleteComment: boolean;
  canUpload: boolean;
}

export interface User {
  id: number;
  email: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  bio: string;
  role: UserRole;
  status: UserStatus;
  provider: AuthProvider;
  gradeId: number | null;
  gradeName: string | null;
  gradeLevel: number | null;
  permissions: UserPermissions;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// 필수 필드만 있는 간략한 사용자 정보
export interface UserSummary {
  id: number;
  username: string;
  avatarUrl: string;
}

// 생성/수정용 타입
export interface UserCreateData {
  email: string;
  username: string;
  password: string;
  fullName?: string;
}

export interface UserUpdateData {
  username?: string;
  fullName?: string;
  bio?: string;
  avatarUrl?: string;
  gradeId?: number | null;
  role?: UserRole;
  status?: UserStatus;
}
```

#### 4.3.2 Post 타입 개선

```typescript
// types/post.ts
export interface Post {
  id: number;
  title: string;
  content: string;
  authorId: number;
  authorName: string;
  authorAvatar: string;
  categoryId: number;
  categoryName: string;
  parentSection: string;
  isPinned: boolean;
  isNotice: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PostDetail extends Post {
  isLiked: boolean;
  author: UserSummary;
  category: CategorySummary;
}

export interface PostCreateData {
  title: string;
  content: string;
  categoryId: number;
  isPinned?: boolean;
  isNotice?: boolean;
}

export interface PostUpdateData extends Partial<PostCreateData> {}

export interface PostListParams {
  page?: number;
  limit?: number;
  categoryId?: number;
  parentSection?: string;
  search?: string;
  authorId?: number;
}
```

---

### 4.4 React Query 확대 적용

#### 4.4.1 쿼리 키 관리

```typescript
// queries/queryKeys.ts
export const queryKeys = {
  // Users
  users: {
    all: ['users'] as const,
    list: (params?: UserListParams) => [...queryKeys.users.all, 'list', params] as const,
    detail: (id: number) => [...queryKeys.users.all, 'detail', id] as const,
    me: () => [...queryKeys.users.all, 'me'] as const,
  },

  // Posts
  posts: {
    all: ['posts'] as const,
    list: (params?: PostListParams) => [...queryKeys.posts.all, 'list', params] as const,
    detail: (id: number) => [...queryKeys.posts.all, 'detail', id] as const,
  },

  // Categories
  categories: {
    all: ['categories'] as const,
    list: (parentSection?: string) => [...queryKeys.categories.all, 'list', parentSection] as const,
  },

  // Grades
  grades: {
    all: ['grades'] as const,
    list: () => [...queryKeys.grades.all, 'list'] as const,
  },
};
```

#### 4.4.2 쿼리 훅 생성

```typescript
// queries/useUsers.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../services/api';
import { queryKeys } from './queryKeys';
import { UserListParams, UserUpdateData } from '../types';

export const useUsers = (params?: UserListParams) => {
  return useQuery({
    queryKey: queryKeys.users.list(params),
    queryFn: () => adminAPI.getUsers(params).then((r) => r.data),
    staleTime: 5 * 60 * 1000, // 5분
  });
};

export const useUser = (id: number) => {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => adminAPI.getUser(id).then((r) => r.data.user),
    enabled: !!id,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UserUpdateData }) =>
      adminAPI.updateUser(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id) });
    },
  });
};
```

#### 4.4.3 쿼리 훅 사용

```typescript
// components/admin/UserManagement.tsx
import { useUsers, useUpdateUser } from '../../queries/useUsers';
import { useGrades } from '../../queries/useGrades';

export const UserManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<UserListFilters>(initialFilters);

  const { data: usersData, isLoading, error } = useUsers({ page, limit: 20, ...filters });
  const { data: gradesData } = useGrades();
  const updateUserMutation = useUpdateUser();

  const handleStatusChange = async (userId: number, status: string) => {
    try {
      await updateUserMutation.mutateAsync({ id: userId, data: { status } });
      toast.success('상태가 변경되었습니다.');
    } catch {
      toast.error('상태 변경에 실패했습니다.');
    }
  };

  // ...
};
```

---

### 4.5 백엔드 타입 강화

#### 4.5.1 Request 타입 확장

```typescript
// types/express.d.ts
import { User } from './user';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

// types/request.ts
export interface PaginatedRequest {
  page?: string;
  limit?: string;
}

export interface SearchableRequest extends PaginatedRequest {
  search?: string;
}

export interface PostListRequest extends SearchableRequest {
  categoryId?: string;
  parentSection?: string;
}

export interface UserListRequest extends SearchableRequest {
  role?: string;
  status?: string;
  gradeId?: string;
}
```

#### 4.5.2 Response 타입 정의

```typescript
// types/response.ts
export interface ApiResponse<T = void> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 컨트롤러에서 사용
export const getUsers = async (
  req: Request<{}, {}, {}, UserListRequest>,
  res: Response<PaginatedApiResponse<User>>
) => {
  // ...
  res.json({
    success: true,
    data: users,
    pagination: { page, limit, total, totalPages },
  });
};
```

---

## 완료 체크리스트

### 4.1 API 응답 타입
- [ ] types/api.ts 생성 (기본 타입)
- [ ] types/api/auth.ts 생성
- [ ] types/api/posts.ts 생성
- [ ] types/api/admin.ts 생성
- [ ] services/api.ts에 타입 적용
- [ ] 빌드 성공

### 4.2 `any` 타입 제거
- [ ] useCRUD.ts 타입 개선
- [ ] useFormDialog.ts 타입 개선
- [ ] 기타 훅 타입 점검
- [ ] `any` 사용 0개 확인

### 4.3 도메인 타입 강화
- [ ] types/user.ts 개선
- [ ] types/post.ts 개선
- [ ] types/category.ts 개선
- [ ] types/comment.ts 개선

### 4.4 React Query 확대
- [ ] queryKeys.ts 생성
- [ ] useUsers.ts 생성
- [ ] usePosts.ts 생성
- [ ] useCategories.ts 생성
- [ ] 기존 컴포넌트에 적용

### 4.5 백엔드 타입 강화
- [ ] types/express.d.ts 생성
- [ ] types/request.ts 생성
- [ ] types/response.ts 생성
- [ ] 컨트롤러에 타입 적용

---

## 타입 검사 명령

```bash
# 프론트엔드 타입 검사
cd frontend
npx tsc --noEmit

# 백엔드 타입 검사
cd backend
npx tsc --noEmit

# strict 모드로 검사
npx tsc --noEmit --strict
```

## ESLint 규칙 추가

```json
// .eslintrc.json
{
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-unused-vars": "error"
  }
}
```
