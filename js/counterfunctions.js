define("js/counterfunctions", function () {
    "use strict";
    return {
        up: function (inject, name, prev, value) {
            return function () {
                var obj = {};
                obj[name] = prev[name] + value;
                inject(obj);
            };
        }, down: function (inject, name, prev, value) {
            return function () {
                var obj = {};
                obj[name] = prev[name] - value;
                inject(obj);
            };
        }
    }
});