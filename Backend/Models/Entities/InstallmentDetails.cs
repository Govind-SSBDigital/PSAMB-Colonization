namespace Backend.Models.Entities
{
    public class InstallmentDetails
    {
        public int Id { get; set; }

        public string? ReceiptNo { get; set; }

        public DateTime? ReceiptDate { get; set; }

        public string? DraftNo { get; set; }

        public decimal DraftAmount { get; set; }

        public DateTime? DraftDate { get; set; }

        public string? DraftBank { get; set; }

        public decimal Principal { get; set; }

        public decimal Interest { get; set; }

        public decimal OtherAmount { get; set; }

        public decimal PenaltyAmount { get; set; }

        public string? Type { get; set; }

        public string? Remarks { get; set; }
        public int ApplicantId { get; set; }
        public int? PropertyId {  get; set; }
        public bool IsVerified {  get; set; }
    }
}
