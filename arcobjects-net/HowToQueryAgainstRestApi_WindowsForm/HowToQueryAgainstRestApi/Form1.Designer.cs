namespace HowToQueryAgainstRestApi
{
    partial class Form1
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.label1 = new System.Windows.Forms.Label();
            this.popNumericUpDown = new System.Windows.Forms.NumericUpDown();
            this.requestButton = new System.Windows.Forms.Button();
            this.dataGridView = new System.Windows.Forms.DataGridView();
            ((System.ComponentModel.ISupportInitialize)(this.popNumericUpDown)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.dataGridView)).BeginInit();
            this.SuspendLayout();
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(198, 25);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(134, 25);
            this.label1.TabIndex = 0;
            this.label1.Text = "POP2000 >=";
            // 
            // popNumericUpDown
            // 
            this.popNumericUpDown.Increment = new decimal(new int[] {
            25000,
            0,
            0,
            0});
            this.popNumericUpDown.Location = new System.Drawing.Point(338, 23);
            this.popNumericUpDown.Maximum = new decimal(new int[] {
            500000000,
            0,
            0,
            0});
            this.popNumericUpDown.Minimum = new decimal(new int[] {
            500000,
            0,
            0,
            0});
            this.popNumericUpDown.Name = "popNumericUpDown";
            this.popNumericUpDown.Size = new System.Drawing.Size(183, 31);
            this.popNumericUpDown.TabIndex = 1;
            this.popNumericUpDown.Value = new decimal(new int[] {
            500000,
            0,
            0,
            0});
            // 
            // requestButton
            // 
            this.requestButton.Location = new System.Drawing.Point(527, 12);
            this.requestButton.Name = "requestButton";
            this.requestButton.Size = new System.Drawing.Size(250, 50);
            this.requestButton.TabIndex = 2;
            this.requestButton.Text = "Submit Request";
            this.requestButton.UseVisualStyleBackColor = true;
            this.requestButton.Click += new System.EventHandler(this.requestButton_Click);
            // 
            // dataGridView
            // 
            this.dataGridView.AllowUserToAddRows = false;
            this.dataGridView.AllowUserToDeleteRows = false;
            this.dataGridView.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.dataGridView.Location = new System.Drawing.Point(12, 72);
            this.dataGridView.Name = "dataGridView";
            this.dataGridView.ReadOnly = true;
            this.dataGridView.RowTemplate.Height = 33;
            this.dataGridView.Size = new System.Drawing.Size(950, 345);
            this.dataGridView.TabIndex = 3;
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(12F, 25F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(974, 429);
            this.Controls.Add(this.dataGridView);
            this.Controls.Add(this.requestButton);
            this.Controls.Add(this.popNumericUpDown);
            this.Controls.Add(this.label1);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedToolWindow;
            this.Name = "Form1";
            this.Text = "Query Feature Service Example";
            ((System.ComponentModel.ISupportInitialize)(this.popNumericUpDown)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.dataGridView)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.NumericUpDown popNumericUpDown;
        private System.Windows.Forms.Button requestButton;
        private System.Windows.Forms.DataGridView dataGridView;
    }
}

