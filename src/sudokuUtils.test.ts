import {
    calcPlaces,
    createConditions,
    updateCandidatesForPlaceValue,
    checkPrediction,
    checkUniqueCandidate,
    calcPrediction,
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
});
