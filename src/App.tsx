import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import MissionBriefing from './components/MissionBriefing';
import { QuizChallenge } from './components/QuizChallenge';
import CourseSelection from './components/CourseSelection';
import TraditionalSOCCourse from './components/TraditionalSOCCourse';
import NextGenSOCCourse from './components/NextGenSOCCourse';
import ScenarioTraining from './components/ScenarioTraining';

function App() {
  const navigate = useNavigate();

  const handleSkipToScenario = () => {
    navigate('/courses');
  };

  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<MissionBriefing />} />
        <Route 
          path="/quiz" 
          element={
            <QuizChallenge 
              onGoHome={() => navigate('/')} 
              onSkipToScenario={handleSkipToScenario}
            />
          } 
        />
        <Route path="/courses" element={<CourseSelection />} />
        <Route path="/course/traditional" element={<TraditionalSOCCourse />} />
        <Route path="/course/nextgen" element={<NextGenSOCCourse />} />
        <Route path="/scenario/:scenarioId" element={<ScenarioTraining />} />
      </Routes>
    </div>
  );
}

export default App;