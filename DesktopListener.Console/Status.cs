using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DesktopListener.CLI
{
    /// <summary>
    /// Don't change the numbers for each enum. Okay to rename.
    /// The browser app uses these numbers.
    /// DoNotUse value are only for reference purposes (for monday app).
    /// </summary>
    public enum Status
    {
        DoNotUse_Default = 0,
        Success = 1,
        AccessDeniedForNonMondayContext = 2,
        AccessDeniedForIncorrectCode = 3,
        ServerError = 4,
        DoNotUse_CodeNotFoundInLocalStorage = 5,
        FileFolderNotFound = 6,
        NotAuthorizedFileOrDirectory  = 7
    }

    public static class Utils
    {
        public static int ToInt(this Status state)
        {
            return (int)state;
        }
    }

    
}
