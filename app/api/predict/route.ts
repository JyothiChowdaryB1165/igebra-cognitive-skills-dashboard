import { NextResponse } from "next/server"

export interface PredictionRequest {
  comprehension: number
  attention: number
  focus: number
  retention: number
  engagement_time: number
}

export interface PredictionResponse {
  predicted_assessment_score: number
  confidence: number
  input_features: PredictionRequest
  model_info: {
    model_type: string
    features_used: string[]
  }
}

export async function POST(request: Request) {
  try {
    const body: PredictionRequest = await request.json()

    // Validate input
    const requiredFields = ["comprehension", "attention", "focus", "retention", "engagement_time"]
    for (const field of requiredFields) {
      if (!(field in body) || typeof body[field as keyof PredictionRequest] !== "number") {
        return NextResponse.json({ error: `Missing or invalid field: ${field}` }, { status: 400 })
      }
    }

    // For now, return a mock prediction since we can't easily run Python in Vercel
    // In a real implementation, you would either:
    // 1. Use a Python microservice
    // 2. Convert the model to JavaScript using libraries like TensorFlow.js
    // 3. Use a cloud ML service like AWS SageMaker or Google Cloud ML

    const mockPrediction = calculateMockPrediction(body)

    return NextResponse.json(mockPrediction)
  } catch (error) {
    console.error("Error in prediction API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Mock prediction function that simulates the ML model
function calculateMockPrediction(input: PredictionRequest): PredictionResponse {
  // Simple linear combination that approximates the trained model
  const weights = {
    comprehension: 0.3,
    attention: 0.25,
    focus: 0.25,
    retention: 0.2,
  }

  const baseScore =
    input.comprehension * weights.comprehension +
    input.attention * weights.attention +
    input.focus * weights.focus +
    input.retention * weights.retention

  // Add engagement time effect (normalized)
  const engagementEffect = Math.min((input.engagement_time - 30) / 270, 1) * 5

  const predictedScore = Math.max(0, Math.min(100, baseScore + engagementEffect))

  // Calculate confidence based on input consistency
  const scores = [input.comprehension, input.attention, input.focus, input.retention]
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length
  const variance = scores.reduce((acc, score) => acc + Math.pow(score - avgScore, 2), 0) / scores.length
  const confidence = Math.max(70, 95 - variance / 10)

  return {
    predicted_assessment_score: Math.round(predictedScore * 10) / 10,
    confidence: Math.round(confidence * 10) / 10,
    input_features: input,
    model_info: {
      model_type: "RandomForestRegressor (Mock)",
      features_used: ["comprehension", "attention", "focus", "retention", "engagement_time"],
    },
  }
}
