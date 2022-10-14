import React from "react";
import { Grid, Placeholder, Popup } from "semantic-ui-react";
import './IndicatorLabel.scss';
import { injectIntl } from "react-intl";
import { LEGEND } from "../Constants";
import { SUMMARY_INDICATORS_INFORMATION } from "../../reducers/StoreConstants";

import { connect } from "react-redux";
import { normalizeField } from "../../utils/common";

const IndicatorLabel = ({ field, className, range, displayType, intl, selectedCountry, loading, configuration }) => {
    if (field) {
        const style = {}
        let r;
        if (range) {
            const value = parseInt(field.value);
            r = range.find(r => value >= r.min && value <= r.max);
            if (r) {
                style['backgroundColor'] = r.color;
                style['color'] = '#FFFFFF';
            }
        }
        const getGridColumns = () => {
            if (!field.label && isNaN(field.value) && displayType !== LEGEND) {
                return <div
                    className={isNaN(field.value) ? ' letter right' : ''}>{field.value && field.value.length > 0 ? intl.formatMessage({
                    id: normalizeField(field.value),
                    defaultMessage: normalizeField(field.value)
                }) : ''}</div>;
            } else {
                //this label is the inner label of the data summary, so we are normalizing and translating
                return <><Grid.Column width={selectedCountry ? 9 : 10}
                                      className="label">{field.label && field.label.length > 0 ? intl.formatMessage({
                    id: normalizeField(field.label),
                    defaultMessage: normalizeField(field.label)
                }) : ''} </Grid.Column>
                    <Grid.Column width={selectedCountry ? 7 : 6} className="value" style={style}>
                        {r && <Popup
                            trigger={<div
                                className={isNaN(field.value) ? ' letter' : `rating_${configuration.alignments.rating}`}> {formatValue(field.value, displayType, intl,
                                configuration.numberFormat)}</div>}
                            className="indicator-popup"
                            position="right center">
                            <Legend val={r.legend} />
                        </Popup>}
                        {!r &&
                            <div
                                className={isNaN(field.value) ? ' letter' : `number_${configuration.alignments.number}`}>{formatValue(field.value, displayType, intl, configuration.numberFormat)}</div>}
                    </Grid.Column></>
            }
        }

        return <Grid
            className={className}>
            {getGridColumns()}
        </Grid>
    } else {
        let empty = <div className="empty" />;
        if (loading) {
            empty = <Placeholder>
                <Placeholder.Line length='full' /></Placeholder>
        }
        return empty;
    }
}

const formatValue = (value, displayType, intl, formatConfiguration) => {
    let formattedValue = value;
    if (value !== 'number' && value !== 'rating') {
        let minimumFractionDigits = 0, maximumFractionDigits = 1;
        if (displayType === "Percentage" || displayType === "Rating") {
            if (formatConfiguration && formatConfiguration.rating) {
                minimumFractionDigits = formatConfiguration.rating.minimumFractionDigits;
                maximumFractionDigits = formatConfiguration.rating.maximumFractionDigits;
            }
        } else {
            if (displayType === "Number") {
                if (formatConfiguration && formatConfiguration.number) {
                    minimumFractionDigits = formatConfiguration.number.minimumFractionDigits;
                    maximumFractionDigits = formatConfiguration.number.maximumFractionDigits;
                }
            }
        }
        const format = { style: 'decimal', minimumFractionDigits, maximumFractionDigits }
        if (displayType !== LEGEND && !isNaN(value)) {
            if (displayType === "Percentage") {
                formattedValue = `${intl.formatNumber(value * 100, format)} %`;
            } else if (displayType === "Rating") {
                formattedValue = `${intl.formatNumber(value, format)} %`;
            } else {
                formattedValue = `${intl.formatNumber(value, format)} `;
            }
        }
    }
    return formattedValue;
}
const Legend = ({ val, color }) => {
    const regexText = /[a-zA-Z\s]+/g;
    const number = /\(([^)]+)\)/g;
    return (<><span className="tooltip-label" style={{
            color,
            fontWeight: 'bold'
        }}>{val.match(regexText)}</span><span><span style={{ color: 'grey' }}>{val.match(number)}</span></span>&nbsp;</>
    )
}

const mapStateToProps = (state) => {
    return {
        loading: state.getIn(['data', SUMMARY_INDICATORS_INFORMATION, 'LOADING'])
    }
}

const mapActionCreators = {};
export default connect(mapStateToProps, mapActionCreators)(injectIntl(IndicatorLabel));
