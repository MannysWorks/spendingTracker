import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavbarIcon } from "../assets/icons/Icons";
import tableIcon from "../assets/Table--Streamline-Sharp.png";
import "../css/SideBar.css";

interface NavItem {
    key: string;
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
}

interface SidebarProps {
    userName?: string;
    onOpenTable: () => void;
}

function Sidebar({ userName = "Manny", onOpenTable }: SidebarProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
    const [profileOpen, setProfileOpen] = useState<boolean>(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMobileMenuOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setProfileOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = (): void => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    const navItems: NavItem[] = [
        {
            key: "table",
            label: "View Table",
            icon: <img className="nav-icon" src={tableIcon} alt="" />,
            onClick: () => {
                onOpenTable();
                setMobileMenuOpen(false); // Close menu after navigation
            },
        }
    ];

    return (
        <>
            {/* Desktop Sidebar - Always Visible */}
            <motion.aside className="sidebar sidebar-desktop">
                <div className="sidebar-top">
                    <div className="sidebar-logo">
                        <NavbarIcon size={32} color="#2b6a3cd9" />
                        <span className="sidebar-title">{userName}'s Spending Tracker</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <button
                            key={item.key}
                            className="sidebar-nav-item"
                            onClick={item.onClick}
                            title={item.label}
                        >
                            {item.icon}
                            <span className="nav-label">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="sidebar-profile" ref={profileRef}>
                    <AnimatePresence>
                        {profileOpen ? (
                            <motion.div
                                className="profile-menu"
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 8 }}
                                transition={{ duration: 0.15 }}
                            >
                                <button className="profile-menu-item logout" onClick={handleLogout}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M16 17l5-5-5-5M21 12H9M13 5v0a4 4 0 00-4 4v6a4 4 0 004 4v0"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    Logout
                                </button>
                            </motion.div>
                        ) : null}
                    </AnimatePresence>

                    <button className="profile-trigger" onClick={() => setProfileOpen((o) => !o)}>
                        <div className="avatar">{userName.charAt(0).toUpperCase()}</div>
                        <span className="profile-name">{userName}</span>
                    </button>
                </div>
            </motion.aside>

            {/* Mobile Header with Burger Menu */}
            <div className="mobile-header">
                <div className="mobile-header-content">
                    <button
                        className={`burger-menu ${mobileMenuOpen ? "open" : ""}`}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    <div className="mobile-logo">
                        <NavbarIcon size={28} color="#2b6a3cd9" />
                        <span className="mobile-title">Spending Tracker</span>
                    </div>
                    <div className="mobile-profile-trigger" ref={profileRef}>
                        <button className="profile-trigger-mobile" onClick={() => setProfileOpen((o) => !o)}>
                            <div className="avatar-mobile">{userName.charAt(0).toUpperCase()}</div>
                        </button>
                        <AnimatePresence>
                            {profileOpen ? (
                                <motion.div
                                    className="profile-menu-mobile"
                                    initial={{ opacity: 0, y: -8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ duration: 0.15 }}
                                >
                                    <div className="profile-menu-header">{userName}</div>
                                    <button className="profile-menu-item logout" onClick={handleLogout}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <path
                                                d="M16 17l5-5-5-5M21 12H9M13 5v0a4 4 0 00-4 4v6a4 4 0 004 4v0"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        Logout
                                    </button>
                                </motion.div>
                            ) : null}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Mobile Dropdown Menu */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            className="mobile-menu"
                            ref={menuRef}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <nav className="mobile-nav">
                                {navItems.map((item) => (
                                    <button
                                        key={item.key}
                                        className="mobile-nav-item"
                                        onClick={item.onClick}
                                    >
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}

export default Sidebar;