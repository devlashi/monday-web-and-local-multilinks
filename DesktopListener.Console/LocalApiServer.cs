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
        
        public static int Port { get; private set; }
        public static string? UniqueCode { get; set; }

        public static WebServer Create()
        {
            (UniqueCode, Port) = SecurityHelper.GetUniqueCodeAndPort();
            return new WebServer(o => o
                    .WithUrlPrefix($"http://localhost:{Port}")
                    .WithMode(HttpListenerMode.EmbedIO))
                .WithModule(new MondayCorsModule("/api"))
                .WithWebApi("/api", m => m.WithController<LocalApiController>())
                .WithLocalSessionManager();
        }
    }
}
