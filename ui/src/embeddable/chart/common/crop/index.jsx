import React from "react";
import './styles.scss';

const CropsLegend = ({data, title, titleClass, addLighterDiv}) => {
    return (
        <div>
            {title ? (<div className="crop legend">
                <label className={titleClass || ''}>{title}</label>
            </div>) : null}
            {data.map(c => {
                const class_ = "crop " + c.toLowerCase() + " crop-icon";
                return (<div key={c} className={class_}>
                    <label>{c}</label>
                    {addLighterDiv ? <div className="lighter-crop"/> : null}
                </div>)
            })}
        </div>
    )
}

export default CropsLegend
