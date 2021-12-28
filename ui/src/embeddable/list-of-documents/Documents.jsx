import React, {useState} from "react";

const Documents = ({type, showInline, list, loading, error, category}) => {

    // TODO: add more logic for different types of files other than .pdf
    const documents = [];
    if (loading) {
        return <div>Loading...</div>
    }
    if (error) {
        return (<div>ERROR: {error}</div>);
    }
    if (list && list.length > 0) {
        const data = list.filter(i => i.mime_type === 'application/pdf');
        return <ul> {
            data.map(i => {
                return <li key={i.id}>
                    <a href={i.guid.rendered} key={i.id} dangerouslySetInnerHTML={escapeTitle(i.title.rendered)}/>
                </li>;
            })
        }</ul>;
    } else {
        return <div>No Reports</div>
    }

    function escapeTitle(title) {
        return {__html: title}
    }
}

export default Documents;
