import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { NavLink } from 'react-router-dom';
import Lottie from "lottie-react";
import axios from 'axios';

import AlertIcon from '../../../../assets/icons/alert.png';
import WarningIcon from '../../../../assets/icons/WarningIcon.png';
import VerifiedDocumentIcon from '../../../../assets/icons/VerifiedDocument.png';
import UploadIcon from '../../../../assets/animations/upload.json';
import LeafIllustration from '../../../../assets/images/illustration/LeafIllustration.png'


function Analysis() {
    const { user } = useAuth0();
    const [showActions, setShowActions] = useState(Array(4).fill(false));
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [docTypes, setDocTypes] = useState([]); 

    const verifiedCount = documents.filter(doc => doc.verify_flag).length;
    const unverifiedCount = documents.length - verifiedCount;
    const verificationRatio = unverifiedCount + verifiedCount > 0 ? (verifiedCount / (verifiedCount + unverifiedCount) * 100).toFixed(2) : 0;

    const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

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
    

    return (
        <>
            <main className="fixed w-[calc(100vw-450px)] h-screen pt-7 pb-7 pr-7 font-albulaRegular">   
                <div className="flex flex-row justify-between bg-white text-gray-900 rounded-[40px] h-full border-gray-400 shadow-inner">
                    <section className='w-full bg-white h-full rounded-bl-[40px] rounded-tl-[40px] p-20 shadow-inner'>
                        <h1 className="font-albulaHeavy text-4xl text-slate-800">Dashboard</h1>
                        <p className="text-slate-500 mt-3 ml-1 font-albulaMedium">{today}</p>

                        <p className="text-md text-gray-600 font-albulaRegular mt-8">
                            Welcome to <span className="text-violet-600">CheckMate</span>! Securely manage, upload, and access all your important documents in one place. 
                            With <span className="text-violet-600">decentralized storage</span> and <span className="text-violet-600">advanced security</span> features, 
                            your data is always protected and readily available at your fingertips.
                        </p>

                        {loading ? (
                            <p>Loading documents...</p>
                        ) : error ? (
                            <p className="text-red-500">{error}</p>
                        ) : (
                            <div className="mt-10">
                                <div>
                                    <h1 className='font-albulaHeavy text-2xl text-slate-700'>Document Logs</h1>
                                </div>

                                <div className="h-[400px]">
                                    <div className="grid grid-cols-4 gap-4 py-4 border-b border-gray-300 text-slate-500 font-albulaMedium">
                                        <p className="font-albulaMedium">Document Type</p>
                                        <p className="font-albulaMedium text-center mr-8">Status</p>
                                        <p className="font-albulaMedium text-center">Date of Verification</p>
                                        <p className="font-albulaMedium text-center mr-16">Action</p>
                                    </div>

                                    <ul className='max-h-[525px] overflow-y-auto'>
                                        {documents.map((document, index) => (
                                            <li key={index} className="grid grid-cols-4 items-center p-6 pr-10 border-b-2 hover:border-1 hover:border-indigo-200 hover:bg-indigo-50 transition-all duration-200 gap-4 hover:cursor-pointer">
                                                <div className="flex items-center justify-start">
                                                    <span className="text-3xl mr-2">
                                                        {document.verify_flag ? 
                                                            <img src={VerifiedDocumentIcon} className="w-[40px] h-[40px]" alt="Verified Icon" /> : 
                                                            <img src={WarningIcon} className="w-[35px] h-[35px]" alt="Warning Icon" />}
                                                    </span>
                                                    <p className="font-semibold text-slate-800 ml-3">{document.doctype || 'Unknown Document Type'}</p>
                                                </div>

                                                <div className="flex items-center justify-center cursor-pointer">
                                                    <span className={`px-4 py-1 rounded-xl text-sm text-white font-albulaRegular ${document.verify_flag ? 'bg-green-500' : 'bg-amber-500'}`}>
                                                        {document.verify_flag ? 'Verified' : 'Pending'}
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-center">
                                                    <span className="text-slate-500 text-center">
                                                        {document.verify_flag ? new Date(document.upload_time).toLocaleDateString() : '-----'}
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-center">
                                                    {document.verify_flag ? (
                                                        <button className='w-fit h-fit px-4 py-1 rounded-xl text-sm bg-indigo-400 hover:bg-indigo-600 transition-all duration-200 text-white'>
                                                            <a href={`https://harlequin-genetic-leopard-460.mypinata.cloud/ipfs/${document.ipfs_hash}`}>View Document</a>
                                                        </button>
                                                    ) : (
                                                        <button className='w-fit h-fit px-4 py-1 rounded-xl text-sm bg-indigo-400 hover:bg-indigo-600 transition-all duration-200 text-white'>Contact HOD</button>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </section>

                    <section className='w-[400px] h-full '>
                        <main className="h-full bg-slate-100 pt-20 p-12 flex flex-col justify-between rounded-br-[40px] rounded-tr-[40px] bg-gradient-to-b from-blue-100 to-indigo-200">
                            <div>
                                <h1 className="font-albulaBold text-2xl mb-6 text-slate-800">User Statistics</h1>
                                <div className="mt-12">
                                    <div>
                                        <div className="flex flex-row justify-between items-center mt-10">
                                            <p className="text-gray-600 font-albulaBold text-sm">Verified Documents</p>
                                            <span className="text-gray-500 font-albulaMedium text-sm">{verifiedCount}</span>
                                        </div>

                                        <div className="flex items-center">
                                            <div className="h-2 w-full bg-gray-200 rounded-full mr-2 mt-3">
                                                <div className="h-2 bg-green-500 rounded-full" style={{ width: `${verifiedCount * 10}px` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <div className="flex flex-row justify-between items-center mt-10">
                                            <p className="text-gray-600 font-albulaBold text-sm">Pending Documents</p>
                                            <span className="text-gray-500 font-albulaMedium text-sm">{unverifiedCount}</span>
                                        </div>

                                        <div className="flex items-center">
                                            <div className="h-2 w-full bg-gray-200 rounded-full mr-2 mt-3">
                                                <div className="h-2 bg-green-500 rounded-full" style={{ width: `${unverifiedCount * 10}px` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <div className="flex flex-row justify-between items-center mt-10">
                                            <p className="text-gray-600 font-albulaBold text-sm">Verified/Pending Ratio (%)</p>
                                            <span className="text-gray-500 font-albulaMedium text-sm">{verificationRatio}%</span>
                                        </div>

                                        <div className="flex items-center">
                                            <div className="h-2 w-full bg-orange-600 rounded-full mr-2 mt-3">
                                                <div className="h-2 bg-green-500 rounded-tl-full rounded-bl-full" style={{ width: `${verificationRatio}%` }} ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className='w-[300px] h-fit rounded-3xl p-8 flex flex-col justify-center items-center border-dashed border-2 border-[#8360ff]'>
                                    <button className='w-full h-[70px] bg-[#13130d] rounded-2xl font-albulaBold uppercase text-white hover:bg-orange-400 transition-all duration-300 hover:drop-shadow-xl'>Connect With Proffessors</button>
                                </div>

                                <div className='w-[300px] h-fit rounded-3xl p-8 flex flex-col justify-center items-center border-dashed border-2 border-[#8360ff] mt-5'>
                                    <NavLink to="/dashboard/upload" className='w-full h-[70px] rounded-2xl font-albulaBold uppercase text-white bg-[#8360ff] hover:bg-purple-700 transition-all duration-300 hover:drop-shadow-xl flex justify-center items-center'>
                                            Upload Documents
                                    </NavLink>
                                </div>
                            </div>
                        </main>
                    </section>
                </div>
            </main>
        </>
    );
}

export default Analysis;
