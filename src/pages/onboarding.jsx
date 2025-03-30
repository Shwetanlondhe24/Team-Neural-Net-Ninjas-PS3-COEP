// done - alert msg
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { createClient } from '@supabase/supabase-js';
import { toast } from "sonner";
import { Github, Linkedin, Link as LinkIcon, Users, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

const Onboarding = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  // Supabase client setup
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL1, 
    import.meta.env.VITE_SUPABASE_ANON_KEY1
  );

  // State for form data
  const [formData, setFormData] = useState({
    fullName: '',
    skills: '',
    jobInterests: '',
    locationPreference: '',
    experienceLevel: '',
    aboutMe: '',
    githubLink: '',
    linkedinLink: '',
    otherLinks: '',

    companyName: '',
    sector: '',
    companySize: '',
    companyWebsite: ''
  });

  // State to track current step
  const [currentStep, setCurrentStep] = useState('role');
  const [selectedRole, setSelectedRole] = useState(null);

  // Predefined options (keep existing)
  const SECTORS = [
    'Technology', 'Finance', 'Healthcare', 
    'Education', 'Retail', 'Manufacturing', 
    'Consulting', 'Automotive', 'Entertainment', 
    'Other'
  ];

  const EXPERIENCE_LEVELS = [
    'Entry Level', 'Mid Level', 'Senior Level', 
    'Executive', 'Internship'
  ];

  const COMPANY_SIZES = [
    '1-10', '11-50', '51-200', 
    '201-500', '501-1000', '1000+'
  ];

  // Validate company email
  const isValidCompanyEmail = (email) => {
    // List of invalid personal email domains
    const invalidDomains = [
      'gmail.com', 
      'yahoo.com', 
      'hotmail.com', 
      'outlook.com', 
      'icloud.com'
    ];

    // Extract domain from email
    const domain = email.split('@')[1]?.toLowerCase();

    // Check if domain is in invalid list or doesn't have at least two parts
    return domain && 
           !invalidDomains.includes(domain) && 
           domain.split('.').length >= 2;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle role selection
  const handleRoleSelection = (role) => {
    // Immediately check if user is trying to select recruiter
    if (role === 'recruiter') {
      const userEmail = user.emailAddresses[0].emailAddress;
      
      // Comprehensive email validation
      if (!isValidCompanyEmail(userEmail)) {
        // Show an immediate, prominent error
        toast.error('Invalid Email Domain', {
          description: 'Recruiters must use a company email domain. Personal email services are not allowed.',
          duration: 5000,
          position: 'top-center',
          style: {
            background: '#ff6b6b',
            color: 'white',
            border: '1px solid #ff4757'
          }
        });

        // Prevent role selection
        return;
      }
    }

    // If validation passes, set role and move to next step
    setSelectedRole(role);
    setCurrentStep('details');
  };

  // Render role selection step
  const renderRoleSelection = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Choose Your Path
        </h1>
        <p className="text-xl text-gray-600">Select your role to get started</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white shadow-xl rounded-2xl p-8 text-center transition-all duration-300 hover:shadow-2xl"
          onClick={() => handleRoleSelection("candidate")}
        >
          <Users className="mx-auto mb-6 text-indigo-600" size={80} />
          <h2 className="text-2xl font-bold mb-4 text-indigo-800">Candidate</h2>
          <p className="text-gray-600">
            Looking for exciting job opportunities and ready to showcase your skills
          </p>
          <Button variant="outline" className="mt-6 w-full">Select Candidate</Button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white shadow-xl rounded-2xl p-8 text-center transition-all duration-300 hover:shadow-2xl"
          onClick={() => handleRoleSelection("recruiter")}
        >
          <Briefcase className="mx-auto mb-6 text-purple-600" size={80} />
          <h2 className="text-2xl font-bold mb-4 text-purple-800">Recruiter</h2>
          <p className="text-gray-600">
            Seeking top talent and looking to expand your team
          </p>
          <Button variant="outline" className="mt-6 w-full">Select Recruiter</Button>
        </motion.div>
      </div>
    </div>
  );

  

  // Candidate form remains the same as in the previous implementation
  const renderCandidateForm = () => (
    <div className="max-w-md mx-auto mt-20 space-y-6">
      <h2 className="text-4xl font-bold text-center mb-8">Candidate Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Existing candidate form implementation */}
        <Input
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          placeholder="Full Name"
          required
        />
        <Input
          name="aboutMe"
          value={formData.aboutMe}
          onChange={handleInputChange}
          placeholder="About Me"
          className="h-24"
        />

        {/* Professional Links */}
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              name="githubLink"
              value={formData.githubLink}
              onChange={handleInputChange}
              placeholder="GitHub Profile"
              className="pl-10"
            />
          </div>
          <div className="relative flex-1">
            <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              name="linkedinLink"
              value={formData.linkedinLink}
              onChange={handleInputChange}
              placeholder="LinkedIn Profile"
              className="pl-10"
            />
          </div>
        </div>
        <div className="relative">
          <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            name="otherLinks"
            value={formData.otherLinks}
            onChange={handleInputChange}
            placeholder="Other Professional Links"
            className="pl-10"
          />
        </div>

        {/* Professional Details */}
        <Input
          name="skills"
          value={formData.skills}
          onChange={handleInputChange}
          placeholder="Skills (comma-separated)"
          required
        />
        <Input
          name="jobInterests"
          value={formData.jobInterests}
          onChange={handleInputChange}
          placeholder="Job Interests (comma-separated)"
          required
        />
        <Input
          name="locationPreference"
          value={formData.locationPreference}
          onChange={handleInputChange}
          placeholder="Location Preference"
          required
        />
        <Select 
          name="experienceLevel"
          onValueChange={(value) => setFormData(prev => ({
            ...prev, 
            experienceLevel: value
          }))}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Experience Level" />
          </SelectTrigger>
          <SelectContent>
            {EXPERIENCE_LEVELS.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type="submit" className="w-full">
          Complete Profile
        </Button>
      </form>
    </div>
  );

  
  // Submit form and save to Supabase
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Update user role in Clerk
      await user.update({ 
        unsafeMetadata: { 
          role: selectedRole,
          profileComplete: true 
        } 
      });

      // Prepare data for Supabase
      const profileData = {
        clerk_user_id: user.id,
        email: user.emailAddresses[0].emailAddress,
        ...(selectedRole === 'candidate' ? {
          full_name: formData.fullName,
          skills: formData.skills.split(',').map(skill => skill.trim()),
          job_interests: formData.jobInterests.split(',').map(interest => interest.trim()),
          location_preference: formData.locationPreference,
          experience_level: formData.experienceLevel,
          about_me: formData.aboutMe,
          github_link: formData.githubLink,
          linkedin_link: formData.linkedinLink,
          other_links: formData.otherLinks
        } : {
          company_name: formData.companyName,
          sector: formData.sector,
          company_size: formData.companySize,
          company_website: formData.companyWebsite || null
        })
      };

      // Insert or update profile in Supabase
      const { error } = await supabase
        .from(selectedRole === 'candidate' ? 'candidate_profiles' : 'recruiter_profiles')
        .upsert(profileData, { 
          onConflict: 'clerk_user_id' 
        });

      if (error) throw error;

      // Show success toast
      toast.success('Profile created successfully!');

      // Navigate based on role
      navigate(selectedRole === 'recruiter' ? "/post-job" : "/jobs");

    } catch (error) {
      console.error('Error submitting profile:', error);
      toast.error('Failed to create profile. Please try again.');
    }
  };


  // Recruiter form with optional company website
  const renderRecruiterForm = () => (
    <div className="max-w-md mx-auto mt-20 space-y-6">
      <h2 className="text-4xl font-bold text-center mb-8">Recruiter Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="companyName"
          value={formData.companyName}
          onChange={handleInputChange}
          placeholder="Company Name"
          required
        />
        <Select 
          name="sector"
          onValueChange={(value) => setFormData(prev => ({
            ...prev, 
            sector: value
          }))}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Sector" />
          </SelectTrigger>
          <SelectContent>
            {SECTORS.map((sector) => (
              <SelectItem key={sector} value={sector}>
                {sector}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select 
          name="companySize"
          onValueChange={(value) => setFormData(prev => ({
            ...prev, 
            companySize: value
          }))}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Company Size" />
          </SelectTrigger>
          <SelectContent>
            {COMPANY_SIZES.map((size) => (
              <SelectItem key={size} value={size}>
                {size} Employees
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          name="companyWebsite"
          value={formData.companyWebsite}
          onChange={handleInputChange}
          placeholder="Company Website (Optional)"
        />
        <Button type="submit" className="w-full">
          Complete Profile
        </Button>
      </form>
    </div>
  );

  // Check if user already has a role and redirect
  useEffect(() => {
    if (user?.unsafeMetadata?.role && user?.unsafeMetadata?.profileComplete) {
      navigate(user.unsafeMetadata.role === "recruiter" ? "/post-job" : "/jobs");
    }
  }, [user]);

  // Loading state
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  // Render appropriate step
  return (
    <div>
      {currentStep === 'role' && renderRoleSelection()}
      {currentStep === 'details' && selectedRole === 'candidate' && renderCandidateForm()}
      {currentStep === 'details' && selectedRole === 'recruiter' && renderRecruiterForm()}
    </div>
  );
};



export default Onboarding;