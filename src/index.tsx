import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

interface SquareProps{
    onClick: () => void,
    value: string
}

class Square extends React.Component<SquareProps> {
    render() {
        return (
            <button className="square" onClick={this.props.onClick}>
                {this.props.value}
            </button>
        );
    }
}

interface BoardProps{
    onClick: (row:number,col:number) => void,
    squares: Array<Array<string>>
}

class Board extends React.Component<BoardProps> {
    renderBoardRow(row:number, startCol:number) {
        const blockSize = 3
        return (
            <div className="board-row">
                {this.renderBlock(row, startCol)}
                {this.renderBlock(row, startCol + blockSize * 1)}
                {this.renderBlock(row, startCol + blockSize * 2)}
            </div>
        );
    }
    renderBlock(startRow:number, col:number) {
        return (
            <div className="board-block">
                {this.renderBlockRow(startRow, col)}
                {this.renderBlockRow(startRow + 1, col)}
                {this.renderBlockRow(startRow + 2, col)}
            </div>
        );
    }
    renderBlockRow(row:number, startCol:number) {
        return (
            <div className="block-row">
                {this.renderSquare(row, startCol)}
                {this.renderSquare(row, startCol + 1)}
                {this.renderSquare(row, startCol + 2)}
            </div>
        );
    }
    renderSquare(row:number, col:number) {
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


interface Place {
    value: number | null,
    candidates: Array<number>,
    rowIndex: number,
    colIndex: number
}


function calcPrediction(squares:Array<Array<string>>) {
    let places = squares.map(function (row, rowIndex) {
        return row.map(function (cell, colIndex):Place {
            let value = ("1" <= cell && cell <= "9") ? Number(cell) : null;
            let candidates = ("1" <= cell && cell <= "9") ? [] : Array.from({ length: 9 }, (_, index) => index + 1);
            return {
                value: value,
                candidates: candidates,
                rowIndex: rowIndex,
                colIndex: colIndex
            }
        })
    })
    let conditions = createConditions(places)


    updateCandidatesForPlaceValue(conditions)
    let result = checkPrediction(places, "UNIQUE_PLACE")
    if (result != null) {
        return result
    }

    result = checkUniqueCandidate(conditions)
    if (result != null) {
        return result
    }

    console.log(places)
    console.log(conditions)

    return null
}

/**
 * 制約条件内の候補値を確認し、1箇所のみ候補に挙がっている値がある場合、該当箇所の候補として予測を返す。
 * @param {*} conditions 
 * @returns 
 */
function checkUniqueCandidate(conditions:Array<Place[]>) {
    for (let condition of conditions) {
        let countGroupByPlace = new Map<number,number>()
        condition.forEach(function (place, index) {
            place.candidates.forEach(candidate => {
                let countByPlace = countGroupByPlace.get(candidate)
                if (countByPlace != null) {
                    countGroupByPlace.set(candidate, -1)
                } else {
                    countGroupByPlace.set(candidate, index)
                }
            });
            return countGroupByPlace
        });
        for (let pairList of [...countGroupByPlace.entries()]) {
            const key = pairList[0]
            const value = pairList[1]
            if(value != null){
                if (value !== -1) {
                    let result = condition[value];
                    result.candidates = [key];
                    return createPredictionObj("UNIQUE_CANDIDATE", result.rowIndex, result.colIndex, result.candidates[0])
                }
            }
        }
    }
    return null
}

function checkPrediction(prediction:Place[][], checkedConditionType:string):Prediction|null {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let candidates = prediction[i][j].candidates
            if (prediction[i][j].candidates.length === 1) {
                return createPredictionObj(checkedConditionType, i, j, candidates[0])
            }
        }
    }
    return null
}

interface Prediction {
    type: string,
    row: number,
    col: number,
    value: number
};

/**
 * 予測のオブジェクトを作成する
 * @param {*} type 
 * @param {*} row 
 * @param {*} col 
 * @param {*} value 
 * @returns 
 */
function createPredictionObj(type:string, row:number, col:number, value:number):Prediction {
    return {
        type: type,
        row: row,
        col: col,
        value: value
    }
}

/**
 * 既に入っている値と制約条件の組み合わせをもとに各場所(place)に入れられる候補値(candidates)を導出する。
 * @param {*} conditions 制約条件
 */
function updateCandidatesForPlaceValue(conditions:Array<Place[]>) {
    conditions.forEach(condition => {
        let definiteValues = condition.filter(place => place.value !== null).map(place => place.value)
        condition.forEach(place => {
            place.candidates = place.candidates.filter((candidate) => !definiteValues.some((defValue) => candidate === defValue))
        })
    });
}

function createConditions(places:Place[][]):Array<Place[]> {
    let conditions = Array<Place[]>(27)
    let idx = 0
    //row conditions
    places.forEach(place => {
        conditions[idx++] = place
    });
    //column conditions
    for (let i = 0; i < 9; i++) {
        conditions[idx++] = places.map(row => row[i])
    }
    // block conditions
    for (let i = 0; i < 9; i = i + 3) {
        for (let j = 0; j < 9; j = j + 3) {
            conditions[idx++] = [
                places[i][j],
                places[i][j + 1],
                places[i][j + 2],
                places[i + 1][j],
                places[i + 1][j + 1],
                places[i + 1][j + 2],
                places[i + 2][j],
                places[i + 2][j + 1],
                places[i + 2][j + 2],
            ]
        }
    }
    return conditions
}

interface NextPredictionProps{
    onClick: () => void,
    predictText: string
}

