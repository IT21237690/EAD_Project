package com.example.e_commerceapp

import android.content.Intent
import android.os.Bundle
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import androidx.activity.OnBackPressedCallback

class UserProfile : AppCompatActivity() {

    private lateinit var userNameTextView: TextView
    private lateinit var userEmailTextView: TextView
    private lateinit var backImageView: ImageView
    private lateinit var editProfileButton: androidx.appcompat.widget.AppCompatButton
    private lateinit var deactivateLayout: LinearLayout

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_user_profile)

        userNameTextView = findViewById(R.id.UserName)
        userEmailTextView = findViewById(R.id.UserEmail)
        backImageView = findViewById(R.id.backImageView)
        editProfileButton = findViewById(R.id.edituserprofile)
        deactivateLayout = findViewById(R.id.deactivateLayout)

        backImageView.setOnClickListener {
            onBackPressedDispatcher.onBackPressed()  // Go back to the previous screen
        }

        // Retrieve the passed email
        val email = intent.getStringExtra("user_email")
        userEmailTextView.text = email

        if (email != null) {
            fetchUserData(email)
        } else {
            Toast.makeText(this, "No email provided", Toast.LENGTH_SHORT).show()
        }

        // On clicking Edit Profile, navigate to EditProfile.kt
        editProfileButton.setOnClickListener {
            val intent = Intent(this, EditProfile::class.java)
            intent.putExtra("user_email", email)
            startActivity(intent)
        }

        // Deactivate user functionality
        deactivateLayout.setOnClickListener {
            if (email != null) {
                deactivateUser(email)
            } else {
                Toast.makeText(this, "No email provided", Toast.LENGTH_SHORT).show()
            }
        }

    }

    private fun fetchUserData(email: String) {
        RetrofitInstance.api.getUserByEmail(email).enqueue(object : Callback<User> {
            override fun onResponse(call: Call<User>, response: Response<User>) {
                if (response.isSuccessful && response.body() != null) {
                    val user = response.body()
                    userNameTextView.text = user?.Name
                    userEmailTextView.text = user?.Email
                } else {
                    Toast.makeText(this@UserProfile, "Error fetching user data", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<User>, t: Throwable) {
                Toast.makeText(this@UserProfile, "Failed to connect", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun deactivateUser(email: String) {
        // API call to delete user by email
        RetrofitInstance.api.deleteUserByEmail(email).enqueue(object : Callback<Void> {
            override fun onResponse(call: Call<Void>, response: Response<Void>) {
                if (response.isSuccessful) {
                    Toast.makeText(this@UserProfile, "User Deactivated", Toast.LENGTH_SHORT).show()
                    // Navigate to MainActivity after successful deletion
                    val intent = Intent(this@UserProfile, MainActivity::class.java)
                    startActivity(intent)
                    finish()  // Close UserProfile activity
                } else {
                    Toast.makeText(this@UserProfile, "Error deactivating user", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<Void>, t: Throwable) {
                Toast.makeText(this@UserProfile, "Failed to connect", Toast.LENGTH_SHORT).show()
            }
        })
    }
}