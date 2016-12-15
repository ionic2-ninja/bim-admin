"use strict";
var emiya_js_utils_1 = require("emiya-js-utils");
var viewControl = (function () {
    function viewControl(model, bimSurfer, MetaDataRenderer, poid, roid, id) {
        var _this = this;
        this.modelSelectListener = [];
        this.getCanvas = function () {
            var nodes = document.getElementById(_this.id).childNodes;
            for (var c = nodes.length - 1; c >= 0; --c) {
                if (nodes[c]['tagName'].toLowerCase() == 'canvas')
                    return nodes[c];
            }
        };
        this.getSnapshot = function (offsetx, offsety, width, height, bgcolor, format, quality, timeout) {
            return new Promise(function (resolve, reject) {
                try {
                    var dom = _this.getCanvas();
                    if (!dom)
                        return;
                    var w = dom['width'], h = dom['height'];
                    if (format === void 0)
                        format = 'png';
                    var code_1 = dom['toDataURL']("image/" + format, quality);
                    if (bgcolor === void 0)
                        bgcolor = 'white';
                    if (quality === void 0)
                        quality = 1;
                    offsetx = (offsetx === void 0) ? 0 : offsetx;
                    offsety = (offsety === void 0) ? 0 : offsety;
                    if (typeof offsetx == 'string' && offsetx.indexOf('%') >= 0) {
                        offsetx = parseFloat(emiya_js_utils_1.Utils.replaceAll(offsetx, '%', '')) * w / 100;
                    }
                    else if (typeof offsetx == 'string') {
                        offsetx = parseFloat(offsetx);
                    }
                    if (typeof offsety == 'string' && offsety.indexOf('%') >= 0) {
                        offsety = parseFloat(emiya_js_utils_1.Utils.replaceAll(offsety, '%', '')) * h / 100;
                    }
                    else if (typeof offsety == 'string') {
                        offsety = parseFloat(offsety);
                    }
                    width = (width === void 0) ? (w - offsetx) : width;
                    height = (height === void 0) ? (h - offsety) : height;
                    if (typeof width == 'string' && width.indexOf('%') >= 0) {
                        width = parseFloat(emiya_js_utils_1.Utils.replaceAll(width, '%', '')) * w / 100;
                    }
                    else if (typeof width == 'string') {
                        width = parseFloat(width);
                    }
                    if (typeof height == 'string' && height.indexOf('%') >= 0) {
                        height = parseFloat(emiya_js_utils_1.Utils.replaceAll(height, '%', '')) * h / 100;
                    }
                    else if (typeof height == 'string') {
                        height = parseFloat(height);
                    }
                    var _canvas_1 = document.createElement('canvas');
                    _canvas_1.width = width;
                    _canvas_1.height = height;
                    var img_1 = new Image();
                    img_1.src = code_1;
                    img_1.style.height = h + 'px';
                    img_1.style.width = w + 'px';
                    var timer_1;
                    timeout = (timeout === void 0 ? 30000 : timeout);
                    if (timeout > 0)
                        timer_1 = setTimeout(function () {
                            reject('timeout');
                            timer_1 = null;
                        }, timeout);
                    img_1.onload = function () {
                        var context = _canvas_1.getContext('2d');
                        if (bgcolor != null && bgcolor.trim() != '') {
                            context.fillStyle = "white";
                            context.fillRect(0, 0, width, height);
                        }
                        context.drawImage(img_1, -offsetx, -offsety);
                        code_1 = _canvas_1.toDataURL("image/" + format, 1);
                        if (timer_1) {
                            clearTimeout(timer_1);
                            timer_1 = null;
                        }
                        resolve({ base64: code_1, width: width, height: height, name: _this.poid + '#' + _this.roid, format: format });
                    };
                    img_1.onerror = function (err) {
                        if (timer_1) {
                            clearTimeout(timer_1);
                            timer_1 = null;
                        }
                        reject(err);
                    };
                }
                catch (e) {
                    reject(e);
                }
            });
        };
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
        this.poid = poid;
        this.roid = roid;
        this.id = id;
        this.bimSurfer.on("selection-changed", function (selected) {
            for (var c in _this.modelSelectListener) {
                _this.modelSelectListener[c] && _this.modelSelectListener[c](selected);
            }
        });
    }
    viewControl.prototype.downloadSnapshot = function (offsetx, offsety, width, height, bgcolor, format, quality, timeout) {
        var c = this.getSnapshot(offsetx, offsety, width, height, bgcolor, format, quality, timeout);
        c.then(function (ev) {
            var a = document.createElement('a');
            a['href'] = ev['base64'];
            a.download = ev['name'];
            a.click();
        });
        return c;
    };
    return viewControl;
}());
exports.viewControl = viewControl;
