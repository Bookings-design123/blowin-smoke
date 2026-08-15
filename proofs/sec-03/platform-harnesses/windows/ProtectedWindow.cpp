#define UNICODE
#define _UNICODE
#include <windows.h>

// SEC-03 synthetic capture harness only. This is not production code and
// contains no networking, accounts, commerce, credentials, or real data.
static const wchar_t CLASS_NAME[] = L"SEC03ProtectedWindow";

LRESULT CALLBACK WindowProc(HWND window, UINT message, WPARAM wParam, LPARAM lParam) {
    if (message == WM_PAINT) {
        PAINTSTRUCT paint;
        HDC dc = BeginPaint(window, &paint);
        const wchar_t text[] = L"PRIVATE WHOLESALE TEST\nSYNTHETIC PROTECTED CONTENT\nTEST PRICE / TEST IMAGE / TEST VIDEO / TEST MESSAGE";
        RECT area;
        GetClientRect(window, &area);
        DrawTextW(dc, text, -1, &area, DT_CENTER | DT_VCENTER | DT_WORDBREAK);
        EndPaint(window, &paint);
        return 0;
    }
    if (message == WM_DESTROY) {
        PostQuitMessage(0);
        return 0;
    }
    return DefWindowProcW(window, message, wParam, lParam);
}

int WINAPI wWinMain(HINSTANCE instance, HINSTANCE, PWSTR, int commandShow) {
    WNDCLASSW windowClass = {};
    windowClass.lpfnWndProc = WindowProc;
    windowClass.hInstance = instance;
    windowClass.lpszClassName = CLASS_NAME;
    RegisterClassW(&windowClass);

    HWND window = CreateWindowExW(0, CLASS_NAME, L"SEC-03 Proof Only", WS_OVERLAPPEDWINDOW,
                                  CW_USEDEFAULT, CW_USEDEFAULT, 900, 600,
                                  nullptr, nullptr, instance, nullptr);
    if (!window) return 10;

    // WDA_EXCLUDEFROMCAPTURE is supported beginning with Windows 10 version
    // 2004. A failed call is a hard harness failure, never silent fallback.
    if (!SetWindowDisplayAffinity(window, WDA_EXCLUDEFROMCAPTURE)) return 20;
    DWORD affinity = WDA_NONE;
    if (!GetWindowDisplayAffinity(window, &affinity)) return 21;
    if (affinity != WDA_EXCLUDEFROMCAPTURE) return 22;

    ShowWindow(window, commandShow);
    MSG message = {};
    while (GetMessageW(&message, nullptr, 0, 0) > 0) {
        TranslateMessage(&message);
        DispatchMessageW(&message);
    }
    return 0;
}
