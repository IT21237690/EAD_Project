package com.example.e_commerceapp

import android.content.Intent
import android.os.Bundle
import android.provider.ContactsContract.CommonDataKinds.Email
import android.provider.ContactsContract.CommonDataKinds.SipAddress
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
//import com.example.myapp.network.RetrofitInstance
//import com.example.myapp.network.SignUpRequest
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class SignUp : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_sign_up)

        val emailEditText: EditText = findViewById(R.id.editTextTextEmailAddress)
        val passwordEditText: EditText = findViewById(R.id.editTextTextPassword)
        val usernameEditText: EditText = findViewById(R.id.editTextText)
        val addressEditText: EditText = findViewById(R.id.editTextTextPostalAddress)
        val signUpButton: Button = findViewById(R.id.LoginButtonLogIn)

        signUpButton.setOnClickListener{
            val email = emailEditText.text.toString()
            val password = passwordEditText.text.toString()
            val username = usernameEditText.text.toString()
            val address = addressEditText.text.toString()

            if (email.isNotEmpty() && password.isNotEmpty() && username.isNotEmpty() && address.isNotEmpty()) {
                signUpUser(email, password, username, address)
            }else{
                Toast.makeText(this, "Please fill in all fields", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun signUpUser(email: String, password: String, username: String, address: String) {
        val signUpRequest = SignUpRequest(
            email = email,
            Password = password,
            Name = username,
            Address = address
        )

        RetrofitInstance.api.signUp(signUpRequest).enqueue(object : Callback<SignUpResponse> {
            override fun onResponse(call: Call<SignUpResponse>, response: Response<SignUpResponse>) {
                if (response.isSuccessful) {
                    val signUpResponse = response.body()
                    Toast.makeText(this@SignUp, "Signup Successful", Toast.LENGTH_SHORT).show()
                    val intent = Intent(this@SignUp, LogIn::class.java)
                    startActivity(intent)
                    finish()
                } else {
                    Toast.makeText(this@SignUp, "Signup Failed: ${response.message()}", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<SignUpResponse>, t: Throwable) {
                Toast.makeText(this@SignUp, "Signup Failed: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }
}