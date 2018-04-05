define("lib/app", ["jquery"], function ($) {
    var _guid = 0, lookUp = {}, eventLookUp = {};
    return function (state, actions, view, container) {
        var rootElement = (container && container.children[0]) || null
        var oldNode = rootElement && recycleElement(rootElement)
        var lifecycle = []
        var skipRender
        var isRecycling = true
        var globalState = clone(state)
        var wiredActions = wireStateToActions([], globalState, clone(actions))

        scheduleRender()

        return wiredActions

        function recycleElement(element) {
            return {
                nodeName: element.nodeName.toLowerCase(),
                attributes: {},
                children: $.map(element.childNodes, function (element) {
                    return element.nodeType === 3 // Node.TEXT_NODE
                        ? element.nodeValue
                        : recycleElement(element)
                })
            }
        }

        function resolveNode(node) {
            return typeof node === "function"
                ? resolveNode(node(globalState, wiredActions))
                : node != null ? node : ""
        }

        function render() {
            skipRender = !skipRender

            var node = resolveNode(view)

            if (container && !skipRender) {
                rootElement = patch(container, rootElement, oldNode, (oldNode = node))
            }

            isRecycling = false

            while (lifecycle.length) lifecycle.pop()()
        }

        function scheduleRender() {
            if (!skipRender) {
                skipRender = true
                setTimeout(render)
            }
        }

        function clone(target, source) {
            var out = {}

            for (var i in target) out[i] = target[i]
            for (var i in source) out[i] = source[i]

            return out
        }

        function setPartialState(path, value, source) {
            var target = {}
            if (path.length) {
                target[path[0]] =
                    path.length > 1
                        ? setPartialState(path.slice(1), value, source[path[0]])
                        : value
                return clone(source, target)
            }
            return value
        }

        function getPartialState(path, source) {
            var i = 0
            while (i < path.length) {
                source = source[path[i++]]
            }
            return source
        }

        function wireStateToActions(path, state, actions) {
            for (var key in actions) {
                typeof actions[key] === "function"
                    ? (function (key, action) {
                        actions[key] = function (data) {
                            var result = action(data)

                            if (typeof result === "function") {
                                result = result(getPartialState(path, globalState), actions)
                            }

                            if (
                                result &&
                                result !== (state = getPartialState(path, globalState)) &&
                                !result.then // !isPromise
                            ) {
                                scheduleRender(
                                    (globalState = setPartialState(
                                        path,
                                        clone(state, result),
                                        globalState
                                    ))
                                )
                            }

                            return result
                        }
                    })(key, actions[key])
                    : wireStateToActions(
                        path.concat(key),
                        (state[key] = clone(state[key])),
                        (actions[key] = clone(actions[key]))
                    )
            }

            return actions
        }

        function getKey(node) {
            return node ? node.key : null
        }

        function eventListener(event) {
            return event.currentTarget.events[event.type](event)
        }

        function updateAttribute(element, name, value, oldValue, isSvg) {
            var tempName, guid;
            if (name === "key") {
            } else if (name === "style") {
                for (var i in clone(oldValue, value)) {
                    var style = value == null || value[i] == null ? "" : value[i]
                    if (i[0] === "-") {
                        element[name].setProperty(i, style)
                    } else {
                        element[name][i] = style
                    }
                }
            } else if (name === "class") {
                element.className = value || "";
            } else {
                if (name.charAt(0) === "$") {
                    tempName = name.slice(1) + ".app";
                    guid = $(element).attr("data-unique-id");
                    if (typeof guid === "undefined") {
                        guid = _guid;
                        $(element).attr("data-unique-id", guid);
                        _guid++;
                    }
                    lookUp[guid] = lookUp[guid] || {};
                    lookUp[guid][tempName] = value;

                    if (name === "$input" && typeof element.addEventListener === "undefined") {
                        if (value) {
                            if (!oldValue) {
                                $(element).on("propertychange.app", function () {
                                    $(this).trigger("input.app");
                                });
                            }
                        } else {
                            $(element).off("propertychange.app");
                        }
                    }
                    if (!eventLookUp[tempName]) {
                        eventLookUp[tempName] = true;
                        $(document).on(tempName, "[data-unique-id]", function () {
                            var guid = $(this).attr("data-unique-id");
                            if (lookUp[guid] && typeof lookUp[guid][tempName] === "function") {
                                return lookUp[guid][tempName].apply(this, arguments);
                            }
                        });
                    }
                } else if (name in element && name !== "list" && !isSvg) {
                    try {
                        element[name] = value == null ? "" : value
                    } catch (x) {
                        element.setAttribute(name, value)
                    }
                } else if (value != null && value !== false) {
                    element.setAttribute(name, value)
                }

                if (value == null || value === false) {
                    element.removeAttribute(name)
                }
            }
        }

        function createElement(node, isSvg) {
            var element =
                typeof node === "string" || typeof node === "number"
                    ? document.createTextNode(node)
                    : (isSvg = isSvg || node.nodeName === "svg")
                        ? document.createElementNS(
                            "http://www.w3.org/2000/svg",
                            node.nodeName
                        )
                        : document.createElement(node.nodeName)

            var attributes = node.attributes
            if (attributes) {
                if (attributes.oncreate) {
                    lifecycle.push(function () {
                        attributes.oncreate(element)
                    })
                }

                for (var i = 0; i < node.children.length; i++) {
                    element.appendChild(
                        createElement(
                            (node.children[i] = resolveNode(node.children[i])),
                            isSvg
                        )
                    )
                }

                for (var name in attributes) {
                    updateAttribute(element, name, attributes[name], null, isSvg)
                }
            }

            return element
        }

        function updateElement(element, oldAttributes, attributes, isSvg) {
            for (var name in clone(oldAttributes, attributes)) {
                if (
                    attributes[name] !==
                    (name === "value" || name === "checked"
                        ? element[name]
                        : oldAttributes[name])
                ) {
                    updateAttribute(
                        element,
                        name,
                        attributes[name],
                        oldAttributes[name],
                        isSvg
                    )
                }
            }

            var cb = isRecycling ? attributes.oncreate : attributes.onupdate
            if (cb) {
                lifecycle.push(function () {
                    cb(element, oldAttributes)
                })
            }
        }

        function removeChildren(element, node) {
            var attributes = node.attributes
            if (attributes) {
                for (var i = 0; i < node.children.length; i++) {
                    removeChildren(element.childNodes[i], node.children[i])
                }

                if (attributes.ondestroy) {
                    attributes.ondestroy(element)
                }
            }
            return element
        }

        function removeElement(parent, element, node) {
            function done() {
                parent.removeChild(removeChildren(element, node));
                $(element).find("[data-unique-id]").andSelf().each(function () {
                    var guid = $(this).attr("data-unique-id");
                    if (lookUp[guid]) {
                        delete lookUp[guid];
                    }
                });
            }

            var cb = node.attributes && node.attributes.onremove
            if (cb) {
                cb(element, done)
            } else {
                done()
            }
        }

        function patch(parent, element, oldNode, node, isSvg) {
            if (node === oldNode) {
            } else if (oldNode == null || oldNode.nodeName !== node.nodeName) {
                var newElement = createElement(node, isSvg)
                parent.insertBefore(newElement, element)

                if (oldNode != null) {
                    removeElement(parent, element, oldNode)
                }

                element = newElement
            } else if (oldNode.nodeName == null) {
                element.nodeValue = node
            } else {
                updateElement(
                    element,
                    oldNode.attributes,
                    node.attributes,
                    (isSvg = isSvg || node.nodeName === "svg")
                )

                var oldKeyed = {}
                var newKeyed = {}
                var oldElements = []
                var oldChildren = oldNode.children
                var children = node.children

                for (var i = 0; i < oldChildren.length; i++) {
                    oldElements[i] = element.childNodes[i]

                    var oldKey = getKey(oldChildren[i])
                    if (oldKey != null) {
                        oldKeyed[oldKey] = [oldElements[i], oldChildren[i]]
                    }
                }

                var i = 0
                var k = 0

                while (k < children.length) {
                    var oldKey = getKey(oldChildren[i])
                    var newKey = getKey((children[k] = resolveNode(children[k])))

                    if (newKeyed[oldKey]) {
                        i++
                        continue
                    }

                    if (newKey == null || isRecycling) {
                        if (oldKey == null) {
                            patch(element, oldElements[i], oldChildren[i], children[k], isSvg)
                            k++
                        }
                        i++
                    } else {
                        var keyedNode = oldKeyed[newKey] || []

                        if (oldKey === newKey) {
                            patch(element, keyedNode[0], keyedNode[1], children[k], isSvg)
                            i++
                        } else if (keyedNode[0]) {
                            patch(
                                element,
                                element.insertBefore(keyedNode[0], oldElements[i]),
                                keyedNode[1],
                                children[k],
                                isSvg
                            )
                        } else {
                            patch(element, oldElements[i], null, children[k], isSvg)
                        }

                        newKeyed[newKey] = children[k]
                        k++
                    }
                }

                while (i < oldChildren.length) {
                    if (getKey(oldChildren[i]) == null) {
                        removeElement(element, oldElements[i], oldChildren[i])
                    }
                    i++
                }

                for (var i in oldKeyed) {
                    if (!newKeyed[i]) {
                        removeElement(element, oldKeyed[i][0], oldKeyed[i][1])
                    }
                }
            }
            return element
        }
    };
});