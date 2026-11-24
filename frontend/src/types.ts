export interface Candidate {
  id: number;
  resume_id: number;
  candidate_name: string;
  email: string;
  phone: string;
  experience: string[];
  platforms: string[];
  database_skills: string[];
  programming_skills: string[];
  machine_learning: string[];
  universities: string[];
  languages: string[];
  hobbies: string[];
  open_source: string[];
  raw_text?: string;
  filename?: string;
  upload_date?: string;
  file_size?: number;
  resume_status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Resume {
  id: number;
  filename: string;
  file_path: string;
  file_size: number;
  upload_date: string;
  status: 'processed' | 'processing' | 'error';
  error_message?: string;
  candidate_id?: number;
  candidate_name?: string;
  email?: string;
  phone?: string;
}

export interface RecentActivity {
  resume_id: number;
  filename: string;
  upload_date: string;
  status: string;
  candidate_id?: number;
  candidate_name?: string;
  skills_count: number;
}

export interface DashboardStats {
  total_resumes: number;
  successful_extractions: number;
  candidates_identified: number;
  skills_detected: number;
  recent_activity: RecentActivity[];
}

export interface DistributionItem {
  name: string;
  count: number;
}

export interface SkillCategoryBreakdown {
  category: string;
  count: number;
}

export interface AnalyticsData {
  total_candidates: number;
  top_programming_languages: DistributionItem[];
  top_databases: DistributionItem[];
  top_machine_learning: DistributionItem[];
  university_distribution: DistributionItem[];
  experience_distribution: DistributionItem[];
  platforms_distribution: DistributionItem[];
  skills_breakdown: SkillCategoryBreakdown[];
}

export interface UploadResultItem {
  resume_id: number;
  candidate_id: number;
  filename: string;
  candidate_name: string;
  email: string;
  phone: string;
  skills_count: number;
  status: string;
}

export interface UploadResponse {
  success: boolean;
  uploaded_count: number;
  results: UploadResultItem[];
  errors: { filename: string; error: string }[];
}
