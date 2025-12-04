# Phase 2: 핵심 구조 개선

**목표**: 아키텍처 개선 및 성능 최적화
**예상 기간**: 2-3주
**의존성**: Phase 1 완료

---

## 작업 목록

### 2.1 백엔드 서비스 레이어 도입

#### 2.1.1 기본 구조 생성

**디렉토리 구조**:
```
backend/src/
├── services/
│   ├── index.ts
│   ├── userService.ts
│   ├── postService.ts
│   ├── permissionService.ts
│   ├── categoryService.ts
│   └── commentService.ts
```

---

#### 2.1.2 UserService 생성

**파일**: `backend/src/services/userService.ts`

```typescript
import pool from '../config/database';
import bcrypt from 'bcrypt';

export interface UserCreateData {
  email: string;
  username: string;
  password?: string;
  fullName?: string;
  provider?: string;
  providerId?: string;
}

export interface UserUpdateData {
  username?: string;
  fullName?: string;
  bio?: string;
  avatarUrl?: string;
  gradeId?: number;
  role?: string;
  status?: string;
}

class UserService {
  private readonly SALT_ROUNDS = 10;

  async findById(id: number) {
    const result = await pool.query(
      `SELECT u.*, g.name as grade_name, g.level as grade_level
       FROM users u
       LEFT JOIN grades g ON u.grade_id = g.id
       WHERE u.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async findByEmail(email: string) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  }

  async findByUsername(username: string) {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    return result.rows[0] || null;
  }

  async create(data: UserCreateData) {
    const { email, username, password, fullName, provider, providerId } = data;

    const hashedPassword = password
      ? await bcrypt.hash(password, this.SALT_ROUNDS)
      : null;

    const result = await pool.query(
      `INSERT INTO users (email, username, password, full_name, provider, provider_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [email, username, hashedPassword, fullName, provider, providerId]
    );

    return result.rows[0];
  }

  async update(id: number, data: UserUpdateData) {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    const fieldMap: Record<string, string> = {
      username: 'username',
      fullName: 'full_name',
      bio: 'bio',
      avatarUrl: 'avatar_url',
      gradeId: 'grade_id',
      role: 'role',
      status: 'status',
    };

    for (const [key, dbField] of Object.entries(fieldMap)) {
      if (data[key as keyof UserUpdateData] !== undefined) {
        fields.push(`${dbField} = $${paramIndex}`);
        values.push(data[key as keyof UserUpdateData]);
        paramIndex++;
      }
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE users SET ${fields.join(', ')}, updated_at = NOW()
       WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );

    return result.rows[0];
  }

  async validateEmailUnique(email: string, excludeId?: number): Promise<boolean> {
    const query = excludeId
      ? 'SELECT id FROM users WHERE email = $1 AND id != $2'
      : 'SELECT id FROM users WHERE email = $1';
    const params = excludeId ? [email, excludeId] : [email];

    const result = await pool.query(query, params);
    return result.rows.length === 0;
  }

  async validateUsernameUnique(username: string, excludeId?: number): Promise<boolean> {
    const query = excludeId
      ? 'SELECT id FROM users WHERE username = $1 AND id != $2'
      : 'SELECT id FROM users WHERE username = $1';
    const params = excludeId ? [username, excludeId] : [username];

    const result = await pool.query(query, params);
    return result.rows.length === 0;
  }

  async verifyPassword(user: { password: string }, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  async getPaginatedUsers(
    page: number,
    limit: number,
    filters?: { search?: string; role?: string; status?: string }
  ) {
    const offset = (page - 1) * limit;
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (filters?.search) {
      conditions.push(
        `(u.username ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex} OR u.full_name ILIKE $${paramIndex})`
      );
      params.push(`%${filters.search}%`);
      paramIndex++;
    }

    if (filters?.role) {
      conditions.push(`u.role = $${paramIndex}`);
      params.push(filters.role);
      paramIndex++;
    }

    if (filters?.status) {
      conditions.push(`u.status = $${paramIndex}`);
      params.push(filters.status);
      paramIndex++;
    }

    const whereClause = conditions.length > 0
      ? `WHERE ${conditions.join(' AND ')}`
      : '';

    const [usersResult, countResult] = await Promise.all([
      pool.query(
        `SELECT u.*, g.name as grade_name
         FROM users u
         LEFT JOIN grades g ON u.grade_id = g.id
         ${whereClause}
         ORDER BY u.created_at DESC
         LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
        [...params, limit, offset]
      ),
      pool.query(
        `SELECT COUNT(*) FROM users u ${whereClause}`,
        params
      ),
    ]);

    return {
      users: usersResult.rows,
      total: parseInt(countResult.rows[0].count, 10),
    };
  }
}

