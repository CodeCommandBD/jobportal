
import LoginForm from '@/Components/auth/LoginForm'
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/Components/ui/card"
import Link from "next/link"
import React from 'react'

const SignInPage = () => {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4'>
        <LoginForm />
    </div>
  )
}

export default SignInPage
