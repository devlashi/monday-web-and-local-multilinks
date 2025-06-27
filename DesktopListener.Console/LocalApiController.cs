using System;
using static System.Console;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using EmbedIO;
using EmbedIO.Routing;
using EmbedIO.WebApi;

namespace DesktopListener.CLI
{
    public class LocalApiController : WebApiController
    {

        [Route(HttpVerbs.Get, "/open/{path}")]

        public int Open(string path, [QueryField] string? code)
        {
            try
            {

                if (!string.Equals(code, LocalApiServer.UniqueCode))
                {
                    Console.ForegroundColor = ConsoleColor.Yellow;
                    Console.WriteLine($"The code saved in the Monday app is different from the local code: {LocalApiServer.UniqueCode}");
                    Console.WriteLine("Please update the code in the Monday app.");
                    Console.ResetColor();
                    return Status.AccessDenied.ToInt();
                }

                path = WebUtility.UrlDecode(path);

                if (OperatingSystem.IsWindows())
                {
                    Type shellAppType = Type.GetTypeFromProgID("Shell.Application");
                    dynamic shell = Activator.CreateInstance(shellAppType);
                    shell.Open(path); // This opens in a focused Explorer window
                    WriteLine(path);
                }
                else if (OperatingSystem.IsMacOS())
                {
                    Process.Start("open", path);
                }
                return Status.Ok.ToInt() ;
            }
            catch (Exception ex)
            {
                ForegroundColor = ConsoleColor.Red;
                WriteLine(ex.Message);
                return Status.ServerError.ToInt();
            }
        }

        [Route(HttpVerbs.Get, "/version")]
        public string GetVersion()
        {
            return "1.0.0";
        }
    }
}
