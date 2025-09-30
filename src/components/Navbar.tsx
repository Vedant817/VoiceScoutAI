"use client";
import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { Button } from "./ui/button";

const Navbar = () => {
  const { isAuthenticated } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">VoiceScout</span>
              <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI
              </span>
            </Link>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
            <Link
              href="#features"
              className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              Pricing
            </Link>
            <Link
              href="#about"
              className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              About
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link href="/signin">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="default" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/dashboard">
                <Button variant="default" size="sm">
                  Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;