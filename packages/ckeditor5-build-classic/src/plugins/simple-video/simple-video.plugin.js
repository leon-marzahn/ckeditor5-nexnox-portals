import { Plugin } from '@ckeditor/ckeditor5-core';
import { Widget } from '@ckeditor/ckeditor5-widget';

import SimpleVideoEditing from './simple-video.editing';
import SimpleVideoUI from './simple-video.ui';

export default class SimpleVideoPlugin extends Plugin {
  static get pluginName() {
    return 'SimpleVideo';
  }

  static get requires() {
    return [SimpleVideoEditing, SimpleVideoUI, Widget];
  }
}
