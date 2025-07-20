using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DesktopListener.CLI
{
    public static class LogsService
    {
        private static readonly object _lock = new();
        private static readonly List<LogText> _logs = [];

        public static IReadOnlyList<LogText> Logs
        {
            get
            {
                lock (_lock)
                    return _logs.ToList(); // Return a copy to avoid external mutation
            }
        }

        public static event Action? OnLogAdded;

        public static void Add(string message, bool isWarning = false)
        {
            lock (_lock)
            {
                _logs.Add(new LogText
                {
                    Message = $"{DateTime.Now:T} - {message}",
                    IsWarning = isWarning
                });

                if (_logs.Count > 1000)
                    _logs.RemoveAt(0);
            }

            OnLogAdded?.Invoke(); // Invoke outside the lock to avoid deadlocks
        }
    }

    public class LogText
    {
        public string? Message { get; set; }
        public bool IsWarning { get; set; } = false;
    }
}
