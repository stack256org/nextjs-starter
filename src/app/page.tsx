"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Star, Users } from "@phosphor-icons/react/dist/ssr";

export default function Home() {
  return (
    <div className="min-h-screen bg-base-100 flex flex-col items-center p-4">
      {/* Fixed theme toggle in the corner */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <main className="w-full max-w-4xl mx-auto pt-12">
        {/* Hero Section */}
        <section className="hero min-h-screen py-20">
          <div className="hero-content flex-col lg:flex-row-reverse">
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-2xl w-52 h-52 flex items-center justify-center">
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-bold">Welcome to Next.js Starter</h1>
              <p className="py-6 text-lg">
                A production-ready starter with TypeScript, App Router, Drizzle ORM,
                pgBoss queue, and DaisyUI design system.
              </p>
              <div className="flex gap-4">
                <Link href="/docs" passHref>
                  <button className="btn btn-primary">Get Started</button>
                </Link>
                <Link href="/login" passHref>
                  <button className="btn btn-outline">Sign In</button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            What&apos;s Included
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">🗄️ Drizzle ORM</h3>
                <p>
                  Type-safe PostgreSQL with auto-generated migrations and a
                  clean query DSL.
                </p>
              </div>
            </div>
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">⚙️ pgBoss Worker</h3>
                <p>
                  Background job processing backed by PostgreSQL with retries
                  and graceful shutdown.
                </p>
              </div>
            </div>
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">🎨 DaisyUI</h3>
                <p>
                  Component library with 6+ themes and full TypeScript support.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Components Showcase */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            DaisyUI Components
          </h2>
          <div className="flex flex-col gap-8 items-center">
            <div className="join">
              <button className="btn btn-outline join-item">Overview</button>
              <button className="btn btn-outline join-item">Profile</button>
              <button className="btn btn-outline join-item">Settings</button>
            </div>

            <div className="stats shadow">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <Star size={32} />
                </div>
                <div className="stat-title">Project Rating</div>
                <div className="stat-value text-primary">4.8</div>
                <div className="stat-desc">⭐ 4.8 / 5 stars</div>
              </div>
              <div className="stat">
                <div className="stat-figure text-secondary">
                  <Users size={32} />
                </div>
                <div className="stat-title">Projects</div>
                <div className="stat-value text-secondary">12</div>
                <div className="stat-desc">12 active projects</div>
              </div>
            </div>

            <div className="form-control w-64">
              <label className="label cursor-pointer">
                <input type="checkbox" className="toggle" defaultChecked />
                <span className="label-text ml-2">Enable notifications</span>
              </label>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
