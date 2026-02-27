import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NextPrediction } from './NextPrediction';

describe('NextPrediction Component', () => {
    test('should render next button and prediction text', () => {
        const mockClick = jest.fn();
        const { container } = render(<NextPrediction onClick={mockClick} predictText="" />);

        expect(screen.getByRole('button', { name: 'next' })).toBeInTheDocument();
        const textSpan = container.querySelector('.next-prediction-text');
        expect(textSpan).toBeInTheDocument();
    });

    test('should display prediction text', () => {
        const mockClick = jest.fn();
        const predictText = "Row 1, Column 2 = 5";
        render(<NextPrediction onClick={mockClick} predictText={predictText} />);

        expect(screen.getByText(predictText)).toBeInTheDocument();
    });

    test('should call onClick when next button is clicked', () => {
        const mockClick = jest.fn();
        render(<NextPrediction onClick={mockClick} predictText="" />);

        fireEvent.click(screen.getByRole('button', { name: 'next' }));
        expect(mockClick).toHaveBeenCalledTimes(1);
    });

    test('should have next-prediction class on button', () => {
        const mockClick = jest.fn();
        render(<NextPrediction onClick={mockClick} predictText="" />);

        expect(screen.getByRole('button')).toHaveClass('next-prediction');
    });

    test('should update prediction text when props change', () => {
        const mockClick = jest.fn();
        const { rerender } = render(<NextPrediction onClick={mockClick} predictText="Old text" />);

        expect(screen.getByText("Old text")).toBeInTheDocument();

        rerender(<NextPrediction onClick={mockClick} predictText="New text" />);
        expect(screen.queryByText("Old text")).not.toBeInTheDocument();
        expect(screen.getByText("New text")).toBeInTheDocument();
    });
});
