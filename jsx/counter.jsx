define("build/counter", [
    "jquery",
    "lib/h",
    "js/counterfunctions"
], function ($, h, fns) {
    "use strict";
    return function (props) {
        var inject = props.inject,
            name = props.name,
            prev = props.prev,
            value = props.value;
        return (<p>
            <button class="btn counterBtn" type="button" $click={fns.down(inject, name, prev, value)}>&minus;</button>
            <span class="counterValue">{prev[name]}</span>
            <button class="btn counterBtn" type="button" $click={fns.up(inject, name, prev, value)}>+</button>
        </p>);
    };
});