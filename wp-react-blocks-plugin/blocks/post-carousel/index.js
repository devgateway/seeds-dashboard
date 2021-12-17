import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import BlockSave from "./BlockSave";
import BlockEdit from "./BlockEdit";
import { Generic } from "../icons";


registerBlockType(process.env.BLOCKS_NS + '/post-carousel',
  {
    title: __('Posts Carousel'),
    icon: Generic,
    category: process.env.BLOCKS_CATEGORY,
    attributes: {
      count: {
        type: 'number',
        default: 3,
      },
      itemsPerPage: {
        type: 'number',
        default: 1,
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
      },
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
      },
      fieldOrientation: {
        type: "String",
        default: "horizontal"
      }


    }
    ,
    edit: BlockEdit,
    save: BlockSave,
  }
)
;
