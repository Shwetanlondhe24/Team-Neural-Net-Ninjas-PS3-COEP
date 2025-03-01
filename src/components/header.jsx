import { useEffect, useState } from "react";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignIn,
  useUser,
} from "@clerk/clerk-react";
import { Button } from "./ui/button";
import { BriefcaseBusiness, Heart, PenBox } from "lucide-react";

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [search, setSearch] = useSearchParams();
  const { user } = useUser();
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (search.get("sign-in")) {
      setShowSignIn(true);
    }

    // Add scroll event listener to create effect when scrolling
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [search, scrolled]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowSignIn(false);
      setSearch({});
    }
  };

  // Check if we're on the homepage
  const isHomePage = location.pathname === "/";

  return (
    <>
      <nav className={`py-3 px-4 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 dark:bg-gray-900/90 shadow-md backdrop-blur-sm" : "bg-transparent"
      }`}>
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="font-extrabold text-xl sm:text-2xl lg:text-3xl tracking-tight bg-gradient-to-r from-blue-500 to-blue-800 text-transparent bg-clip-text">
            Neural Net Ninjas
          </h1>

          <div className="flex items-center gap-4 md:gap-8">
            <div className="hidden md:flex space-x-6">
              {isHomePage ? (
                <>
                  <a href="#hero" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</a>
                  <a href="#about" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</a>
                  <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</a>
                  <a href="#companies" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Companies</a>
                  <a href="#faq" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">FAQ</a>
                </>
              ) : (
                <>
                  <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
                  <Link to="/#about" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</Link>
                  <Link to="/#features" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Features</Link>
                  <Link to="/#companies" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Companies</Link>
                  <Link to="/#faq" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">FAQ</Link>
                </>
              )}
            </div>

            <SignedOut>
              <Button 
                variant="outline" 
                onClick={() => setShowSignIn(true)}
                className="bg-blue-600 text-white border-2 border-blue-600"
              >
                Login
              </Button>
            </SignedOut>
            <SignedIn>
              {user?.unsafeMetadata?.role === "recruiter" && (
                <Link to="/post-job">
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 transition-colors duration-300 rounded-lg"
                  >
                    <PenBox size={18} className="mr-2" />
                    Post a Job
                  </Button>
                </Link>
              )}
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10 ring-2 ring-blue-600 ring-offset-2 transition-all duration-300 hover:ring-purple-600",
                  },
                }}
              >
                <UserButton.MenuItems>
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
    </>
  );
};

export default Header;