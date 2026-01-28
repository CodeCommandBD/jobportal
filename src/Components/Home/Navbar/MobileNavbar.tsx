import { useSession, signOut } from 'next-auth/react'
import { Navlinks } from '../../../../constants/constants'
import Link from 'next/link'
import { CgClose } from 'react-icons/cg'

interface Props{
  showNav: boolean,
  close:() => void
}

const MobileNavbar = ({showNav, close}:Props) => {
  const { data: session } = useSession()
  const navOpen = showNav ? 'translate-x-0': 'translate-x-[100%]'

  return (
    <div>
      {/* overlay */}
      <div 
        onClick={close}
        className={`${navOpen} fixed inset-0 transform transition-all right-0 duration-500 z-[100002] bg-black opacity-70 w-full h-screen`}
      >
      </div>
        {/* navlinks */}
        <div className={`${navOpen} text-white fixed justify-center flex flex-col h-full transform transition-all duration-500 delay-300 w-[80%] sm:w-[60%] bg-purple-500 space-y-6 z-[1000050] right-0 p-10`}>
          {
            Navlinks.map((link) => (
              <Link 
                onClick={close}
                className='text-white w-fit border-b-[1.5px] pb-1 border-white sm:text-[30px] text-xl flex flex-col gap-y-5' 
                href={link.url} 
                key={link.id}
              >
                {link.label}
              </Link>
            ))
          }

          {/* Auth buttons for Mobile */}
          <div className="flex flex-col gap-4 mt-10">
            {!session ? (
              <Link onClick={close} href="/signin">
                <button className='w-full px-8 py-3 text-lg rounded-lg cursor-pointer bg-white text-purple-600 font-bold'>
                  Sign In
                </button>
              </Link>
            ) : (
              <>
                <Link onClick={close} href="/post-job" className="w-full">
                  <button className='w-full px-8 py-3 text-lg rounded-lg cursor-pointer bg-purple-700 text-white font-bold mb-4'>
                    Post a Job
                  </button>
                </Link>
                <button 
                  onClick={() => { signOut(); close(); }}
                  className='w-full px-8 py-3 text-lg rounded-lg cursor-pointer bg-red-100 text-red-600 font-bold'
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* close btn */}
          <CgClose 
          onClick={close}
          className='absolute top-2.5 right-2.5 text-white w-6 h-6 sm:w-8 sm:h-8 cursor-pointer'></CgClose>
        </div>
    </div>
  )
}

export default MobileNavbar