import React, { useState } from 'react';  
import './main.css';  
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';  
import { faMicrophone, faVolumeHigh } from '@fortawesome/free-solid-svg-icons';  
import axios from 'axios';  

const EchoLearnPage = () => {  
    const [selectedOption, setSelectedOption] = useState("Sentence");  

    const handleOptionChange = (event) => {  
        setSelectedOption(event.target.value);  
        console.log(`Selected option: ${event.target.value}`);  
    };  

    const handleMicrophoneClick = async () => {  
        try {  
            const response = await axios.get('https://dummyapi.io/data/api/user'); 
            console.log('Microphone button clicked, API response:', response.data);  
        } catch (error) {  
            console.error('Error fetching data from API:', error);  
        }  
    };  

    const handleSoundClick = async () => {  
        try {  
            const response = await axios.get('https://dummyapi.io/data/api/user'); 
            console.log('Play sentence sound, API response:', response.data);  
        } catch (error) {  
            console.error('Error fetching data from API:', error);  
        }  
    };  

    return (  
        <div className="page-container">  
            <div className="content-container">  
                <div className="header-section">  
                    <span className="pronunciation-level">PRONUNCIATION LEVEL</span>  

                    <select className="dropdown" value={selectedOption} onChange={handleOptionChange}>  
                        <option value="Word">Word</option>  
                        <option value="Sentence">Sentence</option>  
                        <option value="Speaking">Speaking</option>  
                    </select>  
                </div>  

                <p className="instruction-text">  
                    Say the following {selectedOption.toLowerCase()} to get feedback on your pronunciation  
                    <button className="sound-button" onClick={handleSoundClick}>  
                        <FontAwesomeIcon icon={faVolumeHigh} />  
                    </button>  
                </p>  
                <div className="sentence-container">  
                    <p className="sentence">  
                        {selectedOption === "Sentence"   
                            ? "Knowing a second language significantly increases opportunity for a variety of jobs."  
                            : selectedOption === "Word"  
                            ? "Language"  
                            : "Practice speaking to improve fluency."}  
                    </p>  
                </div>  

                <div className="speak-button-container">  
                    <button className="speak-button" onClick={handleMicrophoneClick}>  
                        <FontAwesomeIcon icon={faMicrophone} />  
                    </button>  
                </div>  

                <p className="mic-instruction">Click the mic to speak</p>  
            </div>  
        </div>  
    );  
};  

export default EchoLearnPage;