import { useState, useEffect, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProductCard from "../ProductCard";

gsap.registerPlugin(ScrollTrigger);

const gridClassMap = {
  grid: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4",
  list: "flex flex-col gap-3",
  showcase: "grid grid-cols-1 sm:grid-cols-2 gap-5",
};

const StoreProducts = ({ products, view, search, setSearch, onOpenDetail }) => {
  const gridClass = gridClassMap[view] || gridClassMap.grid;
  const gridRef = useRef(null);
  const headerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const emptyRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
    );
    gsap.fromTo(
      titleRef.current,
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.4, delay: 0.1, ease: "power2.out" }
    );
    gsap.fromTo(
      subtitleRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, delay: 0.2, ease: "power2.out" }
    );
  }, [search, products.length]);

  useEffect(() => {
    if (!gridRef.current || products.length === 0) return;

    const items = gridRef.current.children;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: gridRef.current,
        start: "top 90%",
        toggleActions: "play none none none",
      }
    });

    tl.fromTo(
      items,
      { opacity: 0, y: 40, scale: 0.92 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.06,
        ease: "back.out(1.4)",
      }
    );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [products, view]);

  useEffect(() => {
    if (!emptyRef.current || products.length > 0) return;
    const els = emptyRef.current.querySelectorAll(".empty-anim");
    gsap.fromTo(
      els,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
    );
  }, [products.length]);

  return (
    <main className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-28 sm:pb-36">
      <div ref={headerRef} className="flex items-center justify-between mb-5">
        <div>
          <h2 ref={titleRef} className="font-sora font-bold text-navy text-lg">
            {search ? `"${search}"` : "Menu"}
          </h2>
          <p ref={subtitleRef} className="text-xs text-gray-400 mt-0.5">
            {products.length} {products.length === 1 ? "item" : "items"}
          </p>
        </div>
      </div>

      {products.length === 0 ? (
        <div ref={emptyRef} className="text-center py-20">
          <div className="empty-anim w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-5">
            <FiSearch size={36} className="text-gray-400" />
          </div>
          <h3 className="empty-anim font-sora font-semibold text-navy text-xl mb-2">
            No items found
          </h3>
          <p className="empty-anim text-gray-500 text-sm mb-6">
            Try adjusting your search
          </p>
          <button
            onClick={() => setSearch("")}
            className="text-padi-green font-semibold text-sm hover:underline"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div ref={gridRef} className={gridClass}>
          {products.map((product) => (
            <div key={product._id}>
              <ProductCard
                product={product}
                onOpenDetail={onOpenDetail}
                view={view}
              />
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default StoreProducts;
