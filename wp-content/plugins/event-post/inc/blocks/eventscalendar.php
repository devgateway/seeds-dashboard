<?php
/**
 * Functions to register client-side assets (scripts and stylesheets) for the
 * Gutenberg block.
 *
 * @package event-post
 */

/**
 * Registers all block assets so that they can be enqueued through Gutenberg in
 * the corresponding context.
 *
 * @see https://wordpress.org/gutenberg/handbook/blocks/writing-your-first-block-type/#enqueuing-block-scripts
 * @since 5.2
 */
function eventscalendar_block_init() {
	global $EventPost;
	$dir =  dirname( __DIR__ );
	$dir_path = $EventPost->plugin_path;
	$block_js = 'js/block-calendar.min.js';
	wp_register_script(
		'event-post-calendar-block-editor',
		plugins_url( $block_js, $dir ),
		array(
			'wp-blocks',
			'wp-i18n',
			'wp-element',
		),
		filemtime( "$dir_path/$block_js" )
	);
	wp_set_script_translations( 'event-post-calendar-block-editor', 'event-post' );

	$editor_css = 'css/block-calendar.css';
	wp_register_style(
		'event-post-calendar-block-editor',
		plugins_url( $editor_css, $dir ),
		array(),
		filemtime( "$dir_path/$editor_css" )
	);

	register_block_type( 'eventpost/calendar', array(
		'editor_script' => 'event-post-calendar-block-editor',
		'editor_style'  => 'event-post-calendar-block-editor',
		'render_callback' => array($EventPost->Shortcodes, 'shortcode_cal'),
	) );
}
add_action( 'init', 'eventscalendar_block_init' );
