using EAD_Backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EAD_Backend.Services.Interfaces
{
    public interface IVendorService
    {
        Task CreateVendor(Vendor vendor);
        Task<List<Vendor>> GetVendorsByCustomerEmail(string email);
    }
}
