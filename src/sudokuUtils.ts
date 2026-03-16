/**
 * Utility functions for Sudoku solver - extracted from index.tsx for testing
 */

export interface Place {
  value: number | null;
  candidates: number[];
  rowIndex: number;
  colIndex: number;
}

export function calcPlaces(squares: string[][]): Place[][] {
  return squares.map(function (row, rowIndex) {
    return row.map(function (cell, colIndex): Place {
      let value = "1" <= cell && cell <= "9" ? Number(cell) : null;
      let candidates =
        "1" <= cell && cell <= "9"
          ? []
          : Array.from({ length: 9 }, (_, index) => index + 1);
      return {
        value: value,
        candidates: candidates,
        rowIndex: rowIndex,
        colIndex: colIndex,
      };
    });
  });
}

/**
 * 既に入っている値と制約条件の組み合わせをもとに各場所(place)に入れられる候補値(candidates)を導出する。
 * @param {*} conditions 制約条件
 */
export function updateCandidatesForPlaceValue(
  conditions: Place[][],
): Place[][] {
  conditions.forEach((condition) => {
    let definiteValues = condition
      .filter((place) => place.value !== null)
      .map((place) => place.value);
    condition.forEach((place) => {
      place.candidates = place.candidates.filter(
        (candidate) =>
          !definiteValues.some((defValue) => candidate === defValue),
      );
    });
  });
  return conditions;
}

/**
 * 2つの制約条件の重複マスにおいて、
 * 一方の制約条件の重複マスにのみ存在する候補値xがある場合に、
 * 他方の制約条件の重複マス以外の候補値xを削除する
 * （重複マスはblock condition と row or col の組み合わせでしか発生しない）
 * @param conditions
 */
export function updateCandidatesForOverlapConditions(
  conditions: Place[][],
): Place[][] {
  for (let blockCondition of conditions.slice(18)) {
    for (let otherCondition of conditions.slice(0, 18)) {
      let overlap = blockCondition.filter((place) =>
        otherCondition.includes(place),
      );
      if (overlap.length > 0) {
        let overlapCandidates = new Set(
          ...overlap.map((place) => place.candidates),
        );
        for (let overlapValue of [...overlapCandidates.values()]) {
          let overlapBlockLength = blockCondition.filter(
            (place) =>
              !overlap.includes(place) &&
              place.candidates.includes(overlapValue),
          ).length;
          let overlapOtherLength = otherCondition.filter(
            (place) =>
              !overlap.includes(place) &&
              place.candidates.includes(overlapValue),
          ).length;
          if (overlapBlockLength > 0 && overlapOtherLength === 0) {
            blockCondition
              .filter((place) => !overlap.includes(place))
              .forEach(
                (place) =>
                  (place.candidates = place.candidates.filter(
                    (candidate) => candidate !== overlapValue,
                  )),
              );
          } else if (overlapBlockLength === 0 && overlapOtherLength > 0) {
            otherCondition
              .filter((place) => !overlap.includes(place))
              .forEach(
                (place) =>
                  (place.candidates = place.candidates.filter(
                    (candidate) => candidate !== overlapValue,
                  )),
              );
          }
        }
      }
    }
  }
  return conditions;
}

/**
 * Naked Pair/Triple/Quad の候補除去
 * @param conditions 制約条件（行・列・ブロックごとの Place[]）
 */
export function updateCandidatesForNakedReservations(
  conditions: Place[][],
): Place[][] {
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
            place.candidates = place.candidates.filter(
              (c) => !candidateArr.includes(c),
            );
          }
        });
      }
    }
  }
  return conditions;
}

export interface Prediction {
  type: string;
  row: number;
  col: number;
  value: number;
}

/**
 * 予測のオブジェクトを作成する
 * @param {*} type
 * @param {*} row
 * @param {*} col
 * @param {*} value
 * @returns
 */
