import React from 'react';

function Hero() {
    return (
        <div className="relative flex flex-col md:flex-row items-center justify-between px-6 py-10 
                       mt-22 md:mt-0 md:py-20 gap-10 md:gap-0">


            {/* Left Side */}
            <div className='md:w-1/2 leading-8 z-10 ml-0 md:ml-15 lg:ml-20'>
                <p className='text-xl text-gray-500 uppercase'>Total Business Solutions</p>
                <h1 className='text-4xl mt-3 font-semibold'>
                    Big Data Analytics & <br /> AI Consultant
                </h1>
                <p className='text-xl mt-4 text-gray-500'>
                    Excel Analytics Platform is a leading provider of
                    data analytics and AI solutions for businesses.
                </p>
                <button className='bg-pink-500 text-white px-4 py-2 rounded-md mt-8'>
                    Get Started
                </button>
            </div>

            {/* Right Side */}
            <div className="md:w-1/2 mt-1 md:mt-15 flex justify-center md:justify-end relative z-10">
                <div className="relative w-full max-w-md">
                    <img
                        src="https://datrics.themetags.com/img/hero-single-img-1.svg"
                        alt="Hero"
                        className="w-full float-up-down relative z-20"
                    />
                    <img
                        src="https://datrics.themetags.com/img/hero-animation-01.svg"
                        alt="Animation"
                        className="absolute top-0 left-[60px] w-full float-up-down animation-two z-10"
                    />
                </div>
            </div>



            {/* Hero Shape (Background) */}
            
            <div className='hidden md:block absolute top-[-80%] right-[-50%]
      w-full h-[115%] bg-[#162e66] rounded-[100px] rotate-[-35deg] z-0'></div>

        </div>
    );
}

export default Hero;
