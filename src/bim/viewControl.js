"use strict";
var emiya_js_utils_1 = require('emiya-js-utils');
var viewControl = (function () {
  function viewControl(model, bimSurfer) {
    var _this = this;
    this.modelSelectListener = [];
    this.getModel = function () {
      return emiya_js_utils_1.Utils.deepCopy(_this.model);
    };
    this.getTree = function () {
      return _this.model.getTree();
    };
    this.setVisibility = function (ids, visable) {
      return _this.bimSurfer.setVisibility({ ids: ids, visible: visable });
    };
    this.viewFit = function (ids, animate) {
      if (animate === void 0) { animate = 500; }
      return _this.bimSurfer.viewFit({ ids: ids, animate: animate });
    };
    this.setColor = function (ids, color) {
      if (color === void 0) { color = { r: 1, g: 0, b: 0, a: 1 }; }
      return _this.bimSurfer.setColor({ ids: ids, color: color });
    };
    this.getSelected = function () {
      return _this.bimSurfer.getSelected();
    };
    this.setSelection = function (ids, selected, clear) {
      if (selected === void 0) { selected = true; }
      if (clear === void 0) { clear = true; }
      return _this.bimSurfer.setSelection({
        ids: ids,
        clear: clear,
        selected: selected
      });
    };
    this.setSelectionState = function (ids, selected) {
      if (selected === void 0) { selected = true; }
      return _this.bimSurfer.setSelectionState({ ids: ids, selected: selected });
    };
    this.reset = function (params) {
      if (params === void 0) { params = { cameraPosition: true }; }
      return _this.bimSurfer.reset(params);
    };
    this.onModelSelect = function (cb) {
      if (!cb)
        return;
      _this.modelSelectListener.push(cb);
      return function () {
        while (_this.modelSelectListener.indexOf(cb) >= 0)
          _this.modelSelectListener.splice(_this.modelSelectListener.indexOf(cb), 1);
      };
    };
    this.bimSurfer = bimSurfer;
    this.model = emiya_js_utils_1.Utils.deepCopy(model);
    this.bimSurfer.on("selection-changed", function (selected) {
      for (var c in _this.modelSelectListener) {
        _this.modelSelectListener[c] && _this.modelSelectListener[c](selected);
      }
    });
  }
  return viewControl;
}());
exports.viewControl = viewControl;
