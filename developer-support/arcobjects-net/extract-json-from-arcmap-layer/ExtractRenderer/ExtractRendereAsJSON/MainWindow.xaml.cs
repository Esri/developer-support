using ESRI.ArcGIS.Geoprocessor;
using ESRI.ArcGIS.esriSystem;
using ESRI.ArcGIS.Geoprocessing;
using ESRI.ArcGIS.Geodatabase;
using ESRI.ArcGIS.Carto;
using ESRI.ArcGIS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Windows.Forms;
using System.IO;

namespace ExtractRendereAsJSON
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        string m_strToolboxPath = Environment.CurrentDirectory + "\\" + Properties.Settings.Default.toolboxname;
        IMapServer m_pMapServer = null;
        Thickness m_margin;

        public MainWindow()
        {
            InitializeComponent();
            initializeLicense();
            initializeControls();
        }

        private void btnSelectMXd_Click(object sender, RoutedEventArgs e)
        {
            //opening a dialog to pick an mxd file
            OpenFileDialog fileDlg = new OpenFileDialog();
            fileDlg.Filter = "ArcMap Documents (*.mxd) | *.mxd";
            DialogResult result = fileDlg.ShowDialog();
            if (result == System.Windows.Forms.DialogResult.OK)
                txtMXD.Text = fileDlg.FileName;
            else
                return;
            fileDlg = null;

            closeMapServer();
            btnExportAsJSON.IsEnabled = false;
            prsProgress.IsIndeterminate = true;
            prsProgress.Visibility = System.Windows.Visibility.Visible;
            tvwLayers.Items.Clear();

            //converting mxd file to msd
            string msdfile = Utils.ConvertMXDToMSD(txtMXD.Text, m_strToolboxPath);
            if (msdfile == null)
            {
                prsProgress.Visibility = System.Windows.Visibility.Hidden;
                return;
            }

            //CoCreating a MapServerX
            m_pMapServer = Utils.ConstructMapServer(msdfile);
            if (m_pMapServer == null)
            {
                prsProgress.Visibility = System.Windows.Visibility.Hidden;
                return;
            }

            //list layers in each dataframes in the msd
            listLayers(m_pMapServer);
            btnExportAsJSON.IsEnabled = true;
            prsProgress.Visibility = System.Windows.Visibility.Hidden;
            //txtOutputFolder.Text  += ("\\" + System.IO.Path.GetFileNameWithoutExtension(msdfile));
        }

        private void btnSelectOutputDir_Click(object sender, RoutedEventArgs e)
        {
            FolderBrowserDialog folderBrowser = new FolderBrowserDialog()
            {
                ShowNewFolderButton = true,
                SelectedPath = txtOutputFolder.Text,
                Description = "Select an Output Folder"
            };

            string dir = txtOutputFolder.Text;
            DialogResult res = folderBrowser.ShowDialog();
            if (res == System.Windows.Forms.DialogResult.OK)
                dir = folderBrowser.SelectedPath;
            
            txtOutputFolder.Text = dir;
            
            //while (true)
            //{
            //    DialogResult res = folderBrowser.ShowDialog();
            //    if (res == System.Windows.Forms.DialogResult.OK)
            //        dir = folderBrowser.SelectedPath + "\\" + System.IO.Path.GetFileNameWithoutExtension(txtMXD.Text);
            //    else
            //        break;

            //    if (Directory.Exists(dir))
            //    {
            //        MessageBoxResult msgRes = System.Windows.MessageBox.Show("Do you want to overwrite the existing folder \n" + dir, "Output Folder", MessageBoxButton.YesNo, MessageBoxImage.Question);
            //        if (msgRes == MessageBoxResult.Yes)
            //        {
            //            Directory.Delete(dir);
            //            Directory.CreateDirectory(dir);
            //            break;
            //        }
            //    }
            //    else
            //    { 
            //        break; 
            //    }
            //}

            //txtOutputFolder.Text = dir;
            folderBrowser = null;
        }

        private void btnExportAsJSON_Click(object sender, RoutedEventArgs e)
        {
            string dataframeName;
            string outFile;
            IMapLayerInfos pMLInfos = null;
            IMapLayerInfo pMLI = null;

            //checking the existence of the output folder
            //DirectoryInfo outDirInfo = new DirectoryInfo(txtOutputFolder.Text);
            string outDir = txtOutputFolder.Text + "\\" + System.IO.Path.GetFileNameWithoutExtension(txtMXD.Text);
            if (Directory.Exists(outDir))
            {
                MessageBoxResult msgRes = System.Windows.MessageBox.Show(String.Format("Folder already exists \n{0}. \nDo you want to over write it?", outDir), "Output Folder", MessageBoxButton.YesNo, MessageBoxImage.Question);
                if (msgRes == MessageBoxResult.No)
                {
                    System.Windows.MessageBox.Show("Operation is cancelled", "Export As JSON", MessageBoxButton.OK, MessageBoxImage.Exclamation);
                    return;
                }
                else
                {
                    try
                    {
                        Directory.Delete(outDir, true);
                    }
                    catch (Exception ex)
                    {
                        System.Windows.MessageBox.Show(String.Format("Failed to delete the folder \n{0}\n\n{1}", outDir, ex.Message), "Export As JSON", MessageBoxButton.OK, MessageBoxImage.Error);
                        return;
                    }
                }
            }
            Directory.CreateDirectory(outDir);

            prsProgress.IsIndeterminate = false;
            prsProgress.Visibility = System.Windows.Visibility.Visible;

            TreeViewItem pTVIDataframe = null;
            for (int i = 0; i < m_pMapServer.MapCount; i++)
			{
                dataframeName = m_pMapServer.get_MapName(i);
                if (dataframeName != m_pMapServer.DefaultMapName)
                    continue;

                //ONLY for the default dataframe
                pTVIDataframe = tvwLayers.Items[0] as TreeViewItem;

                //getting REST resources including layer infos
                string restOutputResource = Utils.GetLayersResource(m_pMapServer);
                JSONObject jObject = new JSONObject();
                jObject.ParseString(restOutputResource);
                IJSONArray layers = null;
                jObject.TryGetValueAsArray("layers", out layers);

                pMLInfos = m_pMapServer.GetServerInfo(dataframeName).MapLayerInfos;
                prsProgress.Maximum = pMLInfos.Count;
                for (int j = 0; j < pMLInfos.Count; j++)
                {
                    pMLI = pMLInfos.get_Element(j);
                    if (pMLI.IsFeatureLayer)
                    {
                        bool isSelected = false;
                        IsLayerSelectedForExport(pTVIDataframe, pMLI.ID, ref isSelected);
                        if (isSelected)
                        {
                            IJSONObject layer = (IJSONObject)layers.get_Value(j);
                            String renderer = Utils.GetRendererFromLayer(layer.ToJSONString(null));

                            outFile = string.Format(@"{0}\{1:000} {2}.json", outDir, pMLI.ID, Utils.ValidateFileName(pMLI.Name));
                            try
                            {
                                File.WriteAllText(outFile, renderer);
                            }
                            catch (Exception ex)
                            {
                                System.Windows.MessageBox.Show(String.Format("Failed to write content to the file\n{0}\n\n{1}", outFile, ex.Message), "Export As JSON", MessageBoxButton.OK, MessageBoxImage.Error);
                                prsProgress.Visibility = System.Windows.Visibility.Hidden; 
                                return;
                            }
                        }
                    }
                    prsProgress.Value += 1;
                }
			}

            prsProgress.Visibility = System.Windows.Visibility.Hidden;
            System.Windows.MessageBox.Show(String.Format("Conversion Completed\nOutput Path: {0}", outDir), "JSON Conversion", MessageBoxButton.OK, MessageBoxImage.Information);
        }

        private void Window_Closing(object sender, System.ComponentModel.CancelEventArgs e)
        {
            closeMapServer();
        }



        /// <summary>
        /// initialize arcgis license
        /// </summary>
        private void initializeLicense()
        {
            ESRI.ArcGIS.RuntimeManager.Bind(ProductCode.Desktop);
            IAoInitialize aoInit = new AoInitialize();
            aoInit.Initialize(esriLicenseProductCode.esriLicenseProductCodeBasic);
        }

        private void initializeControls()
        {
            m_margin = new Thickness(3);
            string tmp = System.IO.Path.GetTempPath();
            txtOutputFolder.Text = tmp.EndsWith("\\") ? tmp.Remove(tmp.Length - 1) : tmp;
        }

        private void closeMapServer()
        {
            if (m_pMapServer == null)
                return;

            try
            {
                IMapServerInit pMSInit = m_pMapServer as IMapServerInit;
                string filename = pMSInit.FilePath;
                pMSInit.Stop();
                Utils.DeleteMSDfile(filename);
            }
            catch (Exception ex)
            {
                System.Windows.MessageBox.Show("Error stopping MapServer" + Environment.NewLine + ex.Message);
            }
        }



        /// <summary>
        /// list layers in each dataframes in a TreeView
        /// </summary>
        private void listLayers(IMapServer pMapServer)
        {
            string strMapName = "";
            IMapServerInfo pMSI = null;
            IMapLayerInfos pMLInfos = null;
            IMapLayerInfo pMLI = null;
            TreeViewItem pTVIDataFrame = null;

            for (int i = 0; i < pMapServer.MapCount; i++)
            {
                strMapName = pMapServer.get_MapName(i);
                if (!strMapName.Equals(pMapServer.DefaultMapName))
                    continue;

                //only for the active dataframe
                pMSI = pMapServer.GetServerInfo(strMapName);
                pMLInfos = pMSI.MapLayerInfos;

                pTVIDataFrame = CreateTreeViewItem(strMapName);
                tvwLayers.Items.Add(pTVIDataFrame);

                for (int j = 0; j < pMLInfos.Count; j++)
                {
                    pMLI = pMLInfos.get_Element(j);
                    AddTVItemForSubLayer(pTVIDataFrame, pMLInfos, pMLI, ref j);
                }
                pTVIDataFrame.IsExpanded = true;
            }

            if (pMapServer.MapCount > 1)
            {
                tvwLayers.Items.Add("");
                TextBlock tb = new TextBlock()
                {
                    Text = "<Other non-active dataframe cannot be used>",
                    Foreground = new SolidColorBrush(Colors.DarkGray),
                    FontStyle = FontStyles.Italic
                };
                tvwLayers.Items.Add(tb);
            }
        }

        private void AddTVItemForSubLayer(TreeViewItem pTVIParent, IMapLayerInfos pMLInfos, IMapLayerInfo pMLI, ref int curMLIindex)
        {
            TreeViewItem pTVIlayer = CreateTreeViewItem(pMLI); //pMLI.Name, pMLI.ID, false);
            pTVIParent.Items.Add(pTVIlayer);

            ILongArray pSubLayersIDs = pMLI.SubLayers;
            if (pSubLayersIDs == null)
                return;

            //when it is a group layer
            IMapLayerInfo pChildMLI = null;
            for (int i = 0; i < pSubLayersIDs.Count; i++)
            {
                pChildMLI = pMLInfos.get_Element(++curMLIindex);
                AddTVItemForSubLayer(pTVIlayer, pMLInfos, pChildMLI, ref curMLIindex);
            }
        }

        private TreeViewItem CreateTreeViewItem(IMapLayerInfo pMLI)
        {
            System.Windows.Controls.CheckBox pCB = new System.Windows.Controls.CheckBox()
            {
                IsChecked = true,
                Margin = m_margin
            };
            System.Windows.Controls.TextBlock pTB = new System.Windows.Controls.TextBlock()
            {
                Text = pMLI.Name,
                Margin = m_margin
            };
            TextBlock ptbkInfo = new TextBlock()
            {
                Text = "(not featurelayer; can't export as JSON)",
                IsEnabled = false,
                Foreground = new SolidColorBrush(Colors.LightGray),
                FontStyle = FontStyles.Italic,
                Margin = m_margin
            };

            StackPanel pSP = new StackPanel()
            {
                Orientation = System.Windows.Controls.Orientation.Horizontal,
                Tag = pMLI.ID,
                VerticalAlignment = System.Windows.VerticalAlignment.Center
            };

            pSP.Children.Add(pCB);
            pSP.Children.Add(pTB);
            if (!pMLI.IsFeatureLayer)
            {
                pCB.IsChecked = false;
                pSP.IsEnabled = false;
                pSP.Children.Add(ptbkInfo);
            }

            return new TreeViewItem()
            {
                Header = pSP
            };
        }

        private TreeViewItem CreateTreeViewItem(string name)
        {
            BitmapImage bmp = new BitmapImage(new Uri("pack://application:,,,/ExtractRendereAsJSON;component/Images/DataFrame16.png"));
            Image img = new Image()
            {
                Source = bmp,
                Margin = m_margin
            };

            System.Windows.Controls.TextBlock pTB = new System.Windows.Controls.TextBlock()
            {
                Text = name,
                Margin = m_margin
            };

            StackPanel pSP = new StackPanel()
            {
                Orientation = System.Windows.Controls.Orientation.Horizontal,
            };

            pSP.Children.Add(img);
            pSP.Children.Add(pTB);

            return new TreeViewItem()
            {
                Header = pSP
            };
        }

        private bool IsLayerSelectedForExport(TreeViewItem pTVI, int id, ref bool isSelected)
        {
            if (pTVI.Items.Count > 0)
            {
                foreach (TreeViewItem tvi in pTVI.Items)
                    if (IsLayerSelectedForExport(tvi, id, ref isSelected))
                        return true;

                return false;
            }
            else
            {
                if ((int)((StackPanel)pTVI.Header).Tag == id)
                {
                    isSelected = ((System.Windows.Controls.CheckBox)((StackPanel)pTVI.Header).Children[0]).IsChecked.Value;
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }
    }
}
