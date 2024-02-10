import React from "react";
import "./Navbar.css";
import logo_light from "../../assets/logo-black.png";
import logo_dark from "../../assets/logo-white.png";
import search_icon_light from "../../assets/search-w.png";
import search_icon_dark from "../../assets/search-b.png";
import toggle_icon_light from "../../assets/night.png";
import toggle_icon_dark from "../../assets/day.png";
import { Route } from "react-router-dom";

const Navbar = ({ theme, setTheme }) => {
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <nav className="navbar">
      <img
        src={theme == "light" ? logo_light : logo_dark}
        alt="logo"
        className="logo"
        onClick={() => (window.location.href = "/")}
      />

      <ul>
        <li onClick={() => (window.location.href = "/")}>Home</li>
        <li onClick={() => (window.location.href = "/about")}>About</li>
        <li onClick={() => (window.location.href = "/contact")}>Contact</li>
        <li onClick={() => (window.location.href = "/upload")}>Upload</li>
      </ul>

      <div className="searchbar">
        <input type="text" placeholder="Search" />
        <img
          src={theme == "light" ? search_icon_light : search_icon_dark}
          alt="search"
        />
      </div>

      <img
        onClick={() => toggleTheme()}
        src={theme == "light" ? toggle_icon_light : toggle_icon_dark}
        alt="toggle"
        className="toggle"
      />
    </nav>
  );
};

export default Navbar;
