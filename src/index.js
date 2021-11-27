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
                <div className="board-top">
                    {this.renderBoardRow(0,0)}
                    {this.renderBoardRow(3,0)}
                    {this.renderBoardRow(6,0)}
                </div>
            </div>
        );
    }
}


function calcCandidates(squares){
    let prediction = squares.map(function(row, rowIndex){
        return row.map(function(cell, colIndex) {
            let value = ("1"<=cell&&cell<="9")? Number(cell) : null;
            let candidates = ("1"<=cell&&cell<="9")? [] : Array.from({length: 9}, (_, index) => index+1);
            return { 
                value: value,
                candidates: candidates,
                rowIndex: rowIndex,
                colIndex: colIndex
            }
        })
    })
    let conditions = createConditions(prediction)


    updateCandidatesForPlaceValue(conditions)
    let result = checkPrediction(prediction, "UNIQUE_PLACE")
    if(result.hasPrediction){
        return result
    }

    result = checkUniqueCandidate(conditions)
    if(result.hasPrediction){
        return result
    }
    

    console.log(prediction)
    console.log(conditions)


    return {
        hasPrediction: false
    }
}

function checkUniqueCandidate(conditions){
    for(let condition of conditions) {
        const countGroupByPlace = condition.reduce(function (countGroupByPlace, place, index) {
            place.candidates.forEach(candidate =>{
                let countByPlace = countGroupByPlace.get(candidate)
                if(countByPlace !== undefined){
                    countByPlace.push(index)
                    countGroupByPlace.set(candidate, countByPlace)
                }else{
                    countGroupByPlace.set(candidate, [ index ])
                }
            });
            return countGroupByPlace
        }, new Map());  
        console.log(countGroupByPlace)
        let result = null
        for(let pairList of countGroupByPlace.entries()){
            if(pairList[1].length === 1){
                result = condition[pairList[1][0]]
                result.candidate = [ pairList[0] ]
                break;
            }
        }
        console.log(result)
        if(result !== null){
            return  createPredictionObj(true,"UNIQUE_CANDIDATE",result.rowIndex,result.colIndex,result.candidate[0])
        }    
    }
    return createNoPredictionObj()
}

function checkPrediction(prediction, checkedConditionType){
    for(let i = 0; i < 9; i++){
        for(let j = 0; j < 9; j++){
            let candidates = prediction[i][j].candidates
            if(prediction[i][j].candidates.length === 1){
                return createPredictionObj(true,checkedConditionType,i,j,candidates[0])
            }
        }
    }
    return createNoPredictionObj()
}

function createNoPredictionObj(){
    return createPredictionObj(false)
}
function createPredictionObj(hasPrediction,type,row,col,value){
    if(hasPrediction){
        return {
            hasPrediction: true,
            type: type,
            row: row,
            col: col,
            value: value
        }
    }else{
        return {
            hasPrediction: false
        }
    }
}

function updateCandidatesForPlaceValue(conditions){     
    conditions.forEach(condition => {
        let definiteValues = condition.filter(place => place.value !== null).map(place => place.value)
        condition.forEach(place => {
            place.candidates = place.candidates.filter((candidate) => !definiteValues.some((defValue) => candidate === defValue))
        })
    });
}

function createConditions(prediction){
    let conditions = Array(27)
    let idx = 0
    //row conditions
    prediction.forEach(element => {
        conditions[idx++] = element
    });
    //column conditions
    for(let i = 0; i < 9; i++){
        conditions[idx++] = prediction.map(row => row[i])
    }
    // block conditions
    for(let i = 0; i < 9; i=i+3){
        for(let j = 0; j < 9; j=j+3){
            conditions[idx++] = [
                prediction[i][j],
                prediction[i][j+1],
                prediction[i][j+2],
                prediction[i+1][j],
                prediction[i+1][j+1],
                prediction[i+1][j+2],
                prediction[i+2][j],
                prediction[i+2][j+1],
                prediction[i+2][j+2],
            ]
        }
    }
    return conditions
}


