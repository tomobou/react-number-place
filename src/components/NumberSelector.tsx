import React from 'react';

export interface NumberSelectorProps {
    selectValue: string,
    onClick: (value: string) => void
}

export class NumberSelector extends React.Component<NumberSelectorProps> {
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
