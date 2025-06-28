using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using EmbedIO;
using EmbedIO.WebApi;
using System.Text.Json;

namespace DesktopListener.CLI
{
    public class LocalApiServer
    {
        public static readonly int port = 61234;
        public static string? UniqueCode { get; set; }

        public static WebServer Create()
        {
            UniqueCode = GetUniqueCode();
            return new WebServer(o => o
                    .WithUrlPrefix($"http://localhost:{port}")
                    .WithMode(HttpListenerMode.EmbedIO))
                .WithModule(new MondayCorsModule("/api"))
                .WithWebApi("/api", m => m.WithController<LocalApiController>())
                .WithLocalSessionManager();
        }

        private static string GetUniqueCode()
        {
            string appDataPath = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
            string appFolder = Path.Combine(appDataPath, "MondayMultiLinks");
            Directory.CreateDirectory(appFolder);

            string filePath = Path.Combine(appFolder, "config.json");

            // If config file exists, read and return the code
            if (File.Exists(filePath))
            {
                try
                {
                    string json = File.ReadAllText(filePath);
                    var config = JsonSerializer.Deserialize<MachineIdentity>(json);
                    if (config != null && !string.IsNullOrEmpty(config.UniqueCode))
                        return config.UniqueCode!;
                }
                catch (Exception e)
                {
                    Console.ForegroundColor = ConsoleColor.Red;
                    Console.WriteLine(e.Message);
                    Console.ResetColor();
                }
            }

            // Generate a new unique code
            var newCode = Guid.NewGuid().ToString();// You can adjust the range
            var newConfig = new MachineIdentity { UniqueCode = newCode };

            string newJson = JsonSerializer.Serialize(newConfig, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(filePath, newJson);

            return newCode;
        }

    }
}
