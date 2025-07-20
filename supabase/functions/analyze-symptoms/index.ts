
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { symptoms, symptomCategories, severity, duration, notes, photos } = await req.json()
    
    console.log('Analyzing symptoms:', { symptoms, symptomCategories, severity, duration })

    // Build comprehensive analysis prompt with category constraints
    const analysisPrompt = `You are an expert medical AI assistant providing preliminary health assessments. 

IMPORTANT CONSTRAINTS:
- Only provide diagnoses within the medical specialty indicated by the symptom categories
- Each symptom is categorized as follows: ${JSON.stringify(symptomCategories)}
- Stay strictly within the relevant medical domain for each symptom
- Do not suggest diagnoses from unrelated medical specialties

PATIENT PRESENTATION:
Symptoms: ${symptoms.join(', ')}
Severity: ${severity}
Duration: ${duration}
Additional Notes: ${notes}
Photos Available: ${photos ? Object.keys(photos).length : 0}

MEDICAL REASONING FRAMEWORK:
For each symptom category present, provide:

1. CATEGORY-SPECIFIC DIFFERENTIAL DIAGNOSIS:
   - List 3-5 most likely conditions within the relevant medical specialty
   - Rank by probability based on symptom constellation
   - Include common, serious, and rare but important diagnoses

2. PATHOPHYSIOLOGICAL CORRELATION:
   - Explain how symptoms relate to underlying disease mechanisms
   - Consider anatomy, physiology, and pathology relevant to the category

3. CLINICAL DECISION SUPPORT:
   - Risk stratification (low, moderate, high)
   - Red flag symptoms requiring immediate attention
   - Category-appropriate diagnostic recommendations

4. EVIDENCE-BASED ASSESSMENT:
   - Reference relevant clinical guidelines
   - Consider epidemiological factors
   - Account for symptom duration and severity

SPECIALTY-CONSTRAINED ANALYSIS:
${Object.entries(symptomCategories).map(([symptom, category]) => 
  `- "${symptom}" (${category} specialty): Focus only on ${category.toLowerCase()} conditions`
).join('\n')}

Provide a comprehensive but category-appropriate medical assessment following evidence-based clinical reasoning.`

    // Call Groq API for analysis
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('GROQ_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'system',
            content: 'You are a highly skilled medical AI assistant specializing in evidence-based diagnostic reasoning. Provide thorough, accurate, and category-constrained medical assessments while emphasizing the importance of professional medical consultation.'
          },
          {
            role: 'user',
            content: analysisPrompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    })

    if (!groqResponse.ok) {
      throw new Error(`Groq API error: ${groqResponse.status} ${groqResponse.statusText}`)
    }

    const groqData = await groqResponse.json()
    const analysisResult = groqData.choices[0].message.content

    // Structure the response
    const analysis = {
      symptoms: symptoms,
      symptom_categories: symptomCategories,
      severity: severity,
      duration: duration,
      analysis: analysisResult,
      recommendations: generateRecommendations(severity, Object.values(symptomCategories)),
      urgency_level: determineUrgency(severity, symptoms),
      timestamp: new Date().toISOString(),
      disclaimer: "This is a preliminary AI assessment. Always consult with qualified healthcare professionals for proper diagnosis and treatment."
    }

    return new Response(
      JSON.stringify(analysis),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error in analyze-symptoms function:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Analysis failed', 
        details: error.message,
        fallback_analysis: generateFallbackAnalysis()
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})

function generateRecommendations(severity: string, categories: string[]): string[] {
  const recommendations = []
  
  // Severity-based recommendations
  if (severity === 'Critical' || severity === 'Severe') {
    recommendations.push('Seek immediate medical attention')
    recommendations.push('Consider emergency department evaluation')
  } else if (severity === 'Moderate') {
    recommendations.push('Schedule appointment with your healthcare provider within 24-48 hours')
  } else {
    recommendations.push('Monitor symptoms and consult healthcare provider if worsening')
  }

  // Category-specific recommendations
  const uniqueCategories = [...new Set(categories)]
  uniqueCategories.forEach(category => {
    switch (category) {
      case 'Heart & Circulation':
        recommendations.push('Monitor blood pressure and heart rate')
        break
      case 'Brain & Nervous System':
        recommendations.push('Avoid driving if experiencing dizziness or confusion')
        break
      case 'Eye':
        recommendations.push('Protect eyes from bright light if experiencing sensitivity')
        break
      case 'Dental':
        recommendations.push('Maintain good oral hygiene and avoid hard foods')
        break
    }
  })

  // General recommendations
  recommendations.push('Keep a symptom diary')
  recommendations.push('Stay hydrated and get adequate rest')
  
  return recommendations
}

function determineUrgency(severity: string, symptoms: string[]): string {
  const emergencySymptoms = [
    'chest pain',
    'difficulty breathing', 
    'severe headache',
    'loss of consciousness',
    'severe bleeding',
    'signs of stroke'
  ]
  
  const hasEmergencySymptom = symptoms.some(symptom => 
    emergencySymptoms.some(emergency => 
      symptom.toLowerCase().includes(emergency.toLowerCase())
    )
  )

  if (severity === 'Critical' || hasEmergencySymptom) {
    return 'Emergency - Seek immediate medical attention'
  } else if (severity === 'Severe') {
    return 'Urgent - See healthcare provider within 24 hours'
  } else if (severity === 'Moderate') {
    return 'Semi-urgent - Schedule appointment within 2-3 days'
  } else {
    return 'Routine - Monitor and schedule regular checkup'
  }
}

function generateFallbackAnalysis() {
  return {
    analysis: "Unable to complete detailed analysis due to technical issues. Please consult with a healthcare professional for proper evaluation of your symptoms.",
    recommendations: [
      "Consult with your healthcare provider",
      "Monitor your symptoms closely",
      "Seek immediate medical attention if symptoms worsen"
    ],
    urgency_level: "Consult healthcare provider",
    disclaimer: "This is a fallback response due to analysis failure. Professional medical consultation is strongly recommended."
  }
}
