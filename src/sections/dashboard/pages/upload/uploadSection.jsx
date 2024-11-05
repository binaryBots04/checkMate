import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Lottie from 'react-lottie';
import { useAuth0 } from '@auth0/auth0-react';

import chimeSound from '../../../../assets/sound/chime.mp3';
import errorSound from '../../../../assets/sound/error.mp3'
import animationData from '../../../../assets/animations/enlargingCircle_Loader.json';
import tickAnimation from '../../../../assets/animations/tickAnimation.json';
import errorAnimation from '../../../../assets/animations/Error_Animation.json';
import '../../dashboardStyles.css';

const UploadSection = ({ closePopup }) => {
    const [file, setFile] = useState(null);
    const [docType, setDocType] = useState('');
    const [loading, setLoading] = useState(false);
    const [ipfsHash, setIpfsHash] = useState(null);
    const [verifyStatus, setVerifyStatus] = useState(false);

    const [newHash, setNewHash] = useState(null);
    const [error, setError] = useState(false);


    const { user } = useAuth0();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleRemoveFile = () => {
        setFile(null);
        setDocType('');
        setIpfsHash(null);
        setVerifyStatus(false);
        setError(false);
        setNewHash(null);
    };

    const handleTypeChange = (e) => {
        setDocType(e.target.value);
    };

    const handleUpload = async () => {
        if (file && docType) {
            await handleStoreDocument();
        } else {
            alert('Please select a file and document type.');
        }
    };

    const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
    const PINATA_SECRET_API_KEY = import.meta.env.VITE_PINATA_SECRET_KEY;

    const handleStoreDocument = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
        
            const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
            const headers = {
                pinata_api_key: PINATA_API_KEY,
                pinata_secret_api_key: PINATA_SECRET_API_KEY,
                "Content-Type": "multipart/form-data",
            };
        
            const response = await axios.post(url, formData, { headers });
            const hash = response.data.IpfsHash;
            setIpfsHash(hash);
            
        
        // Prepare data to send to your backend
        const backendData = JSON.stringify({
            ipfs_link: hash
        });

        const config = {
            method: 'post',
            url: `http://127.0.0.1:5000/c/${user.sub}`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: backendData
        };
        

        // Send IPFS hash and document type to backend
        const backendResponse = await axios.request(config);
        const backendResponseData = backendResponse.data;

        console.log(JSON.stringify(backendResponseData));
        console.log(backendResponseData);
        console.log(docType);

        if(backendResponseData["predicted_document_type"] == docType){
            console.log("Classification of Document Completed");

            // Call to the second backend route if classification is successful
            const secondConfig = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'http://127.0.0.1:5000/p',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({ ipfs_link: hash })
            };

            const secondResponse = await axios.request(secondConfig);
            const secondResponseData = secondResponse.data;
            console.log(JSON.stringify(secondResponseData));

            if(secondResponseData["Match Result"]==1){
                console.log("Data Set Matched Successfully");

                // Additional request if dataset matched
                let additionalData = JSON.stringify({
                    "ipfs_link": hash // Use the same IPFS hash
                });

                let additionalConfig = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'http://127.0.0.1:5000/o',
                    headers: { 
                        'Content-Type': 'application/json'
                    },
                    data: additionalData
                };

                // Send additional request using await
                const additionalResponse = await axios.request(additionalConfig);
                const verifiedHash = additionalResponse.data;
                setNewHash(verifiedHash.ipfs_hash);

                console.log(verifiedHash);
                setLoading(false);
                setVerifyStatus(true);
                playChimeSound();
            } else {
                console.log("Data Set Matching Failed!");
                setError(true);
                playErrorSound();
            }

        } else {
            console.log("Classification of Document Failed!");
            setError(true);
            playErrorSound();
        }

        
        } catch (error) {
            console.error("Error uploading document to Pinata:", error.response ? error.response.data : error.message);
        } finally {
            setLoading(false);
        }
    };

    const playChimeSound = () => {
        const audio = new Audio(chimeSound);
        audio.play();
    };

    const playErrorSound = () => {
        const audio = new Audio(errorSound);
        audio.play();
    };

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };
    
    return (
        <>
            <div className="flex flex-col items-center justify-center w-full min-h-screen">
                <div className="w-[600px] bg-gray-950 bg-opacity-90 backdrop-blur-md shadow-lg rounded-lg glass-card p-12">
                    <h1 className="text-3xl font-bold text-white mb-6 text-center font-albulaMedium">Document Upload</h1>

                    <div className="border-2 border-dashed border-gray-500 rounded-lg p-6 bg-gray-700 bg-opacity-30 mb-6">
                        {!file ? (
                            <div className="flex flex-col items-center justify-center cursor-pointer h-full">
                                <label htmlFor="file-upload" className="cursor-pointer">
                                    <div className="flex flex-col items-center justify-center">
                                        <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 01-4 4h16a4 4 0 004-4V8a4 4 0 00-4-4H7m7 12l5-5m0 0l-5-5m5 5H8" />
                                        </svg>
                                        <p className="mt-2 text-gray-300">Click to Upload File</p>
                                    </div>
                                    <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
                                </label>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-300">{file.name}</p>
                                <button className="p-2 text-gray-400 bg-gray-600 bg-opacity-30 rounded-full hover:bg-gray-700" onClick={handleRemoveFile} >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>

                    <select value={docType} onChange={handleTypeChange} className="block w-full p-3 mb-6 border border-gray-500 rounded-md bg-gray-600 text-white focus:ring focus:ring-purple-500" disabled={!file}>
                        <option value="">Select Document Type</option>
                        <option value="aadhar">Aadhar Card</option>
                        <option value="admit">Admit Card</option>
                        <option value="pan">PAN Card</option>
                        <option value="result">Result</option>
                        <option value="other">Other</option>
                    </select>

                    <button onClick={handleUpload} className="w-full bg-purple-700 text-white py-3 rounded-md hover:bg-purple-800 transition-colors" disabled={!file || !docType} >
                        Next
                    </button>


                    {loading ? (
                        <div className="mt-6 flex justify-center">
                            <Lottie options={defaultOptions} height={150} width={150} />
                        </div>
                    ) : error ? (
                        <div className="mt-6 flex justify-center">
                            <Lottie options={{ loop: false, autoplay: true, animationData: errorAnimation, rendererSettings: { preserveAspectRatio: 'xMidYMid slice' } }} height={150} width={150} />
                        </div>
                    ) : verifyStatus ? (
                        <div className="mt-6 flex justify-center">
                            <Lottie options={{ loop: false, autoplay: true, animationData: tickAnimation, rendererSettings: { preserveAspectRatio: 'xMidYMid slice' } }} height={150} width={150} />
                        </div>
                    ) : null}

                    {error}

                                
                    {newHash && (
                        <div className="mt-6 p-4 bg-gray-700 bg-opacity-40 rounded-lg flex justify-center">
                            <a href={`https://gateway.pinata.cloud/ipfs/${newHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Link to IPFS</a>
                        </div>
                    )}
                    
                    <div className='flex flex-row justify-center items-center'>
                        <button onClick={closePopup} className="mt-4 inline-flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition">Close</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UploadSection;