import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import BlockSave from "./BlockSave";
import BlockEdit from "./BlockEdit";
import { Generic } from "../icons";


registerBlockType(process.env.BLOCKS_NS + '/inner-page',
  {
    title: __('Inner page'),
    icon: Generic,
    category: process.env.BLOCKS_CATEGORY,
    attributes: {
      defaultPage: {
        type: 'string',
        default: "burkina-faso",
      },
      height: { type: "number", default: 650 },
      selectedFilterStore: {
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
