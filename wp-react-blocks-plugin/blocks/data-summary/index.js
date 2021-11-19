import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import BlockSave from "./BlockSave";
import BlockEdit from "./BlockEdit";
import Generic from "../icons";

registerBlockType(process.env.BLOCKS_NS + '/data-summary',
  {
    title: __('Data summary'),
    icon: Generic,
    category: process.env.BLOCKS_CATEGORY,
    apiVersion: 2,
    attributes: {
      type: {
        type: 'String',
        default: "heading"
      }


    }
    ,
    edit: BlockEdit,
    save: BlockSave,
  }
)
;
