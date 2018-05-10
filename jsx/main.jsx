define("build/main", ["jquery", "lib/h", "lib/app"], function ($, h, app) {
    "use strict";
    var loadCounter = function (injectView) {
        define.requirePromise(["build/counter"]).then(function (arr) {
            var Counter = arr[0];
            injectView({
                pageData: {
                    first: 0,
                    second: 0
                }, currentView: function () {
                    return (<div>
                        <h1>Counters</h1>
                        <p>First</p>
                        <Counter name="first" by={1} />
                        <p>Second</p>
                        <Counter name="second" by={1} />
                    </div>);
                }
            });
        });
    };
    app({
        pageData: {},
        currentView: function (state, actions) {
            return (<p>
                <button type="button" class="btn" $click={function () {
                    loadCounter(actions.globalInject);
                }}>
                    Show counters
                </button>
            </p>);
        }
    }, {
        inject: function (arr) { // reserved for connect()
            var stateGetter = arr[0], callback = arr[1];
            return function (state, actions) {
                return {
                    pageData: $.extend({}, state.pageData, callback(stateGetter(state)))
                };
            };
        }, globalInject: function (x) {
            return function () {
                return x;
            };
        }
    }, function (state) {
        return state.currentView && state.currentView.apply(null, arguments);
    }, $("#app").get(0)
    );
});