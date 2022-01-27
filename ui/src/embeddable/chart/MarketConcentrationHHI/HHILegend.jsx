import React from "react";
import {Grid} from "semantic-ui-react";
import './styles.scss';

const HHILegend = ({title, legends}) => {

    return (<Grid.Column width={16}>
        <span className="hhi-title">{title}</span>
        {legends.map(l => {
            return <div className='hhi-div' key={l.id}>
                <div className='hhi-circle' style={{ background: l.color}}/>
                {l.label}</div>
        })}
    </Grid.Column>);
}
export default HHILegend
