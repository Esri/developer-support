// Copyright 2021 Esri
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using System.Windows;

namespace DisplayAScene
{
    /// <summary>
    /// Interaction logic for App.xaml
    /// </summary>
    public partial class App : Application
    {
        protected override void OnStartup(StartupEventArgs e)
        {
            base.OnStartup(e);

            // Set the access token for ArcGIS Maps SDK for .NET.
            Esri.ArcGISRuntime.ArcGISRuntimeEnvironment.ApiKey = "AAPTaDbRxZ8nJ-bWulQuv6_wisg..KUqFrP6hnzEwH0j0d1d17V9GPBhjjPZp_kfisbDV-CeQm-a4M5Ok4OdbFIf1XC24HsAyP3nq2NQSpQadQWovy8V36uo4nkAmjmhyhO9AdvYjpHpqPbjbgH1S_M_qRKdLanf36TfhjGfeKiQN5ZGfOOf24QqN_SKxP8HYRgNiXQWpTUcl4o8QVOn4vYU_nbhS9J0Sko44lPT0awVLLnsXyNPfOH0IciRIEHwn8DNLC9sthqt4D9OckYXLwfxbAT1_xHpKKDQH";

            // Call a function to set up the AuthenticationManager for OAuth.
            //UserAuth.ArcGISLoginPrompt.RegisterOAuthConfig();

        }
    }
}
