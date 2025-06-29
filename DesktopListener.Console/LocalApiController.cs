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
using System.Text.Json;

namespace DesktopListener.CLI
{
    public class LocalApiController : WebApiController
    {

        [Route(HttpVerbs.Get, "/open/{path}")]

        public int Open(string path, [QueryField] string? code)
        {
            try
            {
                var origin = HttpContext.Request.Headers["Origin"];
                var bearer = HttpContext.Request.Headers["bearer"];

                if (string.IsNullOrEmpty(origin) || !origin.EndsWith("monday.app"))
                {
                    Console.ForegroundColor = ConsoleColor.Red;
                    Console.WriteLine($"Request denied: not coming from a valid Monday context. [{DateTime.Now:G}]");
                    Console.ResetColor();
                    return Status.AccessDeniedForNonMondayContext.ToInt();
                }

                if (!string.Equals(bearer, LocalApiServer.UniqueCode))
                {
                    Console.ForegroundColor = ConsoleColor.Yellow;
                    Console.WriteLine($"The code saved in the Monday app is different from the local code: {LocalApiServer.UniqueCode}");
                    Console.ResetColor();
                    return Status.AccessDeniedForIncorrectCode.ToInt();
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
                return Status.Success.ToInt();
            }
            catch (Exception ex)
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine(ex.Message);
                Console.ResetColor();
                return Status.ServerError.ToInt();
            }
        }

        [Route(HttpVerbs.Get, "/version")]
        public string GetVersion()
        {
            var origin = HttpContext.Request.Headers["Origin"];
            if (string.IsNullOrEmpty(origin) || !origin.EndsWith("monday.app"))
            {
                Console.ForegroundColor = ConsoleColor.Red;
                Console.WriteLine($"Request denied: not coming from a valid Monday context. [{DateTime.Now:G}]");
                Console.ResetColor();
                return Status.AccessDeniedForNonMondayContext.ToString();
            }
            return "1.0.0";
        }

        [Route(HttpVerbs.Get,"/spec-folders")]
        public FolderDto GetSpecialFolders()
        {
            var imaginaryFolderWithSpecialFolders = new FolderDto() {
                IsImaginaryFolder = true
            };

            var desktop = Environment.GetFolderPath(Environment.SpecialFolder.Desktop);
            var documents = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
            var pictures = Environment.GetFolderPath(Environment.SpecialFolder.MyPictures);
            var videos = Environment.GetFolderPath(Environment.SpecialFolder.MyVideos);

            imaginaryFolderWithSpecialFolders.Folders.Add(new FolderDto(Path.GetFileName(desktop)!, desktop));
            imaginaryFolderWithSpecialFolders.Folders.Add(new FolderDto(Path.GetFileName(documents)!, documents));
            imaginaryFolderWithSpecialFolders.Folders.Add(new (Path.GetFileName(pictures)!, pictures));
            imaginaryFolderWithSpecialFolders.Folders.Add(new (Path.GetFileName(videos)!, videos));

            return imaginaryFolderWithSpecialFolders;
        }

        [Route(HttpVerbs.Post, "/open-folder")]
        public FolderDto OpenFolder([JsonData]FolderDto folderDto)
        {
            DirectoryInfo directory = new DirectoryInfo(folderDto.Path);
            var files= directory.GetFiles()
                .Where(f => (f.Attributes & (FileAttributes.System)) == 0)
                .ToArray();
            var folders =directory.GetDirectories();

            folderDto.AddFolders(folders);
            folderDto.AddFiles(files);

            

            return folderDto;
        }
    }
}
