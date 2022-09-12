import React from "react";
import './styles.scss';
import { normalizeField } from "../../../utils/common";

const CropsLegend = ({data, title, titleClass, addLighterDiv, intl}) => {
    return (
        <div>
            {title ? (<div className="crop legend">
                <label className={titleClass || ''}>{title}</label>
            </div>) : null}
            {data.map(c => {
                const translated = intl ? intl.formatMessage({id: normalizeField(c), defaultMessage: c}) : c;
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
