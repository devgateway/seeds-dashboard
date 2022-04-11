import React from "react";
import './events.scss';
import {Grid, Icon} from "semantic-ui-react";

const Events = ({
                    'data-event-location': eventLocation,
                    'data-event-start-date': eventStartDate,
                    'data-event-end-date': eventEndDate,
                    'data-event-hosted-by': hostedBy,
                    'data-event-link': link,
                    'editing': editing,
                }) => {
    const options = {year: 'numeric', month: 'long', day: 'numeric'};
    const pEventStartDate = new Date(eventStartDate);
    const pEventEndDate = new Date(eventEndDate);
    const MILLISECONDS_DAY = 3600000;
    let dateString = null;
    const timeOptions = {
        weekday: undefined,
        year: undefined,
        month: undefined,
        day: undefined,
        timeZoneName: 'short',
        hour: 'numeric',
        minute: 'numeric'
    };
    let timeString = null;

    // Could not find a better way to detect if this is modal or not.
    const showFullContent = window.location.href.endsWith('/modal') || editing;

    if (!eventStartDate) {
        dateString = 'Please provide a valid start date';
    } else {
        timeString = pEventStartDate.toLocaleDateString("en-US", timeOptions);
        timeString = timeString.substring(timeString.indexOf(',') + 1);
        if (eventEndDate) {
            const diff = pEventEndDate.getTime() - pEventStartDate.getTime();
            if (diff < 0 && (diff * -1) < MILLISECONDS_DAY) {
                dateString = 'ERROR: End date cant be sooner than start date.';
            } else if (diff / (MILLISECONDS_DAY / 24) <= 24) {
                // One day event.
                dateString = pEventStartDate.toLocaleDateString("en-US", options)
            } else {
                // Same month range.
                if (pEventStartDate.getMonth() === pEventEndDate.getMonth()) {
                    dateString = pEventStartDate.toLocaleDateString('en-US', {
                        year: undefined, month: 'long', day: undefined
                    }) + ' ' + pEventStartDate.getDate() + '-' + pEventEndDate.getDate() + ', ' + pEventStartDate.getFullYear();
                } else {
                    // Different month range.
                    dateString = pEventStartDate.toLocaleDateString('en-US', {
                        year: undefined, month: 'long', day: 'numeric'
                    }) + '-' + pEventEndDate.toLocaleDateString('en-US', {
                        year: undefined, month: 'long', day: 'numeric'
                    }) + ', ' + pEventStartDate.getFullYear();
                }
                let endTimeString = pEventEndDate.toLocaleDateString("en-US", timeOptions);
                endTimeString = endTimeString.substring(endTimeString.indexOf(',') + 1);
                timeString += ' - ' + endTimeString;
            }
        } else {
            // One day event.
            dateString = pEventStartDate.toLocaleDateString("en-US", options)

        }
    }
    return (<Grid className="events">
        {showFullContent && hostedBy && hostedBy !== 'undefined' ? <Grid.Column width={16} className="event-hostedby">
            <span className="label hostedby">Hosted By </span><span>{hostedBy}</span>
        </Grid.Column> : null}
        <Grid.Column width={16} className="event-date">
            <Icon className="calendar"/> <span
            className="label">{dateString}</span>
        </Grid.Column>
        <Grid.Column width={8} className="event-hour">
            <Icon className="clock outline"/> <span className="label">{timeString}</span>
        </Grid.Column>
        <Grid.Column width={8} className="event-location">
            <Icon className="marker"/> <span className="label">{eventLocation || 'Location N/A'}</span>
        </Grid.Column>
        {showFullContent && link && link !== 'undefined' ? <Grid.Column width={16} className="event-link">
            <Icon className="linkify"/> <a href={link} target="_blank" className="label">{link}</a>
        </Grid.Column> : null}
    </Grid>);
}
export default Events;
