declare module 'react-quill' {
    import React from 'react';

    export interface ReactQuillProps {
        value?: string;
        defaultValue?: string;
        readOnly?: boolean;
        theme?: string;
        modules?: any;
        formats?: string[];
        onChange?: (value: string, delta: any, source: any, editor: any) => void;
        placeholder?: string;
        className?: string;
        style?: React.CSSProperties;
    }

    class ReactQuill extends React.Component<ReactQuillProps> { }
    export default ReactQuill;
}
