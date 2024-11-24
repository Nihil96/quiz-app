import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Home } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { getFeedback } from "@/utils"
import { ROUTES } from "@/constants/routes"

interface ResultsProps {
  score: number
  totalQuestions: number
}

const Results = ({ score, totalQuestions }: ResultsProps) => {
  const navigate = useNavigate()
  const percentage = (score / totalQuestions) * 100

  const feedback = getFeedback(percentage)
  const FeedbackIcon = feedback.icon

  return (
    <div className="min-h-screen flex items-center justify-center p-4 from-background to-muted">
      <Card className="w-full max-w-2xl mx-auto shadow-lg opacity-0 animate-fade-in">
        <CardHeader className="space-y-2">
          <div className="flex justify-center">
            <FeedbackIcon
              className={`w-16 h-16 ${feedback.color} animate-bounce`}
            />
          </div>
          <CardTitle className="text-3xl text-center">
            {feedback.message}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="text-center space-y-4 opacity-0 animate-slide-up-400">
            <div className="text-5xl font-bold">
              {score}/{totalQuestions}
            </div>
            <Progress value={percentage} className="h-3 w-3/4 mx-auto" />
            <Badge variant="secondary" className="text-lg px-4 py-1">
              {percentage}% Accuracy
            </Badge>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4 opacity-0 animate-slide-up-800">
            <Button
              onClick={() => navigate(ROUTES.WELCOME)}
              variant="outline"
              className="group hover:scale-105 transition-transform"
            >
              <Home className="mr-2 group-hover:animate-pulse" />
              Try Again
            </Button>
            <Button
              onClick={() => navigate(ROUTES.LEADERBOARD)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 group hover:scale-105 transition-transform"
            >
              <Trophy className="mr-2 group-hover:animate-bounce" />
              View Leaderboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Results
