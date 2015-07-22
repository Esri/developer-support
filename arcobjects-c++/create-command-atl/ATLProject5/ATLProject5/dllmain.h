// dllmain.h : Declaration of module class.

class CATLProject5Module : public ATL::CAtlDllModuleT< CATLProject5Module >
{
public :
	DECLARE_LIBID(LIBID_ATLProject5Lib)
	DECLARE_REGISTRY_APPID_RESOURCEID(IDR_ATLPROJECT5, "{089A758C-1067-45ED-9D25-BB5971D489F1}")
};

extern class CATLProject5Module _AtlModule;