export const userService = new UserService();
```

**적용 대상**:
- `authController.ts`: register, login, getMe
- `adminController.ts`: getUsers, updateUser
- `mypageController.ts`: getProfile, updateProfile

---

#### 2.1.3 PostService 생성

**파일**: `backend/src/services/postService.ts`

```typescript
import pool from '../config/database';

export interface PostFilters {
  categoryId?: number;
  parentSection?: string;
  search?: string;
  authorId?: number;
}

export interface PostCreateData {
  title: string;
  content: string;
  categoryId: number;
  authorId: number;
  isPinned?: boolean;
  isNotice?: boolean;
}

class PostService {
  private buildWhereClause(filters: PostFilters) {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (filters.categoryId) {
      conditions.push(`p.category_id = $${paramIndex}`);
      params.push(filters.categoryId);
      paramIndex++;
    }

    if (filters.parentSection) {
      conditions.push(`bc.parent_section = $${paramIndex}`);
      params.push(filters.parentSection);
      paramIndex++;
    }

    if (filters.search) {
      conditions.push(
        `(p.title ILIKE $${paramIndex} OR p.content ILIKE $${paramIndex})`
      );
      params.push(`%${filters.search}%`);
      paramIndex++;
    }

    if (filters.authorId) {
      conditions.push(`p.author_id = $${paramIndex}`);
      params.push(filters.authorId);
      paramIndex++;
    }

    return {
      whereClause: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
      params,
      nextParamIndex: paramIndex,
    };
  }

  async getPaginatedPosts(
    page: number,
    limit: number,
    filters: PostFilters = {}
  ) {
    const offset = (page - 1) * limit;
    const { whereClause, params, nextParamIndex } = this.buildWhereClause(filters);

    // 단일 쿼리로 posts, counts 모두 가져오기
    const query = `
      SELECT
        p.*,
        u.username as author_name,
        u.avatar_url as author_avatar,
        bc.name as category_name,
        bc.parent_section,
        COUNT(DISTINCT c.id) as comment_count,
        COUNT(DISTINCT l.id) as like_count
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN board_categories bc ON p.category_id = bc.id
      LEFT JOIN comments c ON p.id = c.post_id AND c.is_deleted = false
      LEFT JOIN likes l ON p.id = l.post_id
      ${whereClause}
      GROUP BY p.id, u.username, u.avatar_url, bc.name, bc.parent_section
      ORDER BY p.is_pinned DESC, p.created_at DESC
      LIMIT $${nextParamIndex} OFFSET $${nextParamIndex + 1}
    `;

    const countQuery = `
      SELECT COUNT(DISTINCT p.id)
      FROM posts p
      LEFT JOIN board_categories bc ON p.category_id = bc.id
      ${whereClause}
    `;

    const [postsResult, countResult] = await Promise.all([
      pool.query(query, [...params, limit, offset]),
      pool.query(countQuery, params),
    ]);

    return {
      posts: postsResult.rows,
      total: parseInt(countResult.rows[0].count, 10),
    };
  }

  async findById(id: number) {
    const result = await pool.query(
      `SELECT
        p.*,
        u.username as author_name,
        u.avatar_url as author_avatar,
        bc.name as category_name,
        bc.parent_section,
        COUNT(DISTINCT c.id) as comment_count,
        COUNT(DISTINCT l.id) as like_count
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN board_categories bc ON p.category_id = bc.id
      LEFT JOIN comments c ON p.id = c.post_id AND c.is_deleted = false
      LEFT JOIN likes l ON p.id = l.post_id
      WHERE p.id = $1
      GROUP BY p.id, u.username, u.avatar_url, bc.name, bc.parent_section`,
      [id]
    );
    return result.rows[0] || null;
  }

  async create(data: PostCreateData) {
    const result = await pool.query(
      `INSERT INTO posts (title, content, category_id, author_id, is_pinned, is_notice)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [data.title, data.content, data.categoryId, data.authorId, data.isPinned || false, data.isNotice || false]
    );
    return result.rows[0];
  }

  async update(id: number, data: Partial<PostCreateData>) {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    const fieldMap: Record<string, string> = {
      title: 'title',
      content: 'content',
      categoryId: 'category_id',
      isPinned: 'is_pinned',
      isNotice: 'is_notice',
    };

    for (const [key, dbField] of Object.entries(fieldMap)) {
      if (data[key as keyof PostCreateData] !== undefined) {
        fields.push(`${dbField} = $${paramIndex}`);
        values.push(data[key as keyof PostCreateData]);
        paramIndex++;
      }
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const result = await pool.query(
      `UPDATE posts SET ${fields.join(', ')}, updated_at = NOW()
       WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );

    return result.rows[0];
  }

