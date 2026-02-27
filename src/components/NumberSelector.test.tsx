import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NumberSelector } from './NumberSelector';

describe('NumberSelector Component', () => {
    test('should render 10 buttons (0-9 equivalent)', () => {
        const mockClick = jest.fn();
        render(<NumberSelector selectValue=" " onClick={mockClick} />);

        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(10);
    });

    test('should have first button selected when selectValue is empty', () => {
        const mockClick = jest.fn();
        render(<NumberSelector selectValue=" " onClick={mockClick} />);

        const buttons = screen.getAllByRole('button');
        expect(buttons[0]).toHaveClass('selected');
    });

    test('should have corresponding button selected for number', () => {
        const mockClick = jest.fn();
        render(<NumberSelector selectValue="5" onClick={mockClick} />);

        const buttons = screen.getAllByRole('button');
        expect(buttons[5]).toHaveClass('selected');
    });

    test('should call onClick with correct value when clicked', () => {
        const mockClick = jest.fn();
        render(<NumberSelector selectValue=" " onClick={mockClick} />);

        const buttons = screen.getAllByRole('button');
        fireEvent.click(buttons[3]);

        expect(mockClick).toHaveBeenCalledWith('3');
    });

    test('should call onClick with space for first button', () => {
        const mockClick = jest.fn();
        render(<NumberSelector selectValue=" " onClick={mockClick} />);

        const buttons = screen.getAllByRole('button');
        fireEvent.click(buttons[0]);

        expect(mockClick).toHaveBeenCalledWith(' ');
    });

    test('should highlight first button for invalid select value', () => {
        const mockClick = jest.fn();
        const { rerender } = render(<NumberSelector selectValue="10" onClick={mockClick} />);

        const buttons = screen.getAllByRole('button');
        expect(buttons[0]).toHaveClass('selected');

        rerender(<NumberSelector selectValue="abc" onClick={mockClick} />);
        const updatedButtons = screen.getAllByRole('button');
        expect(updatedButtons[0]).toHaveClass('selected');
    });

    test('should update selected button when selectValue changes', () => {
        const mockClick = jest.fn();
        const { rerender } = render(<NumberSelector selectValue="2" onClick={mockClick} />);

        let buttons = screen.getAllByRole('button');
        expect(buttons[2]).toHaveClass('selected');

        rerender(<NumberSelector selectValue="7" onClick={mockClick} />);
        buttons = screen.getAllByRole('button');
        expect(buttons[7]).toHaveClass('selected');
    });
});
