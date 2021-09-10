import { Plugin } from '@ckeditor/ckeditor5-core';
import { createDropdown } from '@ckeditor/ckeditor5-ui';
import SimpleVideoFormView from './ui/simple-video-form.view';

import simpleVideoIcon from './icons/media.svg';

export default class SimpleVideoUI extends Plugin {
  static get pluginName() {
    return 'SimpleVideoUI';
  }

  init() {
    const t = this.editor.t;
    const config = this.editor.config;
    const command = this.editor.commands.get('insertSimpleVideo');

    this.editor.ui.componentFactory.add('simpleVideo', locale => {
      const dropdown = createDropdown(locale);
      const simpleVideoForm = new SimpleVideoFormView(getFormValidators(this.editor.t, config), this.editor.locale);

      this._setupDropdown(dropdown, simpleVideoForm, command);
      this._setupForm(dropdown, simpleVideoForm, command);

      return dropdown;
    });
  }

  _setupDropdown(dropdown, form, command) {
    const editor = this.editor;
    const config = editor.config;
    const t = editor.t;
    const button = dropdown.buttonView;

    dropdown.bind('isEnabled').to(command);
    dropdown.panelView.children.add(form);

    button.set({
      label: t('Insert video'),
      icon: simpleVideoIcon,
      tooltip: true
    });

    button.on('open', () => {
      form.disableCssTransitions();
      form.video = command.value || '';
      form.videoInputView.fieldView.select();
      form.focus();
      form.enableCssTransitions();
    }, { priority: 'low' });

    dropdown.on('submit', () => {
      if (form.isValid()) {
        for (const platform of config.get('simpleVideo.platforms')) {
          if (platform.match.test(form.video)) {
            const matches = platform.match.exec(form.video);
            const id = platform.getId(matches);

            editor.execute('insertSimpleVideo', id, platform);

            break;
          }
        }

        closeUI();
      }
    });

    dropdown.on('change:isOpen', () => form.resetFormStatus());
    dropdown.on('cancel', () => closeUI());

    function closeUI() {
      editor.editing.view.focus();
      dropdown.isOpen = false;
    }
  }

  _setupForm(dropdown, form, command) {
    form.delegate('submit', 'cancel').to(dropdown);
    form.videoInputView.bind('value').to(command, 'value');
    form.videoInputView.bind('isReadOnly').to(command, 'isEnabled', value => !value);
  }
}

function getFormValidators(t, config) {
  return [
    form => {
      if (!form.video.length) {
        return t('The URL must not be empty.');
      }
    },
    form => {
      let isValid = false;

      for (const platform of config.get('simpleVideo.platforms')) {
        isValid = platform.match.test(form.video);

        if (isValid) {
          break;
        }
      }

      if (!isValid) {
        return t('The URL must be a valid URL.');
      }
    }
  ];
}
