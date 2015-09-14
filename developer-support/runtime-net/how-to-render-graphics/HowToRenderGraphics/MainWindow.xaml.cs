using Esri.ArcGISRuntime.Controls;
using Esri.ArcGISRuntime.Geometry;
using Esri.ArcGISRuntime.Layers;
using Esri.ArcGISRuntime.Symbology;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

namespace HowToRenderGraphics
{
    public partial class MainWindow : Window
    {
        private MapPoint[] _mapPoints = null;
        private readonly int _numberOfPoints;

        public MainWindow()
        {
            InitializeComponent();
            _numberOfPoints = int.Parse(this.FindResource("NumberOfPoints").ToString());
        }

        private void MyMapView_LayerLoaded(object sender, LayerLoadedEventArgs e)
        {
            if (e.LoadError == null)
                return;

            Debug.WriteLine("Error while loading layer : {0} - {1}", e.Layer.ID, e.LoadError.Message);
        }

        private void WorkflowA(object sender, RoutedEventArgs e)
        {
            ClearGraphics();
            Button button = sender as Button;

            if (_mapPoints == null)
                _mapPoints = GenerateRandomPoints(_numberOfPoints);
            
            SymbolFont font = new SymbolFont
            {
                FontFamily = "Tahoma",
                FontSize = 12,
                FontStyle = SymbolFontStyle.Italic,
                FontWeight = SymbolFontWeight.Bold,
                TextDecoration = SymbolTextDecoration.Underline
            };

            TextSymbol symbol;

            switch (button.Name)
            {
                case "Button01":
                    symbol = new TextSymbol
                    {
                        Font = font
                    };
                    break;
                case "Button02":
                    symbol = new TextSymbol
                    {
                        Font = font,
                        Color = Colors.DarkGreen
                    };
                    break;
                case "Button03":
                    symbol = new TextSymbol
                    {
                        Font = font,
                        Color = Colors.DarkGreen,
                        BorderLineColor = Colors.White,
                        BorderLineSize = 1
                    };
                    break;
                case "Button04":
                    symbol = new TextSymbol
                    {
                        Font = font,
                        Color = Colors.DarkGreen,
                        BorderLineColor = Colors.White,
                        BorderLineSize = 1,
                        BackgroundColor = Colors.Red
                    };
                    break;
                default:
                    symbol = new TextSymbol();
                    break;
            }

            for (int i = 0; i < _mapPoints.Length; i++)
            {
                symbol.Text = i.ToString(CultureInfo.InvariantCulture);
                MyGraphicsLayer.Graphics.Add(new Graphic {Geometry = _mapPoints[i], Symbol = symbol});
            }
        }

        private void WorkflowB(object sender, RoutedEventArgs e)
        {
            ClearGraphics();

            Button button = sender as Button;

            if (_mapPoints == null)
                _mapPoints = GenerateRandomPoints(_numberOfPoints);

            SymbolFont font = new SymbolFont
            {
                FontFamily = "Tahoma",
                FontSize = 12,
                FontStyle = SymbolFontStyle.Italic,
                FontWeight = SymbolFontWeight.Bold,
                TextDecoration = SymbolTextDecoration.Underline
            };

            List<Graphic> graphics = new List<Graphic>();

            switch (button.Name)
            {
                case "Button11":
                    graphics.AddRange(_mapPoints.Select((t, i) => 
                        new Graphic
                        {
                            Geometry = t, 
                            Symbol = new TextSymbol
                            {
                                Text = i.ToString(CultureInfo.InvariantCulture), 
                                Font = font
                            }
                        }));
                    break;
                case "Button12":
                    graphics.AddRange(_mapPoints.Select((t, i) => 
                        new Graphic
                        {
                            Geometry = t, 
                            Symbol = new TextSymbol
                            {
                                Text = i.ToString(CultureInfo.InvariantCulture), 
                                Font = font, 
                                Color = Colors.DarkGreen
                            }
                        }));
                    break;
                case "Button13":
                    graphics.AddRange(_mapPoints.Select((t, i) => 
                        new Graphic
                        {
                            Geometry = t, 
                            Symbol = new TextSymbol
                            {
                                Text = i.ToString(CultureInfo.InvariantCulture), 
                                Font = font, 
                                Color = Colors.DarkGreen, 
                                BorderLineColor = Colors.White, 
                                BorderLineSize = 1
                            }
                        }));
                    break;
                case "Button14":
                    graphics.AddRange(_mapPoints.Select((t, i) =>
                        new Graphic
                        {
                            Geometry = t, 
                            Symbol = new TextSymbol
                            {
                                Text = i.ToString(CultureInfo.InvariantCulture), 
                                Font = font, 
                                Color = Colors.DarkGreen, 
                                BorderLineColor = Colors.White, 
                                BorderLineSize = 1, 
                                BackgroundColor = Colors.Red
                            }
                        }));
                    break;
                default:
                    graphics.AddRange(_mapPoints.Select((t, i) => 
                        new Graphic
                        {
                            Geometry = t, 
                            Symbol = new TextSymbol
                            {
                                Text = i.ToString(CultureInfo.InvariantCulture)
                            }
                        }));
                    break;
            }

            MyGraphicsLayer.GraphicsSource = graphics;
        }

        private MapPoint[] GenerateRandomPoints(int numOfPoints)
        {
            List<MapPoint> mapPoints = new List<MapPoint>();

            int xmax = (int) MyMapView.ActualWidth;
            int ymax = (int) MyMapView.ActualHeight;

            Random random = new Random();
            for (int i = 0; i < numOfPoints; i++)
            {
                mapPoints.Add(MyMapView.ScreenToLocation(new Point(random.Next(0, xmax), random.Next(0, ymax))));
            }

            return mapPoints.ToArray();
        }

        private void ClearButton_OnClick(object sender, RoutedEventArgs e)
        {
            ClearGraphics();
        }

        private void ClearGraphics()
        {
            if (MyGraphicsLayer.GraphicsSource == null)
                MyGraphicsLayer.Graphics.Clear();
            else
                MyGraphicsLayer.GraphicsSource = null;
        }
    }
}
