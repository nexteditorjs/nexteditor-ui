import { CommandItem, NextEditor, SelectionRange } from '@nexteditorjs/nexteditor-core';

function executeStyleCommand(editor: NextEditor, range: SelectionRange, item: CommandItem) {
  const oldValue = item.value;
  const newValue = !oldValue;
  const params = { value: newValue };
  editor.editorCommandProviders.executeCommand(range, item.id, params);
}

export function executeCommand(editor: NextEditor, item: CommandItem) {
  if (item.id.startsWith('style-')) {
    executeStyleCommand(editor, editor.selection.range, item);
  } else {
    editor.editorCommandProviders.executeCommand(editor.selection.range, item.id, {});
  }
}
