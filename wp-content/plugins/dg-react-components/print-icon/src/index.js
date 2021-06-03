import {__} from '@wordpress/i18n';
import {registerBlockType} from '@wordpress/blocks';
import BlockSave from "./BlockSave";
import BlockEdit from "./BlockEdit";

registerBlockType('dg-components/print',
    {
        title: __('Print Button', 'dg-components'),
        icon: 'admin-site-alt',
        category: 'react-blocks',
        apiVersion: 2,
        attributes: {
            icon:{
                type:'String',
                default:"image"
            },
            downloadName:{
                type:'String',
                default:"tasai_chart"
            },
            size:{
                type:'String',
                default:"large"
            },
            color:{
                type:'String',
                default:"grey"
            },
            htmlId:{
                type:'String',
                default:"exportable.chart"
            }
        }
        ,
        edit: BlockEdit,
        save: BlockSave,
    }
)
;
