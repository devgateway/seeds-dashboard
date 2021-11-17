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
function eventpost_list_block_init() {
	global $EventPost;
	$dir_path = $EventPost->plugin_path;
	$dir = dirname( __DIR__ );

	$block_js = 'js/block-list.min.js';
	wp_register_script(
		'event-post-list-block-editor',
		plugins_url( $block_js, $dir ),
		array(
			'wp-blocks',
			'wp-editor',
			'wp-components',
			'wp-i18n',
			'wp-element',
		),
		filemtime( "$dir_path/$block_js" )
	);
	wp_set_script_translations( 'event-post-list-block-editor', 'event-post' );

	$block_css = 'css/block-list.css';
	wp_register_style(
		'event-post-list-block-editor',
		plugins_url( $block_css, __FILE__ ),
		array(),
		filemtime( "$dir_path/$block_css" )
	);

	register_block_type( 'eventpost/list', array(
		'editor_script' => 'event-post-list-block-editor',
		'editor_style'  => 'event-post-list-block-editor',
		'render_callback' => array($EventPost->Shortcodes, 'shortcode_list'),
	) );
}
add_action( 'init', 'eventpost_list_block_init' );
