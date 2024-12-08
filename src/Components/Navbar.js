import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { useTranslation } from "react-i18next";
import logo from "./../assests/Logo.webp";

const Navbar = ({ searchQuery, setSearchQuery, onAboutUsClick }) => {
  const { i18n, t } = useTranslation();
  const [language, setLanguage] = useState("EN");

  const handleLanguageChange = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    i18n.changeLanguage(selectedLanguage.toLowerCase()); // Change app's language
  };

  const languages = [
    {
      code: "EN",
      name: "EN",
      flag: require("./../assests/flags/us.webp"),
    },
    { code: "HI", name: "HI", flag: require("./../assests/flags/in.webp") },
    {
      code: "BAN",
      name: "BAN",
      flag: require("./../assests/flags/bd.webp"),
    },
  ];

  return (
    <nav>
      <div className="logo-container">
        <img src={logo} alt="logo" className="logo" />
      </div>
      <div className="search-container">
        <input
          type="text"
          placeholder={t("search")}
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="search-button">🔍</button>
      </div>
      <div className="language-selector">
        <div className="dropdown">
          <button className="dropdown-button">
            <img
              src={languages.find((lang) => lang.code === language).flag}
              alt="current language"
              className="flag-icon"
            />
            {languages.find((lang) => lang.code === language).name}
            <span className="dropdown-icon">▼</span>
          </button>
          <div className="dropdown-menu">
            {languages.map((lang) => (
              <div
                key={lang.code}
                className="dropdown-item"
                onClick={() => handleLanguageChange(lang.code)}
              >
                <img src={lang.flag} alt={lang.name} className="flag-icon" />
                {lang.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <ul className="nav-links">
        <li>
          <button onClick={onAboutUsClick}>{t("aboutUs")}</button>
        </li>
        <li>
          <Link to="/login">{t("login")}</Link>
        </li>
        <li>
          <Link to="/register">{t("signup")}</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

