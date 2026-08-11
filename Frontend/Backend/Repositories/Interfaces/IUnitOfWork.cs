
using Backend.Models.Entities;

namespace Backend.Repositories.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        IRepository<UploadedFile> Files { get; }

        Task<int> SaveChangesAsync();
        Task BeginTransactionAsync();
        Task CommitAsync();
        Task RollbackAsync();
    }
}