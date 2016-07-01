#-------------------------------------------------------------------------------
# Name:        Delete Users
# Purpose:     Input the users email address and the script will remove all users and content associated wiht the email address
#
# Author:      kell6873
#
# Created:     17/11/2014
# Copyright:   (c) kell6873 2014
# Licence:     <your licence>
#-------------------------------------------------------------------------------

import accountHelperDelete

if __name__ == '__main__':
    ## invite multiple users
    user = 'username'
    pw  = 'password'

    roleID = 'Delete'
    #Generates Token
    t=accountHelperDelete.agolAdmin(user,pw)



#Searches for user by email address
    for userLine in t.userDict:
        if userLine['role'].lower() == t.roleAssign(roleID).lower():
            print userLine['username']
            print t.roleAssign(userLine['role'])

            t.delUserContent(userLine['username'])
            t.delUserGroups(userLine['username'])
            t.delUser(userLine['username'])
