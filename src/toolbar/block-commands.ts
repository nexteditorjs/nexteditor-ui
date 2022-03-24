import { CommandItem, NextEditor, SelectionRange } from '@nexteditorjs/nexteditor-core';

function executeTextStyleCommand(editor: NextEditor, range: SelectionRange, item: CommandItem) {
  const oldValue = item.value;
  const newValue = !oldValue;
  const params = { value: newValue };
  editor.editorCommandProviders.executeCommand(range, item.id, params);
}

export function executeCommand(editor: NextEditor, item: CommandItem) {
  if (item.id.startsWith('text/style-')) {
    executeTextStyleCommand(editor, editor.selection.range, item);
  } else {
    editor.editorCommandProviders.executeCommand(editor.selection.range, item.id, {});
  }
}
