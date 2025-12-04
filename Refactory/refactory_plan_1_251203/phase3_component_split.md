# Phase 3: 컴포넌트 분할

**목표**: 대형 컴포넌트 분리 및 모듈화
**예상 기간**: 2주
**의존성**: Phase 2 완료

---

## 작업 목록

### 3.1 프론트엔드: UserManagement 분할

**현재 상태**: `components/admin/UserManagement.tsx` (500+ 줄)
**문제점**: 사용자 목록, 필터, 편집, 프로필 관리가 모두 한 파일에

#### 분할 구조

```
components/admin/
├── UserManagement.tsx (컨테이너 - 50줄)
└── user-management/
    ├── index.ts (exports)
    ├── UserList.tsx (목록 테이블 - 150줄)
    ├── UserListFilters.tsx (검색/필터 - 80줄)
    ├── UserListRow.tsx (테이블 행 - 60줄)
    ├── UserEditDialog.tsx (편집 다이얼로그 - 100줄)
    ├── UserProfileEditor.tsx (프로필 편집 - 80줄)
    └── types.ts (타입 정의 - 30줄)
```

#### 3.1.1 types.ts

```typescript
// components/admin/user-management/types.ts
export interface UserListFilters {
  search: string;
  role: string;
  status: string;
  gradeId: number | null;
}

export interface UserFormData {
  username: string;
  email: string;
  fullName: string;
  role: string;
  status: string;
  gradeId: number | null;
}

export interface UserListProps {
  users: User[];
  loading: boolean;
  onEdit: (user: User) => void;
  onDelete: (userId: number) => void;
  onStatusChange: (userId: number, status: string) => void;
}

export interface UserListFiltersProps {
  filters: UserListFilters;
  grades: Grade[];
  onFilterChange: (filters: UserListFilters) => void;
  onReset: () => void;
}

export interface UserEditDialogProps {
  open: boolean;
  user: User | null;
  grades: Grade[];
  onClose: () => void;
  onSave: (data: UserFormData) => Promise<void>;
}
```

#### 3.1.2 UserListFilters.tsx

```typescript
// components/admin/user-management/UserListFilters.tsx
import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { UserListFiltersProps } from './types';

export const UserListFilters: React.FC<UserListFiltersProps> = ({
  filters,
  grades,
  onFilterChange,
  onReset,
}) => {
  const handleChange = (field: keyof typeof filters, value: any) => {
    onFilterChange({ ...filters, [field]: value });
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
      <TextField
        size="small"
        placeholder="이름, 이메일, 아이디 검색"
        value={filters.search}
        onChange={(e) => handleChange('search', e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ minWidth: 250 }}
      />

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>역할</InputLabel>
        <Select
          value={filters.role}
          label="역할"
          onChange={(e) => handleChange('role', e.target.value)}
        >
          <MenuItem value="">전체</MenuItem>
          <MenuItem value="admin">관리자</MenuItem>
          <MenuItem value="member">회원</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>상태</InputLabel>
        <Select
          value={filters.status}
          label="상태"
          onChange={(e) => handleChange('status', e.target.value)}
        >
          <MenuItem value="">전체</MenuItem>
          <MenuItem value="active">활성</MenuItem>
          <MenuItem value="inactive">비활성</MenuItem>
          <MenuItem value="suspended">정지</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel>등급</InputLabel>
        <Select
          value={filters.gradeId || ''}
          label="등급"
          onChange={(e) => handleChange('gradeId', e.target.value || null)}
        >
          <MenuItem value="">전체</MenuItem>
          {grades.map((grade) => (
            <MenuItem key={grade.id} value={grade.id}>
              {grade.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button variant="outlined" onClick={onReset}>
        초기화
      </Button>
    </Box>
  );
};
```

#### 3.1.3 UserListRow.tsx

