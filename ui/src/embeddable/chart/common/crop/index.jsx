import React from "react";
import './styles.scss';

const CropsLegend = ({data, title, titleClass, addLighterDiv, intl}) => {
    return (
        <div>
            {title ? (<div className="crop legend">
                <label className={titleClass || ''}>{title}</label>
            </div>) : null}
            {data.map(c => {
                const translated = intl ? intl.formatMessage({id: c, defaultMessage: c}) : c;
                const class_ = "crop " + c.toLowerCase() + " crop-icon";
                return (<div key={c} className={class_}>
                    <label>{translated}</label>
                    {addLighterDiv ? <div className="lighter-crop"/> : null}
                </div>)
            })}
        </div>
    )
}

export default CropsLegend
