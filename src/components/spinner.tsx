const Spinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="w-16 h-16 border-4 border-t-4 border-primary/30 dark:border-primary/30 border-t-primary dark:border-t-primary rounded-full animate-spin"></div>
        <h2 className="text-xl text-muted-foreground animate-pulse">
          Loading Quiz...
        </h2>
      </div>
    </div>
  )
}

export default Spinner
