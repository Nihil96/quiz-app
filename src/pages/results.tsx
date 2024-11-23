import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Home } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface ResultsProps {
  score: number
  totalQuestions: number
}

const Results = ({ score, totalQuestions }: ResultsProps) => {
  const navigate = useNavigate()

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center mb-4">
          Quiz Complete!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-4xl font-bold mb-2">
            {score}/{totalQuestions}
          </div>
          <div className="text-lg">Correct Answers</div>
        </div>
        <div className="flex justify-center space-x-4">
          <Button onClick={() => navigate("/")} variant="outline">
            <Home className="mr-2" />
            Home
          </Button>
          <Button onClick={() => navigate("/leaderboard")}>
            <Trophy className="mr-2" />
            View Leaderboard
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default Results
