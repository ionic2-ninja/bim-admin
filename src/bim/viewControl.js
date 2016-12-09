"use strict";
var viewControl = (function () {
    function viewControl(model, bimSurfer, MetaDataRenderer, roid) {
        var _this = this;
        this.modelSelectListener = [];
        this.getModel = function () {
            return _this.model;
        };
        this.getMetaDataRenderer = function () {
            return _this.MetaDataRenderer;
        };
        this.getById = function (id, cb) {
            return _this.model.model.get(id, cb);
        };
        this.getbBimSurfer = function () {
            return _this.bimSurfer;
        };
        this.showModelTree = function (tree, dom, firstNoPadding) {
            var m = new window['ModelTreeView'](tree, dom, _this.bimSurfer, _this.roid, firstNoPadding);
            m.show();
            return m;
        };
        // public getMetaDataSelected = () => {
        //   let metadata = new this.MetaDataRenderer({
        //     domNode: 'dataContainer' + bust
        //   });
        // }
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
        this.setSelectionState = function (ids, selected) {
            if (selected === void 0) { selected = true; }
            return _this.bimSurfer.setSelectionState({ ids: ids, selected: selected });
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
        this.getPSet = function (id, cb) {
            var obj = _this.model.model.objects[id];
            obj.getIsDefinedBy(function (isDefinedBy) {
                if (isDefinedBy.getType() == "IfcRelDefinesByProperties") {
                    isDefinedBy.getRelatingPropertyDefinition(function (pset) {
                        if (pset.getType() == "IfcPropertySet") {
                            pset.getHasProperties(function (prop) {
                                var count = 0, name, value;
                                prop.getName(function (_name) {
                                    ++count;
                                    name = _name;
                                    if (count == 2)
                                        cb && cb(name, value, prop);
                                });
                                prop.getNominalValue(function (_value) {
                                    ++count;
                                    value = _value._v;
                                    if (count == 2)
                                        cb && cb(name, value, prop);
                                });
                            });
                        }
                    });
                }
            });
            return obj;
        };
        this.getObject = function (id) {
            return _this.model.model.objects[id];
        };
        this.getAttributes = function (id, cb) {
            var obj = _this.model.model.objects[id];
            ["GlobalId", "Name", "OverallWidth", "OverallHeight", "Tag"].forEach(function (k) {
                obj['get' + k] && (cb && cb(k, obj['get' + k](), obj));
            });
            return obj;
        };
        this.getType = function (id) {
            return _this.model.model.objects[id].getType();
        };
        this.bimSurfer = bimSurfer;
        this.model = model;
        this.MetaDataRenderer = MetaDataRenderer;
        this.roid = roid;
        this.bimSurfer.on("selection-changed", function (selected) {
            for (var c in _this.modelSelectListener) {
                _this.modelSelectListener[c] && _this.modelSelectListener[c](selected);
            }
        });
    }
    return viewControl;
}());
exports.viewControl = viewControl;
