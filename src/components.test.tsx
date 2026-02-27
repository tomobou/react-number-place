import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Square Component Tests
interface SquareProps {
    onClick: () => void,
    value: string
}

class Square extends React.Component<SquareProps> {
    render() {
        return (
            <button className="square" onClick={this.props.onClick}>
                {this.props.value}
            </button>
        );
    }
}

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

// NumberSelector Component Tests
interface NumberSelectorProps {
    selectValue: string,
    onClick: (value: string) => void
}

class NumberSelector extends React.Component<NumberSelectorProps> {
    render() {
        const parsed = parseInt(this.props.selectValue, 10);
        let classNames = Array(10).fill("number-selector");
        if (isNaN(parsed) || parsed <= 0 || parsed >= 10) {
            classNames[0] += " selected"
        } else {
            classNames[parsed] += " selected"
        }
        return (
            <div className="number-selector-row">
                {classNames.map((className, index) => {
                    let value = (index === 0) ? " " : index.toString()
                    return (
                        <button key={"number-selector-" + index} className={className} onClick={() => this.props.onClick(value)}>{value}</button>
                    )
                })}
            </div>
        )
    }
}

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

// HistoryView Component Tests
interface HistoryViewProps {
    history: string[]
}

class HistoryView extends React.Component<HistoryViewProps> {
    render() {
        let history = this.props.history.map((message, index) => (
            <div key={index}>{message}</div>
        ))
        return (
            <div className="history-view">
                {history}
            </div>
        )
    }
}

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

// Button Components Tests
interface ClickActionProps {
    onClick: () => void
}

function Save(props: ClickActionProps) {
    return (
        <button className="save" onClick={props.onClick}>save</button>
    )
}

function Load(props: ClickActionProps) {
    return (
        <button className="load" onClick={props.onClick}>load</button>
    )
}

function Clear(props: ClickActionProps) {
    return (
        <button className="clear" onClick={props.onClick}>clear</button>
    )
}

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

// NextPrediction Component Tests
interface NextPredictionProps {
    onClick: () => void,
    predictText: string
}

function NextPrediction(props: NextPredictionProps) {
    return (
        <div>
            <button className="next-prediction" onClick={props.onClick}>next</button>
            <span className="next-prediction-text">{props.predictText}</span>
        </div>
    )
}

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
