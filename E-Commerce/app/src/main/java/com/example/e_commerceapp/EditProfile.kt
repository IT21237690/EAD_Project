package com.example.e_commerceapp

import android.content.Intent
import android.os.Bundle
import android.widget.EditText
import android.widget.ImageView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.AppCompatButton
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class EditProfile : AppCompatActivity() {

    private lateinit var editUserName: EditText
    private lateinit var editEmail: EditText
    private lateinit var editRole: EditText
    private lateinit var editAddress: EditText
    private lateinit var editDateAndTime: EditText
    private lateinit var editButton: AppCompatButton
    private var password: String? = null // To hold the password from API
    private lateinit var backImageView: ImageView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_edit_profile)

        editUserName = findViewById(R.id.editUserName)
        editEmail = findViewById(R.id.editEmail)
        editRole = findViewById(R.id.editRole)
        editAddress = findViewById(R.id.editAddress)
        editDateAndTime = findViewById(R.id.editDateandTime)
        editButton = findViewById(R.id.EditButton)
        backImageView = findViewById(R.id.backImageView)

        backImageView.setOnClickListener {
            onBackPressedDispatcher.onBackPressed()  // Go back to the previous screen
        }


        val email = intent.getStringExtra("user_email")

        // Make fields non-editable except UserName and Address
        editEmail.isEnabled = false
        editRole.isEnabled = false
        editDateAndTime.isEnabled = false

        // Fetch user data using email
        if (email != null) {
            fetchUserData(email)
        }

        // Handle button click for updating the profile
        editButton.setOnClickListener {
            if (email != null) {
                val user = User(
                    Email = editEmail.text.toString(),
                    Password = password ?: "",
                    Name = editUserName.text.toString(),
                    Role = editRole.text.toString(),
                    Address = editAddress.text.toString(),
                    CreatedDate = editDateAndTime.text.toString()
                )
                updateUserProfile(email, user)
            }
        }

    }

    private fun fetchUserData(email: String) {
        RetrofitInstance.api.getUserByEmail(email).enqueue(object : Callback<User> {
            override fun onResponse(call: Call<User>, response: Response<User>) {
                if (response.isSuccessful && response.body() != null) {
                    val user = response.body()
                    editUserName.setText(user?.Name)
                    editEmail.setText(user?.Email)
                    editRole.setText(user?.Role)
                    editAddress.setText(user?.Address)
                    editDateAndTime.setText(user?.CreatedDate)
                    password = user?.Password // Store the password
                } else {
                    Toast.makeText(this@EditProfile, "Error fetching user data", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<User>, t: Throwable) {
                Toast.makeText(this@EditProfile, "Failed to connect", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun updateUserProfile(email: String, user: User) {
        RetrofitInstance.api.updateUserByEmail(email, user).enqueue(object : Callback<Void> {
            override fun onResponse(call: Call<Void>, response: Response<Void>) {
                if (response.isSuccessful) {
                    Toast.makeText(this@EditProfile, "Profile updated successfully", Toast.LENGTH_SHORT).show()
                    // Navigate back to UserProfile
                    val intent = Intent(this@EditProfile, UserProfile::class.java)
                    intent.putExtra("user_email", user.Email)
                    startActivity(intent)
                } else {
                    Toast.makeText(this@EditProfile, "Error updating profile", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<Void>, t: Throwable) {
                Toast.makeText(this@EditProfile, "Failed to update", Toast.LENGTH_SHORT).show()
            }
        })
    }

}