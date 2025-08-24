import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button'; // From shadcn/ui
import { MoveRight, CheckCircle2 } from 'lucide-react'; // For icons

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-gradient-to-b from-slate-50 to-slate-100">
      <main className="max-w-4xl">
        {/* Animated Badge/Pill */}
        <div className="inline-block px-4 py-1 mb-6 text-sm font-semibold tracking-wider text-blue-700 uppercase bg-blue-100 rounded-full animate-fade-in-down">
          Task Management, Reimagined
        </div>
        
        {/* Main Headline */}
        <h1 className="text-5xl font-extrabold tracking-tight md:text-7xl animate-fade-in">
          Organize Your Workflow, <br />
          <span className="text-blue-600">Achieve More.</span>
        </h1>
        
        {/* Sub-headline */}
        <p className="max-w-2xl mx-auto mt-6 text-lg text-muted-foreground md:text-xl animate-fade-in-up">
          The ultimate solution for teams and individuals. Create, assign, and track tasks with file attachments, all in one place.
        </p>
        
        {/* Call-to-Action Buttons */}
        <div className="flex flex-col justify-center gap-4 mt-8 sm:flex-row animate-fade-in-up">
          <Link to="/register">
            <Button size="lg" className="w-full sm:w-auto">
              Get Started for Free
              <MoveRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Sign In
            </Button>
          </Link>
        </div>

        {/* Simple Features List */}
        <div className="flex justify-center gap-8 mt-12 text-sm text-muted-foreground animate-fade-in-up">
            <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Easy Task Creation</span>
            </div>
            <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>PDF Attachments</span>
            </div>
            <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Admin & User Roles</span>
            </div>
        </div>
      </main>
    </div>
  );
}