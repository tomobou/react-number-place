import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Square } from './Square';

describe('Square Component', () => {
    test('should render a button with the given value', () => {
        const mockClick = jest.fn();
        render(<Square onClick={mockClick} value="5" />);

        const button = screen.getByRole('button');
        expect(button).toHaveTextContent('5');
    });

    test('should render empty space for empty value', () => {
        const mockClick = jest.fn();
        const { container } = render(<Square onClick={mockClick} value=" " />);

        const button = container.querySelector('.square');
        expect(button).toBeInTheDocument();
    });

    test('should call onClick when clicked', () => {
        const mockClick = jest.fn();
        render(<Square onClick={mockClick} value="5" />);

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(mockClick).toHaveBeenCalledTimes(1);
    });

    test('should have square class', () => {
        const mockClick = jest.fn();
        render(<Square onClick={mockClick} value="5" />);

        const button = screen.getByRole('button');
        expect(button).toHaveClass('square');
    });

    test('should handle multiple values', () => {
        const mockClick = jest.fn();
        const { rerender } = render(<Square onClick={mockClick} value="1" />);

        expect(screen.getByRole('button')).toHaveTextContent('1');

        rerender(<Square onClick={mockClick} value="9" />);
        expect(screen.getByRole('button')).toHaveTextContent('9');
    });

    test('should handle rapid consecutive clicks', () => {
        const mockClick = jest.fn();
        render(<Square onClick={mockClick} value="5" />);

        const button = screen.getByRole('button');
        fireEvent.click(button);
        fireEvent.click(button);
        fireEvent.click(button);

        expect(mockClick).toHaveBeenCalledTimes(3);
    });

    test('should display numeric values correctly', () => {
        const mockClick = jest.fn();
        for (let i = 1; i <= 9; i++) {
            const { container } = render(<Square onClick={mockClick} value={String(i)} />);
            expect(container.querySelector('.square')).toHaveTextContent(String(i));
        }
    });

    test('should maintain onClick reference through re-renders', () => {
        const mockClick = jest.fn();
        const { rerender } = render(<Square onClick={mockClick} value="1" />);

        fireEvent.click(screen.getByRole('button'));
        expect(mockClick).toHaveBeenCalledTimes(1);

        rerender(<Square onClick={mockClick} value="2" />);
        fireEvent.click(screen.getByRole('button'));
        expect(mockClick).toHaveBeenCalledTimes(2);
    });

    test('should handle null-like display values', () => {
        const mockClick = jest.fn();
        render(<Square onClick={mockClick} value="" />);

        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
        expect(button.textContent).toBe('');
    });

    test('should preserve click functionality with different values', () => {
        const mockClick = jest.fn();
        const { rerender } = render(<Square onClick={mockClick} value="3" />);

        fireEvent.click(screen.getByRole('button'));
        expect(mockClick).toHaveBeenCalledTimes(1);

        rerender(<Square onClick={mockClick} value="0" />);
        fireEvent.click(screen.getByRole('button'));
        expect(mockClick).toHaveBeenCalledTimes(2);
    });
});
