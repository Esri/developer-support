/*
 * Copyright (C) 2017 Esri
 * 
 * * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

package antipode.processor;

import com.esri.core.geometry.Geometry;
import com.esri.core.geometry.MapGeometry;
import com.esri.core.geometry.Point;
import com.esri.core.geometry.SpatialReference;
import com.esri.ges.core.component.ComponentException;
import com.esri.ges.core.geoevent.GeoEvent;
import com.esri.ges.core.property.Property;
import com.esri.ges.framework.i18n.BundleLogger;
import com.esri.ges.framework.i18n.BundleLoggerFactory;
import com.esri.ges.processor.GeoEventProcessorBase;
import com.esri.ges.processor.GeoEventProcessorDefinition;

/**
 * Defines the logic for the Antipode Processor GeoEvent Processor. Takes input
 * point geometry data that is in latitude and longitude and converts the point
 * geometry to the antipode, the direct opposite location on the Earth.
 * 
 * @author Brian Watson
 *
 */
public class AntipodeProcessor extends GeoEventProcessorBase {

	/**
	 * Initialize the i18n Bundle Logger
	 * 
	 * See {@link BundleLogger} for more info.
	 */
	private static final BundleLogger LOGGER = BundleLoggerFactory.getLogger(AntipodeProcessor.class);

	/**
	 * Constructs a processor with the given definition
	 * 
	 * @param definition
	 *            the GeoEvent definition
	 * @throws ComponentException
	 */
	public AntipodeProcessor(GeoEventProcessorDefinition definition) throws ComponentException {
		super(definition);
		geoEventMutator = true;
	}

	/**
	 * Processes the input GeoEvent and if the geometry is a point and a
	 * geographic coordinate system, flips the point so it is on the opposite
	 * side of the planet.
	 * 
	 * @param dataMessage
	 *            the GeoEvent to process
	 * @return the modified GeoEvent
	 */
	@Override
	public GeoEvent process(GeoEvent dataMessage) throws Exception {
		LOGGER.info("PROCESSING_MSG");

		if (dataMessage.getGeometry() == null)
			return dataMessage;

		MapGeometry mg = dataMessage.getGeometry();

		// checking for non GCS coordinate system so we don't calculate
		// incorrectly
		SpatialReference sr = mg.getSpatialReference();
		if (sr.getCoordinateSystemType() != SpatialReference.Type.Geographic) {
			LOGGER.info("GoeEvent Geometry not a Geographic Coordinate System");
			return dataMessage;
		}

		Geometry gm = mg.getGeometry();

		// check to make sure geometry is point
		if (gm.getType() != Geometry.Type.Point)
			return dataMessage;

		Point p = (Point) gm;

		double x = p.getX();
		double y = p.getY();

		// flip latitude
		y *= -1;

		// flip longitude
		if (x > 0) {
			x -= 180;
		} else {
			x += 180;
		}

		// set new x and y and MapGeometry
		p.setX(x);
		p.setY(y);
		mg.setGeometry(p);

		// set geometry on GeoEvent and return
		dataMessage.setGeometry(mg);
		return dataMessage;
	}

	/** {@inheritDoc} */
	@Override
	public String toString() {
		StringBuffer sb = new StringBuffer();
		sb.append(definition.getName());
		sb.append("/");
		sb.append(definition.getVersion());
		sb.append("[");
		for (Property p : getProperties()) {
			sb.append(p.getDefinition().getPropertyName());
			sb.append(":");
			sb.append(p.getValue());
			sb.append(" ");
		}
		sb.append("]");
		return sb.toString();
	}
}
