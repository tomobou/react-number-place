import React from 'react';

export interface ClickActionProps {
    onClick: () => void
}

export function Save(props: ClickActionProps) {
    return (
        <button className="save" onClick={props.onClick}>save</button>
    )
}

export function Load(props: ClickActionProps) {
    return (
        <button className="load" onClick={props.onClick}>load</button>
    )
}

export function Clear(props: ClickActionProps) {
    return (
        <button className="clear" onClick={props.onClick}>clear</button>
    )
}
