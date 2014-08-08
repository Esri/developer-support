using System;
using System.Collections.Generic;
using System.Text;
using System.IO;
using ESRI.ArcGIS.ArcMapUI;
using ESRI.ArcGIS.Carto;
using ESRI.ArcGIS.Geodatabase;
using ESRI.ArcGIS.Geometry;
using ESRI.ArcGIS.Display;

namespace ArcMapAddin_ChangeSelectionColor
{
    /// <summary>
    /// Overview: This code is a proof of concept for two things (1) How to interject in ArcGIS Drawing process and draw polygons on the screen (2) How make the selection color of polgon with fill symbol which don't overlap labels. 
    /// In ArcMap, there is a option to change the symbol of polygon selection but it overlaps labels because these selected polygons are drawn at GeoSelection stage which a over the top of labeling phase (esriViewGraphics).
    /// If one draws the fill symbol polygon at geogrphy phase they don't over lap labels. 
    /// 
    /// Caveats: This will lead to decrease in performance as with each selection, a partial refresh for geography phase is also required. There might be scope to optimize this process.
    /// 
    /// Author: Shriram Bhutada
    /// 
    /// Note: please note this is a proof of concept code and have to be used with utmost care because any developer error in active view events can lead to system crash as these events are fired after each user interaction.
    /// 
    /// </summary>
    public class ChangeSelectionColor : ESRI.ArcGIS.Desktop.AddIns.Extension
    {
        private IRgbColor m_Rgb; 
        public ChangeSelectionColor()
        {
        }

        protected override void OnStartup()
        {
            //
            // Extension start event - wiring open document and new document events
            //
             WireDocumentEvents();
             
        }

        private void WireDocumentEvents()
        {
            //
            // wiring open document and new document events
            //

     
            ArcMap.Events.NewDocument += delegate() { ArcMap_NewDocument(); };
            ArcMap.Events.OpenDocument += new ESRI.ArcGIS.ArcMapUI.IDocumentEvents_OpenDocumentEventHandler(Events_OpenDocument);
        
            ArcMap.Events.BeforeCloseDocument +=new IDocumentEvents_BeforeCloseDocumentEventHandler(Events_BeforeCloseDocument);
           

        }

        bool Events_BeforeCloseDocument()
        {
            m_MxDoc = (IMxDocument)ArcMap.Document;
            RemoveActiveViewEvents(m_MxDoc.FocusMap);

            return false;
        }
        private IMxDocument m_MxDoc = null;
        void Events_OpenDocument()
        {
             m_MxDoc = (IMxDocument)ArcMap.Document;
            SetupActiveViewEvents(m_MxDoc.FocusMap);
        }

        void ArcMap_NewDocument()
        {
          m_MxDoc = (IMxDocument)ArcMap.Document;
            SetupActiveViewEvents(m_MxDoc.FocusMap);
        }

   

        #region "ActiveEvents"
        private ESRI.ArcGIS.Carto.IActiveViewEvents_AfterDrawEventHandler m_ActiveViewEventsAfterDraw;

        /// <summary>
        /// Wiring active event after draw and selection change events
        /// </summary>
        /// <param name="map"></param>
        private void SetupActiveViewEvents(ESRI.ArcGIS.Carto.IMap map)
        {
            if (map == null)
            {
                return;

            }
            ESRI.ArcGIS.Carto.IActiveViewEvents_Event activeViewEvents = map as ESRI.ArcGIS.Carto.IActiveViewEvents_Event;
            // Create an instance of the delegate, add it to AfterDraw event
            m_ActiveViewEventsAfterDraw = new ESRI.ArcGIS.Carto.IActiveViewEvents_AfterDrawEventHandler(OnActiveViewEventsAfterDraw);
            activeViewEvents.AfterDraw += m_ActiveViewEventsAfterDraw;
            activeViewEvents.SelectionChanged += new IActiveViewEvents_SelectionChangedEventHandler(activeViewEvents_SelectionChanged);
        }

