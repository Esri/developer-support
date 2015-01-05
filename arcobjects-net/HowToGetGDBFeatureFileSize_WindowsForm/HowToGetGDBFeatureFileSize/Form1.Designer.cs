namespace HowToGetGDBFeatureFileSize
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
            this.openFeatureButton = new System.Windows.Forms.Button();
            this.label1 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.featClassTextBox = new System.Windows.Forms.TextBox();
            this.fileSizeGxTextBox = new System.Windows.Forms.TextBox();
            this.fileSizeDiskTextBox = new System.Windows.Forms.TextBox();
            this.SuspendLayout();
            // 
            // openFeatureButton
            // 
            this.openFeatureButton.Font = new System.Drawing.Font("Microsoft Sans Serif", 14F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.openFeatureButton.Location = new System.Drawing.Point(12, 12);
            this.openFeatureButton.Name = "openFeatureButton";
            this.openFeatureButton.Size = new System.Drawing.Size(396, 352);
            this.openFeatureButton.TabIndex = 0;
            this.openFeatureButton.Text = "Select File GDB Feature Class";
            this.openFeatureButton.UseVisualStyleBackColor = true;
            this.openFeatureButton.Click += new System.EventHandler(this.openFeatureButton_Click);
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Font = new System.Drawing.Font("Microsoft Sans Serif", 14F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label1.Location = new System.Drawing.Point(419, 26);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(212, 44);
            this.label1.TabIndex = 1;
            this.label1.Text = "Feat Class:";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Font = new System.Drawing.Font("Microsoft Sans Serif", 14F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label2.Location = new System.Drawing.Point(419, 144);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(383, 44);
            this.label2.TabIndex = 2;
            this.label2.Text = "File Size (IGxObject):";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Font = new System.Drawing.Font("Microsoft Sans Serif", 14F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.label3.Location = new System.Drawing.Point(419, 265);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(287, 44);
            this.label3.TabIndex = 3;
            this.label3.Text = "File Size (Disk):";
            // 
            // featClassTextBox
            // 
            this.featClassTextBox.Font = new System.Drawing.Font("Microsoft Sans Serif", 14F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.featClassTextBox.Location = new System.Drawing.Point(427, 70);
            this.featClassTextBox.Name = "featClassTextBox";
            this.featClassTextBox.ReadOnly = true;
            this.featClassTextBox.Size = new System.Drawing.Size(475, 50);
            this.featClassTextBox.TabIndex = 4;
            // 
            // fileSizeGxTextBox
            // 
            this.fileSizeGxTextBox.Font = new System.Drawing.Font("Microsoft Sans Serif", 14F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.fileSizeGxTextBox.Location = new System.Drawing.Point(427, 192);
            this.fileSizeGxTextBox.Name = "fileSizeGxTextBox";
            this.fileSizeGxTextBox.ReadOnly = true;
            this.fileSizeGxTextBox.Size = new System.Drawing.Size(475, 50);
            this.fileSizeGxTextBox.TabIndex = 5;
            // 
            // fileSizeDiskTextBox
            // 
            this.fileSizeDiskTextBox.Font = new System.Drawing.Font("Microsoft Sans Serif", 14F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.fileSizeDiskTextBox.Location = new System.Drawing.Point(430, 314);
            this.fileSizeDiskTextBox.Name = "fileSizeDiskTextBox";
            this.fileSizeDiskTextBox.ReadOnly = true;
            this.fileSizeDiskTextBox.Size = new System.Drawing.Size(472, 50);
            this.fileSizeDiskTextBox.TabIndex = 6;
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(12F, 25F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(922, 382);
            this.Controls.Add(this.fileSizeDiskTextBox);
            this.Controls.Add(this.fileSizeGxTextBox);
            this.Controls.Add(this.featClassTextBox);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.openFeatureButton);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedToolWindow;
            this.Name = "Form1";
            this.Text = "Form1";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button openFeatureButton;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.TextBox featClassTextBox;
        private System.Windows.Forms.TextBox fileSizeGxTextBox;
        private System.Windows.Forms.TextBox fileSizeDiskTextBox;
    }
}

