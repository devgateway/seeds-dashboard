import React from "react";
import './styles.scss';

const YearsLegend = ({data, title, titleClass, addLighterDiv}) => {
    return (
        <div>
            {title ? (<div className="years legend">
                <label className={titleClass || ''}>{title}</label>
            </div>) : null}
            {data.map(c => {
                return (<div key={c} >
                    <label>{c}</label>
                </div>)
            })}
        </div>
    )
}

export default YearsLegend
