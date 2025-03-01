import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import companies from "../data/companies.json";
import faqs from "../data/faq.json";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { ArrowUpRight, FileText, Bell, Search, Layout, X } from "lucide-react";
import { useState, useEffect } from "react";


const LandingPage = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [chatWidgetOpen, setChatWidgetOpen] = useState(false);

  // Set mounted state to true after component mounts
  // This prevents hero section from overlaying login page
  useEffect(() => {
    // Create script element
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = `
      (function(d, t) {
        var v = d.createElement(t), s = d.getElementsByTagName(t)[0];
        v.onload = function() {
          window.voiceflow.chat.load({
            verify: { projectID: '67c28fd1b20e19cdb7e90b33' },
            url: 'https://general-runtime.voiceflow.com',
            versionID: 'production', 
            voice: { 
              url: "https://runtime-api.voiceflow.com" 
            }
          });
          
          // Add event listener for chat widget opening
          document.addEventListener('voiceflow:chat:open', () => {
            setChatWidgetOpen(true);
          });
          
          // Add event listener for chat widget closing
          document.addEventListener('voiceflow:chat:close', () => {
            setChatWidgetOpen(false);
          });
        }
        v.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs"; v.type = "text/javascript"; s.parentNode.insertBefore(v, s);
      })(document, 'script');
    `;
    
    // Append script to body
    document.body.appendChild(script);
    
    // Cleanup function
    return () => {
      document.body.removeChild(script);
      document.removeEventListener('voiceflow:chat:open', () => {});
      document.removeEventListener('voiceflow:chat:close', () => {});
    };
  }, []); // Empty dependency array means this runs once on mount

  // Add custom close button for chat widget
  useEffect(() => {
    if (chatWidgetOpen) {
      const checkForChatWidget = setInterval(() => {
        const chatWidget = document.querySelector('.vf-widget-container');
        if (chatWidget && !document.querySelector('#custom-close-btn')) {
          clearInterval(checkForChatWidget);
          
          // Create close button
          const closeBtn = document.createElement('button');
          closeBtn.id = 'custom-close-btn';
          closeBtn.innerHTML = '✕';
          closeBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.1);
            border: none;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 10000;
            color: #333;
            font-size: 16px;
          `;
          
          closeBtn.addEventListener('click', () => {
            if (window.voiceflow && window.voiceflow.chat) {
              window.voiceflow.chat.close();
            }
          });
          
          // Append close button to chat widget
          chatWidget.appendChild(closeBtn);
        }
      }, 100);
      
      return () => clearInterval(checkForChatWidget);
    }
  }, [chatWidgetOpen]);

  useEffect(() => {
    setMounted(true);
    
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  // Don't render content until component is mounted
  if (!mounted) return null;

  // Updated feature cards based on the provided information
  const featureCards = [
    {
      id: 1,
      title: "Interactive Dashboard",
      description: "Personalized dashboards for students and admins to manage applications and opportunities",
      icon: <Layout className="h-10 w-10 text-blue-500" />,
      color: "bg-blue-100 dark:bg-blue-950",
    },
    {
      id: 2,
      title: "Profile & Resume Builder",
      description: "Create detailed student profiles and upload resumes to enhance visibility to recruiters",
      icon: <FileText className="h-10 w-10 text-purple-500" />,
      color: "bg-purple-100 dark:bg-purple-950",
    },
    {
      id: 3,
      title: "Keyword-Based Search",
      description: "Search and discover job opportunities using specific keywords relevant to your skills",
      icon: <Search className="h-10 w-10 text-green-500" />,
      color: "bg-green-100 dark:bg-green-950",
    },
    
    {
        id: 4,
        title: "ATS Score Checker",
        description: "Test your resume against Applicant Tracking Systems and get recommendations to improve visibility",
        icon: <FileText className="h-10 w-10 text-amber-500" />,
        color: "bg-amber-100 dark:bg-amber-950",
    }
  ];

  return (
    <main className="flex flex-col gap-16 ">
      {/* Hero Section - With Animated Background */}
      <section id="hero" className="relative overflow-hidden min-h-[600px] flex items-center">
        {/* Animated background elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-3xl">
          <div className="absolute w-64 h-64 rounded-full bg-blue-500/20 top-1/4 left-1/3 animate-pulse" style={{ animationDuration: '8s' }}></div>
          <div className="absolute w-48 h-48 rounded-full bg-purple-500/20 bottom-1/4 right-1/3 animate-pulse" style={{ animationDuration: '6s' }}></div>
          <div className="absolute w-32 h-32 rounded-full bg-green-500/20 top-1/2 right-1/4 animate-pulse" style={{ animationDuration: '10s' }}></div>
          <div className="absolute w-40 h-40 rounded-full bg-amber-500/20 bottom-1/3 left-1/4 animate-pulse" style={{ animationDuration: '7s' }}></div>
          
          {/* Code-like elements */}
          <div className="absolute top-20 left-20 text-blue-600/20 text-4xl font-mono">{`{ }`}</div>
          <div className="absolute bottom-20 right-20 text-purple-600/20 text-4xl font-mono">{`</>`}</div>
          <div className="absolute top-1/3 right-40 text-green-600/20 text-3xl font-mono">function()</div>
          <div className="absolute bottom-1/3 left-40 text-amber-600/20 text-3xl font-mono">.then()</div>
        </div>
        
        <div className="relative container mx-auto px-4 py-16 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 max-w-2xl">
            <h1 className="font-extrabold text-5xl sm:text-6xl lg:text-7xl tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              Hack Your Way to the Perfect Career
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-6 text-lg sm:text-xl">
              Built for the tech community by the tech community. Find your dream job or the perfect candidate - all in one place.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <Link to={"/jobs"}>
                <Button variant="outline" size="lg" className="bg-blue-600 text-white border-2 border-blue-600">
                  Browse Jobs
                </Button>
              </Link>
              <Link to={"/post-job"}>
                <Button variant="outline" size="lg" className="bg-blue-600 text-white border-2 border-blue-600">
                  Post a Job
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            {/* Code-like visual element instead of static SVG */}
            <div className="w-full max-w-md h-80 relative bg-gray-900/10 dark:bg-gray-800/20 rounded-lg p-6 backdrop-blur-sm">
              <div className="absolute top-4 left-4 flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="font-mono text-sm mt-6 space-y-2 text-gray-700 dark:text-gray-300">
                <div className="text-blue-600 dark:text-blue-400">class <span className="text-purple-600 dark:text-purple-400">Developer</span> {"{"}</div>
                <div className="pl-4">constructor() {"{"}</div>
                <div className="pl-8">this.skills = [];</div>
                <div className="pl-8">this.experience = [];</div>
                <div className="pl-8">this.lookingFor = 'dream job';</div>
                <div className="pl-4">{"}"}</div>
                <div className="pl-4 text-green-600 dark:text-green-400">findJob(preferences) {"{"}</div>
                <div className="pl-8">return new Promise(resolve {"=>"} {"{"}</div>
                <div className="pl-12">// Your perfect match is waiting</div>
                <div className="pl-12 text-amber-600 dark:text-amber-400">resolve(HackMatrixHackathon.match(this));</div>
                <div className="pl-8">{"})"}</div>
                <div className="pl-4">{"}"}</div>
                <div>{"}"}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="container mx-auto px-4 py-8 transition-transform duration-500" id="about">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Built During <span className="text-blue-600">HackMatrix Hackathon 2025</span></h2>
          <p className="text-gray-600 dark:text-gray-300">
          Developed in 24 hours, our platform simplifies job searching for students with personalized dashboards, resume uploads, keyword-based job postings, and ATS Testing—connecting students with the right opportunities effortlessly.
          </p>
        </div>
      </section>

      {/* Rest of the content remains the same... */}
      {/* Interactive Feature Cards */}
      <section className="container mx-auto px-4 py-8 transition-transform duration-500" id="features">
        <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureCards.map((card) => (
            <Card 
              key={card.id}
              className={`transition-all duration-300 ${hoveredCard === card.id ? 'transform -translate-y-2 shadow-lg' : 'shadow'}`}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <CardHeader className={`rounded-t-lg ${card.color} transition-colors duration-300`}>
                <div className="flex justify-center py-4">
                  {card.icon}
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <CardTitle className="text-xl mb-2">{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="text-blue-600 p-0 hover:bg-transparent hover:underline transition-all duration-300">
                  Learn more <ArrowUpRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-16 transition-all duration-500" id="companies">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold text-center mb-12">Trusted by Top Companies</h2>
    <Carousel
      plugins={[Autoplay({ delay: 2000 })]}
      className="w-full max-w-5xl mx-auto"
    >
      <CarouselContent className="flex items-center gap-8 py-6">
        {companies.map(({ name, id, path }) => (
          <CarouselItem key={id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/6">
            <div className="backdrop-blur-sm bg-white/30 dark:bg-gray-800/30 rounded-lg p-4 h-24 flex items-center justify-center shadow-sm border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:scale-105 hover:shadow-md">
              <img src={path} alt={name} className="h-12 sm:h-16 object-contain" />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  </div>
</section>
      {/* User Types Section */}
      <section className="container mx-auto px-4 py-8 transition-all duration-500" id="user-types">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-2xl p-8 shadow-md transition-transform duration-300 hover:-translate-y-1">
            <h3 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">For Students</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="rounded-full bg-blue-200 dark:bg-blue-800 p-1 mr-3 mt-1">
                  <svg className="h-4 w-4 text-blue-700 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Personalized dashboard to track applications and opportunities</span>
              </li>
              <li className="flex items-start">
                <div className="rounded-full bg-blue-200 dark:bg-blue-800 p-1 mr-3 mt-1">
                  <svg className="h-4 w-4 text-blue-700 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Create detailed profiles and upload resumes for better visibility</span>
              </li>
              <li className="flex items-start">
                <div className="rounded-full bg-blue-200 dark:bg-blue-800 p-1 mr-3 mt-1">
                  <svg className="h-4 w-4 text-blue-700 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Test your resume against Applicant Tracking Systems and get recommendations to improve visibility</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-2xl p-8 shadow-md transition-transform duration-300 hover:-translate-y-1">
            <h3 className="text-2xl font-bold mb-4 text-purple-600 dark:text-purple-400">For Admins</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="rounded-full bg-purple-200 dark:bg-purple-800 p-1 mr-3 mt-1">
                  <svg className="h-4 w-4 text-purple-700 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Post job opportunities with specific keywords for better targeting</span>
              </li>
              <li className="flex items-start">
                <div className="rounded-full bg-purple-200 dark:bg-purple-800 p-1 mr-3 mt-1">
                  <svg className="h-4 w-4 text-purple-700 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Manage student applications through an intuitive admin dashboard</span>
              </li>
              <li className="flex items-start">
                <div className="rounded-full bg-purple-200 dark:bg-purple-800 p-1 mr-3 mt-1">
                  <svg className="h-4 w-4 text-purple-700 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Access analytics on job postings and student engagement</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16 transition-all duration-500" id="faq">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index + 1}`} 
                className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 mb-4 rounded-lg shadow-sm border border-blue-100 dark:border-blue-900 overflow-hidden transition-all duration-300"
              >
                <AccordionTrigger className="px-6 py-4 text-left font-medium hover:bg-blue-100/50 dark:hover:bg-blue-900/30 transition-colors duration-300">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600 dark:text-gray-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Custom styles for chat widget close button */}
      <style>
        {`
          .vf-widget__button-icon {
            transition: all 0.3s ease;
          }
          #custom-close-btn:hover {
            background: rgba(0, 0, 0, 0.2);
            transform: rotate(90deg);
          }
        `}
      </style>
    </main>
  );
};

export default LandingPage;