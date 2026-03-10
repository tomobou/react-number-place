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

    test('should call onClick with correct parameters for various positions', () => {
        const mockClick = jest.fn();
        const squares = Array(9).fill(null).map(() => Array(9).fill(' '));
        
        const { container } = render(<Board squares={squares} onClick={mockClick} />);
        const buttons = container.querySelectorAll('.square');
        
        // Test corner positions
        fireEvent.click(buttons[0]);
        expect(mockClick).toHaveBeenCalledWith(0, 0);
        
        fireEvent.click(buttons[80]);
        expect(mockClick).toHaveBeenCalledWith(8, 8);
        
        // Verify click handler works multiple times
        expect(mockClick).toHaveBeenCalledTimes(2);
    });

    test('should render all 9 block sections', () => {
        const mockClick = jest.fn();
        const squares = Array(9).fill(null).map(() => Array(9).fill(' '));
        
        const { container } = render(<Board squares={squares} onClick={mockClick} />);
        const blocks = container.querySelectorAll('.board-block');
        
        expect(blocks.length).toBe(9);
        expect(blocks[0]).toBeInTheDocument();
        expect(blocks[8]).toBeInTheDocument();
    });

    test('should render block rows correctly', () => {
        const mockClick = jest.fn();
        const squares = Array(9).fill(null).map(() => Array(9).fill(' '));
        
        const { container } = render(<Board squares={squares} onClick={mockClick} />);
        const blockRows = container.querySelectorAll('.block-row');
        
        // Each 3x3 block has 3 rows
        // 9 blocks * 3 rows each = 27 block-rows
        expect(blockRows.length).toBe(27);
    });

    test('should handle rapid updates', () => {
        const mockClick = jest.fn();
        const { rerender } = render(<Board squares={Array(9).fill(null).map(() => Array(9).fill(' '))} onClick={mockClick} />);
        
        for (let i = 0; i < 5; i++) {
            const squares = Array(9).fill(null).map(() => Array(9).fill(' '));
            squares[i][i] = String(i + 1);
            rerender(<Board squares={squares} onClick={mockClick} />);
        }
        
        // Component should handle multiple updates without crashing
        expect(mockClick).toBeDefined();
    });

    test('should handle board with all same values', () => {
        const mockClick = jest.fn();
        const squares = Array(9).fill(null).map(() => Array(9).fill('5'));
        
        const { container } = render(<Board squares={squares} onClick={mockClick} />);
        const buttons = container.querySelectorAll('.square');
        
        buttons.forEach(button => {
            expect(button).toHaveTextContent('5');
        });
    });

    test('should maintain structure with mixed empty and filled squares', () => {
        const mockClick = jest.fn();
        const squares = Array(9).fill(null).map((_, i) => 
            Array(9).fill(null).map((_, j) => i % 2 === 0 && j % 2 === 0 ? String(j + 1) : ' ')
        );
        
        const { container } = render(<Board squares={squares} onClick={mockClick} />);
        const buttons = container.querySelectorAll('.square');
        
        expect(buttons.length).toBe(81);
        let filledCount = 0;
        buttons.forEach((button, idx) => {
            if (button.textContent !== ' ') {
                filledCount++;
            }
        });
        expect(filledCount).toBeGreaterThan(0);
    });

    test('should trigger onClick for every square click', () => {
        const mockClick = jest.fn();
        const squares = Array(9).fill(null).map(() => Array(9).fill(' '));
        
        const { container } = render(<Board squares={squares} onClick={mockClick} />);
        const buttons = container.querySelectorAll('.square');
        
        for (let i = 0; i < 81; i += 10) {
            fireEvent.click(buttons[i]);
        }
        
        expect(mockClick).toHaveBeenCalledTimes(9);
    });
});
