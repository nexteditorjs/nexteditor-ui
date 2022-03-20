import { assert, createEditorSelectionRange, EditorSimpleSelectionRange, getBlockClientRects, isTextKindBlock, NextEditor, SelectedBlock, SimpleBlockPosition } from '@nexteditorjs/nexteditor-core';

export function getReferenceClientRect(editor: NextEditor, selectedBlocks: SelectedBlock[]): DOMRect | undefined {
  if (selectedBlocks.length === 0) return undefined;
  //
  const firstSelectedBlock = selectedBlocks[0];
  const block = firstSelectedBlock.block;
  // assert(firstSelectedBlock.start.isSimple(), 'invalid pos');
  // assert(firstSelectedBlock.end.isSimple(), 'invalid pos');
  const range = createEditorSelectionRange(editor, firstSelectedBlock.start, firstSelectedBlock.end);
  const rects = getBlockClientRects(editor, block, range);
  if (rects.length === 0) {
    return undefined;
  }
  //
  return rects[0];
}
