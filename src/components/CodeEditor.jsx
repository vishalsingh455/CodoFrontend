import Editor from "@monaco-editor/react";

const CodeEditor = ({ language, code, setCode }) => {
    return (
        <div className="border border-gray-800 rounded-lg overflow-hidden">
            <Editor
                height="400px"
                language={language}
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value)}
                options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false
                }}
            />
        </div>
    );
};

export default CodeEditor;
