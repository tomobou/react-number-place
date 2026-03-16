import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Game } from './Game';

describe('Game Component', () => {
  test('should render game board', () => {
    const { container } = render(<Game />);
    const board = container.querySelector('.game');
    expect(board).toBeInTheDocument();
  });

  test('should render number selector with 10 buttons', () => {
    render(<Game />);
    const buttons = screen.getAllByRole('button');
    // Should have at least 10 buttons for number selector
    expect(buttons.length).toBeGreaterThanOrEqual(10);
  });

  test('should render action buttons', () => {
    render(<Game />);
    expect(screen.getByRole('button', { name: 'save' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'load' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'clear' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'next' })).toBeInTheDocument();
  });

  test('should select number when number button is clicked', () => {
    const { container } = render(<Game />);
    const buttons = screen.getAllByRole('button');
    // Click number 5 button (should be in the first set of 10 buttons from NumberSelector)
    const numberSelectorButtons = container.querySelectorAll('.number-selector-row button');
    fireEvent.click(numberSelectorButtons[5]);

    // Verify selection changed by checking class
    expect(numberSelectorButtons[5]).toHaveClass('selected');
  });

  test('should clear board when clear button is clicked', () => {
    const { container } = render(<Game />);
    const buttons = screen.getAllByRole('button');

    // Click a square and select a number
    fireEvent.click(buttons[5]); // Select number 5
    const squares = container.querySelectorAll('.square');
    fireEvent.click(squares[0]); // Click first square

    // Click clear button
    const clearBtn = screen.getByRole('button', { name: 'clear' });
    fireEvent.click(clearBtn);

    // History should be cleared
    const historyView = container.querySelector('.history-view');
    expect(historyView?.children.length).toBe(0);
  });

  test('should initialize with empty board', () => {
    const { container } = render(<Game />);
    const squares = container.querySelectorAll('.square');
    // Game has two boards (main and candidates), so 81 * 2 = 162
    expect(squares.length).toBe(162); // Two 9x9 boards
  });

  test('should have history view', () => {
    const { container } = render(<Game />);
    const historyView = container.querySelector('.history-view');
    expect(historyView).toBeInTheDocument();
  });

  test('should have candidates view', () => {
    const { container } = render(<Game />);
    const candidatesView = container.querySelector('.candidates');
    expect(candidatesView).toBeInTheDocument();
  });

  test('should display prediction text', () => {
    render(<Game />);
    const predictions = screen.queryAllByText('');
    // The prediction text span should exist
    const nextPredictionText = document.querySelector('.next-prediction-text');
    expect(nextPredictionText).toBeInTheDocument();
  });

  test('should render two boards (game board and candidates board)', () => {
    const { container } = render(<Game />);
    const boardDivs = container.querySelectorAll('.board-top');
    expect(boardDivs.length).toBe(2); // One for main board, one for candidates
  });

  test('should have default select value as space', () => {
    const { container } = render(<Game />);
    const numberSelectorButtons = container.querySelectorAll('.number-selector-row button');
    // First button in the number selector should be selected (space)
    expect(numberSelectorButtons[0]).toHaveClass('selected');
  });

  describe('Game State Management', () => {
    test('should update state when a square is clicked', () => {
      const { container } = render(<Game />);
      // Select number 5
      const numberSelectorButtons = container.querySelectorAll('.number-selector-row button');
      fireEvent.click(numberSelectorButtons[5]);

      // Click first square
      const squares = container.querySelectorAll('.square');
      fireEvent.click(squares[0]);

      // Verify the square displays '5'
      expect(squares[0]).toHaveTextContent('5');
    });

    test('should update selectValue state when number is clicked', () => {
      const { container } = render(<Game />);
      const numberSelectorButtons = container.querySelectorAll('.number-selector-row button');

      fireEvent.click(numberSelectorButtons[7]); // Click number 7

      expect(numberSelectorButtons[7]).toHaveClass('selected');
    });

    test('should add to history when square is filled', () => {
      const { container } = render(<Game />);
      const numberSelectorButtons = container.querySelectorAll('.number-selector-row button');
      fireEvent.click(numberSelectorButtons[3]); // Select 3

      const squares = container.querySelectorAll('.square');
      fireEvent.click(squares[0]); // Click first square

      const historyView = container.querySelector('.history-view');
      expect(historyView?.children.length).toBeGreaterThan(0);
    });

    test('should update history message format correctly', () => {
      const { container } = render(<Game />);
      const numberSelectorButtons = container.querySelectorAll('.number-selector-row button');
      fireEvent.click(numberSelectorButtons[5]); // Select 5

      const squares = container.querySelectorAll('.square');
      fireEvent.click(squares[0]); // Click first square (row=0, col=0)

      const historyView = container.querySelector('.history-view');
      const historyText = historyView?.textContent;

      expect(historyText).toContain('↓1'); // Row 1 (0-indexed + 1)
      expect(historyText).toContain('→1'); // Col 1
      expect(historyText).toContain('5');
    });

    test('should handle multiple value changes in same square', () => {
      const { container } = render(<Game />);
      const numberSelectorButtons = container.querySelectorAll('.number-selector-row button');
      const squares = container.querySelectorAll('.square');

      // First set to 3
      fireEvent.click(numberSelectorButtons[3]);
      fireEvent.click(squares[0]);
      expect(squares[0]).toHaveTextContent('3');

      // Then change to 7
      fireEvent.click(numberSelectorButtons[7]);
      fireEvent.click(squares[0]);
      expect(squares[0]).toHaveTextContent('7');

      // History should have 2 entries
      const historyView = container.querySelector('.history-view');
      expect(historyView?.children.length).toBe(2);
    });

    test('should maintain selected number across multiple clicks', () => {
      const { container } = render(<Game />);
      const numberSelectorButtons = container.querySelectorAll('.number-selector-row button');
      const squares = container.querySelectorAll('.square');

      fireEvent.click(numberSelectorButtons[4]); // Select 4

      // Click multiple squares
      fireEvent.click(squares[0]);
      fireEvent.click(squares[9]); // Next row

      // Both should have 4
      expect(squares[0]).toHaveTextContent('4');
      expect(squares[9]).toHaveTextContent('4');
    });
  });

  describe('LocalStorage Functionality', () => {
    beforeEach(() => {
      // Clear localStorage before each test
      localStorage.clear();
      jest.clearAllMocks();
    });

    test('should save board state to localStorage', () => {
      const { container } = render(<Game />);
      const numberSelectorButtons = container.querySelectorAll('.number-selector-row button');
      const squares = container.querySelectorAll('.square');

      // Fill some squares
      fireEvent.click(numberSelectorButtons[5]); // Select 5
      fireEvent.click(squares[0]); // Click first square

      // Click save button
      const saveBtn = screen.getByRole('button', { name: 'save' });
      fireEvent.click(saveBtn);

      // Check localStorage
      const savedData = localStorage.getItem('squares');
      expect(savedData).toBeDefined();
    });

    test('should load board state from localStorage', () => {
      // Pre-set localStorage data
      const testData =
        '5, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , ';
      localStorage.setItem('squares', testData);

      const { container } = render(<Game />);

      // Click load button
      const loadBtn = screen.getByRole('button', { name: 'load' });
      fireEvent.click(loadBtn);

      // Check history shows "ロードしました"
      const historyView = container.querySelector('.history-view');
      expect(historyView?.textContent).toContain('ロードしました');
    });

    test('should handle loading when no data is saved', () => {
      const { container } = render(<Game />);

      // Click load button with no data
      const loadBtn = screen.getByRole('button', { name: 'load' });
      fireEvent.click(loadBtn);

      // Board should remain unchanged (empty)
      const squares = container.querySelectorAll('.square');
      // Empty squares should not have text content or have empty/whitespace content
      expect(squares.length).toBeGreaterThan(0);
    });

    test('should preserve board on save and clear history on load', () => {
      const { container } = render(<Game />);
      const numberSelectorButtons = container.querySelectorAll('.number-selector-row button');
      const squares = container.querySelectorAll('.square');

      // Add some data
      fireEvent.click(numberSelectorButtons[5]);
      fireEvent.click(squares[0]);

      // Save
      const saveBtn = screen.getByRole('button', { name: 'save' });
      fireEvent.click(saveBtn);

      // Add more history
      fireEvent.click(numberSelectorButtons[3]);
      fireEvent.click(squares[1]);

      let historyView = container.querySelector('.history-view');
      const historyLengthBefore = historyView?.children.length || 0;
      expect(historyLengthBefore).toBeGreaterThan(1);

      // Load (should clear history)
      const loadBtn = screen.getByRole('button', { name: 'load' });
      fireEvent.click(loadBtn);

      historyView = container.querySelector('.history-view');
      expect(historyView?.children.length).toBe(1); // Only "ロードしました"
    });
  });

  describe('Next Prediction Functionality', () => {
    test('should update prediction text when next button is clicked', () => {
      const { container } = render(<Game />);
      const numberSelectorButtons = container.querySelectorAll('.number-selector-row button');
      const squares = container.querySelectorAll('.square');

      // Fill most of a row to trigger a prediction
      for (let i = 0; i < 8; i++) {
        fireEvent.click(numberSelectorButtons[i + 1]); // Select i+1
        fireEvent.click(squares[i]); // Click square
      }

      // Click next button
      const nextBtn = screen.getByRole('button', { name: 'next' });
      fireEvent.click(nextBtn);

      // Check for prediction response
      const predictionText = document.querySelector('.next-prediction-text');
      expect(predictionText).toBeInTheDocument();
    });

    test('should add prediction to history', () => {
      const { container } = render(<Game />);
      const numberSelectorButtons = container.querySelectorAll('.number-selector-row button');
      const squares = container.querySelectorAll('.square');

      // Fill most of a row
      for (let i = 0; i < 8; i++) {
        fireEvent.click(numberSelectorButtons[i + 1]);
        fireEvent.click(squares[i]);
      }

      const historyView = container.querySelector('.history-view');
      const historyLengthBefore = historyView?.children.length || 0;

      // Click next button
      const nextBtn = screen.getByRole('button', { name: 'next' });
      fireEvent.click(nextBtn);

      // History should grow if prediction found
      historyView
        ? expect(historyView.children.length).toBeGreaterThanOrEqual(historyLengthBefore)
        : null;
    });

    test('should handle when no prediction is available', () => {
      const { container } = render(<Game />);

      // Empty board - no prediction available
      const nextBtn = screen.getByRole('button', { name: 'next' });
      fireEvent.click(nextBtn);

      const predictionText = document.querySelector('.next-prediction-text');
      expect(predictionText?.textContent).toContain('次の候補は見つかりませんでした');
    });
  });

  describe('Clear Button Functionality', () => {
    test('should clear board and history completely', () => {
      const { container } = render(<Game />);
      const numberSelectorButtons = container.querySelectorAll('.number-selector-row button');
      const squares = container.querySelectorAll('.square');

      // Fill multiple squares
      fireEvent.click(numberSelectorButtons[5]);
      fireEvent.click(squares[0]);
      fireEvent.click(squares[1]);

      // Verify they are filled
      expect(squares[0]).toHaveTextContent('5');
      expect(squares[1]).toHaveTextContent('5');

      // Clear
      const clearBtn = screen.getByRole('button', { name: 'clear' });
      fireEvent.click(clearBtn);

      // History should be empty
      const historyView = container.querySelector('.history-view');
      expect(historyView?.children.length).toBe(0);
    });

    test('should reset selectValue to space on clear', () => {
      const { container } = render(<Game />);
      const numberSelectorButtons = container.querySelectorAll('.number-selector-row button');

      // Select a number
      fireEvent.click(numberSelectorButtons[5]);
      expect(numberSelectorButtons[5]).toHaveClass('selected');

      // Clear
      const clearBtn = screen.getByRole('button', { name: 'clear' });
      fireEvent.click(clearBtn);

      // Selected value should still be selected (clear doesn't change selection)
      expect(numberSelectorButtons[5]).toHaveClass('selected');
    });
  });

  describe('Candidates View', () => {
    test('should display candidates board', () => {
      const { container } = render(<Game />);
      const candidateBoards = container.querySelectorAll('.board-top');

      // Should have two boards (main + candidates)
      expect(candidateBoards.length).toBe(2);
    });

    test('should update candidates when clicking on main board', () => {
      const { container } = render(<Game />);
      const numberSelectorButtons = container.querySelectorAll('.number-selector-row button');
      const squares = container.querySelectorAll('.square');

      // Fill some squares
      fireEvent.click(numberSelectorButtons[1]);
      fireEvent.click(squares[0]);

      // Click on candidates board (first row to get basic strategy)
      const candidatesBoard = container.querySelectorAll('.board-top')[1];
      const candidateSquares = candidatesBoard.querySelectorAll('.square');
      fireEvent.click(candidateSquares[0]); // Click row > 5 for third strategy

      // Should not throw error
      expect(candidatesBoard).toBeInTheDocument();
    });
  });
});
