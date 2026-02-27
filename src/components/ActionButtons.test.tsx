import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Save, Load, Clear } from './ActionButtons';

describe('Action Button Components', () => {
    describe('Save Button', () => {
        test('should render save button', () => {
            const mockClick = jest.fn();
            render(<Save onClick={mockClick} />);
            expect(screen.getByRole('button', { name: 'save' })).toBeInTheDocument();
        });

        test('should have save class', () => {
            const mockClick = jest.fn();
            render(<Save onClick={mockClick} />);
            expect(screen.getByRole('button')).toHaveClass('save');
        });

        test('should call onClick when clicked', () => {
            const mockClick = jest.fn();
            render(<Save onClick={mockClick} />);
            fireEvent.click(screen.getByRole('button'));
            expect(mockClick).toHaveBeenCalledTimes(1);
        });
    });

    describe('Load Button', () => {
        test('should render load button', () => {
            const mockClick = jest.fn();
            render(<Load onClick={mockClick} />);
            expect(screen.getByRole('button', { name: 'load' })).toBeInTheDocument();
        });

        test('should have load class', () => {
            const mockClick = jest.fn();
            render(<Load onClick={mockClick} />);
            expect(screen.getByRole('button')).toHaveClass('load');
        });

        test('should call onClick when clicked', () => {
            const mockClick = jest.fn();
            render(<Load onClick={mockClick} />);
            fireEvent.click(screen.getByRole('button'));
            expect(mockClick).toHaveBeenCalledTimes(1);
        });
    });

    describe('Clear Button', () => {
        test('should render clear button', () => {
            const mockClick = jest.fn();
            render(<Clear onClick={mockClick} />);
            expect(screen.getByRole('button', { name: 'clear' })).toBeInTheDocument();
        });

        test('should have clear class', () => {
            const mockClick = jest.fn();
            render(<Clear onClick={mockClick} />);
            expect(screen.getByRole('button')).toHaveClass('clear');
        });

        test('should call onClick when clicked', () => {
            const mockClick = jest.fn();
            render(<Clear onClick={mockClick} />);
            fireEvent.click(screen.getByRole('button'));
            expect(mockClick).toHaveBeenCalledTimes(1);
        });
    });
});
