import { Route, Routes } from "react-router-dom";

import "./App.css";

import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import CareerFocus from "./pages/CareerFocus";
import Home from "./pages/Home";
import JobDetails from "./pages/JobDetails";
import JobPostings from "./pages/JobPostings";
import Profile from "./pages/Profile";
import RoleDetails from "./pages/RoleDetails";
import Roles from "./pages/Roles";
import Skills from "./pages/Skills";

function App() {
  return (
    <>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/roles/:roleId" element={<RoleDetails />} />
          <Route path="/jobs" element={<JobPostings />} />
          <Route path="/jobs/:jobId" element={<JobDetails />} />
          <Route path="/career-focus" element={<CareerFocus />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
