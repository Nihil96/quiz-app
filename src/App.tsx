import { Route, Routes } from "react-router-dom"
import Welcome from "./pages/welcome"
import Quiz from "./pages/quiz"
import Leaderboard from "./pages/leaderboard"
import Results from "./pages/results"
import PageNotFound from "./pages/pageNotFound"
import { ROUTES } from "./constants/routes"

function App() {
  return (
    <div className="min-h-full w-full px-2">
      <Routes>
        <Route path={ROUTES.WELCOME} element={<Welcome />} />
        <Route path={ROUTES.QUIZ} element={<Quiz />} />
        <Route path={ROUTES.LEADERBOARD} element={<Leaderboard />} />
        <Route path={ROUTES.RESULT} element={<Results />} />
        <Route path={ROUTES.PAGE_NOT_FOUND} element={<PageNotFound />} />
      </Routes>
    </div>
  )
}

export default App
