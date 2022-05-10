import React from "react";
import './events.scss';
import {Grid, Icon} from "semantic-ui-react";
import {atcb_action} from 'add-to-calendar-button'
import 'add-to-calendar-button/assets/css/atcb.min.css';

const Events = ({
                    'data-event-location': eventLocation,
                    'data-event-start-date': eventStartDate,
                    'data-event-end-date': eventEndDate,
                    'data-event-hosted-by': hostedBy,
                    'data-event-link': link,
                    'data-event-name': name,
                    'editing': editing,
                    'data-external-form-url': externalFormURL,
                    'data-external-form-height': externalFormHeight,
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
                        year: 'numeric', month: 'long', day: 'numeric'
                    }) + ' - ' + pEventEndDate.toLocaleDateString('en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                    });
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
        {hostedBy && hostedBy !== 'undefined' ? <Grid.Column width={16} className="event-hostedby">
            <span className="label hostedby">Hosted By </span><span>{hostedBy}</span>
        </Grid.Column> : null}
        <Grid.Column width={16} className="event-date">
            <Icon className="calendar"/> <span
            className="label">{dateString}</span>
        </Grid.Column>
        {showFullContent && <Grid.Column width={16} className="event-hour">
            <Icon className="clock outline"/> <span className="label">{timeString}</span>
        </Grid.Column>}
        <Grid.Column width={16} className="event-location">
            <Icon className="marker"/> <span className="label">{eventLocation || 'Location N/A'}</span>
        </Grid.Column>
        {showFullContent && link && link !== 'undefined' ? <Grid.Column width={16} className="event-link">
            <Icon className="linkify"/> <a href={link} target="_blank" className="label">{link}</a>
        </Grid.Column> : null}
        {showFullContent ? <Grid.Column width={16} className="add-to-cal">
            <form onSubmit={e => {
                e.preventDefault()
                atcb_action({
                    name: name || 'TASAI Event',
                    startDate: pEventStartDate.toISOString(),
                    endDate: pEventEndDate.toISOString(),
                    options: ['Apple', 'Google', 'iCal', 'Microsoft365', 'Outlook.com'],
                    trigger: "click",
                    iCalFileName: "Reminder-Event",
                    description: link && link !== 'undefined' ? '[url]' + link + '[/url]' : '',
                    location: eventLocation || 'Location N/A'
                })
            }}>
                <input className="atcb_customTrigger" type="submit" value="Add to calendar"/>
            </form>
        </Grid.Column> : null}
        {showFullContent && externalFormURL ? (<Grid.Column width={16} className="external_form">
            <iframe className="form_iframe" src={externalFormURL} height={externalFormHeight} width="100%"/>
        </Grid.Column>) : null}
    </Grid>);
}
export default Events;
