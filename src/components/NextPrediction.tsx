import React from 'react';

export interface NextPredictionProps {
    onClick: () => void,
    predictText: string
}

export function NextPrediction(props: NextPredictionProps) {
    return (
        <div>
            <button className="next-prediction" onClick={props.onClick}>next</button>
            <span className="next-prediction-text">{props.predictText}</span>
        </div>
    )
}
