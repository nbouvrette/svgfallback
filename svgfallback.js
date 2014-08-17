/*
 * svgfallback.js 1.0
 *
 * Copyright 2014, Nicolas Bouvrette http://ca.linkedin.com/in/nicolasbouvrette/
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
 *
 */

// Main function of this script which will be automatically bypassed if SVG is already supported
function SVGfallback(fallBackExtension) {
    // Check if SVG is supported
    if (!(!!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', "svg").createSVGRect)) {
        // Loop through all elements of the document
        for (var i=0, a=document.getElementsByTagName('*');i<a.length;i++) {
            // Replace 'src' in 'img' nodes when pointing to an SVG
            if (a[i].nodeName.toLowerCase() == 'img') {
                a[i].src = a[i].src.replace(/^(.+)(\.svg)(\?.)*$/ig, '$1.'+fallBackExtension+'$3');
            }
            // Replace 'background-image' style when pointing to an SVG
            var s = ((a[i].currentStyle) ? a[i].currentStyle.backgroundImage : null); // IE8
            s = ((!s && window.getComputedStyle) ? window.getComputedStyle(a[i]).getPropertyValue('background-image') : s); // Get style with IE8 fallback

            if (s && s != 'none') {
                a[i].style.backgroundImage = s.replace(/^url\(('|")?(.+)(\.svg)('|")?(\?.)*\)$/ig, 'url($1$2.'+fallBackExtension+'$4$5)');
            }
        }
    }
}

// Event loader (also will perform a basic polyfill legacy IE browsers)
if (window.addEventListener == undefined) {
    if (window.attachEvent) { // IE8 polyfill
        // Mimic the real function (useCapture is unused)
        window.addEventListener=function(type, listener, useCapture){
            type = 'on'+type;
            window.attachEvent(type, listener);
        }
    }
}

// Launch the fallback script after the page is loaded - default fallback extension is set to 'png'
window.addEventListener('load', function(){SVGfallback('png')}, false);
