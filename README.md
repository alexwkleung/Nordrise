# Nordrise

A CodeMirror 6 Markdown editor demo.

Code name: Nordrise.

This demo is a bit more rigid and slightly fine-tuned compared to my previous demo [Moonrise](https://github.com/alexwkleung/Moonrise). However there are some differences between them.

1) Uses TypeScript React + Vite instead of Electron + TypeScript.

2) It does not contain open or save functions, so you'll have to implement it yourself. Instead, I've added remark/rehype and katex plugins for a better Markdown experience out of the box.

3) The CSS is not as hack-y (and critically broken) compared to Moonrise.

4) Uses the Nord theme!