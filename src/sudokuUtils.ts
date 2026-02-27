/**
 * Utility functions for Sudoku solver - extracted from index.tsx for testing
 */

export interface Place {
    value: number | null,
    candidates: number[],
    rowIndex: number,
    colIndex: number
}

export function calcPlaces(squares: string[][]): Place[][] {
    return squares.map(function (row, rowIndex) {
        return row.map(function (cell, colIndex): Place {
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
}

/**
 * 既に入っている値と制約条件の組み合わせをもとに各場所(place)に入れられる候補値(candidates)を導出する。
 * @param {*} conditions 制約条件
 */
export function updateCandidatesForPlaceValue(conditions: Place[][]): Place[][] {
    conditions.forEach(condition => {
        let definiteValues = condition.filter(place => place.value !== null).map(place => place.value)
        condition.forEach(place => {
            place.candidates = place.candidates.filter((candidate) => !definiteValues.some((defValue) => candidate === defValue))
        })
    });
    return conditions
}

/**
 * 2つの制約条件の重複マスにおいて、
 * 一方の制約条件の重複マスにのみ存在する候補値xがある場合に、
 * 他方の制約条件の重複マス以外の候補値xを削除する
 * （重複マスはblock condition と row or col の組み合わせでしか発生しない）
 * @param conditions 
 */
export function updateCandidatesForOverlapConditions(conditions: Place[][]): Place[][] {
    for (let blockCondition of conditions.slice(18)) {
        for (let otherCondition of conditions.slice(0, 18)) {
            let overlap = blockCondition.filter(place => otherCondition.includes(place))
            if (overlap.length > 0) {
                let overlapCandidates = new Set(...overlap.map(place => place.candidates))
                for (let overlapValue of [...overlapCandidates.values()]) {
                    let overlapBlockLength = blockCondition.filter(place => !overlap.includes(place) && place.candidates.includes(overlapValue)).length
                    let overlapOtherLength = otherCondition.filter(place => !overlap.includes(place) && place.candidates.includes(overlapValue)).length
                    if (overlapBlockLength > 0 && overlapOtherLength === 0) {
                        blockCondition.filter(place => !overlap.includes(place)).forEach(place => place.candidates = place.candidates.filter(candidate => candidate !== overlapValue))
                    } else if (overlapBlockLength === 0 && overlapOtherLength > 0) {
                        otherCondition.filter(place => !overlap.includes(place)).forEach(place => place.candidates = place.candidates.filter(candidate => candidate !== overlapValue))
                    }
                }
            }
        }
    }
    return conditions
}

/**
 * Naked Pair/Triple/Quad の候補除去
 * @param conditions 制約条件（行・列・ブロックごとの Place[]）
 */
export function updateCandidatesForNakedReservations(conditions: Place[][]): Place[][] {
    for (const condition of conditions) {
        // 2～4個の候補セットを持つマスを抽出
        const candidateGroups = new Map<string, number[]>();
        condition.forEach((place, idx) => {
            if (place.candidates.length >= 2 && place.candidates.length <= 4) {
                const key = place.candidates.sort().join(",");
                if (!candidateGroups.has(key)) candidateGroups.set(key, []);
                candidateGroups.get(key)!.push(idx);
            }
        });
        // Naked Pair/Triple/Quad のみ処理
        for (const [key, indices] of candidateGroups.entries()) {
            const candidateArr = key.split(",").map(Number);
            if (indices.length === candidateArr.length && indices.length >= 2) {
                // 他のマスからこの候補セットの数字を除去
                condition.forEach((place, idx) => {
                    if (!indices.includes(idx)) {
                        place.candidates = place.candidates.filter(c => !candidateArr.includes(c));
                    }
                });
            }
        }
    }
    return conditions;
}

export interface Prediction {
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
export function createPredictionObj(type: string, row: number, col: number, value: number): Prediction {
    return {
        type: type,
        row: row,
        col: col,
        value: value
    }
}

export function checkPrediction(prediction: Place[][], checkedConditionType: string): Prediction | null {
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

/**
 * 制約条件内の候補値を確認し、1箇所のみ候補に挙がっている値がある場合、該当箇所の候補として予測を返す。
 * @param {*} conditions 
 * @returns 
 */
export function checkUniqueCandidate(conditions: Place[][]): Prediction | null {
    for (let condition of conditions) {
        let countGroupByPlace = new Map<number, number>()
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
            if (value != null) {
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

export function createConditions(places: Place[][]): Place[][] {
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

export function calcPrediction(squares: string[][]): Prediction | null {
    let places = calcPlaces(squares)
    let conditions = createConditions(places)

    updateCandidatesForPlaceValue(conditions)
    let result = checkPrediction(places, "UNIQUE_PLACE")
    if (result != null) {
        return result
    }
    updateCandidatesForOverlapConditions(conditions)
    result = checkPrediction(places, "OVERLAP_CONDITIONS")
    if (result != null) {
        return result
    }

    // 予約（Naked Pair/Triple/Quad）による候補除去
    updateCandidatesForNakedReservations(conditions)
    result = checkPrediction(places, "NAKED_RESERVATION")
    if (result != null) {
        return result
    }

    result = checkUniqueCandidate(conditions)
    if (result != null) {
        return result
    }

    return null
}
