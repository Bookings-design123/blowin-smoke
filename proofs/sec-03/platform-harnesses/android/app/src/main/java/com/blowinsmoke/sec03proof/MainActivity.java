package com.blowinsmoke.sec03proof;

import android.app.Activity;
import android.app.Dialog;
import android.os.Build;
import android.os.Bundle;
import android.view.Gravity;
import android.view.Window;
import android.view.WindowManager;
import android.widget.LinearLayout;
import android.widget.TextView;

/**
 * SEC-03 synthetic capture harness only. This is not a production client.
 * It deliberately contains no networking, accounts, commerce, or real data.
 */
public final class MainActivity extends Activity {
    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_SECURE);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            setRecentsScreenshotEnabled(false);
        }

        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setGravity(Gravity.CENTER);

        TextView title = syntheticText("PRIVATE WHOLESALE TEST");
        TextView body = syntheticText("SYNTHETIC PROTECTED CONTENT\nTEST PRICE\nTEST IMAGE\nTEST VIDEO\nTEST MESSAGE");
        title.setContentDescription("Private wholesale synthetic security test");
        body.setContentDescription("Synthetic protected text, image, video, and message test labels");
        layout.addView(title);
        layout.addView(body);
        setContentView(layout);

        // A dialog is included so the human test matrix can verify that every
        // separately owned Window receives the same secure flag.
        layout.setOnClickListener(view -> showProtectedDialog());
    }

    private TextView syntheticText(String value) {
        TextView view = new TextView(this);
        view.setText(value);
        view.setTextIsSelectable(false);
        view.setLongClickable(false);
        view.setPadding(48, 48, 48, 48);
        return view;
    }

    private void showProtectedDialog() {
        Dialog dialog = new Dialog(this);
        dialog.setContentView(syntheticText("SYNTHETIC PROTECTED DIALOG"));
        Window window = dialog.getWindow();
        if (window != null) window.addFlags(WindowManager.LayoutParams.FLAG_SECURE);
        dialog.show();
    }
}
