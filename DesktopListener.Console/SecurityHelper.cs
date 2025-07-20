using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DesktopListener.CLI
{
    public class SecurityHelper
    {
        private static readonly HashSet<string> DangerousExtensions = new(StringComparer.OrdinalIgnoreCase)
        {
            // Windows executables & scripts
            ".exe", ".bat", ".cmd", ".com", ".msi", ".vbs", ".js", ".jse", ".wsf", ".wsh",
            ".ps1", ".reg", ".scr", ".dll", ".pif", ".cpl", ".hta", ".lnk",

            // Cross-platform
            ".jar", ".py", ".rb", ".sh", ".html", ".htm", ".svg", ".mhtml", ".xhtml",

            // macOS specific
            ".app", ".command", ".pkg", ".dmg", ".scpt", ".workflow",

            // Linux/Unix optional
            ".run", ".bin", ".desktop"
        };

        public static readonly List<string> RestrictedWindowsFolders;
        public static readonly List<string> RestrictedMacFolders;

        static SecurityHelper()
        {
            string userName = Environment.UserName;

            RestrictedWindowsFolders = new List<string>
            {
                @"C:\Windows",
                @"C:\Windows\System32",
                @"C:\Program Files",
                @"C:\Program Files (x86)",
                $@"C:\Users\{userName}\AppData\Local",
                $@"C:\Users\{userName}\AppData\Roaming",
                $@"C:\Users\{userName}\AppData\LocalLow",
                @"C:\ProgramData",
                @"C:\System Volume Information",
                @"C:\$Recycle.Bin",
                @"C:\Recovery",
                @"C:\PerfLogs",
                @"C:\Documents and Settings", // legacy folder
                @"C:\pagefile.sys",
                @"C:\hiberfil.sys",
                @"C:\Boot",
                @"C:\System Reserved"
            };

            RestrictedMacFolders = new List<string>
            {
                "/System",
                "/Library",
                "/Library/Application Support",
                "/Library/Preferences",
                "/private",
                "/private/var",
                "/private/tmp",
                $"/Users/{userName}/Library",
                $"/Users/{userName}/Library/Application Support",
                $"/Users/{userName}/Library/Preferences",
                $"/Users/{userName}/Library/Caches",
                $"/Users/{userName}/Library/Containers",
                "/Volumes",
                "/usr",
                "/bin",
                "/sbin",
                "/etc",
                "/tmp"
            };
        }

        public static bool IsSafeToOpen(string path, bool isParentDirectory)
        {
            string normalizedPath = path.Replace('/', Path.DirectorySeparatorChar)
                                .Replace('\\', Path.DirectorySeparatorChar);

            string fullPath;
            try
            {
                fullPath = Path.GetFullPath(normalizedPath);
            }
            catch
            {
                return false;
            }

            fullPath = fullPath.TrimEnd(Path.DirectorySeparatorChar);

            foreach (var restricted in RestrictedWindowsFolders)
            {
                if (fullPath.StartsWith(restricted, StringComparison.OrdinalIgnoreCase))
                    return false;
            }

            foreach (var restricted in RestrictedMacFolders)
            {
                if (fullPath.StartsWith(restricted, StringComparison.OrdinalIgnoreCase))
                    return false;
            }

            if (isParentDirectory) return true;
            string ext = Path.GetExtension(path);
            return !DangerousExtensions.Contains(ext);
        }
    }
}
