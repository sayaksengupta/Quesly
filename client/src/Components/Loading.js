import React from 'react';
import brand from '../Images/brand.png';
import Pulse from 'react-reveal/Pulse';
import Wobble from 'react-reveal/Wobble';
import Tada from 'react-reveal/Tada';

function Loading() {
    return (
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh"}}>
        <Pulse forever>
            <img id="loadingImg" width="15%" src={brand}></img>
        </Pulse>
        </div>
    )
}

export default Loading
