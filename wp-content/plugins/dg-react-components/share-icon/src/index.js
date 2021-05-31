import {__} from '@wordpress/i18n';
import {registerBlockType} from '@wordpress/blocks';
import BlockSave from "./BlockSave";
import BlockEdit from "./BlockEdit";

registerBlockType('dg-components/share',
    {
        title: __('Share Button', 'dg-components'),
        icon: 'admin-site-alt',
        category: 'react-blocks',
        apiVersion: 2,
        attributes: {
            icon:{
                type:'String',
                default:""
            }

        }
        ,
        edit: BlockEdit,
        save: BlockSave,
    }
)
;
