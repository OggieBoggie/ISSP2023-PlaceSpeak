export interface Poll {
  id: number;
  title: string;
  description: string;
  created_by: string;
  created_at: string;
  choices: {
    id: number;
    text: string;
    vote_count: number;
  }[];
}
