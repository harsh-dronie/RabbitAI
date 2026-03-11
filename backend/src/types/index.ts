export interface UploadRequest {
  file: Express.Multer.File
  email: string
}

export interface ApiResponse {
  success: boolean
  message: string
}

export interface SpreadsheetData {
  [key: string]: any
}
