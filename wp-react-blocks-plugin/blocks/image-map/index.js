import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import BlockSave from "./BlockSave";
import BlockEdit from "./BlockEdit";
import Generic from "../icons";

registerBlockType(process.env.BLOCKS_NS + '/image-map',
  {
    title: __('Image Map'),
    icon: Generic,
    category: process.env.BLOCKS_CATEGORY,
    apiVersion: 2,
    attributes: {
      height: {
        type: 'number',
        default: 327
      },
      width: {
        type: 'number',
        default: 286
      }, selectedFilterStore: {
        type: "String",
        default: undefined
      },
      valuesFilterStore: {
        type: "String",
        default: undefined
      }, connectFilter: {
        type: "Boolean",
        default: false
      }
    }
    ,
    edit: BlockEdit,
    save: BlockSave,
  }
)
;
