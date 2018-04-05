define("build/counter", [
    "jquery",
    "lib/h",
    "js/counterfunctions"
], function ($, h, fns) {
    "use strict";
    return function (props) {
        return (<p>
            <button class="btn counterBtn" type="button" $click={fns.down(props.inject, props.name, props.value)}>&minus;</button>
            <span class="counterValue">{props.value}</span>
            <button class="btn counterBtn" type="button" $click={fns.up(props.inject, props.name, props.value)}>+</button>
        </p>);
    };
});