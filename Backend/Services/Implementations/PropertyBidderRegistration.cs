using Backend.Data;
using Backend.Helpers;
using Backend.Models.Dtos;
using Backend.Models.Entities;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services.Implementations
{
    public class PropertyBidderRegistration : IPropertyBidderRegistration
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _config;
        public PropertyBidderRegistration(ApplicationDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }
        private async Task<string> GeneratePropertyCode(int districtId, int mandiMarketId, int mandiId, int? plotNo)
        {
            var districtName = await _context.DistrictMasters.Where(x => x.DistrictId == districtId).Select(x => x.DistrictName).FirstOrDefaultAsync();

            var mandiMarketName = await _context.BranchMaster.Where(x => x.BranchId == mandiMarketId).Select(x => x.BranchName).FirstOrDefaultAsync();

            var mandiName = await _context.MandiMaster.Where(x => x.MandiId == mandiId).Select(x => x.MandiName).FirstOrDefaultAsync();

            var districtLetter = !string.IsNullOrEmpty(districtName) ? districtName.Substring(0, 1).ToUpper() : "";
            var mandimarketLetter = !string.IsNullOrEmpty(mandiMarketName) ? mandiMarketName.Substring(0, 1).ToUpper() : "";
            var mandiLetter = !string.IsNullOrEmpty(mandiName) ? mandiName.Substring(0, 1).ToUpper() : "";

            var lastCode = await _context.PropertyBidderRegistration.OrderByDescending(x => x.Id)
                .Select(x => x.PropertyCode)
                .FirstOrDefaultAsync();

            int series = 1;

            if (!string.IsNullOrEmpty(lastCode))
            {
                var lastSeries = int.Parse(lastCode.Split('-').Last());
                series = lastSeries + 1;
            }

            return $"{districtLetter}{mandimarketLetter}{mandiLetter}{plotNo}-{series}";
        }

        public async Task<ApiResponse<PropertyBidderRegistrationDto>> RegisterPropertyAsync(PropertyBidderRegistrationDto dto)
        {
            try
            {
                var propertyCode = await GeneratePropertyCode(dto.DistrictId, dto.BranchId, dto.MandiId, dto.PlotNo);

                var entity = new Models.Entities.PropertyBidderRegistration
                {
                    MandiId = dto.MandiId,
                    BranchId = dto.BranchId,
                    DistrictId = dto.DistrictId,
                    PropertyCode = propertyCode,
                    PlotTypeId = dto.PlotTypeId,
                    ApplicantId = dto.ApplicantId??0,
                    PlanId = dto.PlanId,
                    PlotSize = dto.PlotSize,
                    PlotNo = dto.PlotNo,
                    AssetResumed = dto.AssetResumed ?? false,
                    AssetSurrendered = dto.AssetSurrendered ?? false,
                    IsAssetLocked = dto.IsAssetLocked ?? false,
                    IsDefaulter = dto.IsDefaulter ?? false,
                    AnyComplaint = dto.AnyComplaint ?? false,
                    NdcGenerated = dto.NdcGenerated ?? false,
                    NdcIssued = dto.NdcIssued ?? false,
                    AssetVerified = dto.AssetVerified ?? false,
                    IsAuctioned = dto.IsAuctioned ?? false,
                    IsCourtCase = dto.IsCourtCase ?? false,
                    AuctionDate = dto.AuctionDate,
                    BidderTypeId = dto.BidderTypeId,
                    BidderName = dto.BidderName,
                    Email = dto.Email,
                    IsTransferred = dto.IsTransferred ?? false,
                    Relation = dto.Relation,
                    FatherOrHusbandName = dto.FatherOrHusbandName,
                    PANNo = dto.PANNo,
                    AadhaarNo = dto.AadhaarNo,
                    MobileNo = dto.MobileNo,
                    PropertyTypeId = dto.PropertyTypeId,
                    Address = dto.Address,
                    ReservePrice = dto.ReservePrice,
                    FinalBidPrice = dto.FinalBidPrice,
                    FormTransactionId = dto.FormTransactionId,
                    FormTxnDate = dto.FormTxnDate,
                    FormPaidAmount = dto.FormPaidAmount,
                    EmdTxnId = dto.EmdTxnId,
                    EmdDate = dto.EmdDate,
                    EmdAmount = dto.EmdAmount,
                    AllotmentTxnId = dto.AllotmentTxnId,
                    AllotmentDate = dto.AllotmentDate,
                    AllotmentAmount = dto.AllotmentAmount,
                    DueAmount = dto.DueAmount,
                    TotalDueWithInterest = dto.TotalDueWithInterest,
                    ApplicationStatusId = 1,
                    PlotStatus = dto.PlotStatus,
                    PropertyCategoryId = dto.PropertyCategoryId ?? 0,
                    IsActive = true,
                    IsDeleted = false,
                    CreatedDate = DateTime.UtcNow,
                    CreatedBy = dto.CreatedBy ?? dto.ApplicantId ?? 0
                };

                _context.PropertyBidderRegistration.Add(entity);
                await _context.SaveChangesAsync();

                dto.Id = entity.Id;

                var installmentsList = dto.Installments;
                if (installmentsList != null && installmentsList.Any())
                {
                    var installments = installmentsList.Select(i => new Models.Entities.InstallmentDetails
                    {
                        ReceiptNo = i.ReceiptNo,
                        ReceiptDate = i.ReceiptDate,
                        DraftNo = i.DraftNo,
                        DraftAmount = i.DraftAmount ?? 0,
                        DraftDate = i.DraftDate,
                        DraftBank = i.DraftBank,
                        Principal = i.PrincipalAmount ?? 0,
                        Interest = i.InterestAmount ?? 0,
                        OtherAmount = i.OtherAmount ?? 0,
                        PenaltyAmount = i.PenaltyAmount ?? 0,
                        Type = i.PenaltyType,
                        Remarks = i.Remarks,
                        ApplicantId = entity.ApplicantId,
                        PropertyId = entity.Id,
                        IsVerified = i.IsVerified ?? false
                    }).ToList();

                    _context.InstallmentDetails.AddRange(installments);
                    await _context.SaveChangesAsync();

                }

                return ApiResponse<PropertyBidderRegistrationDto>.Ok(dto, "Property registered successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<PropertyBidderRegistrationDto>.Fail(ex.Message);
            }
        }

        public async Task<ApiResponse<PropertyBidderRegistrationDto>> GetRegistrationByIdAsync(int id)
        {
            try
            {
                var registration = await _context.PropertyBidderRegistration
                    .AsNoTracking()
                    .Where(x => x.Id == id && x.IsActive && !x.IsDeleted)
                    .Select(x => new PropertyBidderRegistrationDto
                    {
                        Id = x.Id,
                        MandiId = x.MandiId,
                        BranchId = x.BranchId,
                        DistrictId = x.DistrictId,
                        ApplicantId = x.ApplicantId,
                        PlotTypeId = x.PlotTypeId,
                        PlanId = x.PlanId,
                        PlotSize = x.PlotSize,
                        PropertyCode = x.PropertyCode,
                        PlotNo = x.PlotNo,
                        AssetResumed = x.AssetResumed,
                        AssetSurrendered = x.AssetSurrendered,
                        IsAssetLocked = x.IsAssetLocked,
                        IsDefaulter = x.IsDefaulter,
                        AnyComplaint = x.AnyComplaint,
                        NdcGenerated = x.NdcGenerated,
                        IsCourtCase = x.IsCourtCase,
                        NdcIssued = x.NdcIssued,
                        AssetVerified = x.AssetVerified,
                        IsAuctioned = x.IsAuctioned,
                        AuctionDate = x.AuctionDate,
                        BidderTypeId = x.BidderTypeId,
                        BidderName = x.BidderName,
                        Email = x.Email,
                        IsTransferred = x.IsTransferred,
                        Relation = x.Relation,
                        FatherOrHusbandName = x.FatherOrHusbandName,
                        PANNo = x.PANNo,
                        AadhaarNo = x.AadhaarNo,
                        MobileNo = x.MobileNo,
                        PropertyTypeId = x.PropertyTypeId,
                        Address = x.Address,
                        ReservePrice = x.ReservePrice,
                        FinalBidPrice = x.FinalBidPrice,
                        FormTransactionId = x.FormTransactionId,
                        FormTxnDate = x.FormTxnDate,
                        FormPaidAmount = x.FormPaidAmount,
                        EmdTxnId = x.EmdTxnId,
                        EmdDate = x.EmdDate,
                        EmdAmount = x.EmdAmount,
                        AllotmentTxnId = x.AllotmentTxnId,
                        AllotmentDate = x.AllotmentDate,
                        AllotmentAmount = x.AllotmentAmount,
                        DueAmount = x.DueAmount,
                        TotalDueWithInterest = x.TotalDueWithInterest,
                        ApplicationStatusId = x.ApplicationStatusId,
                        PlotStatus = x.PlotStatus,
                        PropertyCategoryId = x.PropertyCategoryId,
                        DistrictName = x.District != null ? x.District.DistrictName : "",
                        BranchName = x.Branch != null ? x.Branch.BranchName : "",
                        MandiName = x.Mandi != null ? x.Mandi.MandiName : "",
                        Remarks=x.Remarks

                    })
                    .FirstOrDefaultAsync();

                if (registration == null)
                {
                    return ApiResponse<PropertyBidderRegistrationDto>.Fail("Registration not found");
                }

                var installments = await _context.InstallmentDetails
                    .AsNoTracking()
                    .Where(i => i.PropertyId == id)
                    .Select(i => new InstallmentDetailsDto
                    {
                        Id = i.Id,
                        ReceiptNo = i.ReceiptNo,
                        ReceiptDate = i.ReceiptDate,
                        DraftNo = i.DraftNo,
                        DraftAmount = i.DraftAmount,
                        DraftDate = i.DraftDate,
                        DraftBank = i.DraftBank,
                        PrincipalAmount = i.Principal,
                        InterestAmount = i.Interest,
                        OtherAmount = i.OtherAmount,
                        PenaltyAmount = i.PenaltyAmount,
                        PenaltyType = i.Type,
                        Remarks = i.Remarks,
                        ApplicantId = i.ApplicantId,
                        PropertyId = i.PropertyId,
                        IsVerified = i.IsVerified
                    })
                    .ToListAsync();

                registration.Installments = installments;

                return ApiResponse<PropertyBidderRegistrationDto>.Ok(registration, "Registration fetched successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<PropertyBidderRegistrationDto>.Fail(ex.Message);
            }
        }

        public async Task<ApiResponse<PropertyBidderRegistrationDto>> GetRegistrationByPropertyCodeAsync(string propertyCode)
        {
            try
            {
                var registration = await _context.PropertyBidderRegistration
                    .AsNoTracking()
                    .Where(x => x.PropertyCode == propertyCode && x.IsActive && !x.IsDeleted)
                    .Select(x => new PropertyBidderRegistrationDto
                    {
                        Id = x.Id,
                        MandiId = x.MandiId,
                        BranchId = x.BranchId,
                        DistrictId = x.DistrictId,
                        PropertyCode = x.PropertyCode,
                        ApplicantId = x.ApplicantId,
                        PlotTypeId = x.PlotTypeId,
                        PlanId = x.PlanId,
                        PlotSize = x.PlotSize,
                        PlotNo = x.PlotNo,
                        AssetResumed = x.AssetResumed,
                        AssetSurrendered = x.AssetSurrendered,
                        IsAssetLocked = x.IsAssetLocked,
                        IsDefaulter = x.IsDefaulter,
                        AnyComplaint = x.AnyComplaint,
                        NdcGenerated = x.NdcGenerated,
                        NdcIssued = x.NdcIssued,
                        AssetVerified = x.AssetVerified,
                        IsCourtCase = x.IsCourtCase,
                        IsAuctioned = x.IsAuctioned,
                        AuctionDate = x.AuctionDate,
                        BidderTypeId = x.BidderTypeId,
                        BidderName = x.BidderName,
                        Email = x.Email,
                        IsTransferred = x.IsTransferred,
                        Relation = x.Relation,
                        FatherOrHusbandName = x.FatherOrHusbandName,
                        PANNo = x.PANNo,
                        AadhaarNo = x.AadhaarNo,
                        MobileNo = x.MobileNo,
                        PropertyTypeId = x.PropertyTypeId,
                        Address = x.Address,
                        ReservePrice = x.ReservePrice,
                        FinalBidPrice = x.FinalBidPrice,
                        FormTransactionId = x.FormTransactionId,
                        FormTxnDate = x.FormTxnDate,
                        FormPaidAmount = x.FormPaidAmount,
                        EmdTxnId = x.EmdTxnId,
                        EmdDate = x.EmdDate,
                        EmdAmount = x.EmdAmount,
                        AllotmentTxnId = x.AllotmentTxnId,
                        AllotmentDate = x.AllotmentDate,
                        AllotmentAmount = x.AllotmentAmount,
                        DueAmount = x.DueAmount,
                        TotalDueWithInterest = x.TotalDueWithInterest,
                        ApplicationStatusId = x.ApplicationStatusId,
                        PlotStatus = x.PlotStatus,
                        PropertyCategoryId = x.PropertyCategoryId,
                    })
                    .FirstOrDefaultAsync();

                if (registration == null)
                {
                    return ApiResponse<PropertyBidderRegistrationDto>.Fail("no record found");
                }

                var installments = await _context.InstallmentDetails
                    .AsNoTracking()
                    .Where(i => i.PropertyId == registration.Id)
                    .Select(i => new InstallmentDetailsDto
                    {
                        Id = i.Id,
                        ReceiptNo = i.ReceiptNo,
                        ReceiptDate = i.ReceiptDate,
                        DraftNo = i.DraftNo,
                        DraftAmount = i.DraftAmount,
                        DraftDate = i.DraftDate,
                        DraftBank = i.DraftBank,
                        PrincipalAmount = i.Principal,
                        InterestAmount = i.Interest,
                        OtherAmount = i.OtherAmount,
                        PenaltyAmount = i.PenaltyAmount,
                        PenaltyType = i.Type,
                        Remarks = i.Remarks,
                        ApplicantId = i.ApplicantId,
                        PropertyId = i.PropertyId,
                        IsVerified = i.IsVerified
                    })
                    .ToListAsync();
                registration.Installments = installments;

                return ApiResponse<PropertyBidderRegistrationDto>.Ok(registration, "Registration fetched successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<PropertyBidderRegistrationDto>.Fail(ex.Message);
            }
        }

        public async Task<ApiResponse<List<PropertyBidderRegistrationDto>>> GetAllRegistrationsAsync()
        {
            try
            {
                var list = await _context.PropertyBidderRegistration
                    .AsNoTracking()
                    .Where(x => x.IsActive && !x.IsDeleted)
                    .Select(x => new PropertyBidderRegistrationDto
                    {
                        Id = x.Id,
                        MandiId = x.MandiId,
                        BranchId = x.BranchId,
                        PropertyCode = x.PropertyCode,
                        ApplicantId = x.ApplicantId,
                        DistrictId = x.DistrictId,
                        PlotTypeId = x.PlotTypeId,
                        PlanId = x.PlanId,
                        PlotSize = x.PlotSize,
                        PlotNo = x.PlotNo,
                        AssetResumed = x.AssetResumed,
                        AssetSurrendered = x.AssetSurrendered,
                        IsAssetLocked = x.IsAssetLocked,
                        IsCourtCase = x.IsCourtCase,
                        IsDefaulter = x.IsDefaulter,
                        AnyComplaint = x.AnyComplaint,
                        NdcGenerated = x.NdcGenerated,
                        NdcIssued = x.NdcIssued,
                        AssetVerified = x.AssetVerified,
                        IsAuctioned = x.IsAuctioned,
                        AuctionDate = x.AuctionDate,
                        BidderTypeId = x.BidderTypeId,
                        BidderName = x.BidderName,
                        Email = x.Email,
                        IsTransferred = x.IsTransferred,
                        Relation = x.Relation,
                        FatherOrHusbandName = x.FatherOrHusbandName,
                        PANNo = x.PANNo,
                        AadhaarNo = x.AadhaarNo,
                        MobileNo = x.MobileNo,
                        PropertyTypeId = x.PropertyTypeId,
                        Address = x.Address,
                        ReservePrice = x.ReservePrice,
                        FinalBidPrice = x.FinalBidPrice,
                        FormTransactionId = x.FormTransactionId,
                        FormTxnDate = x.FormTxnDate,
                        FormPaidAmount = x.FormPaidAmount,
                        EmdTxnId = x.EmdTxnId,
                        EmdDate = x.EmdDate,
                        EmdAmount = x.EmdAmount,
                        AllotmentTxnId = x.AllotmentTxnId,
                        AllotmentDate = x.AllotmentDate,
                        AllotmentAmount = x.AllotmentAmount,
                        DueAmount = x.DueAmount,
                        TotalDueWithInterest = x.TotalDueWithInterest,
                        ApplicationStatusId = x.ApplicationStatusId,
                        PlotStatus = x.PlotStatus,
                        PropertyCategoryId = x.PropertyCategoryId,
                    })
                    .ToListAsync();

                var propertyIds = list.Select(x => (int?)x.Id).ToList();

                var allInstallments = await _context.InstallmentDetails
                    .AsNoTracking()
                    .Where(i => propertyIds.Contains(i.PropertyId))
                    .Select(i => new InstallmentDetailsDto
                    {
                        Id = i.Id,
                        ReceiptNo = i.ReceiptNo,
                        ReceiptDate = i.ReceiptDate,
                        DraftNo = i.DraftNo,
                        DraftAmount = i.DraftAmount,
                        DraftDate = i.DraftDate,
                        DraftBank = i.DraftBank,
                        PrincipalAmount = i.Principal,
                        InterestAmount = i.Interest,
                        OtherAmount = i.OtherAmount,
                        PenaltyAmount = i.PenaltyAmount,
                        PenaltyType = i.Type,
                        Remarks = i.Remarks,
                        ApplicantId = i.ApplicantId,
                        PropertyId = i.PropertyId,
                        IsVerified = i.IsVerified
                    })
                    .ToListAsync();

                foreach (var reg in list)
                {
                    var installments = allInstallments.Where(i => i.PropertyId == reg.Id).ToList();
                    reg.Installments = installments;
                }

                return ApiResponse<List<PropertyBidderRegistrationDto>>.Ok(list, "Registrations fetched successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<List<PropertyBidderRegistrationDto>>.Fail(ex.Message);
            }
        }

        public async Task<ApiResponse<PropertyBidderRegistrationDto>> UpdateRegisterPropertyAsync(PropertyBidderRegistrationDto dto)
        {
            try
            {
                var entity = await _context.PropertyBidderRegistration.FirstOrDefaultAsync(x => x.Id == dto.Id);

                if (entity == null)
                    return ApiResponse<PropertyBidderRegistrationDto>.Fail("Record not found");


                entity.MandiId = dto.MandiId;
                entity.BranchId = dto.BranchId;
                entity.DistrictId = dto.DistrictId;
                entity.PlotTypeId = dto.PlotTypeId;
                entity.ApplicantId = dto.ApplicantId ?? 0;
                entity.PlanId = dto.PlanId;
                entity.PlotSize = dto.PlotSize;
                entity.PlotNo = dto.PlotNo;

                entity.AssetResumed = dto.AssetResumed ?? false;
                entity.AssetSurrendered = dto.AssetSurrendered ?? false;
                entity.IsAssetLocked = dto.IsAssetLocked ?? false;
                entity.IsDefaulter = dto.IsDefaulter ?? false;
                entity.AnyComplaint = dto.AnyComplaint ?? false;
                entity.NdcGenerated = dto.NdcGenerated ?? false;
                entity.NdcIssued = dto.NdcIssued ?? false;
                entity.AssetVerified = dto.AssetVerified ?? false;
                entity.IsAuctioned = dto.IsAuctioned ?? false;
                entity.AuctionDate = dto.AuctionDate;
                entity.IsCourtCase = dto.IsCourtCase ?? false;
                entity.BidderTypeId = dto.BidderTypeId;
                entity.BidderName = dto.BidderName;
                entity.Email = dto.Email;
                entity.IsTransferred = dto.IsTransferred ?? false;
                entity.Relation = dto.Relation;
                entity.FatherOrHusbandName = dto.FatherOrHusbandName;
                entity.PANNo = dto.PANNo;
                entity.AadhaarNo = dto.AadhaarNo;
                entity.MobileNo = dto.MobileNo;

                entity.PropertyTypeId = dto.PropertyTypeId;
                entity.Address = dto.Address;

                entity.ReservePrice = dto.ReservePrice;
                entity.FinalBidPrice = dto.FinalBidPrice;

                entity.FormTransactionId = dto.FormTransactionId;
                entity.FormTxnDate = dto.FormTxnDate;
                entity.FormPaidAmount = dto.FormPaidAmount;

                entity.EmdTxnId = dto.EmdTxnId;
                entity.EmdDate = dto.EmdDate;
                entity.EmdAmount = dto.EmdAmount;

                entity.AllotmentTxnId = dto.AllotmentTxnId;
                entity.AllotmentDate = dto.AllotmentDate;
                entity.AllotmentAmount = dto.AllotmentAmount;

                entity.DueAmount = dto.DueAmount;
                entity.TotalDueWithInterest = dto.TotalDueWithInterest;

                entity.ApplicationStatusId = 1;
                entity.PlotStatus = dto.PlotStatus;
                entity.PropertyCategoryId = dto.PropertyCategoryId ?? 0;

                entity.ModifiedDate = DateTime.UtcNow;
                entity.ModifiedBy = dto.ModifiedBy;

                await _context.SaveChangesAsync();

                var oldInstallments = _context.InstallmentDetails.Where(x => x.PropertyId == entity.Id);

                _context.InstallmentDetails.RemoveRange(oldInstallments);

                if (dto.Installments != null && dto.Installments.Any())
                {
                    var newInstallments = dto.Installments.Select(i => new Models.Entities.InstallmentDetails
                    {
                        ReceiptNo = i.ReceiptNo,
                        ReceiptDate = i.ReceiptDate,
                        DraftNo = i.DraftNo,
                        DraftAmount = i.DraftAmount ?? 0,
                        DraftDate = i.DraftDate,
                        DraftBank = i.DraftBank,
                        Principal = i.PrincipalAmount ?? 0,
                        Interest = i.InterestAmount ?? 0,
                        OtherAmount = i.OtherAmount ?? 0,
                        PenaltyAmount = i.PenaltyAmount ?? 0,
                        Type = i.PenaltyType,
                        Remarks = i.Remarks,
                        ApplicantId = entity.ApplicantId,
                        PropertyId = entity.Id,
                        IsVerified = i.IsVerified ?? false
                    }).ToList();

                    _context.InstallmentDetails.AddRange(newInstallments);
                }

                await _context.SaveChangesAsync();

                return ApiResponse<PropertyBidderRegistrationDto>.Ok(dto, "Property updated successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<PropertyBidderRegistrationDto>.Fail(ex.Message);
            }
        }

        public async Task<ApiResponse<List<PropertyBidderRegistrationDto>>> GetPendingForClerk()
        {
            try
            {
                var list = await (
                    from x in _context.PropertyBidderRegistration

                    join u in _context.ApplicationUsers
                        on x.CreatedBy equals u.ApplicantId into userJoin
                    from u in userJoin.DefaultIfEmpty()

                    join ur in _context.UserRoles
                        on u.IdentityUserId equals ur.UserId into userRoleJoin
                    from ur in userRoleJoin.DefaultIfEmpty()

                    join r in _context.Roles
                        on ur.RoleId equals r.Id into roleJoin
                    from r in roleJoin.DefaultIfEmpty()

                    where x.IsActive && !x.IsDeleted 

                    select new PropertyBidderRegistrationDto
                    {
                        Id = x.Id,
                        MandiId = x.MandiId,
                        BranchId = x.BranchId,
                        ApplicantId = x.ApplicantId,
                        DistrictId = x.DistrictId,
                        PlotTypeId = x.PlotTypeId,
                        PlanId = x.PlanId,
                        PlotSize = x.PlotSize,
                        PlotNo = x.PlotNo,
                        AssetResumed = x.AssetResumed,
                        AssetSurrendered = x.AssetSurrendered,
                        IsAssetLocked = x.IsAssetLocked,
                        IsDefaulter = x.IsDefaulter,
                        AnyComplaint = x.AnyComplaint,
                        NdcGenerated = x.NdcGenerated,
                        NdcIssued = x.NdcIssued,
                        AssetVerified = x.AssetVerified,
                        IsCourtCase = x.IsCourtCase,
                        IsAuctioned = x.IsAuctioned,
                        AuctionDate = x.AuctionDate,
                        BidderTypeId = x.BidderTypeId,
                        BidderName = x.BidderName,
                        Email = x.Email,
                        IsTransferred = x.IsTransferred,
                        Relation = x.Relation,
                        FatherOrHusbandName = x.FatherOrHusbandName,
                        PANNo = x.PANNo,
                        AadhaarNo = x.AadhaarNo,
                        MobileNo = x.MobileNo,
                        PropertyTypeId = x.PropertyTypeId,
                        Address = x.Address,
                        ReservePrice = x.ReservePrice,
                        FinalBidPrice = x.FinalBidPrice,
                        FormTransactionId = x.FormTransactionId,
                        FormTxnDate = x.FormTxnDate,
                        FormPaidAmount = x.FormPaidAmount,
                        EmdTxnId = x.EmdTxnId,
                        EmdDate = x.EmdDate,
                        EmdAmount = x.EmdAmount,
                        AllotmentTxnId = x.AllotmentTxnId,
                        AllotmentDate = x.AllotmentDate,
                        AllotmentAmount = x.AllotmentAmount,
                        DueAmount = x.DueAmount,
                        TotalDueWithInterest = x.TotalDueWithInterest,
                        ApplicationStatusId = x.ApplicationStatusId,
                        PlotStatus = x.PlotStatus,
                        PropertyCategoryId = x.PropertyCategoryId,
                        PropertyCode = x.PropertyCode,
                        CreatedBy = x.CreatedBy,
                        Remarks=x.Remarks,
                        DistrictName = x.District != null ? x.District.DistrictName : "",
                        BranchName = x.Branch != null ? x.Branch.BranchName : "",
                        MandiName = x.Mandi != null ? x.Mandi.MandiName : "",

                        IdentityUserId = u != null ? u.IdentityUserId : null,
                        UserId = ur != null ? ur.UserId : null,
                        RoleName = r != null ? r.Name : null,
                        FirstName= u.FirstName,

                        Label = r != null && r.Name.ToUpper() == "DEO" ? "DEO" : "User"
                    }
                ).OrderByDescending(x=>x.Id).ToListAsync();

                var propertyIds = list.Select(x => (int?)x.Id).ToList();

                var allInstallments = await _context.InstallmentDetails
                    .AsNoTracking()
                    .Where(i => propertyIds.Contains(i.PropertyId))
                    .Select(i => new InstallmentDetailsDto
                    {
                        Id = i.Id,
                        ReceiptNo = i.ReceiptNo,
                        ReceiptDate = i.ReceiptDate,
                        DraftNo = i.DraftNo,
                        DraftAmount = i.DraftAmount,
                        DraftDate = i.DraftDate,
                        DraftBank = i.DraftBank,
                        PrincipalAmount = i.Principal,
                        InterestAmount = i.Interest,
                        OtherAmount = i.OtherAmount,
                        PenaltyAmount = i.PenaltyAmount,
                        PenaltyType = i.Type,
                        Remarks = i.Remarks,
                        ApplicantId = i.ApplicantId,
                        PropertyId = i.PropertyId,
                        IsVerified = i.IsVerified
                    })
                    .ToListAsync();

                return ApiResponse<List<PropertyBidderRegistrationDto>>
                    .Ok(list, "Registrations fetched successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<List<PropertyBidderRegistrationDto>>
                    .Fail(ex.Message);
            }
        }
        public async Task<ApiResponse<bool>> VerifyByClerk(ClerkVerificationDto dto)
        {
            try
            {
                var record = await _context.PropertyBidderRegistration
                    .FirstOrDefaultAsync(x => x.Id == dto.Id && !x.IsDeleted);

                if (record == null)
                    return ApiResponse<bool>.Fail("Record not found");

                if (record.ApplicationStatusId == 2)
                    return ApiResponse<bool>.Fail("Already verified by clerk");

                if (dto.Decision == "sendback" && string.IsNullOrWhiteSpace(dto.Remarks))
                    return ApiResponse<bool>.Fail("Remarks required for send back");

                if (dto.Decision == "approve")
                {
                    record.ApplicationStatusId = 2;
                }
                else if (dto.Decision == "sendback")
                {
                    record.ApplicationStatusId = 7;
                    record.Remarks = dto.Remarks;
                }
                else
                {
                    return ApiResponse<bool>.Fail("Invalid decision");
                }

                record.ModifiedBy = dto.ModifiedBy;
                record.ModifiedDate = DateTime.Now;

                await _context.SaveChangesAsync();

                return ApiResponse<bool>.Ok(true, "Action completed successfully");
            }
            catch (Exception ex)
            {
                return ApiResponse<bool>.Fail(ex.Message);
            }
        }
    }
}
