define("build/main", ["jquery", "lib/h", "lib/app"], function ($, h, app) {
    var loadCounter = function (injectView) {
        define.requirePromise(["build/counter"]).then(function (arr) {
            var Counter = arr[0];
            injectView({
                pageData: {
                    first: 0,
                    second: 0
                }, currentView: function (state, actions) {
                    return (<div>
                        <h1>Counters</h1>
                        <p>First</p>
                        <Counter name="first" value={1} inject={actions.inject} pageData={state.pageData} />
                        <p>Second</p>
                        <Counter name="second" value={1} inject={actions.inject} pageData={state.pageData} />
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
                }}>Show counters</button>
            </p>);
        }
    }, {
            inject: function (x) {
                return function (state, actions) {
                    return { pageData: $.extend({}, state.pageData, x) };
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