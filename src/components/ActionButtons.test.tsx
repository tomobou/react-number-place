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

  describe('Combined Action Buttons', () => {
    test('should render all three action buttons together', () => {
      const mockClick = jest.fn();
      const { container } = render(
        <div>
          <Save onClick={mockClick} />
          <Load onClick={mockClick} />
          <Clear onClick={mockClick} />
        </div>
      );

      expect(screen.getByRole('button', { name: 'save' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'load' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'clear' })).toBeInTheDocument();
    });

    test('should call correct callbacks for each button', () => {
      const mockSave = jest.fn();
      const mockLoad = jest.fn();
      const mockClear = jest.fn();

      const { container } = render(
        <div>
          <Save onClick={mockSave} />
          <Load onClick={mockLoad} />
          <Clear onClick={mockClear} />
        </div>
      );

      fireEvent.click(screen.getByRole('button', { name: 'save' }));
      expect(mockSave).toHaveBeenCalledTimes(1);
      expect(mockLoad).not.toHaveBeenCalled();
      expect(mockClear).not.toHaveBeenCalled();

      fireEvent.click(screen.getByRole('button', { name: 'load' }));
      expect(mockLoad).toHaveBeenCalledTimes(1);
      expect(mockClear).not.toHaveBeenCalled();

      fireEvent.click(screen.getByRole('button', { name: 'clear' }));
      expect(mockClear).toHaveBeenCalledTimes(1);
    });

    test('should handle multiple clicks on same button', () => {
      const mockClick = jest.fn();
      render(<Save onClick={mockClick} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(mockClick).toHaveBeenCalledTimes(3);
    });

    test('should have distinct CSS classes for each button', () => {
      const mockClick = jest.fn();
      render(
        <div>
          <Save onClick={mockClick} />
          <Load onClick={mockClick} />
          <Clear onClick={mockClick} />
        </div>
      );

      const saveBtn = screen.getByRole('button', { name: 'save' });
      const loadBtn = screen.getByRole('button', { name: 'load' });
      const clearBtn = screen.getByRole('button', { name: 'clear' });

      expect(saveBtn).toHaveClass('save');
      expect(loadBtn).toHaveClass('load');
      expect(clearBtn).toHaveClass('clear');
    });
  });
});
