#What is this?
This script is designed to query GeoNet for 19 specific places (mostly SDK related), and export CSV files of unanswered threads with less than 10 replies, sorted by the number of replies (fewest first). There is some helpful information printed out, and a few warning messages that you can disregard. It's a slightly messy but extremely useful script for figuring out which GeoNet threads needs attention, and can be easily modified to suit the different needs of users.
This should work with vanilla installs of python version 2.7.x. ArcPy is not required.

##What is required to run this script?
These are the imported modules:
import json, base64, requests, time, string, smtplib 
import csv, operator, time

##Use Case
User wants to help answer posts on GeoNet by targeting the unanswered posts with the fewest number of replies.