package com.example.e_commerceapp
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity

class RateVendorActivity : AppCompatActivity() {

    private val viewModel: VendorRatingViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_rate_vendor)

        val vendorNameEditText: EditText = findViewById(R.id.vendorName)
        val vendorRatingEditText: EditText = findViewById(R.id.vendorRating)
        val vendorCommentEditText: EditText = findViewById(R.id.vendorComment)
        val submitButton: Button = findViewById(R.id.submitRating)

        // Retrieve the token (e.g., passed from previous activity or stored in shared preferences)
        val token = intent.getStringExtra("user_token")

        submitButton.setOnClickListener {
            val name = vendorNameEditText.text.toString()
            val rating = vendorRatingEditText.text.toString()
            val comment = vendorCommentEditText.text.toString()

            if (token != null && name.isNotBlank() && rating.isNotBlank() && comment.isNotBlank()) {
                // Call the ViewModel to submit the rating
                viewModel.rateVendor(token, name, rating, comment)
                Toast.makeText(this, "Rating submitted!", Toast.LENGTH_SHORT).show()
            } else {
                Toast.makeText(this, "Please fill in all fields", Toast.LENGTH_SHORT).show()
            }
        }
    }
}
