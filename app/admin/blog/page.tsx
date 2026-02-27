"use client";

import { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaEye, FaNewspaper } from "react-icons/fa";
import Link from "next/link";
import { blogService, BlogPost } from "@/lib/blogService";

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

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
                Zarządzanie Blogiem
              </h1>
              <p className="text-gray-600">
                Twórz, edytuj i zarządzaj postami na blogu
              </p>
            </div>
            <Link
              href="/admin/blog/new"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 flex items-center space-x-2"
            >
              <FaPlus />
              <span>Nowy post</span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Wszystkie posty</p>
                  <p className="text-3xl font-bold">{posts.length}</p>
                </div>
                <FaNewspaper className="text-4xl opacity-80" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Ostatni post</p>
                  <p className="text-lg font-bold">
                    {posts.length > 0
                      ? new Date(posts[0].createdAt).toLocaleDateString("pl-PL")
                      : "Brak"}
                  </p>
                </div>
                <FaEdit className="text-4xl opacity-80" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Kategorie</p>
                  <p className="text-3xl font-bold">
                    {new Set(posts.map((post) => post.category)).size}
                  </p>
                </div>
                <FaNewspaper className="text-4xl opacity-80" />
              </div>
            </div>
          </div>

          {/* Posts List */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Ostatnie posty
            </h2>
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <FaNewspaper className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Brak postów
                </h3>
                <p className="text-gray-500 mb-6">
                  Nie ma jeszcze żadnych postów na blogu.
                </p>
                <Link
                  href="/admin/blog/new"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300 inline-flex items-center space-x-2"
                >
                  <FaPlus />
                  <span>Utwórz pierwszy post</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.slice(0, 5).map((post) => (
                  <div
                    key={post.id}
                    className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {post.shortDesc}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Kategoria: {post.category}</span>
                          <span>
                            Utworzono:{" "}
                            {new Date(post.createdAt).toLocaleDateString(
                              "pl-PL"
                            )}
                          </span>
                          <span>URL: /blog/{post.url}</span>
                        </div>
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
                {posts.length > 5 && (
                  <div className="text-center pt-4">
                    <Link
                      href="/admin/blog/list"
                      className="text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Zobacz wszystkie posty ({posts.length})
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
