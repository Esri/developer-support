## SQL Server Versioning Statistics

Instructions provided describe how to report geodatabase versioning statistics in a SQL Server geodatabase. 
The SQL script provided below reports information about a versioned geodatabase in SQL Server. 
The output lists the number of versions, the number of versions blocking the DEFAULT version from being compressed to state 0 and the 
owner.names of the first 5 blocking versions, 
the number of states, 
the number of entries in the state_lineages table, 
and the number of rows in the versioned table and delta tables.

* Comparable to the script in Tech Article 000010358 however, not all scenarios have been tested. 

* This script should work well in normal SDE and DBO schema SQL Server geodatabases.  

* Change SDE schema to DBO manually in the script if necessary.  (CTL-H, "sde.", "dbo.").

* Output will be in the Messages tab in SSMS.

* Still working on Blocking Version logic.  Double check output with Version Administration window.

```
Sample output:
-------------
==========Versioning Statistics=================
 
Number of versions: 2   ==============
Number of versions blocking DEFAULT: 1
Blocking Versions: 
    dbo.QA
 
Number of states: 3577
Number of state lineages: 100015
Last Compress: 2018-01-09
 
Table:  DBO.CONTROLCORNER (45)
Adds Count:    124
Deletes Count: 124
 
Table:  DBO.PLSSBOUNDARY (46)
Adds Count:    8
Deletes Count: 8
--------------
```


