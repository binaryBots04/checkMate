import { useState, useEffect } from "react";
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";

function Wallet() {
    const { user } = useAuth0();

    const [documents, setDocuments] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedDocument, setSelectedDocument] = useState(null);

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

    const handleDocumentClick = (document) => {
        setSelectedDocument(document);
    };

    return (
        <main className="fixed w-[calc(100vw-450px)] h-screen bg-[#0F0D13ff] rounded-tl-[40px] rounded-bl-[40px] pt-7 pb-7 pr-7 font-albulaRegular">
            <div className="flex flex-row bg-white text-gray-900 rounded-[40px] h-full border-gray-400 shadow-lg">
                <div className="w-1/2 bg-gradient-to-b from-blue-100 to-indigo-200 rounded-l-[40px] p-20 shadow-inner">
                    <h1 className="text-4xl font-albulaHeavy text-slate-900">Wallet</h1>
                    <p className="text-md font-albulaMedium text-slate-600 mt-7">All your verified documents, secured on the blockchain for easy access and peace of mind.</p>
                    
                    <div className="h-[635px] w-full rounded-3xl mt-10">
                        <ul className='max-h-[525px] overflow-y-auto'>
                            {documents
                                .filter(document => document.verify_flag === true)
                                .map((document, index) => (
                                    <li 
                                        key={index} 
                                        className="flex flex-row justify-between items-center p-6 pr-10 bg-slate-50 mt-2 rounded-3xl hover:border-indigo-200 hover:bg-indigo-50 transition-all duration-200 gap-4 hover:cursor-pointer"
                                        onClick={() => handleDocumentClick(document)}
                                    >
                                        <div className="flex flex-col justify-center items-center">
                                            <p className="font-semibold text-slate-800 ml-3">{document.doctype || 'Unknown Document Type'}</p>
                                        </div>

                                        <div className="flex items-center justify-center cursor-pointer">
                                            <span className="px-4 py-1 rounded-xl text-sm text-white font-albulaRegular bg-green-500">
                                                Verified
                                            </span>
                                        </div>
                                    </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div id="documentSection" className="w-1/2 bg-gray-50 rounded-r-[40px] py-20 shadow-inner flex flex-col justify-center items-center">
                    {selectedDocument ? (
                        <img src={`https://harlequin-genetic-leopard-460.mypinata.cloud/ipfs/${selectedDocument.ipfs_hash}`} className="max-w-full max-h-full rounded-lg" />
                    ) : (
                        <p className="text-gray-600">Select a document to view its details.</p>
                    )}
                </div>
            </div>
        </main>
    );
}

export default Wallet;
