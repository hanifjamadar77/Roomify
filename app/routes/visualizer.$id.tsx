import React from 'react';
import {useLocation, useParams} from "react-router";

function VisualizerId() {
    // const {id} = useParams();
    const location = useLocation();
    const {initialImage, name} = location.state || {};

    return (
        <section>
            <h1>{name || 'Untitled Project'}</h1>

            <div className={"visualizer"}>
                {initialImage && (
                    <div className={"image-container"}>
                        <h2>Source image</h2>
                        <img src={initialImage} alt="Source image" />
                    </div>
                )}
            </div>
        </section>
    );
}

export default VisualizerId;
