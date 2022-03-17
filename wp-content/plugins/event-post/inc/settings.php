<?php

namespace EventPost;

class Settings{

	public function __construct() {
		add_action('admin_menu', array(&$this, 'manage_options'));
		add_action('admin_init', array(&$this, 'register_settings'));
		add_filter('plugin_action_links_event-post/eventpost.php', array( &$this, 'settings_link' ) );
		add_filter('plugin_row_meta', array( &$this, 'row_meta' ), 1, 4);
	}
    public function get_settings(){
        $ep_settings = get_option('ep_settings');
        $reg_settings=false;
        if(!is_array($ep_settings)){
            $ep_settings = array();
        }
        if (!isset($ep_settings['dateformat']) || empty($ep_settings['dateformat'])) {
            $ep_settings['dateformat'] = get_option('date_format');
            $reg_settings=true;
        }
        if (!isset($ep_settings['timeformat']) || empty($ep_settings['timeformat'])) {
            $ep_settings['timeformat'] = get_option('time_format');
            $reg_settings=true;
        }
        if (!isset($ep_settings['tile']) || empty($ep_settings['tile']) || !isset(EventPost()->maps[$ep_settings['tile']])) {
            $maps = array_keys(EventPost()->maps);
            $ep_settings['tile'] = EventPost()->maps[$maps[0]]['id'];
            $reg_settings=true;
        }
        if (!isset($ep_settings['tile_api_key']) || empty($ep_settings['tile_api_key']) ) {
            $ep_settings['tile_api_key'] = '';
            $reg_settings=true;
        }
        if(!isset($ep_settings['zoom']) || !is_numeric($ep_settings['zoom'])){
            $ep_settings['zoom']=12;
            $reg_settings=true;
        }
        if (!isset($ep_settings['cache']) || !is_numeric($ep_settings['cache'])) {
            $ep_settings['cache'] = 0;
            $reg_settings=true;
        }
        if (!isset($ep_settings['export']) || empty($ep_settings['export'])) {
            $ep_settings['export'] = 'both';
            $reg_settings=true;
        }
        if (!isset($ep_settings['export_when']) || empty($ep_settings['export_when'])) {
            $ep_settings['export_when'] = 'future';
            $reg_settings=true;
        }
        if (!isset($ep_settings['dateforhumans'])) {
            $ep_settings['dateforhumans'] = 1;
            $reg_settings=true;
        }
        if (!isset($ep_settings['emptylink'])) {
            $ep_settings['emptylink'] = 1;
            $reg_settings=true;
        }
        if (!isset($ep_settings['markpath'])) {
            $ep_settings['markpath'] = '';
            $reg_settings=true;
        }
        if (!isset($ep_settings['markurl'])) {
            $ep_settings['markurl'] = '';
            $reg_settings=true;
        }
        if (!isset($ep_settings['customcss'])) {
            $ep_settings['customcss'] = '';
            $reg_settings=true;
        }
        if (!isset($ep_settings['singlepos']) || empty($ep_settings['singlepos'])) {
            $ep_settings['singlepos'] = 'after';
            $reg_settings=true;
        }
        if (!isset($ep_settings['loopicons'])) {
            $ep_settings['loopicons'] = 1;
            $reg_settings=true;
        }
        if (!isset($ep_settings['displaystatus']) || empty($ep_settings['displaystatus'])) {
            $ep_settings['displaystatus'] = 'both';
            $reg_settings=true;
        }
        if (!isset($ep_settings['adminpos']) || empty($ep_settings['adminpos'])) {
            $ep_settings['adminpos'] = 'side';
            $reg_settings=true;
        }
        if (!isset($ep_settings['container_shema']) ) {
            $ep_settings['container_shema'] = '';
            $reg_settings=true;
        }
        if (!isset($ep_settings['item_shema']) ) {
            $ep_settings['item_shema'] = '';
            $reg_settings=true;
        }
        if(!isset($ep_settings['datepicker']) || !in_array($ep_settings['datepicker'], array('simple', 'native'))){
            $ep_settings['datepicker']='simple';
            $reg_settings=true;
        }
        if(!isset($ep_settings['posttypes']) || !is_array($ep_settings['posttypes'])){
            $ep_settings['posttypes']=array('post');
            $reg_settings=true;
        }
        do_action_ref_array('eventpost_getsettings_action', array(&$ep_settings, &$reg_settings));

        //Save settings  not changed
        if($reg_settings===true){
           update_option('ep_settings', $ep_settings);
        }
        return $ep_settings;
    }


