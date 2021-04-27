import {__} from '@wordpress/i18n';
import {registerBlockType} from '@wordpress/blocks';
import BlockSave from "./BlockSave";
import BlockEdit from "./BlockEdit";


registerBlockType('dg-components/tabbed-posts',
    {
        title: __('Tabbed Posts', 'dg-components'),
        icon: 'admin-site-alt',
        category: 'react-blocks',
        attributes: {
            count: {
                type: 'number',
                default: 3,
            },
            type: {
                type: 'string',
                default: "posts",
            },
            taxonomy: {
                type: 'string',
                default: "none",
            },
            categories: {
                type: 'array',
                default: [],
            }


        }
        ,
        edit: BlockEdit,
        save: BlockSave,
    }
)
;
