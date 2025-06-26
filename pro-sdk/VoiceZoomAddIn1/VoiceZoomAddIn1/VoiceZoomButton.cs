using ArcGIS.Desktop.Framework.Contracts;
using ArcGIS.Desktop.Framework.Threading.Tasks;
using ArcGIS.Desktop.Framework.Dialogs;
using ArcGIS.Desktop.Mapping;
using System;
using System.Linq;
using System.Speech.Recognition;
using System.Threading.Tasks;
using ArcGIS.Core.Data;

namespace VoiceZoomAddIn1
{
    internal class VoiceZoomButton : Button
    {
        protected override void OnClick()
        {
            _ = ListenAndZoomAsync();
        }
        private async Task ListenAndZoomAsync()
        {
            try
            {
                // Set up speech recognition
                SpeechRecognitionEngine recognizer = new SpeechRecognitionEngine();
                recognizer.SetInputToDefaultAudioDevice();
               
                // Define countries to recognize
                var countries = new Choices(new string[] { "India", "Barbados", "United States", "Canada", "Brazil", "France" });
                GrammarBuilder gb = new GrammarBuilder(countries);
                Grammar grammar = new Grammar(gb);
                recognizer.LoadGrammar(grammar);
                MessageBox.Show("Please say a country name (e.g., Canada, India)...");
                string recognizedCountry = null;
                recognizer.SpeechRecognized += (s, e) =>
                {
                    recognizedCountry = e.Result.Text;
                };
                
                // Recognize once (blocking call)
                recognizer.Recognize();
                if (string.IsNullOrEmpty(recognizedCountry))
                {
                    MessageBox.Show("No country recognized.");
                    return;
                }
                string finalCountry = recognizedCountry;
                await QueuedTask.Run(() =>
                {
                    var map = MapView.Active?.Map;
                    if (map == null)
                    {
                        MessageBox.Show("No active map.");
                        return;
                    }
                    foreach (var layer in map.GetLayersAsFlattenedList())
                    {
                        if (layer is FeatureLayer fl && fl.Name == "World_Countries")
                        {
                            // Build the query
                            var whereClause = $"UPPER(\"Country\") = UPPER('{finalCountry.Replace("'", "''")}')";
                            var qf = new QueryFilter { WhereClause = whereClause };
                            try
                            {
                                var selection = fl.Select(qf);
                                if (selection.GetCount() > 0)
                                {
                                    using (var rowCursor = fl.GetSelection().Search())
                                    {
                                        if (rowCursor.MoveNext())
                                        {
                                            using (var row = rowCursor.Current as Feature)
                                            {
                                                var shape = row.GetShape();
                                                MapView.Active.ZoomTo(shape.Extent, TimeSpan.FromSeconds(1));
                                                return;
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    MessageBox.Show($"Country '{finalCountry}' not found.");
                                    return;
                                }
                            }
                            catch (Exception ex)
                            {
                                MessageBox.Show($"Selection error: {ex.Message}");
                                return;
                            }
                        }
                    }
                    MessageBox.Show("World_Countries layer not found.");
                });
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Error: {ex.Message}");
            }
        }
    }
}