import { Plugin } from '@ckeditor/ckeditor5-core';

import NxMarkEditing from './nx-mark.editing';
import NxMarkUI from './nx-mark.ui';
import { add } from '@ckeditor/ckeditor5-utils/src/translation-service';

export default class NxMarkPlugin extends Plugin {
  static get pluginName() {
    return 'NxMark';
  }

  static get requires() {
    return [NxMarkEditing, NxMarkUI];
  }

  init() {
    add('de', {
      'Mark': 'Markieren',

      'Green marker': 'Grüner Marker',
      'Red marker': 'Roter Marker',

      'Remove mark': 'Marker entfernen'
    });
  }
}
