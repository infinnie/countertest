define("js/counterfunctions", function () {
    "use strict";
    return {
        stateGetter: function (state) {
            return state.pageData;
        },
        mutators: {
            up: function (name, by) {
                return function (boundState) {
                    var obj = {};
                    obj[name] = boundState[name] + by;
                    return obj;
                };
            }, down: function (name, by) {
                return function (boundState) {
                    var obj = {};
                    obj[name] = boundState[name] - by;
                    return obj;
                };
            }
        }, operations: {
            delayedDown: function (boundState, mutators, name, by) {
                setTimeout(function () {
                    mutators.down(name, by);
                }, 2333);
            }
        }
    };
});