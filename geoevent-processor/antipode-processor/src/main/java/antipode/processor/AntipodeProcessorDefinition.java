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

import com.esri.ges.processor.GeoEventProcessorDefinitionBase;

/**
 * Contains the processor metadata and the processor properties.
 * 
 * @author Brian Watson
 *
 **/
public class AntipodeProcessorDefinition extends GeoEventProcessorDefinitionBase {
	/**
	 * Null constructor for definition
	 */
	public AntipodeProcessorDefinition() {
	}

	/**
	 * Returns the name of the processor
	 * 
	 * @return the name of the processor
	 */
	@Override
	public String getName() {
		return "AntipodeProcessor";
	}

	/**
	 * Returns the domain of the processor
	 * 
	 * @return the name of the processor
	 */
	@Override
	public String getDomain() {
		return "antipode.processor";
	}

	/**
	 * Returns the version of the processor
	 * 
	 * @return the version of the processor
	 */
	@Override
	public String getVersion() {
		return "10.5.0";
	}

	/**
	 * Returns the label of the processor. Note: by using the
	 * ${myBundle-symbolic-name.myProperty} notation, the framework will attempt
	 * to replace the string with a localized string in your properties file.
	 * 
	 * @return the label of the processor
	 */
	@Override
	public String getLabel() {
		return "${sample.gep.antipode-processor.PROCESSOR_LABEL}";
	}

	/**
	 * Returns the label of the processor. Note: by using the
	 * ${myBundle-symbolic-name.myProperty} notation, the framework will attempt
	 * to replace the string with a localized string in your properties file.
	 * 
	 * @return the label of the processor
	 */
	@Override
	public String getDescription() {
		return "${sample.gep.antipode-processor.PROCESSOR_DESC}";
	}

	/**
	 * Returns contact information for this processor
	 * 
	 * @return contact information for this processor
	 */
	@Override
	public String getContactInfo() {
		return "yourname@yourcompany.com";
	}
}
