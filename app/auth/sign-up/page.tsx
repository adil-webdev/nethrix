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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Ticket } from 'lucide-react'
import type { UserRole } from '@/lib/types'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<UserRole>('developer')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
            `${window.location.origin}/dashboard`,
          data: {
            full_name: fullName,
            role: role,
          },
        },
      })
      if (error) throw error
      router.push('/auth/sign-up-success')
    } catch (error: unknown) {
      let errorMessage = 'An error occurred'
      
      if (error instanceof Error) {
        const message = error.message.toLowerCase()
        
        if (message.includes('rate limit') || message.includes('too many')) {
          errorMessage = 'Too many sign-up attempts. Please wait a few minutes before trying again.'
        } else if (message.includes('already registered') || message.includes('user already exists')) {
          errorMessage = 'This email is already registered. Please sign in or use a different email.'
        } else if (message.includes('invalid email')) {
          errorMessage = 'Please enter a valid email address.'
        } else if (message.includes('password')) {
          errorMessage = 'Password does not meet security requirements.'
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
            <p className="text-sm text-slate-500">Create your account</p>
          </div>
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-slate-900">Sign up</CardTitle>
              <CardDescription className="text-slate-500">
                Join the ticketing system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="full-name" className="text-slate-700">Full Name</Label>
                    <Input
                      id="full-name"
                      type="text"
                      placeholder="John Doe"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="border-slate-200 focus-visible:ring-rose-500"
                    />
                  </div>
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
                    <Label htmlFor="role" className="text-slate-700">Role</Label>
                    <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                      <SelectTrigger className="border-slate-200 focus:ring-rose-500">
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="developer">Developer</SelectItem>
                        <SelectItem value="social_media_manager">Social Media Manager</SelectItem>
                        <SelectItem value="client_manager">Client Manager</SelectItem>
                      </SelectContent>
                    </Select>
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
                  <div className="grid gap-2">
                    <Label htmlFor="repeat-password" className="text-slate-700">Confirm Password</Label>
                    <Input
                      id="repeat-password"
                      type="password"
                      required
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
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
                    {isLoading ? 'Creating account...' : 'Create account'}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm text-slate-500">
                  Already have an account?{' '}
                  <Link
                    href="/auth/login"
                    className="font-medium text-rose-500 underline-offset-4 hover:underline"
                  >
                    Sign in
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
