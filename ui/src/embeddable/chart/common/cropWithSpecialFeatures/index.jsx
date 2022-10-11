import React from "react";
import './styles.scss';
import { injectIntl } from "react-intl";

const CropsWithSpecialFeatures = ({ intl }) => {
    return (
        <div>

            <label>{intl.formatMessage({
                id: "with-special-features",
                defaultMessage: "With special features"
            })}</label>
            <div className="crop black-circle crop-icon">
                <div className="lighter-crop2" />
            </div>
            <label style={{ left: -25, position: 'relative' }}>{intl.formatMessage({
                id: "without-special-features",
                defaultMessage: "Without special features"
            })}</label>
        </div>
    )
}

export default injectIntl(CropsWithSpecialFeatures)
