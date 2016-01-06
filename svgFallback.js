/**
 * svgfallback.js 1.2
 *
 * Copyright 2016, Nicolas Bouvrette http://ca.linkedin.com/in/nicolasbouvrette/
 * Released under the WTFPL license - http://www.wtfpl.net/
 *
 * Supports:
 *
 *  - Browsers: IE6+, IE Edge (in IE8 emulation), Android Browser 2+ and any other browsers (which will bypass the script when unnecessary).
 *  - HTML: Image 'src' only
 *  - CSS: background-image only
 *  - Scope: 1 fallback type per HTML document
 *
 * Limitations are per design to keep the script small. Considering most devices support SVG nowadays
 * this is just a safe, lean and simple fallback for legacy browsers.
 *
 * Usage:
 *
 * Simply load this script in your HTML code and make sure that the fallback extension is the one
 * you prefer on the last line of the script (this is the parameter of the single
 * function of this script).
 *
 */
window.svgFallback = {

    /** @property Boolean - True if SVG images are natively supported, otherwise false. */
    svgIsSupported: (!!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', "svg").createSVGRect),

    /** @property String - The extension of the fallback image file when SVG is not supported. */
    fallbackExtension: 'png',
    /** @property RegExp - Regular expression used to find and replace SVG images in image URLs. */
    imgSrcRegExp: /^(.+)(\.svg)(\?.)*$/ig,
    /** @property RegExp - Regular expression used to find and replace SVG images in background image style URLs. */
    backgroundImageRegExp: /^url\(('|")?(.+)(\.svg)('|")?(\?.)*\)$/ig,

    /**
     * Is the element an image of type SVG?
     *
     * @param {Object} element - The HTML element.
     *
     * @returns {Boolean} True when the element is an image of type SVG, otherwise false.
     */
    isSvgImg: function (element) {
        return !!(element.nodeName.toLowerCase() == 'img' && element.src.match(this.imgSrcRegExp));
    },

    /**
     * Has the element a background image of type SVG?
     *
     * @param {HTMLElement} element - The HTML element.
     *
     * @returns {Boolean} True when the element is an image of type SVG, otherwise false.
     */
    hasSvgBackgroundImageStyle: function (element) {
        var backgroundImageStyle = this.getImageBackgroundStyle(element);
        return !!(backgroundImageStyle && backgroundImageStyle.match(this.backgroundImageRegExp));
    },

    /**
     * Get an image background style.
     *
     * @param {HTMLElement} element - The HTML element.
     *
     * @returns {Boolean|String} False if there is no defined style, otherwise return the style as a string.
     */
    getImageBackgroundStyle: function (element) {
        // Look for SVG extension on image background style (including IE8 fallback).
        var backgroundImageStyle = ((element.currentStyle) ? element.currentStyle.backgroundImage : null);
        backgroundImageStyle = ((!backgroundImageStyle && window.getComputedStyle) ?
            window.getComputedStyle(element).getPropertyValue('background-image') : backgroundImageStyle);
        if (!backgroundImageStyle || backgroundImageStyle == 'none') {
            return false;
        }
        return backgroundImageStyle;
    },

    /**
     * Are the requirements met to use this script?
     *
     * @param {Object} element - The HTML element.
     */
    meetsRequirement: function (element) {
        return (!this.svgIsSupported && (this.isSvgImg(element) || this.hasSvgBackgroundImageStyle(element)));
    },

    /**
     * Fallback a given HTML image element to the supported extension.
     *
     * @private
     *
     * @param {HTMLElement|HTMLImageElement} element              - The HTML element.
     * @param {String} [fallbackExtension=this.fallbackExtension] - the extension of the fall back image files.
     */
    fallbackImgSrc: function (element, fallbackExtension) {
        fallbackExtension = typeof fallbackExtension !== 'undefined' ? fallbackExtension : this.fallbackExtension;
        if (svgFallback.isSvgImg(element)) {
            element.src = element.src.replace(this.imgSrcRegExp, '$1.' + fallbackExtension + '$3');
        }
    },

    /**
     * Fallback a given HTML element's background image style to the supported extension.
     *
     * @private
     *
     * @param {HTMLElement} element                               - The HTML element.
     * @param {String} [fallbackExtension=this.fallbackExtension] - the extension of the fall back image files.
     */
    fallbackBackgroundImageStyle: function (element, fallbackExtension) {
        fallbackExtension = typeof fallbackExtension !== 'undefined' ? fallbackExtension : this.fallbackExtension;
        var backgroundImageStyle = this.getImageBackgroundStyle(element);
        if (backgroundImageStyle) {
            element.style.backgroundImage = backgroundImageStyle.replace(this.backgroundImageRegExp,
                'url($1$2.' + fallbackExtension + '$4$5)');
        }
    },

    /**
     * Fallback a given HTML element to the supported extension.
     *
     * @param {HTMLElement} element                               - The HTML element.
     * @param {String} [fallbackExtension=this.fallbackExtension] - the extension of the fall back image files.
     */
    fallbackElement: function (element, fallbackExtension) {
        fallbackExtension = typeof fallbackExtension !== 'undefined' ? fallbackExtension : this.fallbackExtension;
        this.fallbackImgSrc(element, fallbackExtension);
        this.fallbackBackgroundImageStyle(element, fallbackExtension);
    },

    /**
     * Fallback all SVG references to the supported extension.
     *
     * @private
     *
     * @param {String} [fallbackExtension=this.fallbackExtension] - the extension of the fall back image files.
     */
    fallbackAllSvg: function (fallbackExtension) {
        fallbackExtension = typeof fallbackExtension !== 'undefined' ? fallbackExtension : this.fallbackExtension;
        var elements = document.getElementsByTagName('*');
        for (var iterator = 0; iterator < elements.length; iterator++) {
            var element = elements[iterator];
            this.fallbackElement(element, fallbackExtension);
        }
    }
};

// Run this while document loads to speed up fallback process and avoid IE8 emulator mode blocking.
if (!svgFallback.svgIsSupported) {
    (function() {
        var interval = setInterval(function () {
            if (document.readyState == 'complete') {
                clearInterval(interval);
            }
            svgFallback.fallbackAllSvg();
        }, 1);
    })();
}
