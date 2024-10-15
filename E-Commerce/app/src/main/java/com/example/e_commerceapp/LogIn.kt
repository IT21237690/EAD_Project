package com.example.e_commerceapp

import android.annotation.SuppressLint
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class LogIn : AppCompatActivity() {

    private lateinit var emailEditText: EditText
    private lateinit var passwordEditText: EditText
    private lateinit var loginButton: Button

    @SuppressLint("MissingInflatedId")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_log_in)

        emailEditText = findViewById(R.id.editTextTextEmailAddress)
        passwordEditText = findViewById(R.id.editTextTextPassword)
        loginButton = findViewById(R.id.SignUpButtonSignUp)

        loginButton.setOnClickListener {
            val email = emailEditText.text.toString().trim()
            val password = passwordEditText.text.toString().trim()

            if (email.isNotEmpty() && password.isNotEmpty()) {
                loginUser(email, password)
            } else {
                Toast.makeText(this, "Please enter email and password", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun loginUser(email: String, password: String) {
        val loginRequest = loginRequest(email, password)

        RetrofitInstance.api.login(loginRequest).enqueue(object : Callback<LoginResponse> {
            override fun onResponse(call: Call<LoginResponse>, response: Response<LoginResponse>) {
                if (response.isSuccessful && response.body() != null) {
                    val loginResponse = response.body()

                    // Check if the token is received
                    if (loginResponse?.Token != null) {
                        // Save the token in SharedPreferences
                        saveToken(loginResponse.Token)

                        Toast.makeText(this@LogIn, "Login successful!", Toast.LENGTH_SHORT).show()

                        // Navigate to HomePage
                        val intent = Intent(this@LogIn, HomePage::class.java)
                        intent.putExtra("user_email", email)  // Pass the user's email
                        startActivity(intent)
                        finish()
                    } else {
                        // Log the error if token is null
                        Log.e("LoginActivity", "Login failed, no token received")
                        Toast.makeText(this@LogIn, "Error: No token received", Toast.LENGTH_SHORT).show()
                    }
                } else {
                    // Log the response body and error message
                    Log.e("LoginActivity", "Error: ${response.message()}")
                    Toast.makeText(this@LogIn, "Error: ${response.message()}", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<LoginResponse>, t: Throwable) {
                Log.e("LoginActivity", "Error logging in: ${t.message}")
                Toast.makeText(this@LogIn, "Failed to connect. Try again.", Toast.LENGTH_SHORT).show()
            }
        })
    }

    // Function to save the JWT token in SharedPreferences
    private fun saveToken(token: String?) {
        val sharedPreferences = getSharedPreferences("app_prefs", Context.MODE_PRIVATE)
        val editor = sharedPreferences.edit()
        editor.putString("jwt_token", token)
        editor.apply()
    }
}
