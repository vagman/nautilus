import openWeatherLogo from '../assets/openweathermap.png';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          Weather data provided by{' '}
          <a
            href="https://openweathermap.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenWeather
          </a>
        </p>

        <a
          href="https://openweathermap.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={openWeatherLogo}
            alt="OpenWeather logo"
            className="footer-logo"
          />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
