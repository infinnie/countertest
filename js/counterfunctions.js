define("js/counterfunctions", function () {
    "use strict";
    return {
        up: function (boundState, inject, name, by) {
            var obj = {};
            obj[name] = boundState.value + by;
            inject(obj);
        }, down: function (boundState, inject, name, by) {
            var obj = {};
            obj[name] = boundState.value - by;
            inject(obj);
        }
    };
});