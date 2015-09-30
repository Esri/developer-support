/***********************************************************************

orphaned-domains.SQL  --  List Orphaned Domains

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Purpose:
 This script serves to describe feature class fields within the
GDB_ITEMS table. If the field has a domain specified, the query
will check if the domain still exists in the geodatabase. If the
domain does not exist in the geodatabase the feature class, field
and domain name are returned.

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

History:

Christian Wells        08/22/2015               Original coding.

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Versions Supported:
EGDB: 10.0 and above
DBMS: Oracle
DBMS Version: All

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Tags:
XML, Fields, Oracle, Feature Class, Domain, Orphan

:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

Resources:
XMLQUERY:
http://docs.oracle.com/cd/B19306_01/server.102/b14200/functions224.htm

***********************************************************************/

SELECT items.physicalname,
  items.objectid,
  xmltbl.Fname,
  xmltbl.Ftype AS FDomain
FROM sde.gdb_items_vw items,
  --Query XML column by looping through each field and check for domains.
  XMLTABLE('/Info' PASSING (XMLQuery('for $i in /DEFeatureClassInfo/GPFieldInfoExs
for $f in $i/GPFieldInfoEx
return
<Info nm="{$f/Name}" fDomain="{$f/DomainName}"/>' PASSING xmltype(items.definition) RETURNING CONTENT)) COLUMNS FName VARCHAR(30) PATH '@nm', FTYPE VARCHAR(30) PATH '@fDomain') XMLTBL
WHERE
  --Only return feature classes and tables that are registered with the geodatabase.
  ITEMS.TYPE IN ('{70737809-852C-4A03-9E22-2CECEA5B9BFA}', '{CD06BC3B-789D-4C51-AAFA-A467912B8965}')
AND
  --Check to see if the domain from the XML query exists in the geodatabase.
  XMLTBL.FTYPE NOT IN
  (SELECT NAME
  FROM GDB_ITEMS
  WHERE TYPE IN ('{8C368B12-A12E-4C7E-9638-C9C64E69E98F}', '{C29DA988-8C3E-45F7-8B5C-18E51EE7BEB4}')
  )
AND
  --Do not return any fields that do not have a domain.
  XMLTBL.FTYPE IS NOT NULL
