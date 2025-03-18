export interface Transporter {
  user_id: string;
  name: string;
  vehicle_type: string;
  max_weight: number;
  max_volume: number;
  available: boolean;
  created_at: Date;
}
