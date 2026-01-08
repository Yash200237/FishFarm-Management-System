using App.Domain.Enums;

namespace App.Domain.Entities
{
    public  class User
    {
        public Guid UserId { get; set; }
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public Guid? OrgId { get; set; }
        public Org? Org { get; set; }
        public UserRoles UserRole { get; set; } 

    }
}
