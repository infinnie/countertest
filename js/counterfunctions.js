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
            up: function (boundState, mutators, name, by) {
                return mutators.up(name, by);
            }, delayedDown: function (boundState, mutators, name, by) {
                setTimeout(function () {
                    mutators.down(name, by);
                }, 2333);
            }
        }
    };
});