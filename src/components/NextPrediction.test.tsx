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
    const predictText = 'Row 1, Column 2 = 5';
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

    expect(screen.getByText('Old text')).toBeInTheDocument();

    rerender(<NextPrediction onClick={mockClick} predictText="New text" />);
    expect(screen.queryByText('Old text')).not.toBeInTheDocument();
    expect(screen.getByText('New text')).toBeInTheDocument();
  });

  test('should call onClick multiple times when clicked multiple times', () => {
    const mockClick = jest.fn();
    render(<NextPrediction onClick={mockClick} predictText="" />);

    const button = screen.getByRole('button', { name: 'next' });
    fireEvent.click(button);
    fireEvent.click(button);
    fireEvent.click(button);

    expect(mockClick).toHaveBeenCalledTimes(3);
  });

  test('should display empty prediction text', () => {
    const mockClick = jest.fn();
    const { container } = render(<NextPrediction onClick={mockClick} predictText="" />);

    const textSpan = container.querySelector('.next-prediction-text');
    expect(textSpan?.textContent).toBe('');
  });

  test('should display long prediction text', () => {
    const mockClick = jest.fn();
    const longText = 'Row 5, Column 7 is 3. This is a very detailed prediction message that might be long.';
    render(<NextPrediction onClick={mockClick} predictText={longText} />);

    expect(screen.getByText(longText)).toBeInTheDocument();
  });

  test('should handle special characters in prediction text', () => {
    const mockClick = jest.fn();
    const specialText = '[↓5][→3]＝7(値確定)';
    render(<NextPrediction onClick={mockClick} predictText={specialText} />);

    expect(screen.getByText(specialText)).toBeInTheDocument();
  });

  test('should render with both button and text visible', () => {
    const mockClick = jest.fn();
    const { container } = render(<NextPrediction onClick={mockClick} predictText="Test prediction" />);

    const button = screen.getByRole('button', { name: 'next' });
    const textSpan = container.querySelector('.next-prediction-text');

    expect(button).toBeInTheDocument();
    expect(textSpan).toBeInTheDocument();
  });

  test('should maintain button functionality after prediction update', () => {
    const mockClick = jest.fn();
    const { rerender } = render(<NextPrediction onClick={mockClick} predictText="First" />);

    fireEvent.click(screen.getByRole('button', { name: 'next' }));
    expect(mockClick).toHaveBeenCalledTimes(1);

    rerender(<NextPrediction onClick={mockClick} predictText="Second" />);
    fireEvent.click(screen.getByRole('button', { name: 'next' }));
    expect(mockClick).toHaveBeenCalledTimes(2);
  });

  test('should have consistent CSS classes', () => {
    const mockClick = jest.fn();
    const { container } = render(<NextPrediction onClick={mockClick} predictText="" />);

    const button = screen.getByRole('button');
    const textSpan = container.querySelector('.next-prediction-text');

    expect(button).toHaveClass('next-prediction');
    expect(textSpan).toHaveClass('next-prediction-text');
  });

  test('should handle transition from empty to filled text', () => {
    const mockClick = jest.fn();
    const { rerender, container } = render(<NextPrediction onClick={mockClick} predictText="" />);

    let textSpan = container.querySelector('.next-prediction-text');
    expect(textSpan?.textContent).toBe('');

    rerender(<NextPrediction onClick={mockClick} predictText="Now filled" />);
    textSpan = container.querySelector('.next-prediction-text');
    expect(textSpan?.textContent).toBe('Now filled');
  });

  test('should respond to rapid prop changes', () => {
    const mockClick = jest.fn();
    const { rerender } = render(<NextPrediction onClick={mockClick} predictText="Text 1" />);

    expect(screen.getByText('Text 1')).toBeInTheDocument();

    for (let i = 2; i <= 5; i++) {
      rerender(<NextPrediction onClick={mockClick} predictText={`Text ${i}`} />);
      expect(screen.getByText(`Text ${i}`)).toBeInTheDocument();
    }
  });
});
