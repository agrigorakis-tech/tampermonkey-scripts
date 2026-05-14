(function mitosDOM() {
    'use strict';

    window.MITOS = window.MITOS || {};
    MITOS.dom = MITOS.dom || {};
    MITOS.dom.observer = MITOS.dom.observer || {};

    //
	const now = new Date();
	const dateTime = now.toLocaleString('en-GB');
	console.log(`🧩 ${dateTime} [INFO] [GitHub] DOM module loaded`);
    
    MITOS.dom.observer.element = function observeElement(selector, callback = null) {
        const currentStack = new Error().stack;

        if (!selector) {
            MITOS.log.warn("Observer selector not provided");
            return;
        }

        if(callback != null && typeof callback !== 'function') {
            MITOS.log.warn("Observer callback is invalid", currentStack);
            return;
        }

        // Check if already available
        const el = document.querySelector(selector);
        if (el) {
            //MITOS.log.info(`Element <${selector}> is available`, currentStack);
            callback(el);
            return;
        }

        const observer = new MutationObserver((_, obs) => {
            const el = document.querySelector(selector);
            if (!el) {
                //MITOS.log.warn("Observer element (" + selector + ") was not found");
                return;
            }

            // Unregister
            obs.disconnect();

            //MITOS.log.info(`Element <${selector}> became available`, currentStack);
            callback(el);
        });

        observer.observe(document.body, { childList: true, subtree: true });
    };

    MITOS.dom.observer.attribute = function observeAttribute(selector, attributeName, callback = null) {
        const currentStack = new Error().stack;

        if (!selector) {
            MITOS.log.warn("Observer selector not provided", currentStack);
            return;
        }
        if (!attributeName) {
            MITOS.log.warn("Observer attribute not provided", currentStack);
            return;
        }
        if (callback != null && typeof callback !== "function") {
            MITOS.log.warn("Observer callback is invalid", currentStack);
            return;
        }

        // Observer element
        MITOS.dom.observer.element(selector, el => {

            // Check if already available
            const value = el.getAttribute(attributeName);
            if (value && !value.includes('{{')) {
                MITOS.log.info(`Element <${selector}> attribute <${attributeName}> is available`, currentStack);
                if(callback) {
                    callback(value, el);
                }
                return;
            }

            // Observe attribute
            const observer = new MutationObserver(mutations => {
                for (const mutation of mutations) {
                    if (mutation.type === "attributes" && mutation.attributeName === attributeName) {
                        const val = el.getAttribute(attributeName);
                        if (val && !val.includes('{{')) {
                            // Unregister
                            observer.disconnect();

                            MITOS.log.info(`Element <${selector}> attribute <${attributeName}> became available`, "MITOS.dom.observer.attribute", currentStack);
                            if(callback) {
                                callback(value, el);
                            }
                        }
                    }
                }
            });

            observer.observe(el, { attributes: true, attributeFilter: [attributeName] });
        });
    };

    MITOS.dom.elementExists = function(selector) {
        if(!selector) {
            MITOS.log.warn("Element selector not provided");
            return;
        }

        try {
            return document.querySelector(selector) !== null;
        } 
        catch (err) {
            return false;
        }
    }

    MITOS.dom.css = function injectCSS(content, id) {

        if (!content) {
            MITOS.log.warn("CSS was not provided");
            return;
        }

        const head = document.head || document.getElementsByTagName("head")[0];

        if (!head) {
            MITOS.log.error("Document <head> was not found");
            return;
        }

        // Prevent duplicate injection (if id provided)
        if (id && document.getElementById(id)) {
            MITOS.log.info("CSS <" + id + "> already exists");
            return;
        }

        const style = document.createElement("style");

        if(id) {
            // Set CSS Style ID
            style.id = id;
        }

        style.type = "text/css";
        style.textContent = content;

        head.appendChild(style);
        MITOS.log.info("CSS injected: <" + (id ? id : "") + ">");
    }

    MITOS.dom.html = function injectHTML(selector, placement, content, callback) {
        const currentStack = new Error().stack;

        MITOS.dom.observer.element(selector, function (target) {

            if (!target) {
                MITOS.log.error("Element <" + selector + "> was not found", currentStack);
                return;
            }

            try {
                // Inject HTML
                if(placement === "replace") {
                    target.innerHTML = content;
                }
                else {
                    target.insertAdjacentHTML(placement, content);
                }

                MITOS.log.info("HTML injected <" + selector + " | " + placement + ">", currentStack);

                // Optional Callback
                if (typeof callback === "function") {
                    callback(target);
                }

            } 
            catch (err) {
                MITOS.log.error("HTML injection failed <" + selector + " | " + err + ">", currentStack);
            }
        });
    }

    MITOS.dom.updateHTML = function updateHTML(selector, value) {
        if (!selector) {
            MITOS.log.warn("Element selector not provided");
            return;
        }

        if (!value) {
            MITOS.log.warn("Element value not provided");
            return;
        }

        MITOS.dom.observer.element(selector, el => {
            el.innerHTML = value;
            MITOS.log.info(`Updated element (value) <${selector} | ${value}>`);
        });
    };

    MITOS.dom.updateAttribute = function updateAttribute(selector, attributeName, value) {
        if (!selector) {
            MITOS.log.warn("Element selector not provided");
            return;
        }

        if (!attributeName) {
            MITOS.log.warn("Element attribute name not provided");
            return;
        }

         if (!value) {
            MITOS.log.warn("Element attribute value not provided");
            return;
        }

        MITOS.dom.observer.element(selector, el => {
            el.setAttribute(attributeName, value);
            MITOS.log.info(`Updated element (attribute) <${selector} | ${attributeName} | ${value}>`);
        });
    };
})();
