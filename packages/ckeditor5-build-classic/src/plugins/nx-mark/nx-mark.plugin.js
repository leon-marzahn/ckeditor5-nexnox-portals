import { Plugin } from '@ckeditor/ckeditor5-core';
import { Widget } from '@ckeditor/ckeditor5-widget';

import NxMarkEditing from './nx-mark.editing';

export default class NxMarkPlugin extends Plugin {
  static get pluginName() {
    return 'NxMark';
  }

  static get requires() {
    return [NxMarkEditing, Widget];
  }

  init() {
  }
}