export function createPredictionObj(
  type: string,
  row: number,
  col: number,
  value: number,
): Prediction {
  return {
    type: type,
    row: row,
    col: col,
    value: value,
  };
}

export function checkPrediction(
  prediction: Place[][],
  checkedConditionType: string,
): Prediction | null {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      let candidates = prediction[i][j].candidates;
      if (prediction[i][j].candidates.length === 1) {
        return createPredictionObj(checkedConditionType, i, j, candidates[0]);
      }
    }
  }
  return null;
}

/**
 * 制約条件内の候補値を確認し、1箇所のみ候補に挙がっている値がある場合、該当箇所の候補として予測を返す。
 * @param {*} conditions
 * @returns
 */
export function checkUniqueCandidate(conditions: Place[][]): Prediction | null {
  for (let condition of conditions) {
    let countGroupByPlace = new Map<number, number>();
    condition.forEach(function (place, index) {
      place.candidates.forEach((candidate) => {
        let countByPlace = countGroupByPlace.get(candidate);
        if (countByPlace != null) {
          countGroupByPlace.set(candidate, -1);
        } else {
          countGroupByPlace.set(candidate, index);
        }
      });
      return countGroupByPlace;
    });
    for (let pairList of [...countGroupByPlace.entries()]) {
      const key = pairList[0];
      const value = pairList[1];
      if (value != null) {
        if (value !== -1) {
          let result = condition[value];
          result.candidates = [key];
          return createPredictionObj(
            "UNIQUE_CANDIDATE",
            result.rowIndex,
            result.colIndex,
            result.candidates[0],
          );
        }
      }
    }
  }
  return null;
}

export function createConditions(places: Place[][]): Place[][] {
  let conditions = Array<Place[]>(27);
  let idx = 0;
  //row conditions
  places.forEach((place) => {
    conditions[idx++] = place;
  });
  //column conditions
  for (let i = 0; i < 9; i++) {
    conditions[idx++] = places.map((row) => row[i]);
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
      ];
    }
  }
  return conditions;
}

/**
 * X-Wing テクニック (行単位)
 * ある値が正確に2つの行のみに候補として存在し、
 * それぞれの行で同じ2つの列に位置している場合、
 * その2つの列において他の行からその値を削除する
 * @param places
 */
export function updateCandidatesForXWing(places: Place[][]): Place[][] {
  // 各候補値についてチェック
  for (let candidate = 1; candidate <= 9; candidate++) {
    // 各行で候補値が存在する列を取得
    const rowCandidates: Map<number, number[]> = new Map();
    for (let row = 0; row < 9; row++) {
      const cols: number[] = [];
      for (let col = 0; col < 9; col++) {
        if (
          places[row][col].value === null &&
          places[row][col].candidates.includes(candidate)
        ) {
          cols.push(col);
        }
      }
      if (cols.length === 2) {
        rowCandidates.set(row, cols);
      }
    }

    // 正確に2つの行で同じ2列を共有しているかチェック
    const rows = Array.from(rowCandidates.keys());
    for (let i = 0; i < rows.length; i++) {
      for (let j = i + 1; j < rows.length; j++) {
        const row1 = rows[i];
        const row2 = rows[j];
        const cols1 = rowCandidates.get(row1)!;
        const cols2 = rowCandidates.get(row2)!;

        // 同じ列ペアの場合、X-Wingが成立
        if (cols1[0] === cols2[0] && cols1[1] === cols2[1]) {
          // その2つの列において、row1とrow2以外から該当値を削除
          for (const col of cols1) {
            for (let row = 0; row < 9; row++) {
              if (row !== row1 && row !== row2) {
                places[row][col].candidates = places[row][
                  col
                ].candidates.filter((c) => c !== candidate);
              }
            }
          }
        }
      }
    }
  }
  return places;
}

/**
 * X-Wing テクニック (列単位)
 * ある値が正確に2つの列のみに候補として存在し、
 * それぞれの列で同じ2つの行に位置している場合、
 * その2つの行において他の列からその値を削除する
 * @param places
 */
