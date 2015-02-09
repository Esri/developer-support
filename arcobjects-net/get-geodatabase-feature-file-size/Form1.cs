using ESRI.ArcGIS.Catalog;
using ESRI.ArcGIS.CatalogUI;
using System;
using System.Globalization;
using System.Windows.Forms;

namespace HowToGetGDBFeatureFileSize
{
    public partial class Form1 : Form
    {
        private static TextBox FeatClassTextBox { get; set; }
        private static TextBox FileSizeGxTextBox { get; set; }
        private static TextBox FileSizeDiskTextBox { get; set; }
        private static double ConversionFactor { get { return 9.765481111611345; } }

        public Form1()
        {
            InitializeComponent();

            FeatClassTextBox = this.featClassTextBox;
            FileSizeGxTextBox = this.fileSizeGxTextBox;
            FileSizeDiskTextBox = this.fileSizeDiskTextBox;
        }

        private void openFeatureButton_Click(object sender, EventArgs e)
        {
            IGxDialog gxDialog = new GxDialogClass
            {
                AllowMultiSelect = false,
                Title = "Select Feature Class to Determine File Size",
                ObjectFilter = new GxFilterFeatureClassesClass()
            };

            IEnumGxObject gxObjects;
            gxDialog.DoModalOpen(0, out gxObjects);

            if (gxObjects == null) return;

            gxObjects.Reset();

            IGxDataset gxDataset = gxObjects.Next() as IGxDataset;
            IGxObjectProperties gxProps = gxDataset as IGxObjectProperties;

            FeatClassTextBox.Text = gxDataset.DatasetName.Name;
            FileSizeGxTextBox.Text = gxProps.GetProperty("ESRI_GxObject_FileSize").ToString();

            double kb = double.Parse(FileSizeGxTextBox.Text)*ConversionFactor;
            
            string size;
            if (kb >= 1024.0)
            {
                double mb = ConvertKBToMB(kb);
                size = Math.Round(mb, 2, MidpointRounding.AwayFromZero).ToString(CultureInfo.InvariantCulture) + " MB";

                if (mb >= 1024.0)
                {
                    double gb = ConvertMBToGB(mb);
                    size = Math.Round(gb, 2, MidpointRounding.AwayFromZero).ToString(CultureInfo.InvariantCulture) + "GB";

                    if (gb >= 1024.0)
                    {
                        double tb = ConvertGBToTB(gb);
                        size = Math.Round(tb, 2, MidpointRounding.AwayFromZero).ToString(CultureInfo.InvariantCulture) + " TB";
                    }
                }
            }
            else
            {
                size = Math.Round(kb, 2, MidpointRounding.AwayFromZero).ToString(CultureInfo.InvariantCulture) + " KB";
            }

            FileSizeDiskTextBox.Text = size;
        }

        private static double ConvertKBToMB(double kb)
        {
            return kb/1024.0;
        }

        private static double ConvertMBToGB(double mb)
        {
            return mb/1024.0;
        }

        private static double ConvertGBToTB(double tb)
        {
            return tb/1024.0;
        }
    }
}
