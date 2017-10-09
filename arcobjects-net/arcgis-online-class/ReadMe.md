# ArcGIS Online Class
## What is this?
This is a class file that is created using JSON.NET to go out and interact with ArcGIS Online.  This would be a pure C# implementation for interacting with ArcGIS Online and does not require any ESRI Assemblies.  The ArcGIS Online class does have some gaps in the REST Endpoints that it covers but it does provide a good base for others to build on.
ArcObjects is not required to use this class file.

## What is required to run this script?
* A C# Compiler with the Windows libraries
* [JSON.NET](http://www.newtonsoft.com/json) assemblies

## Sample syntax
This is a class file so you would import it into another C# project to run.  Below is an example of it running in a console application to display a valid ArcGIS Online Token for a user.
```csharp
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AGOL;

namespace ConsoleApplication1
{
    class Program
    {
        static void Main(string[] args)
        {
            AGOL.AGOL agol = new AGOL.AGOL("username", "password");
            Console.WriteLine(agol.Token);
            string creditInfo = String.Format("Our organization currently has {0} credits available",
                agol.orgInfo.availableCredits);
            Console.WriteLine(creditInfo);
            Console.WriteLine(string.Format("{0} active users are in our organization",agol.users.total));
            Console.ReadKey();
        }
    }
}

```

## Use Case
The users would like to automate workflows or use the JSON recieved from ArcGIS Online to build their own desktop applications without using ArcGIS Runtime.
