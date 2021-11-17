<?php
/**
 * Implements all shortcodes features
 *
 * @package event-post
 */
class EventPost_Shortcodes{
    public $EP;

    function __construct() {
        //Shortcodes
        add_action('init', array(&$this,'init'));
        add_shortcode(apply_filters('eventpost_shortcode_slug', 'events_list'), array(&$this, 'shortcode_list'));
        add_shortcode(apply_filters('eventpost_shortcode_slug', 'events_map'), array(&$this, 'shortcode_map'));
        add_shortcode(apply_filters('eventpost_shortcode_slug', 'events_cal'), array(&$this, 'shortcode_cal'));
        add_shortcode(apply_filters('eventpost_shortcode_slug', 'event_details'), array(&$this, 'shortcode_single'));
        add_shortcode(apply_filters('eventpost_shortcode_slug', 'event_term'), array(&$this, 'shortcode_term'));
        add_shortcode(apply_filters('eventpost_shortcode_slug', 'event_cat'), array(&$this, 'shortcode_cat'));
        add_shortcode(apply_filters('eventpost_shortcode_slug', 'event_search'), array(&$this, 'shortcode_search'));
    }

    /**
     * Call functions when WP is ready
     */
    public function init(){
        global $EventPost;
        $this->EP = $EventPost;
    }

    /**
     * shortcode_single
     * @param array $atts
     * @filter : eventpost_params
     * @return string
     */
    public function shortcode_single($atts){
	extract(shortcode_atts(apply_filters('eventpost_params', array(
            'attribute' => '',
                        ), 'shortcode_single'), $atts));
	$event = $this->EP->retreive();
	switch($attribute){
	    case 'start':
		return $this->EP->human_date($event->time_start);
	    case 'end':
		return $this->EP->human_date($event->time_end);
	    case 'address':
		return $event->address;
	    case 'location':
		return $this->EP->get_singleloc($event, '', 'single');
	    case 'date':
		return $this->EP->get_singledate($event, '', 'single');
	    default:
		return $this->EP->get_single($event, '', 'single');
	}
    }

    /**
     *
     * @param array $atts
     * @return string
     */
    public function shortcode_term($atts){
        extract(shortcode_atts(apply_filters('eventpost_params', array(
            'tax' => null,
            'term' => null,
            'post_type' => null,
                        ), 'shortcode_term'), $atts));
        if(false !== $the_term = $this->EP->retreive_term($term, $tax, $post_type)){
             return $this->EP->delta_date($the_term->time_start, $the_term->time_end);
        }
    }
    public function shortcode_cat($_atts){
        $atts = shortcode_atts(array(
            'cat' => null,
        ), $_atts);
        $atts['tax']='category';
        $atts['post_type']='post';
        $atts['term']=$atts['cat'];
        unset($atts['cat']);
        return $this->shortcode_term($atts);
    }

    /**
     * Shortcode to display a list of events
     *
        ### Query parameters

        - **nb=5** *(number of post, -1 is all, default: 5)*
        - **future=1** *(boolean, retreive, or not, events in the future, default = 1)*
        - **past=0** *(boolean, retreive, or not, events in the past, default = 0)*
        - **cat=''** *(string, select posts only from the selected category, default=null, for all categories)*
        - **tag=''** *(string, select posts only from the selected tag, default=null, for all tags)*
        - **geo=0** *(boolean, retreives or not, only events wich have geolocation informations, default=0)*
        - **order="ASC"** *(string (can be "ASC" or "DESC")*
        - **orderby="meta_value"** *(string (if set to "meta_value" events are sorted by event date, possible values are native posts fileds : "post_title","post_date" etc...)*

        ### Display parameters

        - **thumbnail=""** * (Bool, default:false, used to display posts thumbnails)*
        - **thumbnail_size=""** * (String, default:"thmbnail", can be set to any existing size : "medium","large","full" etc...)*
        - **excerpt=""** * (Bool, default:false, used to display posts excerpts)*
        - **style=""** * (String, add some inline CSS to the list wrapper)*
        - **type=div** *(string, possible values are : div, ul, ol default=div)*
        - **title=''** *(string, hidden if no events is found)*
        - **before_title="&lt;h3&gt;"** *(string (default &lt;h3&gt;)*
        - **after_title="&lt;/h3&gt;"** *(string (default &lt;/h3&gt;)*
        - **container_schema=""** *(string html schema to display list)*
        - **item_schema=""** *(string html schema to display item)*
     *
     * @param array $_atts
     * @filter eventpost_params
     * @return string
     */
    public function shortcode_list($_atts) {
        $atts = shortcode_atts(apply_filters('eventpost_params', array(
            // Filters
            'nb' => 0,
            'future' => true,
            'past' => false,
            'geo' => 0,
            'cat' => '',
            'tag' => '',
            'tax_name' => '',
            'tax_term' => '',
            'orderby' => 'meta_value',
            'order' => 'ASC',
            'title' => '',
            // Display
            'type' => 'div',
            'before_title' => '<h3>',
            'after_title' => '</h3>',
            'thumbnail' => '',
            'thumbnail_size' => '',
            'excerpt' => '',
            'width' => '',
            'height' => 'auto',
            'style' => '',
            'pages' => false,
            'container_schema' => $this->EP->list_shema['container'],
            'item_schema' => $this->EP->list_shema['item'],
                        ), 'shortcode_list'), $_atts);

        if ($atts['container_schema'] != $this->EP->list_shema['container'])
            $atts['container_schema'] = html_entity_decode($atts['container_schema']);
        if ($atts['item_schema'] != $this->EP->list_shema['item'])
            $atts['item_schema'] = html_entity_decode($atts['item_schema']);
        return $this->EP->list_events($atts, 'event_list', 'shortcode');
    }

