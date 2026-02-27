import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Board } from './Board';

describe('Board Component', () => {
    test('should render a board with 81 squares', () => {
        const mockClick = jest.fn();
        const squares = Array(9).fill(null).map(() => Array(9).fill(' '));
        
        const { container } = render(<Board squares={squares} onClick={mockClick} />);
        const buttons = container.querySelectorAll('.square');
        
        expect(buttons.length).toBe(81);
    });

    test('should render 9 board rows', () => {
        const mockClick = jest.fn();
        const squares = Array(9).fill(null).map(() => Array(9).fill(' '));
        
        const { container } = render(<Board squares={squares} onClick={mockClick} />);
        const boardRows = container.querySelectorAll('.board-row');
        
        expect(boardRows.length).toBe(3);
    });

    test('should render 9 blocks (3x3)', () => {
        const mockClick = jest.fn();
        const squares = Array(9).fill(null).map(() => Array(9).fill(' '));
        
        const { container } = render(<Board squares={squares} onClick={mockClick} />);
        const blocks = container.querySelectorAll('.board-block');
        
        expect(blocks.length).toBe(9);
    });

    test('should display values from squares array', () => {
        const mockClick = jest.fn();
        const squares = Array(9).fill(null).map(() => Array(9).fill(' '));
        squares[0][0] = '5';
        squares[4][4] = '3';
        squares[8][8] = '9';
        
        const { container } = render(<Board squares={squares} onClick={mockClick} />);
        const buttons = container.querySelectorAll('.square');
        
        expect(buttons[0]).toHaveTextContent('5');
        expect(buttons[40]).toHaveTextContent('3');
        expect(buttons[80]).toHaveTextContent('9');
    });

    test('should call onClick with correct row and col when square is clicked', () => {
        const mockClick = jest.fn();
        const squares = Array(9).fill(null).map(() => Array(9).fill(' '));
        
        const { container } = render(<Board squares={squares} onClick={mockClick} />);
        const buttons = container.querySelectorAll('.square');
        
        fireEvent.click(buttons[0]);
        expect(mockClick).toHaveBeenCalledWith(0, 0);
        
        fireEvent.click(buttons[40]);
        expect(mockClick).toHaveBeenCalledWith(4, 4);
        
        fireEvent.click(buttons[80]);
        expect(mockClick).toHaveBeenCalledWith(8, 8);
    });

    test('should update when squares prop changes', () => {
        const mockClick = jest.fn();
        const squares1 = Array(9).fill(null).map(() => Array(9).fill(' '));
        squares1[0][0] = '1';
        
        const { container, rerender } = render(<Board squares={squares1} onClick={mockClick} />);
        let buttons = container.querySelectorAll('.square');
        expect(buttons[0]).toHaveTextContent('1');
        
        const squares2 = Array(9).fill(null).map(() => Array(9).fill(' '));
        squares2[0][0] = '9';
        
        rerender(<Board squares={squares2} onClick={mockClick} />);
        buttons = container.querySelectorAll('.square');
        expect(buttons[0]).toHaveTextContent('9');
    });
});
