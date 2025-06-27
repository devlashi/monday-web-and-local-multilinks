using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EmbedIO;
using EmbedIO.Cors;

namespace DesktopListener.CLI
{
    public class MondayCorsModule : CorsModule
    {
        public MondayCorsModule(string baseRoute, string origins = "*", string headers = "*", string methods = "*") : base(baseRoute, origins, headers, methods)
        {

        }
    }
}
