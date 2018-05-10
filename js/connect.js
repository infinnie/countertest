/// <reference path="/index.html"/>
define("js/connect", ["jquery"], function ($) {
    return function (stateGetter, mutators, ops) {
        ops = ops || {};
        return function (obj) {
            return function (state, actions) {
                var render = obj && obj.render,
                    bound = stateGetter && stateGetter(state) || {}, boundMutators = {};
                if (render) {
                    $.map(mutators, function (val, key) {
                        boundMutators[key] = function () {
                            var args = [].slice.call(arguments, 0);
                            // return val.apply(null, [boundState, actions.inject].concat(args));
                            actions.inject([stateGetter, val.apply(null, args)]);
                        };
                    })
                    $.map(ops, function (val, key) {
                        /// <param name="val" type="Function"/>
                        bound[key] = function () {
                            var args = [].slice.call(arguments, 0);
                            return val.apply(null, [bound, boundMutators].concat(args));
                        };
                    });
                    return render(bound);
                }
                return null;
            };
        };
    };
});