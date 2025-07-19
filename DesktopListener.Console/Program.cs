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
            Console.WriteLine(Text.text);
            var code = $"{LocalApiServer.UniqueCode}-{LocalApiServer.Port}";
            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("Listening for Monday.com link clicks...");
            Console.WriteLine();

            Console.WriteLine("Use the code below in your Monday app:");
            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine(code);
            Console.ResetColor();

            TextCopy.ClipboardService.SetText(code);

            Console.WriteLine();
            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine("The code has been copied to your clipboard.");

            Console.WriteLine();
            Console.WriteLine("You can now minimize this window and continue your workflow.");
            Console.ResetColor();
            Console.WriteLine();
            Console.WriteLine();
            await server.RunAsync(); // runs until app closes
        }
    }


}

