export interface PropertyBidderRegistrationModel {
  // Property Information
  propertycode: string;
  district: string;
  branch: string;
  mandi: string;
  plotsize: string;
  plottype: string;
  plotno: string;
  plan: string;
  plotstatus: string;
  propertycategory: string;

  // Asset Status
  isAssetResumed: boolean;
  IsAssetSurrendered: boolean;
  IsLocked: boolean;
  IsDefaulter: boolean;
  IsAnyComplaint: boolean;
  IsNDCGenerated: boolean;
  IsNDCIssued: boolean;
  IsAssetVerified: boolean;
  IsCourtCase: boolean;

  // Auction Information
  Isauctioned: boolean;
  auctionDateTime: string;

  bidderType: string;
  emailId: string;
  h1BidderName: string;

  transfered: boolean;
  relation: string;
  guardianName: string;

  panNo: string;
  aadharNo: string;
  mobileNo: string;

  auctionPropertyType: string;
  communicationAddress: string;

  // Financial Details
  reservePrice: number;
  h1BidderFinalPrice: number;

  // Form Fee
  formFeeTransactionId: string;
  formFeeTransactionDate: string;
  formFeePaidAmount: number;

  // EMD Details
  emdTransactionId: string;
  emdTransactionDate: string;
  emdPaidAmount: number;

  // 25% Allotment Details
  allotmentTransactionId: string;
  allotmentTransactionDate: string;
  allotmentPaidAmount: number;

  // Outstanding Dues
  installmentNo: string;
  dueDate: string;
  paidStatus: string;
  dueAmount: number;
  accumulatedInterest: number;
  totalDueAmount: number;
}

export interface PropertySearchRequest {
  propertycode: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
