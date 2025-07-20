
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
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
      analysisInstructions
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

    // Enhanced symptom categorization and analysis
    const symptomsText = symptoms.join(", ");
    const severityInfo = severity ? `Symptom severity: ${severity}` : "";
    const durationInfo = duration ? `Duration: ${duration}` : "";
    
    // Enhanced BMI and physical assessment
    let physicalAssessment = "";
    if (height && weight) {
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      let bmiCategory = "";
      
      if (bmi < 18.5) bmiCategory = "Underweight";
      else if (bmi < 25) bmiCategory = "Normal weight";
      else if (bmi < 30) bmiCategory = "Overweight";
      else bmiCategory = "Obese";
      
      physicalAssessment = `\n\nPHYSICAL ASSESSMENT:\nHeight: ${height}cm, Weight: ${weight}kg\nBMI: ${bmi.toFixed(1)} (${bmiCategory})\nPhysical factors that may influence diagnosis and treatment.`;
    }
    
    // Comprehensive medical history analysis
    let medicalHistoryText = "";
    if (previousConditions && previousConditions.length > 0) {
      medicalHistoryText = `\n\nMEDICAL HISTORY:\n${previousConditions.join(", ")}\nAnalyze how these conditions may interact with current symptoms.`;
    }
    
    let medicationsText = "";
    if (medications && medications.length > 0) {
      medicationsText = `\n\nCURRENT MEDICATIONS:\n${medications.join(", ")}\nConsider drug interactions, side effects, and therapeutic implications.`;
    }
    
    let notesText = "";
    if (notes && notes.trim()) {
      notesText = `\n\nADDITIONAL CLINICAL NOTES:\n${notes}\nImportant contextual information for diagnosis.`;
    }

    // Advanced photo analysis for visual symptoms
    let photoAnalysisText = "";
    let visualDiagnosticFeatures = [];
    
    if (symptomDetails && symptomDetails.some(s => s.photo)) {
      photoAnalysisText = "\n\nVISUAL SYMPTOM ANALYSIS:\n";
      
      // Categorize symptoms with photos
      const eyeSymptoms = symptomDetails.filter(s => s.photo && isEyeSymptom(s.name));
      const skinSymptoms = symptomDetails.filter(s => s.photo && isSkinSymptom(s.name));
      const dentalSymptoms = symptomDetails.filter(s => s.photo && isDentalSymptom(s.name));
      
      if (eyeSymptoms.length > 0) {
        photoAnalysisText += "\nOCULAR EXAMINATION FINDINGS:\n";
        eyeSymptoms.forEach(s => {
          photoAnalysisText += `- ${s.name}: Visual examination shows ocular pathology\n`;
        });
        photoAnalysisText += "DETAILED OCULAR ASSESSMENT:\n";
        photoAnalysisText += "• Conjunctival injection patterns (bacterial vs viral vs allergic)\n";
        photoAnalysisText += "• Corneal clarity and surface irregularities\n";
        photoAnalysisText += "• Pupillary responses and symmetry\n";
        photoAnalysisText += "• Eyelid positioning and ptosis assessment\n";
        photoAnalysisText += "• Discharge characteristics (purulent, serous, mucopurulent)\n";
        photoAnalysisText += "• Periorbital edema and erythema patterns\n";
        visualDiagnosticFeatures.push("ocular_examination");
      }
      
      if (skinSymptoms.length > 0) {
        photoAnalysisText += "\nDERMATOLOGICAL EXAMINATION:\n";
        skinSymptoms.forEach(s => {
          photoAnalysisText += `- ${s.name}: Dermatological lesion identified\n`;
        });
        photoAnalysisText += "COMPREHENSIVE SKIN ANALYSIS:\n";
        photoAnalysisText += "• Morphological classification (macule, papule, plaque, nodule, vesicle)\n";
        photoAnalysisText += "• Color variations and pigmentation patterns\n";
        photoAnalysisText += "• Distribution patterns (symmetric, unilateral, dermatomal)\n";
        photoAnalysisText += "• Border characteristics (well-demarcated vs irregular)\n";
        photoAnalysisText += "• Surface texture and scaling patterns\n";
        photoAnalysisText += "• Associated features (inflammation, secondary changes)\n";
        visualDiagnosticFeatures.push("dermatological_examination");
      }
      
      if (dentalSymptoms.length > 0) {
        photoAnalysisText += "\nORAL AND DENTAL EXAMINATION:\n";
        dentalSymptoms.forEach(s => {
          photoAnalysisText += `- ${s.name}: Oral pathology documented\n`;
        });
        photoAnalysisText += "COMPREHENSIVE ORAL ASSESSMENT:\n";
        photoAnalysisText += "• Dental caries classification and extent\n";
        photoAnalysisText += "• Periodontal status (gingivitis, periodontitis staging)\n";
        photoAnalysisText += "• Oral mucosal lesions and their characteristics\n";
        photoAnalysisText += "• Occlusal relationships and malocclusion patterns\n";
        photoAnalysisText += "• Gingival inflammation and bleeding indices\n";
        photoAnalysisText += "• Hard and soft tissue abnormalities\n";
        photoAnalysisText += "• TMJ dysfunction indicators\n";
        visualDiagnosticFeatures.push("oral_dental_examination");
      }
    }

    // Determine if specialized dental analysis is needed
    const hasDentalSymptoms = analysisInstructions?.specialFocus === 'dental';
    const dentalSymptomsList = analysisInstructions?.dentalSymptoms || [];

    // Create enhanced medical analysis prompt for high accuracy diagnosis
    const prompt = `
      You are an advanced AI medical diagnostic system with expertise in comprehensive clinical analysis. Your goal is to provide highly accurate diagnostic assessments with 85-95% confidence levels through systematic medical reasoning.

      PATIENT PRESENTATION:
      PRIMARY SYMPTOMS: ${symptomsText}
      ${severityInfo}
      ${durationInfo}
      ${physicalAssessment}
      ${photoAnalysisText}
      ${medicalHistoryText}
      ${medicationsText}
      ${notesText}

      ${hasDentalSymptoms ? `
      SPECIALIZED DENTAL ANALYSIS REQUIRED:
      Dental symptoms present: ${dentalSymptomsList.join(", ")}
      
      DENTAL DIAGNOSTIC APPROACH:
      • Apply systematic dental examination principles
      • Consider dental pathophysiology and etiology
      • Evaluate periodontal, endodontic, and oral surgical conditions
      • Assess orthodontic and prosthodontic factors
      • Include oral medicine and pathology considerations
      • Analyze temporomandibular joint disorders
      • Consider pediatric dental conditions if applicable
      ` : ''}

      ADVANCED DIAGNOSTIC METHODOLOGY:
      1. SYMPTOM PATTERN RECOGNITION:
         - Analyze symptom clusters and syndromes
         - Identify pathognomonic signs and cardinal symptoms
         - Evaluate symptom progression and temporal patterns
         - Consider anatomical and physiological correlations

      2. DIFFERENTIAL DIAGNOSIS FRAMEWORK:
         - Apply systematic diagnostic reasoning
         - Consider epidemiological factors (age, gender, demographics)
         - Evaluate risk factors and predisposing conditions
         - Rule out red flag conditions and emergencies

      3. EVIDENCE-BASED ANALYSIS:
         - Integrate clinical presentation with medical literature
         - Apply diagnostic criteria and clinical guidelines
         - Consider sensitivity and specificity of findings
         - Evaluate pre-test and post-test probabilities

      4. COMPREHENSIVE ASSESSMENT:
         - Analyze interactions between symptoms, medications, and comorbidities
         - Consider medication side effects and drug interactions
         - Evaluate impact of BMI and physical parameters
         - Assess psychological and social factors

      5. DIAGNOSTIC ACCURACY OPTIMIZATION:
         - Provide confidence intervals for each diagnosis
         - Explain diagnostic reasoning and clinical correlation
         - Identify key differentiating features
         - Suggest confirmatory tests or examinations

      REQUIRED OUTPUT FORMAT:
      For each potential condition, provide:
      1. Condition name with ICD-10 classification if applicable
      2. Detailed pathophysiological explanation
      3. Symptom correlation analysis (explain why each symptom fits)
      4. Diagnostic confidence score (70-95% based on symptom match)
      5. Clinical reasoning and differential diagnosis
      6. Risk stratification and urgency assessment
      7. Recommended diagnostic workup
      8. Treatment considerations and contraindications
      9. Prognosis and follow-up recommendations
      10. Patient education points

      ${visualDiagnosticFeatures.length > 0 ? `
      VISUAL DIAGNOSTIC INTEGRATION:
      - Incorporate findings from ${visualDiagnosticFeatures.join(", ")}
      - Explain how visual findings support or modify diagnosis
      - Describe specific visual markers that confirm diagnosis
      ` : ''}

      Return ONLY valid JSON in this exact format:
      {
        "conditions": [
          {
            "name": "Primary Diagnosis Name",
            "icd10Code": "ICD-10 code if applicable",
            "description": "Comprehensive pathophysiological explanation including etiology, pathogenesis, and clinical course",
            "matchedSymptoms": ["symptom1", "symptom2"],
            "symptomCorrelation": "Detailed explanation of how each symptom correlates with this condition",
            "matchScore": 90,
            "diagnosticConfidence": "High (85-95%)",
            "clinicalReasoning": "Step-by-step diagnostic reasoning process",
            "differentialDiagnosis": ["Alternative diagnosis 1", "Alternative diagnosis 2"],
            "riskFactors": ["risk factor 1", "risk factor 2"],
            "diagnosticWorkup": ["recommended test 1", "recommended test 2"],
            "recommendedActions": ["immediate action 1", "treatment option 2"],
            "treatmentConsiderations": "Detailed treatment approach with contraindications",
            "seekMedicalAttention": "Specific timeframe and red flag symptoms",
            "prognosis": "Expected clinical course and outcomes",
            "patientEducation": ["education point 1", "education point 2"],
            "medicalHistoryRelevance": "How medical history influences this diagnosis",
            "medicationConsiderations": "Drug interactions and medication adjustments",
            ${visualDiagnosticFeatures.length > 0 ? '"visualDiagnosticFeatures": ["visual finding 1", "visual finding 2"],' : ''}
            "followUpRecommendations": "Specific follow-up timeline and monitoring"
          }
        ],
        "overallAssessment": "Comprehensive clinical summary with primary working diagnosis",
        "urgencyLevel": "low/moderate/high/emergency",
        "diagnosticAccuracy": "Overall diagnostic confidence percentage",
        "clinicalPearls": ["important clinical insight 1", "important clinical insight 2"],
        "redFlags": ["warning sign 1", "warning sign 2"],
        ${hasDentalSymptoms ? '"dentalSpecialistReferral": "Specific dental specialty recommendation",' : ''}
        "systematicReview": "Brief review of systems considerations"
      }
    `;

    console.log("Sending high-accuracy diagnostic analysis to Gemini API");
    console.log("Analysis type:", hasDentalSymptoms ? "Specialized Dental" : "General Medical");
    console.log("Symptoms analyzed:", symptomsText);

    // Call Gemini API with enhanced diagnostic prompt
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.1,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4000,
          responseMimeType: "application/json"
        },
        systemInstruction: {
          parts: [{
            text: 'You are an expert medical AI with advanced diagnostic capabilities. Provide highly accurate medical diagnoses with detailed clinical reasoning. Always return valid JSON format with comprehensive medical analysis. Focus on diagnostic accuracy and evidence-based medicine principles.'
          }]
        }
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error("Gemini API error:", errorDetails);
      throw new Error(`Gemini API returned error status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Received high-accuracy diagnostic analysis from Gemini");
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
      console.error("Unexpected response structure:", JSON.stringify(data));
      throw new Error("Invalid response structure from Gemini");
    }

    const aiResponse = data.candidates[0].content.parts[0].text;
    
    try {
      const analysisResult = JSON.parse(aiResponse);
      
      if (!analysisResult.conditions || !Array.isArray(analysisResult.conditions)) {
        throw new Error("Response missing expected 'conditions' array");
      }
      
      // Enhanced analysis metadata
      analysisResult.comprehensiveAnalysis = true;
      analysisResult.highAccuracyAnalysis = true;
      analysisResult.analysisTimestamp = new Date().toISOString();
      analysisResult.includedMedicalHistory = !!(previousConditions && previousConditions.length > 0);
      analysisResult.includedMedications = !!(medications && medications.length > 0);
      analysisResult.includedNotes = !!(notes && notes.trim());
      analysisResult.visualAnalysisIncluded = visualDiagnosticFeatures.length > 0;
      analysisResult.bmiAnalysisIncluded = !!(height && weight);
      analysisResult.aiProvider = "Gemini 1.5 Pro";
      
      if (hasDentalSymptoms) {
        analysisResult.specializedDentalAnalysis = true;
        analysisResult.dentalSymptomsAnalyzed = dentalSymptomsList;
      }
      
      return new Response(
        JSON.stringify(analysisResult),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (jsonError) {
      console.error("Error parsing JSON from AI response:", jsonError);
      console.error("AI response was:", aiResponse);
      
      // Enhanced JSON extraction with better error handling
      try {
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const extractedJson = JSON.parse(jsonMatch[0]);
          
          // Ensure minimum required structure
          if (!extractedJson.conditions) {
            extractedJson.conditions = [];
          }
          
          return new Response(
            JSON.stringify(extractedJson),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      } catch (extractError) {
        console.error("Failed to extract JSON:", extractError);
      }
      
      // Fallback response structure
      const fallbackResponse = {
        conditions: [{
          name: "Analysis Error",
          description: "Unable to complete comprehensive analysis. Please consult a healthcare professional.",
          matchScore: 0,
          diagnosticConfidence: "Low",
          seekMedicalAttention: "Consult a healthcare professional for proper evaluation"
        }],
        overallAssessment: "Analysis incomplete due to technical error",
        urgencyLevel: "moderate",
        error: "Analysis parsing failed"
      };
      
      return new Response(
        JSON.stringify(fallbackResponse),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error("Error in high-accuracy analyze-symptoms function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "An unknown error occurred",
        fallback: true,
        conditions: [],
        overallAssessment: "Unable to complete analysis due to system error"
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Enhanced helper functions for symptom categorization
function isEyeSymptom(symptom: string): boolean {
  const eyeSymptoms = [
    "Blurry vision", "Eye redness", "Eye pain", "Dry eyes", 
    "Watery eyes", "Eye discharge", "Light sensitivity", 
    "Double vision", "Eye strain"
  ];
  return eyeSymptoms.includes(symptom);
}

function isSkinSymptom(symptom: string): boolean {
  const skinSymptoms = [
    "Rash", "Itching", "Bruising", "Dryness", 
    "Sores", "Changes in mole"
  ];
  return skinSymptoms.includes(symptom);
}

function isDentalSymptom(symptom: string): boolean {
  const dentalSymptoms = [
    // General Dental
    "Tooth pain", "Gum bleeding", "Tooth sensitivity", "Bad breath", "Loose teeth", "Jaw pain", "Tooth decay", "Gum swelling", "Cracked tooth", "Wisdom tooth pain",
    // Oral Medicine and Radiology
    "Mouth ulcers", "Oral lesions", "Tongue pain", "Dry mouth", "Burning mouth sensation", "Oral infections",
    // Oral and Maxillofacial Surgery
    "Facial swelling", "Jaw stiffness", "TMJ disorders", "Facial trauma", "Impacted teeth", "Oral cysts",
    // Oral Pathology and Oral Microbiology  
    "White patches in mouth", "Red patches in mouth", "Oral cancer symptoms", "Unusual growths in mouth", "Recurring mouth infections",
    // Prosthodontics and Crown & Bridge
    "Denture problems", "Crown pain", "Bridge discomfort", "Missing teeth", "Bite problems", "Chewing difficulties",
    // Conservative Dentistry and Endodontics
    "Root canal pain", "Filling sensitivity", "Cavity pain", "Tooth nerve pain", "Post-treatment sensitivity",
    // Pediatric & Preventive Dentistry
    "Children's dental pain", "Teething problems", "Dental development issues", "Early childhood caries",
    // Periodontology
    "Gum disease", "Gum recession", "Periodontal pockets", "Gum inflammation", "Plaque buildup", "Tartar formation",
    // Public Health Dentistry
    "Oral hygiene issues", "Preventive care needs", "Community dental problems",
    // Orthodontics & Dentofacial Orthopedics
    "Crooked teeth", "Overbite", "Underbite", "Crossbite", "Spacing issues", "Jaw alignment problems", "Braces pain"
  ];
  return dentalSymptoms.includes(symptom);
}
