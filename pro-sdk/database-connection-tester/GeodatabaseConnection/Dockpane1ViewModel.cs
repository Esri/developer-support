using ArcGIS.Core.Data;
using ArcGIS.Desktop.Catalog;
using ArcGIS.Desktop.Framework;
using ArcGIS.Desktop.Framework.Contracts;
using ArcGIS.Desktop.Framework.Threading.Tasks;
using System;
using System.Collections.ObjectModel;
using System.Threading;
using System.Windows.Input;

namespace GeodatabaseConnection
{
    internal class Dockpane1ViewModel : DockPane
    {
        private const string _dockPaneID = "GeodatabaseConnection_Dockpane1";
       
        private ICommand _openGdbCommand;

        protected Dockpane1ViewModel() { }

        public ICommand OpenGdbCmd
        {
            get { return _openGdbCommand ?? (_openGdbCommand = new RelayCommand(() => OpenGdbDialog(), () => true)); }
        }

        /// <summary>
        /// Show the DockPane.
        /// </summary>
        internal static void Show()
        {
            DockPane pane = FrameworkApplication.DockPaneManager.Find(_dockPaneID);
            if (pane == null)
                return;

            pane.Activate();
        }

        /// <summary>
        /// Text shown near the top of the DockPane.
        /// </summary>
        private string _heading = "Test Enterprise DB Connections";
        public string Heading
        {
            get => _heading;
            set => SetProperty(ref _heading, value, () => Heading);
        }

        private string _gdbPath = string.Empty;
        public string GdbPath
        {
            get => _gdbPath;
            set
            {
                SetProperty(ref _gdbPath, value, () => GdbPath);
                ConnectionTime();
            }
        }

        ObservableCollection<ConnInfo> _connectionTimes = new ObservableCollection<ConnInfo>();

        public ObservableCollection<ConnInfo> ConnectionTimes
        {
            get => _connectionTimes;
            set => SetProperty(ref _connectionTimes, value, () => ConnectionTimes);
        }

        private void OpenGdbDialog()
        {
            OpenItemDialog searchGdbDialog = new OpenItemDialog
            {
                Title = "Find Database",
                InitialLocation = ArcGIS.Desktop.Core.Project.Current.HomeFolderPath,
                MultiSelect = false,
                Filter = ItemFilters.geodatabases
            };

            var ok = searchGdbDialog.ShowDialog();
            if (ok != true) return;
            var selectedItems = searchGdbDialog.Items;
            foreach (var selectedItem in selectedItems)
                GdbPath = selectedItem.Path;
        }

        private void ConnectionTime()
        {
            // Because updating property outside the MCT
            var uiContext = SynchronizationContext.Current;

            QueuedTask.Run(() =>
            {
                var start = DateTime.Now.ToLocalTime();
                using (Geodatabase geodatabase = new Geodatabase(new DatabaseConnectionFile(new Uri(GdbPath))))
                {
                    var end = DateTime.Now.ToLocalTime();
                    TimeSpan diff = end.Subtract(start);
                    var connectionFileName = GdbPath.Substring(GdbPath.LastIndexOf(@"\") + 1);
                    uiContext.Send(x => _connectionTimes.Add(new ConnInfo { Connection = connectionFileName, Time = diff }), null);
                    geodatabase.Dispose();
                }
            }).ContinueWith(t =>
            {
                if (t.Exception == null) return;
                var aggException = t.Exception.Flatten();
                foreach (var item in aggException.InnerExceptions)
                {
                    System.Diagnostics.Debug.WriteLine(item.Message);
                    uiContext.Send(x => _connectionTimes.Add(new ConnInfo { Connection = item.Message, Time = new TimeSpan(0,0,0) }), null);
                }
            });
        }
    }

    /// <summary>
    /// Simple class for the output data
    /// </summary>
    internal class ConnInfo
    {
        public string Connection { get; set; }
        public TimeSpan Time { get; set; }
    }

    /// <summary>
    /// Button implementation to show the DockPane.
    /// </summary>
    internal class Dockpane1_ShowButton : Button
    {
        protected override void OnClick()
        {
            Dockpane1ViewModel.Show();
        }
    }
}
