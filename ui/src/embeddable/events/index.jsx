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
        name="calendar" /> {pEventStartDate.toLocaleDateString("en-US", options)}</Grid.Column><Grid.Column
      width={8} className="event-location"><Icon name="map marker alternate" /> {eventLocation}</Grid.Column>
    </Grid>
  )
}
export default Events;