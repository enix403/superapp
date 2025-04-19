import React from 'react';
import { TypeAnimation } from 'react-type-animation';
import { FaArrowRight } from "react-icons/fa";
import { Link } from 'react-router';

interface CodeBlockProps {
    position: string;
    heading: React.ReactNode;
    subheading: string;
    ctnbtn1: {
        active: boolean;
        linkto: string;
        btnText: string;
    };
    ctnbtn2: {
        active: boolean;
        linkto: string;
        btnText: string;
    };
    codeblock: string;
    backgroundGradient?: React.ReactNode;
    codeColor: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
    position,
    heading,
    subheading,
    ctnbtn1,
    codeblock,
    backgroundGradient,
}) => {
    return (
        <div className={`flex ${position} my-20 justify-between items-center flex-col gap-10`}>
            {/* Section1 */}
            <div className='w-full lg:w-[50%] flex flex-col gap-8 text-center md:text-left items-center lg:items-start '>
                {heading}
                <div className='text-richblack-300 px-2 '>
                    {subheading}
                </div>

                {/* Get Started Button */}

                <div className=''>
                    <Link to={'/create-assessment'}>
                        <button className="group relative overflow-hidden border-2 border-[#1ecdf8] px-9 py-2 text-lg font-semibold text-black">
                            <span className="absolute inset-0 origin-left scale-x-0 transform bg-gradient-to-r from-[#1ECDF8] to-[#7acbe1] transition-all duration-300 ease-in-out group-hover:scale-x-100"></span>
                            <span className="relative z-10 flex items-center gap-2">
                                <span>{ctnbtn1.btnText}</span>
                                <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                            </span>
                        </button>
                    </Link>
                </div>

            </div>

            {/* Section2 */}
            <div className='code-border flex flex-row w-[100%] py-3 lg:w-[470px] h-fit backdrop-blur-sm border border-richblack-800 bg-richblack-5 bg-opacity-10 rounded-lg sm:text-sm leading-[18px] sm:leading-6 relative text-[10px]'>
                {backgroundGradient}
                <div className='text-center flex flex-col w-[10%] text-richblack-400 font-inter font-bold'>
                    <p>1</p>
                    <p>2</p>
                    <p>3</p>
                    <p>4</p>
                    <p>5</p>
                    <p>6</p>
                    <p>7</p>
                    <p>8</p>
                    <p>9</p>
                    <p>10</p>
                    <p>11</p>
                    <p>12</p>
                    <p>13</p>
                    <p>14</p>
                    <p>15</p>
                    <p>16</p>
                    <p>17</p>
                </div>
                <div className={`w-[90%] flex flex-col gap-2 font-bold font-mono text-richblack-5 pr-2`}>
                    <TypeAnimation
                        sequence={[codeblock, 2000, ""]}
                        repeat={Infinity}
                        cursor={true}
                        style={{
                            whiteSpace: "pre-line",
                            display: "block",
                        }}
                        omitDeletionAnimation={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default CodeBlock;
