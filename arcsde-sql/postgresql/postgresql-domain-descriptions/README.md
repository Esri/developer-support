#### Resolve Domain Codes to Description Values using SQL in PostgreSQL
Examples exist for linking the description of a coded value domain to the assigned value.  There are two examples in the current documentation.  One for SQL Server and one for Oracle.

Example: Resolving domain codes to description values using SQL
http://desktop.arcgis.com/en/arcmap/latest/manage-data/using-sql-with-gdbs/example-resolving-domain-codes-to-description-values.htm


>In many cases, the codes in a coded value domain are arbitrarily assigned; for example, in a coded value domain of pipe materials, the domain's description values may be Copper, PVC, and Steel, but the domain's codes could be 1, 2, and 3, which are of little use to users executing a SQL query on a table that uses the domain.

The following example shows how to query a coded value domain in a common table expression, then join those results to the results from querying a feature class that uses the domain.  In this case, the lrParcelType domain from a parcel fabric polygon feature class contains the descriptions of different parcel types.

Here is a Postgres example.

```sql
with codeVal_CTE as (
    SELECT items.name, 
        unnest(xpath('//CodedValue/Name/text()', items.definition))::text as code, 
        unnest(xpath('//CodedValue/Code/text()', items.definition))::text as val
    FROM sde.gdb_items AS items INNER JOIN sde.gdb_itemtypes AS itemtypes
    ON items.type = itemtypes.uuid
    WHERE itemtypes.name IN ('Coded Value Domain')
)

SELECT a.objectid, a.type, cdval.code, a.shape
FROM sde.bloomfield_parcels a   -- feature class
LEFT OUTER JOIN (
    select code, 
    		val 
    FROM codeVal_CTE 
	WHERE name = 'lrParcelType' -- domain name
    ) as cdval
ON CAST(a.type as text) = cdval.val
```