        void activeViewEvents_SelectionChanged()
        {

            ///loop through all feature layer and do a partial refresh if the layer is polygon
            ///This important as selection change only does a partial refresh at geoselection level and since we are drawing polygon at geography phase, this step is essential.
                IMap m_Map = m_MxDoc.FocusMap;
                ESRI.ArcGIS.esriSystem.UID m_UID = new ESRI.ArcGIS.esriSystem.UID();
                m_UID.Value = "{40A9E885-5533-11d0-98BE-00805F7CED21}";
                IEnumLayer m_EnumLayer = m_Map.Layers[m_UID];
                ILayer m_Layer = m_EnumLayer.Next();

           
                IActiveView m_activeview = (IActiveView)m_MxDoc.ActivatedView;  

                do
                {
                    if (m_Layer is IFeatureLayer)
                    {
                         if (m_Layer != null)
                         {
                             if (m_Layer.Visible == true)
                             {
                                 IFeatureSelection m_FeatureSelection = (IFeatureSelection)m_Layer;
                                 ISelectionSet m_SelSet = m_FeatureSelection.SelectionSet;



                                 if (m_SelSet.Count > 0)
                                 {
                                     IEnumGeometry m_EnumGeo;
                                     IEnumGeometryBind m_EnumGeoBind;

                                     m_EnumGeo = new EnumFeatureGeometry();
                                     m_EnumGeoBind = (IEnumGeometryBind)m_EnumGeo;
                                     m_EnumGeoBind.BindGeometrySource(null, m_SelSet);

                                     IGeometryFactory m_GeoFactory = new GeometryEnvironmentClass();
                                     IGeometry m_GeoEnvelop = m_GeoFactory.CreateGeometryFromEnumerator(m_EnumGeo);
                                     m_activeview.PartialRefresh(esriViewDrawPhase.esriViewGeography, null, m_GeoEnvelop.Envelope);

                                 }
                                 else
                                 {
                                     m_activeview.PartialRefresh(esriViewDrawPhase.esriViewGeography, null, null);
                                 }

                             }
                    }
                    }
                   m_Layer = m_EnumLayer.Next();
                } while (m_Layer != null);


            
        }

        private void RemoveActiveViewEvents(ESRI.ArcGIS.Carto.IMap map)
        {

            //parameter check
            if (map == null)
            {
                return;

            }
            ESRI.ArcGIS.Carto.IActiveViewEvents_Event activeViewEvents = map as ESRI.ArcGIS.Carto.IActiveViewEvents_Event;

            // Remove AfterDraw Event Handler
            activeViewEvents.AfterDraw -= m_ActiveViewEventsAfterDraw;

        }
      

        private void OnActiveViewEventsAfterDraw(ESRI.ArcGIS.Display.IDisplay display, ESRI.ArcGIS.Carto.esriViewDrawPhase phase)
        {

            ESRI.ArcGIS.Carto.esriViewDrawPhase m_phase = phase;

            //if the drawing pahse geography, find all feature layer and selected feature and draw them on screen if they are polygons. Please note don't call   display::StartDrawing as it is already started by the system.
            if (m_phase == ESRI.ArcGIS.Carto.esriViewDrawPhase.esriViewGeography)
            {
               
                IMap m_Map = m_MxDoc.FocusMap;
                ESRI.ArcGIS.esriSystem.UID m_UID = new ESRI.ArcGIS.esriSystem.UID();
                m_UID.Value = "{40A9E885-5533-11d0-98BE-00805F7CED21}";
                IEnumLayer m_EnumLayer = m_Map.Layers[m_UID];
                ILayer m_Layer = m_EnumLayer.Next();

                //if you want to change the selection color you can change it here.
                ISimpleFillSymbol m_FillSymbol = new SimpleFillSymbol();
                m_Rgb = new RgbColor();
                m_Rgb.Red = 255;
                m_FillSymbol.Color = m_Rgb;
                display.SetSymbol(m_FillSymbol as ISymbol);

                do
                {
                    if (m_Layer is IFeatureLayer)
                    {
                         if (m_Layer != null)
                         {
                        IFeatureSelection m_FeatureSelection = (IFeatureSelection)m_Layer;
                        ISelectionSet m_SelSet = m_FeatureSelection.SelectionSet;
                        IFeatureCursor m_FeatCur;
                        ICursor m_Cursor;
                        m_SelSet.Search(null, false, out m_Cursor);

                        m_FeatCur = (IFeatureCursor) m_Cursor;
                        IFeature m_Feature;

                        m_Feature = m_FeatCur.NextFeature();

                        do
                        {
                            if (m_Feature != null)
                            {
                                if (m_Feature.Shape is IPolygon)
                                {
                                    display.DrawPolygon(m_Feature.Shape);
                                }
                            }
                            m_Feature = m_FeatCur.NextFeature();
                        } while (m_Feature != null);



                    }
                    }
                   m_Layer = m_EnumLayer.Next();
                } while (m_Layer != null);


            }
        #endregion
        }


    }      

}
