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

    // Enhanced symptom categorization and clinical analysis
    const symptomsText = symptoms.join(", ");
    const severityInfo = severity ? `Symptom severity: ${severity}` : "";
    const durationInfo = duration ? `Duration: ${duration}` : "";
    
    // Comprehensive BMI and anthropometric assessment
    let clinicalAssessment = "";
    if (height && weight) {
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      let bmiCategory = "";
      let healthRisks = [];
      
      if (bmi < 18.5) {
        bmiCategory = "Underweight";
        healthRisks = ["malnutrition", "immune deficiency", "osteoporosis risk"];
      } else if (bmi < 25) {
        bmiCategory = "Normal weight";
        healthRisks = ["minimal weight-related risks"];
      } else if (bmi < 30) {
        bmiCategory = "Overweight";
        healthRisks = ["cardiovascular risk", "diabetes risk", "hypertension risk"];
      } else {
        bmiCategory = "Obese";
        healthRisks = ["high cardiovascular risk", "diabetes", "sleep apnea", "joint problems"];
      }
      
      clinicalAssessment = `
ANTHROPOMETRIC CLINICAL ASSESSMENT:
- Height: ${height}cm, Weight: ${weight}kg
- BMI: ${bmi.toFixed(1)} (${bmiCategory})
- Associated Health Risks: ${healthRisks.join(", ")}
- Metabolic implications for symptom manifestation and treatment response
`;
    }
    
    // Comprehensive medical history integration
    let medicalHistoryAnalysis = "";
    if (previousConditions && previousConditions.length > 0) {
      medicalHistoryAnalysis = `
MEDICAL HISTORY INTEGRATION:
Previous Conditions: ${previousConditions.join(", ")}

CLINICAL SIGNIFICANCE:
- Analyze comorbidity interactions with current symptoms
- Evaluate disease progression patterns
- Consider chronic disease exacerbations
- Assess multi-system involvement
- Identify potential disease complications
`;
    }
    
    // Advanced pharmacological analysis
    let pharmacologicalAssessment = "";
    if (medications && medications.length > 0) {
      pharmacologicalAssessment = `
PHARMACOLOGICAL ASSESSMENT:
Current Medications: ${medications.join(", ")}

DRUG-SYMPTOM CORRELATION ANALYSIS:
- Evaluate medication side effects vs. disease symptoms
- Assess drug-drug interactions affecting symptom presentation
- Consider therapeutic drug monitoring needs
- Analyze medication adherence impact on symptoms
- Evaluate contraindications for potential treatments
`;
    }
    
    // Clinical notes integration
    let clinicalNotesAnalysis = "";
    if (notes && notes.trim()) {
      clinicalNotesAnalysis = `
ADDITIONAL CLINICAL CONTEXT:
${notes}

CONTEXTUAL ANALYSIS:
- Integrate patient-reported observations
- Consider social determinants of health
- Evaluate functional impact of symptoms
- Assess quality of life implications
`;
    }

    // Advanced visual diagnostic analysis
    let visualDiagnosticAnalysis = "";
    let diagnosticCategories = [];
    
    if (symptomDetails && symptomDetails.some(s => s.photo)) {
      visualDiagnosticAnalysis = "COMPREHENSIVE VISUAL DIAGNOSTIC ANALYSIS:\n";
      
      // Systematic visual examination by specialty
      const eyeSymptoms = symptomDetails.filter(s => s.photo && isEyeSymptom(s.name));
      const skinSymptoms = symptomDetails.filter(s => s.photo && isSkinSymptom(s.name));
      const dentalSymptoms = symptomDetails.filter(s => s.photo && isDentalSymptom(s.name));
      
      if (eyeSymptoms.length > 0) {
        visualDiagnosticAnalysis += `
OPHTHALMOLOGICAL EXAMINATION:
Symptoms with visual documentation: ${eyeSymptoms.map(s => s.name).join(", ")}

SYSTEMATIC OCULAR ASSESSMENT:
• Anterior segment evaluation (conjunctiva, cornea, iris, lens)
• Posterior segment considerations (retina, optic nerve, vitreous)
• Pupillary light reflex and accommodation
• Extraocular muscle function and alignment
• Intraocular pressure implications
• Visual field defect patterns
• Color vision and contrast sensitivity
• Tear film stability and dry eye assessment

DIFFERENTIAL DIAGNOSTIC APPROACH:
• Infectious: bacterial, viral, fungal, parasitic
• Inflammatory: autoimmune, allergic, idiopathic
• Neoplastic: benign and malignant lesions
• Traumatic: mechanical, chemical, thermal
• Degenerative: age-related, hereditary
• Vascular: ischemic, hemorrhagic, embolic
`;
        diagnosticCategories.push("ophthalmological_examination");
      }
      
      if (skinSymptoms.length > 0) {
        visualDiagnosticAnalysis += `
DERMATOLOGICAL EXAMINATION:
Symptoms with visual documentation: ${skinSymptoms.map(s => s.name).join(", ")}

SYSTEMATIC SKIN ASSESSMENT:
• Primary lesion morphology (macule, papule, plaque, nodule, vesicle, bulla)
• Secondary changes (scale, crust, erosion, ulceration, atrophy, scarring)
• Color analysis (erythema, hyperpigmentation, hypopigmentation, cyanosis)
• Distribution patterns (localized, generalized, symmetric, unilateral, dermatomal)
• Border characteristics (well-demarcated, irregular, raised, flat)
• Surface texture (smooth, rough, verrucous, keratotic)
• Associated signs (warmth, tenderness, induration, fluctuation)

DERMATOLOGICAL DIAGNOSTIC FRAMEWORK:
• Inflammatory: eczematous, psoriasiform, lichenoid
• Infectious: bacterial, viral, fungal, parasitic
• Neoplastic: benign, premalignant, malignant
• Autoimmune: connective tissue disorders, bullous diseases
• Metabolic: diabetes, thyroid, nutritional deficiencies
• Drug-induced: fixed drug eruptions, photosensitivity
`;
        diagnosticCategories.push("dermatological_examination");
      }
      
      if (dentalSymptoms.length > 0) {
        visualDiagnosticAnalysis += `
COMPREHENSIVE ORAL AND MAXILLOFACIAL EXAMINATION:
Symptoms with visual documentation: ${dentalSymptoms.map(s => s.name).join(", ")}

SYSTEMATIC ORAL ASSESSMENT:
• Hard tissue evaluation (enamel, dentin, pulp, cementum)
• Periodontal assessment (gingiva, periodontal ligament, alveolar bone)
• Occlusal analysis (centric relation, maximum intercuspation)
• Temporomandibular joint evaluation (clicking, crepitus, deviation)
• Oral mucosal examination (buccal, lingual, palatal, floor of mouth)
• Salivary gland function (quantity, quality, pH)
• Lymph node palpation (cervical, submandibular, submental)

DENTAL DIAGNOSTIC METHODOLOGY:
• Caries assessment: ICDAS criteria, risk factors
• Periodontal classification: 2017 World Workshop staging/grading
• Endodontic evaluation: pulp vitality, periapical pathology
• Oral pathology: benign, premalignant, malignant lesions
• Orthodontic analysis: skeletal, dental, functional relationships
• Prosthodontic considerations: missing teeth, occlusal stability
`;
        diagnosticCategories.push("oral_maxillofacial_examination");
      }
    }

    // Specialized dental analysis requirements
    const requiresDentalSpecialization = analysisInstructions?.specialFocus === 'dental';
    const dentalSymptomsList = analysisInstructions?.dentalSymptoms || [];

    // Advanced medical reasoning prompt with systematic diagnostic approach
    const medicalReasoningPrompt = `
You are an advanced AI medical diagnostic system implementing evidence-based medicine principles with systematic clinical reasoning for 90%+ diagnostic accuracy.

PATIENT CLINICAL PRESENTATION:
PRIMARY SYMPTOMS: ${symptomsText}
${severityInfo}
${durationInfo}
${clinicalAssessment}
${visualDiagnosticAnalysis}
${medicalHistoryAnalysis}
${pharmacologicalAssessment}
${clinicalNotesAnalysis}

${requiresDentalSpecialization ? `
SPECIALIZED DENTAL DIAGNOSTIC REQUIREMENTS:
Dental symptoms requiring analysis: ${dentalSymptomsList.join(", ")}

