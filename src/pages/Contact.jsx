import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Seo from "../components/Seo";
import { contactAPI } from "../service/allApi";
import "../styles/contact.css";

const EMAIL = "athulksuresh21@gmail.com";
const PHONE = "+91 9562819523";
const RESUME =
  "https://drive.google.com/file/d/1P4aRSAarN1EQOTn9JfeL1VMEozFnnu_D/view";

const CHANNELS = [
  {
    code: "01",
    icon: "fa-envelope",
    label: "Post",
    value: EMAIL,
    href: `mailto:${EMAIL}`,
  },
  {
    code: "02",
    icon: "fa-phone",
    label: "Line",
    value: PHONE,
    href: "tel:+919562819523",
  },
  {
    code: "03",
    icon: "fa-location-dot",
    label: "From",
    value: "Thrissur, Kerala",
  },
];

const SOCIALS = [
  { href: "https://github.com/athulvingt", icon: "fa-github", label: "GitHub" },
  { href: "https://www.linkedin.com/in/athulsuresh96/", icon: "fa-linkedin", label: "LinkedIn" },
  { href: "https://instagram.com/", icon: "fa-instagram", label: "Instagram" },
];

const emptyForm = { name: "", email: "", subject: "", message: "" };

function HarborChart() {
  return (
    <svg className="contact-chart" viewBox="0 0 720 160" aria-hidden="true">
      {[28, 56, 84, 112, 140].map((y) => (
        <line key={y} x1="0" y1={y} x2="720" y2={y} />
      ))}
      {[80, 180, 280, 380, 480, 580, 680].map((x) => (
        <line key={x} x1={x} y1="12" x2={x} y2="148" />
      ))}
      <path
        className="contact-chart-route"
        d="M 36 118 C 160 118, 220 64, 340 72 S 520 128, 640 86"
      />
      <circle cx="36" cy="118" r="3.2" />
      <circle cx="340" cy="72" r="3.2" />
      <circle cx="640" cy="86" r="3.2" />
    </svg>
  );
}

