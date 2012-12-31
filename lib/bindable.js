function Bindable() {
	this.bindings = [];
}

Bindable.prototype = {
  addBinding: function (el, type, fn, useCapture) {
    var args = [el, type, fn, useCapture || false];
    el.addEventListener.apply(el, args.slice(1));
    this.bindings.push(args);
  },

  removeBinding: function (el, type, fn, useCapture) {
    el.removeEventListener(type, fn, useCapture || false);
  },

  unbind: function () {
    this.bindings.forEach(function (arr) {
      this.removeBinding(arr[0], arr[1], arr[2], arr[3]);
    }, this);
  }
};

module.exports = Bindable;