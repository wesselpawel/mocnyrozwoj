"use client";

import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaEye, FaPlus, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import { blogService, BlogPost } from "@/lib/blogService";

export default function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const allPosts = await blogService.getAllBlogPosts();
      setPosts(allPosts);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (confirm("Czy na pewno chcesz usunąć ten post?")) {
      try {
        await blogService.deleteBlogPost(postId);
        await loadPosts(); // Reload posts after deletion
      } catch {
        alert("Błąd podczas usuwania posta");
      }
    }
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.shortDesc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...new Set(posts.map((post) => post.category))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Ładowanie postów...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Wszystkie posty
              </h1>
              <p className="text-gray-600">
                Zarządzaj wszystkimi postami na blogu
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/blog"
                className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-all duration-300 flex items-center space-x-2"
              >
                <FaArrowLeft />
                <span>Powrót</span>
              </Link>
              <Link
                href="/admin/blog/new"
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center space-x-2"
              >
                <FaPlus />
                <span>Nowy post</span>
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wyszukaj posty
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Wyszukaj po tytule lub opisie..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filtruj po kategorii
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category === "all" ? "Wszystkie kategorie" : category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Posts List */}
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl text-gray-300 mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {searchTerm || selectedCategory !== "all"
                  ? "Nie znaleziono postów"
                  : "Brak postów"}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || selectedCategory !== "all"
                  ? "Spróbuj zmienić kryteria wyszukiwania"
                  : "Nie ma jeszcze żadnych postów na blogu."}
              </p>
              {!searchTerm && selectedCategory === "all" && (
                <Link
                  href="/admin/blog/new"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 inline-flex items-center space-x-2"
                >
                  <FaPlus />
                  <span>Utwórz pierwszy post</span>
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-xl font-semibold text-gray-800">
                          {post.title}
                        </h3>
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                          {post.category}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {post.shortDesc}
                      </p>
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span>
                          Utworzono:{" "}
                          {new Date(post.createdAt).toLocaleDateString("pl-PL")}
                        </span>
                        <span>
                          Zaktualizowano:{" "}
                          {new Date(post.updatedAt).toLocaleDateString("pl-PL")}
                        </span>
                        <span>URL: /blog/{post.url}</span>
                      </div>
                      {post.tags && (
                        <div className="mt-3">
                          <span className="text-sm text-gray-500">Tagi: </span>
                          {post.tags.split(",").map((tag, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs mr-2"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Link
                        href={`/blog/${post.url}`}
                        target="_blank"
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Zobacz post"
                      >
                        <FaEye />
                      </Link>
                      <Link
                        href={`/admin/blog/edit/${post.id}`}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Edytuj post"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Usuń post"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Summary */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Pokazano {filteredPosts.length} z {posts.length} postów
              </span>
              {searchTerm || selectedCategory !== "all" ? (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                  }}
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Wyczyść filtry
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