export function updateCandidatesForXWingColumn(places: Place[][]): Place[][] {
  for (let candidate = 1; candidate <= 9; candidate++) {
    const colCandidates: Map<number, number[]> = new Map();
    for (let col = 0; col < 9; col++) {
      const rows: number[] = [];
      for (let row = 0; row < 9; row++) {
        if (
          places[row][col].value === null &&
          places[row][col].candidates.includes(candidate)
        ) {
          rows.push(row);
        }
      }
      if (rows.length === 2) {
        colCandidates.set(col, rows);
      }
    }

    const cols = Array.from(colCandidates.keys());
    for (let i = 0; i < cols.length; i++) {
      for (let j = i + 1; j < cols.length; j++) {
        const col1 = cols[i];
        const col2 = cols[j];
        const rows1 = colCandidates.get(col1)!;
        const rows2 = colCandidates.get(col2)!;

        if (rows1[0] === rows2[0] && rows1[1] === rows2[1]) {
          for (const row of rows1) {
            for (let col = 0; col < 9; col++) {
              if (col !== col1 && col !== col2) {
                places[row][col].candidates = places[row][
                  col
                ].candidates.filter((c) => c !== candidate);
              }
            }
          }
        }
      }
    }
  }
  return places;
}

/**
 * Swordfish テクニック (行単位)
 * ある値が正確に3つの行のみに候補として存在し、
 * それぞれの行で同じ3つの列に位置している場合、
 * その3つの列において他の行からその値を削除する
 * @param places
 */
export function updateCandidatesForSwordfish(places: Place[][]): Place[][] {
  for (let candidate = 1; candidate <= 9; candidate++) {
    const rowCandidates: Map<number, number[]> = new Map();
    for (let row = 0; row < 9; row++) {
      const cols: number[] = [];
      for (let col = 0; col < 9; col++) {
        if (
          places[row][col].value === null &&
          places[row][col].candidates.includes(candidate)
        ) {
          cols.push(col);
        }
      }
      if (cols.length >= 2 && cols.length <= 3) {
        rowCandidates.set(row, cols);
      }
    }

    const rows = Array.from(rowCandidates.keys());
    // 3つの行のSwordfishをチェック
    for (let i = 0; i < rows.length; i++) {
      for (let j = i + 1; j < rows.length; j++) {
        for (let k = j + 1; k < rows.length; k++) {
          const row1 = rows[i];
          const row2 = rows[j];
          const row3 = rows[k];
          const cols1 = rowCandidates.get(row1)!;
          const cols2 = rowCandidates.get(row2)!;
          const cols3 = rowCandidates.get(row3)!;

          // 3つの行の列セットが3列以下で同じ列セットか確認
          const allCols = new Set([...cols1, ...cols2, ...cols3]);
          if (allCols.size === 3) {
            const colArray = Array.from(allCols);
            // その3つの列においてrow1, row2, row3以外から該当値を削除
            for (const col of colArray) {
              for (let row = 0; row < 9; row++) {
                if (row !== row1 && row !== row2 && row !== row3) {
                  places[row][col].candidates = places[row][
                    col
                  ].candidates.filter((c) => c !== candidate);
                }
              }
            }
          }
        }
      }
    }
  }
  return places;
}

/**
 * Swordfish テクニック (列単位)
 * ある値が正確に3つの列のみに候補として存在し、
 * それぞれの列で同じ3つの行に位置している場合、
 * その3つの行において他の列からその値を削除する
 * @param places
 */