  async deleteWithDependencies(id: number) {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // 댓글 삭제
      await client.query('DELETE FROM comments WHERE post_id = $1', [id]);

      // 좋아요 삭제
      await client.query('DELETE FROM likes WHERE post_id = $1', [id]);

      // 게시글 삭제
      await client.query('DELETE FROM posts WHERE id = $1', [id]);

      await client.query('COMMIT');
      return true;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async incrementViewCount(id: number) {
    await pool.query(
      'UPDATE posts SET view_count = view_count + 1 WHERE id = $1',
      [id]
    );
  }

  async toggleLike(postId: number, userId: number) {
    const existing = await pool.query(
      'SELECT id FROM likes WHERE post_id = $1 AND user_id = $2',
      [postId, userId]
    );

    if (existing.rows.length > 0) {
      await pool.query(
        'DELETE FROM likes WHERE post_id = $1 AND user_id = $2',
        [postId, userId]
      );
      return { liked: false };
    } else {
      await pool.query(
        'INSERT INTO likes (post_id, user_id) VALUES ($1, $2)',
        [postId, userId]
      );
      return { liked: true };
    }
  }
}

export const postService = new PostService();
```

---

#### 2.1.4 PermissionService 생성

**파일**: `backend/src/services/permissionService.ts`

```typescript
import pool from '../config/database';

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

class PermissionService {
  async getUserPermissions(userId: number, categoryId: number): Promise<UserPermissions> {
    // 사용자의 등급 정보 조회
    const userResult = await pool.query(
      `SELECT u.grade_id, u.role, g.level as grade_level
       FROM users u
       LEFT JOIN grades g ON u.grade_id = g.id
       WHERE u.id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return this.getDefaultPermissions();
    }

    const user = userResult.rows[0];

    // 관리자는 모든 권한
    if (user.role === 'admin') {
      return this.getAdminPermissions();
    }

    // 카테고리별 권한 조회
    const permResult = await pool.query(
      `SELECT gcp.*
       FROM grade_category_permissions gcp
       WHERE gcp.grade_id = $1 AND gcp.category_id = $2`,
      [user.grade_id, categoryId]
    );

    if (permResult.rows.length === 0) {
      // 기본 등급 권한 조회
      const defaultPermResult = await pool.query(
        `SELECT * FROM grade_permissions WHERE grade_id = $1`,
        [user.grade_id]
      );

      if (defaultPermResult.rows.length > 0) {
        return this.mapPermissions(defaultPermResult.rows[0]);
      }

      return this.getDefaultPermissions();
    }

    return this.mapPermissions(permResult.rows[0]);
  }

  async getWritableCategories(userId: number) {
    const userResult = await pool.query(
      `SELECT u.grade_id, u.role, g.level as grade_level
       FROM users u
       LEFT JOIN grades g ON u.grade_id = g.id
       WHERE u.id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return [];
    }

    const user = userResult.rows[0];

    // 관리자는 모든 카테고리
    if (user.role === 'admin') {
      const result = await pool.query('SELECT * FROM board_categories ORDER BY display_order');
      return result.rows;
    }

    // 등급별 쓰기 가능한 카테고리
    const result = await pool.query(
      `SELECT bc.*
       FROM board_categories bc
       JOIN grade_category_permissions gcp ON bc.id = gcp.category_id
       WHERE gcp.grade_id = $1 AND gcp.can_write = true
       ORDER BY bc.display_order`,
      [user.grade_id]
    );

    return result.rows;
  }

  async checkPermission(
    userId: number,
    categoryId: number,
    action: keyof UserPermissions
  ): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId, categoryId);
    return permissions[action];
  }

  private getDefaultPermissions(): UserPermissions {
    return {
      canRead: true,
      canWrite: false,
      canEdit: false,
      canDelete: false,
      canComment: false,
      canEditComment: false,
      canDeleteComment: false,
      canUpload: false,
    };
  }

  private getAdminPermissions(): UserPermissions {
    return {
      canRead: true,
      canWrite: true,
      canEdit: true,
      canDelete: true,
      canComment: true,
      canEditComment: true,
      canDeleteComment: true,
      canUpload: true,
    };
  }

  private mapPermissions(row: any): UserPermissions {
    return {
      canRead: row.can_read ?? true,
      canWrite: row.can_write ?? false,
      canEdit: row.can_edit ?? false,
      canDelete: row.can_delete ?? false,
      canComment: row.can_comment ?? false,
      canEditComment: row.can_edit_comment ?? false,
      canDeleteComment: row.can_delete_comment ?? false,
      canUpload: row.can_upload ?? false,
    };
  }
}

