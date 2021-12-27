import React, {useState} from "react";

const Documents = ({type, showInline, list, loading, error}) => {

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
        console.log(data);
        return data.map(i => {
            return <a href={i.guid.rendered} key={i.id}>{i.title.rendered}</a>;
        });
    } else {
        return null;
    }
}

export default Documents;
