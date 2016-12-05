"use strict";
var emiya_js_utils_1 = require('emiya-js-utils/Utils');
var viewControl_1 = require('./viewControl');
var Api = (function () {
    function Api(address, username, password) {
        var _this = this;
        this.getToken = function () {
            return _this.token;
        };
        this.loadLib = function () {
            return new Promise(function (resolve, reject) {
                try {
                    window['require'](["bimsurfer/src/BimSurfer", "bimsurfer/src/StaticTreeRenderer", "bimsurfer/src/MetaDataRenderer", "bimsurfer/lib/domReady!"], function (BimSurfer, StaticTreeRenderer, MetaDataRenderer, domReady) {
                        _this.BimSurfer = BimSurfer;
                        _this.StaticTreeRenderer = StaticTreeRenderer;
                        _this.MetaDataRenderer = MetaDataRenderer;
                        _this.domReady = domReady;
                        resolve([BimSurfer, StaticTreeRenderer, MetaDataRenderer, domReady]);
                    });
                }
                catch (e) {
                    reject(e);
                }
            });
        };
        this.login = function () {
            console.log(_this);
            if (_this.token === null || _this.token === undefined)
                return new Promise(function (resolve, reject) {
                    _this.client = new window['BimServerClient'](_this.address);
                    //console.log('client', this.client)
                    _this.client.init(function () {
                        _this.client.login(_this.username, _this.password, function () {
                            console.log('login ok', _this.client.token);
                            _this.token = _this.client.token;
                            resolve(_this.client.token);
                        }, function (error) {
                            console.error('login fail', error);
                            reject(error);
                        });
                    });
                });
            else
                return _this.loginByToken();
        };
        this.loginByToken = function () {
            return new Promise(function (resolve, reject) {
                _this.client = new window['BimServerClient'](_this.address);
                //console.log('client', this.client)
                _this.client.init(function () {
                    _this.client.setToken(_this.token, function () {
                        console.log('login ok', _this.client.token);
                        _this.token = _this.client.token;
                        resolve(_this.client.token);
                    }, function (error) {
                        console.error('login fail', error);
                        reject(error);
                    });
                });
            });
        };
        this.getAllProjects = function (params) {
            params = emiya_js_utils_1.Utils.mergeObject(params, {
                onlyTopLevel: false,
                onlyActive: false
            });
            return new Promise(function (resolve, reject) {
                _this.client.call("ServiceInterface", "getAllProjects", params, function (projects) {
                    console.log('getAllProjects ok', projects);
                    resolve(projects);
                    //a.setAttribute("href", "demo/example_BIMServer.html?address=" + encodeURIComponent(address) + "&token=" + client.token + "&poid=" + project.oid + "&roid=" + project.lastRevisionId);
                }, function (error) {
                    reject(error);
                });
            });
        };
        this.loadModel = function (poid, roid, id) {
            return new Promise(function (resolve, reject) {
                var bimSurfer = new _this.BimSurfer({
                    domNode: id
                });
                bimSurfer.load({
                    bimserver: _this.address,
                    token: _this.token,
                    poid: poid,
                    roid: roid,
                    schema: "ifc2x3tc1" // < TODO: Deduce automatically
                }).then(function (data) {
                    resolve(new viewControl_1.viewControl(data, bimSurfer));
                }).catch(function (err) {
                    reject(err);
                });
            });
        };
        this.showDemo = function (poid, roid, bust) {
            if (bust === void 0) { bust = ''; }
            var bimSurfer = new _this.BimSurfer({
                domNode: "viewerContainer" + bust
            });
            bimSurfer.on("loading-finished", function () {
                document.getElementById("status" + bust).innerHTML = "Loading finished";
                var domNode = document.getElementById("typeSelector" + bust);
                domNode.innerHTML = "";
                bimSurfer.getTypes().forEach(function (ifc_type) {
                    var on = ifc_type.visible;
                    var d = document.createElement("div");
                    var t = document.createTextNode(ifc_type.name);
                    var setClass = function () {
                        d.className = "fa fa-eye " + ["inactive", "active"][on * 1];
                    };
                    setClass();
                    d.appendChild(t);
                    domNode.appendChild(d);
                    d.onclick = function () {
                        on = !on;
                        setClass();
                        bimSurfer.setVisibility({ types: [ifc_type.name], visible: on });
                    };
                });
            });
            bimSurfer.on("loading-started", function () {
                document.getElementById("status" + bust).innerHTML = "Loading...";
            });
            // Lets us play with the Surfer in the console
            window['bimSurfer' + bust] = bimSurfer;
            //alert(123)
            // Load a model from BIMServer
            console.log(bimSurfer);
            bimSurfer.load({
                bimserver: _this.address,
                token: _this.token,
                poid: poid,
                roid: roid,
                schema: "ifc2x3tc1" // < TODO: Deduce automatically
            }).then(function (model) {
                console.log(model);
                model.getTree().then(function (tree) {
                    console.log(123, tree);
                    _this.makeModelView(tree, document.getElementById('modelView' + bust));
                    // Build a tree view of the elements in the model. The fact that it
                    // is 'static' refers to the fact that all branches are loaded and
                    // rendered immediately.
                    var domtree = new _this.StaticTreeRenderer({
                        domNode: 'treeContainer' + bust
                    });
                    domtree.addModel({ name: "", id: roid, tree: tree });
                    domtree.build();
                    // Add a widget that displays metadata (IfcPropertySet and instance
                    // attributes) of the selected element.
                    var metadata = new _this.MetaDataRenderer({
                        domNode: 'dataContainer' + bust
                    });
                    metadata.addModel({ name: "", id: roid, model: model });
                    bimSurfer.on("selection-changed", function (selected) {
                        domtree.setSelected(selected, domtree.SELECT_EXCLUSIVE);
                        metadata.setSelected(selected);
                    });
                    domtree.on("click", function (oid, selected) {
                        console.log(oid);
                        console.log(selected);
                        // Clicking an explorer node fits the view to its object and selects
                        if (selected.length) {
                            bimSurfer.viewFit({
                                ids: selected,
                                animate: true
                            });
                        }
                        bimSurfer.setSelection({
                            ids: selected,
                            clear: true,
                            selected: true
                        });
                    });
                    // Write API ref
                    var flatten = function (n) {
                        var li = [];
                        var f = function (n) {
                            li.push(n.id);
                            (n.children || []).forEach(f);
                        };
                        f(n);
                        return li;
                    };
                    var oids = flatten(tree);
                    //window['_'].shuffle(oids);
                    oids.splice(10);
                    var guids = bimSurfer.toGuid(oids);
                    oids = "[" + oids.join(", ") + "]";
                    guids = "[" + guids.map(function (s) {
                        return '"' + s + '"';
                    }).join(", ") + "]";
                    var METHODS = [
                        { name: 'setVisibility', args: [{ name: "ids", value: oids }, { name: "visible", value: false }] },
                        {
                            name: 'setVisibility',
                            args: [{ name: "types", value: '["IfcWallStandardCase"]' }, { name: "visible", value: false }]
                        },
                        { name: 'setSelectionState', args: [{ name: "ids", value: oids }, { name: "selected", value: true }] },
                        { name: 'getSelected', args: [], hasResult: true },
                        { name: 'toId', args: [guids], hasResult: true },
                        { name: 'toGuid', args: [oids], hasResult: true },
                        { name: 'setColor', args: [{ name: "ids", value: oids }, { name: "color", value: "{r:1, g:0, b:0, a:1}" }] },
                        { name: 'viewFit', args: [{ name: "ids", value: oids }, { name: "animate", value: 500 }] },
                        { name: 'setCamera', args: [{ name: "type", value: "'ortho'" }] },
                        { name: 'getCamera', args: [], hasResult: true },
                        { name: 'reset', args: [{ name: "cameraPosition", value: true }] },
                    ];
                    var n = document.getElementById('apirefContainer' + bust);
                    METHODS.forEach(function (m, i) {
                        n.innerHTML += "<h2>" + m.name + "()</h2>";
                        var hasNamedArgs = false;
                        var args = m.args.map(function (a) {
                            if (a.name) {
                                hasNamedArgs = true;
                                return a.name + ":" + a.value;
                            }
                            else {
                                return a;
                            }
                        }).join(", ");
                        if (hasNamedArgs) {
                            args = "{" + args + "}";
                        }
                        //console.log(window['bimSurfer'])
                        var cmd = "bimSurfer" + bust + "." + m.name + "(" + args + ");";
                        n.innerHTML += "<textarea rows=3 id='code" + i + bust + "' spellcheck=false>" + cmd + "\n</textarea>";
                        window['exec_statement'] = "eval(document.getElementById(\"code" + i + bust + "\").value)";
                        if (m.hasResult) {
                            window['exec_statement'] = "document.getElementById(\"result" + i + bust + "\").innerHTML = JSON.stringify(" + window['exec_statement'] + ").replace(/,/g, \", \")";
                        }
                        else {
                            window['exec_statement'] += "; window.scrollTo(0,0)";
                        }
                        n.innerHTML += "<button onclick='" + window['exec_statement'] + "'>run</button>";
                        if (m.hasResult) {
                            n.innerHTML += "<pre id='result" + i + bust + "' />";
                        }
                    });
                });
            });
        };
        this.address = address;
        if (password === null || password === undefined || password === '') {
            this.token = username;
        }
        else {
            this.username = username;
            this.password = password;
        }
        //console.log(window['require'])
    }
    Api.prototype.makeModelView = function (projects, dom, onclick, firstNoPaddingLeft) {
        if (firstNoPaddingLeft === void 0) { firstNoPaddingLeft = true; }
        if (projects && !(projects instanceof Array))
            projects = [projects];
        if (!dom) {
            dom = document.createElement('ul');
            if (firstNoPaddingLeft)
                dom.style.paddingLeft = '0px';
        }
        else if (projects && projects.length > 0) {
            var _dom = document.createElement('ul');
            if (firstNoPaddingLeft)
                _dom.style.paddingLeft = '0px';
            else
                _dom.style.paddingLeft = '10px';
            dom.append(_dom);
            dom = _dom;
        }
        var _loop_1 = function(c) {
            var sub = document.createElement('li');
            sub.style.margin = '3px';
            sub.style.fontSize = '20px';
            sub.style.lineHeight = '20px';
            sub.innerText = projects[c].name;
            sub.value = projects[c].id;
            sub.style.whiteSpace = 'nowrap';
            this_1.makeModelView(projects[c].children, sub, onclick, false);
            if (projects[c].children && projects[c].children.length > 0) {
                sub.style.listStyle = 'none';
                sub.style.background = "url('assets/bimsurfer/images/show.jpg') no-repeat 0 0";
                sub.style.backgroundSize = "20px 20px";
                sub.style.textIndent = '25px';
                (function (subdom) {
                    subdom.onclick = function (ev) {
                        ev.stopPropagation();
                        var _sub = subdom;
                        do {
                            _sub = _sub.firstElementChild;
                            if (_sub) {
                                if (_sub.style.display != 'none') {
                                    _sub.style.display = 'none';
                                    subdom.style.listStyle = 'none';
                                    subdom.style.background = "url('assets/bimsurfer/images/hide.jpg') no-repeat 0 0";
                                    subdom.style.backgroundSize = "20px 20px";
                                }
                                else {
                                    _sub.style.display = '';
                                    subdom.style.listStyle = 'none';
                                    subdom.style.background = "url('assets/bimsurfer/images/show.jpg') no-repeat 0 0";
                                    subdom.style.backgroundSize = "20px 20px";
                                }
                            }
                        } while (_sub);
                    };
                })(sub);
            }
            else {
                sub.style.listStyle = 'none';
                sub.style.background = "url('assets/bimsurfer/images/see.jpg') no-repeat 0 0";
                (function (obj) {
                    sub.onclick = function (ev) {
                        ev.stopPropagation();
                        onclick && onclick(obj);
                        //alert(JSON.stringify(obj));
                    };
                })(projects[c]);
                sub.style.backgroundSize = "20px 20px";
                sub.style.textIndent = '25px';
            }
            dom.append(sub);
        };
        var this_1 = this;
        for (var c in projects) {
            _loop_1(c);
        }
        return dom;
    };
    Api.prototype.setTreeSelection = function (dom) {
    };
    Api.prototype.makeProjectView = function (projects, dom, onclick) {
        if (projects && !(projects instanceof Array))
            projects = [projects];
        if (!dom)
            dom = document.createElement('ul');
        else if (projects && projects.length > 0) {
            var _dom = document.createElement('ul');
            dom.append(_dom);
            dom = _dom;
        }
        var _loop_2 = function(c) {
            var sub = document.createElement('li');
            sub.style.margin = '3px';
            sub.style.fontSize = '20px';
            sub.style.lineHeight = '20px';
            sub.innerText = projects[c].name;
            this_2.makeProjectView(projects[c].children, sub, onclick);
            if (projects[c].children && projects[c].children.length > 0) {
                sub.style.listStyle = 'none';
                sub.style.background = "url('assets/bimsurfer/images/show.jpg') no-repeat 0 0";
                sub.style.backgroundSize = "20px 20px";
                sub.style.textIndent = '25px';
                (function (subdom) {
                    subdom.onclick = function (ev) {
                        ev.stopPropagation();
                        var _sub = subdom;
                        do {
                            _sub = _sub.firstElementChild;
                            if (_sub) {
                                if (_sub.style.display != 'none') {
                                    _sub.style.display = 'none';
                                    subdom.style.listStyle = 'none';
                                    subdom.style.background = "url('assets/bimsurfer/images/hide.jpg') no-repeat 0 0";
                                    subdom.style.backgroundSize = "20px 20px";
                                }
                                else {
                                    _sub.style.display = '';
                                    subdom.style.listStyle = 'none';
                                    subdom.style.background = "url('assets/bimsurfer/images/show.jpg') no-repeat 0 0";
                                    subdom.style.backgroundSize = "20px 20px";
                                }
                            }
                        } while (_sub);
                    };
                })(sub);
            }
            else {
                sub.style.listStyle = 'none';
                if (projects[c].lastRevisionId != -1) {
                    sub.style.background = "url('assets/bimsurfer/images/see.jpg') no-repeat 0 0";
                    (function (obj) {
                        sub.onclick = function (ev) {
                            ev.stopPropagation();
                            onclick && onclick(obj);
                            //alert(JSON.stringify(obj));
                        };
                    })(projects[c]);
                }
                else {
                    sub.style.background = "url('assets/bimsurfer/images/none.jpg') no-repeat 0 0";
                    sub.onclick = function (ev) {
                        ev.stopPropagation();
                    };
                }
                sub.style.backgroundSize = "20px 20px";
                sub.style.textIndent = '25px';
            }
            dom.append(sub);
        };
        var this_2 = this;
        for (var c in projects) {
            _loop_2(c);
        }
        return dom;
    };
    Api.prototype.makeProjectTree = function (projects, tops) {
        if (!tops) {
            tops = [];
            for (var c in projects) {
                if (projects[c].parentId == -1) {
                    tops.push(projects[c]);
                }
            }
        }
        for (var c in tops) {
            var sub = [];
            for (var d in tops[c].subProjects) {
                for (var e in projects) {
                    if (projects[e].oid == tops[c].subProjects[d]) {
                        sub.push(projects[e]);
                    }
                }
            }
            tops[c].children = this.makeProjectTree(projects, sub);
        }
        return tops;
    };
    return Api;
}());
exports.Api = Api;
