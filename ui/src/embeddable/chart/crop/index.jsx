import React from "react";
import './styles.scss';

const Crops = ({data, title, titleClass}) => {
    return (
        <div>
            {title ? (<div className="crop legend">
                <label className={titleClass || ''}>{title}</label>
            </div>) : null}
            {data.map(c => {
                const class_ = "crop " + c.toLowerCase() + " crop-icon";
                return (<div key={c} className={class_}>
                    <label>{c}</label>
                </div>)
            })}
        </div>
    )
}

export default Crops
