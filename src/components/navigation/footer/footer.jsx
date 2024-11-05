import React from 'react';
import { NavLink } from 'react-router-dom';

import linkedinIcon from '../../../assets/icons/linkedinLogoSVG.svg';
import instagramIcon from '../../../assets/icons/instagramLogoSVG.svg';
import facebookIcon from '../../../assets/icons/facebookLogoSVG.svg';

const Footer = () => {
    return (
        <footer className="bg-[#200435] text-white py-10 px-72 h-[400px] flex flex-col justify-center items-center">
            <div className="cursor-pointer text-white w-full flex flex-row justify-start">
                <span className="font-noirProBold text-4xl">CHECK</span>
                <span className="font-noirProRegular text-4xl text-[#6536ff] tracking-widest ml-2 mb-1">MATE</span>
            </div>

            <div className="container mx-auto flex flex-col md:flex-row justify-between mt-14">
                <div className='lg:w-1/2 flex flex-col mb-10'>
                    <p className="text-sm font-albulaRegular tracking-widest">A document verification solution built to streamline the process.</p>
                    <h1 className='mb-3 mt-8 cursor-text'>Social Handles</h1>
                    <div className='flex justify-between items-center w-[110px]'>
                        <a href="">
                            <div className='inline-block'>
                                <img src={linkedinIcon} alt="Linked In Icon" className='w-5 transition-opacity duration-300 hover:opacity-60'/>
                            </div>
                        </a>

                        <a href="">
                            <div className='inline-block'>
                                <img src={instagramIcon} alt="Instagram Icon" className='w-5 transition-opacity duration-300 hover:opacity-60'/>
                            </div>
                        </a>

                        <a href="">
                            <div className='inline-block'>
                                <img src={facebookIcon} alt="Facebook Icon" className='w-5 transition-opacity duration-300 hover:opacity-60'/>
                            </div>
                        </a>
                    </div>
                </div>

                <div className="flex flex-col space-y-2 mt-4 md:mt-0">
                    <h3 className="font-albulaBold text-lg">Important Links</h3>
                    <NavLink to="/" className="text-sm text-slate-300 hover:text-[#916fff] font-albulaRegular">About Us</NavLink>
                    <NavLink to="/" className="text-sm text-slate-300 hover:text-[#916fff] font-albulaRegular">Our Team</NavLink>
                    <NavLink to="/" className="text-sm text-slate-300 hover:text-[#916fff] font-albulaRegular">Notices</NavLink>
                    <NavLink to="/" className="text-sm text-slate-300 hover:text-[#916fff] font-albulaRegular">Recruitment</NavLink>
                </div>

                <div className="flex flex-col space-y-2 mt-4 md:mt-0">
                    <h3 className="font-albulaBold text-lg">Contact Us</h3>
                    <p className="text-sm font-albulaBold">Address: <span className="font-albulaRegular text-slate-300 hover:text-[#916fff] hover:cursor-pointer">National Institute of Technology, Raipur</span></p>
                    <p className="text-sm font-albulaBold">Email: <span className="font-albulaRegular text-slate-300 hover:text-[#916fff] hover:cursor-pointer">binarybots@gmail.com</span></p>
                    <p className="text-sm font-albulaBold">Phone: <span className="font-albulaRegular text-slate-300 hover:text-[#916fff] hover:cursor-pointer">9871553822</span></p>
                </div>
            </div>

            <div className="text-center text-sm mt-10 text-gray-400 font-albulaLight ">
                Copyright © 2024 All rights reserved by the Team Binary Bots ❤️
            </div>
        </footer>
    );
};

export default Footer;