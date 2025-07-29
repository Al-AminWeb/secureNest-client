import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { HiOutlineMail, HiOutlinePhone } from 'react-icons/hi';

const Footer = () => {
    return (
        <footer className="bg-primary text-white py-8">
            <div className="max-w-screen-xl mx-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Contact Info */}
                    <div>
                        <h3 className="text-2xl font-semibold mb-4">Contact Us</h3>
                        <ul>
                            <li className="flex items-center mb-2">
                                <HiOutlinePhone className="w-6 h-6 mr-3 text-accent" />
                                <span>+1 (234) 567-890</span>
                            </li>
                            <li className="flex items-center">
                                <HiOutlineMail className="w-6 h-6 mr-3 text-accent" />
                                <span>support@securenest.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Useful Links */}
                    <div>
                        <h3 className="text-2xl font-semibold mb-4">Quick Links</h3>
                        <ul>
                            <li>
                                <a href="/about-us" className="hover:text-accent transition">About Us</a>
                            </li>
                            <li>
                                <a href="/contact-us" className="hover:text-accent transition">Contact Us</a>
                            </li>
                            <li>
                                <a href="/faq" className="hover:text-accent transition">FAQ</a>
                            </li>
                            <li>
                                <a href="/sitemap" className="hover:text-accent transition">Sitemap</a>
                            </li>
                        </ul>
                    </div>

                    {/* Social Media Links */}
                    <div>
                        <h3 className="text-2xl font-semibold mb-4">Follow Us</h3>
                        <div className="flex space-x-4">
                            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                                <FaFacebook className="w-8 h-8 hover:text-accent transition" />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                <FaTwitter className="w-8 h-8 hover:text-accent transition" />
                            </a>
                            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                                <FaLinkedin className="w-8 h-8 hover:text-accent transition" />
                            </a>
                            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                                <FaInstagram className="w-8 h-8 hover:text-accent transition" />
                            </a>
                        </div>
                    </div>

                    {/* Company Info */}
                    <div>
                        <h3 className="text-2xl font-semibold mb-4">SecureNest</h3>
                        <p className="text-sm text-gray-300">
                            SecureNest is dedicated to providing the best insurance solutions with transparent pricing, quick claims processing, and top-notch customer service. We are here to make sure you feel secure at all times.
                        </p>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="mt-8 text-center">
                    <p className="text-sm">&copy; {new Date().getFullYear()} SecureNest. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
