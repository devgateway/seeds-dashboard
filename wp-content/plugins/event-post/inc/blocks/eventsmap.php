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
function eventsmap_block_init() {
	global $EventPost;
	$dir = dirname( __DIR__ );
	$dir_path = $EventPost->plugin_path;
	$block_js = 'js/block-map.min.js';

	wp_register_script(
		'event-post-map-block-editor',
		plugins_url( $block_js, $dir ),
		array(
			'wp-blocks',
			'wp-i18n',
			'wp-element',
		),
		filemtime( "$dir_path/$block_js" )
	);
	wp_set_script_translations( 'event-post-map-block-editor', 'event-post' );

	$editor_css = 'css/block-map.css';
	wp_register_style(
		'event-post-map-block-editor',
		plugins_url( $editor_css, $dir ),
		array(),
		filemtime( "$dir_path/$editor_css" )
	);

	wp_localize_script('event-post-map-block-editor', 'eventpost_gut_params', array(
		'maptiles' => $EventPost->maps,
		'map_interactions'=>$EventPost->map_interactions,
	));

	register_block_type( 'eventpost/map', array(
		'editor_script' => 'event-post-map-block-editor',
		'editor_style'  => 'event-post-map-block-editor',
		'render_callback' => array($EventPost->Shortcodes, 'shortcode_map'),
	) );
}
add_action( 'init', 'eventsmap_block_init' );
