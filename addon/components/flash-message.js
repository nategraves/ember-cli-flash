import Ember from 'ember';
import layout from '../templates/components/flash-message';
import computed from 'ember-new-computed';

const {
  String: { classify, htmlSafe },
  Component,
  getWithDefault,
  warn,
  run,
  on,
  get,
  set,
} = Ember;
const {
  readOnly,
  bool
} = computed;

export default Component.extend({
  layout,
  classNameBindings: ['alertType', 'active', 'entering', 'exiting'],
  messageStyle: 'bootstrap',
  showProgressBar: readOnly('flash.showProgress'),
  active: false,
  entering: true,
  exiting: readOnly('flash.exiting'),
  extendedTimein: readOnly('flash.extendedTimein')

  alertType: computed('flash.type', {
    get() {
      const flashType = getWithDefault(this, 'flash.type', '');
      const messageStyle = getWithDefault(this, 'messageStyle', '');
      let prefix = 'alert alert-';

      if (messageStyle === 'foundation') {
        prefix = 'alert-box ';
      }

      return `${prefix}${flashType}`;
    },

    set() {
      warn('`alertType` is read only');

      return this;
    }
  }),

  flashType: computed('flash.type', {
    get() {
      const flashType = getWithDefault(this, 'flash.type', '');

      return classify(flashType);
    },

    set() {
      warn('`flashType` is read only');

      return this;
    }
  }),

  _setActive: on('didInsertElement', function() {
    run.scheduleOnce('afterRender', this, () => {
      later(this, function() {
        set(this, 'entering', false);
        set(this, 'active', true);
      }, get(this, get(this, 'extendedTimein')));
    });
  }),

  progressDuration: computed('flash.showProgress', {
    get() {
      if (!get(this, 'flash.showProgress')) {
        return false;
      }

      const duration = getWithDefault(this, 'flash.timeout', 0);

      return htmlSafe(`transition-duration: ${duration}ms`);
    },

    set() {
      warn('`progressDuration` is read only');
    }
  }),

  click() {
    this._destroyFlashMessage();
  },

  willDestroy() {
    this._super();
    this._destroyFlashMessage();
  },

  // private
  _destroyFlashMessage() {
    const flash = getWithDefault(this, 'flash', false);

    if (flash) {
      flash.destroyMessage();
    }
  },

  hasBlock: bool('template').readOnly()
});
