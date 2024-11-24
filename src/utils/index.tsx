import { Question } from "@/types"
import { BadgeCheck, Star, Trophy, Target, Map, Award } from "lucide-react"

export const getFeedback = (percentage: number) => {
  if (percentage === 100)
    return { message: "Perfect Score!", icon: Star, color: "text-yellow-500" }
  if (percentage >= 80)
    return {
      message: "Excellent Work!",
      icon: BadgeCheck,
      color: "text-green-500",
    }
  if (percentage >= 60)
    return { message: "Good Job!", icon: Trophy, color: "text-blue-500" }
  return { message: "Keep Practicing!", icon: Star, color: "text-purple-500" }
}

export const getQuestionIcon = (currentQuestion: Question) => {
  switch (currentQuestion.type) {
    case "capital":
      return <Target className="w-6 h-6 text-purple-500 animate-pulse" />
    case "continent":
      return <Map className="w-6 h-6 text-blue-500 animate-pulse" />
    default:
      return <Award className="w-6 h-6 text-amber-500 animate-pulse" />
  }
}