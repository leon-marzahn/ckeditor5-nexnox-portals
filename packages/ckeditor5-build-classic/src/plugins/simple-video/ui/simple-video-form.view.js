import {
  ButtonView,
  createLabeledInputText,
  FocusCycler,
  injectCssTransitionDisabler,
  LabeledFieldView,
  submitHandler,
  View,
  ViewCollection
} from '@ckeditor/ckeditor5-ui';
import { FocusTracker, KeystrokeHandler } from '@ckeditor/ckeditor5-utils';
import { icons } from '@ckeditor/ckeditor5-core';

export default class SimpleVideoFormView extends View {
  get video() {
    return this.videoInputView.fieldView.element.value.trim();
  }

  set video(video) {
    this.videoInputView.fieldView.element.value = video.trim();
  }

  constructor(validators, locale) {
    super(locale);

    const t = locale.t;
    this.focusTracker = new FocusTracker();
    this.keystrokes = new KeystrokeHandler();
    this._focusables = new ViewCollection();
    this._focusCycler = new FocusCycler({
      focusables: this._focusables,
      focusTracker: this.focusTracker,
      keystrokeHandler: this.keystrokes,
      actions: {
        focusPrevious: 'shift + tab',
        focusNext: 'tab'
      }
    });
    this._validators = validators;

    this.set('videoInputValue', '');

    this.videoInputView = this._createVideoInput();

    this.saveButtonView = this._createButton(t('Save'), icons.check, 'ck-button-save');
    this.saveButtonView.type = 'submit';
    this.saveButtonView.bind('isEnabled').to(this, 'videoInputValue', value => !!value);

    this.cancelButtonView = this._createButton(
      t('Cancel'),
      icons.cancel,
      'ck-button-cancel',
      'cancel'
    );

    this.setTemplate({
      tag: 'form',
      attributes: {
        class: ['ck', 'ck-simple-video-form', 'ck-responsive-form'],
        tabindex: '-1'
      },
      children: [
        this.videoInputView,
        this.saveButtonView,
        this.cancelButtonView
      ]
    });

    injectCssTransitionDisabler(this);
  }

  render() {
    super.render();

    submitHandler({
      view: this
    });

    const childViews = [
      this.videoInputView,
      this.saveButtonView,
      this.cancelButtonView
    ];

    childViews.forEach(v => {
      this._focusables.add(v);
      this.focusTracker.add(v.element);
    });

    const stopPropagation = data => data.stopPropagation();
    this.keystrokes.listenTo(this.element);
    this.keystrokes.set('arrowright', stopPropagation);
    this.keystrokes.set('arrowleft', stopPropagation);
    this.keystrokes.set('arrowup', stopPropagation);
    this.keystrokes.set('arrowdown', stopPropagation);

    this.listenTo(this.videoInputView, 'selectstart', (evt, domEvt) => domEvt.stopPropagation(), { priority: 'high' });
  }

  focus() {
    this._focusCycler.focusFirst();
  }

  isValid() {
    this.resetFormStatus();

    for (const validator of this._validators) {
      const errorText = validator(this);

      if (errorText) {
        this.videoInputView.errorText = errorText;
        return false;
      }
    }

    return true;
  }

  resetFormStatus() {
    this.videoInputView.errorText = null;
    this.videoInputView.infoText = this._videoInputInfoDefault;
  }

  _createVideoInput() {
    const t = this.locale.t;

    const labeledInput = new LabeledFieldView(this.locale, createLabeledInputText);
    const inputField = labeledInput.fieldView;

    this._videoInputInfoDefault = t('Paste the Youtube URL in the input.');

    labeledInput.label = t('Video URL');

    inputField.on('input', () => {
      this.videoInputValue = inputField.element.value.trim();
    })

    return labeledInput;
  }

  _createButton(label, icon, className, eventName) {
    const button = new ButtonView(this.locale);

    button.set({
      label,
      icon,
      tooltip: true
    });

    button.extendTemplate({
      attributes: {
        class: className
      }
    });

    if (eventName) {
      button.delegate('execute').to(this, eventName);
    }

    return button;
  }
}
