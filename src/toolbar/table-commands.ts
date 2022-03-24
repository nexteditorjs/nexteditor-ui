import { BlockCommandItem, CommandItem } from '@nexteditorjs/nexteditor-core';
import { SplitCellIcon, MergeCellsIcon } from '../icons';

const iconsMap: { [index: string]: string } = {
  'table/merge-cells': MergeCellsIcon,
  'table/split-cell': SplitCellIcon,
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
