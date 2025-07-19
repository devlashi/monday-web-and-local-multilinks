using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DesktopListener.CLI.Dtos
{
    public class MachineIdentity
    {
        public string? UniqueCode { get; set; }
        public int Port { get; set; }
        public DateTime UpdatedUtc { get; set; }
    }
}
