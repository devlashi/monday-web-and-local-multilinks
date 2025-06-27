// See https://aka.ms/new-console-template for more information
using EmbedIO.Actions;
using EmbedIO.Routing;
using EmbedIO.WebApi;
using EmbedIO;
using Swan.Logging;
using DesktopListener.CLI;

class Program
{
    static async Task Main(string[] args)
    {
        // Disable EmbedIO logging
        Logger.NoLogging();

        using (var server = LocalApiServer.Create())
        {
            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("Listening for monday.com link clicks...");
            Console.WriteLine("Minimize this window and enjoy your workflow!");
            Console.ResetColor();
            await server.RunAsync(); // runs until app closes
        }
    }


}

