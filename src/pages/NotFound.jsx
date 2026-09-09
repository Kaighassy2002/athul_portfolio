import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Seo from "../components/Seo";

export default function NotFound() {
  return (
    <div className="article-page">
      <Seo title="Not found" path="/404" noIndex />
      <Header />
      <main id="main-content" className="article-status is-error">
        <p>This plate is not on the map.</p>
        <Link to="/" className="article-end-link">
          Back to the landing
        </Link>
      </main>
      <Footer />
    </div>
  );
}
