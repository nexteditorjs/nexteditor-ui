import { assert, EditorSimpleSelectionRange, getBlockClientRects, isTextKindBlock, NextEditor, SelectedBlock, SimpleBlockPosition } from "@nexteditorjs/nexteditor-core";

export function getReferenceClientRect(editor: NextEditor, selectedBlocks: SelectedBlock[]): DOMRect | undefined {
  if (selectedBlocks.length === 0) return undefined;
  //
  const firstSelectedBlock = selectedBlocks[0];
  if (!isTextKindBlock(editor, firstSelectedBlock.block)) {
    return undefined;
  }
  //
  const textBlock = firstSelectedBlock.block;
  assert(firstSelectedBlock.start.isSimple(), 'invalid pos');
  assert(firstSelectedBlock.end.isSimple(), 'invalid pos');
  const range = new EditorSimpleSelectionRange(editor, firstSelectedBlock.start as SimpleBlockPosition, firstSelectedBlock.end as SimpleBlockPosition);
  const rects = getBlockClientRects(editor, textBlock, range);
  if (rects.length === 0) {
    return undefined;
  }
  //
  return rects[0];
}
