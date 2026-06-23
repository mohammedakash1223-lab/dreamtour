export interface AppSettings {
  app_name?: string;
  app_logo?: string;
  notice?: string;
  bkash_number?: string;
  nagad_number?: string;
  rocket_number?: string;
  how_to_add_money_link?: string;
  how_to_get_room_id_link?: string;
  how_to_play_link?: string;
  support_link?: string;
  shop_link?: string;
  show_popup?: boolean;
  popup_text?: string;
  banners?: Record<string, { img: string; link?: string }>;
}

export interface UserProfile {
  username?: string;
  email?: string;
  phone?: string;
  deposit?: number;
  winning?: number;
}

export interface Category {
  name: string;
  img: string;
}

export interface Match {
  dbKey: string;
  categoryId: string;
  title: string;
  time: string;
  total_prize: number | string;
  type: string;
  entry: number;
  per_kill: number | string;
  map: string;
  status: "Upcoming" | "Ongoing" | "Finished";
  joined?: number;
  total?: number;
  room_id?: string;
  room_pass?: string;
  timestamp: string | number; // stores timestamp string or number
  prize_desc?: string;
}

export interface Transaction {
  type: string;
  amount: number;
  method?: string;
  status?: string;
  date: string;
  txID?: string;
  number?: string;
  requestId?: string;
}

export interface Notification {
  title: string;
  body: string;
}

export interface MatchParticipant {
  ign: string;
  joinedBy: string;
  kills?: number;
  win?: number;
}

export type TabName = "shop" | "home" | "mymatches" | "result" | "profile" | "matches";

export type SubPageName = "wallet" | "add-money" | "withdraw" | "history" | "notifications" | "refer" | "edit-profile" | "developer" | "match-details" | "result-details" | "join-match";
