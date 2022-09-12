import React from "react";
import { Grid } from "semantic-ui-react";
import './styles.scss';
import { injectIntl } from "react-intl";

const HHILegend = ({ title, legends, intl }) => {

    return (<Grid.Column width={16}>
        <span className="hhi-title">{title}</span>
        {legends.map(l => {
            let label = l.label;
            if (l['label-key']) {
                label = `${intl.formatMessage({ id: l['label-key'], defaultMessage: l.label })} ${l['label-range']}`;
            }
            return <div className='hhi-div' key={l.id}>
                <div className='hhi-circle' style={{ background: l.color }} />
                {label}</div>
        })}
    </Grid.Column>);
}
export default injectIntl(HHILegend)
