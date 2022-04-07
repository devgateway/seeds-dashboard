import React from "react";
import './events.scss';
import {Grid, Icon} from "semantic-ui-react";

const Events = ({
                    'data-event-location': eventLocation,
                    'data-event-start-date': eventStartDate,
                    'data-event-end-date': eventEndDate,
                    'data-event-hosted-by': hostedBy,
                }) => {
    const options = {year: 'numeric', month: 'long', day: 'numeric'};
    const pEventStartDate = new Date(eventStartDate);
    const pEventEndDate = new Date(eventEndDate);
    const MILLISECONDS_DAY = 3600000;
    let dateString = null;
    if (!eventStartDate) {
        dateString = 'Please provide a valid start date';
    } else {
        if (eventEndDate) {
            const diff = pEventEndDate.getTime() - pEventStartDate.getTime();
            if (diff < 0) {
                dateString = 'ERROR: End date cant be sooner than start date.';
            } else if (diff / MILLISECONDS_DAY <= 24) {
                // One day event.
                dateString = pEventStartDate.toLocaleDateString("en-US", options)
            } else {
                // Same month range.
                if (pEventStartDate.getMonth() === pEventEndDate.getMonth()) {
                    dateString = pEventStartDate.toLocaleDateString('en-US', {
                        year: undefined, month: 'long', day: undefined
                    }) + ' ' + pEventStartDate.getDay() + '-' + pEventEndDate.getDay() + ', ' + pEventStartDate.getFullYear();
                } else {
                    // Different month range.
                    dateString = pEventStartDate.toLocaleDateString('en-US', {
                        year: undefined, month: 'long', day: 'numeric'
                    }) + '-' + pEventEndDate.toLocaleDateString('en-US', {
                        year: undefined, month: 'long', day: 'numeric'
                    }) + ', ' + pEventStartDate.getFullYear();
                }
            }
        } else {
            // One day event.
            dateString = pEventStartDate.toLocaleDateString("en-US", options)
        }
    }
    return (<Grid className="events">
        <Grid.Column width={5} className="event-date">
            <Icon className="calendar"/> <span
            className="label">{dateString}</span>
        </Grid.Column>
        <Grid.Column width={6} className="event-location">
            <Icon className="marker"/> <span className="label">{eventLocation || 'Location N/A'}</span>
        </Grid.Column>
        <Grid.Column width={5} className="event-link">
            <Icon className="linkify"/> <span>TODO</span>
        </Grid.Column>
        <Grid.Column width={5} className="event-hostedby">
            <span className="hostedby">Hosted By </span><span>{hostedBy}</span>
        </Grid.Column>
    </Grid>);
}
export default Events;
