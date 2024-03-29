import React, { createRef, useEffect, useMemo, useState } from "react";
import { Accordion, Container, Grid, Icon, Sticky } from "semantic-ui-react";

import {
    COUNTRY_SETTINGS,
    SUMMARY_INDICATORS,
    SUMMARY_INDICATORS_INFORMATION,
    VISIBLE_COUNTRIES
} from "../reducers/StoreConstants";
import { getIndicatorsInformation } from "../reducers/data";
import { connect } from "react-redux";
import IndicatorLabel from "./components/IndicatorLabel";
import { injectIntl } from "react-intl";
import {
    DISPLAY_TYPE_HHI,
    DISPLAY_TYPE_NUMBER, DISPLAY_TYPE_PERCENTAGE,
    DISPLAY_TYPE_RATING,
    EVEN,
    LEGEND,
    ODD,
    SUB_INDICATOR
} from "./Constants";
import Tooltip from "./components/Tooltip";
import { SELECTED_COUNTRY } from "../../seeds-commons/commonConstants";
import VisibilitySensor from "react-visibility-sensor-v2";

//we have to generate the key for crop2 crop 2 because in the dvat tool it has different keys for the same crop 1 string
const getKey = (f) => {
    const regexText = /^Crop[ ]{0,1}\d+$/g;
    if (f.name && f.name.match(regexText)) {
        return f.name.trim().toLowerCase().replace(' ','');
    } else {
        return f.key;
    }
}

