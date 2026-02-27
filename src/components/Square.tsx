import React from 'react';

export interface SquareProps {
    onClick: () => void,
    value: string
}

export class Square extends React.Component<SquareProps> {
    render() {
        return (
            <button className="square" onClick={this.props.onClick}>
                {this.props.value}
            </button>
        );
    }
}
