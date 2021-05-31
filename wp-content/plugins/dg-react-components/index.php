<?php

/**
 * Plugin Name: Development Gateway React Components
 * Plugin URI: https://github.com/devgateway/dg-wp-react
 * Description: Custom UI Components.
 * Version: 1.0.0
 * Author: Sebastian Dimunzio
 *
 * @package dg
 */

defined( 'ABSPATH' ) || exit;

function add_custom_block_categories( $categories, $post ) {
	return array_merge(
		$categories,
		array(
			array(
				'slug' => 'react-blocks',
				'title' => __( 'React Blocks', 'React Blocks' ),
			),
		)
	);
}
add_filter( 'block_categories', 'add_custom_block_categories', 10, 2);
include 'post-carousel/index.php';
include 'page-gallery/index.php';
include 'charts/index.php';
include 'filter/index.php';
include 'tabbed-posts/index.php';
include 'print-icon/index.php';
include 'share-icon/index.php';

#include 'block-styles/index.php';
