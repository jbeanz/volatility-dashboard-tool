import React from 'react';
import './side-panel-styles.css'

const SidePanel = (handleGenerate) => {
    return (
        <div className="container">
            <h2 className="header">Search Token</h2>
            <div className="input-group">
                <label htmlFor="input1">Token Address:</label>
                <input type="text" id="input1" placeholder="Enter text..." />
            </div>
            <div className="input-group">
                <label htmlFor="input2">Twitter Url:</label>
                <input type="text" id="input2" placeholder="Enter text..." />
            </div>
            <div className="input-group">
                <label htmlFor="input3">Discord Id:</label>
                <input type="text" id="input3" placeholder="Enter text..." />
            </div>
            <button className="generate-button" onClick={handleGenerate}>Generate</button>
        </div>
    );
};

export default SidePanel;
