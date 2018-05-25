define("js/connect", ["jquery"], function ($) {
    "use strict";
    var getPathArray = function (path) {
        /// <summary>Turn an array or valid path string into another array.</summary>
        /// <return type="Array"/>
        if (typeof path === "string") {
            return path.split(".");
        }
        return path.slice(0);
    }, getPath = function (obj, path) {
        /// <summary>Get an object slice that matches the given path.</summary>
        /// <param name="obj" type="Object"/>
        /// <param name="path" type="Array"/>
        path = getPathArray(path);
        while (path.length) {
            obj = obj[path.shift()];
        }
        return obj;
    }, setPath = function (origState, path, val) {
        /// <summary>Immutably extend an original state</summary>
        /// <param name="origState" type="Object"/>
        /// <param name="path" type="Array"/>
        path = getPathArray(path);
        /// <var name="first">Path has been shifted when this is evaluated.</var>
        var first = path.shift(), objStack = [origState[first]], slicedPath = path.slice(0, -1), tempObj, ret = {};
        while (slicedPath.length) {
            objStack.push(objStack[objStack.length - 1][slicedPath.shift()]);
        }
        while (path.length) {
            tempObj = {};
            tempObj[path.pop()] = val;
            val = $.extend({}, objStack.pop(), tempObj);
        }
        ret[first] = val;
        return ret;
    };
    return function (path) {
        var hasPath = arguments.length > 0;
        return function (stateSelector, mutations, ops) {
            /// <param name="stateSelector" type="Function">Get a presentation of the state slice to render.</param>
            ops = ops || {};
            return function (props) {
                return function (state, actions) {
                    var stateSlice = hasPath ? getPath(state, path) : state,
                        render = props && props.render,
                        bound = stateSelector ? stateSelector(stateSlice) : stateSlice,
                        boundMutations = {}, boundOperations = {};
                    if (render) {
                        $.map(mutations, function (val, key) {
                            /// <summary>Mutations get their real time state.</summary>
                            /// <param name="val" type="Function"/>
                            boundMutations[key] = function () {
                                /// <var name="f" type="Function"/>
                                var f = val.apply(null, arguments);
                                actions.inject(hasPath
                                    ? function (state) {
                                        return setPath(state, path, f(getPath(state, path)));
                                    } : f);
                            };
                        });
                        $.map(ops, function (val, key) {
                            /// <summary>Operations get their render-time state slice.</summary>
                            /// <param name="val" type="Function"/>
                            boundOperations[key] = function () {
                                var args = [].slice.call(arguments, 0);
                                return val.apply(null, [stateSlice, boundMutations].concat(args));
                            };
                        });
                        return render(bound, boundMutations, boundOperations);
                    }
                    return null;
                };
            };
        };
    };
});