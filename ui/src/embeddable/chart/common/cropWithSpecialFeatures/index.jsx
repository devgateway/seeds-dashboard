import React from "react";
import './styles.scss';

const CropsWithSpecialFeatures = ({}) => {
    return (
        <div>
            <label>With special features</label>
            <div className="crop black-circle crop-icon">
                <div className="lighter-crop2"/>
            </div>
            <label style={{left: -25, position: 'relative'}}>Without special features</label>
        </div>
    )
}

export default CropsWithSpecialFeatures