```typescript
// components/admin/user-management/UserListRow.tsx
import React from 'react';
import {
  TableRow,
  TableCell,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { User } from '../../../types';

interface UserListRowProps {
  user: User;
  onEdit: (user: User) => void;
  onStatusChange: (userId: number, status: string) => void;
}

export const UserListRow: React.FC<UserListRowProps> = React.memo(
  ({ user, onEdit, onStatusChange }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case 'active':
          return 'success';
        case 'inactive':
          return 'default';
        case 'suspended':
          return 'error';
        default:
          return 'default';
      }
    };

    const getRoleLabel = (role: string) => {
      return role === 'admin' ? '관리자' : '회원';
    };

    return (
      <TableRow hover>
        <TableCell>
          <Avatar src={user.avatarUrl} alt={user.username}>
            {user.username?.[0]?.toUpperCase()}
          </Avatar>
        </TableCell>
        <TableCell>{user.username}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>{user.fullName || '-'}</TableCell>
        <TableCell>
          <Chip
            label={getRoleLabel(user.role)}
            color={user.role === 'admin' ? 'primary' : 'default'}
            size="small"
          />
        </TableCell>
        <TableCell>
          <Chip
            label={user.gradeName || '등급 없음'}
            variant="outlined"
            size="small"
          />
        </TableCell>
        <TableCell>
          <Chip
            label={user.status}
            color={getStatusColor(user.status)}
            size="small"
          />
        </TableCell>
        <TableCell>
          {new Date(user.createdAt).toLocaleDateString('ko-KR')}
        </TableCell>
        <TableCell>
          <Tooltip title="편집">
            <IconButton size="small" onClick={() => onEdit(user)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          {user.status === 'active' ? (
            <Tooltip title="정지">
              <IconButton
                size="small"
                color="error"
                onClick={() => onStatusChange(user.id, 'suspended')}
              >
                <BlockIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="활성화">
              <IconButton
                size="small"
                color="success"
                onClick={() => onStatusChange(user.id, 'active')}
              >
                <CheckCircleIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </TableCell>
      </TableRow>
    );
  }
);

UserListRow.displayName = 'UserListRow';
```

#### 3.1.4 UserList.tsx

```typescript
// components/admin/user-management/UserList.tsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Typography,
} from '@mui/material';
import { UserListRow } from './UserListRow';
import { UserListProps } from './types';

export const UserList: React.FC<UserListProps> = ({
  users,
  loading,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (users.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="text.secondary">
          검색 결과가 없습니다.
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width={60}>프로필</TableCell>
            <TableCell>아이디</TableCell>
            <TableCell>이메일</TableCell>
            <TableCell>이름</TableCell>
            <TableCell width={80}>역할</TableCell>
            <TableCell width={100}>등급</TableCell>
            <TableCell width={80}>상태</TableCell>
            <TableCell width={100}>가입일</TableCell>
            <TableCell width={100}>관리</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <UserListRow
              key={user.id}
              user={user}
              onEdit={onEdit}
              onStatusChange={onStatusChange}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
```

#### 3.1.5 UserEditDialog.tsx

```typescript
// components/admin/user-management/UserEditDialog.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import { UserEditDialogProps, UserFormData } from './types';

const initialFormData: UserFormData = {
  username: '',
  email: '',
  fullName: '',
  role: 'member',
  status: 'active',
  gradeId: null,
};

export const UserEditDialog: React.FC<UserEditDialogProps> = ({
  open,
  user,
  grades,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        fullName: user.fullName || '',
        role: user.role,
        status: user.status,
        gradeId: user.gradeId,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [user]);

  const handleChange = (field: keyof UserFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{user ? '회원 정보 수정' : '회원 추가'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="아이디"
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              disabled={!!user}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="이메일"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="이름"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>역할</InputLabel>
              <Select
                value={formData.role}
                label="역할"
                onChange={(e) => handleChange('role', e.target.value)}
              >
                <MenuItem value="member">회원</MenuItem>
                <MenuItem value="admin">관리자</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>상태</InputLabel>
              <Select
                value={formData.status}
                label="상태"
                onChange={(e) => handleChange('status', e.target.value)}
              >
                <MenuItem value="active">활성</MenuItem>
                <MenuItem value="inactive">비활성</MenuItem>
                <MenuItem value="suspended">정지</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>등급</InputLabel>
              <Select
                value={formData.gradeId || ''}
                label="등급"
                onChange={(e) =>
                  handleChange('gradeId', e.target.value || null)
                }
              >
                <MenuItem value="">등급 없음</MenuItem>
                {grades.map((grade) => (
                  <MenuItem key={grade.id} value={grade.id}>
                    {grade.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? '저장 중...' : '저장'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
```

#### 3.1.6 UserManagement.tsx (컨테이너)