	/**
	 *  Settings link on the plugins page
	 */
	public function settings_link( $links ) {
			$settings_link = '<a href="options-general.php?page=event-settings">' . __( 'Settings', 'event-post' ) . '</a>';
			// place it before other links
			array_unshift( $links, $settings_link );
			return $links;
	}
	/**
	 *
	 * @param type $plugin_meta
	 * @param type $plugin_file
	 * @param type $plugin_data
	 * @param type $status
	 * @return type
	 */
	public function row_meta($plugin_meta, $plugin_file, $plugin_data, $status){
		if($plugin_file=='event-post/eventpost.php'){
			$plugin_link = '<a href="http://event-post.com" target="_blank">' . __( 'Plugin site', 'event-post' ) . '</a>';
			$review_link = '<a href="https://wordpress.org/support/plugin/event-post/reviews/#new-post" target="_blank">' . __( 'Give a note', 'event-post' ) . '</a>';
			array_push($plugin_meta, $plugin_link, $review_link);
		}
		return $plugin_meta;
	}

	/**
	 * adds menu items
	 */
	public function manage_options() {
		add_options_page(__('Events  settings', 'event-post'), __('Events', 'event-post'), 'manage_options', 'event-settings', array(&$this, 'manage_settings'));
	}

	/**
	 * @action eventpost_register_settings
	 */
	public function register_settings(){
		register_setting( 'eventpost-settings', 'ep_settings' );

		// Global
		add_settings_section(
			'eventpost-settings-general',
			'<span class="dashicons dashicons-admin-appearance"></span>&nbsp;'.__('Global settings', 'event-post'),
			array(&$this, 'settings_section_callback'),
			'eventpost-settings'
		);
		//--
		add_settings_field(
				'emptylink',
				__('Print link for empty posts', 'event-post'),
				array(&$this, 'settings_field_select_callback'),
				'eventpost-settings',
				'eventpost-settings-general',
				array( 'name' => 'emptylink', 'options'=>array(
						1=>__('Link all posts', 'event-post'),
						0=>__('Do not link posts with empty content', 'event-post')
					)
				)
		);
		add_settings_field(
				'singlepos',
				__('Event bar position for single posts', 'event-post'),
				array(&$this, 'settings_field_select_callback'),
				'eventpost-settings',
				'eventpost-settings-general',
				array( 'name' => 'singlepos', 'options'=>array(
					'before'=>__('Before the content', 'event-post'),
					'after'=>__('After the content', 'event-post'),
					'none'=>__('Not displayed', 'event-post')
				) )
		);
		add_settings_field(
				'loopicons',
				__('Add icons for events in the loop', 'event-post'),
				array(&$this, 'settings_field_select_callback'),
				'eventpost-settings',
				'eventpost-settings-general',
				array( 'name' => 'loopicons', 'options'=>array(
					1=>__('Emojis', 'event-post'),
					0=>__('Hide', 'event-post'),
					2=>__('Icons', 'event-post')
				) )
		);
		add_settings_field(
				'displaystatus',
				__('Display Event Status on:', 'event-post'),
				array(&$this, 'settings_field_select_callback'),
				'eventpost-settings',
				'eventpost-settings-general',
				array( 'name' => 'displaystatus', 'options'=>array(
					'list'=>__('List only', 'event-post'),
					'single'=>__('Single only', 'event-post'),
					'both'=>__('Both', 'event-post'),
					'none'=>__('None', 'event-post'),
				) )
		);
		add_settings_field(
				'customcss',
				__('Use this custom CSS file', 'event-post'),
				array(&$this, 'settings_field_default_callback'),
				'eventpost-settings',
				'eventpost-settings-general',
				array( 'name' => 'customcss', 'description'=>sprintf(__('Leave empty to use the <a href="%s" target="_blank">default CSS file</a>.', 'event-post'), plugins_url('/css/event-post.css', __FILE__)).'<br>'
					. (is_file(get_stylesheet_directory().'/event-post.css') || is_file(get_template_directory().'/event-post.css')
					? __('Your theme contains an <code>event-post.css</code> file. It will be used as default stylesheet.', 'event-post')
					: __('You can also add a <code>event-post.css</code> in your theme directory. It will be used as default stylesheet.', 'event-post')))
		);

		// Date
		add_settings_section(
			'eventpost-settings-date',
			'<span class="dashicons dashicons-clock"></span>&nbsp;'.__('Date settings', 'event-post'),
			array(&$this, 'settings_section_callback'),
			'eventpost-settings'
		);
		//--
		add_settings_field(
				'dateformat',
				__('Date format', 'event-post'),
				array(&$this, 'settings_field_default_callback'),
				'eventpost-settings',
				'eventpost-settings-date',
				array( 'name' => 'dateformat')
		);
		add_settings_field(
				'timeformat',
				__('Time format', 'event-post'),
				array(&$this, 'settings_field_default_callback'),
				'eventpost-settings',
				'eventpost-settings-date',
				array( 'name' => 'timeformat')
		);
		add_settings_field(
				'export',
				__('Show export buttons on:', 'event-post'),
				array(&$this, 'settings_field_select_callback'),
				'eventpost-settings',
				'eventpost-settings-date',
				array( 'name' => 'export', 'options'=>array(
					'list'=>__('List only', 'event-post'),
					'single'=>__('Single only', 'event-post'),
					'both'=>__('Both', 'event-post'),
					'none'=>__('None', 'event-post'),
				) )
		);
		add_settings_field(
				'export_when',
				__('Show export buttons on:', 'event-post'),
				array(&$this, 'settings_field_select_callback'),
				'eventpost-settings',
				'eventpost-settings-date',
				array( 'name' => 'export_when', 'options'=>array(
					'future'=>__('Future only', 'event-post'),
					'past'=>__('Past only', 'event-post'),
					'both'=>__('Both', 'event-post'),
					'none'=>__('None', 'event-post'),
				) )
		);
		add_settings_field(
				'dateforhumans',
				__('Relative human dates:', 'event-post'),
				array(&$this, 'settings_field_select_callback'),
				'eventpost-settings',
				'eventpost-settings-date',
				array( 'name' => 'dateforhumans',
					'description'=>__('Replace absolute dates by "today", "yesterday", and "tomorrow".', 'event-post'),
					'options'=>array(
					1=>__('Yes', 'event-post'),
					0=>__('No', 'event-post'),
				) )
		);

		// List
		add_settings_section(
			'eventpost-settings-list',
			'<span class="dashicons dashicons-editor-ul"></span>&nbsp;'.__('List settings', 'event-post'),
			array(&$this, 'settings_section_callback'),
			'eventpost-settings'
		);
		//--
		add_settings_field(
				'container_shema',
				__('Container shema', 'event-post'),
				array(&$this, 'settings_field_textarea_callback'),
				'eventpost-settings',
				'eventpost-settings-list',
				array( 'name' => 'container_shema', 'description'=>__('default:','event-post').' <code>'.htmlentities(EventPost()->default_list_shema['container']).'</code>')
		);
		add_settings_field(
				'item_shema',
				__('Container shema', 'event-post'),
				array(&$this, 'settings_field_textarea_callback'),
				'eventpost-settings',
				'eventpost-settings-list',
				array( 'name' => 'item_shema', 'description'=>__('default:','event-post').' <code>'.htmlentities(EventPost()->default_list_shema['item']).'</code>')
		);

		// Map
		add_settings_section(
			'eventpost-settings-map',
			'<span class="dashicons dashicons-location-alt"></span>&nbsp;'.__('Map settings', 'event-post'),
			array(&$this, 'settings_section_callback'),
			'eventpost-settings'
		);
		//--
		$maps = array();
		foreach (EventPost()->maps as $map){
			$maps[$map['id']]=$map['name'].(isset($map['urls_retina']) ? ' '.__('(Retina support)', 'event-post') : '');
		}
		add_settings_field(
				'tile',
				__('Map background', 'event-post'),
				array(&$this, 'settings_field_select_callback'),
				'eventpost-settings',
				'eventpost-settings-map',
				array( 'name' => 'tile', 'options'=>$maps)
		);
		add_settings_field(
				'tile_api_key',
				__('Optional API key', 'event-post'),
				array(&$this, 'settings_field_default_callback'),
				'eventpost-settings',
				'eventpost-settings-map',
				array( 'name' => 'tile_api_key', 'description'=>__('Some tiles need an API key to be displayed.','event-post'))
		);
		add_settings_field(
				'zoom',
				__('Default zoom', 'event-post'),
				array(&$this, 'settings_field_default_callback'),
				'eventpost-settings',
				'eventpost-settings-map',
				array( 'name' => 'zoom')
		);
		add_settings_field(
				'markpath',
				__('Makers custom directory after <code>ABSPATH/</code>', 'event-post'),
				array(&$this, 'settings_field_default_callback'),
				'eventpost-settings',
				'eventpost-settings-map',
				array( 'name' => 'markpath', 'description'=>__('(leave empty for default settings)','event-post'))
		);
		add_settings_field(
				'markurl',
				__('Makers custom directory URL', 'event-post'),
				array(&$this, 'settings_field_default_callback'),
				'eventpost-settings',
				'eventpost-settings-map',
				array( 'name' => 'markurl', 'description'=>__('(leave empty for default settings)','event-post'))
		);

		// Admin
		add_settings_section(
			'eventpost-settings-admin',
			'<span class="dashicons dashicons-admin-generic"></span>&nbsp;'.__('Admin settings', 'event-post'),
			array(&$this, 'settings_section_callback'),
			'eventpost-settings'
		);
		//--
		add_settings_field(
				'adminpos',
				__('Position of event details boxes', 'event-post'),
				array(&$this, 'settings_field_select_callback'),
				'eventpost-settings',
				'eventpost-settings-admin',
				array( 'name' => 'adminpos', 'options'=>array(
					'side'=>__('Side', 'event-post'),
					'normal'=>__('Under the text', 'event-post'),
				) )
		);
		$post_types = array();
		$posttypes = apply_filters('eventpost_get_post_types', get_post_types(array(), 'objects'));
		foreach($posttypes as $type=>$posttype){
			$post_types[$posttype->name]=$posttype->labels->name;
		}
		add_settings_field(
				'posttypes',
				__('Wich post types can be events?', 'event-post'),
				array(&$this, 'settings_field_checkbox_callback'),
				'eventpost-settings',
				'eventpost-settings-admin',
				array( 'name' => 'posttypes', 'options'=>$post_types)
		);
		add_settings_field(
				'datepicker',
				__('Datepicker style', 'event-post'),
				array(&$this, 'settings_field_datepicker_callback'),
				'eventpost-settings',
				'eventpost-settings-admin',
				array( 'name' => 'datepicker')
		);
		add_settings_field(
				'cache',
				__('Use cache', 'event-post'),
				array(&$this, 'settings_field_default_callback'),
				'eventpost-settings',
				'eventpost-settings-admin',
				array( 'name' => 'cache', 'description'=>__('Use cache for results','event-post'))
		);

		do_action('eventpost_register_settings');
	}
	function settings_section_callback( $arg ) {
		echo '<hr>';
	}

