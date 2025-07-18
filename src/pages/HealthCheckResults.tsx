
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, AlertTriangle, User, Clock, Activity, FileText, Stethoscope, Pill } from 'lucide-react';

interface HealthCheckData {
  symptoms: string[];
  severity: string;
  duration: string;
  age?: number;
  height?: number;
  weight?: number;
  previous_conditions?: string[];
  medications?: string[];
  notes?: string;
  analysis_results?: any[];
  symptom_photos?: {[key: string]: string};
  comprehensive_analysis?: boolean;
  urgency_level?: string;
  overall_assessment?: string;
}

const HealthCheckResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const healthCheckData = location.state?.healthCheckData as HealthCheckData;

  useEffect(() => {
    if (!healthCheckData) {
      navigate('/health-check');
    }
  }, [healthCheckData, navigate]);

  // Add debugging to see what data we have
  useEffect(() => {
    if (healthCheckData) {
      console.log('Health check data in results:', healthCheckData);
      console.log('Analysis results:', healthCheckData.analysis_results);
      console.log('Number of analysis results:', healthCheckData.analysis_results?.length);
    }
  }, [healthCheckData]);

  if (!healthCheckData) {
    return null;
  }

  const getUrgencyVariant = (urgencyLevel: string) => {
    switch (urgencyLevel) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'outline';
      case 'low':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case 'severe':
        return 'text-red-600 bg-red-50';
      case 'moderate':
        return 'text-orange-600 bg-orange-50';
      case 'mild':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/health-check')} className="hover:bg-blue-100">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Health Check
            </Button>
          </div>
          <div className="text-center md:text-right">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Health Analysis Results</h1>
            <p className="text-gray-600">AI-powered comprehensive health assessment</p>
          </div>
        </div>

        {/* Emergency Alert */}
        {healthCheckData.urgency_level === 'high' && (
          <Card className="border-red-500 shadow-xl bg-gradient-to-r from-red-50 to-red-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-2xl font-bold text-red-700 flex items-center">
                <AlertTriangle className="mr-3 h-6 w-6" />
                Emergency Alert - Immediate Attention Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-800 text-lg">
                Based on your symptoms, a high level of urgency has been detected.
                It is strongly recommended to seek immediate medical attention.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Patient Info & Summary */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Patient Overview Card */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl flex items-center text-gray-800">
                    <User className="mr-3 h-6 w-6 text-blue-600" />
                    Patient Overview
                  </CardTitle>
                  {healthCheckData.urgency_level && (
                    <Badge 
                      variant={getUrgencyVariant(healthCheckData.urgency_level)}
                      className="text-sm font-semibold px-3 py-1"
                    >
                      {healthCheckData.urgency_level.toUpperCase()} URGENCY
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Physical Information */}
                {(healthCheckData.age || healthCheckData.height || healthCheckData.weight) && (
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                      <Activity className="mr-2 h-5 w-5" />
                      Physical Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {healthCheckData.age && (
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-700">{healthCheckData.age}</div>
                          <div className="text-sm text-blue-600">Years Old</div>
                        </div>
                      )}
                      {healthCheckData.height && (
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-700">{healthCheckData.height}</div>
                          <div className="text-sm text-blue-600">cm Height</div>
                        </div>
                      )}
                      {healthCheckData.weight && (
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-700">{healthCheckData.weight}</div>
                          <div className="text-sm text-blue-600">kg Weight</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Symptoms & Severity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <Stethoscope className="mr-2 h-5 w-5 text-purple-600" />
                      Severity Level
                    </h3>
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-semibold ${getSeverityColor(healthCheckData.severity)}`}>
                      {healthCheckData.severity}
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <Clock className="mr-2 h-5 w-5 text-green-600" />
                      Duration
                    </h3>
                    <div className="text-lg font-medium text-gray-700">{healthCheckData.duration}</div>
                  </div>
                </div>

                {/* Symptoms List */}
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Reported Symptoms</h3>
                  <div className="flex flex-wrap gap-2">
                    {healthCheckData.symptoms.map((symptom, index) => (
                      <Badge key={index} variant="outline" className="px-3 py-1 text-sm bg-purple-50 text-purple-700 border-purple-200">
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Overall Assessment */}
                {healthCheckData.overall_assessment && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                    <h3 className="font-semibold text-green-800 mb-2 flex items-center">
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Overall Assessment
                    </h3>
                    <p className="text-green-700">{healthCheckData.overall_assessment}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Medical History */}
            {((healthCheckData.previous_conditions && healthCheckData.previous_conditions.length > 0) || 
              (healthCheckData.medications && healthCheckData.medications.length > 0) || 
              healthCheckData.notes) && (
              <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center text-gray-800">
                    <FileText className="mr-3 h-5 w-5 text-purple-600" />
                    Medical History & Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {healthCheckData.previous_conditions && healthCheckData.previous_conditions.length > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <h4 className="font-semibold text-gray-800 mb-2">Previous Medical Conditions</h4>
                      <div className="flex flex-wrap gap-2">
                        {healthCheckData.previous_conditions.map((condition, index) => (
                          <Badge key={index} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {healthCheckData.medications && healthCheckData.medications.length > 0 && (
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                        <Pill className="mr-2 h-4 w-4" />
                        Current Medications
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {healthCheckData.medications.map((medication, index) => (
                          <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {medication}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {healthCheckData.notes && (
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <h4 className="font-semibold text-gray-800 mb-2">Additional Notes</h4>
                      <p className="text-gray-700">{healthCheckData.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Analysis Results */}
          <div className="space-y-6">
            
            {/* Potential Conditions */}
            {healthCheckData.analysis_results && healthCheckData.analysis_results.length > 0 ? (
              <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-50 to-yellow-50">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">Potential Conditions</CardTitle>
                  <CardDescription className="text-gray-600">
                    AI analysis found {healthCheckData.analysis_results.length} potential conditions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                  {healthCheckData.analysis_results.map((result: any, index: number) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 space-y-3 shadow-sm">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-lg text-gray-800">{result.name}</h4>
                        {result.matchScore && (
                          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                            {result.matchScore}% match
                          </Badge>
                        )}
                      </div>
                      
                      {result.description && (
                        <p className="text-sm text-gray-600 leading-relaxed">{result.description}</p>
                      )}
                      
                      {result.matchedSymptoms && result.matchedSymptoms.length > 0 && (
                        <div>
                          <h5 className="font-medium text-sm mb-2 text-gray-700">Matched Symptoms:</h5>
                          <div className="flex flex-wrap gap-1">
                            {result.matchedSymptoms.map((symptom: string, symIndex: number) => (
                              <Badge key={symIndex} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                {symptom}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {result.recommendedActions && result.recommendedActions.length > 0 && (
                        <div className="bg-blue-50 rounded-md p-3 border border-blue-200">
                          <h5 className="font-medium text-sm mb-2 text-blue-800">Recommended Actions:</h5>
                          <ul className="list-disc pl-4 text-sm space-y-1 text-blue-700">
                            {result.recommendedActions.map((action: string, actionIndex: number) => (
                              <li key={actionIndex}>{action}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-lg border-0 bg-gradient-to-br from-gray-50 to-gray-100">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">Analysis Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800">
                      {healthCheckData.analysis_results === undefined 
                        ? "No analysis results available. The analysis may not have completed successfully."
                        : "No potential conditions were identified based on the current symptoms and analysis."
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Next Steps */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-teal-50">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800 flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                  Next Steps
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Recommended actions based on your health analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Consult with a healthcare professional for further evaluation</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Monitor your symptoms and track any changes</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">Consider lifestyle adjustments to support your health</span>
                  </li>
                  {healthCheckData.urgency_level === 'high' && (
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-red-600 font-semibold">Seek immediate medical attention due to high urgency level</span>
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthCheckResults;
