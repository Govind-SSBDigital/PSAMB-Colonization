export interface RegisterPropertyModel {
     allotteeCode: string | null;

  // Property Details
  district: string;
  marketCommittee: string;
  mandi: string;
  plotNumber: string;

  // Owner Details
  currentOwnerName: string;
  guardianName: string;
  mobileNumber: string;
  email: string;

  state: string;
  ownerDistrict: string;
  city: string;
  address: string;

  aadhaarNumber: string;
  aadhaarProof: File | null;

  passportNumber: string | null;
  passportProof: File | null;

  documents: PropertyDocuments;
}

export interface PropertyDocuments {
  allotmentLetter: DocumentUpload;
  lastPaymentReceipt: DocumentUpload;
  noDueCertificate: DocumentUpload;
  bForm: DocumentUpload;
  conveyanceDeed: DocumentUpload;
  saleDeed: DocumentUpload;
  transferOrder: DocumentUpload;
  legalHeirCertificate: DocumentUpload;
}

export interface DocumentUpload {
  selected: boolean;
  file: File | null;
}

export interface PropertySearchRequest {
  allotteeCode: string;
}

export interface PropertySearchResponse {
  allotteeCode: string;

  district: string;
  marketCommittee: string;
  mandi: string;
  plotNumber: string;

  currentOwnerName: string;
  guardianName: string;
  mobileNumber: string;
  email: string;

  state: string;
  ownerDistrict: string;
  city: string;
  address: string;

  aadhaarNumber: string;
  passportNumber: string | null;
}

export interface DropdownOption {
  id: number | string;
  name: string;
}

export interface PropertyTable {
  id: number;

  allotteeCode: string;
  districtName: string;
  marketCommitteeName: string;
  mandiName: string;

  propertyCategory: string;
  propertySubCategory: string;
  propertySize: string;
  plotNumber: string;

  ownerName: string;
  status: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface FileUploadResponse {
  fileName: string;
  fileUrl: string;


  
}
