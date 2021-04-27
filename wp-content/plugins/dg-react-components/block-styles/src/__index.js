import {InspectorControls,InspectorAdvancedControls} from '@wordpress/block-editor';
import {Button, ButtonGroup, Panel, PanelBody, PanelRow, ToggleControl} from '@wordpress/components';
import {createHigherOrderComponent} from '@wordpress/compose'
import {__} from '@wordpress/i18n';
import {addFilter} from '@wordpress/hooks';
import {Fragment} from '@wordpress/element'




//restrict to specific block names
const allowedBlocks = [ 'core/paragraph', 'core/heading' ];

/**
 * Add custom attribute for mobile visibility.
 *
 * @param {Object} settings Settings for the block.
 *
 * @return {Object} settings Modified settings.
 */
function addAttributes( settings ) {

    //check if object exists for old Gutenberg version compatibility
    //add allowedBlocks restriction
    if( typeof settings.attributes !== 'undefined' && allowedBlocks.includes( settings.name ) ){

        settings.attributes = Object.assign( settings.attributes, {
            visibleOnMobile:{
                type: 'boolean',
                default: true,
            }
        });

    }

    return settings;
}

/**
 * Add mobile visibility controls on Advanced Block Panel.
 *
 * @param {function} BlockEdit Block edit component.
 *
 * @return {function} BlockEdit Modified block edit component.
 */
const withAdvancedControls = createHigherOrderComponent( ( BlockEdit ) => {
    return ( props ) => {

        const {
            name,
            attributes,
            setAttributes,
            isSelected,
        } = props;

        const {
            visibleOnMobile,
        } = attributes;


        return (
            <Fragment>
                <div className={"sebas-div"}>
                <BlockEdit {...props} className={"sebas-classs"}/>
                </div>
                { isSelected && allowedBlocks.includes( name ) &&
                <InspectorAdvancedControls>
                    <ToggleControl
                        label={ __( 'Mobile Devices Visibity' ) }
                        checked={ !! visibleOnMobile }
                        onChange={ () => setAttributes( {  visibleOnMobile: ! visibleOnMobile } ) }
                        help={ !! visibleOnMobile ? __( 'Showing on mobile devices.' ) : __( 'Hidden on mobile devices.' ) }
                    />
                </InspectorAdvancedControls>
                }

            </Fragment>
        );
    };
}, 'withAdvancedControls');

/**
 * Add custom element class in save element.
 *
 * @param {Object} extraProps     Block element.
 * @param {Object} blockType      Blocks object.
 * @param {Object} attributes     Blocks attributes.
 *
 * @return {Object} extraProps Modified block element.
 */
function applyExtraClass( extraProps, blockType, attributes ) {

    const { visibleOnMobile } = attributes;

    //check if attribute exists for old Gutenberg version compatibility
    //add class only when visibleOnMobile = false
    //add allowedBlocks restriction
    if ( typeof visibleOnMobile !== 'undefined' && !visibleOnMobile && allowedBlocks.includes( blockType.name ) ) {
        extraProps.className =  extraProps.className +',' + 'mobile-hidden'
    }

    return extraProps;
}



const withClientIdClassName = createHigherOrderComponent( ( BlockListBlock ) => {
    return ( props ) => {
        const {
            name,
            attributes,
            setAttributes,
            isSelected,
        } = props;
        console.log(name)
        return  <Fragment>
            <div className={"sebas-div"}>
                <BlockListBlock { ...props } className={ "sebas-block-" + props.clientId } />;
            </div>

            <InspectorAdvancedControls>
                <ToggleControl label={ __( 'Mobile Devices Visibity' ) } />
            </InspectorAdvancedControls>


        </Fragment>
    };
}, 'withClientIdClassName' );

//add filters
addFilter( 'editor.BlockListBlock', 'my-plugin/with-client-id-class-name', withClientIdClassName );

addFilter(
    'blocks.registerBlockType',
    'tcdi/custom-attributes',
    addAttributes
);
/*
addFilter(
    'editor.BlockEdit',
    'tcdi/custom-advanced-control',
    withAdvancedControls
);
*/
addFilter(
    'blocks.getSaveContent.extraProps',
    'tcdi/applyExtraClass',
    applyExtraClass
);