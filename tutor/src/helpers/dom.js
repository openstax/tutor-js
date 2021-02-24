import { get } from 'lodash';
/**
 * Utility functions to make DOM manipulation easier.
 */

const NODE_TYPE = {
    ELEMENT_NODE: 1,
    TEXT_NODE: 3,
};

export default function dom(el) {

    return {

        get el() {
            return el;
        },
        /**
     * Adds class to element.
     * @param {string} className
     */
        addClass(className) {
            if (el.classList) {
                el.classList.add(className);
            } else {
                el.className += ' ' + className;
            }
        },

        /**
     * Removes class from element.
     * @param {string} className
     */
        removeClass(className) {
            if (el.classList) {
                el.classList.remove(className);
            } else {
                el.className = el.className.replace(
                    new RegExp('(^|\\b)' + className + '(\\b|$)', 'gi'), ' '
                );
            }
        },

        /**
     * Prepends child nodes to base element.
     * @param {Node[]} nodesToPrepend
     */
        prepend(nodesToPrepend) {
            var nodes = Array.prototype.slice.call(nodesToPrepend),
                i = nodes.length;

            while (i--) {
                el.insertBefore(nodes[i], el.firstChild);
            }
        },

        /**
     * Appends child nodes to base element.
     * @param {Node[]} nodesToAppend
     */
        append(nodesToAppend) {
            var nodes = Array.prototype.slice.call(nodesToAppend);

            for (var i = 0, len = nodes.length; i < len; ++i) {
                el.appendChild(nodes[i]);
            }
        },

        /**
     * Inserts base element after refEl.
     * @param {Node} refEl - node after which base element will be inserted
     * @returns {Node} - inserted element
     */
        insertAfter(refEl) {
            return refEl.parentNode.insertBefore(el, refEl.nextSibling);
        },

        /**
     * Inserts base element before refEl.
     * @param {Node} refEl - node before which base element will be inserted
     * @returns {Node} - inserted element
     */
        insertBefore(refEl) {
            return refEl.parentNode.insertBefore(el, refEl);
        },

        /**
     * Removes base element from DOM.
     */
        remove() {
            el.parentNode.removeChild(el);
            el = null;
        },

        /**
     * Returns true if base element contains given child.
     * @param {Node|HTMLElement} child
     * @returns {boolean}
     */
        contains(child) {
            return el !== child && el.contains(child);
        },

        /**
     * Wraps base element in wrapper element.
     * @param {HTMLElement} wrapper
     * @returns {HTMLElement} wrapper element
     */
        wrap(wrapper) {
            if (el.parentNode) {
                el.parentNode.insertBefore(wrapper, el);
            }

            wrapper.appendChild(el);
            return wrapper;
        },

        /**
     * Unwraps base element.
     * @returns {Node[]} - child nodes of unwrapped element.
     */
        unwrap() {
            var nodes = Array.prototype.slice.call(el.childNodes),
                wrapper;

            nodes.forEach(function (node) {
                wrapper = node.parentNode;
                dom(node).insertBefore(node.parentNode);
                dom(wrapper).remove();
            });

            return nodes;
        },

        /**
     * Returns array of base element parents.
     * @returns {HTMLElement[]}
     */
        parents() {
            var parent, path = [];
            while ((parent = el.parentNode)) {
                path.push(parent);
                el = parent;
            }
            return path;
        },

        /**
     * Normalizes text nodes within base element, ie. merges sibling text nodes and assures that every
     * element node has only one text node.
     * It should does the same as standard element.normalize, but IE implements it incorrectly.
     */
        normalizeTextNodes() {
            if (!el) {
                return;
            }

            if (el.nodeType === NODE_TYPE.TEXT_NODE) {
                while (el.nextSibling && el.nextSibling.nodeType === NODE_TYPE.TEXT_NODE) {
                    el.nodeValue += el.nextSibling.nodeValue;
                    el.parentNode.removeChild(el.nextSibling);
                }
            } else {
                dom(el.firstChild).normalizeTextNodes();
            }
            dom(el.nextSibling).normalizeTextNodes();
        },

        /**
     * Returns element background color.
     * @returns {CSSStyleDeclaration.backgroundColor}
     */
        color() {
            return get(el, 'style.backgroundColor');
        },

        /**
     * Creates dom element from given html string.
     * @param {string} html
     * @returns {NodeList}
     */
        fromHTML(html) {
            const div = document.createElement('div');
            div.innerHTML = html;
            return div.childNodes;
        },

        /**
     * Returns first range of the window of base element.
     * @returns {Range}
     */
        getRange() {
            var selection = dom(el).getSelection(),
                range;

            if (selection.rangeCount > 0) {
                range = selection.getRangeAt(0);
            }

            return range;
        },

        /**
     * Removes all ranges of the window of base element.
     */
        removeAllRanges() {
            var selection = dom(el).getSelection();
            selection.removeAllRanges();
        },

        /**
     * Returns selection object of the window of base element.
     * @returns {Selection}
     */
        getSelection() {
            return dom(el).getWindow().getSelection();
        },

        /**
     * Returns window of the base element.
     * @returns {Window}
     */
        getWindow() {
            return dom(el).getDocument().defaultView;
        },

        /**
     * Returns document of the base element.
     * @returns {HTMLDocument}
     */
        getDocument() {
            // if ownerDocument is null then el is the document itself.
            return el.ownerDocument || el;
        },

        matches(selector) {
            const method = el.matches || el.mozMatchesSelector || el.msMatchesSelector || el.oMatchesSelector || el.webkitMatchesSelector;
            return (method != null ? method.call(el, selector) : undefined);
        },

        isParent(node, options) {
            if (options == null) { options = { matchSame: true }; }
            if (!parent) { return false; }
            if (options.matchSame && (node === el)) { return true; }
            node = node.parentNode;
            while (node) {
                if (node === el) { return true; }
                node = node.parentNode;
            }
            return false;
        },

        closest(selector) {
            if (this.matches(selector)) {
                return el;
            } else {
                return el.parentNode ? dom(el.parentNode).closest(selector) : null;
            }
        },

        farthest(selector) {
            const thisMatches = this.matches(selector);

            if (el.parentNode && thisMatches) {
                return dom(el.parentNode).farthest(selector) || el;
            } else if (el.parentNode) {
                return dom(el.parentNode).farthest(selector);
            } else {
                return thisMatches ? el : null;
            }
        },


        get boundingClientRect() {
            const rect = el.getBoundingClientRect();
            const wLeft = window.pageXOffset;
            const wTop = window.pageYOffset;
            return {
                bottom: rect.bottom + wTop,
                top: rect.top + wTop,
                left: rect.left + wLeft,
                right: rect.right + wLeft,
            };
        },

        hideOverflow(on = true) {
            on ? this.addClass('hide-overflow') : this.removeClass('hide-overflow');
        },

    };

}


export function read_csrf() {
    const meta = document.querySelector('meta[name=csrf-token]');
    return meta ? meta.getAttribute('content') : '';
}

export function documentReady() {
    if (document.readyState != 'loading'){
        return Promise.resolve();
    } else {
        return new Promise((resolve) => {
            document.addEventListener('DOMContentLoaded', resolve);
        });
    }
}
