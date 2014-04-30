using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using OneStopTechVids.Model;

namespace OneStopTechVids.WebAPI
{
    //[RoutePrefix("/api/techVideos")]
    public class TechVideosController : ApiController
    {
        // GET api/<controller>
        public IHttpActionResult Get()
        {
            var videos = TechVideosData.TechVideos;
            return Ok(videos);
        }

        // GET api/<controller>/5
        public IHttpActionResult Get(string title)
        {
            var video = TechVideosData.TechVideos.FirstOrDefault(tv => tv.Title.Equals(title, StringComparison.InvariantCultureIgnoreCase));
            if (video != null)
            {
                return Ok(false);
            }
            else
            {
                return Ok(true);
            }
        }

        // POST api/<controller>
        public IHttpActionResult Post([FromBody]TechVideo value)
        {
            var maxId = TechVideosData.TechVideos.Max(vid => vid.Id);
            value.Id = maxId + 1;

            TechVideosData.TechVideos.Add(value);
            return Ok(value);
        }

        // PUT api/<controller>/5
        public IHttpActionResult Put(int id, [FromBody]TechVideo value)
        {
            for (int counter = 0; counter < TechVideosData.TechVideos.Count; counter++)
            {
                if (TechVideosData.TechVideos[counter].Id == id)
                {
                    TechVideosData.TechVideos[counter] = value;
                    return Ok();
                }
            }

            return NotFound();
        }

        public IHttpActionResult Patch(int id, [FromBody] TechVideo value)
        {
            for (int counter = 0; counter < TechVideosData.TechVideos.Count; counter++)
            {
                if (TechVideosData.TechVideos[counter].Id == id)
                {
                    TechVideosData.TechVideos[counter].Rating = value.Rating;
                    return Ok();
                }
            }

            return NotFound();
        }

        // DELETE api/<controller>/5
        public IHttpActionResult Delete(int id)
        {
            for (int counter = 0; counter < TechVideosData.TechVideos.Count; counter++)
            {
                if (TechVideosData.TechVideos[counter].Id == id)
                {
                    TechVideosData.TechVideos.RemoveAt(counter);
                    return Ok();
                }
            }

            return NotFound();
        }
    }
}