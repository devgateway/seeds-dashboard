import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import BlockSave from "./BlockSave";
import BlockEdit from "./BlockEdit";
import Generic from "../icons";

registerBlockType(process.env.BLOCKS_NS + '/filter',
  {
    title: __('Data Filter'),
    icon: Generic,
    category: process.env.BLOCKS_CATEGORY,
    apiVersion: 2,
    attributes: {
      type: {
        type: 'String',
        default: "Country"
      }


    }
    ,
    edit: BlockEdit,
    save: BlockSave,
  }
)
;
