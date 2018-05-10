/// <reference path="/index.html"/>
define("js/connect", ["jquery"], function ($) {
    return function (stateGetters, ops) {
        stateGetters = stateGetters || {};
        ops = ops || {};
        return function (obj) {
            return function (state, actions) {
                var render = obj && obj.render, bound = {};
                if (render) {
                    $.map(stateGetters, function (val, key) {
                        /// <param name="val" type="Function"/>
                        bound[key] = val(state);
                    });
                    $.map(ops, function (val, key) {
                        /// <param name="val" type="Function"/>
                        bound[key] = function () {
                            var args = [].slice.call(arguments, 0);
                            return val.apply(null, [bound, actions.inject].concat(args));
                        };
                    });
                    return render(bound);
                }
            };
        };
    };
});