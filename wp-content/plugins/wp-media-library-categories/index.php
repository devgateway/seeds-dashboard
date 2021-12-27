<?php
/**
 * Plugin Name: Media Library Categories
 * Plugin URI: https://wordpress.org/plugins/wp-media-library-categories/
 * Description: Adds the ability to use categories in the media library.
 * Version: 1.9.9
 * Author: Jeffrey-WP
 * Text Domain: wp-media-library-categories
 * Domain Path: /languages
 * Author URI: https://1.envato.market/c/1206953/275988/4415?subId1=profile&subId2=plugin&subId3=wpmlc&u=https%3A%2F%2Fcodecanyon.net%2Fuser%2Fjeffrey-wp%2F
 */

/** If this file is called directly, abort. */
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * class wpMediaLibraryCategories
 * the main class
 */
class wpMediaLibraryCategories {

    public $plugin_version = '1.9.9';

    /**
     * Initialize the hooks and filters
     */
    public function __construct() {
        add_action( 'plugins_loaded', array( $this, 'wpmediacategory_load_plugin_textdomain' ) );
        add_action( 'admin_notices', array( $this, 'admin_notices' ) );
        add_action( 'init', array( $this, 'wpmediacategory_init' ) );
        add_action( 'init', array( $this, 'wpmediacategory_change_category_update_count_callback' ), 100 );

        add_filter( 'shortcode_atts_gallery', array( $this, 'wpmediacategory_gallery_atts' ), 10, 3 );

        // load code that is only needed in the admin section
        if ( is_admin() ) {

            add_action( 'add_attachment', array( $this, 'wpmediacategory_set_attachment_category' ) );
            add_action( 'edit_attachment', array( $this, 'wpmediacategory_set_attachment_category' ) );
            add_action( 'restrict_manage_posts', array( $this, 'wpmediacategory_add_category_filter' ) );
            add_action( 'admin_footer-upload.php', array( $this, 'wpmediacategory_custom_bulk_admin_footer' ) );
            add_action( 'load-upload.php', array( $this, 'wpmediacategory_custom_bulk_action' ) );
            add_action( 'admin_notices', array( $this, 'wpmediacategory_custom_bulk_admin_notices' ) );
            add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), array( $this, 'wpmediacategory_add_plugin_action_links' ) );
            add_filter( 'ajax_query_attachments_args', array( $this, 'wpmediacategory_ajax_query_attachments_args' ) );
            add_action( 'wp_ajax_save-attachment-compat', array( $this, 'wpmediacategory_save_attachment_compat' ), 0 );
            add_filter( 'attachment_fields_to_edit', array( $this, 'wpmediacategory_attachment_fields_to_edit' ), 10, 2 );
            # Enqueue admin scripts and styles
            add_action( 'admin_enqueue_scripts', array( $this, 'wpmediacategory_enqueue_media_action' ) );
            # Initialize the settings data
            add_action( 'admin_init', array( $this, 'wpmediacategory_settings_init' ) );

        }
    }


    /**
     * Fired when the plugin is activated
     */
    static function plugin_activation() {
        // Create transient data
        set_transient( 'wpmlc-admin-activation-notice', true, 60 );
    }


    /**
     * Load text domain
     * @action plugins_loaded
     */
    public function wpmediacategory_load_plugin_textdomain() {
        load_plugin_textdomain( 'wp-media-library-categories', false, basename( dirname( __FILE__ ) ) . '/languages/' );
    }


    /**
     * Show admin notices
     * @action admin_notices
     */
    public function admin_notices() {

        // Check transient, if available display notice
        if ( get_transient( 'wpmlc-admin-activation-notice' ) ) {

            // Get taxonomy slug
            $taxonomy = $this->get_wpmlc_taxonomy();
            if ( $taxonomy == 'category' ) { // check if category hasn't already been changed
                ?>
                <div class="notice notice-info is-dismissible">
                    <p><?php _e( 'Thank you for using the <strong>Media Library Categories</strong> plugin.', 'wp-media-library-categories' ); ?></p>
                    <p><?php echo sprintf( __( 'By default the WordPress Media Library uses the same categories as WordPress does (such as in posts &amp; pages).<br />If you want to use separate categories for the WordPress Media Library you can change this in the <a href="%s">media settings</a>.', 'wp-media-library-categories' ), admin_url( 'options-media.php#wpmlc_settings' ) ); ?></p>
                </div>
                <?php
            }

            // Delete transient, only display this notice once
            delete_transient( 'wpmlc-admin-activation-notice' );
        }
    }


    /**
     * Register taxonomy for attachments
     * @action init
     */
    public function wpmediacategory_init() {
        // Get taxonomy slug
        $taxonomy = $this->get_wpmlc_taxonomy();

        if ( taxonomy_exists( $taxonomy ) ) {
            register_taxonomy_for_object_type( $taxonomy, 'attachment' );
        } else {
            $args = array(
                'hierarchical'          => true,  // hierarchical: true = display as categories, false = display as tags
                'show_admin_column'     => true,
                'update_count_callback' => array( &$this, 'wpmediacategory_update_count_callback' )
            );
            register_taxonomy( $taxonomy, array( 'attachment' ), $args );
        }
    }


    /**
     * Change default update_count_callback for category taxonomy
     * @action init
     */
    public function wpmediacategory_change_category_update_count_callback() {
        global $wp_taxonomies;

        // Get taxonomy slug
        $taxonomy = $this->get_wpmlc_taxonomy();

        if ( $taxonomy == 'category' ) {
            if ( ! taxonomy_exists( 'category' ) ) {
                return false;
            }

            $new_arg = &$wp_taxonomies['category']->update_count_callback;
            $new_arg = array( &$this, 'wpmediacategory_update_count_callback' );
        }
    }


    /**
     * Custom update_count_callback
     * @param array $terms
     * @param string $taxonomy
     */
    public function wpmediacategory_update_count_callback( $terms = array(), $taxonomy = 'category' ) {
        global $wpdb;

        // Get taxonomy slug
        $taxonomy = $this->get_wpmlc_taxonomy();

        // select id & count from taxonomy
        $query = "SELECT term_taxonomy_id, MAX(total) AS total FROM ((
        SELECT tt.term_taxonomy_id, COUNT(*) AS total FROM $wpdb->term_relationships tr, $wpdb->term_taxonomy tt WHERE tr.term_taxonomy_id = tt.term_taxonomy_id AND tt.taxonomy = %s GROUP BY tt.term_taxonomy_id
        ) UNION ALL (
        SELECT term_taxonomy_id, 0 AS total FROM $wpdb->term_taxonomy WHERE taxonomy = %s
        )) AS unioncount GROUP BY term_taxonomy_id";
        $rsCount = $wpdb->get_results( $wpdb->prepare( $query, $taxonomy, $taxonomy ) );
        // update all count values from taxonomy
        foreach ( $rsCount as $rowCount ) {
            $wpdb->update( $wpdb->term_taxonomy, array( 'count' => $rowCount->total ), array( 'term_taxonomy_id' => $rowCount->term_taxonomy_id ) );
        }
    }


    /**
     * Custom gallery shortcode
     * @filter shortcode_atts_gallery
     * @param array $result
     * @param array $defaults
     * @param array $atts
     */
    public function wpmediacategory_gallery_atts( $result, $defaults, $atts ) {

        if ( isset( $atts['category'] ) ) {

            // Get taxonomy slug
            $taxonomy = $this->get_wpmlc_taxonomy();

            $category = $atts['category'];
            $include  = isset( $result['include'] ) ? $result['include'] : '';

            $categories = explode( ',', $category );
            foreach ( $categories as $category ) {

                // category slug?
                if ( ! is_numeric( $category ) ) {

                    if ( $taxonomy != 'category' ) {

                        $term = get_term_by( 'slug', $category, $taxonomy );
                        if ( false !== $term ) {
                            $category = $term->term_id;
                        } else {
                            // not existing category slug
                            $category = '';
                        }

                    } else {

                        $categoryObject = get_category_by_slug( $category );
                        if ( false !== $categoryObject ) {
                            $category = $categoryObject->term_id;
                        } else {
                            // not existing category slug
                            $category = '';
                        }
                    }

                }

                if ( $category != '' ) {

                    $ids_new = array();

                    if ( $taxonomy != 'category' ) {

                        $args = array(
                            'post_type'   => 'attachment',
                            'numberposts' => -1,
                            'post_status' => null,
                            'tax_query'   => array(
                                array(
                                    'taxonomy' => $taxonomy,
                                    'field'    => 'id',
                                    'terms'    => $category
                                )
                            )
                        );

                    } else {

                        $args = array(
                            'post_type'   => 'attachment',
                            'numberposts' => -1,
                            'post_status' => null,
                            'category'    => $category
                        );

                    }

                    // use id attribute and show attachments in selected category and uploaded to post ID
                    if ( isset( $atts['id'] ) ) {
                        if ( empty( $atts['id'] ) ) {
                            $args['post_parent'] = get_the_ID(); // get ID of the current post if id attribute is empty
                        } else {
                            $args['post_parent'] = $atts['id'];
                        }
                    }

                    $attachments = get_posts( $args );

                    if ( ! empty( $attachments ) ) {
                        foreach ( $attachments as $attachment ) {
                            $ids_new[] = $attachment->ID;
                        }
                    }

                    if ( ! empty( $ids_new ) ) {
                        $include .= ',' . implode( ',', $ids_new );
                        $atts['ids'] = '';
                    }

                }
            }

            $result['include'] = trim( $include, ',' );
            $result['category'] = $atts['category'];
        }

        return $result;
    }


    /**
     * Handle default category of attachments without category
     * @action add_attachment
     * @param array $post_ID
     */
    public function wpmediacategory_set_attachment_category( $post_ID ) {

        // Get taxonomy slug
        $taxonomy = $this->get_wpmlc_taxonomy();

        // if attachment already have categories, stop here
        if ( wp_get_object_terms( $post_ID, $taxonomy ) ) {
            return;
        }

        // no, then get the default one
        $post_category = array( get_option( 'default_category' ) );

        // then set category if default category is set on writting page
        if ( $post_category ) {
            wp_set_post_categories( $post_ID, $post_category );
        }
    }


    /**
     * Add a category filter
     * @action restrict_manage_posts
     */
    public function wpmediacategory_add_category_filter() {
        global $pagenow, $wp_query;
        if ( 'upload.php' == $pagenow ) {
            // Get taxonomy slug
            $taxonomy = $this->get_wpmlc_taxonomy();
            if ( $taxonomy != 'category' ) {
                $selected = isset( $wp_query->query[$taxonomy] ) ? $wp_query->query[$taxonomy] : 0;
                $dropdown_options = array(
                    'taxonomy'        => $taxonomy,
                    'name'            => $taxonomy,
                    'class'           => 'postform wpmlc-taxonomy-filter',
                    'show_option_all' => __( 'View all categories', 'wp-media-library-categories' ),
                    'hide_empty'      => false,
                    'hierarchical'    => true,
                    'orderby'         => 'name',
                    'selected'        => $selected,
                    'show_count'      => true,
                    'walker'          => new wpmediacategory_walker_category_filter(),
                    'value'           => 'slug'
                );
            } else {
                $selected = isset( $wp_query->query['cat'] ) ? $wp_query->query['cat'] : 0;
                $dropdown_options = array(
                    'taxonomy'        => $taxonomy,
                    'class'           => 'postform wpmlc-taxonomy-filter',
                    'show_option_all' => __( 'View all categories', 'wp-media-library-categories' ),
                    'hide_empty'      => false,
                    'hierarchical'    => true,
                    'orderby'         => 'name',
                    'selected'        => $selected,
                    'show_count'      => false,
                    'walker'          => new wpmediacategory_walker_category_filter(),
                    'value'           => 'id'
                );
            }
            wp_dropdown_categories( $dropdown_options );

            // Get select2 setting
            $select2 = $this->get_wpmlc_select2();
            if ( $select2 === '1' ) {
                $suffix = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';
                wp_enqueue_script( 'wpmediacategory-select2', plugins_url( 'js/select2' . $suffix . '.js', __FILE__ ), array( 'jquery' ), '4.0.12-custom', true );
                wp_enqueue_style( 'wpmediacategory-select2', plugins_url( 'css/select2' . $suffix . '.css', __FILE__ ), array(), '4.0.12' );
            }
        }
    }


    /**
     * Add custom Bulk Action to the select menus
     * @action admin_footer-upload.php
     */
    public function wpmediacategory_custom_bulk_admin_footer() {
        // Get taxonomy slug
        $taxonomy = $this->get_wpmlc_taxonomy();
        $terms = get_terms( $taxonomy, 'hide_empty=0' );
        if ( $terms && ! is_wp_error( $terms ) ) :

            echo '<script type="text/javascript">';
            echo 'jQuery(window).on(\'load\',function(){';
            echo 'jQuery(\'<optgroup id="wpmediacategory_optgroup1" label="' .  html_entity_decode( __( 'Categories', 'wp-media-library-categories' ), ENT_QUOTES, 'UTF-8' ) . '">\').appendTo("select[name=\'action\']");';
            echo 'jQuery(\'<optgroup id="wpmediacategory_optgroup2" label="' .  html_entity_decode( __( 'Categories', 'wp-media-library-categories' ), ENT_QUOTES, 'UTF-8' ) . '">\').appendTo("select[name=\'action2\']");';

            // add categories
            foreach ( $terms as $term ) {
                $sTxtAdd = esc_js( __( 'Add', 'wp-media-library-categories' ) . ': ' . $term->name );
                echo "jQuery('<option>').val('wpmediacategory_add_" . $term->term_taxonomy_id . "').text('" . $sTxtAdd . "').appendTo('#wpmediacategory_optgroup1');";
                echo "jQuery('<option>').val('wpmediacategory_add_" . $term->term_taxonomy_id . "').text('" . $sTxtAdd . "').appendTo('#wpmediacategory_optgroup2');";
            }
            // remove categories
            foreach ( $terms as $term ) {
                $sTxtRemove = esc_js( __( 'Remove', 'wp-media-library-categories' ) . ': ' . $term->name );
                echo "jQuery('<option>').val('wpmediacategory_remove_" . $term->term_taxonomy_id . "').text('" . $sTxtRemove . "').appendTo('#wpmediacategory_optgroup1');";
                echo "jQuery('<option>').val('wpmediacategory_remove_" . $term->term_taxonomy_id . "').text('" . $sTxtRemove . "').appendTo('#wpmediacategory_optgroup2');";
            }
            // remove all categories
            echo "jQuery('<option>').val('wpmediacategory_remove_0').text('" . esc_js( __( 'Remove all categories', 'wp-media-library-categories' ) ) . "').appendTo('#wpmediacategory_optgroup1');";
            echo "jQuery('<option>').val('wpmediacategory_remove_0').text('" . esc_js( __( 'Remove all categories', 'wp-media-library-categories' ) ) . "').appendTo('#wpmediacategory_optgroup2');";
            echo "});";
            echo "</script>";

        endif;
    }


    /**
     * Handle the custom Bulk Action
     * @action load-upload.php
     */
    public function wpmediacategory_custom_bulk_action() {
        global $wpdb;

        if ( ! isset( $_REQUEST['action'] ) ) {
            return;
        }

        // is it a category?
        $sAction = ( $_REQUEST['action'] != -1 ) ? $_REQUEST['action'] : $_REQUEST['action2'];
        if ( substr( $sAction, 0, 16 ) != 'wpmediacategory_' ) {
            return;
        }

        // security check
        check_admin_referer( 'bulk-media' );

        // make sure ids are submitted.  depending on the resource type, this may be 'media' or 'post'
        if( isset( $_REQUEST['media'] ) ) {
            $post_ids = array_map( 'intval', $_REQUEST['media'] );
        }

        if( empty( $post_ids ) ) {
            return;
        }

        $sendback = admin_url( "upload.php?editCategory=1" );

        // remember pagenumber
        $pagenum = isset( $_REQUEST['paged'] ) ? absint( $_REQUEST['paged'] ) : 0;
        $sendback = add_query_arg( 'paged', $pagenum, $sendback );

        // remember orderby
        if ( isset( $_REQUEST['orderby'] ) ) {
            $sOrderby = $_REQUEST['orderby'];
            $sendback = esc_url( add_query_arg( 'orderby', $sOrderby, $sendback ) );
        }
        // remember order
        if ( isset( $_REQUEST['order'] ) ) {
            $sOrder = $_REQUEST['order'];
            $sendback = esc_url( add_query_arg( 'order', $sOrder, $sendback ) );
        }
        // remember author
        if ( isset( $_REQUEST['author'] ) ) {
            $sOrderby = $_REQUEST['author'];
            $sendback = esc_url( add_query_arg( 'author', $sOrderby, $sendback ) );
        }

        foreach( $post_ids as $post_id ) {

            if ( is_numeric( str_replace( 'wpmediacategory_add_', '', $sAction ) ) ) {
                $nCategory = str_replace( 'wpmediacategory_add_', '', $sAction );

                // update or insert category
                $wpdb->replace( $wpdb->term_relationships,
                    array(
                        'object_id'        => $post_id,
                        'term_taxonomy_id' => $nCategory
                    ),
                    array(
                        '%d',
                        '%d'
                    )
                );

            } else if ( is_numeric( str_replace( 'wpmediacategory_remove_', '', $sAction ) ) ) {
                $nCategory = str_replace( 'wpmediacategory_remove_', '', $sAction );

                // remove all categories
                if ( $nCategory == 0 ) {
                    $wpdb->delete( $wpdb->term_relationships,
                        array(
                            'object_id' => $post_id
                        ),
                        array(
                            '%d'
                        )
                    );
                // remove category
                } else {
                    $wpdb->delete( $wpdb->term_relationships,
                        array(
                            'object_id'        => $post_id,
                            'term_taxonomy_id' => $nCategory
                        ),
                        array(
                            '%d',
                            '%d'
                        )
                    );
                }

            }
        }

        $this->wpmediacategory_update_count_callback();

        wp_safe_redirect( $sendback ); // perform a safe (local) redirect
        exit();
    }


    /**
     * Display an admin notice on the page after changing category
     * @action admin_notices
     */
    public function wpmediacategory_custom_bulk_admin_notices() {
        global $post_type, $pagenow;

        if ( $pagenow == 'upload.php' && $post_type == 'attachment' && isset( $_GET['editCategory'] ) ) {
            echo '<div class="updated"><p>' . __( 'Category changes are saved.', 'wp-media-library-categories' ) . '</p></div>';
        }
    }


    /**
     * Add a link to media categories on the plugin page
     * @action plugin_action_links_*
     */
    public function wpmediacategory_add_plugin_action_links( $links ) {
        // Get taxonomy slug
        $taxonomy = $this->get_wpmlc_taxonomy();
        return array_merge(
            array(
                'categories' => '<a href="' . admin_url( 'edit-tags.php?taxonomy=' . $taxonomy . '&post_type=attachment' ) . '">' . __( 'Categories', 'wp-media-library-categories' ) . '</a>',
                'settings'   => '<a href="' . admin_url( 'options-media.php#wpmlc_settings' ) . '">' . __( 'Settings', 'wp-media-library-categories' ) . '</a>',
                'premium'    => '<a href="https://1.envato.market/c/1206953/275988/4415?subId1=wpmlcp&subId2=plugin&u=https%3A%2F%2Fcodecanyon.net%2Fitem%2Fmedia-library-categories-premium%2F6691290" style="color:#60a559;" target="_blank" title="' . __( 'Try Media Library Categories Premium today - 100% money back guarantee', 'wp-media-library-categories' ) . '">' . __( 'Try Premium Version', 'wp-media-library-categories' ) . '</a>'
            ),
            $links
        );
    }


    /**
     * Changing categories in the 'grid view'
     * @action ajax_query_attachments_args
     * @param array $query
     */
    public function wpmediacategory_ajax_query_attachments_args( $query = array() ) {
        // grab original query, the given query has already been filtered by WordPress
        $taxquery = isset( $_REQUEST['query'] ) ? (array) $_REQUEST['query'] : array();

        $taxonomies = get_object_taxonomies( 'attachment', 'names' );
        $taxquery = array_intersect_key( $taxquery, array_flip( $taxonomies ) );

        // merge our query into the WordPress query
        $query = array_merge( $query, $taxquery );

        $query['tax_query'] = array( 'relation' => 'AND' );

        foreach ( $taxonomies as $taxonomy ) {
            if ( isset( $query[$taxonomy] ) && is_numeric( $query[$taxonomy] ) ) {
                array_push( $query['tax_query'], array(
                    'taxonomy' => $taxonomy,
                    'field'    => 'id',
                    'terms'    => $query[$taxonomy]
                ) );
            }
            unset( $query[$taxonomy] );
        }

        return $query;
    }


    /**
     * Save categories from attachment details on insert media popup
     * @action wp_ajax_save-attachment-compat
     */
    public function wpmediacategory_save_attachment_compat() {

        if ( ! isset( $_REQUEST['id'] ) ) {
            wp_send_json_error();
        }

        if ( ! $id = absint( $_REQUEST['id'] ) ) {
            wp_send_json_error();
        }

        if ( empty( $_REQUEST['attachments'] ) || empty( $_REQUEST['attachments'][ $id ] ) ) {
            wp_send_json_error();
        }
        $attachment_data = $_REQUEST['attachments'][ $id ];

        check_ajax_referer( 'update-post_' . $id, 'nonce' );

        if ( ! current_user_can( 'edit_post', $id ) ) {
            wp_send_json_error();
        }

        $post = get_post( $id, ARRAY_A );

        if ( 'attachment' != $post['post_type'] ) {
            wp_send_json_error();
        }

        /** This filter is documented in wp-admin/includes/media.php */
        $post = apply_filters( 'attachment_fields_to_save', $post, $attachment_data );

        if ( isset( $post['errors'] ) ) {
            $errors = $post['errors']; // @todo return me and display me!
            unset( $post['errors'] );
        }

        wp_update_post( $post );

        foreach ( get_attachment_taxonomies( $post ) as $taxonomy ) {
            if ( isset( $attachment_data[ $taxonomy ] ) ) {
                wp_set_object_terms( $id, array_map( 'trim', preg_split( '/,+/', $attachment_data[ $taxonomy ] ) ), $taxonomy, false );
            } else if ( isset($_REQUEST['tax_input']) && isset( $_REQUEST['tax_input'][ $taxonomy ] ) ) {
                wp_set_object_terms( $id, $_REQUEST['tax_input'][ $taxonomy ], $taxonomy, false );
            } else {
                wp_set_object_terms( $id, '', $taxonomy, false );
            }
        }

        if ( ! $attachment = wp_prepare_attachment_for_js( $id ) ) {
            wp_send_json_error();
        }

        wp_send_json_success( $attachment );
    }


    /**
     * Add category checkboxes to attachment details on insert media popup
     * @action attachment_fields_to_edit
     */
    public function wpmediacategory_attachment_fields_to_edit( $form_fields, $post ) {

        foreach ( get_attachment_taxonomies( $post->ID ) as $taxonomy ) {
            $terms = get_object_term_cache( $post->ID, $taxonomy );

            $t = (array)get_taxonomy( $taxonomy );
            if ( ! $t['public'] || ! $t['show_ui'] ) {
                continue;
            }
            if ( empty($t['label']) ) {
                $t['label'] = $taxonomy;
            }
            if ( empty($t['args']) ) {
                $t['args'] = array();
            }

            if ( false === $terms ) {
                $terms = wp_get_object_terms($post->ID, $taxonomy, $t['args']);
            }

            $values = array();

            foreach ( $terms as $term ) {
                $values[] = $term->slug;
            }

            $t['value'] = join(', ', $values);
            $t['show_in_edit'] = false;

            if ( $t['hierarchical'] ) {
                ob_start();

                    wp_terms_checklist( $post->ID, array( 'taxonomy' => $taxonomy, 'checked_ontop' => false, 'walker' => new wpmediacategory_walker_media_taxonomy_checklist() ) );

                    if ( ob_get_contents() != false ) {
                        $html = '<ul class="term-list">' . ob_get_contents() . '</ul>';
                    } else {
                        $html = '<ul class="term-list"><li>No ' . $t['label'] . '</li></ul>';
                    }

                ob_end_clean();

                $t['input'] = 'html';
                $t['html'] = $html;
            }

            $form_fields[$taxonomy] = $t;
        }

        return $form_fields;
    }


    /**
     * Enqueue media view scripts and styles
     */
    public function load_media_view_scripts() {

        global $plugin_version;

        // Get taxonomy slug
        $taxonomy = $this->get_wpmlc_taxonomy();

        $suffix = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';

        if ( $taxonomy != 'category' ) {
            $dropdown_options = array(
                'taxonomy'        => $taxonomy,
                'class'           => 'postform wpmlc-taxonomy-filter',
                'hide_empty'      => false,
                'hierarchical'    => true,
                'orderby'         => 'name',
                'show_count'      => true,
                'walker'          => new wpmediacategory_walker_category_mediagridfilter(),
                'value'           => 'id',
                'echo'            => false
            );
        } else {
            $dropdown_options = array(
                'taxonomy'        => $taxonomy,
                'class'           => 'postform wpmlc-taxonomy-filter',
                'hide_empty'      => false,
                'hierarchical'    => true,
                'orderby'         => 'name',
                'show_count'      => false,
                'walker'          => new wpmediacategory_walker_category_mediagridfilter(),
                'value'           => 'id',
                'echo'            => false
            );
        }
        $attachment_terms = wp_dropdown_categories( $dropdown_options );
        $attachment_terms = preg_replace( array( "/<select([^>]*)>/", "/<\/select>/" ), "", $attachment_terms );

        echo '<script type="text/javascript">';
        echo '/* <![CDATA[ */';
        echo 'var wpmediacategory_taxonomies = {"' . $taxonomy . '":{"list_title":"' . html_entity_decode( __( 'View all categories', 'wp-media-library-categories' ), ENT_QUOTES, 'UTF-8' ) . '","term_list":[' . substr( $attachment_terms, 2 ) . ']}};';
        echo '/* ]]> */';
        echo '</script>';

        wp_enqueue_script( 'wpmediacategory-media-views', plugins_url( 'js/wpmediacategory-media-views' . $suffix . '.js', __FILE__ ), array( 'media-views' ), $plugin_version, true );

        // Get select2 setting
        $select2 = $this->get_wpmlc_select2();
        if ( $select2 === '1' ) {
            wp_enqueue_script( 'wpmediacategory-select2', plugins_url( 'js/select2' . $suffix . '.js', __FILE__ ), array( 'jquery' ), '4.0.12-custom', true );
            wp_enqueue_style( 'wpmediacategory-select2', plugins_url( 'css/select2' . $suffix . '.css', __FILE__ ), array(), '4.0.12' );
        }

    }


    /**
     * Enqueue admin scripts and styles
     * @action admin_enqueue_scripts
     */
    public function wpmediacategory_enqueue_media_action() {

        global $pagenow, $plugin_version;

        $suffix  = ( defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';

        if ( wp_script_is( 'media-editor' ) && 'upload.php' == $pagenow ) {

            $this->load_media_view_scripts();
        }

        wp_enqueue_style( 'wpmediacategory', plugins_url( 'css/wpmediacategory' . $suffix . '.css', __FILE__ ), array(), $plugin_version );
    }


    /**
     * Get taxonomy slug.
     */
    public function get_wpmlc_taxonomy() {

        // Default taxonomy
        $taxonomy = 'category';
        // Add filter to change the default taxonomy (so we can set the override in a custom script)
        $taxonomy = apply_filters( 'wpmediacategory_taxonomy', $taxonomy );

        // Get custom taxonomy slug from settings page
        $options = get_option( 'wpmlc_settings' );
        if ( ! empty( $options ) && ! empty( $options['wpmediacategory_taxonomy'] ) ) {
            $taxonomy = $options['wpmediacategory_taxonomy'];
        }

        return $taxonomy;

    }

    /**
     * Get Select2 value.
     */
    public function get_wpmlc_select2() {

        // Default value
        $select2 = false;

        // Get select2 value from settings page
        $options = get_option( 'wpmlc_settings' );
        if ( ! empty( $options ) && ! empty( $options['select2'] ) ) {
            $select2 = $options['select2'];
        }

        return $select2;

    }

    /**
     * Initialize the settings data.
     *
     * @action admin_init
     */
    public function wpmediacategory_settings_init() {
        register_setting( 'media', 'wpmlc_settings' );

        add_settings_section(
            'wpmlc_section',
            '',
            array( $this, 'wpmlc_settings_section' ),
            'media'
        );

        add_settings_field(
            'wpmlc_settings_field',
            __( 'Custom taxonomy slug', 'wp-media-library-categories' ),
            array( $this, 'wpmlc_settings_field' ),
            'media',
            'wpmlc_section'
        );

        add_settings_field(
            'wpmlc_settings_field2',
            __( 'Autocomplete search dropdown', 'wp-media-library-categories' ),
            array( $this, 'wpmlc_settings_field2' ),
            'media',
            'wpmlc_section'
        );

    }

    /**
     * Render callback for the section description.
     */
    public function wpmlc_settings_section() {
        echo '<div id="wpmlc_settings">';
        echo '<h2 class="title">' . __( 'Media Library Categories', 'wp-media-library-categories' ) . '</h2>';

        $taxonomy_code_override = apply_filters( 'wpmediacategory_taxonomy', 'category' );
        if ( $taxonomy_code_override !== 'category' ) {
            ?>
            <div class="notice notice-warning is-dismissible">
                <p><?php printf( __( 'You are already using a custom taxonomy slug called "<strong>%s</strong>" in the code of your (child) theme. It will be ignored if you use the custom taxonomy slug below.', 'wp-media-library-categories' ), $taxonomy_code_override ); ?></p>
                <button type="button" class="notice-dismiss">
                    <span class="screen-reader-text"><?php _e( 'Dismiss this notice.' ); ?></span>
                </button>
            </div>
            <?php
        }

        echo '<p style="margin-bottom:0">' . sprintf( __( 'Separate the media categories from the default WordPress categories by entering a custom taxonomy slug below (different than "<strong>%s</strong>").', 'wp-media-library-categories' ), 'category' ) . '</p>';
        echo '&nbsp;';
        ?>
        <script>
        document.addEventListener( 'DOMContentLoaded', function() {
            var wpmlc_settings = document.getElementById( 'wpmlc_settings' );
            if ( window.location.hash === '#wpmlc_settings' ) {
                wpmlc_settings.classList.add( 'highlight' );
                wpmlc_settings.nextElementSibling.classList.add( 'highlight' );
            }
            wpmlc_settings.nextElementSibling.style.marginTop = 0;
        } );
        </script>
        </div>
        <?php
    }

    /**
     * Render the field Custom taxonomy slug.
     */
    public function wpmlc_settings_field() {

        // Get taxonomy slug
        $taxonomy = $this->get_wpmlc_taxonomy();

        echo '<input type="text" name="wpmlc_settings[wpmediacategory_taxonomy]" value="' . ( ( $taxonomy === 'category' ) ? '' : $taxonomy ) . '" placeholder="category">';

    }

    /**
     * Render the field Autocomplete search dropdown.
     */
    public function wpmlc_settings_field2() {

        // Get select2 setting
        $select2 = $this->get_wpmlc_select2();

        echo '<label><input type="checkbox" name="wpmlc_settings[select2]" value="1" ' . ( ( $select2 === '1' ) ? ' checked="checked"' : '' ) . '> ' . __( 'Add autocomplete search to the category dropdown in the Media Library.', 'wp-media-library-categories' ) . '</label>';

    }

}
$wpmedialibrarycategories = new wpMediaLibraryCategories();

include_once( 'include/walkers.php' );

register_activation_hook( __FILE__, array( 'wpMediaLibraryCategories', 'plugin_activation' ) );
