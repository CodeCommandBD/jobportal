
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, Users, Zap, Briefcase, ArrowRight } from 'lucide-react'
import { Button } from '@/Components/ui/button'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hire Top Tech Talent | JobPortal',
  description: 'Connect with verified professionals who are ready to make an impact. Post jobs, review portfolios, and hire faster than ever before.',
}

const EmployPage = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="text-center lg:text-left">
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">
                        Hire the top <span className="text-purple-600">1%</span> of <br className="hidden lg:block"/> Tech Talent.
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
                        Connect with verified professionals who are ready to make an impact. Post jobs, review portfolios, and hire faster than ever before.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                        <Link href="/post-job" className="w-full sm:w-auto">
                            <Button size="lg" className="w-full bg-purple-600 hover:bg-purple-700 text-white h-14 px-8 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all">
                                Post a Job for Free
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Link href="/candidates" className="w-full sm:w-auto">
                            <Button variant="outline" size="lg" className="w-full h-14 px-8 text-lg font-semibold rounded-full border-2">
                                Browse Candidates
                            </Button>
                        </Link>
                    </div>
                    <div className="mt-8 flex items-center justify-center lg:justify-start gap-4 text-sm text-gray-500">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white dark:border-gray-900 overflow-hidden">
                                     {/* Placeholder avatars */}
                                </div>
                            ))}
                        </div>
                        <p>Trusted by 500+ companies</p>
                    </div>
                </div>
                <div className="relative">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl filter"></div>
                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
                         <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <Users className="text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg dark:text-white">Active Candidates</h3>
                                <p className="text-2xl font-bold text-purple-600">12,500+</p>
                            </div>
                         </div>
                         <div className="space-y-4">
                            {[
                                "Senior Frontend Engineer",
                                "Product Designer",
                                "Backend Developer (Go)",
                            ].map((role, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <span className="font-medium text-gray-700 dark:text-gray-200">{role}</span>
                                    <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">MATCH</span>
                                </div>
                            ))}
                         </div>
                    </div>
                </div>
            </div>
         </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="text-center mb-16">
                   <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why Recruit With Us?</h2>
                   <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                       We simplify the hiring process so you can focus on building your product.
                   </p>
               </div>
               
               <div className="grid md:grid-cols-3 gap-8">
                   {[
                       {
                           icon: <Users className="w-8 h-8 text-blue-600" />,
                           title: "Curated Talent Pool",
                           desc: "Access verified professionals with proven track records in tech and design."
                       },
                       {
                           icon: <Zap className="w-8 h-8 text-yellow-500" />,
                           title: "Fast Hiring",
                           desc: "Reduce time-to-hire by 50% with our smart matching algorithms."
                       },
                       {
                           icon: <Briefcase className="w-8 h-8 text-purple-600" />,
                           title: "Seamless Management",
                           desc: "Track applications, schedule interviews, and offer jobs all in one place."
                       }
                   ].map((item, i) => (
                       <div key={i} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all">
                           <div className="w-14 h-14 bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center mb-6">
                               {item.icon}
                           </div>
                           <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                           <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                       </div>
                   ))}
               </div>
          </div>
      </section>
      
    </div>
  )
}

export default EmployPage
