import React from 'react'
import '../../styles/loading.css'

// 此效果来源于 https://codepen.io/MarioDesigns/pen/LLrVLK

class Loading extends React.Component {
    render() {
        const { className = '', style = {} } = this.props;
        return (
            <div id="my-loading" className={className} style={style}>
                <div className="loader"/>
                <div className="shadow"/>
            </div>
        )
    }
}

export default Loading 