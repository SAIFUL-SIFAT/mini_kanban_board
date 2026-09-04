export interface User {
  id: string;
  email: string;
  name: string;
}

export type BoardMemberRole = 'OWNER' | 'MEMBER';

export interface BoardMember {
  id: string;
  role: BoardMemberRole;
  userId: string;
  boardId: string;
  user?: User;
}

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  order: number;
  columnId: string;
  createdAt: string;
  updatedAt: string;
  // Optional priority parsed from description or metadata
  priority?: TaskPriority;
  assignee?: User | null;
}

export interface Column {
  id: string;
  title: string;
  order: number;
  boardId: string;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}

export interface Board {
  id: string;
  title: string;
  description?: string | null;
  columns?: Column[];
  members?: BoardMember[];
  ownerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface CreateBoardDto {
  title: string;
  description?: string;
}

export interface CreateColumnDto {
  title: string;
}

export interface UpdateColumnDto {
  title: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
}

export interface MoveTaskDto {
  targetColumnId: string;
  beforeTaskId?: string;
  afterTaskId?: string;
}

export interface AddMemberDto {
  email: string;
  role?: BoardMemberRole;
}
