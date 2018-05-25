define("js/connect", ["jquery"], function ($) {
    "use strict";
    return function (stateGetter, mutations, ops) {
        ops = ops || {};
        return function (obj) {
            return function (state, actions) {
                var render = obj && obj.render,
                    bound = stateGetter && stateGetter(state), boundMutations = {}, boundOperations = {};
                if (render) {
                    $.map(mutations, function (val, key) {
                        ///<summary>Mutations get their real time state.</summary>
                        boundMutations[key] = function () {
                            var args = [].slice.call(arguments, 0);
                            actions.inject([stateGetter, val.apply(null, args)]);
                        };
                    });
                    $.map(ops, function (val, key) {
                        /// <summary>Operations get their render-time state slice.</summary>
                        /// <param name="val" type="Function"/>
                        boundOperations[key] = function () {
                            var args = [].slice.call(arguments, 0);
                            return val.apply(null, [bound, boundMutations].concat(args));
                        };
                    });
                    return render(bound, boundMutations, boundOperations);
                }
                return null;
            };
        };
    };
});