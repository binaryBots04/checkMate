import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Lottie from 'react-lottie';
import axios from 'axios';

import UploadIcon from '../../../../assets/icons/uploadIcon.png';
import chimeSound from '../../../../assets/sound/chime.mp3';
import errorSound from '../../../../assets/sound/error.mp3'
import animationData from '../../../../assets/animations/enlargingCircle_Loader.json';
import tickAnimation from '../../../../assets/animations/tickAnimation.json';
import errorAnimation from '../../../../assets/animations/Error_Animation.json';

function Profile() {
    const { user, isAuthenticated } = useAuth0();
    const [file, setFile] = useState(null);
    const [docType, setDocType] = useState('');
    const [loading, setLoading] = useState(false);
    const [ipfsHash, setIpfsHash] = useState(null);
    const [verifyStatus, setVerifyStatus] = useState(false);
    
    const [currentStage, setCurrentStage] = useState(0);

    const [newHash, setNewHash] = useState(null);
    const [error, setError] = useState(false);


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
        setCurrentStage(0);
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

            setCurrentStage(1);
        
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

                setCurrentStage(2);

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
                    setCurrentStage(3);

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
                    setCurrentStage(4);
                    setLoading(false);
                    setVerifyStatus(true);
                    playChimeSound();
                } else {
                    console.log("Data Set Matching Failed!");
                    setError(true);
                    playErrorSound();
                    setCurrentStage(3);
                }

            } else {
                console.log("Classification of Document Failed!");
                setError(true);
                playErrorSound();
                setCurrentStage(2);
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

    const [showAnimation, setShowAnimation] = useState(false);

    useEffect(() => {
        if (loading || error || verifyStatus) {
            setShowAnimation(true);

            const timeout = setTimeout(() => {
                setShowAnimation(false);
            }, 5000);

            return () => clearTimeout(timeout);
        }
    }, [loading, error, verifyStatus]);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    return (
        isAuthenticated && (
            <main className="fixed w-[calc(100vw-450px)] h-screen bg-[#0F0D13ff] rounded-tl-[40px] rounded-bl-[40px] p-7 font-albulaRegular transition-all duration-300">
                <div className="flex flex-row bg-white text-gray-900 rounded-[40px] h-full border-gray-400 shadow-lg">
                    <div className="w-2/3 bg-gray-50 p-20 shadow-inner rounded-l-[40px]">
                        <h1 className="font-albulaHeavy text-3xl text-slate-800 mb-6">Upload Documents</h1>
                        
                        <p className="text-sm text-gray-600 mb-4 mt-16">
                            The document upload process in Check Mate is designed to be <span className="text-violet-600 font-semibold">secure</span>, 
                            <span className="text-violet-600 font-semibold">efficient</span>, and <span className="text-violet-600 font-semibold">user-friendly</span>. 
                            Here’s a breakdown of each step:
                        </p>

                        <div className="text-sm text-gray-700 mb-6 space-y-4">
                            <div className="flex items-start">
                                <span className="bg-violet-100 text-violet-600 p-2 rounded-full font-bold mr-3">1</span>
                                <p>
                                    <strong className="text-violet-600">User Uploads the Document:</strong> The user selects a file to upload 
                                    and specifies its type, like <span className="text-violet-600 font-semibold">Aadhaar card</span>, 
                                    <span className="text-violet-600 font-semibold">PAN card</span>, or <span className="text-violet-600 font-semibold">admit card</span>. 
                                    This helps ensure accurate <span className="text-violet-600 font-semibold">categorization</span> for later processing.
                                </p>
                            </div>

                            <div className="flex items-start">
                                <span className="bg-violet-100 text-violet-600 p-2 rounded-full font-bold mr-3">2</span>
                                <p>
                                    <strong className="text-violet-600">File Preprocessing and Initial Validation:</strong> Check Mate checks the 
                                    <span className="text-violet-600 font-semibold">file format</span> and <span className="text-violet-600 font-semibold">size</span> 
                                    to ensure compatibility. This step reduces errors and ensures the document meets platform requirements.
                                </p>
                            </div>

                            <div className="flex items-start">
                                <span className="bg-violet-100 text-violet-600 p-2 rounded-full font-bold mr-3">3</span>
                                <p>
                                    <strong className="text-violet-600">Secure Transfer to IPFS via Pinata:</strong> The file is uploaded to 
                                    <span className="text-violet-600 font-semibold">IPFS</span> through <span className="text-violet-600 font-semibold">Pinata</span> 
                                    for <span className="text-violet-600 font-semibold">decentralized</span> and <span className="text-violet-600 font-semibold">tamper-proof storage</span>. 
                                    Pinata generates a unique <span className="text-violet-600 font-semibold">IPFS hash</span>, which serves as the file's 
                                    digital fingerprint.
                                </p>
                            </div>

                            <div className="flex items-start">
                                <span className="bg-violet-100 text-violet-600 p-2 rounded-full font-bold mr-3">4</span>
                                <p>
                                    <strong className="text-violet-600">Storing Metadata in Check Mate’s Database:</strong> Check Mate saves the 
                                    <span className="text-violet-600 font-semibold">IPFS hash</span>, document type, and upload date. This enables 
                                    easy retrieval and efficient document management.
                                </p>
                            </div>

                            <div className="flex items-start">
                                <span className="bg-violet-100 text-violet-600 p-2 rounded-full font-bold mr-3">5</span>
                                <p>
                                    <strong className="text-violet-600">Displaying Uploaded Documents:</strong> Uploaded documents appear in the user’s 
                                    dashboard with details like the document type, upload date, verification status, and a link to view the file on 
                                    <span className="text-violet-600 font-semibold">IPFS</span>.
                                </p>
                            </div>
                        </div>

                        <p className="text-sm text-gray-700">
                            This process ensures that each document uploaded to Check Mate is stored in a <span className="text-violet-600 font-semibold">secure</span>, 
                            <span className="text-violet-600 font-semibold">decentralized</span> manner and is easily accessible, upholding high standards 
                            for <span className="text-violet-600 font-semibold">data security</span> and <span className="text-violet-600 font-semibold">user experience</span>.
                        </p>
                    </div>

                    <div className="flex flex-col items-center justify-between w-2/3 bg-gradient-to-b from-violet-200 to-violet-300 rounded-r-[40px] py-36 shadow-inner">
                        <div className="w-full h-full bg-opacity-90 backdrop-blur-md  rounded-lg p-12 flex flex-col justify-center items-center">
                            <h1 className="text-3xl font-bold text-slate-800 mb-16 text-center font-albulaMedium">Uploading Section</h1>

                            <div className="relative w-full">
                            <div>
                                        <div className="border-2 border-dashed border-gray-500 rounded-lg p-6 bg-gray-700 bg-opacity-30 mb-6 w-full h-[150px] transform transition-all duration-300 ease-in-out flex flex-col justify-center hover:drop-shadow-2xl">
                                            {!file ? (
                                                <div className="flex flex-col items-center justify-center cursor-pointer h-full">
                                                    <label htmlFor="file-upload" className="cursor-pointer">
                                                        <div className="flex flex-col items-center justify-center">
                                                            <img src={UploadIcon} alt="Upload Icon" className="w-[40px] h-[40px]"/>
                                                            <p className="mt-5 text-white">Click to Upload File</p>
                                                        </div>
                                                        <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} />
                                                    </label>
                                                </div>
                                            ) : (
                                                <div className="flex flex-row items-center justify-between">
                                                    <p className="text-sm text-white">{file.name}</p>
                                                    <button className="p-2 text-gray-400 bg-gray-700 rounded-full hover:bg-orange-600 transition-all duration-200" onClick={handleRemoveFile}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="white">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        <select value={docType} onChange={handleTypeChange} className="block w-full p-3 mb-6 border border-gray-500 rounded-md bg-gray-600 text-white focus:ring focus:ring-purple-500" disabled={!file}>
                                            <option value="">Select Document Type</option>
                                            <option value="admit">Admit Card</option>
                                            <option value="result">Result</option>
                                            <option value="other">Other</option>
                                        </select>

                                        {loading ? (
                                            <div className="mt-6 flex justify-center">
                                                <Lottie options={defaultOptions} height={150} width={150} />
                                            </div>
                                        ) : error ? (
                                            <div className="mt-6 flex justify-center">
                                                {showAnimation ? 
                                                    <Lottie options={{ loop: false, autoplay: true, animationData: errorAnimation, rendererSettings: { preserveAspectRatio: 'xMidYMid slice' } }} height={80} width={80} />
                                                : 
                                                    <button onClick={handleUpload} className="w-full bg-purple-700 text-white py-3 rounded-md hover:bg-purple-800 transition-colors" disabled={!file || !docType}> Next </button>
                                                }
                                            </div>
                                        ) : verifyStatus ? (
                                            <div className="mt-6 flex justify-center">
                                                {showAnimation ? 
                                                    <Lottie options={{ loop: false, autoplay: true, animationData: tickAnimation, rendererSettings: { preserveAspectRatio: 'xMidYMid slice' } }} height={150} width={150} />
                                                : <button onClick={handleUpload} className="w-full bg-purple-700 text-white py-3 rounded-md hover:bg-purple-800 transition-colors" disabled={!file || !docType}> Next </button>
                                                }
                                            </div>
                                    ) : 
                                        <button onClick={handleUpload} className="w-full bg-purple-700 text-white py-3 rounded-md hover:bg-purple-800 transition-colors" disabled={!file || !docType}> Next </button>
                                    }

                                    </div>
                            </div>


                            <div className="mt-6 flex flex-col items-center">
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                                    <div className={`h-2.5 rounded-full transition-all duration-500 ${error ? 'bg-orange-500' : 'bg-green-600'}`}
                                        style={{
                                            width: `${currentStage * 25}%`
                                        }}
                                    ></div>
                                </div>

                                <div className="flex justify-between w-full text-sm font-semibold text-gray-600">
                                    <div className={`text-center ${currentStage >= 1 ? (error ? 'text-orange-800' : 'text-green-600') : ''}`}>
                                        <span className="block">1. Document Upload</span>
                                    </div>
                                    <div className={`text-center ${currentStage >= 2 ? (error ? 'text-orange-800' : 'text-green-600') : ''}`}>
                                        <span className="block">2. Document Classification</span>
                                    </div>
                                    <div className={`text-center ${currentStage >= 3 ? (error ? 'text-orange-800' : 'text-green-600') : ''}`}>
                                        <span className="block">3. Data Set Matching</span>
                                    </div>
                                    <div className={`text-center ${currentStage >= 4 ? (error ? 'text-orange-800' : 'text-green-600') : ''}`}>
                                        <span className="block">4. Storing to IPFS</span>
                                    </div>
                                </div>
                            </div>

                            {error}
                        </div>
                    </div>
                </div>
            </main>
        )
    );
}

export default Profile;