import { useTypewriter } from 'react-simple-typewriter';
import { NavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import Lottie from "lottie-react";

import './homeStyles.css';
import '../../globalStyles.css'
import LandingIllustration from '../../assets/animations/landingDocument.json';
import DownArrow from '../../assets/animations/downArrow.json';
import AboutImgOne from '../../assets/images/illustration/AboutImgOne.png'
import AboutImgTwo from '../../assets/images/illustration/AboutImgTwo.png'

import AmanImage from '../../assets/images/teamMembers/amanImg.jpg'
import SparshImage from '../../assets/images/teamMembers/sparshImg.jpeg'
import AnshImage from '../../assets/images/teamMembers/anshImg.jpg'
import AayushImage from '../../assets/images/teamMembers/aayushImg.jpg'

import linkedInIcon from '../../assets/icons/linkedinLogoSVG.svg'
import instagramIcon from '../../assets/icons/instagramLogoSVG.svg'

function Home() {
    const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

    const [typeEffect] = useTypewriter({
        words: ['Reliability', 'Security'],
        loop: true,
        typeSpeed: 30,
        deleteSpeed: 10,
    });

    const teamMembers = [
        { 
            name: 'Sparsh Jaggi', 
            role: 'AI/ML Developer', 
            description: "AI/ML developer, implementing advanced AI models for document analysis and verification. Sparsh's contributions in computer vision enable precise document checks, automating verification steps.",
            img: SparshImage,
            socialLinks: [
                { url: 'https://www.instagram.com/sparshjaggi/', icon: 'instagram' },
                { url: 'https://www.linkedin.com/in/sparsh-jaggi-1aa263257/', icon: 'linkedIn' },
            ],
        },
        { 
            name: 'Aayush Gupta', 
            role: 'Full Stack Developer', 
            description: "Full Stack developer, managing core workflows and essential user features. Aayush's contributions ensure that checkMate operates smoothly, providing a cohesive and efficient experience for document management.",
            img: AayushImage,
            socialLinks: [
                { url: 'https://www.instagram.com/_.aayush.gupta._/', icon: 'instagram' },
                { url: 'https://www.linkedin.com/in/aayush-gupta-020284263/', icon: 'linkedIn' },
            ],
        },
        { 
            name: 'Aman Kumar', 
            role: 'Blockchain/Full Stack Developer', 
            description: 'Blockchain and Full Stack developer, focused on secure, decentralized document storage for checkMate. Aman also leads UI design, creating an intuitive interface that enhances user experience',
            img: AmanImage ,
            socialLinks: [
                { url: 'https://www.instagram.com/amanwhoooo/', icon: 'instagram' },
                { url: 'https://www.linkedin.com/in/amankumar25/', icon: 'linkedIn' },
            ],
        },
        { 
            name: 'Anshdeep Shrivastav', 
            role: 'ML/Full Stack Developer', 
            description: "ML/Backend developer, managing backend integration and processing pipelines. Ansh's machine learning expertise optimizes document data flow and enables accurate, reliable backend operations.",
            img: AnshImage,
            socialLinks: [
                { url: 'https://www.instagram.com/ansh_d23/', icon: 'instagram' },
                { url: 'https://www.linkedin.com/in/anshdeep-shrivastav-5a9a6b244/', icon: 'linkedIn' },
            ],
        },
    ];
    
    return (
        <>
            <div className="">

                {/* Home Section */}

                <div id="home" className="h-screen w-screen flex flex-row justify-between items-center relative z-10 px-52 gradient-background">
                    <div className="w-[900px] h-full flex flex-col justify-center items-start">
                        <div className="font-gilroyEB text-white text-7xl w-[900px] break-words leading-[80px]">
                            <div className="tc txc-1" style={{ opacity: 1, visibility: 'inherit', transform: 'rotate(-180deg)' }}>
                                <svg viewBox="0 0 100 100">
                                    <defs>
                                        <path id="c-1" d="M 50, 50m -25, 0 a 25,25 0 1,1 50,0 a 25,25 0 1,1-50,0"></path>
                                    </defs>
                                    
                                    <text fontSize="8">
                                        <textPath xlinkHref="#c-1" className='font-albulaExtraLight text-[6px]'>Documents Made Easy by CheckMate</textPath>
                                    </text>
                                </svg>
                            </div>

                            <div className='font-albulaExtraLight text-sm mt-[40px] uppercase tracking-[3px]'>Streamlining Document Verification Process with Unmatched Efficiency</div>

                            <p className='mt-[25px] tracking-[3px]'>
                                Empowering You to Verify Your Documents with <span className='text-[#6536ff]'>{typeEffect}</span>
                            </p>
                        </div>

                        {isAuthenticated ? (
                            <div className="flex flex-row justify-center items-center gap-4 mt-[80px]">
                                <NavLink to="/dashboard/analysis" className="styled-button w-[250px]">Jump To Dashboard</NavLink>
                                <NavLink className="logoutButton h-[30px] w-[100px] ml-[50px]" onClick={() => logout({ returnTo: window.location.origin })}>Log Out</NavLink>
                            </div>
                        ) : (
                            <NavLink className="styled-button w-[150px] mt-[80px]" onClick={() => loginWithRedirect()}> Get Started </NavLink>
                        )}
                    </div>

                    <Lottie animationData={LandingIllustration} loop={true} className="transform scale-125"/>
                </div>

                {/* About Section */}

                <section id="about" className="w-full h-screen flex flex-row justify-between items-center px-52">
                    <div className="w-[700px] h-full flex flex-col justify-center">
                        <h1 className="text-2xl font-albulaExtraLight tracking-widest">About checkMate</h1>
                        <h1 className="text-4xl font-gilroyEB mt-3 underFlow text-black">Revolutionizing Document Verification</h1>
                        <p className="text-slate-500 tex-sm font-albulaRegular mt-12">checkMate is an advanced platform that automates the verification process, making it faster, more reliable, and easily accessible to users. By combining AI/ML technologies, blockchain, and decentralized storage solutions</p>
                    </div>
                    <img src={AboutImgOne} alt="Illustration One" className="w-[660px] h-[660px]"/>
                </section>
                
                <section className="w-full h-full flex flex-row justify-between items-center px-52">
                    <img src={AboutImgTwo} alt="Illustration One" className="w-[660px] h-[660px] -ml-10"/>
                    <div className="w-[700px] h-full flex flex-col justify-center">
                        <h1 className="text-2xl font-albulaExtraLight tracking-widest">Secure Document Verification Solution</h1>
                        <h1 className="text-4xl font-gilroyEB mt-3 underFlow text-black">Why Choose checkMate?</h1>
                        <p className="text-slate-500 font-albulaRegular mt-12"> Our platform employs advanced AI and machine learning for precise document analysis, coupled with blockchain technology for tamper-proof security, guaranteeing the integrity of your sensitive information.</p>
                        <p className="text-slate-500 font-albulaRegular mt-4"> With decentralized storage via IPFS, your documents are always accessible and protected from data loss. Our user-friendly dashboard offers clear insights into your verification status, and robust authentication ensures that only authorized users can access their data.</p>
                    </div>
                </section>

                {/* Team Section */}

                <section id="team" className="w-full h-auto flex flex-col justify-center items-center px-52 py-96">
                    <h1 className="font-albulaLight tracking-widest uppercase text-gray-500 text-sm">
                        Website Developed by <span className="text-[#6536ff] font-albulaBold">Team Binary Bots</span> for CodeUtsava 8.0, Crafted with Love ❤️
                    </h1>

                    <h1 className="font-gilroyEB text-5xl mt-6 text-gray-800">Meet the team</h1>
                    <div className="flex flex-col items-center mt-6">
                        <Lottie animationData={DownArrow} loop={true} className="w-[100px] h-[100px] hover:cursor-pointer"/>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-32 mt-64 px-5 w-full max-w-5xl">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg relative group">

                                <div className="relative w-full h-[400px] overflow-hidden">
                                    <img src={member.img} alt={member.name} className="w-full h-full object-cover object-center transition-transform duration-500 ease-in-out transform hover:scale-105 hover:shadow-xl" />
                                    <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="flex space-x-10">
                                            <a href={member.socialLinks[1].url} target="_blank" rel="noopener noreferrer" className="text-white text-2xl hover:text-gray-300">
                                                <img src={linkedInIcon} alt="LinkedIn" className="w-10 h-10 hover:scale-110 transition-all duration-200"/>
                                            </a>

                                            <a href={member.socialLinks[0].url} target="_blank" rel="noopener noreferrer" className="text-white text-2xl hover:text-gray-300">
                                                <img src={instagramIcon} alt="Instagram" className="w-10 h-10 hover:scale-110 transition-all duration-200"/>
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-10 py-14 text-center">
                                    <h2 className="text-2xl font-semibold text-gray-800 uppercase font-albulaBold tracking-widest">{member.name}</h2>
                                    <h3 className="text-lg text-gray-600 mt-1 font-albulaLight">- {member.role}</h3>
                                    <p className="text-gray-400 mt-4 font-albulaRegular text-sm">{member.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                </section>
            </div>
        </>
    );
}

export default Home;