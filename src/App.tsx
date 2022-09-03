import './styles/App.css'
import './styles/sidebar.css'
import './styles/editor.css'
import './styles/preview.css'
import './styles/katex.min.css'
import saveImg from './styles/icons/save.png'
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
import remarkEmoji from 'remark-emoji'
import remarkToc from 'remark-toc'
import rehypeKatex from 'rehype-katex'
import rehypeSlug from 'rehype-slug'
import simplePlantUML from '@akebifiky/remark-simple-plantuml'
import 'katex/dist/contrib/mhchem'
import { saveAs } from 'file-saver'

export default function App() {
    //useref hook
    const editorRef = useRef(null);

    //usestate hook
    const [editorStateChange, setEditorStateChange] = useState("");

    //listener (editorview)
    const editorListener = EditorView.updateListener.of((event) => {
        setEditorStateChange(event.state.doc.toString());
    });

    //useeffect hook
    useEffect(() => {
        //editor state
        const editorState: EditorState = EditorState.create({
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

        //editor view
        const editorView: EditorView = new EditorView({
            doc: '',
            state: editorState,
            parent: editorRef.current!,
        });

        //destroy editorview in dom
        return (): void => {
            editorView.destroy();
        }
    }, [editorRef.current]); //dependency array

    //save 
    const save = () => {
        let blob = new Blob([editorStateChange.toString()], { type: "text/plain;charset=utf-8" });
        saveAs(blob, "nordrise.md");
    }

    return (
        <Fragment>
            <div id="sidebarContainer">
                <button id="save" onClick={save}><img src={saveImg}></img></button>
            </div>

            <div id="editorContainer">
                <div id="editor" ref={editorRef}></div>
            </div>

            <div id="previewContainer">
                <div id="preview">
                    <ReactMarkdown children={editorStateChange} skipHtml={true} remarkPlugins={[remarkGfm, remarkMath, remarkToc, [remarkEmoji, {emoticon: true}], simplePlantUML]} rehypePlugins={[rehypeKatex, rehypeSlug]} components={{
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