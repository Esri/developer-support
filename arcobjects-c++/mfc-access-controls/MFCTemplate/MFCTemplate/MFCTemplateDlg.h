
// MFCTemplateDlg.h : header file
//

#pragma once
#include "mapcontrol1.h"


// CMFCTemplateDlg dialog
class CMFCTemplateDlg : public CDialogEx
{
// Construction
public:
	CMFCTemplateDlg(CWnd* pParent = NULL);	// standard constructor

// Dialog Data
	enum { IDD = IDD_MFCTEMPLATE_DIALOG };

	protected:
	virtual void DoDataExchange(CDataExchange* pDX);	// DDX/DDV support


// Implementation
protected:
	HICON m_hIcon;

	// Generated message map functions
	virtual BOOL OnInitDialog();
	afx_msg void OnPaint();
	afx_msg HCURSOR OnQueryDragIcon();
	DECLARE_MESSAGE_MAP()
public:
	CMapcontrol1 m_mapcontrol;
	afx_msg void OnBnClickedOk();
};
