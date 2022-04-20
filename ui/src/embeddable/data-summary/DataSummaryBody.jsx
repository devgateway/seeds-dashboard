import React, { createRef, useEffect, useMemo, useState } from "react";
import {Accordion, Container, Grid, Icon, Sticky} from "semantic-ui-react";

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

const DataSummaryBody = ({
                             summary_indicators,
                             onLoadIndicatorsInformation,
                             summary_indicators_information,
                             filters,
                             ref_
                         }) => {
    const [activeThemeIndex, setActiveThemeIndex] = useState(1);
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
        } else {
            onLoadIndicatorsInformation(categoryId)
            refs[refIndex].current.scrollIntoView();


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
            value = 'rating';
        } else {
            if (indicator.displayType === DISPLAY_TYPE_NUMBER || indicator.displayType === DISPLAY_TYPE_PERCENTAGE || isOverview) {
                value = 'number';
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
                            className={'indicator-sub-title'} displayType={LEGEND} selectedCountry />
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
                            <Tooltip item={f} tiny />
                            {f.name}
                        </Grid.Column>
                        <Grid.Column width={6}
                                     className={"indicator-selected-country"}><IndicatorLabel
                            field={field}
                            className={'indicator-label'}
                            range={display.effectiveRange} displayType={display.displayType}
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
                                className={'indicator-sub-title'} displayType={LEGEND} /></Grid.Column>)}
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
                                                                                 displayType={display.displayType} /></Grid.Column>
                                })
                                }
                            </Grid>
                        </Grid.Row>)
                })
                }
            </Grid.Column>
        </Grid>
    }
    const getTabletWithActualData = (themeIndex, indicator, index, isOverview) => {
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
                            <div>{indicator.key} {indicator.name}</div>
                            <Tooltip item={indicator} />
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
    const getIndicatorAccordion = (indicators, index) => {
        const themeIndex = index.i;
        const indicatorIndexes = [];
        const subIndicatorAccordion = (
            <Accordion className="table-container">
                {indicators.sort((a, b) => a.position > b.position).map((subIndicators) => {
                        index.i = index.i + 1;
                        indicatorIndexes.push(index.i);
                        return getTabletWithActualData(themeIndex, subIndicators, index);
                    }
                )}
            </Accordion>);
        indicatorsIds.set(themeIndex, indicatorIndexes);
        return subIndicatorAccordion;
    }

    const index = { i: 0 };
    let refs;

    const SummaryIndicatorsHeader = () => {
        refs = useMemo(
            () => Array.from({ length: summary_indicators.length }).map(() => createRef()),
            []
        );
        return summary_indicators.map((theme, themIndex) => {

            index.i = index.i + 1;
            const isIndicator = theme.key === 'ZC1';
            return (<>
                <Accordion.Title
                    active={activeThemeIndex === index.i}
                    index={index.i}
                    onClick={
                        (e, titleProps) => handleThemeClick(e, titleProps, theme.id, themIndex)}
                    key={theme.id} className={`theme-title ${isIndicator ? " theme-overview" : ''}`}
                    style={{backgroundColor: 'white'}}>
                    <Sticky context={innerRef} offset={70} active={activeThemeIndex === index.i}>
                        <div className="summary-theme summary-common" ref={refs[themIndex]}>
                            <Icon name='chevron circle down'/>
                            {theme.name}
                        </div>
                    </Sticky>
                </Accordion.Title>
                <Accordion.Content active={activeThemeIndex === index.i}>
                    {theme.name !== 'Overview' && getIndicatorAccordion(theme.childs, index)}
                    {theme.name === 'Overview' && getTabletWithActualData(index.i, theme, index, true)}
                </Accordion.Content>
            </>);
        })
    }
    const innerRef = createRef();
    return <div ref={innerRef}>
        <Container className="summary-container">
            <Accordion>{summary_indicators &&
                <SummaryIndicatorsHeader summaryIndicators={summary_indicators}/>}</Accordion>
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

