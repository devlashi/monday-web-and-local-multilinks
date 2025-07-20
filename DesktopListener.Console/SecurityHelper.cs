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

        public static bool IsSafeToOpen(string path)
        {
            string ext = Path.GetExtension(path);
            return !DangerousExtensions.Contains(ext);
        }
    }
}
