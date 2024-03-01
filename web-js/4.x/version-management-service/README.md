VersionManagementService

About
This sample demonstrates how to work with the FeatureService and VersionManagementService classes to facilitate branch versioning workflows. The provided capabilities cover the following functionalities:

- Alter a Version: Modify the version owner, update the description, and change the version name.
- Switch to a Different Version: Change the active version.
- Create a New Version: Generate a new version using specified parameters, including the version name, description (optional), and access (optional).
- Delete an Existing Version: Remove a specified version.
- Get the Current Client Lock Type: Retrieve the lock type on a given version.
- Get the versionIdentifier: Obtain version information based on GUID or name.
- Get version infos: Retrieve information about a version or versions.If no parameters are passed, all versions will be returned.
- Get extended information: Obtain additional details about a specific version.

How It Works
Select a button to choose a capability from the options described above, and the corresponding response will be displayed in the console.

Using the VersionManagementService

1. Construct a VersionManagementService instance using the URL to a version management service.
   a. Replace the URL with your version management service URL.

const versionManagementService = new VersionManagementService({
url: "https://sampleserver7.arcgisonline.com/server/rest/services/DamageAssessment/VersionManagementServer",
});

2. The interface includes a series of buttons along the bottom of the screen. Each button corresponds to one of the supported methods described above in the VersionManagementService class.

Related Documentation
• https://developers.arcgis.com/javascript/latest/api-reference/esri-versionManagement-VersionManagementService.html

Live Sample
