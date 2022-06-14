import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import BlockSave from "./BlockSave";
import BlockEdit from "./BlockEdit";
import Generic from "../icons";

registerBlockType(process.env.BLOCKS_NS + '/viewportMessage',
  {
    title: __('Viewport Message'),
    icon: Generic,
    category: process.env.BLOCKS_CATEGORY,
    apiVersion: 2,
    attributes: {
      viewportMessage: {
        type: 'String',
        default: 'The site is not optimized for smaller screens; please view one a larger screen (tablet or larger)'
      },
      viewportHeight: {
        type: 'number',
        default: 600
      },
      viewportWidth: {
        type: 'number',
        default: 800
      }
    },
    edit: BlockEdit,
    save: BlockSave,
  }
);
