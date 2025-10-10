const Footer = () => (
    <footer className="bg-orange-950 text-white mt-8 pt-10 pb-4">
        <div className="max-w-7xl mx-auto px-4">
            {/* Footer Links Grid */}
            <div className="grid grid-cols-4 gap-8 pb-10 border-b border-orange-800">
                <div>
                    <h4 className="font-bold mb-3">Need Help?</h4>
                    <ul className="space-y-2 text-sm text-orange-200">
                        <li><a href="#" className="hover:text-white transition">How to Register</a></li>
                        <li><a href="#" className="hover:text-white transition">Forgot Password?</a></li>
                        <li><a href="#" className="hover:text-white transition">Open Account</a></li>
                        <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                        <li><a href="#" className="hover:text-white transition">After Sale Policy</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-3">Partner with Us</h4>
                    <ul className="space-y-2 text-sm text-orange-200">
                        <li><a href="#" className="hover:text-white transition">Seller Center</a></li>
                        <li><a href="#" className="hover:text-white transition">Payment Setup</a></li>
                        <li><a href="#" className="hover:text-white transition">SokoTiMami Policy</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-3">About Us</h4>
                    <ul className="space-y-2 text-sm text-orange-200">
                        <li><a href="#" className="hover:text-white transition">SokoTiMami Careers</a></li>
                        <li><a href="#" className="hover:text-white transition">Our Mission</a></li>
                        <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-3">International</h4>
                    <ul className="space-y-2 text-sm text-orange-200">
                        <li>Kenya</li>
                        <li>Uganda</li>
                        <li>Tanzania</li>
                    </ul>
                </div>
            </div>

            {/* Social and Copyright */}
            <div className="flex flex-col items-center pt-8">
                <div className="flex space-x-6 mb-4">
                    <a href="#" className="p-2 border border-white rounded-full hover:bg-white hover:text-orange-950 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-3 7h-2.5v-.5c0-.662.501-1.2 1.5-1.5h1v-2.5h-2c-1.895 0-3.5 1.583-3.5 4.5v2h-2v3h2v7h3v-7h2l1-3z" /></svg>
                    </a>
                    <a href="#" className="p-2 border border-white rounded-full hover:bg-white hover:text-orange-950 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-4.328 6.787c-.85-.18-1.558.17-2.072.76-.51.58-.755 1.34-.734 2.112l.067 1.439-1.995.002c-.172-.888-.363-1.685-.572-2.392-.578-1.921-1.587-3.085-2.585-3.328v1.734c.712.164 1.258.857 1.503 1.954l.32 1.488v.004l1.325 5.922h2.51v-7.394c0-1.077.307-2.074 1.705-2.074.887 0 1.22.457 1.22 1.391v7.625h2.509l.006-7.857c0-2.148-1.056-3.784-3.315-3.784z" /></svg>
                    </a>
                    <a href="#" className="p-2 border border-white rounded-full hover:bg-white hover:text-orange-950 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.64 0-5.88 1.956-6.88 3.73-1.01-1.774-3.25-3.73-6.88-3.73-4.665 0-7.865 3.197-7.865 8.125 0 4.927 3.2 8.125 7.865 8.125 3.63 0 5.87-1.956 6.88-3.73 1.01 1.774 3.25 3.73 6.88 3.73 4.665 0 7.865-3.198 7.865-8.125s-3.2-8.125-7.865-8.125zm-6.615 13.918c-.85 1.54-2.52 2.65-4.11 2.65s-3.26-.74-4.11-2.65c-1.59-2.91-1.76-6.73-1.76-8.995s.17-6.085 1.76-8.995c.85-1.54 2.52-2.65 4.11-2.65s3.26.74 4.11 2.65c1.59 2.91 1.76 6.73 1.76 8.995s-.17 6.085-1.76 8.995z" /></svg>
                    </a>
                </div>
                <p className="text-xs text-orange-200">
                    © 2025 Copyright: sokoTimamim.com
                </p>
            </div>

            {/* Patterned bottom border */}
            <div className="h-4 mt-4" style={{ backgroundImage: 'url("/images/pattern.png")', backgroundRepeat: 'repeat-x', backgroundSize: 'contain' }}>
            </div>
        </div>
    </footer>
);


export default Footer;