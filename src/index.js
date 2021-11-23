import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Hello extends React.Component {
    render() {
        return (
            <div>hello world</div>
        )
    }
}
ReactDOM.render(
    <Hello />,
    document.getElementById('root')
);