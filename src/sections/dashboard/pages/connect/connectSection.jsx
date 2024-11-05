import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import { useAuth0 } from '@auth0/auth0-react';

function ConnectSection() {
  const { user, isAuthenticated } = useAuth0();
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formData = {
      name,
      email,
    };

    emailjs.send('service_qn0p3ub', 'template_0vmarxg', formData, 'aD4tzeo3hvgEGpZRB')
      .then((result) => {
        console.log('Email successfully sent:', result.text);
        setSuccess(true);
        // Reset the form
        setName('');
        setEmail('');
      }, (error) => {
        console.log('Email sending failed:', error.text);
      });
  };

  return (
    isAuthenticated && (
      <div className="flex items-center justify-center w-full min-h-screen p-6 font-albulaMedium bg-slate-950">
        <div className="w-full max-w-md flex flex-col gap-6">
          
          <div className="w-full bg-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20 rounded-2xl shadow-lg p-6 flex flex-col">
            <h2 className="text-2xl font-semibold text-white mb-4 text-center">Connect With Us</h2>
            {success && <p className="text-green-500 text-center">Email sent successfully!</p>}
            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <div className="flex flex-col">
                <label className="text-white font-medium">Name:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="p-3 rounded-lg bg-white bg-opacity-10 backdrop-blur-md text-white placeholder-white shadow-inner"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-white font-medium">Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="p-3 rounded-lg bg-white bg-opacity-10 backdrop-blur-md text-white placeholder-white shadow-inner"
                />
              </div>
              <button
                type="submit"
                className="w-full mt-6 p-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
              >
                Send Email
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  );
}

export default ConnectSection;
