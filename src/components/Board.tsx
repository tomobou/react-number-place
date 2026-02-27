import React from 'react';
import { Square } from './Square';

export interface BoardProps {
    onClick: (row: number, col: number) => void,
    squares: string[][]
}

export class Board extends React.Component<BoardProps> {
    renderBoardRow(row: number, startCol: number) {
        const blockSize = 3
        return (
            <div className="board-row">
                {this.renderBlock(row, startCol)}
                {this.renderBlock(row, startCol + blockSize * 1)}
                {this.renderBlock(row, startCol + blockSize * 2)}
            </div>
        );
    }
    renderBlock(startRow: number, col: number) {
        return (
            <div className="board-block">
                {this.renderBlockRow(startRow, col)}
                {this.renderBlockRow(startRow + 1, col)}
                {this.renderBlockRow(startRow + 2, col)}
            </div>
        );
    }
    renderBlockRow(row: number, startCol: number) {
        return (
            <div className="block-row">
                {this.renderSquare(row, startCol)}
                {this.renderSquare(row, startCol + 1)}
                {this.renderSquare(row, startCol + 2)}
            </div>
        );
    }
    renderSquare(row: number, col: number) {
        return (
            <Square
                value={this.props.squares[row][col]}
                onClick={() => this.props.onClick(row, col)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-top">
                    {this.renderBoardRow(0, 0)}
                    {this.renderBoardRow(3, 0)}
                    {this.renderBoardRow(6, 0)}
                </div>
            </div>
        );
    }
}
