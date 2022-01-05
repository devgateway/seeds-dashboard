import React from "react";

const Crops = ({data}) => {
    return (
        data.map(c => {
            const class_ = "crop " + c.toLowerCase();
            return (<div key={c} className={class_} style={{height: '50px', width: '25%', float: 'left'}}>
                <label style={{float: 'left', marginTop: '13px'}}>{c}</label>
            </div>)
        })
    )
}

export default Crops