```sql
SET NOCOUNT ON

/*
Uncomment this CREATE TABLE statement and the INSERT INTO statement
on line 150 and 151 to generate a permanent table containing adds and deletes counts.

create table delta_info
(
    id int identity(1,1),
    table_name nvarchar(100),
    registration_id int,
    adds int,
    deletes int
)

*/

DECLARE @versions_info_tab TABLE
(
    ver_info_state_id int,
    source_lin int,
    com_anc_id int,
    lin_name int,
    state_id int
)

DECLARE @blocking_list TABLE
(
    state_id int,
    name varchar(100)
)

DECLARE @delta_table_info TABLE
(
    a_table_name nvarchar(50),
    d_table_name nvarchar(50),
    a_table_count int,
    d_table_count int
)

DECLARE @ver_count int = (SELECT COUNT(*) FROM sde.SDE_versions)
DECLARE @state_count int = (SELECT COUNT(*) FROM sde.sde_states)
DECLARE @state_lineages_count int = (SELECT COUNT(*) cnt FROM sde.SDE_state_lineages)
DECLARE @last_compress DATE = (SELECT MAX(compress_start) FROM sde.SDE_compress_log)

DECLARE @ver_info_state_id int, @message varchar(100) = '', @source_lin int, 
        @com_anc_id int, @lin_name int, @state_id int, @ver_blocking int = 0,
        @cur_max_state int, @pos int, @idx int, @s1 int = 0, @s2 int = 0, @s3 
        int = 0, @s4 int = 0, @s5 int = 0, @blocking_ver_name nvarchar(100), 
        @blocking_ver_count int, @table_info_name varchar(100), @table_info_reg_id int,
        @table_info_owner varchar(100), @p_stmt nvarchar(200),@a_stmt nvarchar(max), 
        @d_stmt nvarchar(max), @row_count int

DECLARE table_info_cur CURSOR FOR
    SELECT owner, table_name, registration_id
    FROM sde.sde_table_registry
    WHERE sde.sde_table_registry.object_flags&8 = 8
        
DECLARE ver_list_cur CURSOR FOR
    SELECT DISTINCT state_id
      FROM sde.sde_versions
      WHERE name = 'DEFAULT' and owner IN ('SDE', 'DBO')
      ORDER BY state_id;

SELECT @state_id=state_id, @lin_name = lineage_name FROM sde.sde_states
WHERE state_id = (SELECT state_id FROM sde.sde_versions WHERE name = 'DEFAULT' and owner IN ('SDE', 'DBO'));

SET @cur_max_state = @state_id
PRINT '========== Versioning Statistics ================='
PRINT ''
PRINT 'Number of versions: ' + CONVERT(varchar, @ver_count)
PRINT '=============='
OPEN ver_list_cur
FETCH NEXT FROM ver_list_cur INTO @ver_info_state_id
    WHILE @@FETCH_STATUS = 0
    BEGIN
        SELECT @row_count = COUNT(*) FROM sde.sde_state_lineages WHERE lineage_name = @lin_name AND lineage_id <= @state_id
        SELECT @source_lin = lineage_name FROM sde.SDE_states where state_id = @ver_info_state_id
        ;WITH sel_max_lin_id AS 
        (
            SELECT lineage_id FROM sde.sde_state_lineages WHERE lineage_name = @lin_name AND lineage_id <= @state_id
            INTERSECT
            SELECT lineage_id FROM sde.sde_state_lineages WHERE lineage_name = @source_lin AND lineage_id <= @ver_info_state_id
        )
        SELECT @com_anc_id = (SELECT MAX(lineage_id) FROM sel_max_lin_id)

        INSERT INTO @versions_info_tab VALUES(@ver_info_state_id, @source_lin, @com_anc_id, @lin_name, @state_id);

    FETCH NEXT FROM ver_list_cur INTO @ver_info_state_id
    
    END;
CLOSE ver_list_cur

-- Generate table of blocking version names
;WITH get_block_ver AS
(
   SELECT owner+'.'+name as name, state_id FROM sde.sde_versions
       WHERE state_id NOT IN
           (SELECT DISTINCT lineage_id FROM sde.sde_state_lineages
                WHERE lineage_name IN
                 (SELECT DISTINCT lineage_name FROM sde.sde_state_lineages
                  WHERE lineage_id IN (SELECT ver_info_state_id FROM @versions_info_tab)  -- using only the values from the cursor which filters out the default version
              )
        )    
)

INSERT INTO @blocking_list
SELECT state_id, name FROM get_block_ver -- WHERE state_id < @ver_info_state_id -- AND name NOT LIKE '%SYNC%'

DECLARE blocking_ver_name_cur CURSOR FOR
    SELECT name FROM @blocking_list
SET @blocking_ver_count = (SELECT COUNT(*) FROM @blocking_list)

PRINT 'Number of versions blocking DEFAULT: ' + CONVERT(varchar, @blocking_ver_count)
PRINT 'Blocking Versions: '
OPEN blocking_ver_name_cur
FETCH NEXT FROM blocking_ver_name_cur INTO @blocking_ver_name
WHILE @@FETCH_STATUS = 0
    BEGIN
    

        PRINT '    ' + @blocking_ver_name
        FETCH NEXT FROM blocking_ver_name_cur INTO @blocking_ver_name
    END
CLOSE blocking_ver_name_cur
PRINT '=============='
PRINT ''
PRINT 'Number of states: ' + CONVERT(varchar, @state_count)
PRINT 'Number of state lineages: ' + CONVERT(varchar, @state_lineages_count)
PRINT 'Last Compress: ' + CONVERT(varchar, @last_compress)
PRINT ''

OPEN table_info_cur
FETCH NEXT FROM table_info_cur INTO @table_info_owner, @table_info_name, @table_info_reg_id
WHILE @@FETCH_STATUS = 0
    BEGIN
        DECLARE @a_count int, @d_count int
        PRINT 'Table:  ' + @table_info_owner + '.'+  @table_info_name + ' (' + CONVERT(varchar, @table_info_reg_id) + ')'
        SET @a_stmt = N'SELECT @a_count=COUNT(*) FROM ' + @table_info_owner + '.a' + CONVERT(varchar, @table_info_reg_id)
        EXEC sp_executesql @query = @a_stmt, @params = N'@a_count INT OUTPUT', @a_count = @a_count OUTPUT

        SET @d_stmt = N'SELECT @d_count=COUNT(*) FROM ' + @table_info_owner + '.D' + CONVERT(varchar, @table_info_reg_id)
        EXEC sp_executesql @query = @d_stmt, @params = N'@d_count INT OUTPUT', @d_count = @d_count OUTPUT

        INSERT INTO @delta_table_info VALUES 
        (
            @table_info_owner + '.a' + CONVERT(varchar, @table_info_reg_id),
            @table_info_owner + '.D' + CONVERT(varchar, @table_info_reg_id),
            @a_count,
            @d_count
        )
        /*
        INSERT INTO dbo.delta_info (table_name, registration_id, adds, deletes)
        VALUES (@table_info_name, @table_info_reg_id, @a_count, @d_count)
        */
        PRINT 'Adds Count:    ' + CONVERT(varchar, @a_count)
        PRINT 'Deletes Count: ' + CONVERT(varchar, @d_count)
        PRINT ''
        FETCH NEXT FROM table_info_cur INTO @table_info_owner, @table_info_name, @table_info_reg_id
    END

CLOSE table_info_cur

DEALLOCATE ver_list_cur
DEALLOCATE blocking_ver_name_cur
DEALLOCATE table_info_cur

```