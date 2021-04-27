<?php
/**
 * Plugin Name: My custom format
 */

function my_custom_format_script_register() {
    wp_register_script(
        'tcdi-condensed-text',
        plugins_url( 'build/index.js', __FILE__ ),
        array( 'wp-element', 'wp-editor', 'wp-rich-text',  )
    );
}
add_action( 'init', 'my_custom_format_script_register' );

function my_custom_format_enqueue_assets_editor() {
    wp_enqueue_script( 'tcdi-condensed-text' );
}
add_action( 'enqueue_block_editor_assets', 'my_custom_format_enqueue_assets_editor' );


