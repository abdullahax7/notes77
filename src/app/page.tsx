import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="flex items-center justify-between p-6">
        <h1 className="text-2xl font-bold text-gray-900">Notes App</h1>
        <div>
          <SignedOut>
            <SignInButton mode="modal">
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </nav>

      <main className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          Your Personal Notes App
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
          Create, organize, and manage your notes securely. Sign in to get started with your personal note-taking experience.
        </p>
        
        <SignedOut>
          <div className="space-x-4">
            <SignInButton mode="modal">
              <Button size="lg">Get Started</Button>
            </SignInButton>
          </div>
        </SignedOut>
        
        <SignedIn>
          <Link href="/notes">
            <Button size="lg">Go to My Notes</Button>
          </Link>
        </SignedIn>
      </main>
    </div>
  );
}
