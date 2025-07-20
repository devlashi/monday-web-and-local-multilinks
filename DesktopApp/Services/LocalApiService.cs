using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DesktopListener.CLI;
using EmbedIO;

namespace DesktopApp.Services
{
    public class LocalApiService
    {
        public string? Code { get; private set; }
        private WebServer? Server { get;  set; }

        public async Task StartAsync()
        {
            Server = LocalApiServer.Create();
            Code = $"{LocalApiServer.UniqueCode}-{LocalApiServer.Port}";

            TextCopy.ClipboardService.SetText(Code);

            // Keep the server running in the background
            await Server.RunAsync();
        }

        public void StopServer()
        {
            Server?.Dispose();
        }
    }
}
