import React, { useState, useEffect } from 'react';
import { useUser } from "@clerk/clerk-react";
import { createClient } from '@supabase/supabase-js';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";
import { 
  Pencil, Save, X, User, Briefcase, 
  MapPin, Star, Globe, Link as LinkIcon, 
  FileText
} from 'lucide-react';

const ProfilePage = () => {
  const { user, isLoaded } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [editedData, setEditedData] = useState({});

  // Supabase client setup
  const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL1, 
    import.meta.env.VITE_SUPABASE_ANON_KEY1
  );

  // Predefined options (keeping previous definitions)
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

  // Utility functions (keeping previous implementations)
  const stringToArray = (value) => {
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') {
      return value.split(',').map(item => item.trim()).filter(item => item);
    }
    return [];
  };

  const formatArrayOrString = (value) => {
    if (Array.isArray(value)) return value.join(', ');
    return value || 'Not specified';
  };

  // Fetch profile data (keeping previous implementation)
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;

      try {
        const role = user.unsafeMetadata?.role;
        const tableName = role === 'candidate' 
          ? 'candidate_profiles' 
          : 'recruiter_profiles';

        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .eq('clerk_user_id', user.id)
          .single();

        if (error) throw error;

        // Ensure array fields are properly formatted
        if (role === 'candidate') {
          data.skills = stringToArray(data.skills);
          data.job_interests = stringToArray(data.job_interests);
        }

        setProfileData(data);
        setEditedData(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      }
    };

    if (isLoaded && user) {
      fetchProfileData();
    }
  }, [user, isLoaded]);

  // Handle input changes during editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle select changes during editing
  const handleSelectChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Save profile updates
  const handleSaveProfile = async () => {
    try {
      const role = user.unsafeMetadata?.role;
      const tableName = role === 'candidate' 
        ? 'candidate_profiles' 
        : 'recruiter_profiles';

      // Prepare update data
      const updateData = { ...editedData };
      
      // Remove unnecessary fields
      delete updateData.id;
      delete updateData.created_at;
      delete updateData.clerk_user_id;
      delete updateData.email;

      // Handle array fields for candidates
      if (role === 'candidate') {
        updateData.skills = stringToArray(updateData.skills);
        updateData.job_interests = stringToArray(updateData.job_interests);
      }

      // Perform the update
      const { error } = await supabase
        .from(tableName)
        .update(updateData)
        .eq('clerk_user_id', user.id);

      if (error) throw error;

      // Refresh data
      setProfileData(updateData);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  // Render candidate profile
  const renderCandidateProfile = () => {
    if (isEditing) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Header */}
          <div className="col-span-full flex items-center space-x-6 mb-6">
            <img 
              src={user.imageUrl} 
              alt="Profile" 
              className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-white"
            />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{user.fullName}</h2>
              <p className="text-gray-600">{user.primaryEmailAddress.emailAddress}</p>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
              <Input
                name="full_name"
                value={editedData.full_name || ''}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Experience Level</label>
              <Select
                value={editedData.experience_level}
                onValueChange={(value) => handleSelectChange('experience_level', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Location Preference</label>
              <Input
                name="location_preference"
                value={editedData.location_preference || ''}
                onChange={handleInputChange}
                placeholder="Enter preferred location"
              />
            </div>
          </div>

          {/* Professional Details */}
          <div className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Skills</label>
              <Input
                name="skills"
                value={formatArrayOrString(editedData.skills)}
                onChange={handleInputChange}
                placeholder="Enter skills (comma-separated)"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Job Interests</label>
              <Input
                name="job_interests"
                value={formatArrayOrString(editedData.job_interests)}
                onChange={handleInputChange}
                placeholder="Enter job interests (comma-separated)"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">About Me</label>
              <Input
                name="about_me"
                value={editedData.about_me || ''}
                onChange={handleInputChange}
                placeholder="Tell us about yourself"
              />
            </div>
          </div>

          {/* Links Section */}
          <div className="col-span-full space-y-4 mt-6">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Professional Links</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Input
                name="github_link"
                value={editedData.github_link || ''}
                onChange={handleInputChange}
                placeholder="GitHub Profile URL"
              />
              <Input
                name="linkedin_link"
                value={editedData.linkedin_link || ''}
                onChange={handleInputChange}
                placeholder="LinkedIn Profile URL"
              />
              <Input
                name="other_links"
                value={editedData.other_links || ''}
                onChange={handleInputChange}
                placeholder="Other Links"
              />
            </div>
          </div>
        </div>
      );
    }

    // Non-editing view
    return (
      <div className="space-y-8 bg-white shadow-lg rounded-xl p-8">
        {/* Profile Header */}
        <div className="flex items-center space-x-6 border-b pb-6">
          <img 
            src={user.imageUrl} 
            alt="Profile" 
            className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-blue-100"
          />
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              {profileData?.full_name || user.fullName}
            </h2>
            <p className="text-gray-600">{user.primaryEmailAddress.emailAddress}</p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <ProfileInfoItem 
              icon={<Star className="h-6 w-6 text-blue-500" />}
              label="Experience Level"
              value={profileData?.experience_level}
            />
            <ProfileInfoItem 
              icon={<MapPin className="h-6 w-6 text-blue-500" />}
              label="Location Preference"
              value={profileData?.location_preference}
            />
          </div>
          
          <div className="space-y-4">
            <ProfileInfoItem 
              icon={<Briefcase className="h-6 w-6 text-blue-500" />}
              label="Skills"
              value={formatArrayOrString(profileData?.skills)}
            />
            <ProfileInfoItem 
              icon={<Star className="h-6 w-6 text-blue-500" />}
              label="Job Interests"
              value={formatArrayOrString(profileData?.job_interests)}
            />
          </div>
          
          {profileData?.about_me && (
            <div className="col-span-full">
              <div className="flex items-start space-x-3 bg-blue-50 p-4 rounded-lg">
                <FileText className="h-6 w-6 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">About Me</h3>
                  <p className="text-gray-600 break-words whitespace-pre-wrap">
                    {profileData.about_me}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Links Section */}
          <div className="col-span-full mt-6">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Professional Links</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {profileData?.github_link && (
                <ProfileLinkItem 
                  icon={<LinkIcon className="h-6 w-6 text-blue-500" />}
                  label="GitHub"
                  link={profileData?.github_link}
                />
              )}
              {profileData?.linkedin_link && (
                <ProfileLinkItem 
                  icon={<LinkIcon className="h-6 w-6 text-blue-500" />}
                  label="LinkedIn"
                  link={profileData?.linkedin_link}
                />
              )}
              {profileData?.other_links && (
                <ProfileLinkItem 
                  icon={<LinkIcon className="h-6 w-6 text-blue-500" />}
                  label="Other Links"
                  link={profileData?.other_links}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render recruiter profile
  const renderRecruiterProfile = () => {
    if (isEditing) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="col-span-full">
            <label className="block text-gray-700 font-semibold mb-2">Company Name</label>
            <Input
              name="company_name"
              value={editedData.company_name || ''}
              onChange={handleInputChange}
              placeholder="Enter company name"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Sector</label>
            <Select
              value={editedData.sector}
              onValueChange={(value) => handleSelectChange('sector', value)}
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
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Company Size</label>
            <Select
              value={editedData.company_size}
              onValueChange={(value) => handleSelectChange('company_size', value)}
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
          </div>

          <div className="col-span-full">
            <label className="block text-gray-700 font-semibold mb-2">Company Website</label>
            <Input
              name="company_website"
              value={editedData.company_website || ''}
              onChange={handleInputChange}
              placeholder="Enter company website URL"
            />
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white shadow-lg rounded-xl p-8 space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">Company Profile</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <ProfileInfoItem 
            icon={<Briefcase className="h-6 w-6 text-blue-500" />}
            label="Company Name"
            value={profileData?.company_name}
          />
          <ProfileInfoItem 
            icon={<Star className="h-6 w-6 text-blue-500" />}
            label="Sector"
            value={profileData?.sector}
          />
          <ProfileInfoItem 
            icon={<User className="h-6 w-6 text-blue-500" />}
            label="Company Size"
            value={`${profileData?.company_size} Employees`}
          />
          {profileData?.company_website && (
            <ProfileLinkItem 
              icon={<Globe className="h-6 w-6 text-blue-500" />}
              label="Company Website"
              link={profileData?.company_website}
            />
          )}
        </div>
      </div>
    );
  };

  // Reusable profile info item component
  const ProfileInfoItem = ({ icon, label, value }) => (
    <div className="flex items-center space-x-4 bg-blue-50 p-4 rounded-lg">
      {icon}
      <div>
        <span className="font-semibold text-gray-700 block mb-1">{label}</span> 
        <span className="text-gray-600">{value || 'Not specified'}</span>
      </div>
    </div>
  );

  // Reusable profile link item component
  const ProfileLinkItem = ({ icon, label, link }) => (
    <div className="flex items-center space-x-4 bg-blue-50 p-4 rounded-lg">
      {icon}
      <div className="min-w-0 flex-grow">
        <span className="font-semibold text-gray-700 block mb-1">{label}</span> 
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 hover:underline truncate block max-w-full overflow-hidden text-ellipsis"
        >
          {link}
        </a>
      </div>
    </div>
  );
  // Loading state
  if (!isLoaded || !profileData) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="animate-pulse text-xl text-gray-600">Loading profile...</div>
      </div>
    );
  }

  // Main profile render
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">
              {user.unsafeMetadata?.role === 'candidate' 
                ? 'Candidate Profile' 
                : 'Recruiter Profile'}
            </h1>
            <div className="flex space-x-2">
              {!isEditing ? (
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="bg-white/20 text-white hover:bg-white/30"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="h-5 w-5" />
                </Button>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="bg-green-500 text-white hover:bg-green-600"
                    onClick={handleSaveProfile}
                  >
                    <Save className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="bg-red-500 text-white hover:bg-red-600"
                    onClick={() => {
                      setIsEditing(false);
                      setEditedData(profileData);
                    }}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="p-8">
            {user.unsafeMetadata?.role === 'candidate' 
              ? renderCandidateProfile() 
              : renderRecruiterProfile()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;