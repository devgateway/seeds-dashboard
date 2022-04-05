import {__} from '@wordpress/i18n';
import {registerBlockType} from '@wordpress/blocks';
import BlockSave from "./BlockSave";
import BlockEdit from "./BlockEdit";
import Generic from "../icons";

registerBlockType(process.env.BLOCKS_NS + '/events', {
    title: __('Event Viewer'), icon: Generic, category: process.env.BLOCKS_CATEGORY, apiVersion: 2, attributes: {
        eventLocation: {
            type: 'String',
        }, eventStartDate: {
            type: 'String'
        }, eventEndDate: {
            type: 'String'
        }
    }, edit: BlockEdit, save: BlockSave,
});
