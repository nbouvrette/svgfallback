svgfallback
===========

### Tiny Javascript SVG Fallback for non supporting browsers

There isn't much to say about this script, the name says it all. Simply add the script on your page and make sure that all your SVG images have a fallback version and voilà. Unfortunately the downside is that you need to manually create the fallback version for all your SVG. Having said this, it's a small cost to support those browsers who aren't capable of reading SVG images.

_This script is stand alone and does not required any external library._

Since version 1.1 (including the minified version), `window.addEventListener` is no longer Polyfilled by default. It is suggested to use a more complete Polyfill such as [eventListenerPolyfill](https://github.com/nbouvrette/eventListenerPolyfill) for better overall supportability. Otherwise it is possible to use the minified version (`svgfallbackWithAttachEvent.min.js`) including IE6-IE8 support without using an event listerner Polyfill.

### Size

- Full version: 2.5k 
- Minified: 0.65k
- Minified & Compressed: 0.53k

### Supports
 - Browsers: IE6 and up, Android Browser 2 and up, any other browsers (which might bypass the script)
 - HTML: Image 'src' only
 - CSS: background-image only
 - Scope: 1 fallback type per HTML document

Limitations are per design to keep the script small. Considering most devices support SVG nowadays this is just a safe, lean and simple fallback for legacy browsers.

### Usage

Simply load this script in your HTML code and make sure that the fallback extension is the one you prefer on the last line of the script (this is the parameter of the single function of this script).

Example

1) Add the script on your page:

	<script src="svgfallback.js"></script>

2) Make sure the fallback extension is the one you want (last line of the script):

	window.addEventListener('load', SVGfallback('png'));

3) You're done - all you need to make sure is that each image, has the fallback version in the same path. For example, if you have /images/test.svg (using the default .png extension), you need to have /images/test.png available.

For best results, make sure the fallback image size is the same as the one selected for the .svg
