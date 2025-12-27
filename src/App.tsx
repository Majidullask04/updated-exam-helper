import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import AnalysisPage from './components/pages/Analysis';
import QuestionsPage from './components/pages/Questions';
import AnswersPage from './components/pages/Answers';
import NotesPage from './components/pages/Notes';
import SummariesPage from './components/pages/Summaries';
import MorePage from './components/pages/More';

function App() {
  const [path, setPath] = useState<string>(window.location.pathname || '/');

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = (to: string) => {
    if (to === path) return;
    window.history.pushState({}, '', to);
    setPath(to);
  };

  const renderMain = () => {
    switch (path) {
      case '/':
        return <Home navigate={navigate} />;
      case '/analysis':
        return <AnalysisPage navigate={navigate} />;
      case '/questions':
        return <QuestionsPage navigate={navigate} />;
      case '/answers':
        return <AnswersPage navigate={navigate} />;
      case '/notes':
        return <NotesPage navigate={navigate} />;
      case '/summaries':
        return <SummariesPage navigate={navigate} />;
      case '/more':
        return <MorePage navigate={navigate} />;
      default:
        return <Home navigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header onNavigate={navigate} />
      <main className="p-5 md:p-6 max-w-3xl mx-auto">{renderMain()}</main>
    </div>
  );
}

export default App;
