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
using DesktopListener.CLI.Dtos;

namespace DesktopListener.CLI
{
    public class LocalApiServer
    {
        private static readonly Random _random = new();
        public static int Port { get; private set; }
        public static string? UniqueCode { get; set; }

        public static WebServer Create()
        {
            (UniqueCode, Port) = GetUniqueCodeAndPort();
            return new WebServer(o => o
                    .WithUrlPrefix($"http://localhost:{Port}")
                    .WithMode(HttpListenerMode.EmbedIO))
                .WithModule(new MondayCorsModule("/api"))
                .WithWebApi("/api", m => m.WithController<LocalApiController>())
                .WithLocalSessionManager();
        }

        private static (string,int) GetUniqueCodeAndPort()
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
                        return (config.UniqueCode!,config.Port);
                }
                catch (Exception e)
                {
                    Console.ForegroundColor = ConsoleColor.Red;
                    Console.WriteLine(e.Message);
                    Console.ResetColor();
                }
            }

            // Generate a new unique code
            var newConfig = new MachineIdentity
            {
                UniqueCode = Guid.NewGuid().ToString(),
                Port = GetRandomPortNear61234(),
                UpdatedUtc = DateTime.UtcNow
            };


            string newJson = JsonSerializer.Serialize(newConfig, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(filePath, newJson);

            return (newConfig.UniqueCode,newConfig.Port);
        }

        public static int GetRandomPortNear61234()
        {
            return _random.Next(61000, 62000); // e.g., 61000 to 61999
        }

    }
}
