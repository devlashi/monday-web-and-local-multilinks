using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DesktopListener.CLI;

namespace DesktopApp.Services
{
    public class LocalApiService
    {
        public string? Code { get; private set; }

        public async Task StartAsync()
        {
            var server = LocalApiServer.Create();
            Code = $"{LocalApiServer.UniqueCode}-{LocalApiServer.Port}";

            TextCopy.ClipboardService.SetText(Code);

            // Keep the server running in the background
            await server.RunAsync();
        }
    }
}
