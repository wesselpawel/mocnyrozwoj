"use client";

import { useState, useEffect } from "react";
import { leadsService, Lead } from "@/lib/leadsService";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filter, setFilter] = useState<"all" | "newsletter">("all");
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    converted: 0,
    lost: 0,
    newsletter: 0,
  });

  useEffect(() => {
    loadLeads();
  }, [filter]);

  const loadLeads = async () => {
    try {
      let leadsData;
      if (filter === "newsletter") {
        leadsData = await leadsService.getNewsletterSubscribers();
      } else {
        leadsData = await leadsService.getLeads();
      }

      const statsData = await leadsService.getLeadsStats();

      setLeads(leadsData);
      setStats(statsData);
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, status: Lead["status"]) => {
    try {
      await leadsService.updateLeadStatus(leadId, status);
      loadLeads();
    } catch {
      alert("Błąd podczas aktualizacji statusu");
    }
  };

  const deleteLead = async (leadId: string) => {
    if (!confirm("Czy na pewno chcesz usunąć tego leada?")) return;

    try {
      await leadsService.deleteLead(leadId);
      loadLeads();
    } catch {
      alert("Błąd podczas usuwania leada");
    }
  };

  const getStatusColor = (status: Lead["status"]) => {
    switch (status) {
      case "new":
        return "bg-blue-500";
      case "contacted":
        return "bg-yellow-500";
      case "qualified":
        return "bg-purple-500";
      case "converted":
        return "bg-green-500";
      case "lost":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: Lead["status"]) => {
    switch (status) {
      case "new":
        return "Nowy";
      case "contacted":
        return "Skontaktowany";
      case "qualified":
        return "Kwalifikowany";
      case "converted":
        return "Konwersja";
      case "lost":
        return "Stracony";
      default:
        return status;
    }
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
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Zarządzanie Leadami
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                filter === "all"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Wszystkie
            </button>
            <button
              onClick={() => setFilter("newsletter")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                filter === "newsletter"
                  ? "bg-orange-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Newsletter
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-7 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 shadow-lg text-center">
            <div className="text-2xl font-bold text-gray-800">
              {stats.total}
            </div>
            <div className="text-sm text-gray-600">Wszystkie</div>
          </div>
          <div className="bg-blue-100 rounded-2xl p-4 shadow-lg text-center">
            <div className="text-2xl font-bold text-blue-800">{stats.new}</div>
            <div className="text-sm text-blue-600">Nowe</div>
          </div>
          <div className="bg-yellow-100 rounded-2xl p-4 shadow-lg text-center">
            <div className="text-2xl font-bold text-yellow-800">
              {stats.contacted}
            </div>
            <div className="text-sm text-yellow-600">Skontaktowane</div>
          </div>
          <div className="bg-purple-100 rounded-2xl p-4 shadow-lg text-center">
            <div className="text-2xl font-bold text-purple-800">
              {stats.qualified}
            </div>
            <div className="text-sm text-purple-600">Kwalifikowane</div>
          </div>
          <div className="bg-green-100 rounded-2xl p-4 shadow-lg text-center">
            <div className="text-2xl font-bold text-green-800">
              {stats.converted}
            </div>
            <div className="text-sm text-green-600">Konwersje</div>
          </div>
          <div className="bg-red-100 rounded-2xl p-4 shadow-lg text-center">
            <div className="text-2xl font-bold text-red-800">{stats.lost}</div>
            <div className="text-sm text-red-600">Stracone</div>
          </div>
          <div className="bg-orange-100 rounded-2xl p-4 shadow-lg text-center">
            <div className="text-2xl font-bold text-orange-800">
              {stats.newsletter}
            </div>
            <div className="text-sm text-orange-600">Newsletter</div>
          </div>
        </div>

        {/* Leads List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lead
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Temat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akcje
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                            <span className="text-white font-bold">
                              {lead.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {lead.name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <FaEnvelope className="mr-1" />
                            {lead.email}
                          </div>
                          {lead.phone && (
                            <div className="text-sm text-gray-500 flex items-center">
                              <FaPhone className="mr-1" />
                              {lead.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {lead.subject}
                      </div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {lead.message}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white ${getStatusColor(
                          lead.status
                        )}`}
                      >
                        {getStatusText(lead.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(lead.createdAt).toLocaleDateString("pl-PL")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Zobacz szczegóły"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => updateLeadStatus(lead.id, "contacted")}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Oznacz jako skontaktowany"
                        >
                          <FaPhone />
                        </button>
                        <button
                          onClick={() => updateLeadStatus(lead.id, "converted")}
                          className="text-green-600 hover:text-green-900"
                          title="Oznacz jako konwersję"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => deleteLead(lead.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Usuń"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {leads.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📧</div>
            <h3 className="text-xl font-bold text-gray-600 mb-2">
              Brak leadów
            </h3>
            <p className="text-gray-500">
              Leady z formularza kontaktowego pojawią się tutaj.
            </p>
          </div>
        )}

        {/* Lead Details Modal */}
        {selectedLead && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Szczegóły leada
                </h2>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Imię i nazwisko
                  </label>
                  <p className="text-gray-900">{selectedLead.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900">{selectedLead.email}</p>
                </div>

                {selectedLead.phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefon
                    </label>
                    <p className="text-gray-900">{selectedLead.phone}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Temat
                  </label>
                  <p className="text-gray-900">{selectedLead.subject}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Wiadomość
                  </label>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {selectedLead.message}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white ${getStatusColor(
                        selectedLead.status
                      )}`}
                    >
                      {getStatusText(selectedLead.status)}
                    </span>
                    <select
                      value={selectedLead.status}
                      onChange={(e) =>
                        updateLeadStatus(
                          selectedLead.id,
                          e.target.value as Lead["status"]
                        )
                      }
                      className="ml-2 px-3 py-1 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="new">Nowy</option>
                      <option value="contacted">Skontaktowany</option>
                      <option value="qualified">Kwalifikowany</option>
                      <option value="converted">Konwersja</option>
                      <option value="lost">Stracony</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data utworzenia
                  </label>
                  <p className="text-gray-900">
                    {new Date(selectedLead.createdAt).toLocaleString("pl-PL")}
                  </p>
                </div>

                {selectedLead.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notatki
                    </label>
                    <p className="text-gray-900">{selectedLead.notes}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setSelectedLead(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Zamknij
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
