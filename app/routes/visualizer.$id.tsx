import React from 'react';
import {useLocation, useParams} from "react-router";

function VisualizerId() {
    const {id} = useParams();
    const location = useLocation();
    const image = (location.state as {image?: string} | null)?.image;

    return (
        <div className="visualizer-route">
            {image ? (
                <img src={image} alt={`Uploaded floor plan ${id ?? ""}`} />
            ) : (
                <div>Visualizer</div>
            )}
        </div>
    );
}

export default VisualizerId;
