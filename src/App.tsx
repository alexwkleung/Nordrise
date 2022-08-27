import React, { useState, useEffect, useRef, Fragment } from 'react'
import { EditorState } from '@codemirror/state'
import { EditorView, keymap, rectangularSelection, drawSelection, highlightActiveLine, lineNumbers } from '@codemirror/view'
import { defaultKeymap, indentWithTab, history, historyKeymap } from '@codemirror/commands'
import { markdown, markdownLanguage } from '@codemirror/lang-markdown'
import { languages } from '@codemirror/language-data'
import { syntaxHighlighting } from '@codemirror/language'
import { nordTheme, nordHighlightStyle } from './codemirror-theme/theme'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import remarkToc from 'remark-toc'

export default function App() {
    const editorRef = useRef(null);

    const [editorStateChange, setEditorStateChange] = useState("");

    const editorListener = EditorView.updateListener.of((event) => {
        setEditorStateChange(event.state.doc.toString());
    });

    useEffect(() => {
        const editorState = EditorState.create({
            extensions: [
                markdown({
                    base: markdownLanguage,
                    codeLanguages: languages,
                }),
                rectangularSelection(),
                history(),
                drawSelection(),
                syntaxHighlighting(nordHighlightStyle, { fallback: true }),
                highlightActiveLine(),
                lineNumbers(),
                keymap.of([
                    ...defaultKeymap, 
                    ...[indentWithTab], 
                    ...historyKeymap
                ]),
                editorListener,
                nordTheme,
            ]
        }); 

        const editorView = new EditorView({
            doc: '',
            state: editorState,
            parent: editorRef.current!,
        });

        return () => {
            editorView?.destroy();
        }
    }, [editorRef.current]);

    return (
        <Fragment>
            <div id="editorContainer">
                <div id="editor" ref={editorRef}></div>
            </div>

            <div id="previewContainer">
                <div id="preview">
                    <ReactMarkdown children={editorStateChange} remarkPlugins={[remarkGfm, remarkMath, remarkToc]} rehypePlugins={[rehypeKatex]} components={{
                        code({node, inline, className, children, ...props}) {
                        const match = /language-(\w+)/.exec(className || '')
                        return !inline && match ? (
                        <SyntaxHighlighter
                            children={String(children).replace(/\n$/, '')}
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                            />
                            ) : (
                                <code className={className} {...props}>
                                    {children}
                                </code>
                                )
                            }
                        }}></ReactMarkdown>
                </div>
            </div>
        </Fragment>
    );
}