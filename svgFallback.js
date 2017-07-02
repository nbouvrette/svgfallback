/**
 * svgfallback.js 1.4
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
    imgSrcRegExp: /^(.+)(\.svg)(\?.)*$/ig,
    /** @property RegExp - Regular expression used to find and replace SVG images in stylesheets. */
    stylesheetRegExp: /([\w]+)(\.svg)([')"])/ig,

    /**
     * Is the element an image of type SVG?
     *
     * @param {Object} element - The HTML element.
     *
     * @returns {Boolean} True when the element is an image of type SVG, otherwise false.
     */
    isSvgImg: function (element) {
        return this.imgSrcRegExp.test(element.src);
    },

    /**
     * Fallback a given HTML image element to the supported extension.
     *
     * @param {HTMLElement|HTMLImageElement} element              - The HTML element.
     * @param {String} [fallbackExtension=this.fallbackExtension] - the extension of the fall back image files.
     */
    fallbackImgSrc: function (element, fallbackExtension) {
        fallbackExtension = typeof fallbackExtension !== 'undefined' ? fallbackExtension : this.fallbackExtension;
        if (this.isSvgImg(element)) {
            element.src = element.src.replace(this.imgSrcRegExp, '$1.' + fallbackExtension + '$3');
        }
    },

    /**
     * Fallback a all stylesheets using SVG images to use the supported extension.
     *
     * @param {String} [fallbackExtension=this.fallbackExtension] - the extension of the fall back image files.
     */
    fallbackStyleSheets: function (fallbackExtension) {
        fallbackExtension = typeof fallbackExtension !== 'undefined' ? fallbackExtension : this.fallbackExtension;
        var styleSheets = document.styleSheets;
        for (var iterator = 0; iterator < styleSheets.length; iterator++) {
            var styleSheet = styleSheets[iterator];
            if (this.stylesheetRegExp.test(styleSheet.cssText)) {
                styleSheet.cssText = styleSheet.cssText.replace(this.stylesheetRegExp, '$1.' + fallbackExtension + '$3');
            }
        }
    },

    /**
     * Fallback all image source SVG references to the supported extension.
     *
     * @param {String} [fallbackExtension=this.fallbackExtension] - the extension of the fall back image files.
     */
    fallbackAllImgSrc: function (fallbackExtension) {
        fallbackExtension = typeof fallbackExtension !== 'undefined' ? fallbackExtension : this.fallbackExtension;
        var elements = document.querySelectorAll('img[src]');
        for (var iterator = 0; iterator < elements.length; iterator++) {
            var element = elements[iterator];
            this.fallbackImgSrc(element, fallbackExtension);
        }
    },

    /**
     * Fallback all elements supported by this script.
     *
     * @param {String} [fallbackExtension=this.fallbackExtension] - the extension of the fall back image files.
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
