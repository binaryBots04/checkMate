import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

import axios from 'axios';
import Lottie from "lottie-react";

import UploadSection from '../upload/uploadSection';
import UploadIcon from '../../../../assets/animations/upload.json';

function AnalysisSection() {
    const { user } = useAuth0();
    const [showActions, setShowActions] = useState(Array(4).fill(false));
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isUploadPopupOpen, setUploadPopupOpen] = useState(false);

    const verifiedCount = documents.filter(doc => doc.verify_flag).length;
    const unverifiedCount = documents.length - verifiedCount;
    const verificationRatio = unverifiedCount + verifiedCount > 0  ? (verifiedCount / (verifiedCount + unverifiedCount) * 100).toFixed(2) : 0;

    useEffect(() => {
        const fetchDocuments = async () => {
            if (!user?.sub) {
                setError('User ID is not available.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`http://127.0.0.1:5000/c/${user.sub}`);
                console.log("Response Data:", response.data);
                setDocuments(response.data);
            } catch (err) {
                console.error("Error fetching documents:", err);
                setError('Failed to fetch documents: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, [user.sub]);

    const toggleActions = (index) => {
        const updatedShowActions = [...showActions];
        updatedShowActions[index] = !updatedShowActions[index];
        setShowActions(updatedShowActions);
    };

    const openUploadPopup = () => {
        setUploadPopupOpen(true);
    };

    const closeUploadPopup = () => {
        setUploadPopupOpen(false);
    };

    if (loading) return <p>Loading documents...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="flex flex-col items-center justify-start w-full h-full bg-slate-950">
            {isUploadPopupOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md">
                    <div className="w-screen h-screen rounded-lg shadow-lg p-6">
                        <UploadSection closePopup={closeUploadPopup} />
                    </div>
                </div>
            )}

            <div id='walletNavbar' className='w-full h-[100px] flex flex-row justify-between items-center font-albulaRegular backdrop-blur-md bg-slate-900 shadow-lg p-10'>
                <span className='text-3xl font-albulaBold text-white'>Welcome {user.given_name} {user.family_name}</span>
                <NavLink to="/dashboard/profile" id='md_imgHolder'>
                    <img src={user.picture} alt="User Icon" className='md_userIcon rounded-full h-[70%] w-[70%]' />
                </NavLink>
            </div>

            <main className="flex flex-col items-center w-full p-8 font-albulaMedium min-h-screen backdrop-blur-xl">
                <div className="w-full grid grid-cols-4 gap-4 pb-8">
                    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-2xl p-6 border border-slate-700">
                        <h3 className="text-lg font-bold text-gray-100 font-albulaMedium">Verified Documents</h3>
                        <p className="text-2xl font-bold text-blue-500">{verifiedCount}</p>
                    </div>
                    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-2xl p-6 border border-slate-700">
                        <h3 className="text-lg font-bold text-gray-100 font-albulaMedium">Unverified Documents</h3>
                        <p className="text-2xl font-bold text-yellow-500">{unverifiedCount}</p>
                    </div>
                    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-2xl p-6 border border-slate-700">
                        <h3 className="text-lg font-bold text-gray-100 font-albulaMedium">Verification Ratio</h3>
                        <p className="text-2xl font-bold text-purple-500">{verificationRatio}%</p>
                    </div>
                    <div onClick={openUploadPopup} className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-2xl p-6 border border-slate-700 flex flex-col items-center justify-center cursor-pointer">
                        <p className='font-albulaMedium font-bold text-lg text-white'>Upload Document</p>
                        <Lottie animationData={UploadIcon} loop={true} className="w-[100px] h-[100px]" autoplay={true} />
                    </div>
                </div>

                <div className="rounded-[50px] backdrop-blur-md bg-gray-800 bg-opacity-50 p-10 text-gray-50 w-full shadow-lg border border-gray-600">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Document Logs</h2>
                    </div>
                    <p className="text-gray-100 mb-4">Uploaded Documents</p>

                    <div className="grid grid-cols-4 gap-4 px-10 py-4 font-semibold text-white">
                        <div>Document Type</div>
                        <div>Upload Date</div>
                        <div>Status</div>
                        <div className="text-right">Actions</div>
                    </div>

                    <div className="space-y-2 mt-2">
                        {documents.map((document, index) => (
                            <div key={index} className="grid grid-cols-4 gap-4 items-center px-10 py-4 rounded-full shadow-lg border border-gray-200 bg-gray-800 bg-opacity-40 backdrop-blur-md hover:bg-opacity-50 transition duration-300 ease-in-out">
                                <div className="flex items-center space-x-3">
                                    <span className="text-gray-200 font-medium">{document.doctype}</span>
                                </div>
                                <div className="text-gray-300">{new Date(document.upload_time).toLocaleString()}</div>
                                <div>
                                    <span className={`inline-flex items-center justify-center w-24 h-8 px-3 py-1 rounded-full text-sm font-semibold ${
                                        document.verify_flag ? 'bg-green-400 text-white' : 'bg-yellow-500 text-white'
                                    }`}>
                                        {document.verify_flag ? 'Verified' : 'Pending'}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <a href={`https://gateway.pinata.cloud/ipfs/${document.ipfs_hash}`} className="inline-flex items-center justify-center w-20 h-8 px-3 py-1 rounded-full text-sm transition duration-300 ease-in-out transform hover:scale-105 bg-purple-600 text-white" onClick={() => toggleActions(index)}>
                                        View
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}

export default AnalysisSection;
