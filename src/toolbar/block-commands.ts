import { CommandItem, createEditorSelectionRange, getBlockCommands, NextEditor, SelectedBlock } from "@nexteditorjs/nexteditor-core";
import intersection from 'lodash.intersection';

export function getSelectedBlocksCommands(editor: NextEditor, selectedBlocks: SelectedBlock[]) {
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
      commands.splice(index, 1);
      return;
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
    exists.states = intersection(exists.states, item.states );
  }
  //
  const allCommands: CommandItem[] = [];
  //
  selectedBlocks.forEach((selectedBlock) => {
    const commands = getBlockCommands(editor, selectedBlock.block, createEditorSelectionRange(editor, selectedBlock.start, selectedBlock.end));
    commands.forEach((command) => {
      addCommand(allCommands, command);
    })
  });
  //
  return allCommands;
}