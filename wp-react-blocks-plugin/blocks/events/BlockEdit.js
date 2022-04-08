import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
  Panel,
  PanelBody,
  PanelRow,
  DateTimePicker,
  TextControl
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { BaseBlockEdit } from '../commons/index'

class BlockEdit extends BaseBlockEdit {
  render() {
    const {
      className, isSelected,
      toggleSelection, setAttributes, attributes: {
        eventStartDate,
        eventEndDate,
        eventLocation,
        hostedBy,
        link
      }
    } = this.props;

    let queryString = `data-event-location=${eventLocation}&editing=true`;
    queryString += `&data-event-start-date=${eventStartDate}`;
    queryString += `&data-event-end-date=${eventEndDate}`;
    queryString += `&data-event-hosted-by=${hostedBy}`;
    queryString += `&data-event-link=${link}`;
    const divStyles = {};
    return ([isSelected && (<InspectorControls>
        <Panel header={__("Event Configuration")}>
          <PanelBody>
            <PanelRow>
              <label>{__('Event start date')}</label>
            </PanelRow>
            <PanelRow>
              <DateTimePicker
                currentDate={eventStartDate}
                eventStartDate
                onChange={(eventStartDate) => setAttributes({ eventStartDate })}
                is12Hour={true}
              />
            </PanelRow>
            
            <PanelRow>
              <label>{__('Event end date')}</label>
            </PanelRow>
            <PanelRow>
              <DateTimePicker
                  currentDate={eventEndDate}
                  eventEndDate
                  onChange={(eventEndDate) => setAttributes({ eventEndDate })}
                  is12Hour={true}
              />
            </PanelRow>
            
            <PanelRow>
              <TextControl
                label={__('Event location')}
                value={eventLocation}
                onChange={(eventLocation) => setAttributes({ eventLocation })}
              />
            </PanelRow>

            <PanelRow>
              <TextControl
                  label={__('Hosted By')}
                  value={hostedBy}
                  onChange={(hostedBy) => setAttributes({ hostedBy })}
              />
            </PanelRow>

            <PanelRow>
              <TextControl
                  label={__('External Link')}
                  value={link}
                  onChange={(link) => setAttributes({ link })}
              />
            </PanelRow>
          </PanelBody>
        </Panel>
      </InspectorControls>),

        (<div>
            <iframe id={"id_description_iframe"} scrolling={"no"}
                    style={divStyles} src={this.state.react_ui_url + "/en/embeddable/events?" + queryString} />
          </div>

        )]
    );

  }
}


const Edit = (props) => {

  const blockProps = useBlockProps({ className: 'wp-react-component' });
  return <div {...blockProps}><BlockEdit {...props} /></div>;


}
export default Edit;
