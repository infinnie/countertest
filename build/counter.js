define("build/counter", ["jquery", "lib/h", "js/counterfunctions"], function ($, h, fns) {
    "use strict";

    return function (props) {
        return h(
            "p",
            null,
            h(
                "button",
                { "class": "btn counterBtn", type: "button", $click: fns.down(props.inject, props.name, props.value) },
                "\u2212"
            ),
            h(
                "span",
                { "class": "counterValue" },
                props.value
            ),
            h(
                "button",
                { "class": "btn counterBtn", type: "button", $click: fns.up(props.inject, props.name, props.value) },
                "+"
            )
        );
    };
});