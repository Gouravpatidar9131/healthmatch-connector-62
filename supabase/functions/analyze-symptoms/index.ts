
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      symptoms, 
      severity, 
      duration, 
      height, 
      weight, 
      symptomDetails, 
      previousConditions, 
      medications, 
      notes,
      voiceNote,
      analysisInstructions,
      symptomCategories
    } = await req.json();

    if (!symptoms || symptoms.length === 0) {
      return new Response(
        JSON.stringify({ error: "No symptoms provided" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!GEMINI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Gemini API key not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const symptomsText = symptoms.join(", ");
    const severityInfo = severity ? `Severity: ${severity}` : "";
    const durationInfo = duration ? `Duration: ${duration}` : "";
    
    let clinicalContext = "";
    if (height && weight) {
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      let bmiCategory = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal" : bmi < 30 ? "Overweight" : "Obese";
      clinicalContext += `Height: ${height}cm, Weight: ${weight}kg, BMI: ${bmi.toFixed(1)} (${bmiCategory})\n`;
    }
    
    if (previousConditions && previousConditions.length > 0) {
      clinicalContext += `Medical History: ${previousConditions.join(", ")}\n`;
    }
    
    if (medications && medications.length > 0) {
      clinicalContext += `Current Medications: ${medications.join(", ")}\n`;
    }
    
    if (notes && notes.trim()) {
      clinicalContext += `Additional Notes: ${notes}\n`;
    }
    
    if (voiceNote && voiceNote.trim()) {
      clinicalContext += `Voice Note Transcript: ${voiceNote}\n`;
    }

    let categoryContext = "";
    if (symptomCategories && symptomCategories.length > 0) {
      categoryContext = symptomCategories.map(cat => 
        `${cat.category}: ${cat.symptoms.join(", ")}`
      ).join("\n");
    }

    const hasVisualData = symptomDetails && symptomDetails.some(s => s.photo);
    const visualContext = hasVisualData ? "Visual symptoms documented with photos for enhanced analysis." : "";

    const medicalPrompt = `
You are an advanced medical AI providing comprehensive diagnostic analysis.

PATIENT PRESENTATION:
Symptoms: ${symptomsText}
${severityInfo}
${durationInfo}
${clinicalContext}

${categoryContext ? `SYMPTOM CATEGORIES:\n${categoryContext}\n` : ''}
${visualContext}

ANALYSIS REQUIREMENTS:
- Provide evidence-based differential diagnosis
- Consider symptom category context for accuracy
- Include risk stratification and urgency assessment
- Assess for potential chronic disease indicators (diabetes, hypertension, heart disease, respiratory conditions, thyroid disorders, etc.)
- Consider symptom patterns that may suggest long-term health conditions
- Evaluate lifestyle factors and medical history for chronic disease risk
- Suggest appropriate investigations and management
- Maintain focus within relevant medical specialties

Provide analysis in the following JSON format:
{
  "medicalReasoningAnalysis": {
    "systematicApproach": "Clinical reasoning methodology",
    "clinicalSynthesis": "Integration of patient data",
    "differentialProcess": "Diagnostic reasoning steps"
  },
  "conditions": [
    {
      "name": "Primary diagnosis",
      "medicalSpecialty": "Relevant medical field",
      "diagnosticConfidence": "Confidence level (High/Moderate/Low)",
      "pathophysiology": "Disease mechanism explanation",
      "clinicalReasoning": "Evidence-based reasoning",
      "symptomCorrelation": "How symptoms match this condition",
      "riskStratification": "Risk level assessment",
      "matchedSymptoms": ["symptom1", "symptom2"],
      "diagnosticScore": 85,
      "investigationsRecommended": ["suggested tests"],
      "treatmentConsiderations": "Management approach",
      "prognosis": "Expected outcome",
      "urgencyLevel": "Low/Moderate/High/Emergency"
    }
  ],
  "chronicDiseaseRisk": {
    "detected": true,
    "conditions": [
      {
        "condition": "Name of chronic condition",
        "riskLevel": "Low/Moderate/High",
        "indicators": ["symptoms or factors suggesting this condition"],
        "recommendations": "Specific advice for this condition",
        "preventiveMeasures": ["lifestyle changes and preventive actions"]
      }
    ]
  },
  "overallClinicalAssessment": {
    "primaryWorkingDiagnosis": "Most likely condition",
    "diagnosticCertainty": "Overall confidence percentage",
    "urgencyClassification": "Clinical urgency level",
    "recommendedActions": ["immediate steps to take"]
  }
}
`;

    console.log("Sending medical analysis request to Gemini");

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: medicalPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          topK: 20,
          topP: 0.9,
          maxOutputTokens: 4000,
          responseMimeType: "application/json"
        },
        systemInstruction: {
          parts: [{
            text: 'You are a medical AI providing accurate, evidence-based diagnostic analysis. Focus on patient safety and clinical precision while maintaining appropriate medical specialty boundaries.'
          }]
        }
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error("Gemini API error:", errorDetails);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates?.[0]?.content?.parts?.[0]) {
      console.error("Invalid Gemini response structure");
      throw new Error("Invalid response from AI service");
    }

    const aiResponse = data.candidates[0].content.parts[0].text;
    
    try {
      const analysisResult = JSON.parse(aiResponse);
      
      if (!analysisResult.conditions || !Array.isArray(analysisResult.conditions)) {
        throw new Error("Invalid analysis structure");
      }
      
      // Add metadata
      analysisResult.comprehensiveAnalysis = true;
      analysisResult.categoryConstrainedAnalysis = !!categoryContext;
      analysisResult.visualAnalysisIncluded = hasVisualData;
      analysisResult.analysisTimestamp = new Date().toISOString();
      analysisResult.aiProvider = "Gemini 1.5 Pro";
      
      return new Response(
        JSON.stringify(analysisResult),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (jsonError) {
      console.error("JSON parsing error:", jsonError);
      
      // Fallback response
      const fallbackResponse = {
        medicalReasoningAnalysis: {
          systematicApproach: "Analysis incomplete due to technical error",
          clinicalSynthesis: "Requires clinical review",
          differentialProcess: "Unable to complete systematic analysis"
        },
        conditions: [{
          name: "Clinical Analysis Incomplete",
          medicalSpecialty: "General Medicine",
          diagnosticConfidence: "Low - Technical Error",
          clinicalReasoning: "Unable to complete comprehensive analysis. Clinical consultation recommended.",
          treatmentConsiderations: "Seek professional medical evaluation",
          urgencyLevel: "Moderate",
          matchedSymptoms: symptoms,
          diagnosticScore: 50
        }],
        overallClinicalAssessment: {
          primaryWorkingDiagnosis: "Requires clinical evaluation",
          urgencyClassification: "moderate",
          diagnosticCertainty: "Low due to technical error",
          recommendedActions: ["Consult healthcare professional"]
        },
        error: "Analysis incomplete - technical issue",
        technicalError: true
      };
      
      return new Response(
        JSON.stringify(fallbackResponse),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error("Critical error in medical analysis:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "Medical analysis system error",
        conditions: [],
        overallClinicalAssessment: {
          primaryWorkingDiagnosis: "System error - unable to complete analysis",
          urgencyClassification: "moderate",
          recommendedActions: ["Seek professional medical evaluation"]
        },
        systemError: true
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
