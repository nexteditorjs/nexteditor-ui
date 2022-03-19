/* eslint-disable import/no-extraneous-dependencies */
import {
  assert,
  createEditor,
  createEmptyDoc,
  LocalDoc,
} from '@nexteditorjs/nexteditor-core';
import { MarkdownInputHandler } from '@nexteditorjs/nexteditor-input-handlers';

import './app.css';
import { NextEditorToolbarHandler } from './index';

const app = document.querySelector<HTMLDivElement>('#app');
assert(app, 'app does not exists');

const editor = createEditor(app, new LocalDoc(createEmptyDoc()));

editor.registerCallback(new NextEditorToolbarHandler(editor));

editor.input.addHandler(new MarkdownInputHandler());

(window as any).editor = editor;
