import React from 'react'
import Instructor from "../../../assets/Images/Instructor.png"
import HighlightText from './HighlightText'
import CTAButton from "../HomePage/Button"
import { FaArrowRight } from 'react-icons/fa'

const InstructorSection = () => {
  return (
    <div className='pt-20 pb-16'>
      <div className='flex flex-col lg:flex-row gap-20 items-center'>

        <div className='w-[70%] lg:w-[50%] shadow-[6px_6px_16px_rgba(8,_112,_184,_0.7)] hover:shadow-[10px_10px_16px_rgba(8,_112,_184,_0.7)] transition-all duration-200'>
            <img
                src={Instructor}
                alt="Instructor"
                className='shadow-[-16px_-16px_rgba(255,255,255)]'
            />
        </div>

        <div className='w-[70%] lg:w-[50%] flex flex-col gap-10'>
            <div className='text-4xl font-semobold w-[50%]'>
                Become an
                <HighlightText text={"Instructor"} />
            </div>

            <p className='font-medium text-[16px] pb-5 text-richblack-300'>
            Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.
            </p>

            <div className='w-fit'>
                <CTAButton active={true} linkto={"/signup"}>
                    <div className='flex flex-row gap-2 items-center'>
                        Start Teaching Today
                        <FaArrowRight />
                    </div>
                </CTAButton>
            </div>


        </div>

      </div>
    </div>
  )
}

export default InstructorSection
