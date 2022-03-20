import { CommandItem, createEditorSelectionRange, executeBlockCommand, getBlockCommands, mergeCommands, NextEditor, SelectedBlock } from '@nexteditorjs/nexteditor-core';

export function getSelectedBlocksCommands(editor: NextEditor, selectedBlocks: SelectedBlock[]) {
  //
  const blockCommands: CommandItem[][] = [];
  //
  selectedBlocks.forEach((selectedBlock) => {
    const range = createEditorSelectionRange(editor, selectedBlock.start, selectedBlock.end);
    const commands = getBlockCommands(editor, selectedBlock.block, range);
    blockCommands.push(commands);
  });
  //
  return mergeCommands(blockCommands);
}

function executeStyleCommand(editor: NextEditor, item: CommandItem, selectedBlock: SelectedBlock) {
  //
  const oldValue = item.value;
  const newValue = !oldValue;
  const range = createEditorSelectionRange(editor, selectedBlock.start, selectedBlock.end);
  executeBlockCommand(editor, selectedBlock.block, range, item.id, { value: newValue });
}

export function executeCommand(editor: NextEditor, item: CommandItem) {
  //
  const blocks = editor.selection.range.getSelectedBlocks();
  if (item.id.startsWith('style-')) {
    blocks.forEach((b) => {
      executeStyleCommand(editor, item, b);
    });
  }
}
