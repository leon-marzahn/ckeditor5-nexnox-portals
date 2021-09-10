import { Plugin } from '@ckeditor/ckeditor5-core';
import { Widget } from '@ckeditor/ckeditor5-widget';
import { add } from '@ckeditor/ckeditor5-utils/src/translation-service';

import NxVarEditing from './nx-var.editing';

export default class NxVarPlugin extends Plugin {
  static get pluginName() {
    return 'NxVar';
  }

  static get requires() {
    return [NxVarEditing, Widget];
  }

  init() {
    add('de', {});
  }
}
