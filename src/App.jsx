import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Landing from "./pages/Landing";
import Scribble from "./pages/Scribble";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import BlogDetails from "./pages/BlogDetails";
import { initGA, sendPageView } from "./utils/GA";
import ScribbleDetails from "./pages/ScribbleDetails";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import NotFound from "./pages/NotFound";
import AuthModal from "./components/AuthModal";
import Seo from "./components/Seo";

const Atlas = lazy(() => import("./pages/Atlas"));

function App() {
  const location = useLocation();

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    sendPageView(location.pathname);
  }, [location]);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Seo path={location.pathname} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/atlas"
          element={
            <Suspense fallback={<div className="atlas-boot" />}>
              <Atlas />
            </Suspense>
          }
        />
        <Route path="/blog" element={<Blog />} />
        <Route path="/scribble" element={<Scribble />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blog/:id" element={<BlogDetails />} />
        <Route path="/scribble/:id" element={<ScribbleDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <AuthModal />
    </>
  );
}

export default App;
