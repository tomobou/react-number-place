(this.webpackJsonptomobou=this.webpackJsonptomobou||[]).push([[0],{14:function(e,t,n){},9:function(e,t,n){"use strict";n.r(t);var r=n(7),a=n(2),i=n(3),s=n(5),c=n(4),u=n(1),o=n.n(u),l=n(8),d=n.n(l),h=(n(14),n(0)),f=function(e){Object(s.a)(n,e);var t=Object(c.a)(n);function n(){return Object(a.a)(this,n),t.apply(this,arguments)}return Object(i.a)(n,[{key:"render",value:function(){return Object(h.jsx)("button",{className:"square",onClick:this.props.onClick,children:this.props.value})}}]),n}(o.a.Component),v=function(e){Object(s.a)(n,e);var t=Object(c.a)(n);function n(){return Object(a.a)(this,n),t.apply(this,arguments)}return Object(i.a)(n,[{key:"renderBoardRow",value:function(e,t){return Object(h.jsxs)("div",{className:"board-row",children:[this.renderBlock(e,t),this.renderBlock(e,t+3),this.renderBlock(e,t+6)]})}},{key:"renderBlock",value:function(e,t){return Object(h.jsxs)("div",{className:"board-block",children:[this.renderBlockRow(e,t),this.renderBlockRow(e+1,t),this.renderBlockRow(e+2,t)]})}},{key:"renderBlockRow",value:function(e,t){return Object(h.jsxs)("div",{className:"block-row",children:[this.renderSquare(e,t),this.renderSquare(e,t+1),this.renderSquare(e,t+2)]})}},{key:"renderSquare",value:function(e,t){var n=this;return Object(h.jsx)(f,{value:this.props.squares[e][t],onClick:function(){return n.props.onClick(e,t)}})}},{key:"render",value:function(){return Object(h.jsx)("div",{children:Object(h.jsxs)("div",{className:"board-top",children:[this.renderBoardRow(0,0),this.renderBoardRow(3,0),this.renderBoardRow(6,0)]})})}}]),n}(o.a.Component);function j(e){var t=e.map((function(e,t){return e.map((function(e,n){return{value:"1"<=e&&e<="9"?Number(e):null,candidates:"1"<=e&&e<="9"?[]:Array.from({length:9},(function(e,t){return t+1})),rowIndex:t,colIndex:n}}))})),n=function(e){var t=Array(27),n=0;e.forEach((function(e){t[n++]=e}));for(var r=function(r){t[n++]=e.map((function(e){return e[r]}))},a=0;a<9;a++)r(a);for(var i=0;i<9;i+=3)for(var s=0;s<9;s+=3)t[n++]=[e[i][s],e[i][s+1],e[i][s+2],e[i+1][s],e[i+1][s+1],e[i+1][s+2],e[i+2][s],e[i+2][s+1],e[i+2][s+2]];return t}(t);!function(e){e.forEach((function(e){var t=e.filter((function(e){return null!==e.value})).map((function(e){return e.value}));e.forEach((function(e){e.candidates=e.candidates.filter((function(e){return!t.some((function(t){return e===t}))}))}))}))}(n);var a=function(e,t){for(var n=0;n<9;n++)for(var r=0;r<9;r++){var a=e[n][r].candidates;if(1===e[n][r].candidates.length)return b(!0,t,n,r,a[0])}return null}(t,"UNIQUE_PLACE");return null!=a?a:(a=function(e){var t,n=Object(r.a)(e);try{for(n.s();!(t=n.n()).done;){var a,i=t.value,s=i.reduce((function(e,t,n){return t.candidates.forEach((function(t){var r=e.get(t);void 0!==r?(r.push(n),e.set(t,r)):e.set(t,[n])})),e}),new Map),c=null,u=Object(r.a)(s.entries());try{for(u.s();!(a=u.n()).done;){var o=a.value;if(1===o[1].length){(c=i[o[1][0]]).candidate=[o[0]];break}}}catch(l){u.e(l)}finally{u.f()}if(null!==c)return b(!0,"UNIQUE_CANDIDATE",c.rowIndex,c.colIndex,c.candidate[0])}}catch(l){n.e(l)}finally{n.f()}return null}(n),null!=a?a:(console.log(t),console.log(n),null))}function b(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=arguments.length>1?arguments[1]:void 0,n=arguments.length>2?arguments[2]:void 0,r=arguments.length>3?arguments[3]:void 0,a=arguments.length>4?arguments[4]:void 0;return e?{type:t,row:n,col:r,value:a}:null}function p(e){return Object(h.jsxs)("div",{children:[Object(h.jsx)("button",{className:"next-prediction",onClick:e.onClick,children:"next"}),Object(h.jsx)("span",{className:"next-prediction-text",children:e.predictText})]})}function y(e){return Object(h.jsx)("button",{className:"save",onClick:e.onClick,children:"save"})}function k(e){return Object(h.jsx)("button",{className:"load",onClick:e.onClick,children:"load"})}function O(e){return Object(h.jsx)("button",{className:"clear",onClick:e.onClick,children:"clear"})}var x=function(e){Object(s.a)(n,e);var t=Object(c.a)(n);function n(){return Object(a.a)(this,n),t.apply(this,arguments)}return Object(i.a)(n,[{key:"render",value:function(){var e=this,t=parseInt(this.props.selectValue,10),n=Array(10).fill("number-selector");return isNaN(t)||t<=0||t>=10?n[0]+=" selected":n[t]+=" selected",Object(h.jsx)("div",{className:"number-selector-row",children:n.map((function(t,n){var r=0===n?" ":n.toString();return Object(h.jsx)("button",{className:t,onClick:function(){return e.props.onClick(r)},children:r},"number-selector-"+n)}))})}}]),n}(o.a.Component),m=function(e){Object(s.a)(n,e);var t=Object(c.a)(n);function n(){return Object(a.a)(this,n),t.apply(this,arguments)}return Object(i.a)(n,[{key:"render",value:function(){var e=this.props.history.map((function(e){return Object(h.jsx)("div",{children:e})}));return Object(h.jsx)("div",{className:"history-view",children:e})}}]),n}(o.a.Component),C=function(e){Object(s.a)(n,e);var t=Object(c.a)(n);function n(e){var r;return Object(a.a)(this,n),(r=t.call(this,e)).state={squares:Array(9).fill(null).map((function(e){return Array(9).fill(null)})),selectValue:" ",predictText:"",history:[]},r}return Object(i.a)(n,[{key:"getPredictionTypeMessage",value:function(e){switch(e){case"UNIQUE_PLACE":return"\u5024\u78ba\u5b9a";case"UNIQUE_CANDIDATE":return"\u6761\u4ef6\u78ba\u5b9a";default:return e}}},{key:"getSetValueHistoryPrediction",value:function(e){return this.getSetValueHistoryMessage(e.row,e.col,e.value,this.getPredictionTypeMessage(e.type))}},{key:"getSetValueHistoryMessage",value:function(e,t,n,r){return"[\u2193"+(e+1)+"][\u2192"+(t+1)+"]\uff1d"+n+"("+r+")"}},{key:"clearHistory",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,t=[];null!==e&&t.push(e),this.setState((function(e){return{history:t}}))}},{key:"addHistory",value:function(e){var t=this.state.history;t.push(e),this.setState((function(e){return{history:t}}))}},{key:"handleClick",value:function(e,t){var n=this.state.squares.slice();n[e][t]=this.state.selectValue,this.setState((function(e){return{squares:n}})),this.addHistory(this.getSetValueHistoryMessage(e,t,this.state.selectValue,"\u30e6\u30fc\u30b6\u30fc"))}},{key:"handleSelect",value:function(e){this.setState((function(t){return{selectValue:e}}))}},{key:"handleNextPrediction",value:function(){var e=j(this.state.squares);if(null!=e){var t=this.state.squares,n="["+(e.row+1)+"]\u884c["+(e.col+1)+"]\u5217\u76ee\u306f"+e.value+"\u3067\u3059\u3002";t[e.row][e.col]=e.value.toString(),this.setState((function(e){return{squares:t,predictText:n}})),this.addHistory(this.getSetValueHistoryPrediction(e))}else this.setState((function(e){return{predictText:"\u6b21\u306e\u5019\u88dc\u306f\u898b\u3064\u304b\u308a\u307e\u305b\u3093\u3067\u3057\u305f"}}))}},{key:"handleSaveSquares",value:function(){console.log(this.state.squares),localStorage.setItem("squares",this.state.squares)}},{key:"handleLoadSquares",value:function(){var e=localStorage.getItem("squares").split(","),t=Array(9).fill(null).map((function(t,n){return e.slice(9*n,9*(n+1))}));this.setState((function(e){return{squares:t}})),this.clearHistory("\u30ed\u30fc\u30c9\u3057\u307e\u3057\u305f")}},{key:"handleClearSquares",value:function(){this.setState((function(e){return{squares:Array(9).fill(null).map((function(e){return Array(9).fill(null)}))}})),this.clearHistory()}},{key:"render",value:function(){var e=this;return Object(h.jsxs)("div",{className:"game",children:[Object(h.jsx)(v,{squares:this.state.squares,onClick:function(t,n){return e.handleClick(t,n)}}),Object(h.jsx)(x,{selectValue:this.state.selectValue,onClick:function(t){return e.handleSelect(t)}}),Object(h.jsx)(p,{predictText:this.state.predictText,onClick:function(){return e.handleNextPrediction()}}),Object(h.jsxs)("div",{className:"button-row",children:[Object(h.jsx)(y,{onClick:function(){return e.handleSaveSquares()}}),Object(h.jsx)(k,{onClick:function(){return e.handleLoadSquares()}}),Object(h.jsx)(O,{onClick:function(){return e.handleClearSquares()}})]}),Object(h.jsx)(m,{history:this.state.history})]})}}]),n}(o.a.Component);d.a.render(Object(h.jsx)(C,{}),document.getElementById("root"))}},[[9,1,2]]]);
//# sourceMappingURL=main.31d6c1a7.chunk.js.map