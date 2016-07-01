#-------------------------------------------------------------------------------
# Name:            Resest password
# Purpose:         Reset the password to a specific password. Can be used if you want
#                  to set a specific password.
#
# Author:          Kelly Gerrow kgerrow@esri.com
#
# Created:         Canada Day 2016!

#-------------------------------------------------------------------------------

import accountHelper
################################################################################

#admin username and password
user = 'username'
pw = 'password'


#password to reset
targUser = 'targeUser'
targPass = 'targetPassword'

t=accountHelper.agolAdmin(user,pw)


t.updateUser(targUser,password=targPass)


