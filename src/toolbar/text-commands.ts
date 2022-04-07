import { BlockCommandItem, CommandItem } from '@nexteditorjs/nexteditor-core';
import intersection from 'lodash.intersection';

const TextCommands = {
  'text/style-bold': 'bold',
  'text/style-italic': 'italic',
  'text/style-underline': 'underline',
  'text/style-line-through': 'line-through',
  'text/style-code': 'code',
};

const IconNames: { [index: string]: string } = {
  'text/style-bold': 'format_bold',
  'text/style-italic': 'format_italic',
  'text/style-underline': 'format_underline',
  'text/style-line-through': 'format_strikethrough',
  'text/style-code': 'code',
};

function mergeTextStyleCommands(blockCommands: CommandItem[]) {
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

export function getTextCommands(blockCommands: BlockCommandItem[]): CommandItem[] {
  //
  const styleCommandsSet = new Set(Object.keys(TextCommands));
  const styleCommands = blockCommands.filter((command) => styleCommandsSet.has(command.id));
  return mergeTextStyleCommands(styleCommands).map((item) => ({
    ...item,
    icon: `<span class="material-icons-outlined">${IconNames[item.id]}</span>`,
  }));
}
