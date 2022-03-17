<div class="eventpost-misc-pub-section">
  <p>
    <label for="<?php echo $this->META_STATUS; ?>">
      <?php _e('Status:', 'event-post') ?>
      <select name="<?php echo $this->META_STATUS; ?>" id="<?php echo $this->META_STATUS; ?>">
        <option value=""></option>
        <?php foreach ($this->statuses as $status_name => $status_label): ?>
          <option value="<?php echo $status_name; ?>" <?php selected($status_name, $event->status, true); ?>><?php echo $status_label; ?></option>
      <?php endforeach; ?>
      </select>
    </label>
  </p>
  <p>
    <label>
      <input type="checkbox" id="event-post-date-all-day" <?php checked( $event->time_start && $event->time_end && date('H:i:s', $event->time_start) == '00:00:00' && date('H:i:s', $event->time_end) == '00:00:00', true, true); ?>>
      <?php _e('All day event', 'event-post') ?>
    </label>
  </p>
  <p>
    <span class="dashicons dashicons-calendar eventpost-edit-icon"></span>
    <label for="<?php echo $this->META_START; ?>_date">
        <?php _e('Begin:', 'event-post') ?>
        <span id="<?php echo $this->META_START; ?>_date_human" class="human_date">
            <?php
          if ($event->time_start != '') {
              echo $this->human_date($event->time_start) . (date('H:i', $event->time_start)=='00:00'?'':date(' H:i', $event->time_start));
            }
            else{
              _e('Pick a date','event-post');
            }
            ?>
          </span>
      <input type="<?php echo ($this->settings['datepicker']=='browser'?'datetime':''); ?>" class="eventpost-datepicker-<?php echo $this->settings['datepicker']; ?>" data-lang="<?php echo $language; ?>" value="<?php echo substr($start_date,0,16) ?>" name="<?php echo $this->META_START; ?>" id="<?php echo $this->META_START; ?>_date"/>
    </label>
  </p>
  <p>
    <span class="dashicons dashicons-calendar eventpost-edit-icon"></span>
    <label for="<?php echo $this->META_END; ?>_date">
        <?php _e('End:', 'event-post') ?>
        <span id="<?php echo $this->META_END; ?>_date_human" class="human_date">
            <?php
            if ($event->time_start != '') {
              echo $this->human_date($event->time_end) . (date('H:i', $event->time_end)=='00:00'?'':date(' H:i', $event->time_end));
            }
            else{
              _e('Pick a date','event-post');
            }
            ?>
          </span>
      <input type="<?php echo ($this->settings['datepicker']=='browser'?'datetime':''); ?>" class="eventpost-datepicker-<?php echo $this->settings['datepicker']; ?>" data-lang="<?php echo $language; ?>"  value ="<?php echo substr($end_date,0,16) ?>" name="<?php echo $this->META_END; ?>" id="<?php echo $this->META_END; ?>_date"/>
    </label>
  </p>
  </div>
<?php if (sizeof($colors) > 0): ?>
  <div class="eventpost-misc-pub-section event-color-section">
    <span class="screen-reader-text"><?php _e('Color:', 'event-post'); ?></span>
    <p>
      <img src="<?php echo $this->markurl.$eventcolor.'.png'; ?>" id="eventpost-color-preview" data-url="<?php echo $this->markurl; ?>">
      <span id="eventpost-color-dropdown">
  <?php foreach ($colors as $color => $file): ?>
        <label style="background:#<?php echo $color ?>" for="<?php echo $this->META_COLOR; ?><?php echo $color ?>" title="<?php echo $file; ?>">
          <img src="<?php echo $this->markurl.$color.'.png'; ?>">
          <input type="radio" value ="<?php echo $color ?>" name="<?php echo $this->META_COLOR; ?>" id="<?php echo $this->META_COLOR; ?><?php echo $color ?>" <?php checked($eventcolor, $color, true); ?>/>
        </label>
  <?php endforeach; ?>
      </span>
    </p>
  </div>
<?php endif; ?>
