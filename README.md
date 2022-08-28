# Nordrise

A web-based CodeMirror 6 Markdown editor demo.

Code name: Nordrise.

This demo is a bit more rigid and slightly fine-tuned compared to my previous demo [Moonrise](https://github.com/alexwkleung/Moonrise). However there are some differences between them.

1) Uses TypeScript React + Vite instead of Electron + TypeScript. Since it's web-based, you don't need to install anything to try it out.

2) It does not contain open or save functions, so you'll have to implement it yourself. I've added Markdown enhancements via Remark, Rehype, and KaTeX plugins for an improved experience out of the box.

3) The CSS is not as hack-y (and critically broken) compared to Moonrise.

4) Based off the Nord theme!

Note: If you're planning to add Electron into this demo, there might be some issues when combining it with Vite. So if you don't want to go through the hassle to make it work, I recommend switching to Webpack + Babel as a fallback.