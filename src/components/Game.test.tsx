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
});
