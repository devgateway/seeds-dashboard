<div>
  <label for="<?php echo $this->META_ATTENDANCE_MODE; ?>">
    <?php _e('Attendance Mode:', 'event-post') ?>
    <select name="<?php echo $this->META_ATTENDANCE_MODE; ?>" id="<?php echo $this->META_ATTENDANCE_MODE; ?>">
      <option value=""></option>
      <?php foreach ($this->attendance_modes as $mode_name => $mode_label): ?>
        <option value="<?php echo $mode_name; ?>" <?php selected($mode_name, $event->attendance_mode, true); ?>><?php echo $mode_label; ?></option>
    <?php endforeach; ?>
    </select>
  </label>
</div>
<div class="eventpost-misc-pub-section eventpost-location-type-online">
  <p>
    <label for="<?php echo $this->META_VIRTUAL_LOCATION; ?>">
    <?php _e('Virtual Location:', 'event-post') ?>
      <input type="url" value ="<?php echo $event->virtual_location; ?>" name="<?php echo $this->META_VIRTUAL_LOCATION; ?>" id="<?php echo $this->META_VIRTUAL_LOCATION; ?>" class="widefat"/>
    </label>
  </p>
</div>

<div class="eventpost-misc-pub-section eventpost-location-type-offline">
  <label for="<?php echo $this->META_ADD; ?>">
<?php _e('Address, as it will be displayed:', 'event-post') ?>
    <textarea name="<?php echo $this->META_ADD; ?>" id="<?php echo $this->META_ADD; ?>" class="widefat"><?php echo $event->address; ?></textarea>
  </label>
</div>

<div id="event_address_searchwrap" class="eventpost-location-type-offline">
  <span class="dashicons dashicons-location eventpost-edit-icon"></span>
  <?php _e('GPS coordinates:', 'event-post') ?>
  <a id="event_address_search" title="<?php _e('Search or fill exact coordinates', 'event-post') ?>">
    <?php _e('Search / Edit', 'event-post') ?>
  </a>

  <div class="misc-pub-section" id="event_address_coords">
    <p>
      <span id="eventaddress_result"></span>
    </p>
    <label for="<?php echo $this->META_LAT; ?>">
  <?php _e('Latitude:', 'event-post') ?>
      <input type="text" value ="<?php echo $event->lat; ?>" name="<?php echo $this->META_LAT; ?>" id="<?php echo $this->META_LAT; ?>" class="widefat"/>
    </label>

    <label for="<?php echo $this->META_LONG; ?>">
  <?php _e('Longitude:', 'event-post') ?>
      <input type="text" value ="<?php echo $event->long; ?>" name="<?php echo $this->META_LONG; ?>" id="<?php echo $this->META_LONG; ?>" class="widefat"/>
    </label>
    <p>
      <a id="event_address_unsearch" class="button button-small">
        <span class="dashicons dashicons-yes"></span>
        <?php _e('Done', 'event-post') ?>
      </a>
    </p>
  </div>
</div>

<div class="eventpost-misc-pub-section eventpost-location-type-offline" id="event-post-map-preview-wrapper">
  <div id="event-post-map-preview" data-marker="<?php echo $this->get_marker($event->color); ?>"></div>
</div>
