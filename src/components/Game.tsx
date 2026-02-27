import React from 'react';
import { Board } from './Board';
import { NumberSelector } from './NumberSelector';
import { NextPrediction } from './NextPrediction';
import { Save, Load, Clear } from './ActionButtons';
import { HistoryView } from './HistoryView';
import {
    calcPrediction,
    Prediction,
    Place,
    calcPlaces,
    createConditions,
    updateCandidatesForPlaceValue,
    updateCandidatesForNakedReservations,
    updateCandidatesForOverlapConditions
} from '../sudokuUtils';

interface GameProps {

}

interface GameStates {
    squares: string[][],
    selectValue: string,
    predictText: string,
    history: string[],
    candidatesList: string[][]
}

export class Game extends React.Component<GameProps, GameStates> {
    constructor(props: GameProps | Readonly<GameProps>) {
        super(props);
        this.state = {
            squares: Array(9).fill(null).map(x => Array(9).fill(null)),
            selectValue: " ",
            predictText: "",
            history: [],
            candidatesList: Array(9).fill(null).map(x => Array(9).fill(null))
        };
    }

    getPredictionTypeMessage(type: string) {
        switch (type) {
            case "UNIQUE_PLACE": return "値確定";
            case "OVERLAP_CONDITIONS": return "重複排除値確定";
            case "UNIQUE_CANDIDATE": return "条件確定";
            case "NAKED_RESERVATION": return "予約排除後条件確定";
            default: return type;
        }
    }

    getSetValueHistoryPrediction(prediction: Prediction) {
        return this.getSetValueHistoryMessage(prediction.row, prediction.col, prediction.value.toString(), this.getPredictionTypeMessage(prediction.type))
    }

    getSetValueHistoryMessage(row: number, col: number, value: string, typeMessage: string) {
        return "[↓" + (row + 1) + "][→" + (col + 1) + "]＝" + value + "(" + typeMessage + ")";
    }

    clearHistory(message: string = "") {
        let history: string[] = [];
        if (message !== "") {
            history.push(message)
        }
        this.setState(state => ({
            history: history
        }));
    }

    addHistory(message: string) {
        let history = this.state.history;
        history.push(message)
        this.setState(state => ({
            history: history
        }));
    }

    handleClick(row: number, col: number) {
        let squares = this.state.squares.slice();
        squares[row][col] = this.state.selectValue;
        this.setState(state => ({
            squares: squares
        }));
        this.addHistory(this.getSetValueHistoryMessage(row, col, this.state.selectValue, "ユーザー"))
    }

    handleSelect(value: string) {
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
        if (savedValues != null) {
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

    updateCandidatesList(row: number) {
        let candidatesList: string[][]
        if (row > 5) {
            candidatesList = updateCandidatesForPlaceValue(createConditions(calcPlaces(this.state.squares))).map(function (places) {
                return places.map(function (place) {
                    return (place.value != null) ? place.value.toString() : place.candidates.join("")
                })
            });
        } else if (row > 3) {
            candidatesList = updateCandidatesForNakedReservations(updateCandidatesForOverlapConditions(updateCandidatesForPlaceValue(createConditions(calcPlaces(this.state.squares))))).map(function (places) {
                return places.map(function (place) {
                    return (place.value != null) ? place.value.toString() : place.candidates.join("")
                })
            });
        } else {
            candidatesList = updateCandidatesForOverlapConditions(updateCandidatesForPlaceValue(createConditions(calcPlaces(this.state.squares)))).map(function (places) {
                return places.map(function (place) {
                    return (place.value != null) ? place.value.toString() : place.candidates.join("")
                })
            });
        }

        console.log(candidatesList)
        this.setState(state => ({
            candidatesList: candidatesList
        }));
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
                <div className="candidates">
                    候補ビュー（5列目より上をクリックで重複排除値推定結果）
                    <Board
                        squares={this.state.candidatesList}
                        onClick={(row, col) => this.updateCandidatesList(row)}
                    />
                </div>
            </div>
        )
    }
}
