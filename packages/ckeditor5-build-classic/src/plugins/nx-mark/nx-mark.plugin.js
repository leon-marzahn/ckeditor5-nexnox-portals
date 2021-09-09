import { Plugin } from '@ckeditor/ckeditor5-core';

import NxMarkEditing from './nx-mark.editing';
import NxMarkUI from './nx-mark.ui';

export default class NxMarkPlugin extends Plugin {
  static get pluginName() {
    return 'NxMark';
  }

  static get requires() {
    return [NxMarkEditing, NxMarkUI];
  }

  init() {
  }
}
