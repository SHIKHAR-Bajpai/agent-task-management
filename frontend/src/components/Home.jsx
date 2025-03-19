import React from 'react';
import Header from './Header';
import Footer from './Footer';
import home from '../assets/images/home.svg';
import '.././App.css'

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />

      <div className="flex-grow flex justify-center items-center relative">
        <div className="text-center z-10 mr-5" style={{marginRight: "50vw"}}>
          <h1 className="text-4xl font-extrabold mb-6">
            Organise team and 
            <div className="text-8xl duration-300 text-blue-500 animate-pulse text-center">
              <div className='typewriter'>Work Faster...</div>
            </div>
          </h1>
        </div>
          <img src={home} alt="home illustration"
            className="absolute right-0 top-1/2 transform translate-y-[-50%] w-1/2 lg:w-1/3 mr-48"/>
        </div>

      <Footer />
    </div>
  );
};

export default HomePage;
