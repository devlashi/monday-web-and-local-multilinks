using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.PortableExecutable;
using System.Text;
using System.Threading.Tasks;

namespace DesktopListener.CLI
{
    public class FolderDto:FileFolderBaseDto
    {
        public FolderDto(string name, string path):base(name, path) { 
            IsFile = false; 
        }
        public FolderDto():this(string.Empty, string.Empty){}

        public void AddFiles(FileInfo[] files)
        {
            foreach (var file in files)
            {
                var fileDto = new FileDto(file.Name, file.FullName);
                Files.Add(fileDto);
            }
        }

        public void AddFolders(DirectoryInfo[] folders)
        {
            foreach(var folder in folders)
            {
                var folderDto = new FolderDto(folder.Name, folder.FullName);
                Folders.Add(folderDto);
            }
        }

        public bool IsImaginaryFolder { get; set; } = false;
        public List<string> PathSegments { get; set; } = [];
        public List<FileDto> Files { get; set; } = [];
        public List<FolderDto> Folders { get; set; } = [];

    }
}