```typescript
// components/admin/UserManagement.tsx
import React, { useState, useCallback } from 'react';
import { Box, Typography, Pagination } from '@mui/material';
import { toast } from 'react-toastify';
import { useAsyncData } from '../../hooks/useAsyncData';
import { adminAPI } from '../../services/api';
import {
  UserList,
  UserListFilters,
  UserEditDialog,
  UserListFilters as FilterType,
} from './user-management';
import { User, Grade } from '../../types';

const initialFilters: FilterType = {
  search: '',
  role: '',
  status: '',
  gradeId: null,
};

export const UserManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterType>(initialFilters);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: gradesData } = useAsyncData(
    () => adminAPI.getGrades().then((r) => r.data.grades),
    [],
    { errorMessage: '등급 목록을 불러오는데 실패했습니다.' }
  );

  const {
    data: usersData,
    loading,
    refetch,
  } = useAsyncData(
    () =>
      adminAPI
        .getUsers({ page, limit: 20, ...filters })
        .then((r) => r.data),
    [page, filters],
    { errorMessage: '회원 목록을 불러오는데 실패했습니다.' }
  );

  const handleEdit = useCallback((user: User) => {
    setEditingUser(user);
    setDialogOpen(true);
  }, []);

  const handleStatusChange = useCallback(
    async (userId: number, status: string) => {
      try {
        await adminAPI.updateUserStatus(userId, status);
        toast.success('상태가 변경되었습니다.');
        refetch();
      } catch {
        toast.error('상태 변경에 실패했습니다.');
      }
    },
    [refetch]
  );

  const handleSave = useCallback(
    async (formData: any) => {
      if (!editingUser) return;
      await adminAPI.updateUser(editingUser.id, formData);
      toast.success('회원 정보가 수정되었습니다.');
      refetch();
    },
    [editingUser, refetch]
  );

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setEditingUser(null);
  }, []);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        회원 관리
      </Typography>

      <UserListFilters
        filters={filters}
        grades={gradesData || []}
        onFilterChange={setFilters}
        onReset={() => setFilters(initialFilters)}
      />

      <UserList
        users={usersData?.users || []}
        loading={loading}
        onEdit={handleEdit}
        onDelete={() => {}}
        onStatusChange={handleStatusChange}
      />

      {usersData && usersData.pagination.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={usersData.pagination.totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
          />
        </Box>
      )}

      <UserEditDialog
        open={dialogOpen}
        user={editingUser}
        grades={gradesData || []}
        onClose={handleCloseDialog}
        onSave={handleSave}
      />
    </Box>
  );
};
```

---

### 3.2 프론트엔드: PostDetailPage 분할

**현재 상태**: `pages/PostDetailPage.tsx` (400+ 줄)

#### 분할 구조

```
pages/
├── PostDetailPage.tsx (컨테이너 - 60줄)
└── post-detail/
    ├── index.ts
    ├── PostHeader.tsx (제목, 작성자 정보 - 50줄)
    ├── PostContent.tsx (본문 - 40줄)
    ├── PostActions.tsx (좋아요, 공유, 수정/삭제 - 80줄)
    ├── PostComments.tsx (댓글 목록 - 100줄)
    ├── CommentForm.tsx (댓글 작성 폼 - 60줄)
    ├── CommentItem.tsx (개별 댓글 - 80줄)
    └── PostNavigation.tsx (이전/다음 글 - 50줄)
```

---

### 3.3 백엔드: adminController 분할

**현재 상태**: `controllers/adminController.ts` (1,030 줄)

#### 분할 구조

```
controllers/admin/
├── index.ts (통합 export)
├── userAdminController.ts (회원 관리 - 200줄)
├── categoryAdminController.ts (카테고리 관리 - 180줄)
├── postAdminController.ts (게시글 관리 - 150줄)
├── commentAdminController.ts (댓글 관리 - 100줄)
├── gradeAdminController.ts (등급 관리 - 150줄)
└── statisticsController.ts (통계 - 100줄)
```

#### 3.3.1 userAdminController.ts

```typescript
// controllers/admin/userAdminController.ts
import { Request, Response } from 'express';
import { userService } from '../../services/userService';
import { getPaginationParams, paginationResponse } from '../../utils/pagination';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { page, limit } = getPaginationParams(req.query);
    const { search, role, status } = req.query;

    const { users, total } = await userService.getPaginatedUsers(
      page,
      limit,
      {
        search: search as string,
        role: role as string,
        status: status as string,
      }
    );

    res.json({
      users,
      pagination: paginationResponse(page, limit, total),
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: '회원 목록 조회 중 오류가 발생했습니다' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // 이메일 중복 검사
    if (updateData.email) {
      const isUnique = await userService.validateEmailUnique(
        updateData.email,
        parseInt(id, 10)
      );
      if (!isUnique) {
        return res.status(400).json({ error: '이미 사용 중인 이메일입니다' });
      }
    }

    // 아이디 중복 검사
    if (updateData.username) {
      const isUnique = await userService.validateUsernameUnique(
        updateData.username,
        parseInt(id, 10)
      );
      if (!isUnique) {
        return res.status(400).json({ error: '이미 사용 중인 아이디입니다' });
      }
    }

    const user = await userService.update(parseInt(id, 10), updateData);

    if (!user) {
      return res.status(404).json({ error: '회원을 찾을 수 없습니다' });
    }

    res.json({ user, message: '회원 정보가 수정되었습니다' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: '회원 정보 수정 중 오류가 발생했습니다' });
  }
};

export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const user = await userService.update(parseInt(id, 10), { status });

    if (!user) {
      return res.status(404).json({ error: '회원을 찾을 수 없습니다' });
    }

    res.json({ user, message: '회원 상태가 변경되었습니다' });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ error: '회원 상태 변경 중 오류가 발생했습니다' });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await userService.update(parseInt(id, 10), { role });

    if (!user) {
      return res.status(404).json({ error: '회원을 찾을 수 없습니다' });
    }

    res.json({ user, message: '회원 역할이 변경되었습니다' });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: '회원 역할 변경 중 오류가 발생했습니다' });
  }
};
```

