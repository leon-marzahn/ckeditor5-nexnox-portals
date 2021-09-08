import { Plugin } from '@ckeditor/ckeditor5-core';
import { createDropdown } from '@ckeditor/ckeditor5-ui';
import SimpleVideoFormView from './ui/simple-video-form.view';

import simpleVideoIcon from './icons/media.svg';

const youtubeUrlRegExp = new RegExp(/^(https:\/\/www\.youtube\.com\/watch\?v=)([A-Za-z0-9._%+-]+)$/);

export default class SimpleVideoUI extends Plugin {
  static get pluginName() {
    return 'SimpleVideoUI';
  }

  init() {
    const t = this.editor.t;
    const command = this.editor.commands.get('insertSimpleVideo');

    this.editor.ui.componentFactory.add('simpleVideo', locale => {
      const dropdown = createDropdown(locale);
      const simpleVideoForm = new SimpleVideoFormView(getFormValidators(this.editor.t), this.editor.locale);

      this._setupDropdown(dropdown, simpleVideoForm, command);
      this._setupForm(dropdown, simpleVideoForm, command);

      return dropdown;
    });
  }

  _setupDropdown(dropdown, form, command) {
    const editor = this.editor;
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
        const matches = youtubeUrlRegExp.exec(form.video);

        if (matches[2] && matches[2].length) {
          editor.execute('insertSimpleVideo', matches[2]);
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

function getFormValidators(t) {
  return [
    form => {
      if (!form.video.length) {
        return t('The URL must not be empty.');
      }
    },
    form => {
      if (!youtubeUrlRegExp.test(form.video)) {
        return t('The URL must be a valid Youtube URL.');
      }
    }
  ];
}
