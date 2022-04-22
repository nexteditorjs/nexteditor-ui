import { BlockCommandItem, CommandItem } from '@nexteditorjs/nexteditor-core';
import { SplitCellIcon, MergeCellsIcon } from '../icons';

const DeleteIcon = '<span class="material-icons-outlined">delete</span>';

const iconsMap: { [index: string]: string } = {
  'table/merge-cells': MergeCellsIcon,
  'table/split-cell': SplitCellIcon,
  'table/delete-rows': DeleteIcon,
  'table/delete-columns': DeleteIcon,
  'table/delete': DeleteIcon,
};

export function getTableCommands(blockCommands: BlockCommandItem[]): CommandItem[] {
  const tableCommands = blockCommands.filter((command) => command.id.startsWith('table/'));
  if (tableCommands.length === 0) {
    return [];
  }
  //
  const result = tableCommands.map((item) => ({
    ...item,
    icon: iconsMap[item.id],
  }));
  //
  return result;
}
