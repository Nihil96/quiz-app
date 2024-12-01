import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { ApolloProvider } from "@apollo/client"
import client from "./apolloClient.ts"
import { BrowserRouter } from "react-router-dom"
import { QuizProvider } from "./context/quiz/quiz.tsx"

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <QuizProvider>
        <App />
      </QuizProvider>
    </ApolloProvider>
  </BrowserRouter>
)
