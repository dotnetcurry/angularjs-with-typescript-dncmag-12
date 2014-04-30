using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using OneStopTechVids.Model;

namespace OneStopTechVids.WebAPI
{
    public class CategoriesController : ApiController
    {
        // GET api/<controller>
        public IEnumerable<Category> Get()
        {
            return TechVideosData.Categories;
        }

    }
}