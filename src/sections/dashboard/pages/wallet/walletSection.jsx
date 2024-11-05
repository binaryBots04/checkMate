import { NavLink } from 'react-router-dom';
import '../../dashboardStyles.css';
import { useAuth0 } from '@auth0/auth0-react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Wallet() {
    const { user } = useAuth0();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
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
    }, [user?.sub]);

    return (
        <div className="flex flex-col items-center justify-start w-full min-h-screen font-albulaMedium bg-slate-950">
            {/* Navbar */}
            <div id='walletNavbar' className='bg-slate-900 w-full h-[100px] flex flex-row justify-between items-center font-albulaRegular text-gray-800 p-10'>
                <span className='text-3xl font-albulaBold text-white'>Welcome {user.given_name} {user.family_name}</span>
                <NavLink to="/dashboard/profile" id='md_imgHolder'>
                    <img src={user.picture} alt="User Icon" className='md_userIcon rounded-full h-[70%] w-[70%]'/>
                </NavLink>
            </div>

            {/* Glassmorphism Container */}
            <div className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-2xl p-8 mt-10 shadow-lg w-full max-w-5xl">
                <h2 className="text-2xl font-semibold text-white mb-6 text-center">Your Documents</h2>

                {/* Loading and Error Handling */}
                {loading && <p className="text-gray-300 text-center">Loading...</p>}
                {error && <p className="text-red-500 text-center">{error}</p>}

                {/* Document Cards Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Render documents from MongoDB */}
                    {Array.isArray(documents) && documents.length > 0 ? (
                        documents.map((document, index) => (
                            <div key={index} className="bg-white bg-opacity-20 backdrop-blur-md border border-white border-opacity-20 rounded-lg p-4 flex flex-col items-center transition duration-300 hover:shadow-2xl">
                                <img
                                    src={`https://gateway.pinata.cloud/ipfs/${document.ipfs_hash}`} // Ensure you're using the correct property
                                    alt={`Uploaded Document ${index + 1}`}
                                    className="w-full h-40 object-cover rounded-lg mb-4"
                                />
                                <div className="text-center">
                                    <p className="text-lg text-white font-semibold mb-2">Document #{index + 1}</p>
                                    <a
                                        href={`https://gateway.pinata.cloud/ipfs/${document.ipfs_hash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:underline text-sm"
                                    >
                                        Link to the Document
                                    </a>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-300 text-center">No documents found.</p>
                    )}
                </div>
            </div>

            {/* Navigation Links */}
            <div className="mt-8">
                <NavLink to="/dashboard/profile" className="text-blue-400 hover:underline mr-4">
                    Go to Profile
                </NavLink>
            </div>
        </div>
    );
}

export default Wallet;
