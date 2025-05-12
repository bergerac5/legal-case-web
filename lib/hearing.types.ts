export interface Hearing {
  id: string;
  case_id: string;
  start_time: Date;
  end_time: Date;
  location?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}


export interface CreateHearingDto {
  case_id: string;
  start_time: Date;
  end_time: Date;
  location?: string;
  notes?: string;
}

export interface UpdateHearingDto {
    
  start_time: Date;
  end_time: Date;
  location?: string;
  notes?: string;
}