	function settings_field_default_callback($args){
		?>
		<input name="ep_settings[<?php echo $args['name']; ?>]" id="<?php echo $args['name']; ?>" value="<?php echo EventPost()->settings[$args['name']]; ?>" class="regular-text"/>
		<?php if(isset($args['description']) && $args['description']): ?>
		<p class="description"><?php echo $args['description']; ?></p>
		<?php endif; ?>
		<?php
	}
	function settings_field_textarea_callback($args){
		?>
		<textarea name="ep_settings[<?php echo $args['name']; ?>]" id="<?php echo $args['name']; ?>" class="regular-text"><?php echo EventPost()->settings[$args['name']]; ?></textarea>
		<?php if(isset($args['description']) && $args['description']): ?>
		<p class="description"><?php echo $args['description']; ?></p>
		<?php endif; ?>
		<?php
	}
	function settings_field_select_callback($args){
		?>
		<select name="ep_settings[<?php echo $args['name']; ?>]" id="<?php echo $args['name']; ?>" class="">
		<?php foreach($args['options'] as $value=>$label) : ?>
			<option value="<?php echo $value; ?>" <?php selected($value, EventPost()->settings[$args['name']], true);?>><?php echo $label; ?></option>
		<?php endforeach; ?>
		</select>
		<?php if(isset($args['description']) && $args['description']): ?>
		<p class="description"><?php echo $args['description']; ?></p>
		<?php endif; ?>
		<?php
	}
	function settings_field_checkbox_callback($args){
		?>
		<?php foreach($args['options'] as $value=>$label) : ?>
		<p>
			<label>
				<input type="checkbox" name="ep_settings[<?php echo $args['name']; ?>][<?php echo $value; ?>]" value="<?php echo $value; ?>" <?php checked(in_array($value, EventPost()->settings[$args['name']]),true, true) ?>>
				<?php echo $label; ?>
			</label>
		</p>
		<?php endforeach; ?>
		<?php if(isset($args['description']) && $args['description']): ?>
		<p class="description"><?php echo $args['description']; ?></p>
		<?php endif; ?>
		<?php
	}
	function settings_field_datepicker_callback($args){
		$now = current_time('mysql');
		$human_date = EventPost()->human_date(current_time('timestamp')) .' '. date(EventPost()->settings['timeformat'], current_time('timestamp'));
		?>
		<div>
			<label>
				<input type="radio" name="ep_settings[datepicker]" id="ep_datepicker_simple" value="simple" <?php checked(EventPost()->settings['datepicker'],'simple', true) ?>>
				<?php _e('Simple', 'event-post'); ?>
			</label>
			<p>
				<span id="eventpost_simple_date_human" class="human_date">
					 <?php echo $human_date; ?>
				</span>
				<input type="text" class="eventpost-datepicker-simple" id="eventpost_simple_date" value="<?php echo $now; ?>">
			</p>
		</div>
		<div>
			<label>
				<input type="radio" name="ep_settings[datepicker]" id="ep_datepicker_native" value="native" <?php checked(EventPost()->settings['datepicker'],'native', true) ?>>
				<?php _e('Native WordPress style', 'event-post'); ?>
			</label>
			<p>
				<span id="eventpost_native_date_human" class="human_date">
					 <?php echo $human_date; ?>
				</span>
				<input type="text" class="eventpost-datepicker-native" id="eventpost_native_date" value="<?php echo $now; ?>">
			</p>
		</div>
		<?php
	}
	/**
	 * output content of the setting page
	 */
	public function manage_settings() {
		$ep_settings = EventPost()->settings;
		?>
		<div class="wrap">
			<h2><?php _e('Events settings', 'event-post'); ?></h2>
			<form action="options.php" method="post">
			<?php settings_fields( 'eventpost-settings' ); ?>
			<?php do_settings_sections('eventpost-settings'); ?>
			<?php do_action('eventpost_settings_form', $ep_settings); ?>
			<?php submit_button(); ?>
			</form>
		</div>
		<?php
		do_action('eventpost_after_settings_form');
	}
}