export function updateCandidatesForSwordfishColumn(
  places: Place[][],
): Place[][] {
  for (let candidate = 1; candidate <= 9; candidate++) {
    const colCandidates: Map<number, number[]> = new Map();
    for (let col = 0; col < 9; col++) {
      const rows: number[] = [];
      for (let row = 0; row < 9; row++) {
        if (
          places[row][col].value === null &&
          places[row][col].candidates.includes(candidate)
        ) {
          rows.push(row);
        }
      }
      if (rows.length >= 2 && rows.length <= 3) {
        colCandidates.set(col, rows);
      }
    }

    const cols = Array.from(colCandidates.keys());
    // 3つの列のSwordfishをチェック
    for (let i = 0; i < cols.length; i++) {
      for (let j = i + 1; j < cols.length; j++) {
        for (let k = j + 1; k < cols.length; k++) {
          const col1 = cols[i];
          const col2 = cols[j];
          const col3 = cols[k];
          const rows1 = colCandidates.get(col1)!;
          const rows2 = colCandidates.get(col2)!;
          const rows3 = colCandidates.get(col3)!;

          const allRows = new Set([...rows1, ...rows2, ...rows3]);
          if (allRows.size === 3) {
            const rowArray = Array.from(allRows);
            for (const row of rowArray) {
              for (let col = 0; col < 9; col++) {
                if (col !== col1 && col !== col2 && col !== col3) {
                  places[row][col].candidates = places[row][
                    col
                  ].candidates.filter((c) => c !== candidate);
                }
              }
            }
          }
        }
      }
    }
  }
  return places;
}

/**
 * Box/Line Reduction (Box-Line Reduction) テクニック
 * あるブロック内で候補が特定の行（または列）に限定される場合、
 * その行（列）にある他のブロック内のセルから同じ候補を除去する。
 * 例えば、ブロック内で候補 5 が行 2 のセルにのみ現れるなら、
 * 行 2 の他のブロックにあるセルから 5 を除去する。
 * 同様に列に限定されるケースも処理する。
 *
 * @param places 9x9 Place 配列
 * @returns 更新後の places
 */
export function updateCandidatesForBoxLineReduction(
  places: Place[][],
): Place[][] {
  // 行に限定されるケース
  for (let blockRow = 0; blockRow < 3; blockRow++) {
    for (let blockCol = 0; blockCol < 3; blockCol++) {
      // ブロック内のセルを取得
      const blockCells: Place[] = [];
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          blockCells.push(places[blockRow * 3 + r][blockCol * 3 + c]);
        }
      }
      // 候補ごとに行の分布を調べる
      const candidateRows = new Map<number, Set<number>>();
      for (const cell of blockCells) {
        for (const cand of cell.candidates) {
          if (!candidateRows.has(cand)) candidateRows.set(cand, new Set());
          candidateRows.get(cand)!.add(cell.rowIndex);
        }
      }
      for (const [cand, rows] of candidateRows.entries()) {
        if (rows.size === 1) {
          const targetRow = Array.from(rows)[0];
          // その行のブロック外のセルから cand を除去
          for (let col = 0; col < 9; col++) {
            const cell = places[targetRow][col];
            // ブロック外かつ候補に含まれる場合
            if (
              cell.candidates.includes(cand) &&
              !(
                cell.rowIndex >= blockRow * 3 &&
                cell.rowIndex < blockRow * 3 + 3 &&
                cell.colIndex >= blockCol * 3 &&
                cell.colIndex < blockCol * 3 + 3
              )
            ) {
              cell.candidates = cell.candidates.filter((c) => c !== cand);
            }
          }
        }
      }
      // 列に限定されるケース
      const candidateCols = new Map<number, Set<number>>();
      for (const cell of blockCells) {
        for (const cand of cell.candidates) {
          if (!candidateCols.has(cand)) candidateCols.set(cand, new Set());
          candidateCols.get(cand)!.add(cell.colIndex);
        }
      }
      for (const [cand, cols] of candidateCols.entries()) {
        if (cols.size === 1) {
          const targetCol = Array.from(cols)[0];
          for (let row = 0; row < 9; row++) {
            const cell = places[row][targetCol];
            if (
              cell.candidates.includes(cand) &&
              !(
                cell.rowIndex >= blockRow * 3 &&
                cell.rowIndex < blockRow * 3 + 3 &&
                cell.colIndex >= blockCol * 3 &&
                cell.colIndex < blockCol * 3 + 3
              )
            ) {
              cell.candidates = cell.candidates.filter((c) => c !== cand);
            }
          }
        }
      }
    }
  }
  return places;
}

