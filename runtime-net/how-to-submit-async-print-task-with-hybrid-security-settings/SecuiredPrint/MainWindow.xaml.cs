using Esri.ArcGISRuntime.Controls;
using Esri.ArcGISRuntime.Security;
using Esri.ArcGISRuntime.Tasks.Geoprocessing;
using Esri.ArcGISRuntime.Tasks.Printing;
using System;
using System.ComponentModel;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using System.Windows;

namespace SecuiredPrint
{
    public partial class MainWindow : Window
    {
        private PrintTask _printTask; 
        private TaskCompletionSource<Credential> _loginTCS;
        // Flag to track if the user has cancelled the login dialog
        bool _cancelledLogin;


        public MainWindow()
        {
            InitializeComponent();

            // Client's service
            _printTask = new PrintTask(
                new Uri("https://supt07440.esri.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task"));
            MyMapView.Loaded += MyMapView_Loaded;

            IdentityManager.Current.ChallengeHandler = new ChallengeHandler(Challenge);
        }

        
        private async void MyMapView_Loaded(object sender, RoutedEventArgs e)
        {
            try
            {
                var info = await _printTask.GetTaskInfoAsync();

                comboLayout.ItemsSource = info.LayoutTemplates;
                if (info.LayoutTemplates != null && info.LayoutTemplates.Count > 0)
                    comboLayout.SelectedIndex = 0;

                comboFormat.ItemsSource = info.Formats;
                if (info.Formats != null && info.Formats.Count > 0)
                    comboFormat.SelectedIndex = 0;
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Sample Error");
            }
        }
        
        private async void ExportMap_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                progress.Visibility = Visibility.Visible;

                PrintParameters printParameters = new PrintParameters(MyMapView)
                {
                    ExportOptions = new ExportOptions() { Dpi = 96, OutputSize = new Size(MyMapView.ActualWidth, MyMapView.ActualHeight) },
                    LayoutTemplate = (string)comboLayout.SelectedItem ?? string.Empty,
                    Format = (string)comboFormat.SelectedItem,
                };

                var result = await _printTask.SubmitPrintJobAsync(printParameters);

                while (result.JobStatus != GPJobStatus.Cancelled && result.JobStatus != GPJobStatus.Deleted
                && result.JobStatus != GPJobStatus.Succeeded && result.JobStatus != GPJobStatus.TimedOut)
                {
                    result = await _printTask.CheckPrintJobStatusAsync(result.JobID);

                    Console.WriteLine(string.Join(Environment.NewLine, result.Messages.Select(x => x.Description)));

                    await Task.Delay(2000);
                }

                if (result.JobStatus == GPJobStatus.Succeeded)
				{
                    MessageBox.Show(result.JobStatus.ToString() + " Job ID:" + result.JobID);
                    var outParam = await _printTask.GetPrintJobResultAsync(result.JobID);
                    if (outParam != null)
                    {
                        Process.Start(outParam.PrintResult.Uri.AbsoluteUri);
                            
                    }
                }

            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message, "Sample Error");
            }
            finally
            {
                progress.Visibility = Visibility.Collapsed;
            }
        }
        
        // Base Challenge method that dispatches to the UI thread if necessary
        private async Task<Credential> Challenge(CredentialRequestInfo cri)
        {
            if (Dispatcher == null)
            {
                return await ChallengeUI(cri);
            }
            else
            {
                return await Dispatcher.Invoke(() => ChallengeUI(cri));
            }
        }

        // Challenge method that prompts for username / password
        private async Task<Credential> ChallengeUI(CredentialRequestInfo cri)
        {
            try
            {
                loginPanel.DataContext = new LoginInfo(cri);
                _loginTCS = new TaskCompletionSource<Credential>(loginPanel.DataContext);

                loginPanel.Visibility = Visibility.Visible;

                return await _loginTCS.Task;
            }
            finally
            {
                loginPanel.Visibility = Visibility.Collapsed;
            }
        }

        // Login button handler - checks entered credentials
        private async void btnLogin_Click(object sender, RoutedEventArgs e)
        {
            if (_loginTCS == null || _loginTCS.Task == null || _loginTCS.Task.AsyncState == null)
                return;

            var loginInfo = _loginTCS.Task.AsyncState as LoginInfo;

            try
            {

                Credential credential = null;
                try
                {
                    // Showing a new window with login UI (username/password) must occur on the UI thread
                    credential = this.Dispatcher.Invoke(new Func<Credential>(() =>
                    {
                        Credential cred = null;

                        
                        var username = loginInfo.UserName;
                        var password = loginInfo.Password;
                        var domain = "AVWORLD";

                            // Create a new network credential using the user input and the URI of the resource
                            cred = new ArcGISNetworkCredential()
                            {
                                Credentials = new NetworkCredential(username, password, domain),
                                ServiceUri = loginInfo.ServiceUrl
                            };
                        //}

                        // Return the credential
                        return cred;
                    })
                    );
                }
                catch (Exception ex)
                {
                    Debug.WriteLine("Exception: " + ex.Message);
                }

                // Add the credential to the IdentityManager
                IdentityManager.Current.AddCredential(credential);

                
                //var credentials = await IdentityManager.Current.GenerateCredentialAsync(loginInfo.ServiceUrl,
                //    loginInfo.UserName, loginInfo.Password, loginInfo.RequestInfo.GenerateTokenOptions);

                _loginTCS.TrySetResult(credential);
            }
            catch (Exception ex)
            {
                loginInfo.ErrorMessage = ex.Message;
                loginInfo.AttemptCount++;

                if (loginInfo.AttemptCount >= 3)
                {
                    _loginTCS.TrySetException(ex);
                }
            }
        }
    }
    
    // Helper class to contain login information
    internal class LoginInfo : INotifyPropertyChanged
    {
        private CredentialRequestInfo _requestInfo;
        public CredentialRequestInfo RequestInfo
        {
            get { return _requestInfo; }
            set { _requestInfo = value; OnPropertyChanged(); }
        }

        private string _serviceUrl;
        public string ServiceUrl
        {
            get { return _serviceUrl; }
            set { _serviceUrl = value; OnPropertyChanged(); }
        }

        private string _userName;
        public string UserName
        {
            get { return _userName; }
            set { _userName = value; OnPropertyChanged(); }
        }

        private string _password;
        public string Password
        {
            get { return _password; }
            set { _password = value; OnPropertyChanged(); }
        }

        private string _errorMessage;
        public string ErrorMessage
        {
            get { return _errorMessage; }
            set { _errorMessage = value; OnPropertyChanged(); }
        }

        private int _attemptCount;
        public int AttemptCount
        {
            get { return _attemptCount; }
            set { _attemptCount = value; OnPropertyChanged(); }
        }

        public LoginInfo(CredentialRequestInfo cri)
        {
            RequestInfo = cri;
            ServiceUrl = new Uri(cri.ServiceUri).GetLeftPart(UriPartial.Path);
            ErrorMessage = string.Empty;
            AttemptCount = 0;
        }

        public event PropertyChangedEventHandler PropertyChanged;

        private void OnPropertyChanged([CallerMemberName] string propertyName = null)
        {
            var handler = PropertyChanged;
            if (handler != null)
            {
                handler(this, new PropertyChangedEventArgs(propertyName));
            }
        }
    }
}