export const permissionService = new PermissionService();
```

---

### 2.2 N+1 쿼리 최적화

#### 2.2.1 motionBoxController 최적화

**파일**: `backend/src/controllers/motionBoxController.ts`

**현재 (N+1 문제)**:
```typescript
// 61+ 쿼리 발생
const boxes = await pool.query('SELECT * FROM motion_boxes');
for (const box of boxes.rows) {
  const elements = await pool.query(
    'SELECT * FROM motion_box_elements WHERE motion_box_id = $1',
    [box.id]
  );
  for (const element of elements.rows) {
    const keyframes = await pool.query(
      'SELECT * FROM motion_box_keyframes WHERE element_id = $1',
      [element.id]
    );
    element.keyframes = keyframes.rows;
  }
  box.elements = elements.rows;
}
```

**개선 (3 쿼리)**:
```typescript
export const getMotionBoxes = async (req: Request, res: Response) => {
  try {
    // 1. 모든 motion boxes
    const boxesResult = await pool.query(
      'SELECT * FROM motion_boxes ORDER BY display_order'
    );

    if (boxesResult.rows.length === 0) {
      return res.json({ motionBoxes: [] });
    }

    const boxIds = boxesResult.rows.map(b => b.id);

    // 2. 모든 elements (한 번에)
    const elementsResult = await pool.query(
      `SELECT * FROM motion_box_elements
       WHERE motion_box_id = ANY($1)
       ORDER BY display_order`,
      [boxIds]
    );

    const elementIds = elementsResult.rows.map(e => e.id);

    // 3. 모든 keyframes (한 번에)
    const keyframesResult = elementIds.length > 0
      ? await pool.query(
          `SELECT * FROM motion_box_keyframes
           WHERE element_id = ANY($1)
           ORDER BY time_percent`,
          [elementIds]
        )
      : { rows: [] };

    // 메모리에서 조합
    const keyframesByElement = new Map<number, any[]>();
    for (const kf of keyframesResult.rows) {
      if (!keyframesByElement.has(kf.element_id)) {
        keyframesByElement.set(kf.element_id, []);
      }
      keyframesByElement.get(kf.element_id)!.push(kf);
    }

    const elementsByBox = new Map<number, any[]>();
    for (const el of elementsResult.rows) {
      el.keyframes = keyframesByElement.get(el.id) || [];
      if (!elementsByBox.has(el.motion_box_id)) {
        elementsByBox.set(el.motion_box_id, []);
      }
      elementsByBox.get(el.motion_box_id)!.push(el);
    }

    const motionBoxes = boxesResult.rows.map(box => ({
      ...box,
      elements: elementsByBox.get(box.id) || [],
    }));

    res.json({ motionBoxes });
  } catch (error) {
    console.error('Error fetching motion boxes:', error);
    res.status(500).json({ error: '모션박스 목록 조회 중 오류가 발생했습니다' });
  }
};
```

---

### 2.3 프론트엔드 커스텀 훅 생성

#### 2.3.1 useAsyncData 훅

**파일**: `frontend/src/hooks/useAsyncData.ts`

```typescript
import { useEffect, useState, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';

interface UseAsyncDataOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  errorMessage?: string;
  enabled?: boolean;
}

