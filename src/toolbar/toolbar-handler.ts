import debounce from "lodash.debounce";
import { assert, NextEditor, NextEditorCallbacks } from "@nexteditorjs/nexteditor-core";
import { Toolbar } from "./toolbar";
import { getReferenceClientRect } from "./get-reference-client-rect";
import { getSelectedBlocksCommands } from "./block-commands";

export default class NextEditorToolbarHandler implements NextEditorCallbacks {
  private toolbar: Toolbar;
  
  private mouseDown = false;

  constructor(private editor: NextEditor) {
    this.toolbar = new Toolbar(editor);
    this.bindEvents();
  }

  destroy() {
    this.unbindEvents();
  }

  bindEvents() {
    document.addEventListener('mousedown', this.handleMouseDown);
  }

  unbindEvents() {
    document.removeEventListener('mousedown', this.handleMouseDown)
  }

  handleMouseDown = (event: MouseEvent) => {
    if (event.button === 0) {
      document.addEventListener('mouseup', this.handleMouseUp);
      this.mouseDown = true;
    }
    this.toolbar.hide();
  }

  handleMouseUp = () => {
    document.removeEventListener('mouseup', this.handleMouseUp);
    this.mouseDown = false;
    this.handleSelectionChange(this.editor);
  }

  handleSelectionChange = debounce((editor: NextEditor) => {
    assert(editor === this.editor);
    //
    if (editor.selection.range.isCollapsed() || this.mouseDown) {
      this.toolbar.hide();
      return;
    }
    //
    const selectedBlocks = editor.selection.range.getSelectedBlocks();
    if (selectedBlocks.length === 0) {
      this.toolbar.hide();
      return;
    }
    //
    const items = getSelectedBlocksCommands(editor, selectedBlocks);
    this.toolbar.show(selectedBlocks[0].block, items, getReferenceClientRect(editor, selectedBlocks));
  }, 50);
}
