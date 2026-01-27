import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card"
import Link from "next/link"
import RegisterForm from '@/Components/auth/RegisterForm'
import React from 'react'

const SignUpPage = () => {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4'>
        <RegisterForm />
    </div>
  )
}

export default SignUpPage
