const Footer = () => {
  return (
    <div className="sm:px-36 px-6 py-2.5 flex flex-col gap-5 justify-between md:flex-row text-secondary bg-gray-200 dark:bg-gray-900 dark:text-white">

      <div className="flex flex-col items-center font-semibold text-[17px]">
        <p>Designed & Developed by</p>
        <div className="flex gap-1 items-center">
          <p>&nbsp;Ayush Singh</p>  <p>2025</p>
        </div>
      </div>

      <div className="gap-5 font-semibold tracking-wide flex flex-col md:flex-row items-center">
        <div className="group flex flex-col justify-center cursor-pointer hover:text-blue-600">
          <a href="https://github.com/Ayushsingh0320" target="_blank" rel="noreferrer">GITHUB</a>
          <div className="h-[1.5px] w-auto bg-secondary opacity-0 -translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"></div>
        </div>
        <div className="group flex flex-col justify-center cursor-pointer hover:text-blue-600 ">
          <a href="https://www.linkedin.com/in/ayush-singh-28a292369/" target="_blank" rel="noreferrer">LINKEDIN</a>
          <div className="h-[1.5px] w-auto bg-secondary opacity-0 -translate-y-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"></div>
        </div>
      </div>


    </div>
  )
}

export default Footer