import React, { useState } from 'react';
import axios from 'axios';
import { FileText, TrendingUp, Award, AlertTriangle, BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/clerk-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Separator } from "@/components/ui/separator";

const ATSCheckerPage = () => {
  const { user } = useUser();
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  const parseAnalysis = (analysisText) => {
    try {
      // More robust parsing for score
      const extractScore = () => {
        // Try multiple parsing strategies
        const scorePatterns = [
          /Combat Rating \(0-100\):\s*(\d+)/,
          /Combat Rating:\s*(\d+)/,
          /Score:\s*(\d+)/,
          /ATS Score:\s*(\d+)/
        ];

        for (let pattern of scorePatterns) {
          const match = analysisText.match(pattern);
          if (match) {
            const score = parseInt(match[1], 10);
            return Math.min(Math.max(score, 0), 100);
          }
        }

        // If no pattern matches, try extracting first number
        const numberMatch = analysisText.match(/(\d+)/);
        if (numberMatch) {
          const score = parseInt(numberMatch[1], 10);
          return Math.min(Math.max(score, 0), 100);
        }

        return 50; // Default score if nothing found
      };

      const strengthsMatch = analysisText.match(/Strengths:\s*(.*?)(?=Weaknesses:|$)/s);
      const weaknessesMatch = analysisText.match(/Weaknesses:\s*(.*?)(?=Missing Skills & Keywords:|$)/s);
      const missingSkillsMatch = analysisText.match(/Missing Skills & Keywords:\s*(.*?)(?=Optimization Strategy:|$)/s);
      const optimizationStrategyMatch = analysisText.match(/Optimization Strategy:\s*(.*)/s);

      const cleanupList = (match) => {
        if (!match) return [];
        return match[1].trim().split('\n')
          .map(s => s.replace(/^[-*]+\s*/, '').trim()) // Remove asterisks and leading dashes
          .filter(s => s && s !== '*') // Remove empty or lone asterisk entries
          .map(s => {
            // Remove bold markers
            return s.replace(/\*\*/g, '').trim();
          });
      };

      return {
        combatRating: extractScore(),
        strengths: cleanupList(strengthsMatch),
        weaknesses: cleanupList(weaknessesMatch),
        missingSkills: cleanupList(missingSkillsMatch),
        optimizationStrategy: cleanupList(optimizationStrategyMatch)
      };
    } catch (err) {
      console.error('Parsing error:', err);
      return {
        combatRating: 50,
        strengths: [],
        weaknesses: [],
        missingSkills: [],
        optimizationStrategy: []
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please log in to use ATS Checker');
      return;
    }

    if (!file || !jobDescription) {
      setError('Please upload a resume and provide a job description');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('job_description', jobDescription);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_FASTAPI_URL}/api/ats-check`, 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      const parsedAnalysis = parseAnalysis(response.data.analysis);
      setAnalysis(parsedAnalysis);
    } catch (err) {
      console.error('ATS Analysis Error:', err);
      setError('Failed to analyze resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderScorePieChart = (score) => {
    const data = [
      { name: 'Score', value: score },
      { name: 'Remaining', value: 100 - score }
    ];

    const COLORS = ['#10B981', '#E5E7EB']; // Emerald for score, light gray for remaining

    return (
      <div className="w-full h-48">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="text-center text-xl font-bold text-emerald-600 dark:text-emerald-400">
          ATS Score: {score}/100
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-6 w-6" />
            ATS Resume Analyzer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="job-description" className="block mb-2 font-medium">
                Job Description
              </label>
              <Textarea
                id="job-description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full"
                rows={4}
                required
              />
            </div>

            <div>
              <label htmlFor="resume-upload" className="block mb-2 font-medium">
                Upload Resume (PDF)
              </label>
              <Input
                id="resume-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                required
                className="w-full h-14 bg-white text-black dark:bg-gray-800 dark:text-white 
  file:mr-4 file:rounded-full file:border-0 file:bg-gray-100 file:text-black
  file:px-4 file:py-2 file:text-sm file:font-semibold 
  hover:file:bg-gray-200 hover:file:text-black 
  dark:file:bg-gray-700 dark:file:text-white 
  dark:hover:file:bg-gray-600 dark:hover:file:text-white"

              />
            </div>

            {error && (
              <div className="text-red-500 text-sm mb-4">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Analyzing...' : 'Check ATS Compatibility'}
            </Button>
            {analysis && (
              <div className="space-y-6 mt-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookOpen className="mr-2 h-5 w-5" /> Overall ATS Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {renderScorePieChart(analysis.combatRating)}
                  </CardContent>
                </Card>

                <Separator />

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-emerald-600 dark:text-emerald-400">
                      <TrendingUp className="mr-2 h-5 w-5" /> Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 pl-4 list-disc">
                      {analysis.strengths.length > 0 ? (
                        analysis.strengths.map((strength, index) => (
                          <li 
                            key={index} 
                            className="text-sm text-gray-700 dark:text-gray-300"
                          >
                            {strength}
                          </li>
                        ))
                      ) : (
                        <p className="text-gray-500 italic">No specific strengths identified.</p>
                      )}
                    </ul>
                  </CardContent>
                </Card>

                <Separator />

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-red-600 dark:text-red-400">
                      <AlertTriangle className="mr-2 h-5 w-5" /> Weaknesses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 pl-4 list-disc">
                      {analysis.weaknesses.length > 0 ? (
                        analysis.weaknesses.map((weakness, index) => (
                          <li 
                            key={index} 
                            className="text-sm text-gray-700 dark:text-gray-300"
                          >
                            {weakness}
                          </li>
                        ))
                      ) : (
                        <p className="text-gray-500 italic">No specific weaknesses identified.</p>
                      )}
                    </ul>
                  </CardContent>
                </Card>

                <Separator />

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-yellow-600 dark:text-yellow-400">
                      <Award className="mr-2 h-5 w-5" /> Missing Skills & Keywords
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 pl-4 list-disc">
                      {analysis.missingSkills.length > 0 ? (
                        analysis.missingSkills.map((skill, index) => (
                          <li 
                            key={index} 
                            className="text-sm text-gray-700 dark:text-gray-300"
                          >
                            {skill}
                          </li>
                        ))
                      ) : (
                        <p className="text-gray-500 italic">No missing skills identified.</p>
                      )}
                    </ul>
                  </CardContent>
                </Card>

                <Separator />

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-blue-600 dark:text-blue-400">
                      Optimization Strategy
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-2 pl-4 list-decimal">
                      {analysis.optimizationStrategy.length > 0 ? (
                        analysis.optimizationStrategy.map((step, index) => (
                          <li 
                            key={index} 
                            className="text-sm text-gray-700 dark:text-gray-300"
                          >
                            {step}
                          </li>
                        ))
                      ) : (
                        <p className="text-gray-500 italic">No optimization steps provided.</p>
                      )}
                    </ol>
                  </CardContent>
                </Card>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ATSCheckerPage;