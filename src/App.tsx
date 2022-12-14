import { useState, useEffect } from "react";
import React from "react";
import { nanoid } from "nanoid";
import { countryDataInterface } from "./interfaces/countryDataInterface";

import Navbar from "./components/Navbar";
import SearchIcon from "@mui/icons-material/Search";
import Country from "./components/Country";
import CountryInfo from "./components/CountryInfo";

function App() {
  const [countryData, setCountryData] = useState<any[]>([]);
  const [countryDataMutable, setCountryDataMutable] = useState<any[]>([]);
  const [countryDataInput, setCountryDataInput] = useState<any[]>([]);
  const [countryDataInputMutable, setCountryDataInputMutable] = useState<any[]>(
    []
  );

  const [countryId, setCountryId] = useState<number>(0);
  const [countryInputName, setCountryInputName] = useState<string>("");
  const [toggleCountryInfo, setToggleCountryInfo] = useState<boolean>(false);
  const [toggleDropdown, setToggleDropdown] = useState<boolean>(false);
  const [regionSelected, setRegionSelected] = useState<boolean>(false);
  const [searching, setSearching] = useState<boolean>(false);

  const [toggleDarkMode, setToggleDarkMode] = useState<boolean>(false);

  useEffect(function () {
    console.log(countryData);

    fetch("https://restcountries.com/v3.1/all")
      .then((res) => res.json())
      .then((data) => setCountryData(data));
  }, []);

  countryData.sort(function (a, b) {
    if (a.name.common < b.name.common) {
      return -1;
    }
    if (a.name.common > b.name.common) {
      return 1;
    }
    return 0;
  });

  const countrysList = countryData.map((country) => {
    return (
      <Country
        countryName={country.name.common}
        countryImg={country.flags.png}
        countryRegion={country.region}
        countryCapital={country.capital}
        countryPopulation={country.population}
        key={nanoid()}
        showCountryInfo={showCountryInfo}
        name={country.name.common}
      />
    );
  });

  const countryListFiltered = countryDataMutable.map((country) => {
    return (
      <Country
        countryName={country.name.common}
        countryImg={country.flags.png}
        countryRegion={country.region}
        countryCapital={country.capital}
        countryPopulation={country.population}
        key={nanoid()}
        showCountryInfo={showCountryInfo}
        name={country.name.common}
      />
    );
  });

  const countryListInputFiltered = countryDataInputMutable.map((country) => {
    return (
      <Country
        countryName={country.name.common}
        countryImg={country.flags.png}
        countryRegion={country.region}
        countryCapital={country.capital}
        countryPopulation={country.population}
        key={nanoid()}
        showCountryInfo={showCountryInfo}
        name={country.name.common}
      />
    );
  });

  function selectRegion(countryRegion: string) {
    setCountryDataMutable(
      countryData.filter((country) => country.region === countryRegion)
    );
    setRegionSelected(true);
    setCountryDataInputMutable(
      countryDataInput.filter((country) => country.region === countryRegion)
    );
  }

  function showCountryInfo(event: any, countryName: any) {
    setToggleCountryInfo(true);
    const boolList = countryData.map(
      (country) => country.name.common === countryName
    );
    const index: number = boolList.indexOf(true);
    setCountryId(index);
  }

  function hideCountryInfo() {
    setToggleCountryInfo(false);
  }

  function handleChange(e: {
    target: { value: React.SetStateAction<string> };
  }) {
    setCountryInputName(e.target.value);
  }

  useEffect(() => {
    setCountryDataInput(
      countryData.filter(
        (country) =>
          country.name.common
            .slice(0, countryInputName.length)
            .toUpperCase() === countryInputName.toUpperCase()
      )
    );

    countryInputName.length < 1 ? setSearching(false) : setSearching(true);
  }, [countryInputName]);

  const countryListInput = countryDataInput.map((country) => {
    return (
      <Country
        countryName={country.name.common}
        countryImg={country.flags.png}
        countryRegion={country.region}
        countryCapital={country.capital}
        countryPopulation={country.population}
        key={nanoid()}
        showCountryInfo={showCountryInfo}
        name={country.name.common}
      />
    );
  });

  return (
    <div className={toggleDarkMode ? "App dark" : "App "}>
      <Navbar
        switchDarkMode={() => setToggleDarkMode(!toggleDarkMode)}
        toggleDarkMode={toggleDarkMode}
      />
      {!toggleCountryInfo ? (
        <div className="app__body">
          <div className="app__form">
            <div
              className={
                toggleDarkMode
                  ? "app__form-input-container dark-element"
                  : "app__form-input-container"
              }
            >
              <span>
                <SearchIcon className="app__form-input-search" />
              </span>
              <input
                type="text"
                placeholder="Search for a country..."
                className={
                  toggleDarkMode
                    ? "dark-element app__form-input"
                    : "app__form-input"
                }
                onChange={handleChange}
                name={countryInputName}
              />
              <button type="submit"></button>
            </div>

            <div className={"app__form-select"}>
              <h4
                style={{ fontWeight: 400 }}
                onClick={() => setToggleDropdown(!toggleDropdown)}
                className={toggleDarkMode ? "dark-element" : ""}
              >
                Select by region:
              </h4>
              {toggleDropdown && (
                <ul className={toggleDarkMode ? "dark-element" : ""}>
                  <li onClick={() => setRegionSelected(false)}>Any region</li>
                  <li onClick={() => selectRegion("Asia")}>Asia</li>
                  <li onClick={() => selectRegion("Europe")}>Europe</li>
                  <li onClick={() => selectRegion("Africa")}>Africa</li>
                  <li onClick={() => selectRegion("Oceania")}>Oceania</li>
                  <li onClick={() => selectRegion("Americas")}>Americas</li>
                  <li onClick={() => selectRegion("Antarctic")}>Antarctic</li>
                </ul>
              )}
            </div>
          </div>
          <div className="app__countrysList">
            {!searching
              ? !regionSelected
                ? countrysList
                : countryListFiltered
              : !regionSelected
              ? countryListInput
              : countryListInputFiltered}
          </div>
        </div>
      ) : (
        <CountryInfo
          countryImg={countryData[countryId].flags.png}
          countryIndependant={countryData[countryId].independent}
          hideCountryInfo={hideCountryInfo}
          countryName={countryData[countryId].name.common}
          countryOfficialName={countryData[countryId].name.official}
          countryNativeName={
            countryData[countryId].name.nativeName === undefined
              ? "No native name..."
              : countryData[countryId].name.nativeName[
                  Object.keys(countryData[countryId].name.nativeName)[0]
                ].common
          }
          countryPopulation={countryData[countryId].population}
          countryRegion={countryData[countryId].region}
          countrySubRegion={countryData[countryId].subregion}
          countryCapital={
            countryData[countryId].capital === undefined
              ? "No capital..."
              : countryData[countryId].capital[0]
          }
          countryDomain={countryData[countryId].tld}
          countryCurrency={
            countryData[countryId].currencies === undefined
              ? "No currency..."
              : countryData[countryId].currencies[
                  Object.keys(countryData[countryId].currencies)[0]
                ][
                  Object.keys(
                    countryData[countryId].currencies[
                      Object.keys(countryData[countryId].currencies)[0]
                    ]
                  )[0]
                ]
          }
          countryLanguages={
            countryData[countryId].languages === undefined
              ? "No language..."
              : countryData[countryId].languages[
                  Object.keys(countryData[countryId].languages)[0]
                ]
          }
          toggleDarkMode={toggleDarkMode}
        />
      )}
    </div>
  );
}

export default App;
