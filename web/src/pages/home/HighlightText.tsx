import React from 'react';

interface HighlightTextProps {
    text: string;
    direction: string;
    gradient: string;
}

const HighlightText: React.FC<HighlightTextProps> = ({ text, direction, gradient }) => {
    return (
        <span className={`font-bold text-transparent bg-clip-text ${direction} ${gradient}`}>
            {" "}
            {text}
            {" "}
        </span>
    );
};

export default HighlightText;
