import React, { useEffect, useState } from "react";
import { Button, Container, Icon } from "semantic-ui-react";
import './backToTop.scss';
import {injectIntl} from "react-intl";


const BackToTop = ({ 'data-behavior': behavior = 'smooth', 'data-label': label = 'Back To The Top', editing, intl }) => {
    const isEditing = editing === 'true'
    const [visible, setVisible] = useState(false)
    const toggleVisible = () => {
        const scrolled = document.documentElement.scrollTop;
        if (scrolled > 300) {
            setVisible(true)
        } else if (scrolled <= 300) {
            setVisible(false)
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0, behavior: behavior
        });
    };
    useEffect(() => {
        window.addEventListener('scroll', toggleVisible);
        return () => {
            window.removeEventListener('scroll', toggleVisible);
        }
    }, [])
    const lnLabel = intl.formatMessage({id: label});
    if (isEditing) {
        return <Container fluid={true} className={'styles reports'}>
            <span>Place holder for back to bottom component with label: <b>{label}</b></span>
        </Container>
    } else {
        return (<div className="sticky-bottom">
            <Button onClick={scrollToTop} style={{ display: visible ? 'inline' : 'none' }}> <Icon
                name='chevron circle up' />{lnLabel}</Button>
        </div>);
    }
}

export default injectIntl(BackToTop);
