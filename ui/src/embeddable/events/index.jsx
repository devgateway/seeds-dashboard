import React, { useEffect } from "react";
import './events.scss';
import {
  AppContextProvider,
  Category,
  Page,
  PageConsumer,
  PageProvider,
  Post,
  PostConsumer,
  PostProvider
} from "@devgateway/wp-react-lib";
import { Grid, Icon } from "semantic-ui-react";

const Events = ({
                  'data-event-location': eventLocation,
                  'data-event-start-date': eventStartDate
                }) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const pEventStartDate = new Date(eventStartDate);
  return (
    <Grid className="events">
      <Grid.Column width={8} className="event-date"><Icon
        name="calendar" /> <span className="label">{pEventStartDate.toLocaleDateString("en-US", options)}</span></Grid.Column><Grid.Column
      width={8} className="event-location"><Icon name="map marker alternate" /> <span className="label">{eventLocation}</span></Grid.Column>
    </Grid>
  )
}
export default Events;