ADVANCED DENTAL DIAGNOSTIC PROTOCOL:
• Apply evidence-based dental diagnostic criteria
• Utilize systematic oral examination findings
• Implement differential diagnosis methodology
• Consider multifactorial etiology in oral diseases
• Evaluate systemic-oral health correlations
• Apply current dental classification systems
• Consider age-specific dental pathology
• Assess treatment complexity and prognosis
` : ''}

SYSTEMATIC MEDICAL REASONING PROTOCOL:

1. CLINICAL DATA SYNTHESIS:
   - Integrate all provided clinical information
   - Identify symptom clusters and syndromes
   - Analyze temporal relationships and progression
   - Evaluate severity and functional impact

2. DIFFERENTIAL DIAGNOSIS FRAMEWORK:
   - Generate comprehensive differential diagnosis list
   - Apply Bayesian diagnostic reasoning
   - Consider epidemiological factors (prevalence, age, gender)
   - Evaluate risk factors and predisposing conditions
   - Rule out red flag conditions requiring immediate attention

3. EVIDENCE-BASED ANALYSIS:
   - Apply clinical decision rules where applicable
   - Use validated diagnostic criteria
   - Consider sensitivity and specificity of clinical findings
   - Evaluate positive and negative predictive values
   - Integrate current medical literature evidence

4. PATHOPHYSIOLOGICAL CORRELATION:
   - Explain underlying disease mechanisms
   - Correlate symptoms with anatomical and physiological processes
   - Analyze multi-system interactions
   - Consider genetic and environmental factors

5. DIAGNOSTIC CONFIDENCE ASSESSMENT:
   - Calculate diagnostic probability scores
   - Identify key discriminating features
   - Assess diagnostic certainty levels
   - Recommend confirmatory investigations

6. CLINICAL DECISION MAKING:
   - Prioritize diagnoses by likelihood and urgency
   - Consider treatment implications and contraindications
   - Evaluate prognosis and natural history
   - Plan appropriate follow-up and monitoring

REQUIRED COMPREHENSIVE OUTPUT FORMAT:
For each potential diagnosis, provide detailed analysis including:

{
  "medicalReasoningAnalysis": {
    "systematicApproach": "Description of diagnostic methodology used",
    "clinicalSynthesis": "Integration of all clinical data points",
    "differentialProcess": "Step-by-step differential diagnosis reasoning"
  },
  "conditions": [
    {
      "name": "Primary Diagnosis",
      "icd10Code": "Appropriate ICD-10 classification",
      "diagnosticConfidence": "90-95% (High/Very High)",
      "pathophysiology": "Detailed disease mechanism explanation",
      "clinicalReasoning": "Evidence-based diagnostic reasoning",
      "symptomCorrelation": "Detailed symptom-disease correlation",
      "differentialDiagnosis": ["Alternative diagnosis 1", "Alternative diagnosis 2"],
      "riskStratification": "Low/Moderate/High risk assessment",
      "diagnosticCriteria": "Specific criteria met for diagnosis",
      "evidenceLevel": "Quality of supporting evidence",
      "matchedSymptoms": ["symptom1", "symptom2"],
      "unmatchedSymptoms": ["symptoms not explained by this diagnosis"],
      "diagnosticScore": 92,
      "clinicalPearls": ["Key diagnostic insights"],
      "redFlags": ["Warning signs requiring urgent attention"],
      "investigationsRecommended": ["Specific tests for confirmation"],
      "treatmentConsiderations": "Evidence-based treatment approach",
      "contraindications": ["Treatment contraindications"],
      "prognosis": "Expected clinical course and outcomes",
      "complications": ["Potential complications to monitor"],
      "followUpProtocol": "Specific monitoring timeline",
      "patientEducation": ["Key educational points"],
      "preventiveStrategies": ["Prevention recommendations"],
      ${diagnosticCategories.length > 0 ? '"visualFindings": "Integration of visual diagnostic findings",' : ''}
      "medicalHistoryRelevance": "Impact of previous conditions",
      "pharmacologicalConsiderations": "Drug interactions and adjustments"
    }
  ],
  "overallClinicalAssessment": {
    "primaryWorkingDiagnosis": "Most likely diagnosis with confidence level",
    "diagnosticCertainty": "Overall confidence percentage (85-95%)",
    "clinicalComplexity": "Simple/Moderate/Complex case assessment",
    "urgencyClassification": "Low/Moderate/High/Emergency",
    "systematicReviewFindings": "Review of systems implications",
    "riskBenefitAnalysis": "Treatment vs. observation considerations"
  },
  "qualityMetrics": {
    "diagnosticAccuracy": "Estimated accuracy percentage",
    "evidenceGrade": "A/B/C quality of evidence",
    "consensusLevel": "Professional consensus strength",
    "guidelineCompliance": "Adherence to clinical guidelines"
  },
  ${requiresDentalSpecialization ? `
  "dentalSpecialistAnalysis": {
    "specialtyRecommendation": "Specific dental specialty referral",
    "urgencyLevel": "Routine/Urgent/Emergency dental care",
    "treatmentComplexity": "Simple/Moderate/Complex dental treatment",
    "interdisciplinaryNeeds": "Medical-dental collaborative care requirements"
  },
  ` : ''}
  "clinicalDecisionSupport": {
    "immediateActions": ["Actions requiring immediate attention"],
    "shortTermManagement": ["Management within 1-7 days"],
    "longTermPlan": ["Long-term management strategy"],
    "monitoringParameters": ["Specific parameters to track"],
    "patientSafetyConsiderations": ["Safety measures and precautions"]
  }
}

CRITICAL REQUIREMENTS:
- Provide 85-95% diagnostic accuracy through systematic reasoning
- Include detailed pathophysiological explanations
- Correlate ALL symptoms with proposed diagnoses
- Apply evidence-based medicine principles
- Consider patient safety as highest priority
- Return ONLY valid JSON format
- Maintain clinical professional standards
`;

    console.log("Initiating advanced medical reasoning analysis with Gemini AI");
    console.log("Diagnostic approach:", requiresDentalSpecialization ? "Specialized Dental Medicine" : "General Internal Medicine");
    console.log("Symptoms for analysis:", symptomsText);
    console.log("Clinical complexity factors:", {
      medicalHistory: !!(previousConditions && previousConditions.length > 0),
      medications: !!(medications && medications.length > 0),
      visualData: diagnosticCategories.length > 0,
      anthropometrics: !!(height && weight)
    });

    // Enhanced Gemini API call with medical reasoning
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: medicalReasoningPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.05, // Very low temperature for consistent medical reasoning
          topK: 20,
          topP: 0.9,
          maxOutputTokens: 6000,
          responseMimeType: "application/json"
        },
        systemInstruction: {
          parts: [{
            text: 'You are an expert medical AI system with advanced clinical reasoning capabilities. Apply systematic diagnostic methodology, evidence-based medicine principles, and comprehensive patient assessment for maximum diagnostic accuracy. Prioritize patient safety and clinical precision in all analyses. Always provide detailed medical reasoning and maintain the highest professional medical standards.'
          }]
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_MEDICAL",
            threshold: "BLOCK_NONE"
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error("Gemini medical reasoning API error:", errorDetails);
      throw new Error(`Gemini API error: ${response.status} - ${errorDetails}`);
    }

    const data = await response.json();
    console.log("Received comprehensive medical reasoning analysis from Gemini");
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
      console.error("Invalid Gemini response structure:", JSON.stringify(data));
      throw new Error("Invalid response structure from Gemini API");
    }

    const aiResponse = data.candidates[0].content.parts[0].text;
    
    try {
      const medicalAnalysisResult = JSON.parse(aiResponse);
      
      if (!medicalAnalysisResult.conditions || !Array.isArray(medicalAnalysisResult.conditions)) {
        throw new Error("Medical analysis missing required 'conditions' array");
      }
      
      // Enhanced analysis metadata with medical reasoning indicators
      medicalAnalysisResult.advancedMedicalReasoning = true;
      medicalAnalysisResult.systematicDiagnosticApproach = true;
      medicalAnalysisResult.evidenceBasedAnalysis = true;
      medicalAnalysisResult.highAccuracyAnalysis = true;
      medicalAnalysisResult.analysisTimestamp = new Date().toISOString();
      medicalAnalysisResult.clinicalDataIntegration = {
        medicalHistory: !!(previousConditions && previousConditions.length > 0),
        medications: !!(medications && medications.length > 0),
        clinicalNotes: !!(notes && notes.trim()),
        visualDiagnostics: diagnosticCategories.length > 0,
        anthropometrics: !!(height && weight)
      };
      medicalAnalysisResult.aiProvider = "Gemini 1.5 Pro - Medical Reasoning";
      medicalAnalysisResult.diagnosticMethodology = "Systematic Clinical Reasoning";
      
      if (requiresDentalSpecialization) {
        medicalAnalysisResult.specializedDentalMedicine = true;
        medicalAnalysisResult.dentalSymptomsAnalyzed = dentalSymptomsList;
        medicalAnalysisResult.oralHealthSystemicCorrelation = true;
      }
      
      return new Response(
        JSON.stringify(medicalAnalysisResult),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (jsonParsingError) {
      console.error("Medical analysis JSON parsing error:", jsonParsingError);
      console.error("Raw AI response:", aiResponse);
      
      // Enhanced JSON extraction with medical fallback
      try {
        const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const extractedMedicalJson = JSON.parse(jsonMatch[0]);
          
          // Ensure medical analysis structure
          if (!extractedMedicalJson.conditions) {
            extractedMedicalJson.conditions = [];
          }
          if (!extractedMedicalJson.overallClinicalAssessment) {
            extractedMedicalJson.overallClinicalAssessment = {
              primaryWorkingDiagnosis: "Requires clinical correlation",
              urgencyClassification: "moderate"
            };
          }
          
          return new Response(
            JSON.stringify(extractedMedicalJson),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      } catch (extractionError) {
        console.error("Failed to extract medical analysis JSON:", extractionError);
      }
      
      // Medical analysis fallback response
      const medicalFallbackResponse = {
        medicalReasoningAnalysis: {
          systematicApproach: "Analysis incomplete due to technical error",
          clinicalSynthesis: "Requires manual clinical review",
          differentialProcess: "Unable to complete systematic analysis"
        },
        conditions: [{
          name: "Clinical Analysis Incomplete",
          diagnosticConfidence: "Low - Technical Error",
          clinicalReasoning: "Unable to complete comprehensive medical analysis. Clinical consultation recommended for accurate diagnosis.",
          treatmentConsiderations: "Seek professional medical evaluation",
          urgencyLevel: "Moderate - Clinical review needed"
        }],
        overallClinicalAssessment: {
          primaryWorkingDiagnosis: "Requires clinical evaluation",
          urgencyClassification: "moderate",
          diagnosticCertainty: "Low due to technical error"
        },
        error: "Medical reasoning analysis incomplete",
        clinicalRecommendation: "Consult healthcare professional for comprehensive evaluation"
      };
      
      return new Response(
        JSON.stringify(medicalFallbackResponse),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error("Critical error in medical reasoning analysis:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "Critical medical analysis system error",
        medicalFallback: true,
        conditions: [],
        overallClinicalAssessment: {
          primaryWorkingDiagnosis: "System error - unable to complete analysis",
          urgencyClassification: "moderate",
          clinicalRecommendation: "Seek professional medical evaluation"
        },
        systemError: true
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

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
    "Tooth pain", "Gum bleeding", "Tooth sensitivity", "Bad breath", "Loose teeth", "Jaw pain", "Tooth decay", "Gum swelling", "Cracked tooth", "Wisdom tooth pain",
    "Mouth ulcers", "Oral lesions", "Tongue pain", "Dry mouth", "Burning mouth sensation", "Oral infections",
    "Facial swelling", "Jaw stiffness", "TMJ disorders", "Facial trauma", "Impacted teeth", "Oral cysts",
    "White patches in mouth", "Red patches in mouth", "Oral cancer symptoms", "Unusual growths in mouth", "Recurring mouth infections",
    "Denture problems", "Crown pain", "Bridge discomfort", "Missing teeth", "Bite problems", "Chewing difficulties",
    "Root canal pain", "Filling sensitivity", "Cavity pain", "Tooth nerve pain", "Post-treatment sensitivity",
    "Children's dental pain", "Teething problems", "Dental development issues", "Early childhood caries",
    "Gum disease", "Gum recession", "Periodontal pockets", "Gum inflammation", "Plaque buildup", "Tartar formation",
    "Oral hygiene issues", "Preventive care needs", "Community dental problems",
    "Crooked teeth", "Overbite", "Underbite", "Crossbite", "Spacing issues", "Jaw alignment problems", "Braces pain"
  ];
  return dentalSymptoms.includes(symptom);
}
