import React from 'react'

function Footer() {
    const year = new Date().getFullYear()
  return (
    <footer className="bg-[#05070f] p-8 text-center text-xl ">
      <h2 className='text-slate-500'> © copyright by Ugwu Emmanuel Ifeanyi {year}</h2>
    </footer>
  );
}

export default Footer