import React, { useState } from "react";

const Documents = ({ type, showInline, list, loading, error }) => {

    return (<div>type: {type}-inline: {showInline}-list: {list}-loading: {loading}-error: {error}</div>);
}

export default Documents;