function Contact() {
  const pageRef = useRef(null);
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set(
          ".contact-kicker, .contact-title, .contact-lede, .contact-hero-actions, .contact-channel, .contact-mark, .contact-chart",
          { clearProps: "all", opacity: 1 }
        );
        return;
      }

      gsap.fromTo(
        ".contact-kicker, .contact-title, .contact-lede, .contact-hero-actions",
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.1 }
      );
      gsap.fromTo(
        ".contact-channel",
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.1, delay: 0.2 }
      );
      gsap.fromTo(
        ".contact-mark, .contact-chart",
        { opacity: 0 },
        { opacity: 1, duration: 1, delay: 0.28, ease: "power2.out" }
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (status === "error") {
      setStatus("idle");
      setError("");
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    if (!name || !email || !message) {
      setStatus("error");
      setError("Name, email, and a few lines are enough.");
      return;
    }

    setStatus("sending");
    setError("");
    const result = await contactAPI({
      name,
      email,
      subject: form.subject.trim(),
      message,
    });
    if (!result.ok) {
      setStatus("error");
      setError(result.message || "The note could not be filed.");
      return;
    }
    setStatus("sent");
  };

  const resetLetter = () => {
    setForm(emptyForm);
    setStatus("idle");
    setError("");
  };

  return (
    <div className="contact-page" ref={pageRef}>
      <Seo
        title="Contact"
        description="Write to Athul Suresh — collaborations, AI work, and conversations from Thrissur."
        path="/contact"
      />
      <Header />

      <section className="contact-hero" id="main-content">
        <div className="contact-grid" aria-hidden="true" />
        <div className="contact-paper" aria-hidden="true" />
        <span className="contact-mark contact-mark--tl">Plate 04</span>
        <span className="contact-mark contact-mark--tr">The harbor</span>
        <span className="contact-mark contact-mark--bl">10.5276° N</span>
        <span className="contact-mark contact-mark--br">76.2144° E</span>

        <div className="contact-hero-layout">
          <div className="contact-hero-copy">
            <p className="contact-kicker">04 — Harbor</p>
            <div className="contact-title-wrap">
              <HarborChart />
              <h1 className="contact-title">
                Let&apos;s
                <em>Connect</em>
              </h1>
            </div>
            <p className="contact-lede">
              If something here sparked a thought — a project, a question, or
              just a hello — the boat is at the dock.
            </p>
            <div className="contact-hero-actions">
              <a href="#contact-desk" className="contact-cta">
                Leave a note
                <i className="fa-solid fa-arrow-down"></i>
              </a>
              <a
                className="contact-cta contact-cta--ghost"
                href={RESUME}
                target="_blank"
                rel="noopener noreferrer"
              >
                View resume
              </a>
            </div>
          </div>

          <aside className="contact-channels">
            <p className="contact-channels-label">How to reach</p>
            {CHANNELS.map((channel) => {
              const content = (
                <>
                  <span className="contact-channel-code">{channel.code}</span>
                  <i className={`fa-solid ${channel.icon}`} aria-hidden="true"></i>
                  <div>
                    <small>{channel.label}</small>
                    <strong>{channel.value}</strong>
                  </div>
                </>
              );

              return channel.href ? (
                <a className="contact-channel" key={channel.code} href={channel.href}>
                  {content}
                </a>
              ) : (
                <div className="contact-channel" key={channel.code}>
                  {content}
                </div>
              );
            })}
          </aside>
        </div>
      </section>

      <section className="contact-desk" id="contact-desk">
        <div className="contact-desk-head">
          <p className="contact-kicker">The post</p>
          <h2>Leave it on the desk</h2>
          <p>
            A name, a return address, and whatever you wanted to say. I read
            everything that lands here.
          </p>
        </div>

        <div className="contact-desk-grid">
          <div className="contact-letter">
            <div className="contact-letter-meta">
              <span>To Athul · Thrissur</span>
              <span className="contact-stamp" aria-hidden="true">
                Post
              </span>
            </div>

            {status === "sent" ? (
              <div className="contact-sent" role="status">
                <p className="contact-sent-kicker">Filed</p>
                <h3>The letter is on its way.</h3>
                <p>
                  I usually reply within a few days. Start another note if the
                  thought changed shape.
                </p>
                <button type="button" className="contact-cta" onClick={resetLetter}>
                  Write another
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={onSubmit} noValidate>
                <p className="contact-salutation">Dear Athul,</p>

                <div className="contact-fields">
                  <label className="contact-field">
                    <span>Your name</span>
                    <input
                      type="text"
                      name="name"
                      autoComplete="name"
                      placeholder="Who is writing?"
                      value={form.name}
                      onChange={onChange}
                    />
                  </label>
                  <label className="contact-field">
                    <span>Return address</span>
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder="you@somewhere.com"
                      value={form.email}
                      onChange={onChange}
                    />
                  </label>
                </div>

                <label className="contact-field">
                  <span>Subject</span>
                  <input
                    type="text"
                    name="subject"
                    placeholder="Optional — a heading for the note"
                    value={form.subject}
                    onChange={onChange}
                  />
                </label>

                <label className="contact-field">
                  <span>The note</span>
                  <textarea
                    name="message"
                    rows="7"
                    placeholder="A project, a question, or just a hello."
                    value={form.message}
                    onChange={onChange}
                  />
                </label>

                {error ? <p className="contact-form-error">{error}</p> : null}

                <div className="contact-form-foot">
                  <p>Yours,</p>
                  <button type="submit" className="contact-cta" disabled={status === "sending"}>
                    {status === "sending" ? "Filing" : "Send the note"}
                    <i className="fa-solid fa-paper-plane"></i>
                  </button>
                </div>
              </form>
            )}
          </div>

          <aside className="contact-aside">
            <article className="contact-aside-card">
              <span className="contact-aside-code">01</span>
              <h3>Response</h3>
              <p>
                I usually reply within a few days. If it is urgent, the phone
                line is faster than the post.
              </p>
            </article>
            <article className="contact-aside-card">
              <span className="contact-aside-code">02</span>
              <h3>Open to</h3>
              <p>
                Collaborations, AI/ML work, and conversations that start as a
                question and become a system.
              </p>
            </article>
            <article className="contact-aside-card">
              <span className="contact-aside-code">03</span>
              <h3>Elsewhere</h3>
              <div className="contact-social">
                {SOCIALS.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    <i className={`fa-brands ${social.icon}`}></i>
                  </a>
                ))}
              </div>
            </article>
          </aside>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Contact;
