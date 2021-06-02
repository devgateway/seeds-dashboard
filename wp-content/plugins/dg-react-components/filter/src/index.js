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
                default:"Filter by ..."
            },
            type:{
                type:'String',
                default:"Crop"
            },
            filter:{
                type:'String',
                default:"None"
            },
            param:{
                type:'String',
                default:"Maize"
            },
            multi:{
                type:'String',
                default:"single"
            }


        }
        ,
        edit: BlockEdit,
        save: BlockSave,
    }
)
;
