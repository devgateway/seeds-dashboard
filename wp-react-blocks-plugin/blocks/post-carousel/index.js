import {__} from '@wordpress/i18n';
import {registerBlockType} from '@wordpress/blocks';
import BlockSave from "./BlockSave";
import BlockEdit from "./BlockEdit";
import {Generic} from "../icons";

export const FIELD_ORIENTATION_VERTICAL = 'vertical';
export const FIELD_ORIENTATION_HORIZONTAL = 'horizontal';

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
            height: {
                type: 'number',
                default: 650,
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
            },
            defaultCategory: {
                type: "string",
                default: 'none'
            },
            connectFilter: {
                type: "Boolean",
                default: false
            },
            fieldOrientation: {
                type: "String",
                default: FIELD_ORIENTATION_HORIZONTAL
            },
            navigatorStyle: {
                type: "String",
                default: "dots"
            },
            showLinksInModal: {
                type: 'Boolean',
                default: false
            },
            sortedByCountryAndYearCategories: {
                type: 'Boolean',
                default: false
            },
            preloadDocumentsAndCrops: {
                type: 'Boolean',
                default: false
            }, scheduledFilter: {
                type: 'Boolean',
                default: false
            }, scheduledFilterStore: {
                type: 'String',
                default: 'past'
            },
            isNewImplementation: {
                type: 'Boolean',
                default: false
            }
        },
        edit: BlockEdit,
        save: BlockSave,
    }
)
;
