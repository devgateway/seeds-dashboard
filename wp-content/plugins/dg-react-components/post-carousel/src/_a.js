
const EditComponent = (props) => {
    const {
        attributes: {
            categories,
            count
        },
    } = props;
    const blockProps = useBlockProps();
    const queryString = `editing=true`;
    const divClass = {}
    const divStyles = {height: '500px',width:'100%'}
    return (
        <div>
            <InspectorControls>
                <Panel header="Block Settings">
                    <PanelRow>
                        <PanelBody>
                            <TextControl
                                value={categories}
                                onChange={(categories) => props.setAttributes({categories})}
                                label={"Categories"}/>
                        </PanelBody>
                    </PanelRow>
                    <PanelRow>
                        <PanelBody>
                            <NumberControl
                                isShiftStepEnabled={true}
                                onChange={(count) => props.setAttributes({count})}
                                shiftStep={10}
                                value={count}
                                label={"Items"}/>
                        </PanelBody>
                    </PanelRow>
                </Panel>
            </InspectorControls>
            <div {...blockProps} >
                <iframe style={{...divStyles}} lassName={divClass} scrolling={"no"}
                        src={process.env.EMBEDDABLE_URI + "/postscarousel?" + queryString}/>


            </div>

        </div>
    );
}