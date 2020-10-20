package com.example.storecredentials;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;

import androidx.appcompat.app.AppCompatActivity;

public class LoginActivity extends AppCompatActivity {
    private Button saveBtn, cancelBtn;
    private EditText uname, pswd;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.login_activity);

        uname = findViewById(R.id.usernameInput);
        pswd = findViewById(R.id.pswdInput);

        saveBtn = findViewById(R.id.saveBtn);
        saveBtn.setOnClickListener(v -> {
            String username = uname.getText().toString();
            String password = pswd.getText().toString();

            Intent intent = new Intent(this, MainActivity.class);
            intent.putExtra("uname", username);
            intent.putExtra("pwd", password);
            startActivity(intent);
        });

        cancelBtn = findViewById(R.id.cancelBtn);
        cancelBtn.setOnClickListener(v -> {
            Intent intent = new Intent(this, MainActivity.class);
            startActivity(intent);
        });
    }
}
