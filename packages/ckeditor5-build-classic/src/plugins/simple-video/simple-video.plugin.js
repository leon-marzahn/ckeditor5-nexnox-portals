import { Plugin } from '@ckeditor/ckeditor5-core';
import { Widget } from '@ckeditor/ckeditor5-widget';
import { add } from '@ckeditor/ckeditor5-utils/src/translation-service';

import SimpleVideoEditing from './simple-video.editing';
import SimpleVideoUI from './simple-video.ui';

export default class SimpleVideoPlugin extends Plugin {
  static get pluginName() {
    return 'SimpleVideo';
  }

  static get requires() {
    return [SimpleVideoEditing, SimpleVideoUI, Widget];
  }

  init() {
    add('de', {
      'Insert video': 'Video einfügen',
      'Video URL': 'Video Adresse',
      'Paste the Youtube URL in the input.': 'Youtube-Adresse in das Eingabefeld einfügen.',

      'The URL must not be empty.': 'Die Adresse darf nicht leer sein.',
      'The URL must be a valid Youtube URL.': 'Die Adresse muss eine gültige Youtube-Adresse sein.'
    });
  }
}