function NextCandidate(props){
    return (
        <div>
            <button className="next-candidate" onClick={props.onClick}>next</button>
            <span className="next-candidate-text">{props.predictText}</span>
        </div>
    )
}

function Save(props){
    return (
        <button className="save" onClick={props.onClick}>save</button>
    )
}

function Load(props){
    return (
        <button className="load" onClick={props.onClick}>load</button>
    )
}
function Clear(props){
    return (
        <button className="clear" onClick={props.onClick}>clear</button>
    )
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

class HistoryView extends React.Component {
    render(){
        let history = this.props.history.map( message => (
            <div>{message}</div>
        ))
        return (
            <div className="history-view">
                {history}
            </div>
        )
    }
}


class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(null).map(x => Array(9).fill(null)),
            selectValue: " ",
            predictText: "",
            history: []
        };
    }
    getPredictionTypeMessage(type){
        switch(type){
            case "UNIQUE_PLACE": return "値確定";
            case "UNIQUE_CANDIDATE": return "条件確定";
            default: return type;
        }
    }
    getSetValueHistoryPrediction(prediction){
        return this.getSetValueHistoryMessage(prediction.row,prediction.col,prediction.value,this.getPredictionTypeMessage(prediction.type))
    }
    getSetValueHistoryMessage(row,col,value,typeMessage){
        return "[↓"+(row+1)+"][→"+(col+1)+"]＝"+value+"("+typeMessage+")";
    }
    clearHistory(message=null){
        let history = [];
        if(message !== null){
            history.push(message)
        }
        this.setState(state => ({
            history: history
        }));
    }
    addHistory(message){
        let history = this.state.history;
        history.push(message)
        this.setState(state => ({
            history: history
        }));
    }
    handleClick(row,col) {
        let squares = this.state.squares.slice();
        squares[row][col] = this.state.selectValue;
        this.setState(state => ({
            squares: squares
        }));
        this.addHistory(this.getSetValueHistoryMessage(row,col,this.state.selectValue,"ユーザー"))
    }
    handleSelect(value) {
        this.setState(state => ({
            selectValue: value
        }));
    }
    handleNextCandidate(){
        let prediction = calcCandidates(this.state.squares)
        if(prediction.hasPrediction){
            let squares = this.state.squares;
            let predictText = "["+(prediction.row+1)+"]行["+(prediction.col+1)+"]列目は"+prediction.value+"です。"
            squares[prediction.row][prediction.col] = prediction.value.toString()
            this.setState(state => ({
                squares: squares,
                predictText: predictText
            }));
            this.addHistory(this.getSetValueHistoryPrediction(prediction))
        }else{
            this.setState(state => ({
                predictText: "次の候補は見つかりませんでした"
            }));
        }
    }
    handleSaveSquares(){
        console.log(this.state.squares)
        localStorage.setItem('squares', this.state.squares)
    }
    handleLoadSquares(){
        const savedValues = localStorage.getItem('squares').split(",")
        const squares = Array(9).fill(null).map(function(_,index) { return savedValues.slice(index*9,(index+1)*9)})
        this.setState(state => ({
            squares: squares
        }));
        this.clearHistory("ロードしました")
    }
    handleClearSquares(){
        this.setState(state => ({
            squares: Array(9).fill(null).map(x => Array(9).fill(null))
        }));
        this.clearHistory()
    }
    render(){
        return (
            <div className="game">
                <Board 
                    squares={this.state.squares}
                    onClick={(row,col) => this.handleClick(row,col)}
                />
                <NumberSelector selectValue={this.state.selectValue} onClick={(value) => this.handleSelect(value)}/>
                <NextCandidate predictText={this.state.predictText} onClick={() => this.handleNextCandidate()}></NextCandidate>
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



