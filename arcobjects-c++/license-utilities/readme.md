# License Utiltiies
## Use Case
These are the utilities present in most samples to get the tools licensed.  These are also frequently cited in other ESRI Samples.

## Instructions
In order to use these utilities, include them with your project:
```cpp
#include "LicenseUtilities.h"
```
Then, in order to initialize your application, before any ArcObjects calls are made, add this line to the beginning of your file:
```cpp
if (!InitializeApp())
	{
		AoExit(0);
	}
```
