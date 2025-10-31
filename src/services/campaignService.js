// Campaign Service - Handles campaign management operations
import { supabaseDatabase } from './supabase/database';

class CampaignService {
  constructor() {
    this.database = supabaseDatabase;
  }

  async createCampaign(campaignData) {
    return this.database.createCampaign(campaignData);
  }

  async getCampaigns(userId, options = {}) {
    return this.database.getCampaigns(userId, options);
  }

  async updateCampaign(campaignId, campaignData) {
    return this.database.updateCampaign(campaignId, campaignData);
  }

  async deleteCampaign(campaignId) {
    return this.database.deleteCampaign(campaignId);
  }
}

export const campaignService = new CampaignService();
