import { useState, useRef } from "react";
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
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [profileOpen, setProfileOpen] = useState<boolean>(false);
    const profileRef = useRef<HTMLDivElement>(null);

    const handleLogout = (): void => {
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    const navItems: NavItem[] = [
        {
            key: "table",
            label: "View Table",
            icon: <img className="nav-icon" src={tableIcon} alt="" />,
            onClick: onOpenTable,
        }
    ];

    return (
        <motion.aside
            className="sidebar"
            animate={{ width: collapsed ? 72 : 300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            <div className="sidebar-top">
                <div className="sidebar-logo">
                    <NavbarIcon size={32} color="#2b6a3cd9" />
                    {!collapsed && <span className="sidebar-title">{userName}'s Spending Tracker</span>}
                </div>
                <button
                    className="sidebar-toggle"
                    onClick={
                        () => setCollapsed((c) => !c)
                    }
                    aria-label="Toggle sidebar"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path
                            d={collapsed ? "M9 18l6-6-6-6" : "M15 18l-6-6 6-6"}
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>

            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <button
                        key={item.key}
                        className="sidebar-nav-item"
                        onClick={item.onClick}
                        title={collapsed ? item.label : undefined}
                    >
                        {item.icon}
                        {!collapsed && <span className="nav-label">{item.label}</span>}
                    </button>
                ))}
            </nav>

            <div className="sidebar-profile" ref={profileRef}>
                {
                    // If the sidebar is collapsed, the logout button will be hidden until the sidebar is expanded, then let the user click on the profile button to reveal the logout button.
                }
                <AnimatePresence>
                    {profileOpen && !collapsed ? (
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
                    {!collapsed && <span className="profile-name">{userName}</span>}
                </button>
            </div>
        </motion.aside>
    );
}

export default Sidebar;