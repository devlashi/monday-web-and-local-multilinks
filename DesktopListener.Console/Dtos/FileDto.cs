using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DesktopListener.CLI.Dtos
{
    public class FileDto : FileFolderBaseDto
    {
        public FileDto(string name, string path) : base(name, path)
        {

            IsFile = true;
        }

        public FileDto() : this(string.Empty, string.Empty) { }
    }
}
