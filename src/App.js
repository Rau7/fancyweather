import { useEffect, useState } from "react";
import { createClient } from "pexels";
import ReactCountryFlag from "react-country-flag";

const API_KEY = "//";

const pexelsClient = createClient("//");

function App() {
  const [weather, setWeather] = useState();
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);
  const [videoQuery, setVideoQuery] = useState("clear sky");
  const [city, setCity] = useState("Ankara");
  const videoQueryForAPI = videoQuery.replaceAll(" ", "+");
  const [videoData, setVideoData] = useState();
  const [isLoadingVideo, setIsLoadingVideo] = useState(true);
  var rnd = Math.floor(Math.random() * 20) + 0;

  const handleCity = (city) => {
    setCity(city);
  };

  const handleForm = (e) => {
    e.preventDefault();
    setIsLoadingVideo(true);
    initialAPICall();
    getNewVideo();
  };

  useEffect(() => {
    initialAPICall();
  }, []);

  const initialAPICall = async () => {
    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
    );
    let data = await response.json();
    setWeather(data);
    console.log(data);
    setVideoQuery(data.weather[0].description);
    setIsLoadingWeather(false);

    //return data;
  };

  useEffect(() => {
    setIsLoadingVideo(true);
    getNewVideo();
  }, [videoQuery]);

  const getNewVideo = () => {
    const query = videoQuery;
    pexelsClient.videos.search({ query, per_page: 20 }).then((videos) => {
      const videoFiles = videos.videos[rnd].video_files;
      videoFiles.sort((a, b) => (a.width > b.width ? -1 : 1));
      console.log(videoFiles[0].link);
      setVideoData(videoFiles[0].link);
      setIsLoadingVideo(false);
    });
  };

  return (
    <div className="App">
      <Header />
      <SelectCity city={city} handleCity={handleCity} handleForm={handleForm} />
      <Main>
        <Video videoData={videoData} isLoadingVideo={isLoadingVideo} />
        <MainContainer loading={isLoadingWeather} weather={weather} />
      </Main>
    </div>
  );
}

function Header() {
  return (
    <header>
      <h1>FancyWeatherApp ☂️</h1>
    </header>
  );
}

function Main({ children }) {
  return <main>{children}</main>;
}

function MainContainer({ loading, weather }) {
  const kelvinToCelcius = (kelvin) => {
    return Math.round(kelvin - 273);
  };
  return (
    <section className="container">
      {loading ? (
        <div>Loading</div>
      ) : (
        <div className="w-card">
          <div className="card-heading">
            <h1>
              {weather.name}, {weather.sys.country}{" "}
              <ReactCountryFlag countryCode={weather.sys.country} svg />
            </h1>
            <p className="actual">{kelvinToCelcius(weather.main.temp)} &deg;</p>
            <p className="feels">
              Feels Like :{" "}
              <span className="deg">
                {kelvinToCelcius(weather.main.feels_like)} &deg;
              </span>
            </p>
            <p className="w-desc">{weather.weather[0].main}</p>
          </div>
          <div className="card-body">
            <div className="card-left">
              <ul>
                <li>
                  <span className="inf">Temp Min-Max :</span>{" "}
                  <span className="deg">
                    {kelvinToCelcius(weather.main.temp_min)}&deg;
                  </span>
                  -
                  <span className="deg">
                    {kelvinToCelcius(weather.main.temp_max)}&deg;
                  </span>
                </li>
                <li>
                  <span className="inf">Pressure :</span>{" "}
                  {weather.main.pressure}
                </li>
                <li>
                  <span className="inf">Humidity :</span>{" "}
                  {weather.main.humidity}
                </li>
              </ul>
            </div>
            <div className="card-right">
              <ul>
                <li>
                  <span className="inf">Wind Speed :</span> {weather.wind.speed}
                </li>
                <li>
                  <span className="inf">Wind Degree :</span> {weather.wind.deg}
                </li>
                <li>
                  <span className="inf">Sea Level:</span>{" "}
                  {weather.main.sea_level}
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function Video({ videoData, isLoadingVideo }) {
  return (
    <div className="video">
      {isLoadingVideo ? (
        <div>Loading</div>
      ) : (
        <video loop muted autoPlay>
          <source src={videoData} type="video/mp4" />
        </video>
      )}
    </div>
  );
}

function SelectCity({ city, handleCity, handleForm }) {
  return (
    <form onSubmit={handleForm}>
      <input
        className="form-in"
        placeholder="Please Enter A City...."
        value={city}
        onChange={(e) => handleCity(e.target.value)}
      />
      <button type="submit">Go!</button>
    </form>
  );
}

export default App;
