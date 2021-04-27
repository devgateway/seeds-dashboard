( function( wp ) {


    var MyCustomButton = function( props ) {
        return wp.element.createElement(
            wp.editor.RichTextToolbarButton, {
                icon: 'editor-code',
                title: 'Sample output',
                onClick: function() {
                    console.log( 'toggle format' );
                },
            }
        );
    }
    wp.richText.registerFormatType(
        'my-custom-format/sample-output', {
            title: 'Sample output',
            tagName: 'samp',
            className: null,
            edit: MyCustomButton,
        }
    );
} )( window.wp );