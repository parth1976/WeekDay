import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import WeekDayListing from './containers/JobListing';
import './index.scss';

function App() {
  return (
    <React.Fragment className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/jobs" element={<WeekDayListing />} />
        </Routes>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;
