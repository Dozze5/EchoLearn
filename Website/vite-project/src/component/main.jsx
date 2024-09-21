import React, { useState, useEffect } from "react";
import './main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const EchoLearnPage = () => {
    const [selectedOption, setSelectedOption] = useState("Sentence");
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioBlob, setAudioBlob] = useState(null);
    const [mediaStream, setMediaStream] = useState(null);

    useEffect(() => {
        const getMicrophoneAccess = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                setMediaStream(stream);
                const recorder = new MediaRecorder(stream);
                setMediaRecorder(recorder);
            } catch (error) {
                console.error("Error accessing microphone:", error);
            }
        };

        getMicrophoneAccess();
    }, []);

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
        console.log(`Selected option: ${event.target.value}`);
    };

    const handleMicrophoneClick = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const startRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.start();
            setIsRecording(true);
            console.log('Recording started');

            let audioChunks = [];
            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                setAudioBlob(audioBlob);
                console.log('Recording complete');
            };
        }
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setIsRecording(false);
            console.log('Recording stopped');
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

    const saveRecording = async () => {
        if (audioBlob) {
            const formData = new FormData();
            formData.append('audio', audioBlob, 'audio.wav');

            try {
                const response = await axios.post('http://localhost:5000/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                console.log('Audio uploaded, server response:', response.data);
            } catch (error) {
                console.error('Error uploading audio:', error);
            }
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
                        {isRecording ? ' Stop' : ' Start'}
                    </button>
                </div>

                {audioBlob && (
                    <div>
                        <audio controls src={URL.createObjectURL(audioBlob)}></audio>
                        <button className="save-button" onClick={saveRecording}>
                            Save Recording
                        </button>
                    </div>
                )}

                <p className="mic-instruction">Click the mic to {isRecording ? 'stop recording' : 'start recording'}</p>
            </div>
        </div>
    );
};

export default EchoLearnPage;
