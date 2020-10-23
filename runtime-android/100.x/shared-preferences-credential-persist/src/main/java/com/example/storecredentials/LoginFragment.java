package com.example.storecredentials;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.EditText;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

public class LoginFragment extends Fragment {
    private Button saveBtn, cancelBtn;
    private EditText uname, pswd;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.login_activity, container, false);

        uname = (EditText) view.findViewById(R.id.usernameInput);
        pswd = (EditText) view.findViewById(R.id.pswdInput);

        saveBtn = (Button) view.findViewById(R.id.saveBtn);
        saveBtn.setOnClickListener(v -> {
            String username = uname.getText().toString();
            String password = pswd.getText().toString();

            ((MainActivity)getActivity()).getCreds(username, password);
            // close the fragment
            ((MainActivity)getActivity()).closeLoginFragment();
        });

        cancelBtn = (Button) view.findViewById(R.id.cancelBtn);
        cancelBtn.setOnClickListener(v -> {
            // close the Fragment
            ((MainActivity)getActivity()).closeLoginFragment();

        });
        return view;
    }
}
