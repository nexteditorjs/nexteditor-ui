import { BlockCommandItem, CommandItem } from '@nexteditorjs/nexteditor-core';

export function getTableCommands(blockCommands: BlockCommandItem[]): CommandItem[] {
  const tableCommands = blockCommands.filter((command) => command.id.startsWith('table/'));
  if (tableCommands.length === 0) {
    return [];
  }
  //
  return tableCommands;
}
