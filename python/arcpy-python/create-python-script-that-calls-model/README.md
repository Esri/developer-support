Create Python Script that Calls Model
=========================

## Instructions

1. Open the Script in an IDE, or run from command line
2. The script will prompt you for several inputs, such as model location, model name, etc
3. Run the output script and ensure that it creates the same output as your model


## Use Case

This script is useful for someone who is not familiar with python but would like to run geoprocessing scripts as a scheduled task. Calling a model from a python script is much more reliable than exporting a model to a python script for a few reasons:
1. You can utilize modelbuilder functions such as iterators, which do not export to Python. If you were to export, you would need to go through and replace any iterator with a loop.
2. If you already have a working model, then it adds extra room for error to export to a python script, so why not just call the model that already runs as you wish?
3. If you make updates to your model, you will need to re-export your model and fix any issues with the output script, whereas if you simply call your model from python, any changes will be automatically picked up. 
4. Having a small script that calls a model reduces the number of places something could go wrong, so if your scheduled task fails, you can go straight to the model, and debug from there.

## Limitations

Current, if your model takes user specified parameters, the output script will not take these into account. You will need to add these in manually. This is an area where this script could be improved upon, so feel free to submit a pull request with any solutions.