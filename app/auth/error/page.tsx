import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Ticket, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

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
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-slate-900">
                Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              {params?.error ? (
                <p className="text-sm text-slate-500">
                  Error: {params.error}
                </p>
              ) : (
                <p className="text-sm text-slate-500">
                  An unspecified error occurred.
                </p>
              )}
              <Link href="/auth/login">
                <Button className="w-full bg-rose-500 text-white hover:bg-rose-600">
                  Back to Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