    /**
     * Shortcode to display a map of events
     * @param array $_atts
     * @filter eventpost_params
     * @return string
     */
    public function shortcode_map($_atts) {
        $ep_settings = $this->EP->settings;
        $defaults = array(
            // Display
            'width' => '',
            'height' => '',
            'tile' => $ep_settings['tile'],
            'pop_element_schema' => '',
            'htmlPop_element_schema' => '',
            'title' => '',
            'before_title' => '<h3>',
            'after_title' => '</h3>',
            'style' => '',
            'thumbnail' => '',
            'thumbnail_size' => '',
            'excerpt' => '',
            'zoom' => '',
            'map_position' => '',
            'latitude' => '',
            'longitude' => '',
            'list' => '0',
            // Filters
            'nb' => 0,
            'future' => true,
            'past' => false,
            'cat' => '',
            'tag' => '',
            'tax_name' => '',
            'tax_term' => '',
            'orderby' => 'meta_value',
            'order' => 'ASC',
        );
            // UI options
        foreach($this->EP->map_interactions as $int_key=>$int_name){
            $defaults[$int_key]=true;
        }
            // - UI options
        foreach($this->EP->map_interactions as $int_key=>$int_name){
            $defaults['disable_'.strtolower($int_key)]=false;
        }

        $atts = shortcode_atts(apply_filters('eventpost_params', $defaults, 'shortcode_map'), $_atts);
            // UI options
        foreach($this->EP->map_interactions as $int_key=>$int_name){
            if($atts['disable_'.strtolower($int_key)]==true){
                $atts[$int_key]=false;
            }
            unset($atts['disable_'.strtolower($int_key)]);
        }
        $atts['geo'] = 1;
        $atts['type'] = 'div';
        return $this->EP->list_events($atts, 'event_geolist', 'shortcode'); //$nb,'div',$future,$past,1,'event_geolist');
    }

    /**
     * Shortcode to display a calendar of events
     * @param array $_atts
     * @filter eventpost_params
     * @return string
     */
    public function shortcode_cal($_atts) {
	$this->EP->load_scripts();
        $atts = shortcode_atts(apply_filters('eventpost_params', array(
            'date' => date('Y-n'),
            'cat' => '',
            'mondayfirst' => 0, //1 : weeks starts on monday
            'display_title' => 0,
            'datepicker' => 1,
            'tax_name' => '',
            'tax_term' => '',
            'thumbnail' => '',
                        ), 'shortcode_cal'), $_atts);
        extract($atts);
        return '<div class="eventpost_calendar" data-tax_name="' . $tax_name . '" data-tax_term="' . $tax_term . '" data-cat="' . $cat . '" data-date="' . $date . '" data-mf="' . $mondayfirst . '" data-dp="' . $datepicker . '" data-title="'. $display_title .'">' . $this->EP->calendar($atts) . '</div>';
    }

    /**
     *
     * @param type $_atts
     * @return type
     */
    public function shortcode_search($_atts){
        return $this->EP->search($_atts);
    }

}
