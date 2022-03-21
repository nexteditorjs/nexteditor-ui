import debounce from 'lodash.debounce';
import { assert, CommandItem, NextEditor, NextEditorCallbacks, SelectionRange } from '@nexteditorjs/nexteditor-core';
import { Toolbar } from './toolbar';
import { getReferenceClientRect } from './get-reference-client-rect';
import { executeCommand } from './block-commands';
import { getStyleCommands } from './style-commands';

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
    this.resetItems();
  };

  bindEvents() {
    document.addEventListener('mousedown', this.handleMouseDown);
  }

  unbindEvents() {
    document.removeEventListener('mousedown', this.handleMouseDown);
  }

  handleMouseDown = (event: MouseEvent) => {
    if (event.button === 0) {
      document.addEventListener('mouseup', this.handleMouseUp);
      this.mouseDown = true;
    }
    // this.toolbar.hide();
  };

  handleMouseUp = () => {
    document.removeEventListener('mouseup', this.handleMouseUp);
    this.mouseDown = false;
    this.handleSelectionChange(this.editor);
  };

  handleSelectionChange = debounce((editor: NextEditor) => {
    assert(editor === this.editor);
    //
    if (editor.selection.range.isCollapsed() || this.mouseDown) {
      this.toolbar.hide();
      this.oldRange = null;
      return;
    }
    //
    const selectedBlocks = editor.selection.range.getSelectedBlocks();
    if (selectedBlocks.length === 0) {
      this.toolbar.hide();
      this.oldRange = null;
      return;
    }
    //
    if (this.oldRange) {
      if (this.oldRange.isEqual(editor.selection.range)) {
        return;
      }
    }
    this.oldRange = editor.selection.range;
    this.resetItems();
    //
  }, 50);

  private resetItems() {
    const selectedBlocks = this.editor.selection.range.getSelectedBlocks();
    if (selectedBlocks.length === 0) return;
    const firstBlock = selectedBlocks[0];
    if (!firstBlock) return;
    const commands = this.editor.editorCommandProviders.getCommands(this.editor.selection.range);
    const styleItems = getStyleCommands(commands);
    this.toolbar.show(firstBlock.block, styleItems, getReferenceClientRect(this.editor, selectedBlocks));
  }
}
