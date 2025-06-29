using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DesktopListener.CLI
{
    public class FileFolderBaseDto(string name, string path)
    {
        public string Name { get; set; } = name;
        public string Path { get; set; } = path;
        public bool IsFile { get; protected set; }
    }
}
