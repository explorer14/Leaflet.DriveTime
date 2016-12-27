using System.Web;
using System.Web.Mvc;

namespace Leaflet.DriveTime2
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
