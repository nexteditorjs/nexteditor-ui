import { BlockCommandItem, CommandItem } from '@nexteditorjs/nexteditor-core';
import intersection from 'lodash.intersection';

const TextCommands = {
  'style-bold': 'bold',
  'style-italic': 'italic',
  'style-underline': 'underline',
  'style-line-through': 'line-through',
  'style-code': 'code',
};

function mergeStyleCommands(blockCommands: CommandItem[]) {
  //
  const addCommand = (commands: CommandItem[], item: CommandItem) => {
    //
    const index = commands.findIndex((c) => c.id === item.id);
    if (index === -1) {
      commands.push(item);
      return;
    }
    //
    const exists = commands[index];
    if (exists.value !== item.value) {
      delete exists.value;
    }
    //
    if (!exists.states) {
      return;
    }
    if (!item.states) {
      exists.states = [];
      return;
    }
    //
    exists.states = intersection(exists.states, item.states);
  };
  //
  const allCommands: CommandItem[] = [];
  blockCommands.forEach((command) => {
    addCommand(allCommands, command);
  });
  return allCommands;
}

export function getStyleCommands(blockCommands: BlockCommandItem[]): CommandItem[] {
  //
  const styleCommandsSet = new Set(Object.keys(TextCommands));
  const styleCommands = blockCommands.filter((command) => styleCommandsSet.has(command.id));
  return mergeStyleCommands(styleCommands);
}
