import {
  addDocument,
  getDocuments,
  getDocument,
  removeDocument,
  updateDocument,
} from "@/firebase";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  subject: string;
  status: "new" | "contacted" | "qualified" | "converted" | "lost";
  source: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export const leadsService = {
  // Add a new lead
  async addLead(
    leadData: Omit<Lead, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    const leadId = `lead_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const fullLeadData = {
      ...leadData,
      id: leadId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await addDocument("leads", leadId, fullLeadData);
    return leadId;
  },

  // Get all leads
  async getLeads(): Promise<Lead[]> {
    try {
      const leads = await getDocuments("leads");
      return (leads as Lead[]).sort(
        (a: Lead, b: Lead) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error("Error fetching leads:", error);
      return [];
    }
  },

  // Get a single lead by ID
  async getLead(leadId: string): Promise<Lead | null> {
    try {
      const lead = await getDocument("leads", leadId);
      return lead as Lead;
    } catch (error) {
      console.error("Error fetching lead:", error);
      return null;
    }
  },

  // Update lead status
  async updateLeadStatus(
    leadId: string,
    status: Lead["status"],
    notes?: string
  ): Promise<void> {
    const updateData: any = {
      status,
      updatedAt: new Date().toISOString(),
    };

    if (notes) {
      updateData.notes = notes;
    }

    await updateDocument(
      Object.keys(updateData),
      Object.values(updateData),
      "leads",
      leadId
    );
  },

  // Delete a lead
  async deleteLead(leadId: string): Promise<void> {
    await removeDocument("leads", leadId);
  },

  // Get leads by status
  async getLeadsByStatus(status: Lead["status"]): Promise<Lead[]> {
    const allLeads = await this.getLeads();
    return allLeads.filter((lead) => lead.status === status);
  },

  // Get leads by source
  async getLeadsBySource(source: string): Promise<Lead[]> {
    const allLeads = await this.getLeads();
    return allLeads.filter((lead) => lead.source === source);
  },

  // Get newsletter subscribers
  async getNewsletterSubscribers(): Promise<Lead[]> {
    const allLeads = await this.getLeads();
    return allLeads.filter(
      (lead) =>
        lead.subject === "newsletter" || lead.source === "newsletter_signup"
    );
  },

  // Get leads statistics
  async getLeadsStats(): Promise<{
    total: number;
    new: number;
    contacted: number;
    qualified: number;
    converted: number;
    lost: number;
    newsletter: number;
  }> {
    const allLeads = await this.getLeads();

    return {
      total: allLeads.length,
      new: allLeads.filter((lead) => lead.status === "new").length,
      contacted: allLeads.filter((lead) => lead.status === "contacted").length,
      qualified: allLeads.filter((lead) => lead.status === "qualified").length,
      converted: allLeads.filter((lead) => lead.status === "converted").length,
      lost: allLeads.filter((lead) => lead.status === "lost").length,
      newsletter: allLeads.filter(
        (lead) =>
          lead.subject === "newsletter" || lead.source === "newsletter_signup"
      ).length,
    };
  },
};
