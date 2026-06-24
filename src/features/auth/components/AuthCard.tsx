import React from 'react';
import { IoClose } from 'react-icons/io5';
import { Link } from 'react-router-dom';

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

/**
 * AuthCard — presentational shell for all auth forms.
 */
export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <>
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-semibold text-white tracking-tight">
                  {title}
                </h1>
                {subtitle && (
                  <p className="mt-1 text-sm text-gray-400">{subtitle}</p>
                )}
              </div>

              <Link
                to="/"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <IoClose size={24} />
              </Link>
            </div>

            {children}
          </div>
        </div>
      </div>
    </>
  );
}
