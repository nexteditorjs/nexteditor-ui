import { createEditorSelectionRange, getBlockClientRects, NextEditor, SelectedBlock } from '@nexteditorjs/nexteditor-core';

export function getReferenceClientRect(editor: NextEditor, selectedBlocks: SelectedBlock[]): DOMRect | undefined {
  if (selectedBlocks.length === 0) return undefined;
  //
  const firstSelectedBlock = selectedBlocks[0];
  const block = firstSelectedBlock.block;
  const range = createEditorSelectionRange(editor, firstSelectedBlock.start, firstSelectedBlock.end);
  const rects = getBlockClientRects(editor, block, range);
  if (rects.length === 0) {
    return undefined;
  }
  //
  return rects[0];
}
