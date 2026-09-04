import {
  AuthResponse,
  LoginDto,
  RegisterDto,
  User,
  Board,
  CreateBoardDto,
  Column,
  CreateColumnDto,
  UpdateColumnDto,
  Task,
  CreateTaskDto,
  UpdateTaskDto,
  MoveTaskDto,
  AddMemberDto,
  BoardMember,
} from '../types';

/**
 * AUTH TOKEN STORAGE TRADE-OFF NOTICE:
 * For this client SPA application, the JWT access token is stored in localStorage
 * and synced with the Zustand auth store. While storing tokens in localStorage exposes them
 * to potential XSS vulnerabilities compared to httpOnly cookies, it provides clean cross-domain
 * API decoupling for frontend client deployment without requiring a proxy or cookie server setup.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005';

export class ApiError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('kanban_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kanban_token');
      localStorage.removeItem('kanban_user');
      // Redirect to home page if unauthorized and not already on home page
      if (window.location.pathname !== '/') {
        window.location.href = '/?auth=expired';
      }
    }
  }

  let data: any;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMessage =
      data?.message || (Array.isArray(data?.message) ? data.message.join(', ') : 'API Request Failed');
    throw new ApiError(response.status, errorMessage, data);
  }

  return data as T;
}

export const api = {
  auth: {
    login: (dto: LoginDto) => request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(dto) }),
    register: (dto: RegisterDto) =>
      request<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(dto) }),
    getProfile: () => request<User>('/auth/profile', { method: 'GET' }),
  },
  boards: {
    getAll: () => request<Board[]>('/boards', { method: 'GET' }),
    getById: (boardId: string) => request<Board>(`/boards/${boardId}`, { method: 'GET' }),
    create: (dto: CreateBoardDto) =>
      request<Board>('/boards', { method: 'POST', body: JSON.stringify(dto) }),
    addMember: (boardId: string, dto: AddMemberDto) =>
      request<BoardMember>(`/boards/${boardId}/members`, {
        method: 'POST',
        body: JSON.stringify(dto),
      }),
    createColumn: (boardId: string, dto: CreateColumnDto) =>
      request<Column>(`/boards/${boardId}/columns`, {
        method: 'POST',
        body: JSON.stringify(dto),
      }),
  },
  columns: {
    update: (columnId: string, dto: UpdateColumnDto) =>
      request<Column>(`/columns/${columnId}`, { method: 'PATCH', body: JSON.stringify(dto) }),
    delete: (columnId: string) => request<{ success: boolean }>(`/columns/${columnId}`, { method: 'DELETE' }),
    createTask: (columnId: string, dto: CreateTaskDto) =>
      request<Task>(`/columns/${columnId}/tasks`, { method: 'POST', body: JSON.stringify(dto) }),
  },
  tasks: {
    update: (taskId: string, dto: UpdateTaskDto) =>
      request<Task>(`/tasks/${taskId}`, { method: 'PATCH', body: JSON.stringify(dto) }),
    move: (taskId: string, dto: MoveTaskDto) =>
      request<Task>(`/tasks/${taskId}/move`, { method: 'PATCH', body: JSON.stringify(dto) }),
    delete: (taskId: string) => request<{ success: boolean }>(`/tasks/${taskId}`, { method: 'DELETE' }),
  },
};
