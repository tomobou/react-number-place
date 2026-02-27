import React from 'react';

export interface HistoryViewProps {
    history: string[]
}

export class HistoryView extends React.Component<HistoryViewProps> {
    render() {
        let history = this.props.history.map((message, index) => (
            <div key={index}>{message}</div>
        ))
        return (
            <div className="history-view">
                {history}
            </div>
        )
    }
}
