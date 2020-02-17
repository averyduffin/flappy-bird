import React from 'react';
import { Rectangle } from 'react-shapes';

export default function Pipe(props) {

        const upperPipeHeight = props.upperPipeHeight;
        const pipeX = props.x;

        const lowerHeight = props.bottomPipeTop;
        const bottomPipeHeight = props.bottomPipeHeight;
        
        const color = props.isHit ? 'red' : 'blue';

        return (
            <div id="pipe" >
                <div style={{ left: pipeX, top: 0, position: 'absolute' }}>
                    <Rectangle width={20} height={upperPipeHeight} fill={{ color: color }}  />
                </div>
                <div style={{ left: pipeX, top: lowerHeight, position: 'absolute' }}>
                    <Rectangle width={20} height={bottomPipeHeight} fill={{ color: color }} />
                </div>
            </div>
        );
    }