/**
 * Pointing Pair/Triple テクニック
 * ブロック内の候補が行・列に限定される場合、その行・列から候補を除外
 * @param places
 */
export function updateCandidatesForPointingPair(places: Place[][]): Place[][] {
  // 各ブロック（9個）をチェック
  for (let blockRow = 0; blockRow < 9; blockRow += 3) {
    for (let blockCol = 0; blockCol < 9; blockCol += 3) {
      // 各候補値についてチェック
      for (let candidate = 1; candidate <= 9; candidate++) {
        // このブロック内で該当候補値を持つセルを探す
        const cellsWithCandidate: Place[] = [];
        for (let row = blockRow; row < blockRow + 3; row++) {
          for (let col = blockCol; col < blockCol + 3; col++) {
            if (
              places[row][col].value === null &&
              places[row][col].candidates.includes(candidate)
            ) {
              cellsWithCandidate.push(places[row][col]);
            }
          }
        }

        // 候補値が2～3個のセルに限定されている場合
        if (cellsWithCandidate.length >= 2 && cellsWithCandidate.length <= 3) {
          // すべてのセルが同じ行にあるか確認
          const rows = new Set(cellsWithCandidate.map((c) => c.rowIndex));
          if (rows.size === 1) {
            // 同じ行にあるなら、その行の他のブロックから該当値を削除
            const row = Array.from(rows)[0];
            for (let col = 0; col < 9; col++) {
              // 同じブロック内のセルは除外
              if (col < blockCol || col >= blockCol + 3) {
                places[row][col].candidates = places[row][
                  col
                ].candidates.filter((c) => c !== candidate);
              }
            }
          }

          // すべてのセルが同じ列にあるか確認
          const cols = new Set(cellsWithCandidate.map((c) => c.colIndex));
          if (cols.size === 1) {
            // 同じ列にあるなら、その列の他のブロックから該当値を削除
            const col = Array.from(cols)[0];
            for (let row = 0; row < 9; row++) {
              // 同じブロック内のセルは除外
              if (row < blockRow || row >= blockRow + 3) {
                places[row][col].candidates = places[row][
                  col
                ].candidates.filter((c) => c !== candidate);
              }
            }
          }
        }
      }
    }
  }
  return places;
}

export function calcPrediction(squares: string[][]): Prediction | null {
  let places = calcPlaces(squares);
  let conditions = createConditions(places);

  updateCandidatesForPlaceValue(conditions);
  let result = checkPrediction(places, "UNIQUE_PLACE");
  if (result != null) {
    return result;
  }
  updateCandidatesForOverlapConditions(conditions);
  result = checkPrediction(places, "OVERLAP_CONDITIONS");
  if (result != null) {
    return result;
  }

  // 予約（Naked Pair/Triple/Quad）による候補除去
  updateCandidatesForNakedReservations(conditions);
  result = checkPrediction(places, "NAKED_RESERVATION");
  if (result != null) {
    return result;
  }

  // Pointing Pair/Triple テクニック
  updateCandidatesForPointingPair(places);
  result = checkPrediction(places, "POINTING_PAIR");
  if (result != null) {
    return result;
  }

  // X-Wing テクニック
  updateCandidatesForXWing(places);
  updateCandidatesForXWingColumn(places);
  result = checkPrediction(places, "X_WING");
  if (result != null) {
    return result;
  }

  // Swordfish テクニック
  updateCandidatesForSwordfish(places);
  updateCandidatesForSwordfishColumn(places);
  result = checkPrediction(places, "SWORDFISH");
  if (result != null) {
    return result;
  }

  result = checkUniqueCandidate(conditions);
  if (result != null) {
    return result;
  }

  return null;
}
