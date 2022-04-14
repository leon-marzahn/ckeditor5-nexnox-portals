import { Plugin } from '@ckeditor/ckeditor5-core';
import NxImageOverrideEditing from './nx-image-override.editing';

export default class NxImageOverridePlugin extends Plugin {
  static get pluginName() {
	return 'NxImageOverridePlugin';
  }

  static get requires() {
	return [NxImageOverrideEditing];
  }
}
