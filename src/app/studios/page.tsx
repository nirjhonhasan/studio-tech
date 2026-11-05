"use client";

import { StudioCard } from "@/components/home/studio-card";
import { Studio } from "@/types/studio";
import { useState, useEffect } from "react";


const AllStudiosPage = () => {

  const [studios, setStudios] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {

        const studioRes = await fetch("http://localhost:5000/studios");
        const studioData = await studioRes.json();
        setStudios(studioData);

        const catRes = await fetch("http://localhost:5000/categories");
        const catData = await catRes.json();
        setCategories(catData);


      } catch (error) {
        console.error("Data fetch failed:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);


  const filteredStudios = selectedCategory === "All"
    ? studios
    : studios.filter((studio: Studio) => studio.category === selectedCategory);

  if (loading) {
    return <div className="text-center py-20 text-[#a8a29e]">Loading studios...</div>;
  }

  return (
    <div className="w-full bg-[#121110] px-4 py-12 text-[#f3f0ea]">

      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-[#f3f0ea] sm:text-4xl">
          Explore All Studios
        </h1>
        <p className="mt-2 text-sm text-[#a8a29e]">
          Discover and book professional creative spaces tailored for your next big project.
        </p>
      </div>

      <div className="mx-auto max-w-7xl">


        <div className="mb-10 flex flex-wrap items-center justify-start gap-3">


          <button
            onClick={() => setSelectedCategory("All")}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${selectedCategory === "All"
              ? "bg-[#f59e0b] text-[#121110]"
              : "border border-[#262422] bg-[#1a1816] text-[#a8a29e] hover:text-white"
              }`}
          >
            All
          </button>



          {categories.map((category: string) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${selectedCategory === category
                ? "bg-[#f59e0b] text-[#121110]"
                : "border border-[#262422] bg-[#1a1816] text-[#a8a29e] hover:text-white"
                }`}
            >
              {category}
            </button>
          ))}
        </div>



        {filteredStudios.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStudios.map((studio: Studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-[#a8a29e]">
            There is no avaiale studio yet !
          </div>
        )}

      </div>
    </div>
  );
};

export default AllStudiosPage;
