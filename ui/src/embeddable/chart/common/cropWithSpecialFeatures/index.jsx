import React from "react";
import './styles.scss';

const CropsWithSpecialFeatures = ({}) => {
    return (
        <div>
            <label>With Special Climate Features</label>
            <div className="crop black-circle crop-icon">
                <div className="lighter-crop2"/>
            </div>
            <label style={{left: -25, position: 'relative'}}>Without Special Climate Features</label>
        </div>
    )
}

export default CropsWithSpecialFeatures
