/***********************************************************************
create-extended-events.sql  --  SQL Server query profiling.
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
Purpose:
  Extended Events has a highly scalable and highly configurable architecture 
that allows users to collect as much or as little information as is necessary 
to troubleshoot or identify a performance problem.

 This script serves to apply an extended events session trace to show rpc
events, tsql events and errors for use in ArcGIS applications.  Also includes 
a histogram allowing for grouping of events for filtering or querying.


:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
History:
Ken Galliher        12/01/2015               Original coding.
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
Versions Supported:
EGDB: All
DBMS: SQL Server
DBMS Version: SQL Server 2012 and above
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
Tags:
SQL Server Extended Events, SQL trace
:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
Resources:
Extended Events:
https://msdn.microsoft.com/en-us/library/bb630282(v=sql.110).aspx

Histogram Target:
https://msdn.microsoft.com/en-us/library/ff878023.aspx

View Event Session Data:
https://msdn.microsoft.com/en-us/library/hh710068(v=sql.110).aspx
***********************************************************************/


CREATE EVENT SESSION [arcgis_events] ON SERVER 
ADD EVENT sqlserver.error_reported(
    ACTION(package0.last_error,package0.process_id,sqlserver.database_name,sqlserver.nt_username,sqlserver.sql_text,sqlserver.tsql_stack)),
ADD EVENT sqlserver.errorlog_written(
    ACTION(package0.last_error,package0.process_id,sqlserver.database_name,sqlserver.nt_username,sqlserver.sql_text,sqlserver.tsql_stack)),
ADD EVENT sqlserver.exec_prepared_sql(
    ACTION(package0.event_sequence,sqlserver.query_hash,sqlserver.query_plan_hash,sqlserver.session_id,sqlserver.sql_text)
    WHERE ([sqlserver].[is_system]=(0))),
ADD EVENT sqlserver.prepare_sql(
    ACTION(package0.last_error,sqlserver.query_hash,sqlserver.query_plan_hash,sqlserver.sql_text,sqlserver.tsql_stack)),
ADD EVENT sqlserver.rpc_completed(SET collect_data_stream=(1),collect_output_parameters=(1),collect_statement=(1)
    ACTION(package0.event_sequence,sqlserver.query_hash,sqlserver.query_plan_hash,sqlserver.session_id,sqlserver.sql_text)),
ADD EVENT sqlserver.rpc_starting(
    ACTION(package0.event_sequence,sqlserver.query_hash,sqlserver.query_plan_hash,sqlserver.session_id,sqlserver.sql_text)),
ADD EVENT sqlserver.sql_batch_completed(
    ACTION(package0.last_error,sqlserver.query_hash,sqlserver.query_plan_hash,sqlserver.sql_text,sqlserver.tsql_stack)),
ADD EVENT sqlserver.sql_statement_completed(
    ACTION(package0.event_sequence,sqlserver.query_hash,sqlserver.query_plan_hash,sqlserver.session_id,sqlserver.sql_text)),
ADD EVENT sqlserver.sql_transaction(
    ACTION(package0.last_error,sqlserver.plan_handle,sqlserver.query_hash,sqlserver.query_plan_hash,sqlserver.sql_text,sqlserver.tsql_stack)),
ADD EVENT sqlserver.uncached_sql_batch_statistics(
    ACTION(package0.last_error,sqlserver.query_hash,sqlserver.query_plan_hash,sqlserver.sql_text,sqlserver.tsql_stack)) 
ADD TARGET package0.event_file(SET filename=N'<path\where\you\want\to\store\the\>arcgis_events.xel',max_file_size=(100)),
ADD TARGET package0.histogram(SET filtering_event_name=N'sqlserver.rpc_completed',source=N'sqlserver.sql_text')
WITH (MAX_MEMORY=4096 KB,EVENT_RETENTION_MODE=ALLOW_SINGLE_EVENT_LOSS,MAX_DISPATCH_LATENCY=30 SECONDS,MAX_EVENT_SIZE=0 KB,MEMORY_PARTITION_MODE=NONE,TRACK_CAUSALITY=OFF,STARTUP_STATE=ON)
GO


