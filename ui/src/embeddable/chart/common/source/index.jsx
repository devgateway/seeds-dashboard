import React from "react";
import './styles.scss';

const Source = ({title, titleClass}) => {
    return (
        <div>
            {title ? (<div className="indicator-source">
                <label className={titleClass || ''}>{title}</label>
            </div>) : null}
        </div>
    )
}

export default Source
