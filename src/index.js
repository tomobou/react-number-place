import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
    render(){
        return (
            <button className="square" onClick={this.props.onClick}>
                {this.props.value}
            </button>
        );
    }
}

class Board extends React.Component {
    renderBoardRow(row,startCol){
        const blockSize = 3
        return (
            <div className="board-row">
                {this.renderBlock(row,startCol)}
                {this.renderBlock(row,startCol+blockSize*1)}
                {this.renderBlock(row,startCol+blockSize*2)}
            </div>
        ); 
    }
    renderBlock(startRow,col){
        return (
            <div className="board-block">
                {this.renderBlockRow(startRow,col)}
                {this.renderBlockRow(startRow+1,col)}
                {this.renderBlockRow(startRow+2,col)}
            </div>
        ); 
    }
    renderBlockRow(row,startCol){
        return (
            <div className="block-row">
                {this.renderSquare(row,startCol)}
                {this.renderSquare(row,startCol+1)}
                {this.renderSquare(row,startCol+2)}
            </div>
        ); 
    }
    renderSquare(row,col) {
        return (
            <Square
                value={this.props.squares[row][col]}
                onClick={() => this.props.onClick(row,col)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderBoardRow(0,0)}
                    {this.renderBoardRow(3,0)}
                    {this.renderBoardRow(6,0)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(null).map(x => Array(9).fill(null)),
            selectValue: " "
        };
    }
    handleClick(row,col) {
        var squares = this.state.squares.slice();
        squares[row][col] = this.state.selectValue;
        this.setState(state => ({
            squares: squares
        }));
    }
    handleSelect(value) {
        this.setState(state => ({
            selectValue: value
        }));
    }
    render(){
        return (
            <div className="game">
                <Board 
                    squares={this.state.squares}
                    onClick={(row,col) => this.handleClick(row,col)}
                />
                <NumberSelector selectValue={this.state.selectValue} onClick={(value) => this.handleSelect(value)}/>
            </div>
        )
    }
}

class NumberSelector extends React.Component {
    render(){
        const parsed = parseInt(this.props.selectValue, 10);
        let classNames = Array(10).fill("number-selector");
        if (isNaN(parsed) || parsed <= 0 || parsed >= 10) {
            classNames[0] += " selected"
        }else{
            classNames[parsed] += " selected"
        }
        return (
            <div className="number-selector-row">
                {classNames.map((className, index)=> {
                    let value = (index===0)? " " : index.toString()
                    return (
                        <button key={"number-selector-"+index} className={className} onClick={() => this.props.onClick(value)}>{value}</button>
                    )
                })}
            </div>
        )
    }
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);