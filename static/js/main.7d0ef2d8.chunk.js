(this.webpackJsonptomobou=this.webpackJsonptomobou||[]).push([[0],{14:function(e,t,n){},9:function(e,t,n){"use strict";n.r(t);var r=n(7),a=n(2),s=n(3),i=n(5),c=n(4),o=n(1),u=n.n(o),l=n(8),d=n.n(l),h=(n(14),n(0)),f=function(e){Object(i.a)(n,e);var t=Object(c.a)(n);function n(){return Object(a.a)(this,n),t.apply(this,arguments)}return Object(s.a)(n,[{key:"render",value:function(){return Object(h.jsx)("button",{className:"square",onClick:this.props.onClick,children:this.props.value})}}]),n}(u.a.Component),v=function(e){Object(i.a)(n,e);var t=Object(c.a)(n);function n(){return Object(a.a)(this,n),t.apply(this,arguments)}return Object(s.a)(n,[{key:"renderBoardRow",value:function(e,t){return Object(h.jsxs)("div",{className:"board-row",children:[this.renderBlock(e,t),this.renderBlock(e,t+3),this.renderBlock(e,t+6)]})}},{key:"renderBlock",value:function(e,t){return Object(h.jsxs)("div",{className:"board-block",children:[this.renderBlockRow(e,t),this.renderBlockRow(e+1,t),this.renderBlockRow(e+2,t)]})}},{key:"renderBlockRow",value:function(e,t){return Object(h.jsxs)("div",{className:"block-row",children:[this.renderSquare(e,t),this.renderSquare(e,t+1),this.renderSquare(e,t+2)]})}},{key:"renderSquare",value:function(e,t){var n=this;return Object(h.jsx)(f,{value:this.props.squares[e][t],onClick:function(){return n.props.onClick(e,t)}})}},{key:"render",value:function(){return Object(h.jsx)("div",{children:Object(h.jsxs)("div",{className:"board-top",children:[this.renderBoardRow(0,0),this.renderBoardRow(3,0),this.renderBoardRow(6,0)]})})}}]),n}(u.a.Component);function j(e){var t=e.map((function(e,t){return e.map((function(e,n){return{value:"1"<=e&&e<="9"?Number(e):null,candidates:"1"<=e&&e<="9"?[]:Array.from({length:9},(function(e,t){return t+1})),rowIndex:t,colIndex:n}}))})),n=function(e){var t=Array(27),n=0;e.forEach((function(e){t[n++]=e}));for(var r=function(r){t[n++]=e.map((function(e){return e[r]}))},a=0;a<9;a++)r(a);for(var s=0;s<9;s+=3)for(var i=0;i<9;i+=3)t[n++]=[e[s][i],e[s][i+1],e[s][i+2],e[s+1][i],e[s+1][i+1],e[s+1][i+2],e[s+2][i],e[s+2][i+1],e[s+2][i+2]];return t}(t);!function(e){e.forEach((function(e){var t=e.filter((function(e){return null!==e.value})).map((function(e){return e.value}));e.forEach((function(e){e.candidates=e.candidates.filter((function(e){return!t.some((function(t){return e===t}))}))}))}))}(n);var a=function(e,t){for(var n=0;n<9;n++)for(var r=0;r<9;r++){var a=e[n][r].candidates;if(1===e[n][r].candidates.length)return y(!0,t,n,r,a[0])}return b()}(t,"UNIQUE_PLACE");return a.hasPrediction?a:(a=function(e){var t,n=Object(r.a)(e);try{for(n.s();!(t=n.n()).done;){var a=t.value,s=a.reduce((function(e,t,n){return t.candidates.forEach((function(t){var r=e.get(t);void 0!==r?(r.push(n),e.set(t,r)):e.set(t,[n])})),e}),new Map);console.log(s);var i,c=null,o=Object(r.a)(s.entries());try{for(o.s();!(i=o.n()).done;){var u=i.value;if(1===u[1].length){(c=a[u[1][0]]).candidate=[u[0]];break}}}catch(l){o.e(l)}finally{o.f()}if(console.log(c),null!==c)return y(!0,"UNIQUE_CANDIDATE",c.rowIndex,c.colIndex,c.candidate[0])}}catch(l){n.e(l)}finally{n.f()}return b()}(n),a.hasPrediction?a:(console.log(t),console.log(n),{hasPrediction:!1}))}function b(){return y(!1)}function y(e,t,n,r,a){return e?{hasPrediction:!0,type:t,row:n,col:r,value:a}:{hasPrediction:!1}}function p(e){return Object(h.jsxs)("div",{children:[Object(h.jsx)("button",{className:"next-candidate",onClick:e.onClick,children:"next"}),Object(h.jsx)("span",{className:"next-candidate-text",children:e.predictText})]})}function k(e){return Object(h.jsx)("button",{className:"save",onClick:e.onClick,children:"save"})}function O(e){return Object(h.jsx)("button",{className:"load",onClick:e.onClick,children:"load"})}function x(e){return Object(h.jsx)("button",{className:"clear",onClick:e.onClick,children:"clear"})}var m=function(e){Object(i.a)(n,e);var t=Object(c.a)(n);function n(){return Object(a.a)(this,n),t.apply(this,arguments)}return Object(s.a)(n,[{key:"render",value:function(){var e=this,t=parseInt(this.props.selectValue,10),n=Array(10).fill("number-selector");return isNaN(t)||t<=0||t>=10?n[0]+=" selected":n[t]+=" selected",Object(h.jsx)("div",{className:"number-selector-row",children:n.map((function(t,n){var r=0===n?" ":n.toString();return Object(h.jsx)("button",{className:t,onClick:function(){return e.props.onClick(r)},children:r},"number-selector-"+n)}))})}}]),n}(u.a.Component),C=function(e){Object(i.a)(n,e);var t=Object(c.a)(n);function n(){return Object(a.a)(this,n),t.apply(this,arguments)}return Object(s.a)(n,[{key:"render",value:function(){var e=this.props.history.map((function(e){return Object(h.jsx)("div",{children:e})}));return Object(h.jsx)("div",{className:"history-view",children:e})}}]),n}(u.a.Component),S=function(e){Object(i.a)(n,e);var t=Object(c.a)(n);function n(e){var r;return Object(a.a)(this,n),(r=t.call(this,e)).state={squares:Array(9).fill(null).map((function(e){return Array(9).fill(null)})),selectValue:" ",predictText:"",history:[]},r}return Object(s.a)(n,[{key:"getPredictionTypeMessage",value:function(e){switch(e){case"UNIQUE_PLACE":return"\u5024\u78ba\u5b9a";case"UNIQUE_CANDIDATE":return"\u6761\u4ef6\u78ba\u5b9a";default:return e}}},{key:"getSetValueHistoryPrediction",value:function(e){return this.getSetValueHistoryMessage(e.row,e.col,e.value,this.getPredictionTypeMessage(e.type))}},{key:"getSetValueHistoryMessage",value:function(e,t,n,r){return"[\u2193"+(e+1)+"][\u2192"+(t+1)+"]\uff1d"+n+"("+r+")"}},{key:"clearHistory",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,t=[];null!==e&&t.push(e),this.setState((function(e){return{history:t}}))}},{key:"addHistory",value:function(e){var t=this.state.history;t.push(e),this.setState((function(e){return{history:t}}))}},{key:"handleClick",value:function(e,t){var n=this.state.squares.slice();n[e][t]=this.state.selectValue,this.setState((function(e){return{squares:n}})),this.addHistory(this.getSetValueHistoryMessage(e,t,this.state.selectValue,"\u30e6\u30fc\u30b6\u30fc"))}},{key:"handleSelect",value:function(e){this.setState((function(t){return{selectValue:e}}))}},{key:"handleNextCandidate",value:function(){var e=j(this.state.squares);if(e.hasPrediction){var t=this.state.squares,n="["+(e.row+1)+"]\u884c["+(e.col+1)+"]\u5217\u76ee\u306f"+e.value+"\u3067\u3059\u3002";t[e.row][e.col]=e.value.toString(),this.setState((function(e){return{squares:t,predictText:n}})),this.addHistory(this.getSetValueHistoryPrediction(e))}else this.setState((function(e){return{predictText:"\u6b21\u306e\u5019\u88dc\u306f\u898b\u3064\u304b\u308a\u307e\u305b\u3093\u3067\u3057\u305f"}}))}},{key:"handleSaveSquares",value:function(){console.log(this.state.squares),localStorage.setItem("squares",this.state.squares)}},{key:"handleLoadSquares",value:function(){var e=localStorage.getItem("squares").split(","),t=Array(9).fill(null).map((function(t,n){return e.slice(9*n,9*(n+1))}));this.setState((function(e){return{squares:t}})),this.clearHistory("\u30ed\u30fc\u30c9\u3057\u307e\u3057\u305f")}},{key:"handleClearSquares",value:function(){this.setState((function(e){return{squares:Array(9).fill(null).map((function(e){return Array(9).fill(null)}))}})),this.clearHistory()}},{key:"render",value:function(){var e=this;return Object(h.jsxs)("div",{className:"game",children:[Object(h.jsx)(v,{squares:this.state.squares,onClick:function(t,n){return e.handleClick(t,n)}}),Object(h.jsx)(m,{selectValue:this.state.selectValue,onClick:function(t){return e.handleSelect(t)}}),Object(h.jsx)(p,{predictText:this.state.predictText,onClick:function(){return e.handleNextCandidate()}}),Object(h.jsxs)("div",{className:"button-row",children:[Object(h.jsx)(k,{onClick:function(){return e.handleSaveSquares()}}),Object(h.jsx)(O,{onClick:function(){return e.handleLoadSquares()}}),Object(h.jsx)(x,{onClick:function(){return e.handleClearSquares()}})]}),Object(h.jsx)(C,{history:this.state.history})]})}}]),n}(u.a.Component);d.a.render(Object(h.jsx)(S,{}),document.getElementById("root"))}},[[9,1,2]]]);
//# sourceMappingURL=main.7d0ef2d8.chunk.js.map