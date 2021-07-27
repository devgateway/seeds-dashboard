import {__} from '@wordpress/i18n';
import {registerBlockType} from '@wordpress/blocks';
import BlockSave from "./BlockSave";
import BlockEdit from "./BlockEdit";

registerBlockType(process.env.BLOCKS_NS + '/share',
    {
        title: __('Share Button', 'wp-react-lib-components'),
        icon: Generic,
        category: process.env.BLOCKS_CATEGORY,
        apiVersion: 2,
        attributes: {
            icon:{
                type:'String',
                default:""
            }
        },
        edit: BlockEdit,
        save: BlockSave,
    }
);
