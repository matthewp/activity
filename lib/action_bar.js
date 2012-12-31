var Bindable = require('./bindable');

function ActionBar(el) {
  Bindable.call(this);
  
  if (el) {
    this.el = el;

    var actions = el.querySelectorAll('.actionable');
    if (actions && actions.length) {
      Array.prototype.slice.call(actions).forEach(function (action) {
        this.addActionable(action);
      }, this);
    }
  } else {
    this.el = document.createElement('div');
    this.el.classList.add('action-bar');
  }
}

ActionBar.prototype = Object.create(Bindable.prototype);

ActionBar.addActionable = function (el) {
  this.addBinding(el, 'click', this, false);
};

module.exports = ActionBar;