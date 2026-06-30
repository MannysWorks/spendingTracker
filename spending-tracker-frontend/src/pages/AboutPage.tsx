import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import "../css/AboutPage.css";
import { NavbarIcon } from "../assets/icons/Icons";
import memeguy from "../assets/bitingLipMemeGuy.jpg"

export function AboutPage() {
    const navigate = useNavigate();

    return (
        <>
            <div className="logo-wrapper">
                <NavbarIcon size={40} color="#1a6e1a" />
            </div>
            <div className="about-root">
                {/* Background grid lines — purely decorative */}
                <div className="about-grid-bg" aria-hidden="true" />

                <main className="about-main">
                    {/* ── Hero ── */}
                    <motion.section
                        className="about-hero"
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >

                        <h1 className="about-headline">
                            Track your spending twin!
                            <br />
                            <span className="about-headline-accent"></span>
                        </h1>

                        <p className="about-subhead">
                            My personal finance tracker. I built it mostly because I got tired of tracking
                            my entries on google spreadsheet {":)"}
                        </p>

                        <motion.button
                            className="about-cta"
                            onClick={() => navigate("/login")}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <LogIn size={18} strokeWidth={2} />
                            Sign in to my tracker
                        </motion.button>
                    </motion.section>

                    {/* ── Footer note ── */}
                    <motion.p
                        className="about-footer-note"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.55 }}
                    >
                        <img className="about-footer-img" src={memeguy}></img>
                        Check me out on the hub ·{" "}
                        <a
                            href="https://github.com/MannysWorks"
                            target="_blank"
                            rel="noreferrer"
                        >
                            MannysWorks
                        </a>
                    </motion.p>
                </main>
            </div>
        </>
    );

}