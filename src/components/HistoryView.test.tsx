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
        render(<HistoryView history={["Test message"]} />);
        expect(screen.getByText("Test message")).toBeInTheDocument();
    });

    test('should render multiple history items', () => {
        const history = ["Item 1", "Item 2", "Item 3"];
        render(<HistoryView history={history} />);

        history.forEach(item => {
            expect(screen.getByText(item)).toBeInTheDocument();
        });
    });

    test('should preserve order of history items', () => {
        const { container } = render(<HistoryView history={["First", "Second", "Third"]} />);
        const historyDiv = container.querySelector('.history-view');
        const items = historyDiv?.querySelectorAll('div');

        expect(items?.[0]).toHaveTextContent('First');
        expect(items?.[1]).toHaveTextContent('Second');
        expect(items?.[2]).toHaveTextContent('Third');
    });

    test('should update history when props change', () => {
        const { rerender } = render(<HistoryView history={["Old"]} />);
        expect(screen.getByText("Old")).toBeInTheDocument();

        rerender(<HistoryView history={["New"]} />);
        expect(screen.queryByText("Old")).not.toBeInTheDocument();
        expect(screen.getByText("New")).toBeInTheDocument();
    });
});
