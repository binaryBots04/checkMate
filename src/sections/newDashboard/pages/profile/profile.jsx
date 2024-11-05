import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";

function Profile() {
    const { user, isAuthenticated } = useAuth0();
    const [formData, setFormData] = useState({
        firstName: user.given_name,
        lastName: user.family_name,
        phoneNumber: user.phone_number,
        collegeRollNumber: "",
        enrollmentNumber: "",
        aadharCardNumber: "",
        branch: "",
        collegeEmailId: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        isAuthenticated && (
            <main className="fixed w-[calc(100vw-450px)] h-screen bg-[#0F0D13ff] rounded-tl-[40px] rounded-bl-[40px] pt-7 pb-7 pr-7 font-albulaRegular">
                <div className="flex flex-row bg-white text-gray-900 rounded-[40px] h-full border-gray-400 shadow-lg">
                    <div className="flex flex-col items-center justify-center w-1/3 bg-gradient-to-b from-blue-100 to-indigo-200 rounded-l-[40px] py-36 shadow-inner">
                        <div className="flex flex-col justify-center items-center">
                            <img src={user.picture} alt="User Profile" className="w-40 h-40 rounded-full mb-6 border-4 border-blue-300 shadow-lg transform transition-transform duration-200 hover:scale-105"/>
                            <h2 className="text-3xl font-bold text-gray-800 mt-10">{user.name}</h2>
                            <p className="text-gray-600 mb-2 font-medium mt-5">{user.email}</p>
                            <p className="text-sm text-gray-500 mb-6">{user.sub}</p>
                        </div>
                    </div>

                    <div className="w-2/3 bg-gray-50 rounded-r-[40px] py-36 px-20 shadow-inner flex flex-col justify-center">
                        <div>
                            <h2 className="text-3xl font-semibold mb-8 text-gray-700">Personal Information</h2>
                            
                            <form className="grid grid-cols-2 gap-6">
                                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="p-4 rounded-lg bg-blue-50 border border-gray-300 shadow-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="p-4 rounded-lg bg-blue-50 border border-gray-300 shadow-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                                <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" className="p-4 rounded-lg bg-blue-50 border border-gray-300 shadow-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                                <input type="text" name="aadharCardNumber" value={formData.aadharCardNumber} onChange={handleChange} placeholder="Aadhar Card Number" className="p-4 rounded-lg bg-blue-50 border border-gray-300 shadow-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                                <input type="text" name="branch" value={formData.branch} onChange={handleChange} placeholder="Branch" className="p-4 rounded-lg bg-blue-50 border border-gray-300 shadow-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                                <input type="email" name="collegeEmailId" value={formData.collegeEmailId} onChange={handleChange} placeholder="College Email ID" className="p-4 rounded-lg bg-blue-50 border border-gray-300 shadow-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                                <input type="text" name="collegeRollNumber" value={formData.collegeRollNumber} onChange={handleChange} placeholder="College Roll Number" className="p-4 rounded-lg bg-blue-50 border border-gray-300 shadow-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                                <input type="text" name="enrollmentNumber" value={formData.enrollmentNumber} onChange={handleChange} placeholder="Enrollment Number" className="p-4 rounded-lg bg-blue-50 border border-gray-300 shadow-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"/>
                            </form>

                            <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-lg mt-10 font-medium hover:from-blue-600 hover:to-indigo-600 transform transition-all duration-300 shadow-lg">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        )
    );
}

export default Profile;