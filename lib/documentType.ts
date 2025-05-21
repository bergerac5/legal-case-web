export interface CreateDocumentDto {
  case_id: string;
  filename: string;
  file_type: string;
}

export interface UpdateDocumentDto {
  filename?: string;
  file_type?: string;
}

