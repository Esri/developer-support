''' Fix_Report_URLs.py
    Andrew Ortego
    aortego@esri.com
    3/11/2015

    DESCRIPTION:
    This script repairs the erroneous <a> tag's created by the Report
    Designer, if hyperlinks are enabled.

    PREREQUISTES:
    This script requires the Beautiful Soup 4 module, found here:
        http://www.crummy.com/software/BeautifulSoup/#Download

    Also required is an HTM or HTML file created by Esri's Report Designer, with
    hyperlinks enabled.

    INPUT PARAMETERS:
        :input_hml -- file name and location of the HTM file to be corrected
        :output_html -- file name and location of the HTML file to be created

    OUTPUT:
    An .html file with the same appearance as the .htm file, but with working
    hyperlinks. (Assuming the URL is correct.)'''

import os
import re
import urllib2
try:
    from bs4 import BeautifulSoup as BSoup
except ImportError:
    message = """
    The Beautiful Soup 4 module was not found. Please install from:
    http://www.crummy.com/software/BeautifulSoup/#Download

    Please verify that the \"bs4\" folder is located in the following directory:
    C:\Python27\ArcGIS10.x\Lib\site-packages
    """
    print(message)
    raise SystemExit

def fix_report_urls(report, fixed_report):
    ''' Creates a new HTML file and copies the HTM file to it, line-by-line. If
        an <a> tag is found with the href-attribute set to "True", it will be
        corrected to fix that URL.'''
    with open(report, 'r') as in_file, open(fixed_report, 'w') as out_file:
        for line in in_file:
            soup = BSoup(line)
            if soup.a and soup.a.get('href') == "True":
                url = soup.nobr.text
                clean_url = url.replace("<br/>", "") # Remove br tag(s) from URL

                soup.span.a.decompose()
                a_tag = soup.new_tag("a", href=clean_url)
                soup.span.insert(0, a_tag)
                soup.span.a.string = url
                soup.span['style'] += ''

                out_file.write(unicode(soup.span))

                check_url(clean_url)
            else:
                out_file.write(line)
    print("The new HTML file has been created. Checking for .toc file...")

def check_url(url):
    ''' Checks a URL for accessibility. Will report inaccessible URLs so that
        the user can double-check that address.'''
    try:
        response = urllib2.urlopen(url)
    except urllib2.URLError as e:
        print "Couldn't acccess a URL, please check this address:", url
    else:
        pass

def fix_table_of_contents(htm_file, html_file):
    ''' If a .toc file is detected, the hyperlinks in that .toc file will be
        repaired to link to the new HTML file created in fix_report_urls. This
        is not required.'''
    toc_file = htm_file[:-3] + "toc.html"
    if not os.path.isfile(toc_file):
        print("No .toc found. If it exists, please verify that it has the same \
              name as the original HTM file and run this script again.")
    else:
        fixed_toc = html_file[:-4] + "toc.html"
        with open(toc_file, 'r') as in_file, open(fixed_toc, 'w') as out_file:
            for line in in_file:
                soup = BSoup(line)
                if soup.a:
                    for a in soup.findAll('a'):
                        link = re.search(r'(#.*)', a.get('href'))
                        a['href'] = html_file + link.group()
                out_file.write(unicode(soup.prettify()))
        print("The new .toc file has been created.")


if __name__ == "__main__":
    '''Input Parameters:
        :input_hml -- file name and location of the HTM file to be corrected
        :output_html -- file name and location of the HTML file to be created'''
    input_htm = "TestReport_HyperlinksEnabled.htm"
    output_html = "FixedReport.html"
    fix_report_urls(input_htm, output_html)
    fix_table_of_contents(input_htm, output_html)

