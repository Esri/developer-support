#-------------------------------------------------------------------------------
# Name:        Create Python script that calls Model
# Purpose:     This a basic script can be used to create a Python script that simply
#              calls a working Model. This is a preferable workflow compared to
#              exporting a model to a python script. Note that this script does not
#              account for user specified parameters in a model, and these will need
#              to be added in manually
#
# Author:      Lucas Danzinger
#
# Created:     30/08/2013
#-------------------------------------------------------------------------------

def createScript():
    import os
    tbx_path = raw_input("Full path to toolbox: ")
    tbx_alias = raw_input("What is the alias of your toolbox?\n (can be found in the tbx properties) ")
    modelname = raw_input("What is the model name?\n (hint: this is not necessarily the same\n as the label and can be found in the model properties) ")
    outputLocation = raw_input("Where do you want the script located? ")

    outScript = open(os.path.join(outputLocation, "outScript.py"), "w")

    outScript.write("import arcpy\n")
    outScript.write('arcpy.ImportToolbox(r"' + tbx_path + '")\n')
    outScript.write('print "toolbox imported successfully"\n')
    outScript.write("arcpy." + modelname + "_" + tbx_alias + "()\n")
    outScript.write('print "model completed successfully"\n')
    outScript.close()

if __name__ == '__main__':
    createScript()
