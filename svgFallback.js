/**
 * svgfallback.js 1.5
 *
 * Copyright 2017, Nicolas Bouvrette http://ca.linkedin.com/in/nicolasbouvrette/
 * Released under the WTFPL license - http://www.wtfpl.net/
 *
 * Supports:
 *
 *  - Browsers: IE6+, Android Browser 2+ and any other browsers which will bypass the script when unnecessary.
 *  - HTML: Image 'src' only
 *  - CSS: Everything that uses '.svg' in selector rules.
 *
 * Limitations:
 *
 * - SVG using <object>, <iframe>, <embed>
 *
 * Usage:
 *
 * Simply load this script in your HTML code and make sure that the `fallbackExtension` extension is the one you prefer.
 */
window.svgFallback = {

    /** @property Boolean - True if SVG images are natively supported, otherwise false. */
    svgIsSupported: (!!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect),

    /** @property String - The extension of the fallback image file when SVG is not supported. */
    fallbackExtension: 'png',
    /** @property RegExp - Regular expression used to find and replace SVG images in image URLs. */
    urlRegExp: /^(.+)\.svg(\?.*)?$/ig,
    /** @property RegExp - Regular expression used to find and replace SVG images in stylesheets. */
    styleUrlRegExp: /(.*url\()(.*)\.svg((\?.*)?["']?\).*)/ig,

    /**
     * Fallback a given URL to the supported extension.
     *
     * @param {string} url                                        - The HTML element.
     * @param {string} [fallbackExtension=this.fallbackExtension] - the extension of the fall back image files.
     *
     * @returns {string} The URL with the supported extension.
     */
    fallbackUrl: function (url, fallbackExtension) {
        fallbackExtension = typeof fallbackExtension !== 'undefined' ? fallbackExtension : this.fallbackExtension;
        if (typeof url === 'string' && this.urlRegExp.test(url)) {
            return url.replace(this.urlRegExp, '$1.' + fallbackExtension + '$2');
        }
        return url;
    },

    /**
     * Fallback a given HTML image element to the supported extension.
     *
     * @param {HTMLElement|HTMLImageElement} element              - The HTML element.
     * @param {string} [fallbackExtension=this.fallbackExtension] - the extension of the fall back image files.
     */
    fallbackImgSrc: function (element, fallbackExtension) {
        fallbackExtension = typeof fallbackExtension !== 'undefined' ? fallbackExtension : this.fallbackExtension;
        element.src = this.fallbackUrl(element.src, fallbackExtension);
    },

    /**
     * Fallback a all stylesheets using SVG images to use the supported extension.
     *
     * @param {string} [fallbackExtension=this.fallbackExtension] - the extension of the fall back image files.
     */
    fallbackStyleSheets: function (fallbackExtension) {
        fallbackExtension = typeof fallbackExtension !== 'undefined' ? fallbackExtension : this.fallbackExtension;
        var styleSheets = document.styleSheets;
        for (var styleSheetId = 0; styleSheetId < styleSheets.length; styleSheetId++) {

            var styleSheet = styleSheets[styleSheetId];
            var rules = (styleSheet.cssRules) ? styleSheet.cssRules : styleSheet.rules;

            for (var ruleId = 0; ruleId < rules.length; ruleId++) {
                if (typeof rules[ruleId] !== 'undefined' && typeof rules[ruleId].style !== 'undefined') {
                    var rule = rules[ruleId];
                    this.fallbackStyleUrl(rule.style, 'background', fallbackExtension);
                    this.fallbackStyleUrl(rule.style, 'backgroundImage', fallbackExtension);
                }
            }
        }
    },

    /**
     * Fallback a all stylesheets using SVG images to use the supported extension.
     *
     * @param {CSSStyleDeclaration} style                         - the style declaration to fallback.
     * @param {string} property                                   - the style property to fallback.
     * @param {string} [fallbackExtension=this.fallbackExtension] - the extension of the fall back image files.
     */
    fallbackStyleUrl: function (style, property, fallbackExtension) {
        fallbackExtension = typeof fallbackExtension !== 'undefined' ? fallbackExtension : this.fallbackExtension;
        if (typeof style[property] === 'string' && style[property].length &&
            this.styleUrlRegExp.test(style[property])) {
            style[property] = style[property].replace(this.styleUrlRegExp, '$1$2.' + fallbackExtension + '$3');
        }
    },

    /**
     * Fallback all image source SVG references to the supported extension.
     *
     * @param {string} [fallbackExtension=this.fallbackExtension] - the extension of the fall back image files.
     */
    fallbackAllImgSrc: function (fallbackExtension) {
        fallbackExtension = typeof fallbackExtension !== 'undefined' ? fallbackExtension : this.fallbackExtension;
        var imageElements = document.querySelectorAll('img[src]');
        for (var imageElementId = 0; imageElementId < imageElements.length; imageElementId++) {
            var imageElement = imageElements[imageElementId];
            this.fallbackImgSrc(imageElement, fallbackExtension);
        }
    },

    /**
     * Fallback all elements supported by this script.
     *
     * @param {string} [fallbackExtension=this.fallbackExtension] - the extension of the fall back image files.
     */
    fallback: function (fallbackExtension) {
        fallbackExtension = typeof fallbackExtension !== 'undefined' ? fallbackExtension : this.fallbackExtension;
        svgFallback.fallbackAllImgSrc(fallbackExtension);
        svgFallback.fallbackStyleSheets(fallbackExtension);
    }
};

// Run this while document loads to speed up fallback process and avoid IE8 emulation mode blocking.
if (!svgFallback.svgIsSupported) {
    (function () {
        var delay = 1;
        var interval = setInterval(function () {
            svgFallback.fallback();

            if (document.readyState === 'complete') {
                clearInterval(interval);
                // Final run after document is loaded to prevent glitched in IE8 emulation mode.
                setTimeout(function () {
                    svgFallback.fallback();
                }, 1000);
            }

            delay = delay * 2;
        }, delay);
    })();
}
