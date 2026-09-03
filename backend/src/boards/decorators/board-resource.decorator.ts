import { SetMetadata } from '@nestjs/common';

export type ResourceKind = 'board' | 'column' | 'task';
export type MinRole = 'MEMBER' | 'OWNER';

export interface BoardResourceOptions {
  kind: ResourceKind;
  paramName: string;
  minRole?: MinRole; // Defaults to 'MEMBER'
}

export const BOARD_RESOURCE_KEY = 'boardResource';
export const BoardResource = (options: BoardResourceOptions) => SetMetadata(BOARD_RESOURCE_KEY, options);
