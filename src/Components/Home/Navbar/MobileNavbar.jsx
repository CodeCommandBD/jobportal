import { useSession, signOut } from 'next-auth/react'
import { Navlinks } from '../../../../constants/constants'
import Link from 'next/link'
import { CgClose } from 'react-icons/cg'

const MobileNavbar = ({showNav, close}) => {
  const { data: session } = useSession()
  const navOpen = showNav ? 'translate-x-0': 'translate-x-[100%]'

  return (
    <div>
      <div 
        onClick={close}
        className={`${navOpen} fixed inset-0 transform transition-all right-0 duration-500 z-[100002] bg-black opacity-70 w-full h-screen`}
      >
      </div>
        <div className={`${navOpen} text-white fixed justify-center flex flex-col h-full transform transition-all duration-500 delay-300 w-[80%] sm:w-[60%] bg-purple-500 space-y-6 z-[1000050] right-0 p-10`}>
          {
            Navlinks.map((link) => (
              <Link 
                onClick={close}
                className='text-white w-fit border-b-[1.5px] pb-1 border-white sm:text-[30px] text-xl font-bold uppercase tracking-tight' 
                href={link.url} 
                key={link.id}
              >
                {link.label}
              </Link>
            ))
          }

          {/* Add Dashboard links based on role for mobile access */}
          {session?.user?.role === 'admin' && (
            <Link onClick={close} href="/dashboard/admin" className='text-yellow-300 w-fit border-b-[1.5px] pb-1 border-yellow-300 sm:text-[30px] text-xl font-black uppercase tracking-tighter'>
              Admin Panel
            </Link>
          )}
          {session?.user?.role === 'employer' && (
            <Link onClick={close} href="/dashboard/employer" className='text-blue-300 w-fit border-b-[1.5px] pb-1 border-blue-300 sm:text-[30px] text-xl font-black uppercase tracking-tighter'>
              Employer Dashboard
            </Link>
          )}
          {session?.user?.role === 'jobseeker' && (
            <Link onClick={close} href="/dashboard/candidate" className='text-green-300 w-fit border-b-[1.5px] pb-1 border-green-300 sm:text-[30px] text-xl font-black uppercase tracking-tighter'>
              Candidate Dashboard
            </Link>
          )}

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

          <CgClose 
          onClick={close}
          className='absolute top-2.5 right-2.5 text-white w-6 h-6 sm:w-8 sm:h-8 cursor-pointer'></CgClose>
        </div>
    </div>
  )
}

export default MobileNavbar