function NextPrediction(props:NextPredictionProps) {
    return (
        <div>
            <button className="next-prediction" onClick={props.onClick}>next</button>
            <span className="next-prediction-text">{props.predictText}</span>
        </div>
    )
}

interface ClickActionProps{
    onClick: () => void
}

function Save(props:ClickActionProps) {
    return (
        <button className="save" onClick={props.onClick}>save</button>
    )
}

function Load(props:ClickActionProps) {
    return (
        <button className="load" onClick={props.onClick}>load</button>
    )
}
function Clear(props:ClickActionProps) {
    return (
        <button className="clear" onClick={props.onClick}>clear</button>
    )
}

interface NumberSelectorProps {
    selectValue: string,
    onClick: (value:string) => void
}

class NumberSelector extends React.Component<NumberSelectorProps> {
    render() {
        const parsed = parseInt(this.props.selectValue, 10);
        let classNames = Array(10).fill("number-selector");
        if (isNaN(parsed) || parsed <= 0 || parsed >= 10) {
            classNames[0] += " selected"
        } else {
            classNames[parsed] += " selected"
        }
        return (
            <div className="number-selector-row">
                {classNames.map((className, index) => {
                    let value = (index === 0) ? " " : index.toString()
                    return (
                        <button key={"number-selector-" + index} className={className} onClick={() => this.props.onClick(value)}>{value}</button>
                    )
                })}
            </div>
        )
    }
}

interface HistoryViewProps {
    history: string[]
}

class HistoryView extends React.Component<HistoryViewProps> {
    render() {
        let history = this.props.history.map(message => (
            <div>{message}</div>
        ))
        return (
            <div className="history-view">
                {history}
            </div>
        )
    }
}

interface GameProps {

}
interface GameStates{
    squares: Array<Array<string>>,
    selectValue: string,
    predictText: string,
    history: string[]
}


class Game extends React.Component<GameProps,GameStates> {
    constructor(props: GameProps | Readonly<GameProps>) {
        super(props);
        this.state = {
            squares: Array(9).fill(null).map(x => Array(9).fill(null)),
            selectValue: " ",
            predictText: "",
            history: []
        };
    }
    getPredictionTypeMessage(type:string) {
        switch (type) {
            case "UNIQUE_PLACE": return "値確定";
            case "UNIQUE_CANDIDATE": return "条件確定";
            default: return type;
        }
    }
    getSetValueHistoryPrediction(prediction:Prediction) {
        return this.getSetValueHistoryMessage(prediction.row, prediction.col, prediction.value.toString(), this.getPredictionTypeMessage(prediction.type))
    }
    getSetValueHistoryMessage(row:number, col:number, value:string, typeMessage:string) {
        return "[↓" + (row + 1) + "][→" + (col + 1) + "]＝" + value + "(" + typeMessage + ")";
    }
    clearHistory(message:string = "" ) {
        let history:string[] = [];
        if (message !== "") {
            history.push(message)
        }
        this.setState(state => ({
            history: history
        }));
    }
    addHistory(message:string) {
        let history = this.state.history;
        history.push(message)
        this.setState(state => ({
            history: history
        }));
    }
    handleClick(row:number, col:number) {
        let squares = this.state.squares.slice();
        squares[row][col] = this.state.selectValue;
        this.setState(state => ({
            squares: squares
        }));
        this.addHistory(this.getSetValueHistoryMessage(row, col, this.state.selectValue, "ユーザー"))
    }
    handleSelect(value:string) {
        this.setState(state => ({
            selectValue: value
        }));
    }
    handleNextPrediction() {
        let prediction = calcPrediction(this.state.squares)
        if (prediction != null) {
            let squares = this.state.squares;
            let predictText = "[" + (prediction.row + 1) + "]行[" + (prediction.col + 1) + "]列目は" + prediction.value + "です。"
            squares[prediction.row][prediction.col] = prediction.value.toString()
            this.setState(state => ({
                squares: squares,
                predictText: predictText
            }));
            this.addHistory(this.getSetValueHistoryPrediction(prediction))
        } else {
            this.setState(state => ({
                predictText: "次の候補は見つかりませんでした"
            }));
        }
    }
    handleSaveSquares() {
        console.log(this.state.squares)
        localStorage.setItem('squares', this.state.squares.map(row => row.join(",")).join(","))
    }
    handleLoadSquares() {
        const savedValues = localStorage.getItem('squares')?.split(",")
        if(savedValues != null){
            const squares = Array(9).fill(null).map(function (_, index) { return savedValues.slice(index * 9, (index + 1) * 9) })
            this.setState(state => ({
                squares: squares
            }));
            this.clearHistory("ロードしました")
        }
    }
    handleClearSquares() {
        this.setState(state => ({
            squares: Array(9).fill(null).map(x => Array(9).fill(null))
        }));
        this.clearHistory()
    }
    render() {
        return (
            <div className="game">
                <Board
                    squares={this.state.squares}
                    onClick={(row, col) => this.handleClick(row, col)}
                />
                <NumberSelector selectValue={this.state.selectValue} onClick={(value) => this.handleSelect(value)} />
                <NextPrediction predictText={this.state.predictText} onClick={() => this.handleNextPrediction()}></NextPrediction>
                <div className="button-row">
                    <Save onClick={() => this.handleSaveSquares()}></Save>
                    <Load onClick={() => this.handleLoadSquares()}></Load>
                    <Clear onClick={() => this.handleClearSquares()}></Clear>
                </div>
                <HistoryView history={this.state.history}></HistoryView>
            </div>
        )
    }
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);



