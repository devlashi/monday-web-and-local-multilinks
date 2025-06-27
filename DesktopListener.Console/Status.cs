using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DesktopListener.CLI
{
    public enum Status
    {
        Ok = 1,
        AccessDenied = 2,
        ServerError = 3

        
    }

    public static class Utils
    {
        public static int ToInt(this Status state)
        {
            return (int)state;
        }
    }

    
}
