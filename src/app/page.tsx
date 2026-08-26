"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-base-100 flex flex-col items-center p-4">
      <main className="w-full max-w-4xl mx-auto">
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
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    // Cycle through themes on click
                    const themes = [
                      "light",
                      "dark",
                      "cupcake",
                      "synthwave",
                      "valentines",
                      "emerald",
                    ];
                    const current =
                      document.documentElement.getAttribute("data-theme") ||
                      "light";
                    const next =
                      themes[
                        (themes.indexOf(current) + 1) % themes.length
                      ];
                    document.documentElement.setAttribute(
                      "data-theme",
                      next,
                    );
                  }}
                >
                  Cycle Theme
                </button>
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
                  <svg
                    className="w-8 h-8 fill-current"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 0l3.09 9h9.91l-7 5.26 2.57 9.74L12 17.77l-7.57 5.23 2.57-9.74z" />
                  </svg>
                </div>
                <div className="stat-title">Project Rating</div>
                <div className="stat-value text-primary">4.8</div>
                <div className="stat-desc">⭐ 4.8 / 5 stars</div>
              </div>
              <div className="stat">
                <div className="stat-figure text-secondary">
                  <svg
                    className="w-8 h-8 fill-current"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a4 4 0 00-3-3.87M9 20h6v-2a4 4 0 01-3-3.87M9 12h.01M15 12h.01M3 12l2-2v4l2 2M1 14l2-2m0 0V8a4 4 0 014-4h6a4 4 0 014 4v6"
                    />
                  </svg>
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
