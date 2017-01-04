#-------------------------------------------------------------------------------
# Name:            Enables My Esri Access
# Purpose:         This script enables My Esri Access for the entire organization.
#                  Please be aware of the following information that will be available
#                  to esri when enabling this option.
#################################################################################
#                  Esri Access allows the member to use My Esri, participate in Community and Forums, and manage email communications from Esri.
#                  Please note that the member's full name, username, and email will be made available to Esri, who may contact or send them promotional materials via email.
#################################################################################
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


t=accountHelper.agolAdmin(user,pw)

for item in t.userDict:
    t.updateUser(item['username'], myEsri='both')


