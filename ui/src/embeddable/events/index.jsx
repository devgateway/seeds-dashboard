import React from "react";
import './events.scss';
import { Grid, Icon } from "semantic-ui-react";
import { atcb_action } from 'add-to-calendar-button'
import 'add-to-calendar-button/assets/css/atcb.css';
import { injectIntl } from "react-intl";

const Events = (props) => {
    const {
        'editing': editing, acf, intl
    } = props;
    let eventStartDate, eventEndDate, hostedBy, eventLocation, link, name, externalFormURL, externalFormHeight;
    if (editing) {
        name = intl.formatMessage({ id: 'default-event-name', defaultMessage: 'TASAI Event' });
        link = 'https://www.tasai.org';
        hostedBy = intl.formatMessage({ id: 'default-hosted-by', defaultMessage: 'Tasai' });
        eventStartDate = '2022-05-27 00:30:00';
        eventLocation = intl.formatMessage({ id: 'default-location', defaultMessage: 'Default location' });
        externalFormHeight = '350';

    } else {
        if (acf) {
            hostedBy = acf.hosted_by;
            eventStartDate = acf.event_stat_date;
            eventEndDate = acf.event_end_date;
            name = acf.event_name;
            link = acf.external_link;
            externalFormURL = acf.url_to_google_form;
            externalFormHeight = acf.external_form_height;
            eventLocation = acf.event_location
        }
    }
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
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

    const openRegisterForm = (e) => {
        window.open(externalFormURL, 'Event Registration Form', "_blank");
    }

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
    
    const isShowAddToCalendar = (pEventStartDate, pEventEndDate) => {
        if (pEventEndDate) {
            return pEventEndDate > new Date();
        } else {
            return pEventStartDate <= new Date();
        }
    }
    
    return (<Grid className="events">
        {hostedBy && hostedBy !== 'undefined' ? <Grid.Column width={16} className="event-hostedby">
            <span className="label hostedby">Hosted By </span><span className="host-value">{hostedBy}</span>
        </Grid.Column> : null}
        <Grid.Column width={16} className="event-date">
            <Icon className="calendar" /> <span
            className="label">{dateString}</span>
        </Grid.Column>
        {showFullContent && <Grid.Column width={16} className="event-hour">
            <Icon className="clock outline" /> <span className="label">{timeString}</span>
        </Grid.Column>}
        {eventLocation && <Grid.Column width={16} className="event-location">
            <Icon className="marker" /> <span className="label">{eventLocation || 'Location N/A'}</span>
        </Grid.Column>}
        {showFullContent && link && link !== 'undefined' ? <Grid.Column width={16} className="event-link">
            <Icon className="linkify" /> <a href={link} target="_blank" className="label">{link}</a>
        </Grid.Column> : null}
        {showFullContent ? <Grid.Column width={16} className="add-to-cal">
            <form onSubmit={e => {
                e.preventDefault()
                atcb_action({
                    name: name || 'TASAI Event',
                    startDate: pEventStartDate ? pEventStartDate.toISOString() : null,
                    endDate: pEventEndDate && !isNaN(Date.parse(pEventEndDate)) ? pEventEndDate.toISOString() : pEventStartDate.toISOString(),
                    options: ['Apple', 'Google', 'iCal', 'Microsoft365', 'Outlook.com'],
                    trigger: "click",
                    iCalFileName: "Reminder-Event",
                    description: link && link !== 'undefined' ? '[url]' + link + '[/url]' : '',
                    location: eventLocation || 'Location N/A'
                })
            }}>
                {isShowAddToCalendar(pEventStartDate, pEventEndDate) ? <input className="atcb_customTrigger" type="submit" 
                                                                              value={intl.formatMessage({ id: 'addToCalendar', defaultMessage: 'Add to calendar' })} /> : null}
                {showFullContent && externalFormURL ? (
                    <a className="register_form_button" type="button" onClick={openRegisterForm}>{intl.formatMessage({ id: 'openRegisterForm', defaultMessage: 'Open register form' })}</a>) : null}
            </form>
        </Grid.Column> : null}
    </Grid>);
}
export default injectIntl(Events);
