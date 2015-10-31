/**
 * svgfallback.js 1.1
 *
 * Copyright 2015, Nicolas Bouvrette http://ca.linkedin.com/in/nicolasbouvrette/
 * Released under the WTFPL license - http://www.wtfpl.net/
 *
 * Supports:
 *
 *  - Browsers: IE6 and up, Android Browser 2 and up, any other browsers (which might bypass the script)
 *  - HTML: Image 'src' only
 *  - CSS: background-image only
 *  - Scope: 1 fallback type per HTML document
 *
 * Limitations are per design to keep the script small. Considering most devices support SVG nowadays
 * this is just a safe, lean and simple fallback for legacy browsers.

 * Usage:
 *
 * Simply load this script in your HTML code and make sure that the fallback extension is the one
 * you prefer on the last line of the script (this is the parameter of the single
 * function of this script).
 *
 * @param {string} fallBackExtension - the extension of the fall back image files.
 */
function SVGfallback(fallBackExtension) {
    // Check if SVG is supported
    if (!(!!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', "svg").createSVGRect)) {
        // Loop through all elements of the document
        for (var i = 0, a = document.getElementsByTagName('*'); i < a.length; i++) {
            // Replace 'src' in 'img' nodes when pointing to an SVG
            if (a[i].nodeName.toLowerCase() == 'img') {
                a[i].src = a[i].src.replace(/^(.+)(\.svg)(\?.)*$/ig, '$1.' + fallBackExtension + '$3');
            }
            // Replace 'background-image' style when pointing to an SVG
            var s = ((a[i].currentStyle) ? a[i].currentStyle.backgroundImage : null); // IE8
            s = ((!s && window.getComputedStyle) ? window.getComputedStyle(a[i]).getPropertyValue('background-image') : s); // Get style with IE8 fallback

            if (s && s != 'none') {
                a[i].style.backgroundImage = s.replace(/^url\(('|")?(.+)(\.svg)('|")?(\?.)*\)$/ig, 'url($1$2.' + fallBackExtension + '$4$5)');
            }
        }
    }
}

/**
 * Launch the fallback script after the page is loaded - default fallback extension is set to 'png'. Usually browsers
 * that do not support SVG (IE8 and lower) also do not support `addEventListener`. For Better overall supportability,
 * it is recommended to use an event listener Polyfill such as this one :
 *
 * https://github.com/nbouvrette/eventListenerPolyfill
 *
 * If you really insist in not using a more complete event listener Polyfill, you can uncomment the lines below and get
 * rid of the last line of this script:

if ((!window.addEventListener || !window.removeEventListener) && window.attachEvent && window.detachEvent) {
    window.attachEvent('onload', function(){SVGfallback('png')});
} else {
    window.addEventListener('load', function(){SVGfallback('png')});
}

 */
window.addEventListener('load', function(){SVGfallback('png')});
