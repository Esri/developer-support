# Socrata provider SODA3 API

This sample provider interfaces with publicly available data on open data websites such as `data.lacity.org` and integrates it with ArcGIS Enterprise.

This sample extends the Socrata Provider sample that uses the SODA2 API to use the SODA3 API, which returns more than 1000 records but requires authentication.

Sources that provide Socrata endpoints such as `data.lacity.org` are compatible.

## Register and create a Socrata Account to obtain API Key and Secret

1. Click on the sign in/log in button and follow the prompts to create your account.
2. Once the account is created, click your name in the top right corner and select Developer Settings.
3. Click the blue button to create a new API key.
4. This will give you an API Key and API Secret. Both will be used as a pseudo username/password to access the authenticated SODA3 endpoint.

## Set up the Provider

1. Run `cdf createapp socrata-app` to create a new custom data app (or use an existing one).
2. Run `cdf createprovider socrata-provider` to create a custom data provider.
3. Navigate to `providers/socrata-provider` and run:
   `npm install config lodash`
4. Copy the contents of the `src` folder into `providers/socrata-provider/src`.

## Configure Provider

1. In `providers/socrata-provider/cdconfig.json`, set:
   - `properties.hosts = true`
   - `properties.disableIdParam = false`
2. In `providers/socrata-provider/src/model.js`, add your API Key and API Secret to the request headers.

## Test the Provider

1. Navigate to the `socrata-app` directory and run:
   `npm start`
2. Open a browser and go to:
   `http://localhost:8080/socrata-provider/rest/services/data.lacity.org/fdwe-pgcu/FeatureServer/0/query`
3. Verify that data is returned.

## Build and Deploy the Custom Data Provider

1. Stop the custom data app.
2. Navigate to the app directory.
3. Run:
   `cdf export socrata-provider`
4. Open the ArcGIS Server Administrator Directory.
5. Go to **uploads > upload** and upload the `.cdpk` file.
6. Copy the uploaded item ID.
7. Go to **services > types > customdataproviders**.
8. Click **register** and paste the item ID.
9. Click **Register**.

## Create Feature Service

1. Go to **services > createService**.
2. Paste the following JSON:

```json
{
  "serviceName": "LosAngelesProperties",
  "type": "FeatureServer",
  "description": "",
  "capabilities": "Query",
  "provider": "CUSTOMDATA",
  "clusterName": "default",
  "minInstancesPerNode": 0,
  "maxInstancesPerNode": 0,
  "instancesPerContainer": 1,
  "maxWaitTime": 60,
  "maxStartupTime": 300,
  "maxIdleTime": 1800,
  "maxUsageTime": 600,
  "loadBalancing": "ROUND_ROBIN",
  "isolationLevel": "HIGH",
  "configuredState": "STARTED",
  "recycleInterval": 24,
  "recycleStartTime": "00:00",
  "keepAliveInterval": 1800,
  "private": false,
  "isDefault": false,
  "maxUploadFileSize": 0,
  "allowedUploadFileTypes": "",
  "properties": {
    "disableCaching": "true"
  },
  "jsonProperties": {
    "customDataProviderInfo": {
      "dataProviderName": "socrata-provider",
      "dataProviderHost": "data.lacity.org",
      "dataProviderId": "fdwe-pgcu"
    }
  },
  "extensions": [],
  "frameworkProperties": {},
  "datasets": []
}
```

3. Click **Create**.

## Consume Feature Service

Access your service at:

`https://<domain_or_machine_name>/<webadaptor_name>/rest/services/LosAngelesProperties/FeatureServer`

You can use this URL in:
- ArcGIS Pro
- ArcGIS Online
- ArcGIS Enterprise
