svgfallback
===========

### Tiny Javascript SVG Fallback for non supporting browsers

There isn't much to say about this script, the name says it all. Simply add the script on your page and make sure that all your SVG images have a fallback version and voilà. Unfortunately the downside is that you need to manually create the fallback version for all your SVG. Having said this, it's a small cost to support those browsers who aren't capable of reading SVG images.

_This script is stand alone and does not required any external library._

### Size

- Full version: 6.31kb (with all comments)
- Minified: 1.65kb (feel free to minify it yourself with tools such as http://jscompress.com/)
- Minified & Compressed: 0.79kb

### Supports
 - Browsers: IE6+, Android Browser 2+ and any other browsers which will bypass the script when unnecessary.
 - HTML: Image 'src' only
 - CSS: `background` and `backgroundImage` style properties.

Limitations are per design to keep the script small. Considering most devices support SVG nowadays this is just a safe, lean and simple fallback for legacy browsers.

### Usage

Simply load this script in your HTML code and make sure that the fallback extension is the one you prefer on the last line of the script (this is the parameter of the single function of this script).

Example

1) Make sure the fallback extension is the one you want by checking the `fallbackExtension` variable (it can also be overwritten if need be):

```javascript
fallbackExtension: 'png';
```

2) Add the script on your page:

```html
<script src="svgFallback.js"></script>
```

3) You're done - all you need to make sure is that each image, has the fallback version in the same path. For example, if you have /images/test.svg (using the default .png extension), you need to have /images/test.png available.

For best results, make sure the fallback image size is the same as the one selected for the .svg.
