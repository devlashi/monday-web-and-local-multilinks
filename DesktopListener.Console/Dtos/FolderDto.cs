using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.PortableExecutable;
using System.Text;
using System.Threading.Tasks;
using EmbedIO.Utilities;
using System.IO;

namespace DesktopListener.CLI.Dtos
{
    public class FolderDto : FileFolderBaseDto
    {
        public FolderDto(string name, string path) : base(name, path)
        {
            IsFile = false;
        }
        public FolderDto() : this(string.Empty, string.Empty) { }

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
            foreach (var folder in folders)
            {
                var folderDto = new FolderDto(folder.Name, folder.FullName);
                Folders.Add(folderDto);
            }
        }

        public void PopulatePathSegments()
        {
            string root = Path.GetPathRoot(FolderPath)!;
            string current = root.TrimEnd(Path.DirectorySeparatorChar);

            PathSegments.Add(new FolderDto(root.TrimEnd('\\', '/'), root));
     
            // Get the rest of the path segments
            var relativePath = FolderPath.Substring(root.Length);
            var parts = relativePath.Split(Path.DirectorySeparatorChar, StringSplitOptions.RemoveEmptyEntries);

            foreach (var part in parts)
            {
                current = Path.Combine(current, part);
                PathSegments.Add(new FolderDto(part,current));
            }
        }

        public bool IsImaginaryFolder { get; set; } = false;
        public List<FolderDto> PathSegments { get; set; } = [];
        public List<FileDto> Files { get; set; } = [];
        public List<FolderDto> Folders { get; set; } = [];

    }
}
