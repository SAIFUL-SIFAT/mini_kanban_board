import { create } from 'zustand';
import { arrayMove } from '@dnd-kit/sortable';
import { Board, Column, Task } from '../types';

interface BoardState {
  currentBoard: Board | null;
  isLoading: boolean;
  error: string | null;
  previousBoardState: Board | null; // For rollback on drag-and-drop failure

  setBoard: (board: Board | null) => void;
  setColumns: (columns: Column[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  snapshotCurrentState: () => void;
  rollbackState: () => void;

  // Optimistic helpers
  addColumnOptimistic: (column: Column) => void;
  updateColumnOptimistic: (columnId: string, title: string) => void;
  deleteColumnOptimistic: (columnId: string) => void;

  addTaskOptimistic: (columnId: string, task: Task) => void;
  updateTaskOptimistic: (taskId: string, title: string, description?: string | null) => void;
  deleteTaskOptimistic: (taskId: string) => void;

  moveTaskOptimistic: (taskId: string, sourceColumnId: string, targetColumnId: string, newIndex: number) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  currentBoard: null,
  isLoading: false,
  error: null,
  previousBoardState: null,

  setBoard: (board) => set({ currentBoard: board, error: null }),
  setColumns: (columns) =>
    set((state) => ({
      currentBoard: state.currentBoard ? { ...state.currentBoard, columns } : null,
    })),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  snapshotCurrentState: () => {
    const current = get().currentBoard;
    if (current) {
      // Deep clone current board snapshot
      set({ previousBoardState: JSON.parse(JSON.stringify(current)) });
    }
  },

  rollbackState: () => {
    const prev = get().previousBoardState;
    if (prev) {
      set({ currentBoard: prev, previousBoardState: null });
    }
  },

  addColumnOptimistic: (column) => {
    const { currentBoard } = get();
    if (!currentBoard) return;
    const columns = [...(currentBoard.columns || []), column];
    set({ currentBoard: { ...currentBoard, columns } });
  },

  updateColumnOptimistic: (columnId, title) => {
    const { currentBoard } = get();
    if (!currentBoard || !currentBoard.columns) return;
    const columns = currentBoard.columns.map((col) => (col.id === columnId ? { ...col, title } : col));
    set({ currentBoard: { ...currentBoard, columns } });
  },

  deleteColumnOptimistic: (columnId) => {
    const { currentBoard } = get();
    if (!currentBoard || !currentBoard.columns) return;
    const columns = currentBoard.columns.filter((col) => col.id !== columnId);
    set({ currentBoard: { ...currentBoard, columns } });
  },

  addTaskOptimistic: (columnId, task) => {
    const { currentBoard } = get();
    if (!currentBoard || !currentBoard.columns) return;
    const columns = currentBoard.columns.map((col) => {
      if (col.id === columnId) {
        return { ...col, tasks: [...col.tasks, task] };
      }
      return col;
    });
    set({ currentBoard: { ...currentBoard, columns } });
  },

  updateTaskOptimistic: (taskId, title, description) => {
    const { currentBoard } = get();
    if (!currentBoard || !currentBoard.columns) return;
    const columns = currentBoard.columns.map((col) => ({
      ...col,
      tasks: col.tasks.map((t) => (t.id === taskId ? { ...t, title, description } : t)),
    }));
    set({ currentBoard: { ...currentBoard, columns } });
  },

  deleteTaskOptimistic: (taskId) => {
    const { currentBoard } = get();
    if (!currentBoard || !currentBoard.columns) return;
    const columns = currentBoard.columns.map((col) => ({
      ...col,
      tasks: col.tasks.filter((t) => t.id !== taskId),
    }));
    set({ currentBoard: { ...currentBoard, columns } });
  },

  moveTaskOptimistic: (taskId, sourceColumnId, targetColumnId, newIndex) => {
    const { currentBoard } = get();
    if (!currentBoard || !currentBoard.columns) return;

    // Find the task object
    let targetTask: Task | null = null;
    for (const col of currentBoard.columns) {
      const found = col.tasks.find((t) => t.id === taskId);
      if (found) {
        targetTask = { ...found, columnId: targetColumnId };
        break;
      }
    }
    if (!targetTask) return;

    const newColumns = currentBoard.columns.map((col) => {
      if (col.id === sourceColumnId && sourceColumnId === targetColumnId) {
        // Reordering within same column
        const oldIndex = col.tasks.findIndex((t) => t.id === taskId);
        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          return { ...col, tasks: arrayMove(col.tasks, oldIndex, newIndex) };
        }
        return col;
      } else if (col.id === sourceColumnId) {
        // Remove from source column
        return { ...col, tasks: col.tasks.filter((t) => t.id !== taskId) };
      } else if (col.id === targetColumnId) {
        // Insert into target column at newIndex
        const tasks = [...col.tasks.filter((t) => t.id !== taskId)];
        tasks.splice(newIndex, 0, targetTask!);
        return { ...col, tasks };
      }
      return col;
    });

    set({ currentBoard: { ...currentBoard, columns: newColumns } });
  },
}));
