var transitionEnd = (function() {
  var transEndEventNames = {
    'WebkitTransition': 'webkitTransitionEnd',
    'MozTransition': 'transitionend',
    'OTransition': 'oTransitionEnd',
    'msTransition': 'MSTransitionEnd',
    'transition': 'transitionend'
  };

  return transEndEventNames[Modernizr.prefixed('transition')];
})();

var transformProp = Modernizr.prefixed('transform');

function ActivityManager(el) {
  var node = document.getElementById('act-style');
  this.itemStyle = node.sheet.cssRules[0].style;

  this.el = el;
  this.index = 1;
  this.activities = [];
}

ActivityManager.prototype = {

  applyTransformation: function(left) {
    var val = 'translate3d(-' + left + '%,0,0)';
    this.el.style[transformProp] = val;
  },

  doTransition: function(fn, callback) {
    var self = this;

    window.requestAnimationFrame(function() {
      self.el.classList.add('trans');

      window.addEventListener(transitionEnd, function te() {
        self.el.classList.remove('trans');

        window.removeEventListener(transitionEnd, te);

        if(callback) {
          callback();
        }
      });

      fn();
    });
  },

  prevItem: function(callback) {
    if(this.index === 1) {
      return;
    }

    var newWidth = this.calcNewWidth(-100),
        oldEachWidth = this.calcEachWidth(0),
        eachWidth = this.calcEachWidth(-1);

    var oldLeft = (this.index - 2) * oldEachWidth,
        newLeft = (this.index - 2) * eachWidth,
        self = this;

    var oldActivity = this.activities.pop();

    this.doTransition(
      function() {
        self.applyTransformation(oldLeft);
      },
      function() {
        window.requestAnimationFrame(function() {
          self.el.style.width = newWidth + '%';
          self.itemStyle.width = eachWidth + '%';
          self.el.removeChild(self.el.lastChild);
          self.applyTransformation(newLeft);

          (callback || function(){})();
        });

        oldActivity.unbind();
      });

    self.index--;
  },

  nextItem: function(activity, callback) {
    var newWidth = this.calcNewWidth(100),
        eachWidth = this.calcEachWidth(1);

    var oldLeft = (this.index - 1) * eachWidth,
        newLeft = this.index * eachWidth,
        self = this;

    this.activities.push(activity);

    window.requestAnimationFrame(function() {
      self.el.style.width = newWidth + '%';
      self.itemStyle.width = eachWidth + '%';

      if(oldLeft) {
        self.applyTransformation(oldLeft);
      }

      self.el.appendChild(activity.el);

      self.doTransition(function() {
        self.applyTransformation(newLeft);
      }, callback || function(){});
    });

    this.index++;
  },

  calcNewWidth: function(dx) {
    var currWidth = this.el.style.width.split('%')[0] || '100';

    return parseFloat(currWidth) + dx;
  },

  calcEachWidth: function(d) {
    var each = 100 / (this.el.children.length + d);

    return each;
  },

  calcOldEachWidth: function() {

  }

};

module.exports = ActivityManager;