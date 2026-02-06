import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Ticket, Mail } from 'lucide-react'
import Link from 'next/link'

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-slate-50 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 rounded-xl bg-rose-500 p-2.5 text-white">
              <Ticket className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">TicketFlow</h1>
          </div>
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                <Mail className="h-6 w-6 text-emerald-600" />
              </div>
              <CardTitle className="text-2xl text-slate-900">
                Check your email
              </CardTitle>
              <CardDescription className="text-slate-500">
                We sent you a confirmation link
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-slate-500">
                {"You've successfully signed up. Please check your email to confirm your account before "}
                <Link
                  href="/auth/login"
                  className="font-medium text-rose-500 underline-offset-4 hover:underline"
                >
                  signing in
                </Link>
                .
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
