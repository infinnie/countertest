define("js/counterfunctions", function () {
    "use strict";
    return {
        stateGetter: function (state) {
            return {
                values: state.pageData
            };
        },
        mutators: {
            up: function (name, by) {
                return function (boundState) {
                    var obj = {};
                    obj[name] = boundState.values[name] + by;
                    return obj;
                };
            }, down: function (name, by) {
                return function (boundState) {
                    var obj = {};
                    obj[name] = boundState.values[name] - by;
                    return obj;
                };
            }
        }, operations: {
            up: function (boundState, mutators) {
                var args = [].slice.call(arguments, 2);
                return mutators.up.apply(null, args);
            }, down: function (boundState, mutators) {
                var args = [].slice.call(arguments, 2);
                setTimeout(function () {
                    mutators.down.apply(null, args);
                }, 2333);
            }
        }
    };
});