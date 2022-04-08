import debounce from 'lodash.debounce';
import { assert, CommandItem, NextEditor, SelectionRange } from '@nexteditorjs/nexteditor-core';
import { Toolbar } from './toolbar';
import { getReferenceClientRect } from './get-reference-client-rect';
import { executeCommand } from './block-commands';
import { getTextCommands } from './text-commands';
import { getTableCommands } from './table-commands';

const SEP: CommandItem = {
  id: '',
  name: '',
  type: 'separator',
};

export default class NextEditorToolbarHandler {
  private toolbar: Toolbar;

  private mouseDown = false;

  private oldRange: SelectionRange | null = null;

  constructor(private editor: NextEditor) {
    this.toolbar = new Toolbar(editor);
    this.toolbar.onclick = this.handleButtonClick;
    this.bindEvents();
    editor.addListener('selectionChanged', this.handleSelectionChange);
  }

  destroy() {
    this.unbindEvents();
    this.toolbar.destroy();
    this.editor.removeListener('selectionChanged', this.handleSelectionChange);
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
    const styleItems = getTextCommands(commands);
    const tableItems = getTableCommands(commands);
    const toolbarCommands: CommandItem[] = [];
    if (tableItems.length > 0) {
      toolbarCommands.push(...tableItems);
    }
    if (styleItems) {
      if (toolbarCommands.length > 0) {
        toolbarCommands.push(SEP);
      }
      toolbarCommands.push(...styleItems);
    }
    if (toolbarCommands.length === 0) {
      this.toolbar.hide();
      return;
    }
    //
    this.toolbar.show(firstBlock.block, toolbarCommands, getReferenceClientRect(this.editor, selectedBlocks));
  }
}
