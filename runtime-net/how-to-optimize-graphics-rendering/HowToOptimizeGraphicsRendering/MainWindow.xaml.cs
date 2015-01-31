using System.Threading.Tasks;
using Esri.ArcGISRuntime.Geometry;
using Esri.ArcGISRuntime.Layers;
using Esri.ArcGISRuntime.Symbology;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;

namespace HowToOptimizeGraphicsRendering
{
    public partial class MainWindow : Window
    {
        private MapPoint[] _mapPoints = null;

        public MainWindow()
        {
            InitializeComponent();
        }

        private void AddGraphicsToDisplay(object sender, RoutedEventArgs e)
        {
            if (_mapPoints == null)
                _mapPoints = GenerateRandomPoints(25000);

            ClearGraphics();
            Button button = sender as Button;

            SymbolFont font = new SymbolFont
            {
                FontFamily = "Tahoma",
                FontSize = 8,
                FontStyle = SymbolFontStyle.Italic,
                FontWeight = SymbolFontWeight.Bold,
                TextDecoration = SymbolTextDecoration.Underline
            };

            List<Graphic> graphics = new List<Graphic>();

            switch (button.Name)
            {
                case "Button1":
                    for (int i = 0; i < _mapPoints.Length; i++)
                    {
                        MyGraphicsLayer.Graphics.Add(new Graphic
                        {
                            Geometry = _mapPoints[i], 
                            Symbol = new TextSymbol
                            {
                                Text = i.ToString(CultureInfo.InvariantCulture)
                            }
                        });
                    }
                    break;
                case "Button2":
                    graphics.AddRange(_mapPoints.Select((t, i) => new Graphic
                    {
                        Geometry = t,
                        Symbol = new TextSymbol {Text = i.ToString(CultureInfo.InvariantCulture)}
                    }));

                    MyGraphicsLayer.GraphicsSource = graphics;
                    break;
                case "Button3":
                    ClearGraphics();
                    return;
                case "Button4":
                    for (int i = 0; i < _mapPoints.Length; i++)
                    {
                        MyGraphicsLayer.Graphics.Add(new Graphic
                        {
                            Geometry = _mapPoints[i],
                            Symbol = new TextSymbol
                            {
                                Text = i.ToString(CultureInfo.InvariantCulture),
                                Font = font,
                                Color = Colors.DarkGreen,
                                BorderLineColor = Colors.White,
                                BorderLineSize = 1,
                                BackgroundColor = Colors.Red
                            }
                        });
                    }
                    break;
                case "Button5":
                    graphics.AddRange(_mapPoints.Select((t, i) => new Graphic
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
                    MyGraphicsLayer.GraphicsSource = graphics;
                    break;
            }
        }

        private MapPoint[] GenerateRandomPoints(int numberOfPoints)
        {
            List<MapPoint> mapPoints = new List<MapPoint>();

            int xmax = (int) MyMapView.ActualWidth;
            int ymax = (int) MyMapView.ActualHeight;

            Random random = new Random();
            for (int i = 0; i < numberOfPoints; i++)
            {
                mapPoints.Add(MyMapView.ScreenToLocation(new Point(random.Next(0, xmax), random.Next(0, ymax))));
            }

            return mapPoints.ToArray();
        }

        private void ClearGraphics()
        {
            if (MyGraphicsLayer.GraphicsSource == null)
                MyGraphicsLayer.Graphics.Clear();
            else
                MyGraphicsLayer.GraphicsSource = null;
        }

        private void ToggleButton_OnChecked(object sender, RoutedEventArgs e)
        {
            _mapPoints = GenerateRandomPoints(int.Parse((sender as RadioButton).Content.ToString().Replace("K", "")) * 1000);
        }
    }
}
