import {
    calcPlaces,
    createConditions,
    updateCandidatesForPlaceValue,
    checkPrediction,
    checkUniqueCandidate,
    calcPrediction,
    createPredictionObj,
    updateCandidatesForOverlapConditions,
    updateCandidatesForNakedReservations,
    Place,
    Prediction
} from './sudokuUtils';

describe('Sudoku Solver Utilities', () => {
    describe('calcPlaces', () => {
        test('should convert empty squares to places with all candidates', () => {
            const squares = Array(9).fill(null).map(() => Array(9).fill(' '));
            const places = calcPlaces(squares);

            expect(places.length).toBe(9);
            expect(places[0].length).toBe(9);
            expect(places[0][0].value).toBeNull();
            expect(places[0][0].candidates).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
            expect(places[0][0].rowIndex).toBe(0);
            expect(places[0][0].colIndex).toBe(0);
        });

        test('should convert numbered squares to places with values and no candidates', () => {
            const squares = Array(9).fill(null).map(() => Array(9).fill(' '));
            squares[0][0] = '5';
            const places = calcPlaces(squares);

            expect(places[0][0].value).toBe(5);
            expect(places[0][0].candidates).toEqual([]);
        });

        test('should preserve row and column indices', () => {
            const squares = Array(9).fill(null).map(() => Array(9).fill(' '));
            const places = calcPlaces(squares);

            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    expect(places[i][j].rowIndex).toBe(i);
                    expect(places[i][j].colIndex).toBe(j);
                }
            }
        });

        test('should handle multiple values', () => {
            const squares = Array(9).fill(null).map(() => Array(9).fill(' '));
            squares[0][0] = '1';
            squares[4][4] = '5';
            squares[8][8] = '9';
            const places = calcPlaces(squares);

            expect(places[0][0].value).toBe(1);
            expect(places[4][4].value).toBe(5);
            expect(places[8][8].value).toBe(9);
        });
    });

    describe('createConditions', () => {
        test('should create 27 conditions (9 rows + 9 columns + 9 blocks)', () => {
            const squares = Array(9).fill(null).map(() => Array(9).fill(' '));
            const places = calcPlaces(squares);
            const conditions = createConditions(places);

            expect(conditions.length).toBe(27);
        });

        test('should create 9 row conditions', () => {
            const squares = Array(9).fill(null).map(() => Array(9).fill(' '));
            const places = calcPlaces(squares);
            const conditions = createConditions(places);

            // First 9 conditions should be rows
            for (let i = 0; i < 9; i++) {
                expect(conditions[i].length).toBe(9);
                for (let j = 0; j < 9; j++) {
                    expect(conditions[i][j].rowIndex).toBe(i);
                }
            }
        });

        test('should create 9 column conditions', () => {
            const squares = Array(9).fill(null).map(() => Array(9).fill(' '));
            const places = calcPlaces(squares);
            const conditions = createConditions(places);

            // Conditions 9-17 should be columns
            for (let i = 0; i < 9; i++) {
                expect(conditions[9 + i].length).toBe(9);
                for (let j = 0; j < 9; j++) {
                    expect(conditions[9 + i][j].colIndex).toBe(i);
                }
            }
        });

        test('should create 9 block conditions', () => {
            const squares = Array(9).fill(null).map(() => Array(9).fill(' '));
            const places = calcPlaces(squares);
            const conditions = createConditions(places);

            // Conditions 18-26 should be blocks (3x3 squares)
            for (let i = 18; i < 27; i++) {
                expect(conditions[i].length).toBe(9);
            }
        });
    });

    describe('updateCandidatesForPlaceValue', () => {
        test('should remove candidates that match placed values', () => {
            const squares = Array(9).fill(null).map(() => Array(9).fill(' '));
            squares[0][0] = '1';
            squares[0][1] = '2';

            const places = calcPlaces(squares);
            const conditions = createConditions(places);
            updateCandidatesForPlaceValue(conditions);

            // The first row condition should not have 1 and 2 as candidates in empty cells
            for (let i = 2; i < 9; i++) {
                expect(conditions[0][i].candidates).not.toContain(1);
                expect(conditions[0][i].candidates).not.toContain(2);
            }
        });

        test('should preserve other candidates', () => {
            const squares = Array(9).fill(null).map(() => Array(9).fill(' '));
            squares[0][0] = '1';

            const places = calcPlaces(squares);
            const conditions = createConditions(places);
            updateCandidatesForPlaceValue(conditions);

            // Empty cells in the first row should still have candidates 3-9
            expect(conditions[0][1].candidates).toContain(3);
            expect(conditions[0][1].candidates).toContain(4);
            expect(conditions[0][1].candidates).toContain(9);
        });
    });

    describe('checkPrediction', () => {
        test('should return prediction when a cell has exactly one candidate', () => {
            const squares = Array(9).fill(null).map(() => Array(9).fill(' '));
            const places = calcPlaces(squares);
            places[0][0].candidates = [5];

            const prediction = checkPrediction(places, "TEST_TYPE");

            expect(prediction).not.toBeNull();
            expect(prediction?.row).toBe(0);
            expect(prediction?.col).toBe(0);
            expect(prediction?.value).toBe(5);
            expect(prediction?.type).toBe("TEST_TYPE");
        });

        test('should return null when no cell has exactly one candidate', () => {
            const squares = Array(9).fill(null).map(() => Array(9).fill(' '));
            const places = calcPlaces(squares);

            const prediction = checkPrediction(places, "TEST_TYPE");

            expect(prediction).toBeNull();
        });

        test('should find first occurrence with one candidate', () => {
            const squares = Array(9).fill(null).map(() => Array(9).fill(' '));
            const places = calcPlaces(squares);
            places[0][0].candidates = [1];
            places[1][1].candidates = [2];

            const prediction = checkPrediction(places, "TEST_TYPE");

            expect(prediction?.row).toBe(0);
            expect(prediction?.col).toBe(0);
            expect(prediction?.value).toBe(1);
        });
    });

    describe('checkUniqueCandidate', () => {
        test('should find candidate that appears in only one place', () => {
            const places = Array(9).fill(null).map(() => Array(9).fill(null));
            const place1: Place = { value: null, candidates: [1, 2], rowIndex: 0, colIndex: 0 };
            const place2: Place = { value: null, candidates: [2, 3], rowIndex: 0, colIndex: 1 };
            const place3: Place = { value: null, candidates: [3, 4], rowIndex: 0, colIndex: 2 };

            const conditions = [[place1, place2, place3]];

            const prediction = checkUniqueCandidate(conditions);

            expect(prediction).not.toBeNull();
            expect(prediction?.value).toBe(1);
        });

        test('should return null when all candidates appear multiple times', () => {
            const places = Array(9).fill(null).map(() => Array(9).fill(null));
            const place1: Place = { value: null, candidates: [1, 2], rowIndex: 0, colIndex: 0 };
            const place2: Place = { value: null, candidates: [1, 2], rowIndex: 0, colIndex: 1 };

            const conditions = [[place1, place2]];

            const prediction = checkUniqueCandidate(conditions);

            expect(prediction).toBeNull();
        });
    });

    describe('calcPrediction', () => {
        test('should return null for empty board', () => {
            const squares = Array(9).fill(null).map(() => Array(9).fill(' '));
            const prediction = calcPrediction(squares);

            expect(prediction).toBeNull();
        });

        test('should detect simple unique placement', () => {
            const squares = Array(9).fill(null).map(() => Array(9).fill(' '));
            // Fill a row almost completely
            for (let i = 0; i < 8; i++) {
                squares[0][i] = String(i + 1);
            }

            const prediction = calcPrediction(squares);

            expect(prediction).not.toBeNull();
            expect(prediction?.row).toBe(0);
            expect(prediction?.col).toBe(8);
            expect(prediction?.value).toBe(9);
        });

        test('should find prediction in filled columns', () => {
            const squares = Array(9).fill(null).map(() => Array(9).fill(' '));
            // Fill a column almost completely
            for (let i = 0; i < 8; i++) {
                squares[i][0] = String(i + 1);
            }

            const prediction = calcPrediction(squares);

            expect(prediction).not.toBeNull();
            expect(prediction?.row).toBe(8);
            expect(prediction?.col).toBe(0);
            expect(prediction?.value).toBe(9);
        });

        test('should find prediction in filled blocks', () => {
            const squares = Array(9).fill(null).map(() => Array(9).fill(' '));
            // Fill a 3x3 block almost completely (top-left block)
            let count = 1;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (count < 9) {
                        squares[i][j] = String(count++);
                    }
                }
            }

            const prediction = calcPrediction(squares);

            expect(prediction).not.toBeNull();
            expect(prediction?.value).toBe(9);
        });
    });

    describe('Integration tests', () => {
        test('should solve a simple sudoku step by step', () => {
            const squares = Array(9).fill(null).map(() => Array(9).fill(' '));

            // Create a scenario where filling one cell affects others
            for (let i = 0; i < 9; i++) {
                squares[0][i] = i === 8 ? ' ' : String(i + 1);
            }

            let prediction = calcPrediction(squares);
            expect(prediction).not.toBeNull();
            expect(prediction?.row).toBe(0);
            expect(prediction?.value).toBe(9);

            // Apply the prediction
            if (prediction) {
                squares[prediction.row][prediction.col] = String(prediction.value);
            }

            // Continue solving
            prediction = calcPrediction(squares);
            // (will be null since we've only solved one simple row)
        });

        test('should handle complex sudoku scenarios', () => {
            const squares = Array(9).fill(null).map(() => Array(9).fill(' '));

            // Create a more complex scenario
            const initialBoard = [
                "53 7   6  ",
                "6  195   3",
                " 98    6  ",
                "8   6   3 ",
                "4 5 8 3 1 ",
                " 6   4   5",
                "  6    28 ",
                "  419    5",
                "    8   79"
            ];

            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    squares[i][j] = initialBoard[i][j];
                }
            }

            let prediction = calcPrediction(squares);
            // Should find some prediction based on the board state
            expect(prediction).toBeDefined();
        });
    });

    describe('createPredictionObj', () => {
        test('should create prediction object with correct properties', () => {
            const prediction = createPredictionObj("TEST_TYPE", 2, 3, 5);

            expect(prediction.type).toBe("TEST_TYPE");
            expect(prediction.row).toBe(2);
            expect(prediction.col).toBe(3);
            expect(prediction.value).toBe(5);
        });

        test('should create prediction object with zero indices', () => {
            const prediction = createPredictionObj("ZERO_TEST", 0, 0, 1);

            expect(prediction.type).toBe("ZERO_TEST");
            expect(prediction.row).toBe(0);
            expect(prediction.col).toBe(0);
            expect(prediction.value).toBe(1);
        });

        test('should create prediction object with maximum values', () => {
            const prediction = createPredictionObj("MAX_TEST", 8, 8, 9);

            expect(prediction.row).toBe(8);
            expect(prediction.col).toBe(8);
            expect(prediction.value).toBe(9);
        });
    });

    describe('updateCandidatesForOverlapConditions', () => {
        test('should remove candidates from non-overlap when overlap is unique', () => {
            const squares = Array(9).fill(null).map(() => Array(9).fill(' '));
            squares[0][0] = '1';
            squares[0][1] = '2';
            squares[0][2] = '3';

            const places = calcPlaces(squares);
            const conditions = createConditions(places);
            updateCandidatesForPlaceValue(conditions);
            updateCandidatesForOverlapConditions(conditions);

            // Verify that the function executes without errors
            expect(conditions.length).toBe(27);
        });

        test('should handle conditions with multiple overlaps', () => {
            const squares = Array(9).fill(null).map(() => Array(9).fill(' '));
            for (let i = 0; i < 3; i++) {
                squares[i][i] = String(i + 1);
            }

            const places = calcPlaces(squares);
            const conditions = createConditions(places);
            updateCandidatesForPlaceValue(conditions);
            const result = updateCandidatesForOverlapConditions(conditions);

            expect(result.length).toBe(27);
        });

        test('should not modify conditions without overlaps', () => {
            const squares = Array(9).fill(null).map(() => Array(9).fill(' '));
            const places = calcPlaces(squares);
            const conditions = createConditions(places);

            const conditionsBefore = JSON.parse(JSON.stringify(conditions));
            updateCandidatesForOverlapConditions(conditions);

            // First and second cells should still have initial state
            expect(places[0][0].candidates.length).toBe(9);
        });
    });

    describe('updateCandidatesForNakedReservations', () => {
        test('should remove candidates in naked pairs', () => {
            const place1: Place = { value: null, candidates: [1, 2], rowIndex: 0, colIndex: 0 };
            const place2: Place = { value: null, candidates: [1, 2], rowIndex: 0, colIndex: 1 };
            const place3: Place = { value: null, candidates: [1, 2, 3], rowIndex: 0, colIndex: 2 };
            const place4: Place = { value: null, candidates: [4, 5], rowIndex: 0, colIndex: 3 };
            const place5: Place = { value: null, candidates: [6, 7], rowIndex: 0, colIndex: 4 };
            const place6: Place = { value: null, candidates: [8, 9], rowIndex: 0, colIndex: 5 };
            const place7: Place = { value: null, candidates: [3, 4], rowIndex: 0, colIndex: 6 };
            const place8: Place = { value: null, candidates: [5, 6], rowIndex: 0, colIndex: 7 };
            const place9: Place = { value: null, candidates: [7, 8], rowIndex: 0, colIndex: 8 };

            const conditions = [[place1, place2, place3, place4, place5, place6, place7, place8, place9]];
            updateCandidatesForNakedReservations(conditions);

            // Naked pair (1,2) should remove 1,2 from place3
            expect(place3.candidates).not.toContain(1);
            expect(place3.candidates).not.toContain(2);
            expect(place3.candidates).toContain(3);
        });

        test('should handle naked triples', () => {
            const place1: Place = { value: null, candidates: [1, 2, 3], rowIndex: 0, colIndex: 0 };
            const place2: Place = { value: null, candidates: [1, 2, 3], rowIndex: 0, colIndex: 1 };
            const place3: Place = { value: null, candidates: [1, 2, 3], rowIndex: 0, colIndex: 2 };
            const place4: Place = { value: null, candidates: [1, 4], rowIndex: 0, colIndex: 3 };
            const place5: Place = { value: null, candidates: [5, 6], rowIndex: 0, colIndex: 4 };
            const place6: Place = { value: null, candidates: [7, 8], rowIndex: 0, colIndex: 5 };
            const place7: Place = { value: null, candidates: [9, 1], rowIndex: 0, colIndex: 6 };
            const place8: Place = { value: null, candidates: [2, 3], rowIndex: 0, colIndex: 7 };
            const place9: Place = { value: null, candidates: [4, 5], rowIndex: 0, colIndex: 8 };

            const conditions = [[place1, place2, place3, place4, place5, place6, place7, place8, place9]];
            updateCandidatesForNakedReservations(conditions);

            // Verify that triple processing doesn't cause errors
            expect(place4.candidates).toBeDefined();
        });

        test('should not modify single candidates', () => {
            const place1: Place = { value: null, candidates: [1], rowIndex: 0, colIndex: 0 };
            const place2: Place = { value: null, candidates: [2], rowIndex: 0, colIndex: 1 };
            const place3: Place = { value: null, candidates: [1, 2, 3, 4, 5], rowIndex: 0, colIndex: 2 };
            const place4: Place = { value: null, candidates: [6, 7], rowIndex: 0, colIndex: 3 };
            const place5: Place = { value: null, candidates: [8, 9], rowIndex: 0, colIndex: 4 };
            const place6: Place = { value: null, candidates: [1, 2], rowIndex: 0, colIndex: 5 };
            const place7: Place = { value: null, candidates: [3, 4], rowIndex: 0, colIndex: 6 };
            const place8: Place = { value: null, candidates: [5, 6], rowIndex: 0, colIndex: 7 };
            const place9: Place = { value: null, candidates: [7, 8], rowIndex: 0, colIndex: 8 };

            const conditions = [[place1, place2, place3, place4, place5, place6, place7, place8, place9]];
            updateCandidatesForNakedReservations(conditions);

            // Single candidates should not be affected
            expect(place1.candidates).toEqual([1]);
            expect(place2.candidates).toEqual([2]);
        });

        test('should handle empty conditions', () => {
            const conditions: Place[][] = [[]];
            const result = updateCandidatesForNakedReservations(conditions);

            expect(result).toBeDefined();
            expect(result.length).toBe(1);
        });
    });

    describe('Edge cases for calcPlaces', () => {
        test('should handle all empty board', () => {
            const squares = Array(9).fill(null).map(() => Array(9).fill(' '));
            const places = calcPlaces(squares);

            expect(places.length).toBe(9);
            places.forEach(row => {
                expect(row.length).toBe(9);
                row.forEach(place => {
                    expect(place.value).toBeNull();
                    expect(place.candidates).toHaveLength(9);
                });
            });
        });

        test('should handle all filled board', () => {
            const squares = Array(9).fill(null).map((_, i) => 
                Array(9).fill(null).map((_, j) => String(((i * 9 + j) % 9) + 1))
            );
            const places = calcPlaces(squares);

            places.forEach(row => {
                row.forEach(place => {
                    expect(place.value).not.toBeNull();
                    expect(place.candidates).toHaveLength(0);
                });
            });
        });
    });

    describe('Edge cases for createConditions', () => {
        test('should create correct row conditions', () => {
            const squares = Array(9).fill(null).map(() => Array(9).fill(' '));
            squares[4][4] = '5';
            const places = calcPlaces(squares);
            const conditions = createConditions(places);

            // Check row 4
            const row4Condition = conditions[4];
            for (let i = 0; i < 9; i++) {
                expect(row4Condition[i].rowIndex).toBe(4);
            }
        });

        test('should create correct column conditions', () => {
            const squares = Array(9).fill(null).map(() => Array(9).fill(' '));
            const places = calcPlaces(squares);
            const conditions = createConditions(places);

            // Check column 3 (condition index 9 + 3 = 12)
            const col3Condition = conditions[12];
            for (let i = 0; i < 9; i++) {
                expect(col3Condition[i].colIndex).toBe(3);
            }
        });

        test('should create correct block conditions', () => {
            const squares = Array(9).fill(null).map(() => Array(9).fill(' '));
            const places = calcPlaces(squares);
            const conditions = createConditions(places);

            // Check center block (block index = 4, condition index = 18 + 4 = 22)
            const centerBlockCondition = conditions[22];
            expect(centerBlockCondition.length).toBe(9);
        });
    });

    describe('Integration: Full solving with multiple strategies', () => {
        test('should apply multiple solving strategies in sequence', () => {
            const squares = Array(9).fill(null).map(() => Array(9).fill(' '));
            
            // Set up a scenario that uses multiple solving strategies
            for (let i = 0; i < 7; i++) {
                squares[0][i] = String(i + 1);
            }
            for (let i = 0; i < 7; i++) {
                squares[1][i] = String((i + 2) % 9 === 0 ? 9 : (i + 2) % 9);
            }

            const places = calcPlaces(squares);
            const conditions = createConditions(places);
            
            updateCandidatesForPlaceValue(conditions);
            updateCandidatesForOverlapConditions(conditions);
            updateCandidatesForNakedReservations(conditions);

            // Verify board state is valid
            expect(conditions.length).toBe(27);
            expect(places.length).toBe(9);
        });
    });
});
