
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={() => navigate('/health-check')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Health Check
        </Button>
        <h1 className="text-3xl font-bold text-medical-neutral-darkest">Health Check Results</h1>
      </div>

      {healthCheckData.urgency_level === 'high' && (
        <Card className="border-red-500 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold text-red-600 flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Emergency Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-red-700">
              Based on your symptoms, a high level of urgency has been detected.
              It is strongly recommended to seek immediate medical attention.
            </CardDescription>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Summary Card with urgency level and patient measurements */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Comprehensive Assessment Summary</CardTitle>
            {healthCheckData.urgency_level && (
              <Badge 
                variant={getUrgencyVariant(healthCheckData.urgency_level)}
                className="text-xs font-medium"
              >
                {healthCheckData.urgency_level.toUpperCase()} URGENCY
              </Badge>
            )}
          </div>
          <CardDescription>
            AI-powered analysis based on your symptoms and medical information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Symptoms</h3>
            <ul className="list-disc pl-5">
              {healthCheckData.symptoms.map((symptom, index) => (
                <li key={index}>{symptom}</li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold">Severity</h3>
              <p>{healthCheckData.severity}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Duration</h3>
              <p>{healthCheckData.duration}</p>
            </div>
          </div>

          {/* Patient Information Section - Enhanced to show in the main summary */}
          {(healthCheckData.age || healthCheckData.height || healthCheckData.weight) && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Patient Information</h3>
              <div className="grid gap-3 md:grid-cols-3 text-sm text-blue-700">
                {healthCheckData.age && (
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Age:</span> 
                    <span className="bg-blue-100 px-2 py-1 rounded">{healthCheckData.age} years</span>
                  </div>
                )}
                {healthCheckData.height && (
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Height:</span> 
                    <span className="bg-blue-100 px-2 py-1 rounded">{healthCheckData.height} cm</span>
                  </div>
                )}
                {healthCheckData.weight && (
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">Weight:</span> 
                    <span className="bg-blue-100 px-2 py-1 rounded">{healthCheckData.weight} kg</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {healthCheckData.previous_conditions && healthCheckData.previous_conditions.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Previous Medical Conditions</h3>
              <ul className="list-disc pl-5">
                {healthCheckData.previous_conditions.map((condition, index) => (
                  <li key={index}>{condition}</li>
                ))}
              </ul>
            </div>
          )}

          {healthCheckData.medications && healthCheckData.medications.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Current Medications</h3>
              <ul className="list-disc pl-5">
                {healthCheckData.medications.map((medication, index) => (
                  <li key={index}>{medication}</li>
                ))}
              </ul>
            </div>
          )}

          {healthCheckData.notes && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Additional Notes</h3>
              <p>{healthCheckData.notes}</p>
            </div>
          )}

          {healthCheckData.overall_assessment && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <h3 className="font-medium text-blue-800 mb-2">Overall Assessment</h3>
              <p className="text-sm text-blue-700">{healthCheckData.overall_assessment}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {healthCheckData.analysis_results && healthCheckData.analysis_results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Potential Conditions</CardTitle>
            <CardDescription>Based on the analysis of your symptoms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {healthCheckData.analysis_results.map((result: any, index: number) => (
              <div key={index} className="border rounded-md p-4">
                <h4 className="font-semibold">{result.condition}</h4>
                <p className="text-sm">Probability: {result.probability}</p>
                {result.details && (
                  <div className="mt-2">
                    <h5 className="font-medium">Details:</h5>
                    <p className="text-sm">{result.details}</p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
          <CardDescription>Recommended actions based on the analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-2">
            <li>Consult with a healthcare professional for further evaluation.</li>
            <li>Monitor your symptoms and track any changes.</li>
            <li>Consider lifestyle adjustments to support your health.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthCheckResults;
