"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import companies from "../data/companies.json"
import faqs from "../data/faq.json"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Link } from "react-router-dom"
import { ArrowUpRight, FileText, Search, Layout, Briefcase, Code, CheckCircle, ChevronRight } from "lucide-react"
import { useState, useEffect, useRef } from "react"

const LandingPage = () => {
  const [hoveredCard, setHoveredCard] = useState(null)
  const [mounted, setMounted] = useState(false)
  const [chatWidgetOpen, setChatWidgetOpen] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [titleIndex, setTitleIndex] = useState(0)
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const companiesRef = useRef(null)
  const userTypesRef = useRef(null)
  const faqRef = useRef(null)

  const titleTexts = ["Tech Career", "Dream Job", "Future Success", "Next Opportunity"]

  // Rotate through title texts
  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % titleTexts.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Handle scroll position for animations
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Set up Voiceflow chat widget
  useEffect(() => {
    const script = document.createElement("script")
    script.type = "text/javascript"
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
          
          document.addEventListener('voiceflow:chat:open', () => {
            setChatWidgetOpen(true);
          });
          
          document.addEventListener('voiceflow:chat:close', () => {
            setChatWidgetOpen(false);
          });
        }
        v.src = "https://cdn.voiceflow.com/widget-next/bundle.mjs"; v.type = "text/javascript"; s.parentNode.insertBefore(v, s);
      })(document, 'script');
    `

    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
      document.removeEventListener("voiceflow:chat:open", () => {})
      document.removeEventListener("voiceflow:chat:close", () => {})
    }
  }, [])

  // Add custom close button for chat widget
  useEffect(() => {
    if (chatWidgetOpen) {
      const checkForChatWidget = setInterval(() => {
        const chatWidget = document.querySelector(".vf-widget-container")
        if (chatWidget && !document.querySelector("#custom-close-btn")) {
          clearInterval(checkForChatWidget)

          const closeBtn = document.createElement("button")
          closeBtn.id = "custom-close-btn"
          closeBtn.innerHTML = "✕"
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
            transition: all 0.3s ease;
          `

          closeBtn.addEventListener("click", () => {
            if (window.voiceflow && window.voiceflow.chat) {
              window.voiceflow.chat.close()
            }
          })

          chatWidget.appendChild(closeBtn)
        }
      }, 100)

      return () => clearInterval(checkForChatWidget)
    }
  }, [chatWidgetOpen])

  useEffect(() => {
    setMounted(true)
    document.documentElement.style.scrollBehavior = "smooth"

    return () => {
      document.documentElement.style.scrollBehavior = "auto"
    }
  }, [])

  // Don't render content until component is mounted
  if (!mounted) return null

  // Updated feature cards with enhanced descriptions
  const featureCards = [
    {
      id: 1,
      title: "Interactive Dashboard",
      description:
        "Personalized dashboards with real-time updates, application tracking, and opportunity matching based on your profile",
      icon: <Layout className="h-10 w-10 text-white" />,
      color: "from-blue-600 to-blue-400",
      delay: 0,
    },
    {
      id: 2,
      title: "Profile & Resume Builder",
      description:
        "AI-powered resume builder with industry-specific templates and optimization tips to stand out to recruiters",
      icon: <FileText className="h-10 w-10 text-white" />,
      color: "from-purple-600 to-purple-400",
      delay: 0.1,
    },
    {
      id: 3,
      title: "Keyword-Based Search",
      description:
        "Advanced search algorithm that matches your skills and preferences with the perfect job opportunities",
      icon: <Search className="h-10 w-10 text-white" />,
      color: "from-green-600 to-green-400",
      delay: 0.2,
    },
    {
      id: 4,
      title: "ATS Score Checker",
      description:
        "Real-time resume analysis against top ATS systems with actionable feedback to boost your application success rate",
      icon: <CheckCircle className="h-10 w-10 text-white" />,
      color: "from-amber-600 to-amber-400",
      delay: 0.3,
    },
  ]

  // Check if element is in viewport for animations
  const isInViewport = (ref) => {
    if (!ref.current) return false
    const rect = ref.current.getBoundingClientRect()
    return rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8
  }

  return (
    <main className="flex flex-col overflow-hidden">
<section ref={heroRef} id="hero" className="relative min-h-[700px] flex items-center py-20 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-indigo-950/50 dark:to-slate-900 overflow-hidden">
  {/* Animated background particles */}
  <div className="absolute inset-0 pointer-events-none">
    {[...Array(30)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-white/20 dark:bg-white/10 animate-float"
        style={{
          width: `${Math.random() * 15 + 5}px`,
          height: `${Math.random() * 15 + 5}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 15 + 10}s`,
          animationDelay: `${Math.random() * 5}s`,
          opacity: Math.random() * 0.5 + 0.2,
        }}
      ></div>
    ))}
  </div>

  {/* Gradient overlay */}
  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-blue-50/50 to-purple-50/50 dark:from-slate-900/50 dark:via-indigo-950/30 dark:to-slate-900/50 opacity-100"></div>

  <div className="relative container mx-auto px-4 z-10">
    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
      <div className="flex-1 max-w-2xl text-center md:text-left animate-fade-in-up pl-4 md:pl-8 lg:pl-12">
      <div className="inline-block px-4 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-6 animate-pulse">
          <span className="text-sm font-medium">Built during HackMatrix Hackathon 2025</span>
        </div>

        <h1 className="font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-gray-900 dark:text-white mb-6">
          <span className="block mb-2">Launch Your</span>
          <span className="relative inline-block">
            <span className="text-changing-animation bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
              {titleTexts[titleIndex]}
            </span>
          </span>
          <span className="block mt-2">With Confidence</span>
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mt-4 text-lg max-w-xl mx-auto md:mx-0">
          Connect with top tech companies, optimize your resume for ATS systems, and find your dream job with our
          AI-powered platform.
        </p>

        <div className="flex flex-wrap gap-4 mt-8 justify-center md:justify-start">
          <Link to={"/jobs"}>
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg"
            >
              <Briefcase className="mr-2 h-5 w-5" />
              Browse Jobs
            </Button>
          </Link>
          <Link to={"/post-job"}>
            <Button
              variant="outline"
              size="lg"
              className="text-blue-600 border-2 border-blue-600 hover:bg-blue-50 rounded-full px-8 transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg"
            >
              <Code className="mr-2 h-5 w-5" />
              Post a Job
            </Button>
          </Link>
        </div>

        <div className="mt-12 flex items-center justify-center md:justify-start gap-4">
          <div className="flex -space-x-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-slate-700 bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-xs font-bold text-white"
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            <span className="font-bold">1,200+</span> developers found jobs last month
          </p>
        </div>
      </div>

      {/* Terminal UI Element - Optional, can be removed or modified */}
      <div className="flex-1 hidden md:flex justify-center animate-fade-in-right pr-4 md:pr-8 lg:pr-12">
                <div className="bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-700 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="bg-slate-900 px-4 py-2 flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-xs text-slate-400 font-mono ml-2">career.sh</div>
                  </div>

                  <div className="p-4 font-mono text-sm space-y-3 text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="text-green-400">$</span>
                      <span className="typing-animation">
                        find-tech-job --skills="react,node,typescript" --location="remote"
                      </span>
                    </div>

                    <div className="pl-4 text-blue-300">Searching for matching positions...</div>

                    <div className="pl-4 text-green-300">✓ Found 42 matching positions</div>

                    <div className="bg-slate-700/50 p-3 rounded-md border border-slate-600">
                      <div className="text-purple-300 font-semibold">Senior Frontend Developer</div>
                      <div className="text-slate-400">TechCorp Inc. • Remote • $120k-$150k</div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {["React", "TypeScript", "GraphQL"].map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-md text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-2 text-green-300 text-xs">ATS Score: 92% - Excellent Match!</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-green-400">$</span>
                      <span className="cursor-animation">_</span>
                    </div>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full blur-2xl opacity-20"></div>
                <div className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-full blur-2xl opacity-20"></div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
    <span className="text-blue-300 text-sm mb-2">Scroll to explore</span>
    <ChevronRight className="h-6 w-6 text-blue-300 transform rotate-90" />
  </div>
</section>

      {/* About Section with Stats - Teal/Green Gradient */}
      <section
        className="py-20 bg-gradient-to-b from-white via-teal-50 to-white dark:from-slate-900 dark:via-teal-950/20 dark:to-slate-900 transition-all duration-500"
        id="about"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <div className="inline-block px-4 py-1 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 mb-4">
                <span className="text-sm font-medium">Our Mission</span>
              </div>
              <h2 className="text-4xl font-bold mb-6">
                Revolutionizing <span className="text-teal-600 dark:text-teal-400">Tech Recruitment</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto">
                Developed during the 24-hour HackMatrix Hackathon, our platform bridges the gap between talented
                developers and innovative companies through AI-powered matching and ATS optimization.
              </p>
            </div>

            {/* Stats section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {[
                { value: "10,000+", label: "Active Users", icon: "👥" },
                { value: "5,000+", label: "Job Postings", icon: "💼" },
                { value: "85%", label: "Success Rate", icon: "🚀" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-white to-teal-50 dark:from-slate-800 dark:to-teal-900/20 p-8 rounded-2xl shadow-sm border border-teal-100 dark:border-teal-900/50 text-center transform transition-all duration-500 hover:scale-105 hover:shadow-lg"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-4xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-bold text-teal-600 dark:text-teal-400 mb-2 counter-animation">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards with Purple Gradient */}
      <section
        ref={featuresRef}
        className="py-20 bg-gradient-to-b from-white via-purple-50 to-white dark:from-slate-900 dark:via-purple-950/20 dark:to-slate-900 transition-all duration-500"
        id="features"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-block px-4 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 mb-4">
              <span className="text-sm font-medium">Platform Features</span>
            </div>
            <h2 className="text-4xl font-bold mb-6">
              Powerful Tools for Your <span className="text-purple-600 dark:text-purple-400">Career Journey</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto">
              Our comprehensive suite of features is designed to streamline your job search and help you land your dream
              role in tech.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featureCards.map((card, index) => (
              <div
                key={card.id}
                className={`transform transition-all duration-500 ${
                  isInViewport(featuresRef) ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
                }`}
                style={{ transitionDelay: `${card.delay}s` }}
                onMouseEnter={() => setHoveredCard(card.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Card className="h-full border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 transition-opacity duration-300 ${hoveredCard === card.id ? "opacity-5" : ""}`}
                  ></div>
                  <CardHeader className="relative pb-0">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 transform transition-transform duration-300 ${hoveredCard === card.id ? "scale-110" : ""}`}
                    >
                      {card.icon}
                    </div>
                    <CardTitle className="text-xl mb-2">{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <CardDescription className="text-gray-600 dark:text-gray-300">{card.description}</CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="ghost"
                      className="text-purple-600 dark:text-purple-400 p-0 hover:bg-transparent hover:text-purple-700 dark:hover:text-purple-300 group"
                    >
                      Learn more
                      <ArrowUpRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Companies Section with Amber/Orange Gradient */}
      <section
        ref={companiesRef}
        className="py-20 bg-gradient-to-b from-white via-amber-50 to-white dark:from-slate-900 dark:via-amber-950/20 dark:to-slate-900 transition-all duration-500 relative overflow-hidden"
        id="companies"
      >
        {/* Background elements */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-block px-4 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 mb-4">
              <span className="text-sm font-medium">Our Partners</span>
            </div>
            <h2 className="text-4xl font-bold mb-6">
              Trusted by <span className="text-amber-600 dark:text-amber-400">Industry Leaders</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto">
              Join thousands of developers who have found their dream jobs at these top tech companies.
            </p>
          </div>

          <div className={`transition-all duration-1000 ${isInViewport(companiesRef) ? "opacity-100" : "opacity-0"}`}>
            <Carousel
              plugins={[Autoplay({ delay: 2000 })]}
              className="w-full max-w-5xl mx-auto"
              opts={{
                loop: true,
                align: "start",
              }}
            >
              <CarouselContent className="py-8">
                {companies.map(({ name, id, path }) => (
                  <CarouselItem key={id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 pl-4">
                    <div className="h-24 p-4 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 shadow-md border border-amber-100 dark:border-amber-900/30 transition-all duration-300 hover:shadow-lg hover:scale-105">
                      <img
                        src={path || "/placeholder.svg"}
                        alt={name}
                        className="h-12 object-contain filter dark:brightness-90 dark:contrast-125"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
      </section>

      {/* User Types Section with Blue/Cyan Gradient */}
      <section
        ref={userTypesRef}
        className="py-20 bg-gradient-to-b from-white via-cyan-50 to-white dark:from-slate-900 dark:via-cyan-950/20 dark:to-slate-900 transition-all duration-500"
        id="user-types"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-block px-4 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 mb-4">
              <span className="text-sm font-medium">Who It's For</span>
            </div>
            <h2 className="text-4xl font-bold mb-6">
              Tailored for <span className="text-cyan-600 dark:text-cyan-400">Every User</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto">
              Whether you're looking for your next role or hiring top talent, our platform is designed with you in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div
              className={`transition-all duration-1000 ${
                isInViewport(userTypesRef) ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
              }`}
            >
              <div className="relative overflow-hidden rounded-3xl shadow-xl group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-400 opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

                <div className="relative p-8 md:p-10 z-10">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
                    <Briefcase className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold mb-4 text-white">For Job Seekers</h3>

                  <ul className="space-y-4">
                    {[
                      "Personalized dashboard to track applications",
                      "AI-powered resume builder and ATS optimization",
                      "Skill-based job matching algorithm",
                      "Interview preparation resources and coaching",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start text-white">
                        <div className="rounded-full bg-white/20 p-1 mr-3 mt-1">
                          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <Button className="mt-8 bg-white text-blue-600 hover:bg-blue-50 rounded-full px-6 transition-all duration-300">
                    Create Your Profile
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div
              className={`transition-all duration-1000 ${
                isInViewport(userTypesRef) ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
              }`}
              style={{ transitionDelay: "0.2s" }}
            >
              <div className="relative overflow-hidden rounded-3xl shadow-xl group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-400 opacity-90 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

                <div className="relative p-8 md:p-10 z-10">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
                    <Code className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold mb-4 text-white">For Employers</h3>

                  <ul className="space-y-4">
                    {[
                      "Post job opportunities with targeted keywords",
                      "Advanced candidate filtering and matching",
                      "Comprehensive analytics dashboard",
                      "Automated screening and interview scheduling",
                    ].map((item, index) => (
                      <li key={index} className="flex items-start text-white">
                        <div className="rounded-full bg-white/20 p-1 mr-3 mt-1">
                          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <Button className="mt-8 bg-white text-purple-600 hover:bg-purple-50 rounded-full px-6 transition-all duration-300">
                    Post a Job
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section with Pink/Rose Gradient */}
      <section
        ref={faqRef}
        className="py-20 bg-gradient-to-b from-white via-rose-50 to-white dark:from-slate-900 dark:via-rose-950/20 dark:to-slate-900 transition-all duration-500"
        id="faq"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 animate-fade-in-up">
              <div className="inline-block px-4 py-1 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 mb-4">
                <span className="text-sm font-medium">Common Questions</span>
              </div>
              <h2 className="text-4xl font-bold mb-6">
                Frequently Asked <span className="text-rose-600 dark:text-rose-400">Questions</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto">
                Find answers to the most common questions about our platform and services.
              </p>
            </div>

            <div
              className={`transition-all duration-1000 ${
                isInViewport(faqRef) ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
              }`}
            >
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index + 1}`}
                    className="mb-4 overflow-hidden border-0 rounded-xl"
                    style={{ transitionDelay: `${index * 0.1}s` }}
                  >
                    <div className="bg-white dark:bg-slate-800 shadow-md rounded-xl overflow-hidden">
                      <AccordionTrigger className="px-6 py-5 text-left font-medium hover:no-underline data-[state=open]:bg-rose-50 dark:data-[state=open]:bg-rose-900/20 transition-colors duration-300">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center mr-3 text-rose-600 dark:text-rose-400">
                            <span className="text-sm font-bold">{index + 1}</span>
                          </div>
                          {faq.question}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 py-4 text-gray-600 dark:text-gray-300 bg-white dark:bg-slate-800">
                        <div className="pl-11">{faq.answer}</div>
                      </AccordionContent>
                    </div>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>

{/* Call to Action Section with Refined Gradient */}
<section className="py-20 bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100 dark:from-slate-900 dark:via-indigo-950/50 dark:to-slate-900 relative overflow-hidden">
  <div className="absolute inset-0 pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-white/20 dark:bg-white/10 animate-float"
        style={{
          width: `${Math.random() * 15 + 5}px`,
          height: `${Math.random() * 15 + 5}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 15 + 10}s`,
          animationDelay: `${Math.random() * 5}s`,
          opacity: Math.random() * 0.5 + 0.2,
        }}
      ></div>
    ))}
  </div>

  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-blue-50/50 to-purple-50/50 dark:from-slate-900/50 dark:via-indigo-950/30 dark:to-slate-900/50 opacity-100"></div>

  <div className="container mx-auto px-4 relative z-10">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
        Ready to Accelerate Your Tech Career?
      </h2>
      <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
        Join thousands of developers who have found their dream jobs through our platform. It only takes a few minutes to get started.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        <Button
          size="lg"
          className="bg-blue-600 text-white hover:bg-blue-700 rounded-full px-8 transition-all duration-300 transform hover:scale-105"
        >
          <Briefcase className="mr-2 h-5 w-5" />
          Get Started
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="text-blue-600 border-2 border-blue-600 hover:bg-blue-50 rounded-full px-8 transition-all duration-300 transform hover:scale-105"
        >
          Learn More
        </Button>
      </div>
    </div>
  </div>
</section>

      {/* Custom styles for animations and chat widget */}
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
          }
          
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes fade-in-right {
            from { opacity: 0; transform: translateX(20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          
          .animate-float {
            animation-name: float;
            animation-timing-function: ease-in-out;
            animation-iteration-count: infinite;
          }
          
          .animate-fade-in-up {
            animation: fade-in-up 0.8s ease-out forwards;
          }
          
          .animate-fade-in-right {
            animation: fade-in-right 0.8s ease-out forwards;
          }
          
          .bg-grid-pattern {
            background-image: 
              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px);
            background-size: 20px 20px;
          }
          
          @keyframes typing {
            from { width: 0 }
            to { width: 100% }
          }
          
          .typing-animation {
            display: inline-block;
            overflow: hidden;
            white-space: nowrap;
            animation: typing 3s steps(40, end);
          }
          
          .typing-effect {
            border-right: 2px solid rgba(255,255,255,0.75);
            white-space: nowrap;
            overflow: hidden;
            display: inline-block;
            animation: typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite;
          }
          
          @keyframes typing {
            from { width: 0 }
            to { width: 100% }
          }
          
          @keyframes blink-caret {
            from, to { border-color: transparent }
            50% { border-color: rgba(255,255,255,0.75) }
          }
          
          .text-changing-animation {
            display: inline-block;
            opacity: 0;
            animation: fadeInOut 3s ease-in-out infinite;
            animation-delay: 0.5s;
          }
          
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(10px); }
            10% { opacity: 1; transform: translateY(0); }
            90% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-10px); }
          }
          
          @keyframes blink {
            from, to { opacity: 1 }
            50% { opacity: 0 }
          }
          
          .cursor-animation {
            animation: blink 1s step-end infinite;
          }
          
          @keyframes count-up {
            from { content: "0"; }
            to { content: attr(data-value); }
          }
          
          .counter-animation {
            position: relative;
          }
          
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
  )
}

export default LandingPage

