import { icons, Plugin } from '@ckeditor/ckeditor5-core';
import {
  addToolbarToDropdown,
  ButtonView,
  createDropdown,
  SplitButtonView,
  ToolbarSeparatorView
} from '@ckeditor/ckeditor5-ui';

import markerIcon from './icons/marker.svg';

export default class NxMarkUI extends Plugin {
  static get pluginName() {
    return 'NxMarkUI';
  }

  get options() {
    return [
      {
        key: 'green',
        color: 'yellowgreen',
        title: 'Green marker'
      },
      {
        key: 'red',
        color: 'red',
        title: 'Red marker'
      }
    ];
  }

  init() {
    for (const option of this.options) {
      this._addMarkButton(option);
    }

    this._addRemoveMarkButton();
    this._addDropdown();
  }

  _addMarkButton(option) {
    const command = this.editor.commands.get('nxMark');

    this._addButton(`nxMark:${option.key}`, option.title, markerIcon, option.key, button => {
      button.bind('isEnabled').to(command, 'isEnabled');
      button.bind('isOn').to(command, 'value', value => value === option.key);
      button.iconView.fillColor = option.color;
      button.isToggleable = true;
    });
  }

  _addRemoveMarkButton() {
    const command = this.editor.commands.get('nxMark');

    this._addButton('nxMark:remove', 'Remove mark', icons.eraser, null, button => {
      button.bind('isEnabled').to(command, 'isEnabled');
    });
  }

  _addButton(name, label, icon, value, decorateButton) {
    const t = this.editor.t;

    this.editor.ui.componentFactory.add(name, locale => {
      const buttonView = new ButtonView(locale);

      buttonView.set({
        label: t(label),
        icon,
        tooltip: true
      });

      buttonView.on('execute', () => {
        this.editor.execute('nxMark', { value });
        this.editor.editing.view.focus();
      });

      decorateButton(buttonView);

      return buttonView;
    });
  }

  _addDropdown() {
    const t = this.editor.t;
    const componentFactory = this.editor.ui.componentFactory;

    const startingHighlighter = this.options[0];
    const optionsMap = this.options.reduce((returnValue, option) => {
      returnValue[option.key] = option;
      return returnValue;
    }, {});

    componentFactory.add('nxMark', locale => {
      const command = this.editor.commands.get('nxMark');
      const dropdownView = createDropdown(locale, SplitButtonView);
      const splitButtonView = dropdownView.buttonView;

      splitButtonView.set({
        tooltip: t('Mark'),
        icon: markerIcon,
        lastExecuted: startingHighlighter.key,
        commandValue: startingHighlighter.key,
        isToggleable: true
      });

      splitButtonView.bind('color').to(command, 'value', value => getActiveOption(value, 'color'));
      splitButtonView.bind('commandValue').to(command, 'value', value => getActiveOption(value, 'key'));
      splitButtonView.bind('isOn').to(command, 'value', value => !!value);
      splitButtonView.delegate('execute').to(dropdownView);

      const buttons = this.options.map(option => {
        const buttonView = componentFactory.create(`nxMark:${option.key}`);
        this.listenTo(buttonView, 'execute', () => splitButtonView.set({ lastExecuted: option.key }));
        return buttonView;
      });

      dropdownView.bind('isEnabled').toMany(buttons, 'isEnabled', (...areEnabled) => areEnabled.some(isEnabled => isEnabled));

      buttons.push(new ToolbarSeparatorView());
      buttons.push(componentFactory.create('nxMark:remove'));

      addToolbarToDropdown(dropdownView, buttons);
      bindToolbarIconStyleToActiveColor(dropdownView);

      dropdownView.toolbarView.ariaLabel = t('Mark toolbar');

      splitButtonView.on('execute', () => {
        this.editor.execute('nxMark', { value: splitButtonView.commandValue });
        this.editor.editing.view.focus();
      });

      function getActiveOption(current, key) {
        const whichMarker = !current || current === splitButtonView.lastExecuted ? splitButtonView.lastExecuted : current;
        return optionsMap[whichMarker][key];
      }

      return dropdownView;
    });
  }
}

function bindToolbarIconStyleToActiveColor(dropdownView) {
  const actionView = dropdownView.buttonView.actionView;
  actionView.iconView.bind('fillColor').to(dropdownView.buttonView, 'color');
}
