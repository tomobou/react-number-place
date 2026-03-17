import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { HistoryView } from './HistoryView';

describe('HistoryView Component', () => {
  test('should render empty history view', () => {
    const { container } = render(<HistoryView history={[]} />);
    const historyView = container.querySelector('.history-view');
    expect(historyView).toBeInTheDocument();
    expect(historyView?.children.length).toBe(0);
  });

  test('should render single history item', () => {
    render(<HistoryView history={['Test message']} />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  test('should render multiple history items', () => {
    const history = ['Item 1', 'Item 2', 'Item 3'];
    render(<HistoryView history={history} />);

    history.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  test('should preserve order of history items', () => {
    const { container } = render(<HistoryView history={['First', 'Second', 'Third']} />);
    const historyDiv = container.querySelector('.history-view');
    const items = historyDiv?.querySelectorAll('div');

    expect(items?.[0]).toHaveTextContent('First');
    expect(items?.[1]).toHaveTextContent('Second');
    expect(items?.[2]).toHaveTextContent('Third');
  });

  test('should update history when props change', () => {
    const { rerender } = render(<HistoryView history={['Old']} />);
    expect(screen.getByText('Old')).toBeInTheDocument();

    rerender(<HistoryView history={['New']} />);
    expect(screen.queryByText('Old')).not.toBeInTheDocument();
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  test('should render large history arrays', () => {
    const largeHistory = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`);
    render(<HistoryView history={largeHistory} />);

    largeHistory.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  test('should handle special characters in history', () => {
    const specialHistory = ['↓1][→5]＝3', 'Test@#$%', 'Unicode: ñ é ü'];
    render(<HistoryView history={specialHistory} />);

    specialHistory.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  test('should maintain order when history has duplicate entries', () => {
    const { container } = render(<HistoryView history={['Dup', 'Dup', 'Dup']} />);
    const historyDiv = container.querySelector('.history-view');
    const items = historyDiv?.querySelectorAll('div');

    expect(items?.length).toBe(3);
  });

  test('should handle empty strings in history array', () => {
    const historyWithEmpty = ['First', '', 'Third'];
    const { container } = render(<HistoryView history={historyWithEmpty} />);
    const historyDiv = container.querySelector('.history-view');
    const items = historyDiv?.querySelectorAll('div');

    expect(items?.length).toBe(3);
  });

  test('should persist history order through multiple updates', () => {
    const { rerender, container } = render(<HistoryView history={['A', 'B', 'C']} />);

    let historyDiv = container.querySelector('.history-view');
    let items = historyDiv?.querySelectorAll('div');
    expect(items?.[0]).toHaveTextContent('A');

    rerender(<HistoryView history={['A', 'B', 'C', 'D']} />);
    historyDiv = container.querySelector('.history-view');
    items = historyDiv?.querySelectorAll('div');
    expect(items?.[0]).toHaveTextContent('A');
    expect(items?.[3]).toHaveTextContent('D');
  });

  test('should render with long text entries', () => {
    const longText = 'This is a very long history entry that should be displayed properly';
    render(<HistoryView history={[longText]} />);

    expect(screen.getByText(longText)).toBeInTheDocument();
  });

  test('should have correct CSS class', () => {
    const { container } = render(<HistoryView history={[]} />);
    const historyView = container.querySelector('.history-view');

    expect(historyView).toHaveClass('history-view');
  });
});
