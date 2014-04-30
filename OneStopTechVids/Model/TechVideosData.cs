using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace OneStopTechVids.Model
{
    public class TechVideo
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public int Category { get; set; }
        public string Description { get; set; }
        public int Rating { get; set; }
    }

    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }

    public class TechVideosData
    {
        public static List<TechVideo> TechVideos;
        public static List<Category> Categories; 

        static TechVideosData()
        {
            Categories=new List<Category>()
            {
                new Category(){Id=1, Name="JavaScript"},
                new Category(){Id=2,Name="ASP.NET"},
                new Category(){Id=3,Name="C#"},
                new Category(){Id=4,Name="HTML"},
                new Category(){Id=5,Name="CSS"},
                new Category(){Id=6,Name="Patterns and Practices"}
            };

            TechVideos=new List<TechVideo>()
            {
                new TechVideo(){Id=1, Title = "JavaScript Patterns",Author="Ravi", Category=1, Description="Takes a close look at most of the common patterns in JavaScript", Rating=4},
                new TechVideo(){Id=2, Title = "AngularJS Fundamentals",Author="Suprotim", Category=1, Description="Teaches basics of Angular JS. Introduces the framework and dives into the concepts around.", Rating=4},
                new TechVideo(){Id=3, Title = "TypeScript Basics",Author="Sumit", Category=1, Description="A beginner level course on TypeScript. Walks through basic constructs and language features", Rating=4},
                new TechVideo(){Id=4, Title = "ASP.NET MVC Fundamentals",Author="Suprotim", Category=2, Description="New to MVC? No problem, Suprotim helps beginners to start with and get upto speed in this course", Rating=4},
                new TechVideo(){Id=5, Title = "ASP.NET Web Forms 4.5",Author="Sumit", Category=2, Description="Explores all the new features added to ASP.NET Web forms in version 4.5 and demonstrates each", Rating=4},
                new TechVideo(){Id=6, Title = "ASP.NET Web API",Author="Ravi", Category=2, Description="In this course, Ravi shows how easy it is to create HTTP based Web APIs using ASP.NET Web API", Rating=4},
                new TechVideo(){Id=7, Title = "C# 4 new Features",Author="Ravi", Category=3, Description="C# 3 was released with a bunch of innovations. This course familiarizes you with each of them", Rating=4},
                new TechVideo(){Id=8, Title = "C# 5 new features",Author="Suprotim", Category=3, Description="Microsoft has added some cool productive features to C# 5. Master them all in this course.", Rating=4},
                new TechVideo(){Id=9, Title = "LINQ Fundamentals",Author="Suprotim", Category=3, Description="Learn how to write queries against collections in C# and forget writing loops for such operations", Rating=4},
                new TechVideo(){Id=10, Title = "HTML Basics",Author="Sumit", Category=4, Description="HTML is the language of the browser. This course teaches you how to get started and write simple sites using HTML", Rating=4},
                new TechVideo(){Id=11, Title = "HTML5 from Beginners to Advanced",Author="Sumit", Category=4, Description="HTML5 keeps on evolving. This course helps you to keep yourself updated with the latest releases and browser support", Rating=4},
                new TechVideo(){Id=12, Title = "Windows store apps using HTML5",Author="Sumit", Category=4, Description="Explains internals of Windows Store apps and shows how ro create them using HTML5 and JavaScript", Rating=4},
                new TechVideo(){Id=13, Title = "CSS: A guide for beginners",Author="Ravi", Category=5, Description="As developers we keep ourselves away from CSS. This course teaches you basics of CSS and shows how to apply it on HTML pages to make them look better", Rating=4},
                new TechVideo(){Id=14, Title = "End-to-end CSS3",Author="Suprotim", Category=5, Description="Shows all new features of CSS3 with practical examples. Introduces the concept of responsive design as well", Rating=4},
                new TechVideo(){Id=15, Title = "Responsive design using CSS3",Author="Ravi", Category=5, Description="This course has everything that you need to know to create a site that looks good on any kind of device", Rating=4},
                new TechVideo(){Id=16, Title = "Design patterns for Daily use",Author="Sumit", Category=6, Description="Sumit walks through all common design patterns and demonstrates how to use them in your projects", Rating=4},
                new TechVideo(){Id=17, Title = "Getting started with Unit Testing",Author="Ravi", Category=6, Description="Unit testing is a must learn skill for any developer. This course introduces you to Unit testing and TDD", Rating=4},
                new TechVideo(){Id=18, Title = "10 techniques to refactor spaghetti",Author="Ravi", Category=6, Description="Explains 10 different types of problems with refactoring that we usually face while writing code and how to refactor them", Rating=4}
            };
        }
    }
}