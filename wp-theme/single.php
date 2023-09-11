<?php
$preview = $_GET['$preview'];
global $post;


  session_start();

$POST_URL=  str_replace(get_site_url(),"",get_permalink($post));

if ( str_starts_with($POST_URL,"/".wpm_get_language())){
    $POST_URL= str_replace("/".wpm_get_language(), "", $POST_URL);
}


if ( is_preview() ) {
        wp_redirect(get_option( 'react_ui_url' )."/".wpm_get_language()."/preview/".get_post_type($post)."/". $post->ID."?_wpnonce="."".wp_create_nonce( "wp_rest")."&preview="."".$_GET["preview"]);
 }else{
        wp_redirect(get_option( 'react_ui_url' )."/".wpm_get_language().$POST_URL);
}

?>
