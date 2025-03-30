import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams, useLocation, useNavigate } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignIn,
  useUser,
} from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { BriefcaseBusiness, FileText, Heart, PenBox, User, LayoutGrid, Menu, X } from 'lucide-react';

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [search, setSearch] = useSearchParams();
  const { user } = useUser();
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toolsRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (search.get("sign-in")) {
      setShowSignIn(true);
    }

    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    const handleClickOutside = (event) => {
      if (toolsRef.current && !toolsRef.current.contains(event.target)) {
        setToolsOpen(false);
      }
      
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('click', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleClickOutside);
    };
  }, [search, scrolled, mobileMenuOpen]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowSignIn(false);
      setSearch({});
    }
  };

  const scrollToSection = (sectionId) => {
    // First, ensure we're on the home page
    if (location.pathname !== "/") {
      navigate("/");
    }

    // Use a small delay to ensure page has loaded before scrolling
    setTimeout(() => {
      const section = document.querySelector(sectionId);
      if (section) {
        const offset = 80; // Height of the navbar
        const elementPosition = section.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: elementPosition - offset,
          behavior: 'smooth'
        });
      }
      
      // Close mobile menu after navigation
      setMobileMenuOpen(false);
    }, 100);
  };

  const NavLink = ({ href, children, section }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = (e) => {
      e.preventDefault();
      
      // If it's a section link
      if (section) {
        // For both home page and other pages, use scrollToSection
        scrollToSection(href);
      }
    };

    return (
      <a 
        href={href} 
        onClick={handleClick}
        className="relative text-gray-700 dark:text-gray-200 font-medium py-2 transition-colors duration-300 group hover:text-blue-600 dark:hover:text-blue-400"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {children}
        <span 
          className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 transition-transform duration-300 ${isHovered ? 'scale-x-100' : ''}`}
        />
      </a>
    );
  };

  return (
    <>
      <nav 
        className={`py-4 px-4 fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled 
            ? "bg-white/90 dark:bg-slate-900/90 shadow-lg backdrop-blur-md" 
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <h1 className="font-extrabold text-xl sm:text-2xl lg:text-3xl tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-transparent bg-clip-text transition-all duration-300 hover:scale-105">
              Neural Net Ninjas
            </h1>
          </Link>

          <div className="flex items-center gap-8">
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-6">
              <NavLink href="#hero" section>Home</NavLink>
              <NavLink href="#about" section>About</NavLink>
              <NavLink href="#features" section>Features</NavLink>
              <NavLink href="#companies" section>Companies</NavLink>
              <NavLink href="#faq" section>FAQ</NavLink>
            </div>

            <div className="flex items-center space-x-4">
              <SignedOut>
                <Button 
                  variant="outline" 
                  onClick={() => setShowSignIn(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 hover:from-blue-700 hover:to-indigo-700 rounded-full px-6 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
                >
                  Login
                </Button>
              </SignedOut>

              <SignedIn>
                {user?.unsafeMetadata?.role === "recruiter" && (
                  <Link to="/post-job">
                    <Button 
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 hover:from-blue-700 hover:to-indigo-700 rounded-full px-6 transition-all duration-300 transform hover:scale-105 hover:shadow-md"
                    >
                      <PenBox size={18} className="mr-2" />
                      Post a Job
                    </Button>
                  </Link>
                )}

                {/* Tools Dropdown */}
                <div className="relative" ref={toolsRef}>
                  <button
                    className="p-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-600 dark:text-blue-400 hover:shadow-md transition-all duration-300"
                    onClick={() => setToolsOpen(prev => !prev)}
                    aria-label="Tools menu"
                  >
                    <LayoutGrid size={20} />
                  </button>

                  {toolsOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-4 transform transition-all duration-300 origin-top-right">
                      <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 border-b border-gray-200 dark:border-gray-700 pb-2">
                          Job Tools
                        </h3>
                        <Link 
                          to="/ats-checker" 
                          className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                        >
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center mr-3 text-blue-600 dark:text-blue-400">
                            <FileText size={16} />
                          </div>
                          ATS Checker
                        </Link>
                        <Link 
                          to="#" 
                          className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                        >
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center mr-3 text-purple-600 dark:text-purple-400">
                            <PenBox size={16} />
                          </div>
                          Resume Builder
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
                
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10 ring-2 ring-blue-200 dark:ring-blue-800 ring-offset-2 transition-all duration-300 hover:ring-blue-600",
                    },
                  }}
                >
                  <UserButton.MenuItems>
                    <UserButton.Link
                      label="My Profile"
                      labelIcon={<User size={15} />}
                      href="/profile"
                    />
                    <UserButton.Link
                      label="My Jobs"
                      labelIcon={<BriefcaseBusiness size={15} />}
                      href="/my-jobs"
                    />
                    <UserButton.Link
                      label="Saved Jobs"
                      labelIcon={<Heart size={15} />}
                      href="/saved-jobs"
                    />
                    <UserButton.Action label="manageAccount" />
                  </UserButton.MenuItems>
                </UserButton>
              </SignedIn>
              
              {/* Mobile Menu Button */}
              <button 
                className="md:hidden p-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-600 dark:text-blue-400 hover:shadow-md transition-all duration-300"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div 
          ref={mobileMenuRef}
          className={`fixed inset-0 bg-white dark:bg-slate-900 z-40 transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          } md:hidden`}
          style={{ top: '72px' }}
        >
          <div className="container mx-auto px-4 py-6 flex flex-col h-full">
            <div className="flex flex-col space-y-6 text-center">
              <a 
                href="#hero" 
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('#hero');
                }}
                className="text-lg font-medium py-3 border-b border-gray-200 dark:border-gray-800"
              >
                Home
              </a>
              <a 
                href="#about" 
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('#about');
                }}
                className="text-lg font-medium py-3 border-b border-gray-200 dark:border-gray-800"
              >
                About
              </a>
              <a 
                href="#features" 
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('#features');
                }}
                className="text-lg font-medium py-3 border-b border-gray-200 dark:border-gray-800"
              >
                Features
              </a>
              <a 
                href="#companies" 
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('#companies');
                }}
                className="text-lg font-medium py-3 border-b border-gray-200 dark:border-gray-800"
              >
                Companies
              </a>
              <a 
                href="#faq" 
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('#faq');
                }}
                className="text-lg font-medium py-3 border-b border-gray-200 dark:border-gray-800"
              >
                FAQ
              </a>
            </div>
            
            <div className="mt-auto pb-8">
              <SignedOut>
                <Button 
                  onClick={() => {
                    setShowSignIn(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 hover:from-blue-700 hover:to-indigo-700 rounded-full py-6 transition-all duration-300"
                >
                  Login
                </Button>
              </SignedOut>
            </div>
          </div>
        </div>
      </nav>

      {/* Add padding to account for fixed header */}
      <div className="h-20"></div> 

      {showSignIn && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 transition-all duration-300"
          onClick={handleOverlayClick}
        >
          <div className="animate-fadeIn">
            <SignIn
              signUpForceRedirectUrl="/onboarding"
              fallbackRedirectUrl="/onboarding"
            />
          </div>
        </div>
      )}
      
      {/* Custom styles */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out forwards;
          }
        `}
      </style>
    </>
  );
};

export default Header;