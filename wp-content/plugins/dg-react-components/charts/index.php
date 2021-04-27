<?php

/**
 * Plugin Name: TCDI UI Components
 * Plugin URI:
 * Description:
 * Version: 1.0.2
 * Author: Sebastian Dimunzio
 *
 * @package dg-components
 */

defined( 'ABSPATH' ) || exit;


/**
 * Load all translations for our plugin from the MO file.
*/
add_action( 'init', 'tcdi_chart' );

function tcdi_chart() {
	load_plugin_textdomain( 'dg-components', false, basename( __DIR__ ) . '/languages' );
}

/**
 * Registers all block assets so that they can be enqueued through Gutenberg in
 * the corresponding context.
 *
 * Passes translations to JavaScript.
 */
function tcdi_chart_register_block() {
    $name='chart';
    $asset_file = include( plugin_dir_path( __FILE__ ) . 'build/index.asset.php');
	if ( ! function_exists( 'register_block_type' ) ) {
		// Gutenberg is not active.
		return;
	}
	wp_register_script(
    		$name ,
    		plugins_url( 'build/index.js', __FILE__ ),
    		$asset_file['dependencies'],
    		$asset_file['version']
    	);
	wp_register_style(
		$name  ,
		plugins_url( 'style.css', __FILE__ ),
		array( ),
		filemtime( plugin_dir_path( __FILE__ ) . 'style.css' )
	);

	register_block_type( 'dg-components/'.$name , array(
		'style' => $name ,
		'editor_script' => $name ,
	) );

  if ( function_exists( 'wp_set_script_translations' ) ) {
       wp_set_script_translations( $name , 'dg-components' );
  }

}
add_action( 'init', 'tcdi_chart_register_block' );


