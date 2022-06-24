import React from 'react'
import './HeroSection.css'
import { useState } from 'react'
import Graphs from './Graphs'
import Bargraph from './Bargraph'
import Bubblecharts from './Bubblecharts'
import Button from './Buttons/Button'


const HeroSection = () => {
    const [selectedFile, setSelectedFile] = useState();
    const [isFilePicked, setIsFilePicked] = useState(false);

    const changeHandler = (event) => {
        setSelectedFile(event.target.files[0]);
        setIsFilePicked(true);
    };


    return (
        <div className="hero-container">
            <h1>Sentiment Analysis</h1>
            <p>Get detailed insights about what your customers say about your product.</p>
            <p>Upload a .csv or .txt file with the reviews to get started.</p>
            <div className='upload-container'>
                <input
                    type="file"
                    className='upload-box'
                    id="uploadfile"
                    accept=".csv"
                    onChange={changeHandler}
                />
                <div className='hero-btn'>
                    <Button>GetStarted</Button>
                    {/* <Button className='btns' buttonStyle='btn--outline'>Get Started</Button> */}
                </div>
                <h2>Overall Sentiment of reviews</h2>
                <Bargraph />
                <h2>Sentiment wise assessment of targets</h2>
                <Bubblecharts />
            </div>


        </div>
    )
}

export default HeroSection