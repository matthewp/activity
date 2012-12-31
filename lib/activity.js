var Bindable = require('./bindable'),
    ActionBar = require('./action_bar');
  
function Activity(el, actionBar) {
  Bindable.call(this);

  this.el = el;
  this.actionBar = actionBar || new ActionBar();
  this.screen = this.el.querySelector('.screen');
  this.optionsMenu = this.actionBar.el.querySelector('.menu');
}

Activity.prototype = Object.create(Bindable.prototype);

Activity.prototype.handleEvent = function(e) {
  if(e.currentTarget.classList.contains('actionable')) {
    e.preventDefault();

    if(e.currentTarget.hasAttribute('data-back')) {
      this.onback();
    } else {
      this.onactionselected(e.target);
    }

    return true;
  } else {
    return false;
  }
};

Activity.prototype.onactionselected = null;

Activity.prototype.onback = function() {
  window.history.back();
};

Activity.prototype.toggleMenu = function() {
  this.optionsMenu.classList.toggle('open');
};

module.exports = Activity;