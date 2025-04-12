import Link from "next/link"
import { Home } from "lucide-react"
import { NotFoundBackground } from "@/components/not-found-background"

export default function NotFound() {
  return (
    <div className="not-found-page relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* SVG Background - Client Component */}
      <NotFoundBackground />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-glow mb-2 text-9xl font-bold tracking-tighter">
          <span className="animate-text-glow inline-block" style={{ animationDelay: "0s" }}>
            4
          </span>
          <span className="animate-text-glow inline-block" style={{ animationDelay: "0.1s" }}>
            0
          </span>
          <span className="animate-text-glow inline-block" style={{ animationDelay: "0.2s" }}>
            4
          </span>
        </h1>
        <h2 className="mb-6 text-2xl font-medium">
          <span className="animate-fade-in opacity-0" style={{ animationDelay: "0.5s" }}>
            Page not found
          </span>
        </h2>
        <p className="mb-8 max-w-md">
          <span className="animate-fade-in opacity-0" style={{ animationDelay: "0.7s" }}>
            The page you're looking for doesn't exist or has been moved.
          </span>
        </p>
        <Link href="/" className="cosmic-button flex animate-button-glow gap-2" style={{ animationDelay: "1s" }}>
          <span className="icon">
            <Home className="h-5 w-5" />
          </span>
          <span>Return to Homepage</span>
          <span className="button-glow"></span>
        </Link>
      </div>
    </div>
  )
}