#### 3.3.2 라우트 업데이트

```typescript
// routes/adminRoutes.ts
import { Router } from 'express';
import { authenticate, isAdmin } from '../middleware/auth';
import * as userAdmin from '../controllers/admin/userAdminController';
import * as categoryAdmin from '../controllers/admin/categoryAdminController';
import * as postAdmin from '../controllers/admin/postAdminController';
import * as commentAdmin from '../controllers/admin/commentAdminController';
import * as gradeAdmin from '../controllers/admin/gradeAdminController';
import * as statistics from '../controllers/admin/statisticsController';

const router = Router();

// 모든 관리자 라우트에 인증 적용
router.use(authenticate, isAdmin);

// 회원 관리
router.get('/users', userAdmin.getUsers);
router.put('/users/:id', userAdmin.updateUser);
router.put('/users/:id/status', userAdmin.updateUserStatus);
router.put('/users/:id/role', userAdmin.updateUserRole);

// 카테고리 관리
router.get('/categories', categoryAdmin.getCategories);
router.post('/categories', categoryAdmin.createCategory);
router.put('/categories/:id', categoryAdmin.updateCategory);
router.delete('/categories/:id', categoryAdmin.deleteCategory);

// 게시글 관리
router.get('/posts', postAdmin.getPosts);
router.delete('/posts/:id', postAdmin.deletePost);

// 댓글 관리
router.get('/comments', commentAdmin.getComments);
router.delete('/comments/:id', commentAdmin.deleteComment);

// 등급 관리
router.get('/grades', gradeAdmin.getGrades);
router.post('/grades', gradeAdmin.createGrade);
router.put('/grades/:id', gradeAdmin.updateGrade);
router.delete('/grades/:id', gradeAdmin.deleteGrade);

// 통계
router.get('/statistics', statistics.getStatistics);
router.get('/statistics/board', statistics.getBoardStatistics);

export default router;
```

---

## 완료 체크리스트

### 3.1 UserManagement 분할
- [ ] user-management 디렉토리 생성
- [ ] types.ts 생성
- [ ] UserListFilters.tsx 생성
- [ ] UserListRow.tsx 생성
- [ ] UserList.tsx 생성
- [ ] UserEditDialog.tsx 생성
- [ ] UserManagement.tsx 리팩토링
- [ ] index.ts (exports) 생성
- [ ] 빌드 성공
- [ ] 기능 테스트

### 3.2 PostDetailPage 분할
- [ ] post-detail 디렉토리 생성
- [ ] PostHeader.tsx 생성
- [ ] PostContent.tsx 생성
- [ ] PostActions.tsx 생성
- [ ] PostComments.tsx 생성
- [ ] CommentForm.tsx 생성
- [ ] CommentItem.tsx 생성
- [ ] PostNavigation.tsx 생성
- [ ] PostDetailPage.tsx 리팩토링
- [ ] 빌드 성공
- [ ] 기능 테스트

### 3.3 adminController 분할
- [ ] controllers/admin 디렉토리 생성
- [ ] userAdminController.ts 생성
- [ ] categoryAdminController.ts 생성
- [ ] postAdminController.ts 생성
- [ ] commentAdminController.ts 생성
- [ ] gradeAdminController.ts 생성
- [ ] statisticsController.ts 생성
- [ ] index.ts 생성
- [ ] adminRoutes.ts 업데이트
- [ ] 빌드 성공
- [ ] API 테스트

---

## 테스트 계획

### 프론트엔드

1. **UserManagement 테스트**
   - [ ] 회원 목록 로딩
   - [ ] 필터 적용
   - [ ] 검색 기능
   - [ ] 회원 편집
   - [ ] 상태 변경
   - [ ] 페이지네이션

2. **PostDetailPage 테스트**
   - [ ] 게시글 로딩
   - [ ] 댓글 목록
   - [ ] 댓글 작성
   - [ ] 좋아요 토글
   - [ ] 이전/다음 글 이동

### 백엔드

1. **분할된 컨트롤러 테스트**
   - [ ] GET /api/admin/users
   - [ ] PUT /api/admin/users/:id
   - [ ] GET /api/admin/categories
   - [ ] POST /api/admin/categories
   - [ ] GET /api/admin/statistics
