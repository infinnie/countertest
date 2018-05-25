define("js/counterfunctions", ["jquery"], function ($) {
    "use strict";
    return {
        mutators: {
            up: function (name, by) {
                return function (stateSlice) {
                    var obj = {};
                    obj[name] = stateSlice[name] + by;
                    return $.extend({}, stateSlice, obj);
                };
            }, down: function (name, by) {
                return function (stateSlice) {
                    var obj = {};
                    obj[name] = stateSlice[name] - by;
                    return $.extend({}, stateSlice, obj);
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