import { Button } from "./ui/button"
import { ShieldAlert } from "lucide-react"

const QuizError = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="flex flex-col items-center justify-center space-y-6 p-6 text-center">
        <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full animate-bounce">
          <ShieldAlert className="w-12 h-12 text-red-500 dark:text-red-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400">
            Oops! Something went wrong
          </h2>
          <p className="text-lg text-muted-foreground max-w-md">
            We couldn't load the quiz data. Please check your internet
            connection or try again later.
          </p>
        </div>
        <Button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Retry
        </Button>
      </div>
    </div>
  )
}

export default QuizError