const DataSummaryBody = ({
                             summary_indicators,
                             onLoadIndicatorsInformation,
                             summary_indicators_information,
                             filters,
                             overrideSticky,
                             editing,
                             configuration,
                             intl
                         }) => {
    const [activeThemeIndex, setActiveThemeIndex] = useState(1);
    const [currentScrollableDiv, setCurrentScrollableDiv] = useState(undefined);
    const [activeIndicatorIndexes, setActiveIndicatorIndexes] = useState([]);
    const indicatorsIds = new Map();

    useEffect(() => {
        if (summary_indicators && summary_indicators.length > 0 && summary_indicators[0].id) {
            onLoadIndicatorsInformation(summary_indicators[0].id);
        }

    }, [summary_indicators, onLoadIndicatorsInformation])


    const handleThemeClick = (e, titleProps, categoryId, refIndex) => {
        const { index } = titleProps
        const newIndex = activeThemeIndex === index ? -1 : index
        //
        if (newIndex === -1) {
            setActiveIndicatorIndexes([]);
            setCurrentScrollableDiv(undefined);
        } else {
            onLoadIndicatorsInformation(categoryId)
            if (refIndex && refs[refIndex] && refs[refIndex].current) {
                setCurrentScrollableDiv(refs[refIndex].current.id);
            }
            if (indicatorsIds.get(newIndex)) {
                setActiveIndicatorIndexes([...indicatorsIds.get(newIndex)]);
            }
        }

        setActiveThemeIndex(newIndex);
    }
    const handleIndicatorClick = (e, titleProps) => {
        const { index } = titleProps
        if (activeIndicatorIndexes.includes(index)) {
            const newActiveIndicatorIndexes = activeIndicatorIndexes.filter(i => i !== index);
            setActiveIndicatorIndexes(newActiveIndicatorIndexes)
        } else {
            activeIndicatorIndexes.push(index);
            setActiveIndicatorIndexes([...activeIndicatorIndexes]);
        }
    }
    const isIndicatorActive = (selectedThemeIndex, index) => {
        let bIsIndicatorActive = false;
        if (activeThemeIndex === selectedThemeIndex) {
            if (activeIndicatorIndexes.includes(index)) {
                bIsIndicatorActive = true;
            }
        }
        return bIsIndicatorActive;
    }
    const getEffectiveDisplayAndRange = (range, isOverview, f, indicator) => {
        const display = {};
        display.effectiveRange = range;
        if (isOverview || f.displayType !== null) {
            display.displayType = f.displayType;
        } else {
            if (indicator.type === SUB_INDICATOR) {
                display.displayType = indicator.displayType;
            } else {
                display.displayType = f.displayType;
            }
        }
        if (display.displayType === DISPLAY_TYPE_RATING && display.effectiveRange === undefined) {
            display.effectiveRange = f.range;
        }
        return display;
    }
    const getTitleDisplayType = (indicator, isOverview) => {
        let value = '';
        if (indicator.displayType === DISPLAY_TYPE_RATING || indicator.displayType === DISPLAY_TYPE_HHI) {
            value = intl.formatMessage({
                id: configuration.labels.rating,
                defaultMessage: configuration.labels.rating
            });
        } else {
            if (indicator.displayType === DISPLAY_TYPE_NUMBER || indicator.displayType === DISPLAY_TYPE_PERCENTAGE || isOverview) {
                value = intl.formatMessage({
                    id: configuration.labels.number,
                    defaultMessage: configuration.labels.number
                });
            }
        }
        return value;
    }
    const getIndicatorGrid = (selectedCountry, indicator, range, isOverview) => {
        const selectedTitle = getTitleDisplayType(indicator, isOverview);
        return <Grid className={`table-container accordion ${isOverview ? ' overview' : ''}`}>
            <Grid.Column width={7} className="selected-countries">
                {selectedTitle &&
                    <Grid className="indicator-title">
                        <Grid.Column width={10}>
                        </Grid.Column>
                        <Grid.Column width={6}><IndicatorLabel
                            field={{ value: selectedTitle }}
                            className={'indicator-sub-title'} displayType={LEGEND} selectedCountry
                            configuration={configuration} />
                        </Grid.Column>
                    </Grid>}
                {indicator.childs.sort((a, b) => a.position > b.position).map((f, index) => {
                    let field;
                    let effectiveF = f;
                    if (f.type === SUB_INDICATOR) {
                        effectiveF = f.childs[0];
                    }
                    if (selectedCountry.length > 0) {
                        field = selectedCountry.find(sc => (effectiveF && sc.fieldId === effectiveF.id
                            && sc.countryId === filters.get(SELECTED_COUNTRY)));
                    }

                    const display = getEffectiveDisplayAndRange(range, isOverview, f, indicator);

                    return <Grid className={`${index % 2 === 0 ? EVEN : ODD}`} key={f.id}>
                        <Grid.Column width={10}
                                     className="crop-title " data-indicator-key={f.key}>
                            <Tooltip item={f} tiny editing={editing} />
                            {intl.formatMessage({ id: getKey(f), defaultMessage: f.name })}
                        </Grid.Column>
                        <Grid.Column width={6}
                                     className={"indicator-selected-country"}><IndicatorLabel
                            field={field}
                            className={'indicator-label'}
                            range={display.effectiveRange}
                            displayType={display.displayType}
                            configuration={configuration}
                            selectedCountry />
                        </Grid.Column>
                    </Grid>
                })}

            </Grid.Column>
            <Grid.Column width={9} className="other-countries">
                {selectedTitle && <Grid.Row className="indicator-title">
                    <Grid columns={3}>
                        {[...Array(3)].map((value, key) =>
                            <Grid.Column key={key}><IndicatorLabel
                                field={{
                                    value: getTitleDisplayType(indicator, isOverview)
                                }}
                                className={'indicator-sub-title'} displayType={LEGEND} configuration={configuration} /></Grid.Column>)}
                    </Grid>
                </Grid.Row>}
                {indicator.childs.sort((a, b) => a.position > b.position).map((f, index) => {
                    let effectiveF = f;
                    if (f.childs.length > 0 && (isOverview || f.type === SUB_INDICATOR)) {
                        effectiveF = f.childs[0];
                    }
                    const display = getEffectiveDisplayAndRange(range, isOverview, f, indicator);
                    return (
                        <Grid.Row className={index % 2 === 0 ? 'even' : 'odd'} key={effectiveF.id}>
                            <Grid columns={3}>
                                {filters && filters.get(VISIBLE_COUNTRIES) && filters.get(VISIBLE_COUNTRIES).map(vc => {
                                    const field = selectedCountry.find(
                                        sc => (sc.fieldId === effectiveF.id && sc.countryId === vc)
                                    )
                                    return <Grid.Column key={vc}><IndicatorLabel field={field}
                                                                                 className={'indicator-label'}
                                                                                 range={display.effectiveRange}
                                                                                 displayType={display.displayType}
                                                                                 configuration={configuration}
                                    /></Grid.Column>
                                })
                                }
                            </Grid>
                        </Grid.Row>)
                })
                }
            </Grid.Column>
        </Grid>
    }
    const getTabletWithActualData = (themeIndex, indicator, index, isOverview, idx, ref, totalCount) => {
        // TODO: isOverview is ALWAYS false and if it where true then the section fails to draw :(
        let selectedCountries = [];
        let range;
        if (indicator.displayType === 'Rating' || indicator.displayType === 'HHI value (color)') {
            range = indicator.range;
        }
        if (filters && summary_indicators_information && filters.get(VISIBLE_COUNTRIES)) {
            selectedCountries = summary_indicators_information.filter(sii =>
                sii.countryId === filters.get(SELECTED_COUNTRY)
                || filters.get(VISIBLE_COUNTRIES).includes(sii.countryId)
            );
        }
        let tabletWithActualData;
        if (!isOverview) {
            tabletWithActualData = (
                <>
                    <Accordion.Title
                        active={isIndicatorActive(themeIndex, index.i)}
                        index={index.i}
                        onClick={(e, titleProps) =>
                            handleIndicatorClick(e, titleProps)}
                        key={indicator.id}
                    >
                        <div className="indicator summary-common">
                            <Icon name='chevron circle down' />
                            <VisibilitySensor
                                active={totalCount && idx && idx === (totalCount - 1)} onChange={() => {
                                if (totalCount && idx && idx === (totalCount - 1)) {
                                    if (currentScrollableDiv) {
                                        const element = document.getElementById(currentScrollableDiv);
                                        const headerOffset = 130;
                                        const elementPosition = element.getBoundingClientRect().top;
                                        const offsetPosition = elementPosition + window.scrollY - headerOffset;

                                        window.scrollTo({
                                            top: offsetPosition,
                                            behavior: "smooth"
                                        });
                                    }
                                    setCurrentScrollableDiv(undefined);
                                }
                            }}>
                                <div ref={idx === 0 ? ref : undefined}
                                     id={idx === 0 ? `scroll_${indicator.id}` : ''}>{indicator.key.startsWith('Z') ? '' : indicator.key} {intl.formatMessage({
                                    id: indicator.key,
                                    defaultMessage: indicator.name
                                })}</div>
                            </VisibilitySensor>
                            <Tooltip item={indicator} editing={editing} />
                        </div>

                    </Accordion.Title>
                    <Accordion.Content active={isIndicatorActive(themeIndex, index.i)}>
                        {getIndicatorGrid(selectedCountries, indicator, range, isOverview)}
                    </Accordion.Content>
                </>)
        } else {
            tabletWithActualData = getIndicatorGrid(selectedCountries, indicator, range, isOverview);
        }
        return tabletWithActualData;
    }
    const getIndicatorAccordion = (indicators, index, ref) => {
        const themeIndex = index.i;
        const indicatorIndexes = [];
        const totalCount = indicators.length;
        const subIndicatorAccordion = (
            <Accordion className="table-container">
                {indicators.sort((a, b) => a.position > b.position).map((subIndicators, idx) => {
                        index.i = index.i + 1;
                        indicatorIndexes.push(index.i);
                        return getTabletWithActualData(themeIndex, subIndicators, index, false, idx, ref, totalCount);
                    }
                )}
            </Accordion>
        );
        indicatorsIds.set(themeIndex, indicatorIndexes);
        return subIndicatorAccordion;
    }

    window.onscroll = () => {
        if (isOneSticky) {
            const secondIndex = ids[ids.findIndex(i => i === prefix + activeThemeIndex) + 1];
            const firstTop = document.getElementById(prefix + activeThemeIndex).getBoundingClientRect().top +
                document.getElementById(prefix + activeThemeIndex).getBoundingClientRect().height;
            if (secondIndex) {
                const secondTop = document.getElementById(secondIndex).getBoundingClientRect().top
                if (secondTop <= firstTop) {
                    const scrollTop = document.documentElement.scrollTop;
                    const scrollLeft = document.documentElement.scrollLeft;
                    window.scrollTo(scrollLeft, scrollTop - 10);
                }
            }
        }
    }

    const index = { i: 0 };
    let isOneSticky = false;
    let refs;
    const ids = [];
    const prefix = 'acc_';
    let innerIndex = -1;
    const SummaryIndicatorsHeader = () => {
        refs = useMemo(
            () => Array.from({ length: summary_indicators.length }).map(() => createRef()),
            []
        );
        return summary_indicators.map((theme, themIndex) => {
            innerIndex++;
            index.i = index.i + 1;
            const isIndicator = theme.key === 'ZC1';
            ids.push(prefix + index.i);
            return (<>
                <Accordion.Title
                    active={activeThemeIndex === index.i}
                    index={index.i}
                    onClick={
                        (e, titleProps) => handleThemeClick(e, titleProps, theme.id, themIndex)}
                    key={theme.id} className={`theme-title ${isIndicator ? " theme-overview" : ''}`}
                    style={{ backgroundColor: 'white' }}>
                    <Sticky context={innerRef} offset={70} active={activeThemeIndex === index.i && !overrideSticky}
                            onStick={() => {
                                isOneSticky = true
                            }}
                            onUnstick={() => {
                                isOneSticky = false
                            }}>
                        <div className="summary-theme summary-common" id={ids[innerIndex]}
                             data-indicator-key={`theme_${theme.key}`}>
                            <Icon name='chevron circle down' />
                            {intl.formatMessage({ id: `theme_${theme.key}`, defaultMessage: theme.name })}
                        </div>
                    </Sticky>
                </Accordion.Title>
                <Accordion.Content active={activeThemeIndex === index.i}>
                    {theme.name !== 'Overview' && getIndicatorAccordion(theme.childs, index, refs[themIndex])}
                    {theme.name === 'Overview' && getTabletWithActualData(index.i, theme, index, true)}
                </Accordion.Content>
            </>);
        })
    }
    const innerRef = createRef();

    return <div ref={innerRef}>

        <Container className="summary-container">
            <Accordion>{summary_indicators &&
                <SummaryIndicatorsHeader summaryIndicators={summary_indicators} />}</Accordion>
        </Container>
    </div>
}

const mapStateToProps = (state) => {
    return {
        country_settings: state.getIn(['data', COUNTRY_SETTINGS, 'data']),
        filters: state.getIn(['data', 'filters']),
        summary_indicators: state.getIn(['data', SUMMARY_INDICATORS]),
        summary_indicators_information: state.getIn(['data', SUMMARY_INDICATORS_INFORMATION, 'data'])
    }
}

const mapActionCreators = { onLoadIndicatorsInformation: getIndicatorsInformation };
export default connect(mapStateToProps, mapActionCreators)(injectIntl(DataSummaryBody));
