import java.awt.EventQueue;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

import javax.swing.JButton;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextField;

import com.esri.arcgis.catalog.GxFilterFeatureClasses;
import com.esri.arcgis.catalog.IEnumGxObject;
import com.esri.arcgis.catalog.IGxDataset;
import com.esri.arcgis.catalog.IGxDatasetProxy;
import com.esri.arcgis.catalog.IGxObjectProperties;
import com.esri.arcgis.catalog.IGxObjectPropertiesProxy;
import com.esri.arcgis.catalogUI.GxDialog;
import com.esri.arcgis.catalogUI.IGxDialog;
import com.esri.arcgis.system.EngineInitializer;

public class Form {

	private JFrame frame;
	private JTextField FileSizeDiskTextBox;
	private JTextField FileSizeGxTextBox;
	private JTextField FeatClassTextBox;

	void initializeArcGISLicenses() {
		try {
			com.esri.arcgis.system.AoInitialize ao = new com.esri.arcgis.system.AoInitialize();
			if (ao.isProductCodeAvailable(com.esri.arcgis.system.esriLicenseProductCode.esriLicenseProductCodeEngine) == com.esri.arcgis.system.esriLicenseStatus.esriLicenseAvailable)
				ao.initialize(com.esri.arcgis.system.esriLicenseProductCode.esriLicenseProductCodeEngine);
			else if (ao.isProductCodeAvailable(com.esri.arcgis.system.esriLicenseProductCode.esriLicenseProductCodeBasic) == com.esri.arcgis.system.esriLicenseStatus.esriLicenseAvailable)
				ao.initialize(com.esri.arcgis.system.esriLicenseProductCode.esriLicenseProductCodeBasic);
			else if (ao.isProductCodeAvailable(com.esri.arcgis.system.esriLicenseProductCode.esriLicenseProductCodeStandard) == com.esri.arcgis.system.esriLicenseStatus.esriLicenseAvailable)
				ao.initialize(com.esri.arcgis.system.esriLicenseProductCode.esriLicenseProductCodeStandard);
			else if (ao.isProductCodeAvailable(com.esri.arcgis.system.esriLicenseProductCode.esriLicenseProductCodeAdvanced) == com.esri.arcgis.system.esriLicenseStatus.esriLicenseAvailable)
				ao.initialize(com.esri.arcgis.system.esriLicenseProductCode.esriLicenseProductCodeAdvanced);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * Launch the application.
	 */
	public static void main(String[] args) {

		EventQueue.invokeLater(new Runnable() {
			public void run() {
				try {
					Form window = new Form();
					window.frame.setVisible(true);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		});
	}
	private static double ConversionFactor = 9.765481111611345;

	/**
	 * Create the application.
	 */
	public Form() {
		initialize();
		EngineInitializer.initializeEngine();
		initializeArcGISLicenses();
	}

	private void FindGeodatabaseFeatureSize()
	{
		try {

			IGxDialog gxDialog = new GxDialog();
			gxDialog.setAllowMultiSelect(false);
			gxDialog.setTitle("Sekect Feature Class to Determine File Size");
			gxDialog.setObjectFilterByRef(new GxFilterFeatureClasses());


			IEnumGxObject[] gxObjects = new IEnumGxObject[1];
			gxDialog.doModalOpen(0, gxObjects);

			gxObjects[0].reset();
			IGxDataset gxDataset = new IGxDatasetProxy(gxObjects[0].next());
			IGxObjectProperties gxProps = new IGxObjectPropertiesProxy(gxDataset);

			FeatClassTextBox.setText(gxDataset.getDatasetName().getName());
			FileSizeGxTextBox.setText(gxProps.getProperty("ESRI_GxObject_FileSize").toString());

			double kb = Double.parseDouble(FileSizeGxTextBox.getText())*ConversionFactor/10/1024.0;

			String size = "";
			int count = 0;

			while (kb >= 1024.0)
			{
				kb = ConvertKBToSizeString(kb);
				count++;
			}


			if(count == 0)
			{
				size = Math.round(kb) + " KB";
			}
			else if(count == 1)
			{
				size = Math.round(kb) + " MB";
			}
			else if(count == 2)
			{
				size = Math.round(kb) + " GB";
			}
			else if(count == 3)
			{
				size = Math.round(kb) + " TB";
			}

			FileSizeDiskTextBox.setText(size);

		} catch (Exception e1) {
			// TODO Auto-generated catch block
			System.out.println(e1.getMessage());
		}
	}

	private static double ConvertKBToSizeString(double kb)
	{
		return kb/1024.0;
	}

	/**
	 * Initialize the contents of the frame.
	 */
	private void initialize() {

		frame = new JFrame();
		frame.setBounds(100, 100, 261, 299);
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		frame.getContentPane().setLayout(null);

		JPanel panel = new JPanel();
		panel.setBounds(0, 0, 245, 261);
		frame.getContentPane().add(panel);
		panel.setLayout(null);

		FeatClassTextBox = new JTextField();
		FeatClassTextBox.setBounds(36, 58, 164, 20);
		panel.add(FeatClassTextBox);
		FeatClassTextBox.setColumns(10);

		FileSizeGxTextBox = new JTextField();
		FileSizeGxTextBox.setBounds(36, 107, 164, 20);
		panel.add(FileSizeGxTextBox);
		FileSizeGxTextBox.setColumns(10);

		FileSizeDiskTextBox = new JTextField();
		FileSizeDiskTextBox.setBounds(36, 155, 164, 20);
		panel.add(FileSizeDiskTextBox);
		FileSizeDiskTextBox.setColumns(10);

		JLabel lblFeatureClass = new JLabel("Feature Class");
		lblFeatureClass.setBounds(36, 42, 107, 14);
		panel.add(lblFeatureClass);

		JLabel lblFileSizeGx = new JLabel("File Size Gx");
		lblFileSizeGx.setBounds(36, 89, 107, 14);
		panel.add(lblFileSizeGx);

		JLabel lblFileSizeOn = new JLabel("File Size On Disk");
		lblFileSizeOn.setBounds(36, 140, 107, 14);
		panel.add(lblFileSizeOn);

		JButton openFeatureButton = new JButton("Open Feature Class");
		openFeatureButton.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				FindGeodatabaseFeatureSize();
			}
		});
		openFeatureButton.setBounds(36, 186, 164, 23);
		panel.add(openFeatureButton);
	}
}
