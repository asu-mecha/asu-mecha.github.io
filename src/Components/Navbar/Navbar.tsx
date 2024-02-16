import "./Navbar.css";
import logo_light from "../../assets/logo-black.png";
import logo_dark from "../../assets/logo-white.png";
import search_icon_light from "../../assets/search-w.png";
import search_icon_dark from "../../assets/search-b.png";
import toggle_icon_light from "../../assets/night.png";
import toggle_icon_dark from "../../assets/day.png";
import Search from "../Search/search";
import { useState } from "react";

const NavbarHandler = ({
  theme,
  setTheme,
}: {
  theme: string;
  setTheme: (theme: string) => void;
}) => {
  const [navbar, setNavbar] = useState(false);

  const changeBackground = () => {
    console.log(window.scrollY);
    if (window.scrollY >= 250) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  window.addEventListener("scroll", changeBackground);

  return (
    <div className="nav-container">
      <NavbarDesktop theme={theme} setTheme={setTheme} navbar={navbar} />

      <NavbarMobile theme={theme} setTheme={setTheme} navbar={navbar} />
    </div>
  );
};

const Sidebar = ({
  theme,
  setTheme,
}: {
  theme: string;
  setTheme: (theme: string) => void;
}) => {
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const closeSidebar = () => {
    const sidebar = document.querySelector(".sidebar") as HTMLElement;
    sidebar.style.display = "none";
  };

  return (
    <ul className="sidebar">
      <div className="toolbar">
        <li className="sidebar-item" onClick={() => closeSidebar()}>
          <a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="26"
              viewBox="0 -960 960 960"
              width="26"
              fill={theme == "light" ? "black" : "white"}
            >
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
            </svg>
          </a>
        </li>
        <img
          onClick={() => toggleTheme()}
          src={theme == "light" ? toggle_icon_light : toggle_icon_dark}
          alt="toggle"
          className="toggle"
        />
      </div>

      <li className="sidebar-item">
        <a href="/#">Home</a>
      </li>
      <li className="sidebar-item">
        <a href="/#/courses">Courses</a>
      </li>
      <li className="sidebar-item">
        <a href="/#/feedback">Feedback</a>
      </li>
      <li className="sidebar-item">
        <a>Login</a>
      </li>
      <li className="sidebar-item">
        <a href="/#/upload">Upload</a>
      </li>
    </ul>
  );
};

const NavbarDesktop = ({
  theme,
  setTheme,
  navbar,
}: {
  theme: string;
  setTheme: (theme: string) => void;
  navbar: boolean;
}) => {
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };
  return (
    <div>
      <nav className={"navbar desktop " + navbar}>
        <li className="logo" onClick={() => (window.location.href = "/")}>
          <img src={theme == "light" ? logo_light : logo_dark} alt="logo" />
        </li>

        <div className={"searchbar " + navbar}>
          <Search />
          <img
            src={theme == "light" ? search_icon_light : search_icon_dark}
            alt="search"
          />
        </div>
        <ul>
          <li>
            <a href="/#">Home</a>
          </li>
          <li>
            <a href="/#/courses">Courses</a>
          </li>
          <li>
            <a href="/#/feedback">Feedback</a>
          </li>
          <li>
            <a href="/#/upload">Upload</a>
          </li>
        </ul>
        <img
          onClick={() => toggleTheme()}
          src={theme == "light" ? toggle_icon_light : toggle_icon_dark}
          alt="toggle"
          className="toggle"
        />
      </nav>
    </div>
  );
};

const NavbarMobile = ({
  theme,
  setTheme,
  navbar,
}: {
  theme: string;
  setTheme: (theme: string) => void;
  navbar: boolean;
}) => {
  const openSidebar = () => {
    const sidebar = document.querySelector(".sidebar") as HTMLElement;
    console.log(sidebar);
    sidebar.style.display = "flex";
  };
  return (
    <>
      <Sidebar theme={theme} setTheme={setTheme} />
      <div>
        <nav className={"navbar mobile " + navbar}>
          <li className="logo" onClick={() => (window.location.href = "/")}>
            <img src={theme == "light" ? logo_light : logo_dark} alt="logo" />
          </li>
          <div className={"searchbar " + navbar}>
            <Search />
            <img
              src={theme == "light" ? search_icon_light : search_icon_dark}
              alt="search"
            />
          </div>
          <li onClick={() => openSidebar()} className="menu-button">
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="26"
                viewBox="0 -960 960 960"
                width="26"
                fill={theme == "light" ? "black" : "white"}
              >
                <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
              </svg>
            </a>
          </li>
        </nav>
      </div>
    </>
  );
};
export default NavbarHandler;
