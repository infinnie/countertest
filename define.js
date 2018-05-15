/// <reference path="/node_modules/jquery/dist/jquery.js"/>
//! (c) All rights reserved

var define = (function ($) {
    "use strict";
    var storage = {},
        pendingList = {},
        rootPath = "/",
        nameMap = {},
        tempList = {},
        currentAnonymous = null,
        resolveDep = function (key) {
            var url;
            if (typeof key === "function") {
                return key;
            }
            if (key in storage) {
                return storage[key];
            }
            if (key in nameMap) {
                url = nameMap[key];
            }
            if (!(key in pendingList)) {
                pendingList[key] = (function () {
                    var d = $.Deferred(), s = document.createElement("script");
                    s.src = (key in nameMap) ? url : (rootPath + key + ".js");
                    if ("onload" in s) {
                        s.onload = function () {
                            if (key in storage) {
                                d.resolve(storage[key]);
                            }
                            else if (key in tempList) {
                                tempList[key].then(function () {
                                    d.resolve.apply(d, arguments);
                                });
                            }
                        };
                    } else {
                        s.onreadystatechange = function () {
                            if (/loaded|complete/.test(s.readyState)) {
                                if (key in storage) {
                                    d.resolve(storage[key]);
                                }
                                else if (key in tempList) {
                                    tempList[key].then(function () {
                                        d.resolve.apply(d, arguments);
                                    });
                                }
                            }
                        };
                    }
                    try {
                        $("head")[0].appendChild(s);
                    } catch (e) {
                        $(function () {
                            $("head")[0].appendChild(s);
                        });
                    }
                    return d.promise();
                })();
            }
            return pendingList[key];
        };

    var define = function (name, deps, cb) {
        /// <summary>AMD shim</summary>
        /// <param name="name" type="String"/>
        /// <param name="deps" type="Array"/>
        /// <param name="cb" type="Function"/>
        if ($.isFunction(deps) && typeof name === "string") {
            return define(name, [], deps);
        }
        if ($.isArray(name) || $.isFunction(name)) {
            if (!currentAnonymous) {
                throw new Error("Not implemented.");
            }
            return define(currentAnonymous, name, deps);
        }
        var arr = /((.*?\/)(?:[^/]+\/)?)?[^/]+$/.exec(name),
            path = arr[1], parentPath = arr[2], getDepPath = function (dep) {
                /// <param name="dep" type="String"/>
                var hasParent = /((?:\.\.\/)*?)\.\.\/(?=[^.]|$)/, cur;
                if (hasParent.test(dep)) {
                    cur = path.replace(/\/$/, "").split("/");
                    while (hasParent.test(dep)) {
                        dep = dep.replace(hasParent, function (_, $1) {
                            cur.pop();
                            return $1;
                        });
                    }
                    return cur.concat(dep).join("/");
                }
                return dep;
            };

        // TODO
        if ((typeof path === "string") && path) {
            deps = $.map(deps, function (dep) {
                return dep.replace(/^\.\//, path);
            });
        }
        if ((typeof parentPath === "string") && parentPath) {
            deps = $.map(deps, getDepPath);
        }
        // do something
        if ((name in storage) || (name in tempList)) {
            return;
        }
        tempList[name] = $.when.apply($, $.map($.map(deps, function (dep) {
            var internalGetDepPath = function (x) {
                /// <param name="x" type="String"/>
                if ((typeof path === "string") && path) {
                    x = x.replace(/^\.\//, path);
                }
                if ((typeof parentPath === "string") && parentPath) {
                    x = getDepPath(x);
                }
                return x;
            };
            if ("require" === dep) {
                return function (x) {
                    /// <param name="x" type="String"/>
                    if (/Array/.test(Object.prototype.toString.call(x))) {
                        return define.require.apply(define, arguments);
                    }
                    x = internalGetDepPath(x);
                    if (x in storage) {
                        return storage[x];
                    }
                    throw new Error("Module not found :(");
                };
            }
            if ("import" === dep) {
                return function (x) {
                    return define.requirePromise([internalGetDepPath(x)]).then(function (arr) {
                        return arr[0];
                    });
                };
            }
            return dep;
        }), resolveDep)).then(function () {
            delete tempList[name];
            delete pendingList[name];
            console.log("Defining: " + name);
            storage[name] = cb.apply(null, arguments);
            return storage[name];
        });
    };

    define.amd = {};
    define.require = function (deps, cb) {
        /// <param name="deps" type="Array"/>
        /// <param name="cb" type="Function"/>
        $.when.apply($, $.map(deps, resolveDep)).then(function () {
            cb && cb.apply(null, arguments);
        });
    };
    define.requirePromise = function (deps) {
        var d = $.Deferred();
        define.require(deps, function () {
            d.resolve([].slice.call(arguments));
        });
        return d.promise();
    };

    define.config = function (obj) {
        /// <param name="obj" type="Object"/>
        if ("root" in obj) {
            rootPath = obj.root;
        }
        if ("anonymous" in obj) {
            currentAnonymous = obj.anonymous;
        }
    };

    define.mapModule = function (name, url) {
        /// <param name="name" type="String"/>
        /// <param name="url" type="String"/>
        var i;
        if (!name) { return nameMap; }
        if (name === "require") { return false; }
        if (typeof name === "object") {
            for (i in name) {
                nameMap[i] = name[i];
            }
            return true;
        }
        nameMap[name] = url;
        return true;
    };

    define("jquery", [], function () {
        return $;
    });

    return define;
})(jQuery);