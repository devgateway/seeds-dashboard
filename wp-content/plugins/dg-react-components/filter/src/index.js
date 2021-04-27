import {__} from '@wordpress/i18n';
import {registerBlockType} from '@wordpress/blocks';
import BlockSave from "./BlockSave";
import BlockEdit from "./BlockEdit";

registerBlockType('dg-components/filter',
    {
        title: __('Data Filter', 'dg-components'),
        icon: 'admin-site-alt',
        category: 'react-blocks',
        apiVersion: 2,
        attributes: {
            placeHolder:{
                type:'String',
                default:"Age Group"
            },
            type:{
                type:'String',
                default:"AgeGroup"
            },
            param:{
                type:'String',
                default:"age"
            }


        }
        ,
        edit: BlockEdit,
        save: BlockSave,
    }
)
;
