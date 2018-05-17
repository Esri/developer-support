## ArcGIS Pro Database Connection Tester

This AddIn allows one to test multiple enterprise geodatabase connections with ArcGIS Pro for performance testing.  A simple timer records the amount of time spent connecting.

- Gets around Pro's inability to disconnect databases. ENH-000084097.
- Opens and closes a geodatabase and records the time it took to do so.
- Automatically disconnects the database.
- Will activate SDE Intercepts and DBMS tracing.
- Opens any SDE connection file (.sde).

```c#
QueuedTask.Run(() =>
{
    var start = DateTime.Now.ToLocalTime();
    using (Geodatabase geodatabase = new Geodatabase(new DatabaseConnectionFile(new Uri(GdbPath))))
    {
        var end = DateTime.Now.ToLocalTime();
        TimeSpan diff = end.Subtract(start);
        var connectionFileName = GdbPath.Substring(GdbPath.LastIndexOf(@"\") + 1);
        uiContext.Send(x => _connectionTimes.Add(
            new ConnInfo { Connection = connectionFileName, Time = diff }), null);
        geodatabase.Dispose();
    }
}
```

- The AddIn should display any errors that occurred during the connection
- The AddIn automatically disconnects from the database.
