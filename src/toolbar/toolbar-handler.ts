import debounce from "lodash.debounce";
import { assert, CommandItem, NextEditor, NextEditorCallbacks, SelectionRange } from "@nexteditorjs/nexteditor-core";
import { Toolbar } from "./toolbar";
import { getReferenceClientRect } from "./get-reference-client-rect";
import { executeCommand, getSelectedBlocksCommands } from "./block-commands";

export default class NextEditorToolbarHandler implements NextEditorCallbacks {
  private toolbar: Toolbar;
  
  private mouseDown = false;

  private oldRange: SelectionRange | null = null;

  constructor(private editor: NextEditor) {
    this.toolbar = new Toolbar(editor);
    this.toolbar.onclick = this.handleButtonClick;
    this.bindEvents();
  }

  destroy() {
    this.unbindEvents();
    this.toolbar.destroy();
  }

  handleButtonClick = (toolbar: Toolbar, item: CommandItem) => {
    executeCommand(this.editor, item);
  };

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
    // this.toolbar.hide();
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
    if (this.oldRange) {
      if (this.oldRange.isEqual(editor.selection.range)) {
        return;
      }
    }
    this.oldRange = editor.selection.range;
    //
    const items = getSelectedBlocksCommands(editor, selectedBlocks);
    this.toolbar.show(selectedBlocks[0].block, items, getReferenceClientRect(editor, selectedBlocks));
  }, 50);
}
