## Query a Branch Versioned Feature Class

**Note: There is no versioned view (insert/update/delete) functionality for branch versioning!**

The heavy lifting in this query comes from the internal query found by tracing a feature service in ArcGIS Pro. The main feature is the subquery that uses a CTE to filter the branch versioned table for current features that have not been flagged as deleted.

```
...
..
.
WHERE GDB_ARCHIVE_OID IN (
    SELECT GDB_ARCHIVE_OID
    FROM
      (
        SELECT
          GDB_ARCHIVE_OID,
          ROW_NUMBER() OVER( PARTITION BY OBJECTID ORDER BY GDB_FROM_DATE DESC ) AS rn_,
          GDB_IS_DELETE
        FROM owner.bv_table
        WHERE GDB_BRANCH_ID IN (0)
          AND GDB_FROM_DATE <= GETUTCDATE()
          AND OBJECTID IN (
            SELECT OBJECTID
            FROM owner.bv_table
          )
      ) AS br__
    WHERE
      br__.rn_ = 1
      AND br__.GDB_IS_DELETE = 0
	)
...
..
.
```

This sample shows how to view current edits in the Default version. `GDB_BRANCH_ID = 0`. To view other versions, the query should target the desired `GDB_BRANCH_ID` **AND** the Default branch ID (0).

As long as the above WHERE clause stays intact, any other SQL can be used to filter or join for further refinement.
