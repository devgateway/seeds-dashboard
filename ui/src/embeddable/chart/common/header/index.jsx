import React from "react";
import './styles.scss';

const Header = ({title, subtitle}) => {

    return (
        <div className="titles">
            <span className="title">{title}</span>
            <span className="subtitle">{subtitle}</span>
        </div>
    )
}

export default Header
