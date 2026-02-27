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
});
