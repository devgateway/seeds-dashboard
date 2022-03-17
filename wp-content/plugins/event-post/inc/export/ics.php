<?php
if(isset($event->post_title) && isset($event->time_start) && isset($event->time_end) && isset($event->post_excerpt) && isset($event->address) && isset($event->permalink)){
	$timezone_string = get_option('timezone_string');
	$gmt = $this->get_gmt_offset();
	$allday = ($post->time_start && $post->time_end && date('H:i:s', $post->time_start) == '00:00:00' && date('H:i:s', $post->time_end) == '00:00:00');
	$date_start = date("Ymd", $event->time_start) . ($allday ? ''  : 'T' . date("His", $event->time_start));
	$date_end = date("Ymd", $event->time_end) . ($allday ? ''  : 'T' . date("His", $event->time_end));
	header("content-type:text/".(isset($mime)?$mime:'calendar'));
	header("Pragma: public");
	header("Expires: 0");
	header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
	header("Cache-Control: public");
	header("Content-Disposition: attachment; filename=".$event->permalink.'.'.(isset($format)?$format:'ics').';' );

	$timezone_string = $_GET['tz'];

		$separator = "\n";

		$props = array();

		// General
		$props[] =  'BEGIN:VCALENDAR';
		$props[] =  'PRODID://WordPress//Event-Post V'. file_get_contents(('../VERSION')).'//EN';
		$props[] =  'VERSION:2.0';

		// Timezone
		if(!empty($timezone_string)){
			array_push($props,
				'BEGIN:VTIMEZONE',
				'TZID:'.$timezone_string,
				'BEGIN:DAYLIGHT',
				'TZOFFSETFROM:+0100',
				'TZOFFSETTO:'.($gmt).'00',
				//'TZNAME:CEST',
				'DTSTART:19700329T020000',
				'RRULE:FREQ=YEARLY;BYDAY=-1SU;BYMONTH=3',
				'END:DAYLIGHT',
				'BEGIN:STANDARD',
				'TZOFFSETFROM:'.($gmt).'00',
				'TZOFFSETTO:+0100',
				'TZNAME:CET',
				'DTSTART:19701025T030000',
				'RRULE:FREQ=YEARLY;BYDAY=-1SU;BYMONTH=10',
				'END:STANDARD',
				'END:VTIMEZONE'
			);
		}

		// Event
		array_push($props,
			'BEGIN:VEVENT',
			'SUMMARY:'.stripslashes($event->post_title),
			'UID:'.$event->permalink,
			'LOCATION:'.stripslashes($event->address),
			'DTSTAMP:'.$date_start.(!empty($timezone_string)?'':'Z'),
			'DTSTART'.(!empty($timezone_string)?';TZID='.$timezone_string:'').':'.$date_start.(!empty($timezone_string)?'':'Z'),
			'DTEND'.(!empty($timezone_string)?';TZID='.$timezone_string:'').':'.$date_end.(!empty($timezone_string)?'':'Z'),
			'DESCRIPTION:'.wordwrap($event->post_excerpt),
			'END:VEVENT'
		);

		// End
		$props[] =  'END:VCALENDAR';

	echo implode($separator, $props);
}
