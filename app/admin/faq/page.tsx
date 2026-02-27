"use client";
import { useState, useEffect } from "react";
import {
  getDocuments,
  addDocument,
  removeDocument,
  updateDocument,
} from "@/firebase";
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminFAQ() {
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "general",
  });

  useEffect(() => {
    loadFAQItems();
  }, []);

  const loadFAQItems = async () => {
    try {
      const items = await getDocuments("faq");
      setFaqItems(
        Array.isArray(items)
          ? (items as FAQItem[]).sort((a, b) => a.order - b.order)
          : []
      );
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!formData.question.trim() || !formData.answer.trim()) {
      alert("Proszę wypełnić wszystkie pola");
      return;
    }

    try {
      const newItem = {
        ...formData,
        order: faqItems.length + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const itemId = `faq_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      await addDocument("faq", itemId, { ...newItem, id: itemId });

      setFormData({ question: "", answer: "", category: "general" });
      setIsAdding(false);
      loadFAQItems();
    } catch {
      alert("Błąd podczas dodawania pytania");
    }
  };

  const handleEdit = async (item: FAQItem) => {
    if (!formData.question.trim() || !formData.answer.trim()) {
      alert("Proszę wypełnić wszystkie pola");
      return;
    }

    try {
      await updateDocument(
        ["question", "answer", "category", "updatedAt"],
        [
          formData.question,
          formData.answer,
          formData.category,
          new Date().toISOString(),
        ],
        "faq",
        item.id
      );

      setFormData({ question: "", answer: "", category: "general" });
      setEditingId(null);
      loadFAQItems();
    } catch {
      alert("Błąd podczas aktualizacji pytania");
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm("Czy na pewno chcesz usunąć to pytanie?")) return;

    try {
      await removeDocument("faq", itemId);
      loadFAQItems();
    } catch {
      alert("Błąd podczas usuwania pytania");
    }
  };

  const startEdit = (item: FAQItem) => {
    setEditingId(item.id);
    setFormData({
      question: item.question,
      answer: item.answer,
      category: item.category,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ question: "", answer: "", category: "general" });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Zarządzanie FAQ</h1>
          <button
            onClick={() => setIsAdding(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 font-bold flex items-center space-x-2"
          >
            <FaPlus />
            <span>Dodaj pytanie</span>
          </button>
        </div>

        {/* Add/Edit Form */}
        {(isAdding || editingId) && (
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              {isAdding ? "Dodaj nowe pytanie" : "Edytuj pytanie"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategoria
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg !text-black focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="general">Ogólne</option>
                  <option value="technical">Techniczne</option>
                  <option value="billing">Płatności</option>
                  <option value="account">Konto</option>
                  <option value="products">Produkty</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pytanie *
                </label>
                <input
                  type="text"
                  value={formData.question}
                  onChange={(e) =>
                    setFormData({ ...formData, question: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg !text-black focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Wprowadź pytanie..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Odpowiedź *
                </label>
                <textarea
                  value={formData.answer}
                  onChange={(e) =>
                    setFormData({ ...formData, answer: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg !text-black focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  placeholder="Wprowadź odpowiedź..."
                />
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={
                    isAdding
                      ? handleAdd
                      : () =>
                          handleEdit(
                            faqItems.find((item) => item.id === editingId)!
                          )
                  }
                  className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 font-bold flex items-center space-x-2"
                >
                  <FaSave />
                  <span>{isAdding ? "Dodaj" : "Zapisz"}</span>
                </button>
                <button
                  onClick={isAdding ? () => setIsAdding(false) : cancelEdit}
                  className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-all duration-300 font-bold flex items-center space-x-2"
                >
                  <FaTimes />
                  <span>Anuluj</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FAQ Items List */}
        <div className="space-y-6">
          {faqItems.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {item.category}
                    </span>
                    <span className="text-sm text-gray-500">#{item.order}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {item.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                  <div className="text-xs text-gray-400 mt-2">
                    Ostatnia aktualizacja:{" "}
                    {new Date(item.updatedAt).toLocaleDateString("pl-PL")}
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => startEdit(item)}
                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
                    title="Edytuj"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
                    title="Usuń"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {faqItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">❓</div>
            <h3 className="text-xl font-bold text-gray-600 mb-2">
              Brak pytań FAQ
            </h3>
            <p className="text-gray-500">
              Dodaj pierwsze pytanie, aby rozpocząć zarządzanie FAQ.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
