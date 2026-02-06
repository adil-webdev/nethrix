'use client'

import React from "react"

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Ticket } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push('/dashboard')
    } catch (error: unknown) {
      let errorMessage = 'An error occurred'
      
      if (error instanceof Error) {
        const message = error.message.toLowerCase()
        
        if (message.includes('invalid login credentials') || message.includes('invalid email or password')) {
          errorMessage = 'Invalid email or password. Please try again.'
        } else if (message.includes('rate limit') || message.includes('too many')) {
          errorMessage = 'Too many login attempts. Please wait a few minutes before trying again.'
        } else if (message.includes('email not confirmed')) {
          errorMessage = 'Please confirm your email before signing in.'
        } else {
          errorMessage = error.message
        }
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-slate-50 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 rounded-xl bg-rose-500 p-2.5 text-white">
              <Ticket className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">TicketFlow</h1>
            <p className="text-sm text-slate-500">Ticketing System</p>
          </div>
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-slate-900">Welcome back</CardTitle>
              <CardDescription className="text-slate-500">
                Sign in to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="text-slate-700">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-slate-200 focus-visible:ring-rose-500"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password" className="text-slate-700">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-slate-200 focus-visible:ring-rose-500"
                    />
                  </div>
                  {error && (
                    <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                      {error}
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-rose-500 text-white hover:bg-rose-600"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign in'}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm text-slate-500">
                  {"Don't have an account? "}
                  <Link
                    href="/auth/sign-up"
                    className="font-medium text-rose-500 underline-offset-4 hover:underline"
                  >
                    Sign up
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
