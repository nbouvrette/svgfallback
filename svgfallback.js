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

if (window.addEventListener == undefined) {
    if (window.attachEvent) { // IE8 polyfill
        // Mimic the real function (useCapture is unused)
        window.addEventListener=function(type, listener, useCapture){
            type = 'on'+type;
            window.attachEvent(type, listener);
        }
    }
}

// Add event after page loads
window.addEventListener('load', function(){SVGfallback('png')}, false);
