"use strict";

class Dom {
    constructor(selector) {
        this.elements = Dom.getSelector(selector);
        this.element = this.get();
        return this;
    }

    /**
     * @description 获取元素
     */
    static getSelector(selector) {
        if (typeof selector === "string") {
            const idRegex = /^#(?:[\w-]|\\.|[^\x20-\xa0])*$/;
            if (idRegex.test(selector)) {
                const el = document.getElementById(selector.substring(1));
                return el ? [el] : [];
            }
            return [].slice.call(document.querySelectorAll(selector) || []);
        }
        if (this.isDom(selector)) {
            return [selector];
        }
        if (Array.isArray(selector)) {
            if (
                selector.filter((item) => {
                    return this.isDom(item);
                }).length === selector.length
            ) {
                return selector;
            }
        }
        return [];
    }

    /**
     * @description 验证是否是元素
     */
    static isDom(obj) {
        try {
            //Using W3 DOM2 (works for FF, Opera and Chrome)
            return obj instanceof HTMLElement;
        } catch (e) {
            //Browsers not supporting W3 DOM2 don't have HTMLElement and
            //an exception is thrown and we end up here. Testing some
            //properties that all elements have (works on IE7)
            return (
                typeof obj === "object" &&
                obj.nodeType === 1 &&
                typeof obj.style === "object" &&
                typeof obj.ownerDocument === "object"
            );
        }
    }

    /**
     * @description 获取元素
     */
    get(index = 0) {
        return this.elements[index];
    }

    /**
     * @description 获取父元素
     */
    parents(selector) {
        const parents = [];
        let el = this.element;
        while ((el = el.parentNode) && el !== document) {
            if (!selector || el.matches(selector)) parents.push(el);
        }
        return new Dom(parents);
    }

    /**
     * @description 遍历元素
     */
    each(func) {
        this.elements.forEach((el, index) => {
            func(el, index);
        });
        return this;
    }

    /**
     * @description 添加class
     */
    addClass(classNames = "") {
        this.each((el) => {
            classNames.split(" ").forEach((className) => {
                className && el.classList.add(className);
            });
        });
        return this;
    }

    /**
     * @description 获取/设置 innerHTML
     */
    html(html) {
        if (html === undefined) {
            if (!this.element) {
                return undefined;
            }
            return this.element.innerHTML;
        }
        this.each((el) => {
            el.innerHTML = html;
        });
        return this;
    }

    /**
     * @description  获取/设置 value
     */
    val(value) {
        if (value === undefined) {
            if (!this.element) {
                return undefined;
            }
            return this.element.value;
        }
        this.each((el) => {
            el.value = value;
        });
        return this;
    }

    /**
     * @description click事件
     */
    click(func) {
        if (func) {
            this.each((el) => {
                el.addEventListener("click", func, false);
            });
            return this;
        } else {
            this.element.click();
        }
    }

    /**
     * @description change事件
     */
    change(func) {
        this.each((el) => {
            el.addEventListener("change", func, false);
        });
        return this;
    }

    /**
     * @description 设置/获取属性
     */
    attr(attr, val) {
        if (val === undefined) {
            if (!this.element) {
                return undefined;
            }
            return this.element.getAttribute(attr) || undefined;
        }
        this.each((el) => {
            el.setAttribute(attr, val);
        });
        return this;
    }

    /**
     * @description 添加子元素
     * @param {HTMLElement} ele
     * @return {*}
     * @memberof Dom
     */
    append(ele) {
        this.each((el) => {
            el.appendChild(ele);
        });
        return this;
    }

    /**
     * @description 移除元素
     * @return {*}
     * @memberof Dom
     */
    remove() {
        this.each((el) => {
            el.remove();
        });
    }

    /**
     * @description 添加事件
     */
    on(eventName, selector, eventHandler) {
        if (typeof selector === "function") {
            eventHandler = selector;
            this.each((el) => {
                el.addEventListener(eventName, eventHandler);
            });
        } else {
            const wrappedHandler = (e) => {
                if (e.target && e.target.matches(selector)) {
                    eventHandler(e);
                }
            };
            this.each((el) => {
                el.addEventListener(eventName, wrappedHandler);
            });
        }
        return this;
    }
}

const $ry = (selector) => {
    return new Dom(selector);
};
