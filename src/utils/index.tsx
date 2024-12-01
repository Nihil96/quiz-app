import { Question } from "@/types"
import {
  BadgeCheck,
  Star,
  Trophy,
  Target,
  Map,
  Award,
  Medal,
} from "lucide-react"

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

export const getRankIcon = (index: number) => {
  switch (index) {
    case 0:
      return <Trophy className="w-6 h-6 text-yellow-500" />
    case 1:
      return <Medal className="w-6 h-6 text-gray-400" />
    case 2:
      return <Award className="w-6 h-6 text-amber-700" />
    default:
      return null
  }
}

export const getAnimationDelay = (index: number) => {
  return {
    animationDelay: `${(index + 1) * 150}ms`,
    opacity: 0,
    animation: "slide-up 0.7s ease-out forwards",
  }
}

export const getLeaderboardEntryStyle = (index: number): string => {
  switch (index) {
    case 0:
      return "bg-yellow-50"
    case 1:
      return "bg-gray-50"
    case 2:
      return "bg-amber-50"
    default:
      return "bg-muted"
  }
}

export const getAnswerHighlightClass = (
  option: string,
  currentAnswer: string | null,
  correctAnswer: string
) => {
  if (currentAnswer && option === correctAnswer) {
    return "bg-green-500 hover:bg-green-600"
  } else if (currentAnswer === option && option !== correctAnswer) {
    return "bg-red-500 hover:bg-red-600"
  }
  return ""
}
