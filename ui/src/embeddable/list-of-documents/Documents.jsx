import React, {useState} from "react";
import {APPLICATION_PDF} from "./Constants";

const Documents = ({type, showInline, list, loading, error, noDataText}) => {

    // TODO: add more logic for different types of files other than .pdf
    if (loading) {
        return <div>Loading...</div>
    }
    if (error) {
        return (<div>ERROR: {error}</div>);
    }
    if (list && list.length > 0) {
        const data = list.filter(i => i.mime_type === APPLICATION_PDF);
        return <ul> {
            data.map(i => {
                return <li key={i.id}>
                    <a href={i.guid.rendered} key={i.id} dangerouslySetInnerHTML={escapeTitle(i.title.rendered)}/>
                </li>;
            })
        }</ul>;
    } else {
        return <div>{noDataText}</div>
    }

    function escapeTitle(title) {
        return {__html: title}
    }
}

export default Documents;
