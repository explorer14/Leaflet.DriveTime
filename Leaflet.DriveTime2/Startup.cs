using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Leaflet.DriveTime2.Startup))]
namespace Leaflet.DriveTime2
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
