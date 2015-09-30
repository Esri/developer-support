#include <stdio.h>
#include <iostream>
#include <stdlib.h>
#include <string.h>
#include <malloc.h>
#include "sdetype.h"
#include "sdeerno.h"

using namespace std;

/* Function macros */
#define check_rc_return_on_failure(c,s,rc,f) {if (rc != SE_SUCCESS) { check_rc_(c, s, rc, f, __LINE__, __FILE__); return rc; }}

LONG  main(int argc, char *argv[]){
	
	CHAR   			*server, *user, *passwd, *database, *instance, *rslt_layer_name;
	SE_CONNECTION	conn;
	SE_ERROR		error;
	SE_STREAM		stream;
	LONG			result;
	
	/*
	SQL Server example
	server = "SUPT00568\INSTANCE_NAME";
	instance = "sde:sqlserver:SUPT00568\INSTANCE_NAME";
	database = "database_name";
	user = "sde";
	passwd = "sde";
	*/
	
	//Oracle example
	server = "DB_SERVER.DOMAIN.COM";
	instance = "sde:oracle11g";
	database = NULL;  /* NULL for Oracle */
	user = "sde";
	passwd = "sde@server/SID";  /*  Using the Oracle instant client, append the server/sid syntax to the password. */

	printf("Connecting to the SDE gdb: Server: %s, Instance: %s, User: %s, Pass: %s\n", server, instance, user, passwd);
	result = SE_connection_create(server, instance, NULL, user, passwd, &error, &conn);
	check_rc_return_on_failure(conn, NULL, result, "SE_CONNECTION_CREATE");
	printf("--->Connected --->\n\n");
}	
	
	
	/* validation function taken from:  http://help.arcgis.com/en/geodatabase/10.0/sdk/arcsde/samples/com/esri/sde/devhelp/geometry/geom_buffer.c  */
	void check_rc_(SE_CONNECTION Connection, SE_STREAM Stream, LONG rc,	char *comment, LONG line_no, char* file_name)
	{
		SE_ERROR	error;
		CHAR		error_string[SE_MAX_MESSAGE_LENGTH];
		LONG		temp_rc = SE_FAILURE;

		if ((rc != SE_SUCCESS) && (rc != SE_FINISHED))
		{
			error_string[0] = '\0';
			SE_error_get_string(rc, error_string);

			printf("%s encountered a %d error:\"%s\" \nat line %ld in file %s\n", comment, rc, error_string, line_no, file_name);

			/*Print extended error info, if any */
			if ((SE_DB_IO_ERROR == rc) | (SE_INVALID_WHERE == rc) | (SE_SSA_FUNCTION_ERROR == rc))
			{
				if (NULL != Stream)
				{
					/* Assume this is a stream error */
					temp_rc = SE_stream_get_ext_error(Stream, &error);
				}
				else if (NULL != Connection) {
					/*Assume this is a connection error */
					temp_rc = SE_connection_get_ext_error(Connection, &error);
				}
				if (SE_SUCCESS == temp_rc)
				{
					printf("Extended error code: %d, extended error string:\n%s\n",
						error.ext_error, error.err_msg1);
				}
			} /*End SE_DB_IO_ERROR */

		}
	}
