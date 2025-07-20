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
using DesktopListener.CLI.Dtos;
using System.IO;

namespace DesktopListener.CLI
{
    public class LocalApiController : WebApiController
    {
        

        [Route(HttpVerbs.Get, "/open/{path}")]

        public int Open(string path, [QueryField] bool openParentFolder)
        {
            try
            {
                var origin = HttpContext.Request.Headers["Origin"];
                var bearer = HttpContext.Request.Headers["bearer"];

                if (string.IsNullOrEmpty(origin) || !origin.EndsWith("monday.app"))
                {
                    Console.ForegroundColor = ConsoleColor.Red;
                    Console.WriteLine($"Request denied: not coming from a valid Monday context. [{DateTime.Now:G}]");
                    LogsService.Add("Request denied: not coming from a valid Monday context.", true);
                    Console.ResetColor();
                    return Status.AccessDeniedForNonMondayContext.ToInt();
                }

                if (!string.Equals(bearer, LocalApiServer.UniqueCode))
                {
                    Console.ForegroundColor = ConsoleColor.Yellow;
                    Console.WriteLine($"The code saved in the Monday app is different from the local code: {LocalApiServer.UniqueCode}");
                    LogsService.Add($"The code saved in the Monday app is different from the local code: {LocalApiServer.UniqueCode}", true);
                    Console.ResetColor();
                    return Status.AccessDeniedForIncorrectCode.ToInt();
                }

                path = WebUtility.UrlDecode(path);
                if (path.StartsWith("file://", StringComparison.OrdinalIgnoreCase))
                {
                    var uri = new Uri(path);
                    path = uri.LocalPath;  // converts file:/// URL to local path
                }

                if (!File.Exists(path) && !Directory.Exists(path))
                {
                    Console.WriteLine($"{path} not found!");
                    LogsService.Add($"{path} not found!", true);
                    return Status.FileFolderNotFound.ToInt();
                }

                if (SecurityHelper.IsSafeToOpen(path))
                {
                    LogsService.Add($"{path} opening blocked.", true);
                    return Status.NotAuthorizedFileOrDirectory.ToInt();
                }

                if (openParentFolder)
                {
                    Console.WriteLine($"Opening the parent directory of {path}");
                    LogsService.Add($"Opening the parent directory of {path}");
                }

                else
                {
                    Console.WriteLine($"Opening {path}");
                    LogsService.Add($"Opening the parent directory of {path}");
                }

                if (openParentFolder)
                {
                    if (OperatingSystem.IsWindows())
                    {
                        // Select file/folder in Explorer
                        Process.Start("explorer", $"/select,\"{path}\"");
                    }
                    else if (OperatingSystem.IsMacOS())
                    {
                        // Reveal file/folder in Finder
                        Process.Start("open", $"-R \"{path}\"");
                    }
                }
                else
                {

                    if (OperatingSystem.IsWindows())
                    {
                        if (File.Exists(path))
                        {
                            Process.Start(new ProcessStartInfo(path) { UseShellExecute = true });
                        }
                        else if (Directory.Exists(path))
                        {
                            Process.Start("explorer", $"\"{path}\"");
                        }
                    }
                    else if (OperatingSystem.IsMacOS())
                    {
                        if (File.Exists(path))
                        {
                            Process.Start("open", $"\"{path}\"");
                        }
                        else if (Directory.Exists(path))
                        {
                            Process.Start("open", $"\"{path}\"");
                        }
                    }
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
                LogsService.Add($"Request denied: not coming from a valid Monday context.",true);
                Console.ResetColor();
                return Status.AccessDeniedForNonMondayContext.ToString();
            }
            return "1.0.0";
        }

        //[Route(HttpVerbs.Get,"/spec-folders")]
        //public FolderDto GetSpecialFolders()
        //{
        //    var imaginaryFolderWithSpecialFolders = new FolderDto() {
        //        IsImaginaryFolder = true
        //    };

        //    var desktop = Environment.GetFolderPath(Environment.SpecialFolder.Desktop);
        //    var documents = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
        //    var pictures = Environment.GetFolderPath(Environment.SpecialFolder.MyPictures);
        //    var videos = Environment.GetFolderPath(Environment.SpecialFolder.MyVideos);

        //    imaginaryFolderWithSpecialFolders.Folders.Add(new FolderDto(Path.GetFileName(desktop)!, desktop));
        //    imaginaryFolderWithSpecialFolders.Folders.Add(new FolderDto(Path.GetFileName(documents)!, documents));
        //    imaginaryFolderWithSpecialFolders.Folders.Add(new (Path.GetFileName(pictures)!, pictures));
        //    imaginaryFolderWithSpecialFolders.Folders.Add(new (Path.GetFileName(videos)!, videos));

        //    return imaginaryFolderWithSpecialFolders;
        //}

        //[Route(HttpVerbs.Post, "/open-folder")]
        //public FolderDto OpenFolder([JsonData]FolderDto folderDto)
        //{
        //    try
        //    {
        //        DirectoryInfo directory = new DirectoryInfo(folderDto.FolderPath);
        //        var files = directory.GetFiles()
        //            .Where(f => (f.Attributes & (FileAttributes.System)) == 0)
        //            .ToArray();
        //        var folders = directory.GetDirectories();

        //        folderDto.AddFolders(folders);
        //        folderDto.AddFiles(files);

        //        folderDto.PopulatePathSegments();
        //        Console.WriteLine($"requested data {folderDto.FolderPath}");
        //        LogsService.Add($"requested data {folderDto.FolderPath}");
        //        return folderDto;
        //    }
        //    catch (Exception ex) {

        //        Console.ForegroundColor = ConsoleColor.Red;
        //        Console.Write("Error - Cannot open folder :");
        //        LogsService.Add($"Error - Cannot open folder : {ex.Message}",true);
        //        Console.WriteLine(ex.Message);
        //        Console.ResetColor();
        //        return new FolderDto();
        //    }
            
        //}
    }
}
