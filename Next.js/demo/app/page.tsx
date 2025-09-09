"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [clickCount, setClickCount] = useState(0);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  interface Item {
    id: number;
    name: string;
    title: string;
    userId: number;
    description: string;
    timestamp: string;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const postsResponse = await fetch(
          "https://jsonplaceholder.typicode.com/posts"
        );

        if (!postsResponse.ok) {
          throw new Error("API request failed");
        }

        const postsData = await postsResponse.json();

        const transformedPosts = postsData.map(
          (post: { id: any; title: any; body: any; userId: any }) => ({
            id: post.id,
            title: post.title,
            description: post.body,
            timestamp: new Date().toLocaleString(),
            userId: post.userId,
          })
        );

        setItems(transformedPosts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );
      if (!response.ok) throw new Error("API request failed");

      const postsData = await response.json();
      const transformedPosts = postsData.map(
        (post: { id: any; title: any; body: any; userId: any }) => ({
          id: post.id,
          title: post.title,
          description: post.body,
          timestamp: new Date().toLocaleString(),
          userId: post.userId,
        })
      );

      setItems(transformedPosts);
      setLoading(false);
      setClickCount(0);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleButtonClick = () => {
    setClickCount((prev) => prev + 1);
  };

  const handleFormSubmit = () => {
    const nameInput = document.querySelector(
      'input[name="name"]'
    ) as HTMLInputElement;
    const emailInput = document.querySelector(
      'input[name="email"]'
    ) as HTMLInputElement;
    const commentsInput = document.querySelector(
      'textarea[name="comments"]'
    ) as HTMLTextAreaElement;

    const formData = {
      name: nameInput?.value || "",
      email: emailInput?.value || "",
      comments: commentsInput?.value || "",
    };

    console.log("Form submitted:", formData);
    alert("Form submitted successfully!");
  };

  const getBrowserInfo = () => {
    if (typeof window !== "undefined" && window.navigator) {
      const userAgent = window.navigator.userAgent;

      if (
        userAgent.indexOf("Chrome") > -1 &&
        userAgent.indexOf("Edge") === -1
      ) {
        return "Chrome";
      } else if (userAgent.indexOf("Firefox") > -1) {
        return "Firefox";
      } else if (
        userAgent.indexOf("Safari") > -1 &&
        userAgent.indexOf("Chrome") === -1
      ) {
        return "Safari";
      } else if (userAgent.indexOf("Edge") > -1) {
        return "Edge";
      } else if (
        userAgent.indexOf("Opera") > -1 ||
        userAgent.indexOf("OPR") > -1
      ) {
        return "Opera";
      } else {
        return userAgent.split(" ")[0];
      }
    }
    return "Server Side";
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-slate-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-neutral-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        <header className="text-center mb-16">
          <div className="inline-block p-1 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl mb-6">
            <div className="bg-white rounded-xl px-8 py-4">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                FESB završni rad
              </h1>
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Stranica za potrebe završnog rada - Next.js
          </p>
        </header>

        <section className="mb-16">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full"></div>
              Interaktivni elementi
            </h2>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleButtonClick}
                className="group relative px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-800 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <span className="relative z-10">Klik ({clickCount})</span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-black rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              <button
                onClick={refreshData}
                disabled={loading}
                className={`px-8 py-4 font-semibold rounded-2xl shadow-lg transition-all duration-300 ${
                  loading
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-gradient-to-r from-slate-600 to-slate-700 text-white hover:shadow-xl hover:scale-105 active:scale-95"
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Učitava...
                  </span>
                ) : (
                  "Resetiraj"
                )}
              </button>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full"></div>
              Forma
            </h2>

            <div className="justify-self-center w-100">
              <div className="max-w-md space-y-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ime
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-500 focus:ring-4 focus:ring-gray-500/10 transition-all duration-200 group-hover:border-gray-300"
                    placeholder="Ime i prezime"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-500 focus:ring-4 focus:ring-gray-500/10 transition-all duration-200 group-hover:border-gray-300"
                    placeholder="Email"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Napomena
                  </label>
                  <textarea
                    name="comments"
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-500 focus:ring-4 focus:ring-gray-500/10 transition-all duration-200 resize-none group-hover:border-gray-300"
                    placeholder="Napomena"
                  />
                </div>

                <button
                  onClick={handleFormSubmit}
                  className="w-full px-8 py-4 bg-gradient-to-r from-gray-800 to-black text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-98"
                >
                  Pošalji
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full"></div>
              Image Performance Testing
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["first_image", "second_image", "third_image"].map(
                (image_name) => (
                  <div
                    key={image_name}
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 aspect-square"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-300/20 to-gray-400/20 group-hover:opacity-0 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="bg-white/80 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                          <Image
                            alt="first image"
                            width={500}
                            height={500}
                            src={`/images/${image_name}.jpg`}
                          />
                        </div>
                        <p className="text-gray-600 font-medium">
                          {image_name}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <div className="w-2 h-8 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full"></div>
                API
              </h2>
              <div className="px-4 py-2 bg-gray-100 rounded-xl">
                <span className="text-sm font-medium text-gray-600">
                  {loading ? "Loading..." : `${items.length} items`}
                </span>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-16">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Učitavanje</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item, index) => (
                  <div
                    key={item.id}
                    className="group bg-white/80 rounded-2xl p-6 shadow-lg border border-white/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-gray-800 text-sm leading-snug group-hover:text-gray-900 transition-colors">
                        {item.title}
                      </h3>
                      <span className="bg-gradient-to-r from-gray-600 to-gray-800 text-white px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2">
                        User {item.userId}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {item.description}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                      {item.timestamp}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Performance Metrics Section */}
        <section className="mb-16">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full"></div>
              Statistika
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-2">Klikova</h3>
                <p className="text-3xl font-bold text-gray-700">{clickCount}</p>
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border border-slate-200">
                <h3 className="font-semibold text-slate-800 mb-2">
                  Prikazanih stavki
                </h3>
                <p className="text-3xl font-bold text-slate-700">
                  {items.length}
                </p>
              </div>

              <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-2xl p-6 border border-neutral-200">
                <h3 className="font-semibold text-neutral-800 mb-2">Browser</h3>
                <p className="text-sm text-neutral-600 truncate">
                  {getBrowserInfo()}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