interface UseAsyncDataResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useAsyncData<T>(
  asyncFn: () => Promise<T>,
  dependencies: any[] = [],
  options: UseAsyncDataOptions<T> = {}
): UseAsyncDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isMountedRef = useRef(true);
  const { enabled = true, errorMessage, onSuccess, onError } = options;

  const fetchData = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await asyncFn();
      if (isMountedRef.current) {
        setData(result);
        onSuccess?.(result);
      }
    } catch (err) {
      if (isMountedRef.current) {
        const error = err as Error;
        setError(error);
        if (errorMessage) {
          toast.error(errorMessage);
        }
        onError?.(error);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [asyncFn, enabled, errorMessage, onSuccess, onError]);

  useEffect(() => {
    isMountedRef.current = true;
    fetchData();

    return () => {
      isMountedRef.current = false;
    };
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
}
```

**사용 예시**:
```typescript
// Before (40줄)
const [categories, setCategories] = useState<Category[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  let isMounted = true;
  const fetchCategories = async () => {
    try {
      const response = await adminAPI.getCategories();
      if (isMounted) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      if (isMounted) {
        toast.error('카테고리 목록을 불러오는데 실패했습니다.');
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };
  fetchCategories();
  return () => { isMounted = false; };
}, []);

// After (5줄)
const { data: categories = [], loading, refetch } = useAsyncData(
  () => adminAPI.getCategories().then(r => r.data.categories),
  [],
  { errorMessage: '카테고리 목록을 불러오는데 실패했습니다.' }
);
```

---

#### 2.3.2 useTabbedManagement 훅

**파일**: `frontend/src/hooks/useTabbedManagement.ts`

```typescript
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

interface TabConfig {
  [tabName: string]: number;
}

export function useTabbedManagement(
  tabConfig: TabConfig,
  defaultTab: string = Object.keys(tabConfig)[0]
) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState(() => {
    const tab = searchParams.get('tab') || defaultTab;
    return tabConfig[tab] ?? 0;
  });

  useEffect(() => {
    const tab = searchParams.get('tab') || defaultTab;
    const tabIndex = tabConfig[tab];
    if (tabIndex !== undefined && tabIndex !== value) {
      setValue(tabIndex);
    }
  }, [searchParams, tabConfig, defaultTab, value]);

  const handleChange = useCallback(
    (_event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
      const tabName = Object.entries(tabConfig).find(
        ([, idx]) => idx === newValue
      )?.[0];
      if (tabName) {
        setSearchParams({ tab: tabName });
      }
    },
    [tabConfig, setSearchParams]
  );

  const setTab = useCallback(
    (tabName: string) => {
      const tabIndex = tabConfig[tabName];
      if (tabIndex !== undefined) {
        setValue(tabIndex);
        setSearchParams({ tab: tabName });
      }
    },
    [tabConfig, setSearchParams]
  );

  return { value, handleChange, setTab };
}
```

**사용 예시**:
```typescript
// Before
const [value, setValue] = useState(0);
const [searchParams, setSearchParams] = useSearchParams();

useEffect(() => {
  const tab = searchParams.get('tab');
  switch (tab) {
    case 'list': setValue(0); break;
    case 'grade': setValue(1); break;
    case 'statistics': setValue(2); break;
    default: setValue(0);
  }
}, [searchParams]);

const handleChange = (event: React.SyntheticEvent, newValue: number) => {
  setValue(newValue);
  const tabNames = ['list', 'grade', 'statistics'];
  setSearchParams({ tab: tabNames[newValue] });
};

// After
const tabConfig = { list: 0, grade: 1, statistics: 2 };
const { value, handleChange } = useTabbedManagement(tabConfig, 'list');
```

---

## 완료 체크리스트

### 2.1 서비스 레이어
- [ ] services 디렉토리 생성
- [ ] UserService 구현
- [ ] PostService 구현
- [ ] PermissionService 구현
- [ ] CategoryService 구현 (선택)
- [ ] CommentService 구현 (선택)
- [ ] authController에 UserService 적용
- [ ] postController에 PostService 적용
- [ ] adminController에 서비스들 적용

### 2.2 N+1 쿼리 최적화
- [ ] motionBoxController getMotionBoxes 최적화
- [ ] motionBoxController getMotionBoxById 최적화
- [ ] motionBoxController getActiveMotionBoxById 최적화
- [ ] postController 서브쿼리 → JOIN 변환
- [ ] 성능 테스트 (쿼리 수 비교)

### 2.3 프론트엔드 훅
- [ ] useAsyncData 구현
- [ ] useTabbedManagement 구현
- [ ] CategoryManagement에 useAsyncData 적용
- [ ] UserManagement에 useAsyncData 적용
- [ ] 탭 관리 컴포넌트에 useTabbedManagement 적용
- [ ] 빌드 성공
- [ ] 기능 테스트

---

## 테스트 계획

### 백엔드 테스트

1. **서비스 단위 테스트**
   - [ ] UserService.findById
   - [ ] UserService.create
   - [ ] PostService.getPaginatedPosts
   - [ ] PermissionService.getUserPermissions

2. **통합 테스트**
   - [ ] 회원가입 → 로그인 플로우
   - [ ] 게시글 CRUD
   - [ ] 권한 검사

3. **성능 테스트**
   - [ ] motionBox 목록 조회 (쿼리 수 확인)
   - [ ] 게시글 목록 조회 (응답 시간)

### 프론트엔드 테스트

1. **훅 테스트**
   - [ ] useAsyncData 로딩/에러/성공 상태
   - [ ] useTabbedManagement URL 동기화

2. **통합 테스트**
   - [ ] 카테고리 관리 페이지
   - [ ] 회원 관리 페이지
   - [ ] 탭 전환 및 URL 동기화
