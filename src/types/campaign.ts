
export type CampaignStatus = "planned" | "live" | "completed";

export interface Campaign {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: CampaignStatus;
  color: string;
}
