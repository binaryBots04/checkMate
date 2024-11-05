import { useAuth0 } from '@auth0/auth0-react';
import React, { useState, useEffect } from 'react';

function Profile() {
    const { user, isAuthenticated } = useAuth0();

    const loadProfileInfo = () => {
        const savedProfile = localStorage.getItem('profileInfo');
        return savedProfile ? JSON.parse(savedProfile) : {
            enrollmentNumber: '',
            age: '',
            branch: '',
            rollNumber: '',
            collegeName: '',
            semester: '1',
        };
    };

    const [profileInfo, setProfileInfo] = useState(loadProfileInfo);

    useEffect(() => {
        localStorage.setItem('profileInfo', JSON.stringify(profileInfo));
    }, [profileInfo]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileInfo({
            ...profileInfo,
            [name]: value,
        });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        console.log('Updated Profile Info:', profileInfo);
        alert("Profile information saved!");
    };

    return (
        isAuthenticated && (
            <div className="flex items-center justify-center w-full min-h-screen p-6 font-albulaMedium bg-slate-950">
                <div className="w-full max-w-5xl flex flex-col md:flex-row gap-6">
                    
                    {/* Profile Card */}
                    <div className="w-full md:w-2/5 bg-gray-800 bg-opacity-40 backdrop-blur-md border border-white border-opacity-20 rounded-2xl shadow-lg p-8 flex flex-col items-center justify-evenly glass-card">
                        <div className="w-40 h-40 rounded-full bg-white shadow-inner flex items-center justify-center mb-4">
                            <img src={user.picture} alt="User" className="w-36 h-36 rounded-full" />
                        </div>
                        <div className='flex flex-col justify-center items-center'>
                            <h3 className="text-2xl font-bold text-white">{user.name}</h3>
                            <p className="text-gray-300 mb-4 mt-2">{user.email}</p>
                        </div>
                        <div className="text-center w-full">
                            <p className="text-gray-300 my-1">Document Uploads: <span className="font-semibold text-orange-400">4</span></p>
                            <p className="text-gray-300 my-1">Document Verified: <span className="font-semibold text-green-400">3</span></p>
                            <p className="text-gray-300 my-1">Document Unverified: <span className="font-semibold text-blue-400">1</span></p>
                        </div>
                    </div>
                    
                    {/* Profile Form Card */}
                    <div className="w-full md:w-3/5 bg-gray-800 bg-opacity-40 backdrop-blur-md border border-white border-opacity-20 rounded-2xl shadow-lg p-8 flex flex-col glass-card">
                        <form onSubmit={handleFormSubmit} className="w-full space-y-4">
                            <h3 className="text-2xl font-semibold text-white mb-4 text-center">Personal Information</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                    <label className="text-white font-medium">First Name</label>
                                    <input
                                        type="text"
                                        value={user.given_name || ''}
                                        readOnly
                                        className="p-3 rounded-lg bg-white bg-opacity-10 backdrop-blur-md text-white placeholder-white shadow-inner"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-white font-medium">Last Name</label>
                                    <input
                                        type="text"
                                        value={user.family_name || ''}
                                        readOnly
                                        className="p-3 rounded-lg bg-white bg-opacity-10 backdrop-blur-md text-white placeholder-white shadow-inner"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-white font-medium">Enrollment Number</label>
                                    <input
                                        type="text"
                                        name="enrollmentNumber"
                                        value={profileInfo.enrollmentNumber}
                                        onChange={handleInputChange}
                                        className="p-3 rounded-lg bg-white bg-opacity-10 backdrop-blur-md text-white placeholder-white shadow-inner"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-white font-medium">Age</label>
                                    <input
                                        type="number"
                                        name="age"
                                        value={profileInfo.age}
                                        onChange={handleInputChange}
                                        className="p-3 rounded-lg bg-white bg-opacity-10 backdrop-blur-md text-white placeholder-white shadow-inner"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-white font-medium">Branch</label>
                                    <input
                                        type="text"
                                        name="branch"
                                        value={profileInfo.branch}
                                        onChange={handleInputChange}
                                        className="p-3 rounded-lg bg-white bg-opacity-10 backdrop-blur-md text-white placeholder-white shadow-inner"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-white font-medium">Roll Number</label>
                                    <input
                                        type="text"
                                        name="rollNumber"
                                        value={profileInfo.rollNumber}
                                        onChange={handleInputChange}
                                        className="p-3 rounded-lg bg-white bg-opacity-10 backdrop-blur-md text-white placeholder-white shadow-inner"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-white font-medium">College Name</label>
                                    <input
                                        type="text"
                                        name="collegeName"
                                        value={profileInfo.collegeName}
                                        onChange={handleInputChange}
                                        className="p-3 rounded-lg bg-white bg-opacity-10 backdrop-blur-md text-white placeholder-white shadow-inner"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-white font-medium">Semester</label>
                                    <select
                                        name="semester"
                                        value={profileInfo.semester}
                                        onChange={handleInputChange}
                                        className="p-3 rounded-lg bg-white bg-opacity-10 backdrop-blur-md text-black shadow-inner"
                                    >
                                        {Array.from({ length: 8 }, (_, i) => (
                                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <button type="submit" className="w-full mt-6 p-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">
                                Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        )
    );
}

export default Profile;