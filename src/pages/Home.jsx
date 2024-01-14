import React from 'react'
import {FaArrowRight} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import HighlightText from '../components/core/HomePage/HighlightText'
import CTAButton from "../components/core/HomePage/Button"

import Banner from "../assets/Images/banner.mp4"
import CodeBlocks from '../components/core/HomePage/CodeBlocks'
import Footer from '../components/common/Footer'
import TimelineSection from '../components/core/HomePage/TimelineSection'
import LearningLanguageSection from '../components/core/HomePage/LearningLanguageSection'
import InstructorSection from '../components/core/HomePage/InstructorSection'
import ExploreMore from '../components/core/HomePage/ExploreMore'

const Home = () => {
  return (
    <div>
        {/* Section-01 */}
        <div className='relative mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white justify-between'>

            {/* first Subsection of Become an Instructor */}
            <Link to={"/signup"}>
                <div className=' group mt-16 p-1 mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200
                transition-all duration-200 hover:scale-95 w-fit hover:shadow-[0_6px_12px_rgba(8,_112,_184,_0.7)]'>
                    <div className='flex flex-row items-center gap-2 rounded-full px-10 py-[5px]
                    transition-all duration-200 group-hover:bg-richblack-900'>
                        <p>Become an Instructor</p>
                        <FaArrowRight />
                    </div>
                </div>
            </Link>

            <div className=' text-center text-4xl font-semibold mt-7'>
                Empower Your Future with
                <HighlightText text={"Coding Skills"}/>
            </div>

            <div className=' mt-4 w-[90%] text-center text-lg font-bold text-richblack-300 '>
                With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors.
            </div>

            {/* Yellow and Black Buttons */}
            <div className=' flex flex-row gap-7 mt-8'>
                <CTAButton active={true} linkto={"/signup"}>
                    Learn More
                </CTAButton>
                <CTAButton active={false} linkto={"/login"}>
                    Book a Demo
                </CTAButton>
            </div>

            {/*live Video */}
            <div className=' mx-3 my-12 shadow-[-3px_-6px_15px_rgba(8,_112,_184,_0.7)]'>
                <video muted loop autoPlay className=' shadow-[16px_16px_rgba(255,255,255)]'>
                    <source src={Banner} type="video/mp4" />
                </video>
            </div>

            {/* Code Section 1 */}
            <div>
                <CodeBlocks
                    position={"flex-col lg:flex-row "}
                    heading={
                    <div className='text-4xl font-semibold'>
                        Unlock Your
                        <HighlightText text={"coding potential "}/>
                        with our online courses.
                    </div>
                    }
                    subheading = {
                    "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                    }
                    ctabtn1={
                    {
                        btnText: "try it yourself",
                        linkto: "/signup",
                        active: true,
                    }
                    }
                    ctabtn2={
                        {
                            btnText: "learn more",
                            linkto: "/login",
                            active: false,
                        }
                    }
                    codeblock={`<<!DOCTYPE html>\n<html>\n<head>\n<title>Example</title>\n<linkrel="stylesheet" href="styles.css" />\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav><a href="/one">One</a>\n<a> href="/two">Two</a></nav>\n</body>`}
                    codeColor={"text-yellow-25"}
                ></CodeBlocks>
            </div>

            {/* Code Section 2 */}
            <div>
                <CodeBlocks
                    position={"flex-col lg:flex-row-reverse "}
                    heading={
                    <div className='text-4xl font-semibold'>
                        Start 
                        <HighlightText text={"coding in seconds."}/>
                    </div>
                    }
                    subheading = {
                    "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
                    }
                    ctabtn1={
                    {
                        btnText: "Continue Lessons",
                        linkto: "/signup",
                        active: true,
                    }
                    }
                    ctabtn2={
                        {
                            btnText: "learn more",
                            linkto: "/login",
                            active: false,
                        }
                    }
                    codeblock={`import React from 'react'\nimport CTAButton from "../HomePage/Button"\nimport {FaArrowRight} from "react-icons/fa"\nimport { TypeAnimation } from 'react-type-animation'\nconst CodeBlocks = () => {\nreturn (\n<div >\n</div>\n)\n}\nexport default CodeBlocks`}
                    codeColor={"text-yellow-25"}
                ></CodeBlocks>
            </div>

            <ExploreMore />

        </div>

        {/* Section-02 */}
        <div className='bg-pure-greys-5 text-richblack-700 mt-14'>

            <div className=' homepage_bg h-[310px]'>
                <div className='w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-5 mx-auto'>
                    <div className='h-[150px]'></div>
                    <div className='flex flex-row gap-7 text-white '>
                        <CTAButton active={true} linkto={"/signup"}>
                            <div className='flex items-center gap-3' >
                                Explore Full Catalog
                                <FaArrowRight />
                            </div>
                            
                        </CTAButton>
                        <CTAButton active={false} linkto={"/signup"}>
                            <div>
                                Learn more
                            </div>
                        </CTAButton>
                    </div>

                </div>
            </div>

            <div className='mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between gap-7 mb-3 '>
                <div className='flex flex-col lg:flex-row justify-between gap-5 mb-10 mt-[95px]'>
                
                    <div className='text-4xl font-semibold lg:w-[45%]'>
                        Get the Skills you need for a
                        <HighlightText text={"Job that is in demand"} />
                    </div>

                    <div className='flex flex-col gap-10 lg:w-[40%] items-center lg:items-start'>
                        <div className='text-[16px]'>
                        The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
                        </div>
                        <div className=' w-fit'>
                            <CTAButton active={true} linkto={"/signup"}>
                                <div>
                                    Learn more
                                </div>
                            </CTAButton>
                        </div>
                    </div>
                </div>
            </div>

            <TimelineSection />

            <LearningLanguageSection />
            

        </div>

        {/* Section-03 */}
        <div className='bg-richblack-900'> 
            <div className='w-11/12 mx-auto max-w-maxContent flex-col items-center justify-between gap-8 first-letter text-white'>
                <InstructorSection />
                <h2 className='text-center text-4xl font-semibold mt-10'>Review from Other Learners..</h2>
                {/* Review Slider... */}

            </div>
        </div>

        {/* Footer */}
        <Footer />

    </div>
  )
}

export default Home


// shadow-[20px_20px_rgba(255,255,255)]