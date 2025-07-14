import React from 'react';
import './App.css';
import heroImage from './assets/hero.jpg';
import aboutImage from './assets/about.png';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>React Test Project</h1>
        <img src={heroImage} alt="Hero" className="hero-image" />
      </header>
      
      <main>
        <section className="about">
          <h2>About</h2>
          <p>This is a React test project for SEOthing.</p>
          <img src={aboutImage} alt="About us" />
        </section>
        
        <section className="services">
          <h2>Services</h2>
          <img src="./assets/service.jpeg" alt="Our services" />
        </section>
      </main>
    </div>
  );
}

export default App; 